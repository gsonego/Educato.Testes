const { faker } = require('./faker');
const {
  FormaAvaliacao,
  OrigemFaltas,
  SituacaoMatricula,
} = require('./enums');
const { ESCOLAS, CURSO_TEMPLATES, ANO_LETIVO_ATUAL } = require('./config');
const { SENHA_PADRAO_SEED } = require('./usuarios');
const { consulta } = require('./db');
const { usuariosAutorizadosPorEscola } = require('./tarjetas');
const api = require('./api');

const NOTAS_APROVADAS = [5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0, 9.5, 10.0];
const NOTAS_RECUPERACAO = [2.0, 2.5, 3.0, 3.5, 4.0, 4.5];
const PERCENTUAL_RECUPERACAO = 10;

function montarItemNota(origemFaltas, alunoId) {
  const emRecuperacao =
    faker.number.int({ min: 1, max: 100 }) <= PERCENTUAL_RECUPERACAO;

  const item = {
    alunoId,
    nota: faker.helpers.arrayElement(
      emRecuperacao ? NOTAS_RECUPERACAO : NOTAS_APROVADAS,
    ),
  };

  if (origemFaltas === OrigemFaltas.Digitacao) {
    const faltas = faker.number.int({ min: 0, max: 6 });
    item.faltas = faltas;

    if (faltas > 0 && faker.number.int({ min: 1, max: 100 }) <= 25) {
      item.faltasCompensadas = faker.number.int({ min: 1, max: faltas });
    }
  }

  return item;
}

// Quais anos de cada escola recebem nota/falta, derivados do CURSO_TEMPLATES — a MESMA fonte
// usada pelo seed de banco (única definição da regra; o banco só fornece os IDs concretos).
function anosPreencherPorEscola() {
  const porEscola = new Map();

  for (const escola of ESCOLAS) {
    const alvos = [];

    for (const chave of escola.cursos) {
      const template = CURSO_TEMPLATES[chave];

      for (const ano of template.anos) {
        if (!ano.preencherNotaFalta) continue;
        const formaAvaliacao = ano.formaAvaliacao || FormaAvaliacao.Nota;
        alvos.push({ sigla: ano.sigla, formaAvaliacao });
      }
    }

    if (alvos.length > 0) porEscola.set(escola.escolaId, alvos);
  }

  return porEscola;
}

async function turmaDoAno(escolaId, siglaAno) {
  const linhas = await consulta(
    `SELECT T.Id AS id, T.Sigla AS sigla
     FROM Turma T
     JOIN AnoEscolar AE ON AE.Id = T.AnoEscolarId
     WHERE T.EscolaId = ? AND T.Ano = ? AND AE.Sigla = ? AND T.Inativo = 0
     LIMIT 1`,
    [escolaId, ANO_LETIVO_ATUAL, siglaAno],
  );

  return linhas[0] ?? null;
}

async function alunosAtivosDaTurma(turmaId) {
  const linhas = await consulta(
    'SELECT AlunoId AS alunoId FROM Matricula WHERE TurmaId = ? AND Situacao = ?',
    [turmaId, SituacaoMatricula.Ativo],
  );

  return linhas.map((linha) => linha.alunoId);
}

// Preenche notas e faltas (quando digitáveis) das turmas com preencherNotaFalta pelo
// endpoint da própria API (POST /Turmas/Notas). Reexecutar regrava os valores sem duplicar.
// Notas: inteiras ou com meio ponto entre 0 e 10 (regra da API). Só alunos ativos entram.
// Só roda se houver tarjetas geradas no banco ("sem tarjetas, sem nota").
async function seedNotasViaApi(escolas = ESCOLAS) {
  if (!api.temApiConfigurada()) {
    console.log(
      '* API de testes não configurada (API_BASE_URL ausente) -> pulando preenchimento de notas.',
    );
    return;
  }

  const anosPorEscola = anosPreencherPorEscola();

  // O job de seed apaga todas as tarjetas a cada run, então qualquer linha presente só pode
  // ter sido gerada pela fase 2 (sem assumir o nome de coluna de ano em Tarjeta).
  const [{ total }] = await consulta('SELECT COUNT(*) AS total FROM Tarjeta');

  if (total === 0) {
    console.log(
      '* Nenhuma tarjeta gerada no banco para o ano atual -> pulando preenchimento de notas.',
    );
    return;
  }

  console.log('* Preenchendo notas via API de testes...');

  const usuariosAutorizados = await usuariosAutorizadosPorEscola();

  for (const escola of escolas) {
    const alvos = anosPorEscola.get(escola.escolaId) ?? [];
    const anosNota = alvos.filter(
      (alvo) => alvo.formaAvaliacao === FormaAvaliacao.Nota,
    );

    if (alvos.length > 0 && anosNota.length === 0) {
      console.warn(
        `  - ${escola.nomeFantasia}: preencherNotaFalta marcado em ano de conceito (sem tarjeta).`,
      );
      continue;
    }

    if (anosNota.length === 0) continue;

    const autorizado = (usuariosAutorizados.get(escola.escolaId) ?? [])
      .sort((a, b) => a.perfil - b.perfil)[0];

    if (!autorizado) {
      console.warn(
        `  - ${escola.nomeFantasia}: nenhum usuário com perfil para preencher notas.`,
      );
      continue;
    }

    console.log(
      `  - Autenticando ${autorizado.login} na escola ${escola.nomeFantasia}...`,
    );
    const token = await api.login(autorizado.login, SENHA_PADRAO_SEED);

    const disciplinas = (
      await consulta(
        'SELECT Id AS id FROM Disciplina WHERE EscolaId = ?',
        [escola.escolaId],
      )
    ).map((linha) => linha.id);

    const modulos = (
      await consulta(
        'SELECT Id AS id FROM Modulo WHERE EscolaId = ? AND Ano = ? AND ConceitoFinal = 0',
        [escola.escolaId, ANO_LETIVO_ATUAL],
      )
    ).map((linha) => linha.id);

    const origemFaltas = escola.origemFaltas ?? OrigemFaltas.Digitacao;

    for (const alvo of anosNota) {
      const turma = await turmaDoAno(escola.escolaId, alvo.sigla);

      if (!turma) {
        console.log(
          `  - Turma do ano ${alvo.sigla} de ${escola.nomeFantasia} não encontrada; pulando.`,
        );
        continue;
      }

      const alunosAtivos = await alunosAtivosDaTurma(turma.id);

      if (alunosAtivos.length === 0) {
        console.warn(
          `  - Turma ${turma.sigla} de ${escola.nomeFantasia} sem alunos ativos; pulando.`,
        );
        continue;
      }

      console.log(
        `  - Preenchendo notas da turma ${turma.sigla} (${alunosAtivos.length} alunos, ${disciplinas.length} disciplinas, ${modulos.length} módulos)...`,
      );

      for (const disciplinaId of disciplinas) {
        for (const moduloId of modulos) {
          await api.registrarNotas(
            {
              turmaId: turma.id,
              disciplinaId,
              moduloId,
              notas: alunosAtivos.map((alunoId) =>
                montarItemNota(origemFaltas, alunoId),
              ),
            },
            token,
          );
        }
      }

      console.log(`    -> Notas da turma ${turma.sigla} registradas.`);
    }
  }
}

module.exports = { seedNotasViaApi };