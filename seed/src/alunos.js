const { faker, gerarEndereco } = require('./faker');
const { Sexo, SituacaoMatricula, Parentesco } = require('./enums');
const { ANO_LETIVO_ATUAL, FOTOS_MENINOS, FOTOS_MENINAS } = require('./config');

const MIN_ALUNOS_POR_TURMA = 8;
const MAX_ALUNOS_POR_TURMA = 15;
const PERCENTUAL_TRANSFERIDOS = 0.1; // 10% dos alunos transferidos
const PERCENTUAL_SEM_TELEFONE = 0.15; // 15% dos responsáveis sem telefone cadastrado
const PERCENTUAL_SEM_EMAIL = 0.15; // 15% dos responsáveis sem e-mail cadastrado

// Segundo/terceiro responsável (além da mãe, sempre presente) sorteados sem repetir parentesco.
const OUTROS_PARENTESCOS = [Parentesco.Pai, Parentesco.Avo, Parentesco.Tia];

function dataNascimentoParaTurma(indiceAnoEscolar) {
  // Idade aproximada cresce com o índice do ano escolar (0 = Berçário, ...).
  const idadeBase = 1 + indiceAnoEscolar;
  const ano = ANO_LETIVO_ATUAL - idadeBase;
  return faker.date.between({ from: `${ano}-01-01`, to: `${ano}-12-31` });
}

// 5 a 10 alunos por turma, com nomes e e-mails aleatórios (domínio sempre fictício).
async function seedAlunos(db, escolas, turmasPorEscola) {
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

        const sexoStr = sexo === Sexo.Masculino ? 'male' : 'female';

        console.log(
          `  - Criando aluno ${id} (${sexoStr}) para a turma ${turma.sigla} da escola ${escola.nomeFantasia}...`,
        );

        const nome = faker.person.firstName(sexoStr);
        const sobrenome = faker.person.lastName(sexoStr);
        const nomeCompleto = `${nome} ${sobrenome}`;

        const dataNascimento = dataNascimentoParaTurma(i);

        const ra = String(raSequencial++).padStart(6, '0');

        const nacionalidade = 'Brasileiro';
        const naturalidade = faker.location.city();

        const { endereco, cidade, uf, cep } = gerarEndereco();

        const emailBase = faker.internet
          .username()
          .toLowerCase()
          .replace(/[^a-z0-9._-]/g, '');

        const email = `${emailBase}.aluno${id}@example.test`;

        // Escolhe foto de acordo com o sexo do aluno (fotos são fictícias).
        const foto = obterFotoAleatoria(sexo);

        await db.run(
          `INSERT INTO Aluno (AlunoId, EscolaId, Nome, DataNascimento, RA, Sexo, 
                       Naturalidade, Nacionalidade, Endereco, Cidade, UF, CEP, 
                       Email, Foto)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            id,
            escola.escolaId,
            nomeCompleto,
            dataNascimento,
            ra,
            sexo,
            nacionalidade,
            naturalidade,
            endereco,
            cidade,
            uf,
            cep,
            email,
            foto,
          ],
        );

        criados.push({
          alunoId: id,
          nome: nomeCompleto,
          sobrenome,
          escolaId: escola.escolaId,
        });
      }

      alunosPorTurma.set(turma.id, criados);
    }
  }

  return alunosPorTurma;
}

function obterFotoAleatoria(sexo) {
  const fotos = sexo === Sexo.Masculino ? FOTOS_MENINOS : FOTOS_MENINAS;
  return faker.helpers.arrayElement(fotos);
}

// Pelo menos 90% dos alunos de cada turma recebem matrícula ativa.
async function seedMatriculas(db, escolas, turmasPorEscola, alunosPorTurma) {
  console.log('* Inserindo matrículas...');

  const dataMatricula = `${ANO_LETIVO_ATUAL}-02-01`;

  for (const escola of escolas) {
    const turmas = turmasPorEscola.get(escola.escolaId) ?? [];

    for (const turma of turmas) {
      const alunos = alunosPorTurma.get(turma.id) ?? [];

      for (let numero = 1; numero <= alunos.length; numero++) {
        const aluno = alunos[numero - 1];
        const id = faker.string.uuid();

        const situacaoMatricula =
          Math.random() > PERCENTUAL_TRANSFERIDOS ? 1 : 2;

        await db.run(
          `INSERT INTO Matricula (Id, TurmaId, AlunoId, Numero, DataMatricula, Situacao, DataSituacao)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            id,
            turma.id,
            aluno.alunoId,
            numero,
            dataMatricula,
            situacaoMatricula == 1
              ? SituacaoMatricula.Ativo
              : SituacaoMatricula.Transferido,
            dataMatricula,
          ],
        );
      }
    }
  }
}

function sexoParaParentesco(parentesco) {
  return parentesco === Parentesco.Pai ? 'male' : 'female';
}

// De 1 a 3 responsáveis por aluno: sempre uma mãe, e opcionalmente pai/avó/tia sem repetir parentesco.
async function seedResponsaveis(db, alunosPorTurma) {
  console.log('* Inserindo responsáveis...');

  for (const alunos of alunosPorTurma.values()) {
    for (const aluno of alunos) {
      const quantidade = faker.number.int({ min: 1, max: 3 });
      const parentescos = [Parentesco.Mae];

      if (quantidade > 1) {
        parentescos.push(
          ...faker.helpers.arrayElements(OUTROS_PARENTESCOS, quantidade - 1),
        );
      }

      for (let indice = 0; indice < parentescos.length; indice++) {
        const parentesco = parentescos[indice];
        const sexoStr = sexoParaParentesco(parentesco);

        const nome = `${faker.person.firstName(sexoStr)} ${aluno.sobrenome}`;
        const ocupacao = faker.person.jobType();

        const telefone =
          Math.random() > PERCENTUAL_SEM_TELEFONE ? faker.phone.number() : null;

        const emailBase = faker.internet
          .username()
          .toLowerCase()
          .replace(/[^a-z0-9._-]/g, '');
        const email =
          Math.random() > PERCENTUAL_SEM_EMAIL
            ? `${emailBase}.responsavel${aluno.alunoId}${indice}@example.test`
            : null;

        console.log(
          `  - Criando responsável (parentesco ${parentesco}) do aluno ${aluno.alunoId}...`,
        );

        await db.run(
          `INSERT INTO Responsavel (Id, AlunoId, Nome, Ocupacao, Telefone, Email, Parentesco)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            faker.string.uuid(),
            aluno.alunoId,
            nome,
            ocupacao,
            telefone,
            email,
            parentesco,
          ],
        );
      }
    }
  }
}

module.exports = { seedAlunos, seedMatriculas, seedResponsaveis };
