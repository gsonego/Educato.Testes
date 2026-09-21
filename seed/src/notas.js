const { faker } = require('./faker');
const { FormaAvaliacao, OrigemFaltas } = require('./enums');
const { SENHA_PADRAO_SEED } = require('./usuarios');
const { PERFIS_AUTORIZADOS } = require('./tarjetas');
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

// Preenche notas e faltas (quando digitáveis) das turmas com preencherNotaFalta pelo
// endpoint da própria API (POST /Turmas/Notas). Reexecutar regrava os valores sem duplicar.
// Notas: inteiras ou com meio ponto entre 0 e 10 (regra da API). Só alunos ativos entram.
async function seedNotasViaApi(
  escolas,
  turmasPorEscola,
  disciplinasPorEscola,
  modulosPorEscola,
  matriculasPorTurma,
  usuariosPorEscola,
) {
  if (!api.temApiConfigurada()) {
    console.log(
      '* API de testes não configurada (API_BASE_URL ausente) -> pulando preenchimento de notas.',
    );
    return;
  }

  console.log('* Preenchendo notas via API de testes...');

  for (const escola of escolas) {
    const turmasDaEscola = turmasPorEscola.get(escola.escolaId) ?? [];
    const turmas = turmasDaEscola.filter(
      (t) => t.preencherNotaFalta && t.formaAvaliacao === FormaAvaliacao.Nota,
    );

    if (turmas.length === 0) {
      if (turmasDaEscola.some((t) => t.preencherNotaFalta)) {
        console.warn(
          `  - ${escola.nomeFantasia}: preencherNotaFalta marcado em ano de conceito (sem tarjeta).`,
        );
      }
      continue;
    }

    const usuarios = usuariosPorEscola.get(escola.escolaId) ?? [];
    const autorizado = usuarios
      .filter((u) => !u.inativo && PERFIS_AUTORIZADOS.includes(u.perfil))
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

    const disciplinas = disciplinasPorEscola.get(escola.escolaId) ?? [];
    const modulos = (modulosPorEscola.get(escola.escolaId) ?? []).filter(
      (m) => !m.conceitoFinal,
    );
    const origemFaltas = escola.origemFaltas ?? OrigemFaltas.Digitacao;

    for (const turma of turmas) {
      const matriculados = matriculasPorTurma.get(turma.id) ?? [];
      const ativos = matriculados.filter((m) => m.ativo);

      console.log(
        `  - Preenchendo notas da turma ${turma.sigla} (${ativos.length} alunos, ${disciplinas.length} disciplinas, ${modulos.length} módulos)...`,
      );

      for (const disciplina of disciplinas) {
        for (const modulo of modulos) {
          await api.registrarNotas(
            {
              turmaId: turma.id,
              disciplinaId: disciplina.id,
              moduloId: modulo.id,
              notas: ativos.map((m) => montarItemNota(origemFaltas, m.alunoId)),
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