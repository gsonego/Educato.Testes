const { faker } = require('./faker');
const { Turno, FormaAvaliacao } = require('./enums');
const { ANO_LETIVO_ATUAL } = require('./config');

const CORES = [
  '#EF4444',
  '#3B82F6',
  '#22C55E',
  '#F59E0B',
  '#A855F7',
  '#EC4899',
  '#06B6D4',
  '#84CC16',
  '#F97316',
  '#64748B',
  '#0EA5E9',
  '#D946EF',
  '#10B981',
  '#F43F5E',
];

// 1 turma por ano escolar (usa o local e a faixa horária correspondentes por índice).
async function seedTurmas(
  db,
  escolas,
  anosEscolaresPorEscola,
  locaisPorEscola,
  faixasPorEscola,
  modeloAvaliacaoPorEscola,
) {
  console.log('* Inserindo turmas...');

  const turmasPorEscola = new Map();

  for (const escola of escolas) {
    const anosEscolares = anosEscolaresPorEscola.get(escola.escolaId) ?? [];
    const locais = locaisPorEscola.get(escola.escolaId) ?? [];
    const faixas = faixasPorEscola.get(escola.escolaId) ?? [];
    const modeloAvaliacaoId =
      modeloAvaliacaoPorEscola.get(escola.escolaId) ?? null;
    const criadas = [];

    for (let index = 0; index < anosEscolares.length; index++) {
      const anoEscolar = anosEscolares[index];
      const id = faker.string.uuid();
      const local = locais[index];
      const faixa = faixas[index % faixas.length];
      const turno =
        faixa.titulo === 'Vespertino' ? Turno.Vespertino : Turno.Matutino;

      const formaAvaliacao =
        anoEscolar.formaAvaliacao || FormaAvaliacao.Indefinido;

      const cor = CORES[index % CORES.length];
      const sigla = `${anoEscolar.sigla}A`;

      await db.run(
        `INSERT INTO Turma
          (Id, EscolaId, Ano, Sigla, AnoEscolarId, Turno, LocalPadraoId, FaixaHorarioId, Vagas, Cor, Inativo, FormaAvaliacao, ModeloAvaliacaoId)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)`,
        [
          id,
          escola.escolaId,
          ANO_LETIVO_ATUAL,
          sigla,
          anoEscolar.id,
          turno,
          local?.id ?? null,
          faixa?.id ?? null,
          30,
          cor,
          formaAvaliacao,
          modeloAvaliacaoId,
        ],
      );

      criadas.push({
        id,
        sigla,
        anoEscolarId: anoEscolar.id,
        escolaId: escola.escolaId,
      });
    }

    turmasPorEscola.set(escola.escolaId, criadas);
  }

  return turmasPorEscola;
}

module.exports = { seedTurmas };
