const { gerarEndereco } = require('./faker');

async function seedEscolas(db, escolas) {
  console.log('* Inserindo escolas...');

  for (const escola of escolas) {
    console.log(`  - Inserindo escola ${escola.nomeFantasia}...`);

    const { endereco, cidade, uf, cep } = gerarEndereco();

    await db.run(
      `INSERT INTO Escola
        (EscolaId, RazaoSocial, NomeFantasia, Cnpj, Endereco, Cidade, Estado, Cep, Email, Plano)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        escola.escolaId,
        escola.razaoSocial,
        escola.nomeFantasia,
        escola.cnpj,
        endereco,
        cidade,
        uf,
        cep,
        escola.email,
        escola.plano,
      ],
    );
  }
}

module.exports = { seedEscolas };
