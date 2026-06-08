import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fonts } from '../styles/fonts';


const PAGINAS = {
  console: { icone: 'terminal-outline', titulo: 'Console de Missão' },
  missao: { icone: 'settings-outline', titulo: 'Detalhe da Missão' },
  camera: { icone: 'camera-outline', titulo: 'Câmera de Validação' },
  indicadores: { icone: 'trending-up-outline', titulo: 'Indicadores de Impacto' },
};

const GATE_TITULO = 'Faça login para visualizar!';
const GATE_TEXTO = 'Opa, parece que você não está logado! \nFaça novamente o acesso.';
const GATE_BOTAO = 'Fazer Login';
const GATE_LINK = 'Não possui cadastro? Clique Aqui!';

export function CabecalhoTela({ pagina, isMobile, direita }) {
  const info = PAGINAS[pagina] ?? {};
  return (
    <View style={estilos.cabecalho}>
      <View style={estilos.tituloIcone}>
        <Ionicons name={info.icone} size={20} color="#38BDF8" />
      </View>
      <Text style={[estilos.tituloPagina, isMobile && estilos.tituloPaginaMobile]}>{info.titulo}</Text>
      {direita ? <View style={estilos.cabecalhoDireita}>{direita}</View> : null}
    </View>
  );
}

export default function AcessoBloqueado({ logado, aoPedirLogin, aoPedirCadastro, children }) {
  return (
    <View style={estilos.area}>
      <View
        style={[
          estilos.conteudo,
          !logado && estilos.bloqueado,
          !logado && Platform.OS === 'web' && { filter: 'blur(3px)' },
        ]}
        pointerEvents={logado ? 'auto' : 'none'}
      >
        {children}
      </View>

      {!logado && (
        <View style={estilos.gate}>
          <View style={estilos.gateCaixa}>
            <View style={estilos.gateIcone}>
              <Ionicons name="lock-closed-outline" size={26} color="#38BDF8" />
            </View>
            <Text style={estilos.gateTitulo}>{GATE_TITULO}</Text>
            <Text style={estilos.gateSub}>{GATE_TEXTO}</Text>
            <Pressable style={estilos.gateBtn} onPress={() => aoPedirLogin?.()}>
              <Ionicons name="log-in-outline" size={16} color="#050810" />
              <Text style={estilos.gateBtnTexto}>{GATE_BOTAO}</Text>
            </Pressable>
            <Pressable hitSlop={6} onPress={() => aoPedirCadastro?.()}>
              <Text style={estilos.gateLink}>{GATE_LINK}</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 24,
    paddingTop: 44,
    paddingBottom: 16,
  },
  cabecalhoDireita: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  tituloIcone: {
    width: 38,
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#38BDF830',
    backgroundColor: '#38BDF810',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tituloPagina: {
    color: '#F1F5F9',
    fontSize: 26,
    fontFamily: fonts.titleBold,
  },
  tituloPaginaMobile: { fontSize: 21 },

  area: {
    flex: 1,
    position: 'relative',
  },
  conteudo: {
    flex: 1,
  },
  bloqueado: {
    opacity: 0.5,
  },

  gate: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#050810B3',
  },
  gateCaixa: {
    maxWidth: 380,
    alignItems: 'center',
    gap: 12,
    padding: 32,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ffffff15',
    backgroundColor: '#0A0F1A',
  },
  gateIcone: {
    width: 56,
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#38BDF850',
    backgroundColor: '#38BDF810',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  gateTitulo: {
    color: '#F1F5F9',
    fontSize: 19,
    fontFamily: fonts.titleBold,
    textAlign: 'center',
  },
  gateSub: {
    color: '#64748B',
    fontSize: 14,
    fontFamily: fonts.body,
    textAlign: 'center',
    lineHeight: 22,
  },
  gateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: '#38BDF8',
    marginTop: 8,
  },
  gateBtnTexto: {
    color: '#050810',
    fontSize: 14,
    fontFamily: fonts.bodyBold,
  },
  gateLink: {
    color: '#475569',
    fontSize: 13,
    fontFamily: fonts.bodySemiBold,
    marginTop: 4,
  },
});
