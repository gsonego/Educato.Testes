const { faker } = require('./faker');
const { Sexo, SituacaoMatricula } = require('./enums');
const { ANO_LETIVO_ATUAL } = require('./config');

const MIN_ALUNOS_POR_TURMA = 5;
const MAX_ALUNOS_POR_TURMA = 10;
const PERCENTUAL_MATRICULADO = 0.9;

function dataNascimentoParaTurma(indiceAnoEscolar) {
  // Idade aproximada cresce com o índice do ano escolar (0 = Berçário, ...).
  const idadeBase = 1 + indiceAnoEscolar;
  const ano = ANO_LETIVO_ATUAL - idadeBase;
  return faker.date.between({ from: `${ano}-01-01`, to: `${ano}-12-31` });
}

// 5 a 10 alunos por turma, com nomes e e-mails aleatórios (domínio sempre fictício).
async function seedAlunos(
  db,
  escolas,
  turmasPorEscola,
  anosEscolaresPorEscola,
) {
  console.log('* Inserindo alunos...');

  const alunosPorTurma = new Map();
  let alunoId = 1;
  let raSequencial = 1;

  for (const escola of escolas) {
    const turmas = turmasPorEscola.get(escola.escolaId) ?? [];

    for (let i = 0; i < turmas.length; i++) {
      const turma = turmas[i];
      const quantidade = faker.number.int({
        min: MIN_ALUNOS_POR_TURMA,
        max: MAX_ALUNOS_POR_TURMA,
      });
      const criados = [];

      for (let j = 0; j < quantidade; j++) {
        const id = alunoId++;
        const sexo = faker.helpers.arrayElement([
          Sexo.Masculino,
          Sexo.Feminino,
        ]);
        const nome = faker.person.fullName({
          sex: sexo === Sexo.Masculino ? 'male' : 'female',
        });
        const dataNascimento = dataNascimentoParaTurma(i);
        const ra = String(raSequencial++).padStart(6, '0');
        const emailBase = faker.internet
          .username()
          .toLowerCase()
          .replace(/[^a-z0-9._-]/g, '');
        const email = `${emailBase}.aluno${id}@example.test`;

        await db.run(
          `INSERT INTO Aluno (AlunoId, EscolaId, Nome, DataNascimento, RA, Sexo, Email, Inativo)
           VALUES (?, ?, ?, ?, ?, ?, ?, 0)`,
          [id, escola.escolaId, nome, dataNascimento, ra, sexo, email],
        );

        criados.push({ alunoId: id, nome, escolaId: escola.escolaId });
      }

      alunosPorTurma.set(turma.id, criados);
    }
  }

  return alunosPorTurma;
}

// Pelo menos 90% dos alunos de cada turma recebem matrícula ativa.
async function seedMatriculas(db, escolas, turmasPorEscola, alunosPorTurma) {
  console.log('* Inserindo matrículas...');

  const dataMatricula = `${ANO_LETIVO_ATUAL}-02-01`;

  for (const escola of escolas) {
    const turmas = turmasPorEscola.get(escola.escolaId) ?? [];

    for (const turma of turmas) {
      const alunos = alunosPorTurma.get(turma.id) ?? [];
      const quantidadeMatriculada = Math.ceil(
        alunos.length * PERCENTUAL_MATRICULADO,
      );

      for (let numero = 1; numero <= quantidadeMatriculada; numero++) {
        const aluno = alunos[numero - 1];
        const id = faker.string.uuid();

        await db.run(
          `INSERT INTO Matricula (Id, TurmaId, AlunoId, Numero, DataMatricula, Situacao, DataSituacao)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            id,
            turma.id,
            aluno.alunoId,
            numero,
            dataMatricula,
            SituacaoMatricula.Ativo,
            dataMatricula,
          ],
        );
      }
    }
  }
}

module.exports = { seedAlunos, seedMatriculas };
