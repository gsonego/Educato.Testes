const db = require('./src/db');
const { ESCOLAS } = require('./src/config');
const { seedTarjetasViaApi } = require('./src/tarjetas');

async function main() {
  console.log('--------------------------');
  console.log('*** Gerando tarjetas via API de testes...');
  console.log('--------------------------');

  await seedTarjetasViaApi(ESCOLAS);
}

main()
  .catch((err) => {
    console.error('Erro ao gerar tarjetas:', err);
    process.exitCode = 1;
  })
  .finally(() => db.close());