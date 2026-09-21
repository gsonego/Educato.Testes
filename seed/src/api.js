const API_BASE_URL = process.env.API_BASE_URL?.replace(/\/+$/, '');

function temApiConfigurada() {
  return Boolean(API_BASE_URL);
}

// Client HTTP mínimo para chamar a API de testes (fetch global do Node 20).
// Nunca logar tokens ou credenciais aqui.
async function requisicao(url, opcoes, tentativa = 0) {
  const resposta = await fetch(url, { ...opcoes, redirect: 'manual' });

  const status = resposta.status;
  if (status >= 300 && status < 400 && resposta.headers.get('location') && tentativa < 3) {
    // Preserva método e corpo no redirect (o fetch padrão converteria POST em GET em 301/302).
    await resposta.body?.cancel();
    const destino = new URL(resposta.headers.get('location'), url).toString();
    return requisicao(destino, opcoes, tentativa + 1);
  }

  return resposta;
}

async function chamarApi(caminho, { metodo = 'GET', corpo, token } = {}) {
  const resposta = await requisicao(`${API_BASE_URL}${caminho}`, {
    method: metodo,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: corpo ? JSON.stringify(corpo) : undefined,
  });

  const texto = await resposta.text();

  if (!resposta.ok) {
    throw new Error(
      `API ${metodo} ${caminho} respondeu ${resposta.status}: ${texto.slice(0, 500)}`,
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
