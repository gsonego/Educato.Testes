const crypto = require('crypto');
const { faker } = require('./faker');

// Senha de login para todos os usuários do seed (hash legado MD5 - o app faz upgrade automático no 1º login).
const SENHA_PADRAO_SEED = 'Teste@123';

function hashSenhaLegado(senha) {
  return crypto.createHash('md5').update(senha, 'ascii').digest('hex');
}

async function seedUsuarios(db, escolas) {
  console.log('* Inserindo usuários...');

  const senhaHash = hashSenhaLegado(SENHA_PADRAO_SEED);
  const usuariosPorEscola = new Map();
  let usuarioId = 1;

  for (const escola of escolas) {
    const criados = [];

    for (const u of escola.usuarios) {
      const id = usuarioId++;
      const nome = faker.person.fullName();

      await db.run(
        `INSERT INTO Usuario (UsuarioId, Nome, Login, Senha, Email, Perfil, Cargo, EscolaId, Inativo)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          nome,
          u.login,
          senhaHash,
          u.email,
          u.perfil,
          u.cargo,
          escola.escolaId,
          u.inativo ? 1 : 0,
        ],
      );

      criados.push({ ...u, usuarioId: id, nome });
    }

    usuariosPorEscola.set(escola.escolaId, criados);
  }

  return usuariosPorEscola;
}

module.exports = { seedUsuarios, SENHA_PADRAO_SEED };
