import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

const LARGURA_ABERTA = 240;

const secoes = [
  {
    rotulo: 'OPERAÇÃO',
    itens: [
      { chave: 'console', icone: 'terminal-outline', titulo: 'Console', subtitulo: 'Mapa + ranking', badge: 3 },
      { chave: 'missao', icone: 'settings-outline', titulo: 'Missão', subtitulo: 'Detalhe + otimizar' },
      { chave: 'camera', icone: 'camera-outline', titulo: 'Câmera', subtitulo: 'Validação campo' },
      { chave: 'indicadores', icone: 'trending-up-outline', titulo: 'Indicadores', subtitulo: 'Impacto + métricas' },
    ],
  },
  {
    rotulo: 'CONTEÚDO',
    itens: [
      { chave: 'espacoteca', icone: 'library-outline', titulo: 'Espaçoteca', subtitulo: 'Glossário · APIs' },
    ],
  },
];

export default function Sidebar({ ativo = 'home', aoSelecionar, aberta = true, aoToggle }) {
  const animLargura = useRef(new Animated.Value(aberta ? LARGURA_ABERTA : 0)).current;
  const animOpacidade = useRef(new Animated.Value(aberta ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(animLargura, {
        toValue: aberta ? LARGURA_ABERTA : 0,
        duration: 260,
        useNativeDriver: false,
      }),
      Animated.timing(animOpacidade, {
        toValue: aberta ? 1 : 0,
        duration: aberta ? 260 : 160,
        useNativeDriver: false,
      }),
    ]).start();
  }, [aberta]);

  return (
    <Animated.View style={[estilos.container, { width: animLargura }]}>
      <Animated.View style={[estilos.interno, { opacity: animOpacidade }]}>

        {/* Cabeçalho — clicável para ir à home */}
        <Pressable style={estilos.cabecalho} onPress={() => aoSelecionar?.('home')}>
          <View style={estilos.logoCirculo}>
            <View style={estilos.logoPonto} />
          </View>
          <View style={estilos.cabecalhoTexto}>
            <Text style={estilos.cabecalhoNome}>Orbital Academy</Text>
            <View style={estilos.statusBadge}>
              <View style={estilos.statusPonto} />
              <Text style={estilos.statusTexto}>Missão Agro · ativa</Text>
            </View>
          </View>
          {/* Botão toggle */}
          <Pressable onPress={aoToggle} style={estilos.botaoToggle} hitSlop={8}>
            <Ionicons name="chevron-back-outline" size={16} color="#475569" />
          </Pressable>
        </Pressable>

        <View style={estilos.divisor} />

        {/* Seções de navegação */}
        <View style={estilos.nav}>
          {secoes.map((secao) => (
            <View key={secao.rotulo} style={estilos.secao}>
              <Text style={estilos.secaoRotulo}>{secao.rotulo}</Text>
              {secao.itens.map((item) => {
                const estaAtivo = item.chave === ativo;
                return (
                  <Pressable
                    key={item.chave}
                    onPress={() => aoSelecionar?.(item.chave)}
                    style={({ pressed }) => [
                      estilos.item,
                      estaAtivo && estilos.itemAtivo,
                      pressed && estilos.itemPressed,
                    ]}
                  >
                    {estaAtivo && <View style={estilos.bordaAtiva} />}
                    <View style={[estilos.iconeContainer, estaAtivo && estilos.iconeContainerAtivo]}>
                      <Ionicons
                        name={item.icone}
                        size={18}
                        color={estaAtivo ? '#208AEF' : '#64748B'}
                      />
                    </View>
                    <View style={estilos.itemTexto}>
                      <Text style={[estilos.itemTitulo, estaAtivo && estilos.itemTituloAtivo]}>
                        {item.titulo}
                      </Text>
                      <Text style={estilos.itemSubtitulo}>{item.subtitulo}</Text>
                    </View>
                    {item.badge != null && (
                      <View style={estilos.badge}>
                        <Text style={estilos.badgeTexto}>{item.badge}</Text>
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>
          ))}
        </View>

        {/* Rodapé */}
        <View style={estilos.rodape}>
          <View style={estilos.divisor} />
          <Pressable style={estilos.botaoLogin}>
            <Ionicons name="log-in-outline" size={16} color="#64748B" />
            <View style={estilos.loginTexto}>
              <Text style={estilos.loginTitulo}>Faça login</Text>
              <Text style={estilos.loginSub}>Para acessar sua conta</Text>
            </View>
          </Pressable>
        </View>

      </Animated.View>
    </Animated.View>
  );
}

const estilos = StyleSheet.create({
  container: {
    backgroundColor: '#0A0A0A',
    borderRightWidth: 1,
    borderRightColor: '#ffffff0D',
    overflow: 'hidden',
  },
  interno: {
    width: LARGURA_ABERTA,
    flex: 1,
    flexDirection: 'column',
  },

  // Cabeçalho
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 16,
    paddingBottom: 14,
  },
  logoCirculo: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  logoPonto: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#94A3B8',
  },
  cabecalhoTexto: {
    flex: 1,
    gap: 2,
  },
  cabecalhoNome: {
    color: '#F1F5F9',
    fontSize: 14,
    fontWeight: '700',
  },
  cabecalhoSub: {
    color: '#64748B',
    fontSize: 11,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  statusPonto: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#22C55E',
  },
  statusTexto: {
    color: '#64748B',
    fontSize: 11,
  },
  botaoToggle: {
    marginTop: 2,
    padding: 2,
  },

  // Divisor
  divisor: {
    height: 1,
    backgroundColor: '#ffffff0D',
  },

  // Navegação
  nav: {
    flex: 1,
    paddingTop: 8,
    gap: 16,
  },
  secao: {
    gap: 2,
  },
  secaoRotulo: {
    color: '#334155',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.8,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 10,
    position: 'relative',
  },
  itemAtivo: {
    backgroundColor: '#ffffff08',
  },
  itemPressed: {
    backgroundColor: '#ffffff05',
  },
  bordaAtiva: {
    position: 'absolute',
    left: 0,
    top: 4,
    bottom: 4,
    width: 3,
    borderRadius: 2,
    backgroundColor: '#208AEF',
  },
  iconeContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffffff10',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff05',
  },
  iconeContainerAtivo: {
    borderColor: '#208AEF30',
    backgroundColor: '#208AEF10',
  },
  itemTexto: {
    flex: 1,
    gap: 1,
  },
  itemTitulo: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '500',
  },
  itemTituloAtivo: {
    color: '#F1F5F9',
    fontWeight: '600',
  },
  itemSubtitulo: {
    color: '#334155',
    fontSize: 11,
  },
  badge: {
    backgroundColor: '#1E293B',
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: '#ffffff10',
  },
  badgeTexto: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
  },

  // Rodapé
  rodape: {},
  botaoLogin: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 16,
  },
  loginTexto: {
    gap: 1,
  },
  loginTitulo: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
  },
  loginSub: {
    color: '#334155',
    fontSize: 11,
  },
});
