// Ordem irrelevante: FK checks ficam desligados durante a limpeza (banco de testes apenas).
const TABELAS = [
  '@usuario_push_token',
  '@relatoproblema',
  '@refreshtoken',
  '@redefinirsenha',
  '@mensagemcontato',
  '@notificacao',
  'presencadiaria',
  'registropresenca',
  'registrodiario',
  'avaliacaoitem',
  'avaliacaomatricula',
  'deliberacaoaluno',
  'deliberacao',
  'tarjetamatricula',
  'tarjeta',
  'gradehoraria',
  'turmadisciplina',
  'matricula',
  'notaanterior',
  'escolaanterior',
  'responsavel',
  'objetivoaprendizagem',
  'mencao',
  'modeloavaliacao',
  'aluno',
  'turma',
  'local',
  'periodo',
  'faixahorario',
  'anoescolar',
  'modulo',
  'disciplina',
  'curso',
  'configuracaoescola',
  'documentomodelo',
  'anoletivo',
  'usuario',
  'escola',
];

async function limparBanco(db) {
  console.log('* Limpando tabelas...☠️');

  await db.run('SET FOREIGN_KEY_CHECKS = 0');

  for (const tabela of TABELAS) {
    await db.run(`DELETE FROM \`${tabela}\``);
  }

  await db.run('SET FOREIGN_KEY_CHECKS = 1');
}

module.exports = { limparBanco };
