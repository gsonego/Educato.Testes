const { faker } = require('./faker');
const { SituacaoAnoLetivo } = require('./enums');
const { ANO_LETIVO_ATUAL } = require('./config');

// 2 anos encerrados + ano atual (ativo) + próximo ano (planejamento).
const ANOS_LETIVOS = [
  { ano: ANO_LETIVO_ATUAL, situacao: SituacaoAnoLetivo.Ativo },
  { ano: ANO_LETIVO_ATUAL - 1, situacao: SituacaoAnoLetivo.Encerrado },
  { ano: ANO_LETIVO_ATUAL + 1, situacao: SituacaoAnoLetivo.Planejado },
  { ano: ANO_LETIVO_ATUAL - 2, situacao: SituacaoAnoLetivo.Encerrado },
];

async function seedAnosLetivos(db, escolas) {
  console.log('* Inserindo anos letivos...');

  for (const escola of escolas) {
    console.log(
      `  - Inserindo anos letivos para a escola ${escola.nomeFantasia}...`,
    );

    // Varre a lista de anos letivos de acordo
    // com a quantidade de anos letivos configurada para a escola.
    for (var i = 0; i < escola.qtdeAnosLetivos || 0; i++) {
      console.log(
        `    - Inserindo ano letivo ${ANOS_LETIVOS[i].ano} (${ANOS_LETIVOS[i].situacao})...`,
      );

      const id = faker.string.uuid();

      await db.run(
        `INSERT INTO AnoLetivo (Id, EscolaId, Ano, Situacao, DataHoraSituacao)
        VALUES (?, ?, ?, ?, UTC_TIMESTAMP())`,
        [id, escola.escolaId, ANOS_LETIVOS[i].ano, ANOS_LETIVOS[i].situacao],
      );
    }
  }
}

module.exports = { seedAnosLetivos };
