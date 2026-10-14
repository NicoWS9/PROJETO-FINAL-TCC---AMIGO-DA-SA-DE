// Camada de comunicação com o back-end.
// Toda chamada à API passa por aqui: quando o servidor existir,
// você só mexe neste arquivo (e não nas telas).

// IP do computador onde o servidor roda. No celular, "localhost" NÃO funciona.
const API_URL = 'http://192.168.0.10:3000';

// true  = login de teste, sem servidor (maria@teste.com / 123456)
// false = usa o back-end de verdade
const USAR_MOCK = true;

let tokenAtual = null;
export function setAuthToken(token) {
  tokenAtual = token;
}

// Chamada genérica: já envia o token nas rotas protegidas
export async function apiFetch(caminho, opcoes = {}) {
  let resposta;
  try {
    resposta = await fetch(`${API_URL}${caminho}`, {
      ...opcoes,
      headers: {
        'Content-Type': 'application/json',
        ...(tokenAtual ? { Authorization: `Bearer ${tokenAtual}` } : {}),
        ...opcoes.headers,
      },
    });
  } catch (e) {
    throw new Error('Sem conexão com o servidor. Verifique sua internet.');
  }

  const dados = await resposta.json().catch(() => ({}));
  if (!resposta.ok) throw new Error(dados.erro || 'Algo deu errado. Tente novamente.');
  return dados;
}

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

export async function login(email, senha) {
  if (USAR_MOCK) {
    await esperar(800);
    if (email.trim().toLowerCase() === 'maria@teste.com' && senha === '123456') {
      return { token: 'token-de-teste', usuario: { id: 1, nome: 'Maria', email } };
    }
    throw new Error('E-mail ou senha incorretos.');
  }
  return apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: email.trim(), senha }),
  });
}

export async function cadastrar(nome, email, senha) {
  if (USAR_MOCK) {
    await esperar(800);
    return { token: 'token-de-teste', usuario: { id: 1, nome, email } };
  }
  return apiFetch('/auth/cadastro', {
    method: 'POST',
    body: JSON.stringify({ nome, email: email.trim(), senha }),
  });
}