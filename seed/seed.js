const db = require('./src/db');
const { ESCOLAS } = require('./src/config');
const { limparBanco } = require('./src/clean');
const { seedEscolas } = require('./src/escolas');
const { seedUsuarios } = require('./src/usuarios');
const {
  seedCursos,
  seedAnosEscolares,
  seedModulos,
} = require('./src/academico');
const {
  seedFaixasHorarias,
  seedPeriodos,
  seedLocais,
} = require('./src/horarios');
const { seedModeloAvaliacao, seedDeliberacoes } = require('./src/avaliacao');
const { seedTurmas } = require('./src/turmas');
const { seedDisciplinas } = require('./src/disciplinas');
const { seedTurmaDisciplinas } = require('./src/turmaDisciplinas');
const { seedAlunos, seedMatriculas } = require('./src/alunos');
const { seedAnosLetivos } = require('./src/anosLetivos');

async function main() {
  console.log('--------------------------');
  console.log('*** Configurando banco de dados de testes...');
  console.log('--------------------------');

  await limparBanco(db);

  await seedEscolas(db, ESCOLAS);
  const usuariosPorEscola = await seedUsuarios(db, ESCOLAS);

  const cursosPorEscola = await seedCursos(db, ESCOLAS);
  const anosEscolaresPorEscola = await seedAnosEscolares(db, cursosPorEscola);
  await seedModulos(db, ESCOLAS);

  const faixasPorEscola = await seedFaixasHorarias(db, ESCOLAS);
  await seedPeriodos(db, faixasPorEscola);
  const locaisPorEscola = await seedLocais(db, ESCOLAS, anosEscolaresPorEscola);

  const modeloAvaliacaoPorEscola = await seedModeloAvaliacao(db, ESCOLAS);

  const turmasPorEscola = await seedTurmas(
    db,
    ESCOLAS,
    anosEscolaresPorEscola,
    locaisPorEscola,
    faixasPorEscola,
    modeloAvaliacaoPorEscola,
  );

  const disciplinasPorEscola = await seedDisciplinas(db, ESCOLAS);
  await seedTurmaDisciplinas(
    db,
    ESCOLAS,
    turmasPorEscola,
    disciplinasPorEscola,
    usuariosPorEscola,
  );

  await seedDeliberacoes(db, ESCOLAS);

  const alunosPorTurma = await seedAlunos(
    db,
    ESCOLAS,
    turmasPorEscola,
    anosEscolaresPorEscola,
  );
  await seedMatriculas(db, ESCOLAS, turmasPorEscola, alunosPorTurma);

  await seedAnosLetivos(db, ESCOLAS);

  console.log('--------------------------');
  console.log('*** Banco de dados de testes pronto!');
  console.log('--------------------------');
}

main()
  .catch((err) => {
    console.error('Erro ao executar o seed:', err);
    process.exitCode = 1;
  })
  .finally(() => db.close());
