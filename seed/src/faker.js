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

function gerarEndereco() {
  const rua = faker.location.street();
  const numero = faker.location.buildingNumber();
  const endereco = `${rua}, ${numero}`;

  const cidade = faker.location.city();
  const uf = faker.location.state({ abbreviated: true });
  const cep = faker.location.zipCode('#####-###');

  return { endereco, cidade, uf, cep };
}

module.exports = { faker, EMAIL_DOMAIN_FICTICIO, loginUnico, gerarEndereco };
