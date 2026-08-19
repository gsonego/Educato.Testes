const { faker } = require('./faker');
const { SituacaoAnoLetivo } = require('./enums');
const { ANO_LETIVO_ATUAL } = require('./config');

// 2 anos encerrados + ano atual (ativo) + próximo ano (planejamento).
const ANOS_LETIVOS = [
  { ano: ANO_LETIVO_ATUAL - 2, situacao: SituacaoAnoLetivo.Encerrado },
  { ano: ANO_LETIVO_ATUAL - 1, situacao: SituacaoAnoLetivo.Encerrado },
  { ano: ANO_LETIVO_ATUAL, situacao: SituacaoAnoLetivo.Ativo },
  { ano: ANO_LETIVO_ATUAL + 1, situacao: SituacaoAnoLetivo.Planejado },
];

async function seedAnosLetivos(db, escolas) {
  console.log('* Inserindo anos letivos...');

  for (const escola of escolas) {
    for (const anoLetivo of ANOS_LETIVOS) {
      const id = faker.string.uuid();

      await db.run(
        `INSERT INTO AnoLetivo (Id, EscolaId, Ano, Situacao, DataHoraSituacao)
         VALUES (?, ?, ?, ?, UTC_TIMESTAMP())`,
        [id, escola.escolaId, anoLetivo.ano, anoLetivo.situacao],
      );
    }
  }
}

module.exports = { seedAnosLetivos };
