import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fonts } from '../styles/fonts';
import { useBreakpoint } from '../styles/breakpoint';

// Console de Missão.
// Esta tela tem dois estados (igual às demais páginas da sidebar):
//  - SEM login  -> estado vazio (empty states), nenhuma missão ativa. (implementado aqui)
//  - COM login  -> os mesmos painéis preenchidos com dados. (entra depois, ramificando por `logado`)

// Cores de risco usadas na legenda do mapa.
const niveisRisco = [
  { rotulo: 'Alto', cor: '#EF4444' },
  { rotulo: 'Médio', cor: '#F59E0B' },
  { rotulo: 'Baixo', cor: '#22C55E' },
];

// Filtros do ranking de áreas.
const filtrosRanking = [
  { chave: 'todas', rotulo: 'Todas' },
  { chave: 'alto', rotulo: 'Alto' },
  { chave: 'medio', rotulo: 'Médio' },
];

// --- Estado vazio reutilizável (ícone + título + subtítulo opcional) ---
function EstadoVazio({ icone, titulo, subtitulo, grande = false, estilo }) {
  return (
    <View style={[estilos.vazio, estilo]}>
      <Ionicons name={icone} size={grande ? 40 : 30} color="#334155" />
      <Text style={[estilos.vazioTitulo, grande && estilos.vazioTituloGrande]}>{titulo}</Text>
      {subtitulo ? <Text style={estilos.vazioSubtitulo}>{subtitulo}</Text> : null}
    </View>
  );
}

// --- Painel base: card com cabeçalho (título à esquerda, conteúdo livre à direita) ---
function Painel({ titulo, direita, children, estilo }) {
  return (
    <View style={[estilos.painel, estilo]}>
      <View style={estilos.painelCabecalho}>
        <Text style={estilos.painelTitulo}>{titulo}</Text>
        {direita}
      </View>
      <View style={estilos.painelCorpo}>{children}</View>
    </View>
  );
}

// --- Legenda de risco do mapa ---
function LegendaRisco() {
  return (
    <View style={estilos.legenda}>
      {niveisRisco.map((nivel) => (
        <View key={nivel.rotulo} style={estilos.legendaItem}>
          <View style={[estilos.legendaPonto, { backgroundColor: nivel.cor }]} />
          <Text style={estilos.legendaTexto}>{nivel.rotulo}</Text>
        </View>
      ))}
    </View>
  );
}

// Texto de contagem que vai à direita do título (ex.: "0 áreas").
function Contagem({ texto }) {
  return <Text style={estilos.contagem}>{texto}</Text>;
}

// --- Painel: Mapa de risco ---
function PainelMapa({ isMobile }) {
  return (
    <Painel
      titulo="Mapa de risco"
      direita={<LegendaRisco />}
      estilo={[estilos.painelMapa, isMobile && estilos.painelMapaMobile]}
    >
      <EstadoVazio
        grande
        icone="map-outline"
        titulo="Nenhuma área carregada"
        subtitulo="Selecione uma missão para visualizar o mapa"
      />
    </Painel>
  );
}

// --- Painel: Ranking de áreas (com filtros + busca) ---
function PainelRanking() {
  const [filtro, setFiltro] = useState('todas');
  const [busca, setBusca] = useState('');

  return (
    <Painel titulo="Ranking de áreas" direita={<Contagem texto="0 áreas" />}>
      {/* Filtros + busca */}
      <View style={estilos.filtros}>
        {filtrosRanking.map((item) => {
          const ativo = item.chave === filtro;
          return (
            <Pressable
              key={item.chave}
              onPress={() => setFiltro(item.chave)}
              style={[estilos.filtroPill, ativo && estilos.filtroPillAtivo]}
            >
              <Text style={[estilos.filtroTexto, ativo && estilos.filtroTextoAtivo]}>
                {item.rotulo}
              </Text>
            </Pressable>
          );
        })}

        <View style={estilos.buscaCampo}>
          <Ionicons name="search-outline" size={15} color="#64748B" />
          <TextInput
            value={busca}
            onChangeText={setBusca}
            placeholder="Buscar área"
            placeholderTextColor="#475569"
            style={estilos.buscaInput}
          />
        </View>
      </View>

      <EstadoVazio
        icone="search-outline"
        titulo={'Nenhuma área\nidentificada ainda'}
        estilo={estilos.vazioCaixa}
      />
    </Painel>
  );
}

// --- Painel: Missões de hoje ---
function PainelMissoes() {
  return (
    <Painel titulo="Missões hoje" direita={<Contagem texto="0 missões" />}>
      <EstadoVazio
        icone="navigate-outline"
        titulo={'Nenhuma missão\ncriada para hoje'}
        estilo={estilos.vazioCaixa}
      />
    </Painel>
  );
}

