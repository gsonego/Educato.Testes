const { Perfil } = require('./enums');
const { ANO_LETIVO_ATUAL } = require('./config');
const { SENHA_PADRAO_SEED } = require('./usuarios');
const { consulta } = require('./db');
const api = require('./api');

// Perfis com nível hierárquico >= Coordenação, exigidos para gerar tarjetas (seed em ordem
// crescente = maior hierarquia na API: AdministracaoGeral, Administracao, Direcao, Coordenacao).
const PERFIS_AUTORIZADOS = [
  Perfil.AdministracaoGeral,
  Perfil.Administracao,
  Perfil.Direcao,
  Perfil.Coordenacao,
];

// Usuários do banco já seedado (job separado do seed de banco: aqui o foco é só a API).
async function usuariosAutorizadosPorEscola() {
  const linhas = await consulta(
    `SELECT EscolaId, Login, Perfil, Inativo
     FROM Usuario
     WHERE Inativo = 0`,
  );

  const porEscola = new Map();
  for (const usuario of linhas) {
    if (!PERFIS_AUTORIZADOS.includes(usuario.Perfil)) continue;
    const lista = porEscola.get(usuario.EscolaId) ?? [];
    lista.push({ login: usuario.Login, perfil: usuario.Perfil });
    porEscola.set(usuario.EscolaId, lista);
  }
  return porEscola;
}

// Gera as tarjetas de todas as escolas pelo endpoint da própria API de testes
// (POST /Modulos/Ano/{ano}/Tarjetas). Idempotente: reexecutar não duplica malha.
async function seedTarjetasViaApi(escolas) {
  if (!api.temApiConfigurada()) {
    console.log(
      '* API de testes não configurada (API_BASE_URL ausente) -> pulando geração de tarjetas.',
    );
    return;
  }

  console.log('* Gerando tarjetas via API de testes...');

  const usuariosPorEscola = await usuariosAutorizadosPorEscola();

  for (const escola of escolas) {
    const nomeEscola = escola.nomeFantasia;
    const autorizado = (usuariosPorEscola.get(escola.escolaId) ?? [])
      .sort((a, b) => a.perfil - b.perfil)[0];

    if (!autorizado) {
      console.warn(`  - ${nomeEscola}: nenhum usuário com perfil para gerar tarjetas.`);
      continue;
    }

    console.log(`  - Autenticando ${autorizado.login} na escola ${nomeEscola}...`);
    const token = await api.login(autorizado.login, SENHA_PADRAO_SEED);

    console.log(`  - Gerando tarjetas do ano ${ANO_LETIVO_ATUAL} para ${nomeEscola}...`);
    const resultado = await api.gerarTarjetasDoAno(ANO_LETIVO_ATUAL, token);

    console.log(
      `    -> ${resultado.tarjetasCriadas} tarjetas e ${resultado.registrosAlunoCriados} registros de aluno criados.`,
    );
  }
}

module.exports = { seedTarjetasViaApi, usuariosAutorizadosPorEscola, PERFIS_AUTORIZADOS };
