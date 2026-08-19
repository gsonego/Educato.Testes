const { faker } = require('./faker');
const { DISCIPLINAS_BASE } = require('./config');

async function seedDisciplinas(db, escolas) {
  console.log('* Inserindo disciplinas...');

  const disciplinasPorEscola = new Map();

  for (const escola of escolas) {
    const lista = DISCIPLINAS_BASE.slice(0, escola.numDisciplinas);
    const criadas = [];

    for (const disciplina of lista) {
      const id = faker.string.uuid();

      await db.run(
        `INSERT INTO Disciplina (Id, EscolaId, Sigla, Titulo, Cor, Inativo)
         VALUES (?, ?, ?, ?, ?, 0)`,
        [
          id,
          escola.escolaId,
          disciplina.sigla,
          disciplina.titulo,
          disciplina.cor,
        ],
      );

      criadas.push({ id, ...disciplina, escolaId: escola.escolaId });
    }

    disciplinasPorEscola.set(escola.escolaId, criadas);
  }

  return disciplinasPorEscola;
}

module.exports = { seedDisciplinas };
