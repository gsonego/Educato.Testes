async function seedEscolas(db, escolas) {
  console.log('* Inserindo escolas...');

  for (const escola of escolas) {
    console.log(`  - Inserindo escola ${escola.nomeFantasia}...`);

    await db.run(
      `INSERT INTO Escola
        (EscolaId, RazaoSocial, NomeFantasia, Cnpj, Cidade, Estado, Email, Inativo, Plano)
       VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?)`,
      [
        escola.escolaId,
        escola.razaoSocial,
        escola.nomeFantasia,
        escola.cnpj,
        escola.cidade,
        escola.estado,
        escola.email,
        escola.plano,
      ],
    );
  }
}

module.exports = { seedEscolas };
