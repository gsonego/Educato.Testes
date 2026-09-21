const db = require('./src/db');
const { ESCOLAS } = require('./src/config');
const { seedNotasViaApi } = require('./src/notas');

async function main() {
  console.log('--------------------------');
  console.log('*** Preenchendo notas e faltas via API de testes...');
  console.log('--------------------------');

  await seedNotasViaApi(ESCOLAS);
}

main()
  .catch((err) => {
    console.error('Erro ao preencher notas:', err);
    process.exitCode = 1;
  })
  .finally(() => db.close());