const { faker } = require('./faker');
const { Perfil } = require('./enums');

// Vincula todas as disciplinas da escola a cada turma, distribuindo os professores em round-robin.
async function seedTurmaDisciplinas(
  db,
  escolas,
  turmasPorEscola,
  disciplinasPorEscola,
  usuariosPorEscola,
) {
  console.log('* Inserindo vínculos turma-disciplina...');

  const turmaDisciplinasPorEscola = new Map();

  for (const escola of escolas) {
    const turmas = turmasPorEscola.get(escola.escolaId) ?? [];
    const disciplinas = disciplinasPorEscola.get(escola.escolaId) ?? [];
    const professores = (usuariosPorEscola.get(escola.escolaId) ?? []).filter(
      (u) => u.perfil === Perfil.Professor && !u.inativo,
    );
    const criadas = [];

    for (const turma of turmas) {
      for (let i = 0; i < disciplinas.length; i++) {
        const disciplina = disciplinas[i];
        const professor = professores[i % professores.length];
        const id = faker.string.uuid();
        const aulasSemanais = 2 + (i % 4);

        await db.run(
          `INSERT INTO TurmaDisciplina (Id, TurmaId, DisciplinaId, ProfessorId, AulasSemanais)
           VALUES (?, ?, ?, ?, ?)`,
          [id, turma.id, disciplina.id, professor.usuarioId, aulasSemanais],
        );

        criadas.push({
          id,
          turmaId: turma.id,
          disciplinaId: disciplina.id,
          professorId: professor.usuarioId,
        });
      }
    }

    turmaDisciplinasPorEscola.set(escola.escolaId, criadas);
  }

  return turmaDisciplinasPorEscola;
}

module.exports = { seedTurmaDisciplinas };
