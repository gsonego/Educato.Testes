const { faker } = require('./faker');

const MENCOES = [
  {
    codigo: 'MB',
    titulo: 'Muito Bom',
    descricao: 'Domina plenamente as habilidades esperadas',
  },
  {
    codigo: 'B',
    titulo: 'Bom',
    descricao: 'Domina a maior parte das habilidades esperadas',
  },
  {
    codigo: 'R',
    titulo: 'Regular',
    descricao: 'Domina parcialmente as habilidades esperadas',
  },
  {
    codigo: 'I',
    titulo: 'Insuficiente',
    descricao: 'Não domina as habilidades esperadas',
  },
];

const OBJETIVOS = [
  'Leitura e interpretação de textos',
  'Produção textual',
  'Raciocínio lógico-matemático',
  'Resolução de problemas',
  'Participação e convivência em grupo',
];

// Só escolas com comModeloAvaliacao=true recebem modelo (recurso do plano Pro).
async function seedModeloAvaliacao(db, escolas) {
  console.log('* Inserindo modelos de avaliação...');

  const modeloAvaliacaoPorEscola = new Map();

  for (const escola of escolas) {
    if (!escola.comModeloAvaliacao) {
      modeloAvaliacaoPorEscola.set(escola.escolaId, null);
      continue;
    }

    const id = faker.string.uuid();

    await db.run(
      `INSERT INTO ModeloAvaliacao (Id, EscolaId, Nome, Descricao, Inativo, DataHoraCriacao)
       VALUES (?, ?, ?, ?, 0, UTC_TIMESTAMP())`,
      [
        id,
        escola.escolaId,
        'Avaliação por Conceito',
        'Modelo padrão de avaliação conceitual da escola',
      ],
    );

    for (const [ordem, mencao] of MENCOES.entries()) {
      await db.run(
        `INSERT INTO Mencao (Id, ModeloAvaliacaoId, Codigo, Titulo, Descricao, Ordem, Inativo)
         VALUES (?, ?, ?, ?, ?, ?, 0)`,
        [
          faker.string.uuid(),
          id,
          mencao.codigo,
          mencao.titulo,
          mencao.descricao,
          ordem,
        ],
      );
    }

    for (const [ordem, descricao] of OBJETIVOS.entries()) {
      await db.run(
        `INSERT INTO ObjetivoAprendizagem (Id, ModeloAvaliacaoId, ObjetivoPaiId, Descricao, Ordem, Inativo)
         VALUES (?, ?, NULL, ?, ?, 0)`,
        [faker.string.uuid(), id, descricao, ordem],
      );
    }

    modeloAvaliacaoPorEscola.set(escola.escolaId, id);
  }

  return modeloAvaliacaoPorEscola;
}

const DELIBERACOES_BASE = [
  { codigo: '1', descricao: 'Aprovado por média' },
  { codigo: '2', descricao: 'Aprovado pelo conselho de classe' },
  { codigo: '3', descricao: 'Retido por frequência' },
  { codigo: '4', descricao: 'Retido por nota' },
  { codigo: '5', descricao: 'Aprovado com dependência' },
  { codigo: '6', descricao: 'Progressão parcial' },
  { codigo: '7', descricao: 'Reclassificado' },
  { codigo: '8', descricao: 'Transferido no período letivo' },
];

async function seedDeliberacoes(db, escolas) {
  console.log('* Inserindo deliberações...');

  const deliberacoesPorEscola = new Map();

  for (const escola of escolas) {
    const lista = DELIBERACOES_BASE.slice(0, escola.numDeliberacoes);
    const criadas = [];

    for (const deliberacao of lista) {
      const id = faker.string.uuid();

      await db.run(
        `INSERT INTO Deliberacao (Id, EscolaId, Codigo, Descricao, Grupo)
         VALUES (?, ?, ?, ?, 0)`,
        [id, escola.escolaId, deliberacao.codigo, deliberacao.descricao],
      );

      criadas.push({ id, ...deliberacao, escolaId: escola.escolaId });
    }

    deliberacoesPorEscola.set(escola.escolaId, criadas);
  }

  return deliberacoesPorEscola;
}

module.exports = { seedModeloAvaliacao, seedDeliberacoes };
