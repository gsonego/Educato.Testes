const API_BASE_URL = process.env.API_BASE_URL?.replace(/\/+$/, '');

function temApiConfigurada() {
  return Boolean(API_BASE_URL);
}

// Client HTTP mínimo para chamar a API de testes (fetch global do Node 20).
// Nunca logar tokens ou credenciais aqui.
async function chamarApi(caminho, { metodo = 'GET', corpo, token } = {}) {
  const resposta = await fetch(`${API_BASE_URL}${caminho}`, {
    method: metodo,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: corpo ? JSON.stringify(corpo) : undefined,
  });

  if (resposta.status === 204) {
    return null;
  }

  const texto = (await resposta.text()).slice(0, 500);

  if (!resposta.ok) {
    throw new Error(
      `API ${metodo} ${caminho} respondeu ${resposta.status}: ${texto}`,
    );
  }

  return texto ? JSON.parse(texto) : null;
}

async function login(login, senha) {
  const resposta = await chamarApi('/Autenticacao/Login', {
    metodo: 'POST',
    corpo: { Login: login, Senha: senha },
  });

  return resposta.accessToken;
}

async function gerarTarjetasDoAno(ano, token) {
  return chamarApi(`/Modulos/Ano/${ano}/Tarjetas`, {
    metodo: 'POST',
    token,
  });
}

module.exports = { temApiConfigurada, login, gerarTarjetasDoAno };
