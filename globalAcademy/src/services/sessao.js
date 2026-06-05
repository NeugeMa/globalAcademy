import AsyncStorage from '@react-native-async-storage/async-storage';

export const SUFIXO_EMAIL_TESTE = 'fiap@teste.com';
const SENHA_TESTE = '123456';

function normalizarEmail(email) {
  return (email ?? '').trim().toLowerCase();
}

export function validarCredenciais(email, senha) {
  return normalizarEmail(email).endsWith(SUFIXO_EMAIL_TESTE) && senha === SENHA_TESTE;
}

// Extrai o nome do usuário a partir do e-mail .
export function extrairNome(email) {
  const prefixo = normalizarEmail(email).slice(0, -SUFIXO_EMAIL_TESTE.length);
  if (!prefixo) return '';
  return prefixo.charAt(0).toUpperCase() + prefixo.slice(1);
}

const CHAVE_SESSAO = '@orbital:sessao';

// Grava a sessão (ex.: { email }) como JSON.
export async function salvarSessao(dados) {
  try {
    await AsyncStorage.setItem(CHAVE_SESSAO, JSON.stringify(dados));
  } catch (e) {
    console.warn('Falha ao salvar sessão:', e);
  }
}

// Lê a sessão guardada; retorna o objeto ou null se não houver.
export async function lerSessao() {
  try {
    const bruto = await AsyncStorage.getItem(CHAVE_SESSAO);
    return bruto ? JSON.parse(bruto) : null;
  } catch (e) {
    console.warn('Falha ao ler sessão:', e);
    return null;
  }
}

// Remove a sessão (logout).
export async function limparSessao() {
  try {
    await AsyncStorage.removeItem(CHAVE_SESSAO);
  } catch (e) {
    console.warn('Falha ao limpar sessão:', e);
  }
}
