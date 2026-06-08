import AsyncStorage from '@react-native-async-storage/async-storage';

export const SUFIXO_EMAIL_TESTE = '@teste.com';
const SENHA_TESTE = '123456';

function normalizarEmail(email) {
  return (email ?? '').trim().toLowerCase();
}

export function validarCredenciais(email, senha) {
  return normalizarEmail(email).endsWith(SUFIXO_EMAIL_TESTE) && senha === SENHA_TESTE;
}

export function extrairNome(email) {
  const prefixo = normalizarEmail(email).slice(0, -SUFIXO_EMAIL_TESTE.length);
  if (!prefixo) return '';
  return prefixo.charAt(0).toUpperCase() + prefixo.slice(1);
}

const CHAVE_SESSAO = '@orbital:sessao';

export async function salvarSessao(dados) {
  try {
    await AsyncStorage.setItem(CHAVE_SESSAO, JSON.stringify(dados));
  } catch (e) {
    console.warn('Falha ao salvar sessão:', e);
  }
}

export async function lerSessao() {
  try {
    const bruto = await AsyncStorage.getItem(CHAVE_SESSAO);
    return bruto ? JSON.parse(bruto) : null;
  } catch (e) {
    console.warn('Falha ao ler sessão:', e);
    return null;
  }
}

export async function limparSessao() {
  try {
    await AsyncStorage.removeItem(CHAVE_SESSAO);
  } catch (e) {
    console.warn('Falha ao limpar sessão:', e);
  }
}

// Base de usuários cadastrados (AsyncStorage) ---
const CHAVE_USUARIOS = '@orbital:usuarios';

// Lê a lista de usuários cadastrados (array; vazio se não houver).
export async function lerUsuarios() {
  try {
    const bruto = await AsyncStorage.getItem(CHAVE_USUARIOS);
    return bruto ? JSON.parse(bruto) : [];
  } catch (e) {
    console.warn('Falha ao ler usuários:', e);
    return [];
  }
}

export async function cadastrarUsuario({ nome, email, senha }) {
  const emailNormalizado = normalizarEmail(email);
  const usuarios = await lerUsuarios();
  if (usuarios.some((u) => u.email === emailNormalizado)) {
    return { ok: false, erro: 'Este e-mail já está cadastrado.' };
  }
  const novo = { nome: (nome ?? '').trim(), email: emailNormalizado, senha };
  try {
    await AsyncStorage.setItem(CHAVE_USUARIOS, JSON.stringify([...usuarios, novo]));
    return { ok: true, usuario: { nome: novo.nome, email: novo.email } };
  } catch (e) {
    console.warn('Falha ao cadastrar usuário:', e);
    return { ok: false, erro: 'Não foi possível salvar o cadastro.' };
  }
}

export async function autenticar(email, senha) {
  const emailNormalizado = normalizarEmail(email);
  if (validarCredenciais(email, senha)) {
    return { email: emailNormalizado, nome: extrairNome(email) };
  }
  const usuarios = await lerUsuarios();
  const u = usuarios.find((x) => x.email === emailNormalizado && x.senha === senha);
  return u ? { nome: u.nome, email: u.email } : null;
}
