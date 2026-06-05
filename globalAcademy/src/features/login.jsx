import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fonts } from '../styles/fonts';
import { useBreakpoint } from '../styles/breakpoint';
import { extrairNome, salvarSessao, validarCredenciais } from '../services/sessao';


const estrelas = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  top: Math.random() * 100,
  left: Math.random() * 100,
  tamanho: Math.random() * 1.6 + 0.6,
  opacidade: Math.random() * 0.4 + 0.1,
}));

function Campo({ rotulo, icone, valor, aoMudar, placeholder, teclado, senha = false }) {
  const [focado, setFocado] = useState(false);
  const [mostrar, setMostrar] = useState(false);

  return (
    <View style={estilos.campo}>
      <Text style={estilos.campoRotulo}>{rotulo}</Text>
      <View style={[estilos.campoCaixa, focado && estilos.campoCaixaFocado]}>
        <Ionicons name={icone} size={17} color={focado ? '#38BDF8' : '#64748B'} />
        <TextInput
          value={valor}
          onChangeText={aoMudar}
          placeholder={placeholder}
          placeholderTextColor="#475569"
          keyboardType={teclado}
          autoCapitalize="none"
          secureTextEntry={senha && !mostrar}
          onFocus={() => setFocado(true)}
          onBlur={() => setFocado(false)}
          style={estilos.campoInput}
        />
        {senha && (
          <Pressable onPress={() => setMostrar((v) => !v)} hitSlop={8}>
            <Ionicons
              name={mostrar ? 'eye-off-outline' : 'eye-outline'}
              size={17}
              color="#64748B"
            />
          </Pressable>
        )}
      </View>
    </View>
  );
}

