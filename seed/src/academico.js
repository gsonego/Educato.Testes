const { faker } = require('./faker');
const {
  TipoAvaliacao,
  EmissaoHistorico,
  ModoControlePresenca,
  FormaAvaliacao,
} = require('./enums');
const { CURSO_TEMPLATES, ANO_LETIVO_ATUAL } = require('./config');

async function seedCursos(db, escolas) {
  console.log('* Inserindo cursos...');

  const cursosPorEscola = new Map();

  for (const escola of escolas) {
    const criados = [];

    for (const [ordem, chave] of escola.cursos.entries()) {
      const template = CURSO_TEMPLATES[chave];
      const id = faker.string.uuid();

      await db.run(
        `INSERT INTO Curso
          (Id, EscolaId, Sigla, Titulo, TipoAvaliacao, QtdeSemanas, EmissaoHistorico, DuracaoAula, Inativo, ModoControlePresenca, Ordem)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)`,
        [
          id,
          escola.escolaId,
          template.sigla,
          template.titulo,
          TipoAvaliacao.Semestral,
          20,
          EmissaoHistorico.Sim,
          50,
          ModoControlePresenca.PresencaPorAula,
          ordem,
        ],
      );

      criados.push({
        id,
        sigla: template.sigla,
        titulo: template.titulo,
        anos: template.anos,
        escolaId: escola.escolaId,
      });
    }

    cursosPorEscola.set(escola.escolaId, criados);
  }

  return cursosPorEscola;
}

async function seedAnosEscolares(db, cursosPorEscola) {
  console.log('* Inserindo anos escolares...');

  const anosEscolaresPorEscola = new Map();

  for (const [escolaId, cursos] of cursosPorEscola) {
    const criados = [];

    for (const curso of cursos) {
      for (const [ordem, ano] of curso.anos.entries()) {
        const id = faker.string.uuid();

        await db.run(
          `INSERT INTO AnoEscolar (Id, Sigla, Titulo, Ordem, CursoId, AulasSemanais, CargaHoraria, FormaAvaliacaoPadrao)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            id,
            ano.sigla,
            ano.titulo,
            ordem,
            curso.id,
            25,
            800,
            FormaAvaliacao.Indefinido,
          ],
        );

        criados.push({
          id,
          sigla: ano.sigla,
          titulo: ano.titulo,
          cursoId: curso.id,
          cursoSigla: curso.sigla,
          escolaId,
        });
      }
    }

    anosEscolaresPorEscola.set(escolaId, criados);
  }

  return anosEscolaresPorEscola;
}

// 4 bimestres + Conceito Final (ConceitoFinal=1), cobrindo o ano letivo atual.
const BIMESTRES = [
  {
    sigla: '1o Bim',
    titulo: '1º Bimestre',
    inicio: `${ANO_LETIVO_ATUAL}-02-01`,
    termino: `${ANO_LETIVO_ATUAL}-04-15`,
    conceitoFinal: false,
  },
  {
    sigla: '2o Bim',
    titulo: '2º Bimestre',
    inicio: `${ANO_LETIVO_ATUAL}-04-16`,
    termino: `${ANO_LETIVO_ATUAL}-06-30`,
    conceitoFinal: false,
  },
  {
    sigla: '3o Bim',
    titulo: '3º Bimestre',
    inicio: `${ANO_LETIVO_ATUAL}-07-16`,
    termino: `${ANO_LETIVO_ATUAL}-09-15`,
    conceitoFinal: false,
  },
  {
    sigla: '4o Bim',
    titulo: '4º Bimestre',
    inicio: `${ANO_LETIVO_ATUAL}-09-16`,
    termino: `${ANO_LETIVO_ATUAL}-12-15`,
    conceitoFinal: false,
  },
  {
    sigla: 'Final',
    titulo: 'Conceito Final',
    inicio: `${ANO_LETIVO_ATUAL}-12-16`,
    termino: `${ANO_LETIVO_ATUAL}-12-20`,
    conceitoFinal: true,
  },
];

async function seedModulos(db, escolas) {
  console.log('* Inserindo módulos...');

  const modulosPorEscola = new Map();

  for (const escola of escolas) {
    const criados = [];

    for (const modulo of BIMESTRES) {
      const id = faker.string.uuid();

      await db.run(
        `INSERT INTO Modulo (Id, EscolaId, Ano, Sigla, Titulo, DataInicio, DataTermino, ConceitoFinal)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          escola.escolaId,
          ANO_LETIVO_ATUAL,
          modulo.sigla,
          modulo.titulo,
          modulo.inicio,
          modulo.termino,
          modulo.conceitoFinal ? 1 : 0,
        ],
      );

      criados.push({ id, ...modulo, escolaId: escola.escolaId });
    }

    modulosPorEscola.set(escola.escolaId, criados);
  }

  return modulosPorEscola;
}

module.exports = { seedCursos, seedAnosEscolares, seedModulos };
