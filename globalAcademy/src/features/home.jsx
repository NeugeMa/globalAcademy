import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Sidebar from '../components/sidebar';
import { fonts } from '../constants/fonts';

const etapas = [
  { numero: '01', rotulo: 'Ver' },
  { numero: '02', rotulo: 'Prever' },
  { numero: '03', rotulo: 'Validar' },
  { numero: '04', rotulo: 'Decidir' },
  { numero: '05', rotulo: 'Otimizar' },
  { numero: '06', rotulo: 'Agir' },
  { numero: '07', rotulo: 'Medir' },
];

const estrelas = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  top: Math.random() * 100,
  left: Math.random() * 100,
  tamanho: Math.random() * 2 + 1,
  duracao: Math.random() * 2000 + 1500,
  atraso: Math.random() * 3000,
}));

function Estrela({ top, left, tamanho, duracao, atraso }) {
  const animOpacidade = useRef(new Animated.Value(0.2)).current;

  useEffect(() => {
    const piscar = () => {
      Animated.sequence([
        Animated.timing(animOpacidade, {
          toValue: 1,
          duration: duracao,
          delay: atraso,
          useNativeDriver: true,
        }),
        Animated.timing(animOpacidade, {
          toValue: 0.15,
          duration: duracao,
          useNativeDriver: true,
        }),
      ]).start(() => piscar());
    };
    piscar();
  }, []);

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute',
        top: `${top}%`,
        left: `${left}%`,
        width: tamanho,
        height: tamanho,
        borderRadius: tamanho / 2,
        backgroundColor: '#ffffff',
        opacity: animOpacidade,
      }}
    />
  );
}

const secoes = [];

const etapasDetalhadas = [
  { numero: '01', rotulo: 'Ver', descricao: 'O satélite enxerga o que ninguém em campo alcança. Vegetação, umidade do solo e temperatura de superfície, todo dia.' },
  { numero: '02', rotulo: 'Prever', descricao: 'O modelo de ML cruza esses sinais e estima onde o risco vai crescer antes de virar perda.' },
  { numero: '03', rotulo: 'Validar', descricao: 'A leitura orbital encontra a checagem em campo. O número deixa de ser palpite e vira confiança.' },
  { numero: '04', rotulo: 'Decidir', descricao: 'Sob recurso limitado, o operador escolhe qual área atender primeiro. \nÉ aqui que o dado vira decisão.' },
  { numero: '05', rotulo: 'Otimizar', descricao: 'O motor calcula a melhor alocação de equipe, insumo e tempo para o maior impacto possível.' },
  { numero: '06', rotulo: 'Agir', descricao: 'A missão sai do painel e vira ação no território, alguém vai até a área certa fazer o que importa.' },
  { numero: '07', rotulo: 'Medir', descricao: 'O resultado volta como dado, fecha o ciclo e ensina a próxima decisão a ser melhor.' },
];

const slidesCarrossel = etapasDetalhadas.map((e) => ({
  id: e.numero,
  titulo: e.rotulo,
  descricao: e.descricao,
}));