export default function Login({ aoEntrar, aoVoltar }) {
  const { isMobile } = useBreakpoint();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [manterConectado, setManterConectado] = useState(true);
  const [erro, setErro] = useState('');

  const animX = useRef(new Animated.Value(-64)).current;
  const animOp = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(animX, { toValue: 0, duration: 520, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(animOp, { toValue: 1, duration: 520, useNativeDriver: true }),
    ]).start();
  }, []);

  // Valida as credenciais e, dando certo, persiste a sessão (se "Manter conectado").
  async function entrar() {
    if (!validarCredenciais(email, senha)) {
      setErro('E-mail ou senha inválidos. Confira a credencial de teste.');
      return;
    }
    setErro('');
    const dados = { email: email.trim().toLowerCase(), nome: extrairNome(email) };
    if (manterConectado) await salvarSessao(dados);
    aoEntrar?.(dados);
  }

  return (
    <View style={estilos.container}>
      <Animated.View style={[estilos.fundo, { opacity: animOp }]} pointerEvents="none">
        {estrelas.map((e) => (
          <View
            key={e.id}
            style={{
              position: 'absolute',
              top: `${e.top}%`,
              left: `${e.left}%`,
              width: e.tamanho,
              height: e.tamanho,
              borderRadius: e.tamanho / 2,
              backgroundColor: '#ffffff',
              opacity: e.opacidade,
            }}
          />
        ))}

        <View style={[estilos.linhaTrajetoria, { top: '34%', transform: [{ rotate: '-24deg' }] }]} />
        <View style={[estilos.linhaTrajetoria, { top: '64%', transform: [{ rotate: '18deg' }] }]} />
      </Animated.View>

      <Animated.View
        style={[
          estilos.conteudo,
          isMobile && estilos.conteudoMobile,
          { opacity: animOp, transform: [{ translateX: animX }] },
        ]}
      >
        <Text style={estilos.eyebrow}>ACESSO · USUÁRIO</Text>
        <Text style={estilos.titulo}>Entrar nesta Missão?</Text>
        <Text style={estilos.subtitulo}>Use suas credenciais da missão para continuar.</Text>

        <View style={estilos.form}>
          <Campo
            rotulo="E-mail"
            icone="mail-outline"
            valor={email}
            aoMudar={(v) => { setEmail(v); if (erro) setErro(''); }}
            placeholder="nomefiap@teste.com"
            teclado="email-address"
          />
          <Campo
            rotulo="Senha"
            icone="lock-closed-outline"
            valor={senha}
            aoMudar={(v) => { setSenha(v); if (erro) setErro(''); }}
            placeholder="••••••••"
            senha
          />

          {erro ? (
            <View style={estilos.erroCaixa}>
              <Ionicons name="alert-circle-outline" size={15} color="#EF4444" />
              <Text style={estilos.erroTexto}>{erro}</Text>
            </View>
          ) : null}

          <View style={estilos.opcoes}>
            <Pressable style={estilos.checkboxLinha} onPress={() => setManterConectado((v) => !v)}>
              <View style={[estilos.checkbox, manterConectado && estilos.checkboxAtivo]}>
                {manterConectado && <Ionicons name="checkmark" size={13} color="#050810" />}
              </View>
              <Text style={estilos.checkboxTexto}>Manter conectado</Text>
            </Pressable>
            <Pressable hitSlop={6}>
              <Text style={estilos.link}>Esqueci a senha</Text>
            </Pressable>
          </View>

          <Pressable
            style={({ pressed }) => [estilos.btnPrimario, pressed && estilos.btnPrimarioPressed]}
            onPress={entrar}
          >
            <Text style={estilos.btnPrimarioTexto}>Acessar console</Text>
            <Ionicons name="arrow-forward-outline" size={18} color="#050810" />
          </Pressable>

          <View style={estilos.rodape}>
            <Text style={estilos.rodapeTexto}>Primeiro acesso? </Text>
            <Pressable hitSlop={6}>
              <Text style={estilos.link}>Solicitar credencial</Text>
            </Pressable>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050810',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },

  // --- Fundo espacial ---
  fundo: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  linhaTrajetoria: {
    position: 'absolute',
    left: '-20%',
    width: '140%',
    height: 1,
    backgroundColor: '#ffffff0D',
  },

  // --- Conteúdo ---
  conteudo: {
    width: '100%',
    maxWidth: 380,
    paddingHorizontal: 24,
    zIndex: 5,
  },
  conteudoMobile: {
    maxWidth: 420,
  },
  eyebrow: {
    color: '#475569',
    fontSize: 11,
    fontFamily: fonts.bodyBold,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 14,
  },
  titulo: {
    color: '#F1F5F9',
    fontSize: 32,
    fontFamily: fonts.titleBlack,
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitulo: {
    color: '#64748B',
    fontSize: 14,
    fontFamily: fonts.body,
    lineHeight: 22,
  },

  // --- Formulário ---
  form: {
    marginTop: 28,
    gap: 18,
  },
  campo: {
    gap: 8,
  },
  campoRotulo: {
    color: '#94A3B8',
    fontSize: 13,
    fontFamily: fonts.bodySemiBold,
  },
  campoCaixa: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 50,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ffffff15',
    backgroundColor: '#0A0F1A',
  },
  campoCaixaFocado: {
    borderColor: '#38BDF8',
    backgroundColor: '#0D1117',
  },
  campoInput: {
    flex: 1,
    color: '#E2E8F0',
    fontSize: 14,
    fontFamily: fonts.body,
    outlineStyle: 'none', 
  },

  // --- Manter conectado + link ---
  opcoes: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  checkboxLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ffffff25',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxAtivo: {
    backgroundColor: '#38BDF8',
    borderColor: '#38BDF8',
  },
  checkboxTexto: {
    color: '#94A3B8',
    fontSize: 13,
    fontFamily: fonts.body,
  },
  link: {
    color: '#38BDF8',
    fontSize: 13,
    fontFamily: fonts.bodySemiBold,
  },

  // --- Botão primário ---
  btnPrimario: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#38BDF8',
    marginTop: 4,
  },
  btnPrimarioPressed: {
    opacity: 0.85,
  },
  btnPrimarioTexto: {
    color: '#050810',
    fontSize: 15,
    fontFamily: fonts.bodyBold,
  },

  // --- Erro de validação ---
  erroCaixa: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EF444430',
    backgroundColor: '#EF444410',
  },
  erroTexto: {
    flex: 1,
    color: '#FCA5A5',
    fontSize: 13,
    fontFamily: fonts.body,
    lineHeight: 18,
  },

  // --- Rodapé ---
  rodape: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  rodapeTexto: {
    color: '#64748B',
    fontSize: 13,
    fontFamily: fonts.body,
  },
});