// --- Cabeçalho da tela (título + status da missão + menu) ---
function CabecalhoConsole({ isMobile }) {
  return (
    <View style={estilos.cabecalho}>
      <Text style={[estilos.cabecalhoTitulo, isMobile && estilos.cabecalhoTituloMobile]}>
        Console de Missão
      </Text>

      <View style={estilos.cabecalhoAcoes}>
        {/* Sem login não há missão ativa. */}
        <View style={estilos.statusPill}>
          <Text style={estilos.statusPillTexto}>Nenhuma missão ativa</Text>
        </View>
        <Pressable style={estilos.menuBtn} hitSlop={6}>
          <Ionicons name="ellipsis-horizontal" size={18} color="#94A3B8" />
        </Pressable>
      </View>
    </View>
  );
}

export default function Console({ logado = false }) {
  const { isMobile } = useBreakpoint();

  // Entrada suave (fade + leve subida), no mesmo padrão das seções da home.
  const animOp = useRef(new Animated.Value(0)).current;
  const animY = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(animOp, { toValue: 1, duration: 420, useNativeDriver: true }),
      Animated.timing(animY, { toValue: 0, duration: 420, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[estilos.container, { opacity: animOp, transform: [{ translateY: animY }] }]}>
      <CabecalhoConsole isMobile={isMobile} />

      {isMobile ? (
        // Mobile: painéis empilhados em rolagem vertical.
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={estilos.corpoMobile}
        >
          <PainelMapa isMobile />
          <PainelRanking />
          <PainelMissoes />
        </ScrollView>
      ) : (
        // Desktop: mapa à esquerda (altura cheia) + coluna de painéis à direita.
        <View style={estilos.corpo}>
          <PainelMapa />
          <View style={estilos.coluna}>
            <PainelRanking />
            <PainelMissoes />
          </View>
        </View>
      )}
    </Animated.View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
  },

  // --- Cabeçalho ---
  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ffffff0D',
  },
  cabecalhoTitulo: {
    color: '#F1F5F9',
    fontSize: 22,
    fontFamily: fonts.titleBold,
  },
  cabecalhoTituloMobile: {
    fontSize: 18,
  },
  cabecalhoAcoes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statusPill: {
    borderWidth: 1,
    borderColor: '#ffffff15',
    borderRadius: 100,
    paddingVertical: 7,
    paddingHorizontal: 14,
  },
  statusPillTexto: {
    color: '#94A3B8',
    fontSize: 13,
    fontFamily: fonts.body,
  },
  menuBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ffffff15',
    backgroundColor: '#ffffff05',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // --- Corpo (layout dos painéis) ---
  corpo: {
    flex: 1,
    flexDirection: 'row',
    gap: 16,
    padding: 16,
  },
  corpoMobile: {
    padding: 16,
    gap: 16,
  },
  // Mapa ocupa mais largura e estica na altura toda da área.
  painelMapa: {
    flex: 1.35,
  },
  painelMapaMobile: {
    height: 380,
  },
  // Coluna direita: alinhada ao topo (não estica junto com o mapa).
  coluna: {
    flex: 1,
    gap: 16,
    alignSelf: 'flex-start',
  },

  // --- Painel base ---
  painel: {
    backgroundColor: '#0A0F1A',
    borderWidth: 1,
    borderColor: '#ffffff0D',
    borderRadius: 16,
    overflow: 'hidden',
  },
  painelCabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ffffff0D',
  },
  painelTitulo: {
    color: '#E2E8F0',
    fontSize: 16,
    fontFamily: fonts.titleBold,
  },
  painelCorpo: {
    flex: 1,
    padding: 16,
    gap: 14,
  },
  contagem: {
    color: '#64748B',
    fontSize: 13,
    fontFamily: fonts.body,
  },

  // --- Legenda de risco ---
  legenda: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  legendaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendaPonto: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  legendaTexto: {
    color: '#94A3B8',
    fontSize: 12,
    fontFamily: fonts.body,
  },

  // --- Filtros + busca (ranking) ---
  filtros: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  filtroPill: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#ffffff15',
  },
  filtroPillAtivo: {
    backgroundColor: '#ffffff0A',
    borderColor: '#ffffff25',
  },
  filtroTexto: {
    color: '#94A3B8',
    fontSize: 13,
    fontFamily: fonts.bodySemiBold,
  },
  filtroTextoAtivo: {
    color: '#F1F5F9',
  },
  buscaCampo: {
    flex: 1,
    minWidth: 120,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#ffffff15',
  },
  buscaInput: {
    flex: 1,
    color: '#E2E8F0',
    fontSize: 13,
    fontFamily: fonts.body,
    outlineStyle: 'none', // remove o contorno azul do input no web
  },

  // --- Estado vazio ---
  vazio: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  vazioTitulo: {
    color: '#94A3B8',
    fontSize: 14,
    fontFamily: fonts.bodySemiBold,
    textAlign: 'center',
    lineHeight: 20,
  },
  vazioTituloGrande: {
    color: '#CBD5E1',
    fontSize: 16,
  },
  vazioSubtitulo: {
    color: '#64748B',
    fontSize: 13,
    fontFamily: fonts.body,
    textAlign: 'center',
  },
  // Caixa interna (recuo) usada nos empty states de ranking/missões.
  vazioCaixa: {
    backgroundColor: '#0D1117',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ffffff08',
    padding: 24,
    minHeight: 150,
  },
});