function TimelineItemAccordion({ etapa }) {
  const animAltura = useRef(new Animated.Value(0)).current;
  const animOp = useRef(new Animated.Value(0)).current;
  const animBrilho = useRef(new Animated.Value(0)).current;

  function aoEntrar() {
    Animated.parallel([
      Animated.timing(animBrilho, { toValue: 1, duration: 180, useNativeDriver: false }),
      Animated.timing(animAltura, { toValue: 1, duration: 320, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
      Animated.timing(animOp, { toValue: 1, duration: 280, useNativeDriver: false }),
    ]).start();
  }

  function aoSair() {
    Animated.parallel([
      Animated.timing(animBrilho, { toValue: 0, duration: 180, useNativeDriver: false }),
      Animated.timing(animAltura, { toValue: 0, duration: 260, easing: Easing.in(Easing.cubic), useNativeDriver: false }),
      Animated.timing(animOp, { toValue: 0, duration: 160, useNativeDriver: false }),
    ]).start();
  }

  const corBorda = animBrilho.interpolate({ inputRange: [0, 1], outputRange: ['#ffffff15', '#208AEF'] });
  const corFundo = animBrilho.interpolate({ inputRange: [0, 1], outputRange: ['transparent', '#208AEF0D'] });
  const corNumero = animBrilho.interpolate({ inputRange: [0, 1], outputRange: ['#334155', '#208AEF'] });
  const corNumeroBg = animBrilho.interpolate({ inputRange: [0, 1], outputRange: ['#0D1420', '#208AEF18'] });
  const alturaExtra = animAltura.interpolate({ inputRange: [0, 1], outputRange: [0, 110] });

  const hoverProps = Platform.OS === 'web'
    ? { onMouseEnter: aoEntrar, onMouseLeave: aoSair }
    : { onPressIn: aoEntrar, onPressOut: aoSair };

  return (
    <Animated.View
      style={[estilos.timelineItemWrapper, { borderColor: corBorda, backgroundColor: corFundo }]}
      {...hoverProps}
    >
      <View style={estilos.timelineItemRow}>
        <Animated.View style={[estilos.timelineCirculo, { borderColor: corBorda, backgroundColor: corNumeroBg }]}>
          <Animated.Text style={[estilos.timelineCirculoTexto, { color: corNumero }]}>{etapa.numero}</Animated.Text>
        </Animated.View>
        <View style={estilos.timelineConteudo}>
          <Text style={estilos.timelineRotulo}>{etapa.rotulo}</Text>
          <Text style={estilos.timelineDescricao}>{etapa.descricao}</Text>
        </View>
      </View>
      <Animated.View style={{ height: alturaExtra, overflow: 'hidden' }}>
        <Animated.Text style={[estilos.timelineLorem, { opacity: animOp }]}>{LOREM}</Animated.Text>
      </Animated.View>
    </Animated.View>
  );
}

const CARD_W = 340;
const CARD_GAP = 16;

function CarrosselNav({ slides, indice, irPara }) {
  return (
    <View style={estilos.carrosselControles}>
      <Pressable
        style={[estilos.carrosselBtnCirculo, indice === 0 && estilos.carrosselBtnDesativado]}
        onPress={() => irPara(indice - 1)}
      >
        <Ionicons name="chevron-back-outline" size={16} color={indice === 0 ? '#334155' : '#94A3B8'} />
      </Pressable>
      <Pressable
        style={[estilos.carrosselBtnCirculo, estilos.carrosselBtnAtivo, indice === slides.length - 1 && estilos.carrosselBtnDesativado]}
        onPress={() => irPara(indice + 1)}
      >
        <Ionicons name="chevron-forward-outline" size={16} color={indice === slides.length - 1 ? '#334155' : '#F8FAFC'} />
      </Pressable>
      <View style={estilos.carrosselPontos}>
        {slides.map((_, i) => (
          <Pressable key={i} onPress={() => irPara(i)}>
            <View style={[estilos.carrosselPonto, i === indice && estilos.carrosselPontoAtivo]} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function CarrosselCards({ slides, indice, animX }) {
  return (
    <View style={estilos.carrosselOverflow}>
      <Animated.View style={[estilos.carrosselTrilha, { transform: [{ translateX: animX }] }]}>
        {slides.map((slide, i) => (
          <View key={slide.id} style={[estilos.carrosselCard, i === indice && estilos.carrosselCardAtivo]}>
            <View style={estilos.carrosselCardBody} />
            <View style={estilos.carrosselCardFooter}>
              <Text style={estilos.carrosselCardTitulo}>{slide.titulo}</Text>
              <Text style={estilos.carrosselCardDescricao}>{slide.descricao}</Text>
            </View>
          </View>
        ))}
      </Animated.View>
    </View>
  );
}

function SecaoPrincipal({ atraso = 0, eMobile = false, alturaJanela = 800 }) {
  const animY = useRef(new Animated.Value(24)).current;
  const animOp = useRef(new Animated.Value(0)).current;
  const [indiceCarrossel, setIndiceCarrossel] = useState(0);
  const animXCarrossel = useRef(new Animated.Value(0)).current;

  function irParaSlide(novoIndice) {
    const total = slidesCarrossel.length;
    const idx = ((novoIndice % total) + total) % total;
    Animated.timing(animXCarrossel, {
      toValue: idx * -(CARD_W + CARD_GAP),
      duration: 420,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
    setIndiceCarrossel(idx);
  }

  useEffect(() => {
    Animated.parallel([
      Animated.timing(animY, { toValue: 0, duration: 500, delay: atraso, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(animOp, { toValue: 1, duration: 500, delay: atraso, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[{ opacity: animOp, transform: [{ translateY: animY }] }, estilos.dossieContainer, { minHeight: alturaJanela }]}>

      {/* Topo da seção */}
      <View style={estilos.dossieTopo}>
        <Text style={estilos.dossieRotuloEsquerda}>O QUE É O ORBITAL ACADEMY</Text>
        <Text style={estilos.dossieRotuloDireita}>01 / DOSSIÊ</Text>
      </View>

      {/* Título principal */}
      <Text style={[estilos.dossieTituloGrande, eMobile && estilos.dossieTituloGrandeMobile]}>
        Dado espacial em decisão real.{'\n'}
        <Text style={estilos.destaqueCiano}>Sem precisar ser especialista.</Text>
      </Text>

      {/* Subtítulo */}
      <Text style={[estilos.dossieSubtitulo, eMobile && estilos.dossieSubtituloMobile]}>
        {'O Orbital Academy pega o que a NASA e o INPE já enxergam lá de cima. Risco em lavoura, foco de calor, déficit hídrico e coloca na mão de quem precisa decidir o que fazer com isso!\nUm modelo prevê. Um otimizador aloca. Você opera. O satélite finalmente chega em campo.'}
      </Text>

      <Text style={[estilos.dossieSubtitulo, eMobile && estilos.dossieSubtituloMobile]}>
        {'A plataforma não substitui o especialista técnico: ela torna a capacidade de decidir com dado espacial acessível para qualquer operador, qualquer produtor rural, qualquer equipe de campo que antes ficava de fora desse ciclo por falta de formação específica ou de ferramentas adequadas.'}
      </Text>

      {/* Seção 02 — Como funciona (carrossel) */}
      <View style={estilos.secao02Layout}>
        {/* Coluna esquerda */}
        <View style={estilos.secao02Esquerda}>
          <View style={estilos.dossieCardTopo}>
            <View style={estilos.dossieCardBadge}>
              <Text style={estilos.dossieCardBadgeTexto}>02</Text>
            </View>
            <Text style={[estilos.dossieCardTitulo, { fontSize: 26, lineHeight: 34 }]}>Como funciona?</Text>
          </View>
          <CarrosselNav slides={slidesCarrossel} indice={indiceCarrossel} irPara={irParaSlide} />
        </View>

        {/* Coluna direita — cards até a borda */}
        <View style={estilos.secao02Direita}>
          <CarrosselCards slides={slidesCarrossel} indice={indiceCarrossel} animX={animXCarrossel} />
        </View>
      </View>

      {/* Seção 03 — Por que isso importa (dropdowns) */}


    </Animated.View>
  );
}

function SecaoAccordion({ id, rotulo, titulo, texto, tags, atraso = 0 }) {
  const [aberta, setAberta] = useState(false);
  const animAltura = useRef(new Animated.Value(0)).current;
  const animOpacidade = useRef(new Animated.Value(0)).current;
  const animEntrada = useRef(new Animated.Value(20)).current;
  const animEntradaOp = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(animEntrada, { toValue: 0, duration: 400, delay: atraso, useNativeDriver: true }),
      Animated.timing(animEntradaOp, { toValue: 1, duration: 400, delay: atraso, useNativeDriver: true }),
    ]).start();
  }, []);

  function alternar() {
    const abrindo = !aberta;
    setAberta(abrindo);
    Animated.parallel([
      Animated.timing(animAltura, {
        toValue: abrindo ? 1 : 0,
        duration: 380,
        easing: abrindo ? Easing.out(Easing.cubic) : Easing.in(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.timing(animOpacidade, {
        toValue: abrindo ? 1 : 0,
        duration: abrindo ? 320 : 200,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }),
    ]).start();
  }

  const alturaConteudo = animAltura.interpolate({
    inputRange: [0, 1],
    outputRange: [0, tags.length > 0 ? 160 : 110],
  });

  return (
    <Animated.View
      style={[
        estilos.secaoItem,
        aberta && estilos.secaoItemAberta,
        { opacity: animEntradaOp, transform: [{ translateY: animEntrada }] },
      ]}
    >
      <Pressable style={estilos.secaoCabecalho} onPress={alternar}>
        <View style={estilos.secaoEsquerda}>
          <Text style={estilos.secaoId}>{id}</Text>
          <Text style={estilos.secaoRotulo}>{rotulo}</Text>
        </View>
        <Text style={[estilos.secaoTitulo]}>{titulo}</Text>
        <Ionicons
          name={aberta ? 'chevron-up-outline' : 'chevron-down-outline'}
          size={16}
          color="#475569"
          style={{ marginLeft: 12 }}
        />
      </Pressable>

      <Animated.View style={{ height: alturaConteudo, overflow: 'hidden' }}>
        <Animated.View style={[estilos.secaoCorpo, { opacity: animOpacidade }]}>
          <Text style={estilos.secaoTexto}>{texto}</Text>
          {tags.length > 0 && (
            <View style={estilos.tagsRow}>
              {tags.map((tag) => (
                <View key={tag} style={estilos.tag}>
                  <Text style={estilos.tagTexto}>{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
}

function SetaScroll({ aoClicar }) {
  const animY = useRef(new Animated.Value(0)).current;
  const animOp = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animOp, {
      toValue: 1,
      duration: 600,
      delay: 900,
      useNativeDriver: true,
    }).start();

    const bounce = () => {
      Animated.sequence([
        Animated.timing(animY, { toValue: 8, duration: 600, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(animY, { toValue: 0, duration: 600, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ]).start(() => bounce());
    };
    setTimeout(bounce, 900);
  }, []);

  return (
    <Animated.View style={[estilos.setaContainer, { opacity: animOp, transform: [{ translateY: animY }] }]}>
      <Pressable onPress={aoClicar} hitSlop={16}>
        <Ionicons name="chevron-down-outline" size={22} color="#475569" />
      </Pressable>
    </Animated.View>
  );
}

function ItemEtapa({ numero, rotulo, atraso = 0 }) {
  const animY = useRef(new Animated.Value(16)).current;
  const animOpacidade = useRef(new Animated.Value(0)).current;
  const animBrilho = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(animY, { toValue: 0, duration: 400, delay: atraso, useNativeDriver: true }),
      Animated.timing(animOpacidade, { toValue: 1, duration: 400, delay: atraso, useNativeDriver: true }),
    ]).start();
  }, []);

  function aoEntrar() {
    Animated.timing(animBrilho, { toValue: 1, duration: 180, useNativeDriver: false }).start();
  }
  function aoSair() {
    Animated.timing(animBrilho, { toValue: 0, duration: 180, useNativeDriver: false }).start();
  }

  const corBorda = animBrilho.interpolate({
    inputRange: [0, 1],
    outputRange: ['#ffffff20', '#208AEF90'],
  });
  const corFundo = animBrilho.interpolate({
    inputRange: [0, 1],
    outputRange: ['transparent', '#208AEF15'],
  });

  const hoverProps =
    Platform.OS === 'web'
      ? { onMouseEnter: aoEntrar, onMouseLeave: aoSair }
      : { onPressIn: aoEntrar, onPressOut: aoSair };

  return (
    <Animated.View style={{ opacity: animOpacidade, transform: [{ translateY: animY }] }}>
      <Animated.View
        style={[estilos.etapa, { borderColor: corBorda, backgroundColor: corFundo }]}
        {...hoverProps}
      >
        <Text style={estilos.etapaNumero}>{numero}</Text>
        <Text style={estilos.etapaRotulo}>{rotulo}</Text>
      </Animated.View>
    </Animated.View>
  );
}

export default function Home() {
  const [ativo, setAtivo] = useState('home');
  const { width, height } = useWindowDimensions();
  const eMobile = width < 768;
  const mostrarHome = ativo === 'home';
  const scrollRef = useRef(null);

  return (
    <View style={estilos.container}>
      {!eMobile && (
        <Sidebar ativo={ativo} aoSelecionar={setAtivo} />
      )}

      <View style={estilos.conteudo}>
        {/* Fundo espacial */}
        <View style={estilos.fundoEspacial} pointerEvents="none">
          {estrelas.map((e) => (
            <Estrela key={e.id} {...e} />
          ))}
        </View>

        {/* Cabeçalho */}
        <View style={estilos.cabecalho}>
          <View style={estilos.cabecalhoEsquerda}>
            <View style={estilos.badgePill}>
              <View style={estilos.badgePonto} />
              <Text style={estilos.badgeTexto}>Global Solution FIAP · Space Connect · 2026.1</Text>
            </View>
          </View>
        </View>

        {mostrarHome ? (
          <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false} style={{ flex: 1 }}>

            {/* Hero — ocupa 100% da tela */}
            <View style={[estilos.hero, { minHeight: height }]}>
              <Text style={[estilos.titulo, eMobile && estilos.tituloMobile]}>
                Operar é aprender.{'\n'}Decidir é o impacto.
              </Text>

              <Text style={[estilos.subtitulo, eMobile && estilos.subtituloMobile]}>
                O Orbital Academy é uma plataforma que ensina qualquer pessoa a
                transformar dado espacial em decisão real!
              </Text>

              <View style={[estilos.barraEtapas, eMobile && estilos.barraEtapasMobile]}>
                {etapas.map((etapa, indice) => (
                  <View key={etapa.numero} style={estilos.etapaGrupo}>
                    <ItemEtapa numero={etapa.numero} rotulo={etapa.rotulo} atraso={indice * 80} />
                    {indice < etapas.length - 1 && (
                      <Text style={estilos.etapaSeta}>→</Text>
                    )}
                  </View>
                ))}
              </View>

              <SetaScroll aoClicar={() => scrollRef.current?.scrollTo({ y: height, animated: true })} />
            </View>

            {/* Seções — abaixo do fold */}
            <View style={[estilos.accordion, eMobile && estilos.accordionMobile]}>
              <SecaoPrincipal atraso={0} eMobile={eMobile} alturaJanela={height} />
              {secoes.map((s, i) => (
                <SecaoAccordion key={s.id} {...s} atraso={80 + i * 80} />
              ))}
            </View>

          </ScrollView>
        ) : (
          <View style={estilos.telaVazia}>
            <Text style={estilos.telaVaziaTexto}>{ativo}</Text>
          </View>
        )}
      </View>

    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#050810',
  },
  conteudo: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },

  // Fundo espacial
  fundoEspacial: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  
  arcoWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 320,
    alignItems: 'center',
    overflow: 'hidden',
  },

  // Cabeçalho
  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 12,
    zIndex: 10,
  },
  cabecalhoEsquerda: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  botaoAbrirSidebar: {
    padding: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffffff15',
  },
  botaoAbrirTexto: {
    color: '#64748B',
    fontSize: 16,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#ffffff20',
    borderRadius: 100,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  badgePonto: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#208AEF',
  },
  badgeTexto: {
    color: '#94A3B8',
    fontSize: 12,
    fontFamily: fonts.body,
  },
  botaoEntrar: {
    borderWidth: 1,
    borderColor: '#ffffff30',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  botaoEntrarTexto: {
    color: '#F8FAFC',
    fontSize: 14,
    fontFamily: fonts.bodySemiBold,
  },

  // Hero
  hero: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 40,
    zIndex: 5,
  },
  badgePillCentral: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#ffffff20',
    borderRadius: 100,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginBottom: 32,
  },
  titulo: {
    color: '#F8FAFC',
    fontSize: 56,
    fontFamily: fonts.titleBlack,
    textAlign: 'center',
    lineHeight: 64,
    letterSpacing: -1,
    marginBottom: 24,
  },
  tituloMobile: {
    fontSize: 36,
    lineHeight: 44,
  },
  subtitulo: {
    color: '#64748B',
    fontSize: 16,
    fontFamily: fonts.body,
    textAlign: 'center',
    lineHeight: 26,
    maxWidth: 540,
    marginBottom: 60,
  },
  subtituloMobile: {
    fontSize: 14,
  },

  // Etapas — sem container/borda
  barraEtapas: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
  },
  barraEtapasMobile: {
    gap: 2,
  },
  etapaGrupo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  etapa: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
  },
  etapaNumero: {
    color: '#475569',
    fontSize: 11,
  },
  etapaRotulo: {
    color: '#CBD5E1',
    fontSize: 13,
    fontFamily: fonts.bodySemiBold,
  },
  etapaSeta: {
    color: '#334155',
    fontSize: 12,
  },

  // Seta scroll
  setaContainer: {
    marginTop: 16,
    alignItems: 'center',
  },


  // Accordion
  accordion: {
    width: '100%',
    gap: 6,
    paddingHorizontal: 32,
    paddingBottom: 80,
  },
  accordionMobile: {
    paddingHorizontal: 16,
  },
  secaoItem: {
    borderWidth: 1,
    borderColor: '#ffffff0D',
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#0D1117',
  },
  secaoItemAberta: {
    borderColor: '#208AEF20',
    backgroundColor: '#0D1420',
  },
  secaoCabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 22,
    paddingHorizontal: 24,
    gap: 14,
  },
  secaoEsquerda: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minWidth: 170,
  },
  secaoId: {
    color: '#208AEF',
    fontSize: 11,
    fontWeight: '700',
  },
  secaoRotulo: {
    color: '#334155',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  secaoTitulo: {
    flex: 1,
    color: '#E2E8F0',
    fontSize: 15,
    fontWeight: '600',
  },
  secaoCorpo: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 4,
    gap: 18,
  },
  secaoTexto: {
    color: '#64748B',
    fontSize: 14,
    lineHeight: 24,
    maxWidth: 580,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    borderWidth: 1,
    borderColor: '#ffffff12',
    borderRadius: 6,
    paddingVertical: 5,
    paddingHorizontal: 12,
    backgroundColor: '#ffffff05',
  },
  tagTexto: {
    color: '#94A3B8',
    fontSize: 12,
  },

  // Seção - O que é Orbital Academy
  dossieContainer: {
    gap: 28,
  },
  dossieTopo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dossieRotuloEsquerda: {
    color: '#208AEF',
    fontSize: 11,
    fontFamily: fonts.bodyBold,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  dossieRotuloDireita: {
    color: '#334155',
    fontSize: 11,
    fontFamily: fonts.bodySemiBold,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  dossieTitulo: {
    color: '#F1F5F9',
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 44,
    letterSpacing: -0.5,
  },
  dossieTituloMobile: {
    fontSize: 22,
    lineHeight: 32,
  },
  dossieTituloGrande: {
    color: '#F1F5F9',
    fontSize: 42,
    fontFamily: fonts.titleBlack,
    lineHeight: 54,
    letterSpacing: -1,
  },
  dossieTituloGrandeMobile: {
    fontSize: 26,
    lineHeight: 36,
  },
  dossieSubtitulo: {
    color: '#64748B',
    fontSize: 14,
    fontFamily: fonts.body,
    lineHeight: 24,
    maxWidth: 1800,
  },
  dossieSubtituloMobile: {
    fontSize: 13,
    lineHeight: 22,
  },
  destaqueCiano: {
    color: '#38BDF8',
  },
  dossieCards: {
    flexDirection: 'row',
    gap: 16,
  },
  dossieCardsMobile: {
    flexDirection: 'column',
  },
  dossieCard: {
    borderWidth: 1,
    borderColor: '#ffffff10',
    borderRadius: 14,
    backgroundColor: '#0D1117',
    padding: 24,
    gap: 16,
  },
  dossieCardTopo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dossieCardBadge: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#ffffff0A',
    borderWidth: 1,
    borderColor: '#ffffff15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dossieCardBadgeTexto: {
    color: '#94A3B8',
    fontSize: 11,
    fontFamily: fonts.bodyBold,
  },
  dossieCardTitulo: {
    color: '#E2E8F0',
    fontSize: 16,
    fontFamily: fonts.titleBold,
  },
  dossieCardTexto: {
    color: '#64748B',
    fontSize: 13,
    fontFamily: fonts.body,
    lineHeight: 22,
  },

  

  // Timeline accordion extras
  timelineItemWrapper: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 16,
    gap: 8,
  },
  timelineItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  timelineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timelineLorem: {
    color: '#334155',
    fontSize: 12,
    fontFamily: fonts.body,
    lineHeight: 18,
    marginTop: 8,
  },

  // Seção 02 - Carrossel / Divisão 
  secao02Layout: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 0,
    marginTop: 100,
  },
  secao02Esquerda: {
    width: 280,
    gap: 16,
    paddingRight: 24,
    paddingBottom: 24,
    justifyContent: 'flex-end',
  },
  secao02Direita: {
    flex: 1,
    overflow: 'hidden',
  },


  // Seção 02 - Carrossel
  carrosselWrapper: {
    gap: 20,
  },
  carrosselOverflow: {
    overflow: 'hidden',
    flex: 1,
  },
  carrosselTrilha: {
    flexDirection: 'row',
    gap: CARD_GAP,
  },
  carrosselCard: {
    width: CARD_W,
    height: 400,
    borderRadius: 14,
    backgroundColor: '#0a0f1a',
    borderWidth: 1,
    borderColor: '#ffffff0D',
    overflow: 'hidden',
    position: 'relative',
    opacity: 0.45,
  },
  carrosselCardAtivo: {
    opacity: 1,
    borderColor: '#208AEF30',
  },
  carrosselCardBody: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0a0f1a',
  },
  carrosselCardFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 140,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    gap: 8,
    backgroundColor: '#0D1117',
  },
  carrosselCardTitulo: {
    color: '#E2E8F0',
    fontSize: 26,
    fontFamily: fonts.titleBold,
    lineHeight: 34,
  },
  carrosselCardDescricao: {
    color: '#94A3B8',
    fontSize: 14,
    fontFamily: fonts.body,
    lineHeight: 22,
  },
  carrosselControles: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  carrosselBtnCirculo: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#ffffff20',
    backgroundColor: '#0D1117',
    alignItems: 'center',
    justifyContent: 'center',
  },
  carrosselBtnAtivo: {
    backgroundColor: '#208AEF',
    borderColor: '#208AEF',
  },
  carrosselBtnDesativado: {
    opacity: 0.3,
  },
  carrosselPontos: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    marginLeft: 4,
  },
  carrosselPonto: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#1e293b',
  },
  carrosselPontoAtivo: {
    width: 20,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#208AEF',
  },

  
  // legado (não usado, mantido por segurança)
  carrosselContainer: { gap: 0 },
  carrosselSlide: { gap: 0 },
  carrosselBadge: { flexDirection: 'row' },
  carrosselBadgeTitulo: { color: '#E2E8F0' },
  carrosselTexto: { color: '#64748B' },
  carrosselBotoes: { flexDirection: 'row' },
  carrosselBtn: { width: 28, height: 28, borderRadius: 6 },

  // Quote
  quoteBox: {
    borderWidth: 1,
    borderColor: '#208AEF30',
    borderRadius: 10,
    backgroundColor: '#208AEF08',
    padding: 16,
  },
  quoteTexto: {
    color: '#94A3B8',
    fontSize: 13,
    fontFamily: fonts.body,
    lineHeight: 22,
  },

  // Tela vazia
  telaVazia: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  telaVaziaTexto: {
    color: '#334155',
    fontSize: 18,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});
