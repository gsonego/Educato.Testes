const { fakerPT_BR: faker } = require('@faker-js/faker');

// Seed fixo: mesma "aleatoriedade" a cada execução, para facilitar debug e comparação entre runs.
faker.seed(20260819);

// Domínio reservado para testes (RFC 2606) - nunca resolve de verdade, garante e-mails sempre fictícios.
const EMAIL_DOMAIN_FICTICIO = 'example.test';

function loginUnico(base) {
  return base
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, '');
}

module.exports = { faker, EMAIL_DOMAIN_FICTICIO, loginUnico };
