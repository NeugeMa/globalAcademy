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

const imgParallax = require('../../assets/nasa-Q1p7bh3SHj8-unsplash.jpg');
const imgPersonas = require('../../assets/premium_photo-1679756099079-84d8ab833a3f.avif');

const personasData = [
  {
    id: 'produtor',
    rotulo: 'Persona 01',
    titulo: 'Pequeno produtor rural',
    descricao: 'Vê a lavoura do chão, não do céu. Sabe que tem um problema mas não sabe em qual área agir primeiro com os recursos que tem. \n\nO satélite está disponível, mas o caminho entre o dado e a ação ainda é longo demais para quem não é especialista.',
  },
  {
    id: 'defesa',
    rotulo: 'Persona 02',
    titulo: 'Equipe da Defesa Civil municipal',
    descricao: 'Precisa priorizar risco com equipe e tempo contados. Um município pequeno não tem analista de dados espaciais. \n\n E sim um gestor que precisa decidir em minutos onde mandar a equipe e o equipamento disponível.',
  },
  {
    id: 'saude',
    rotulo: 'Persona 03',
    titulo: 'Agente de saúde em campo',
    descricao: 'Decide rotas e recursos onde o dado raramente chega. O acompanhamento de áreas de risco hídrico ou vetorial por satélite poderia guiar a priorização, mas a capacidade de interpretar e agir sobre esse dado está fora do alcance operacional atual.',
  },
];

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

function SecaoPrincipal({ atraso = 0, alturaJanela = 800 }) {
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
      <Text style={estilos.dossieTituloGrande}>
        Dado espacial em decisão real.{'\n'}
        <Text style={estilos.destaqueCiano}>Sem precisar ser especialista.</Text>
      </Text>

      {/* Subtítulo */}
      <Text style={estilos.dossieSubtitulo}>
        {'O Orbital Academy pega o que a NASA e o INPE já enxergam lá de cima. Risco em lavoura, foco de calor, déficit hídrico e coloca na mão de quem precisa decidir o que fazer com isso!\nUm modelo prevê. Um otimizador aloca. Você opera. O satélite finalmente chega em campo.'}
      </Text>

      <Text style={estilos.dossieSubtitulo}>
        {'A plataforma não substitui o especialista técnico: ela torna a capacidade de decidir com dado espacial acessível para qualquer operador, qualquer produtor rural, qualquer equipe de campo que antes ficava de fora desse ciclo por falta de formação específica ou de ferramentas adequadas.'}
      </Text>

      {/* Seção 02 — Como funciona (carrossel) */}
      <View style={estilos.secao02Layout}>
        <View style={estilos.secao02Esquerda}>
          <View style={estilos.dossieCardTopo}>
            <View style={estilos.dossieCardBadge}>
              <Text style={estilos.dossieCardBadgeTexto}>02</Text>
            </View>
            <Text style={[estilos.dossieCardTitulo, { fontSize: 26, lineHeight: 34 }]}>Como funciona?</Text>
          </View>
          <CarrosselNav slides={slidesCarrossel} indice={indiceCarrossel} irPara={irParaSlide} />
        </View>

        <View style={estilos.secao02Direita}>
          <CarrosselCards slides={slidesCarrossel} indice={indiceCarrossel} animX={animXCarrossel} />
        </View>
      </View>

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

function CardFlip({ persona }) {
  const animFlip = useRef(new Animated.Value(0)).current;

  const frente = animFlip.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });
  const verso = animFlip.interpolate({ inputRange: [0, 1], outputRange: ['-180deg', '0deg'] });

  const hoverProps = Platform.OS === 'web'
    ? {
        onMouseEnter: () => Animated.timing(animFlip, { toValue: 1, duration: 300, easing: Easing.out(Easing.quad), useNativeDriver: true }).start(),
        onMouseLeave: () => Animated.timing(animFlip, { toValue: 0, duration: 300, easing: Easing.out(Easing.quad), useNativeDriver: true }).start(),
      }
    : {};

  return (
    <View style={estilos.flipContainer} {...hoverProps}>
      {/* Frente */}
      <Animated.View style={[estilos.flipFace, { transform: [{ perspective: 1200 }, { rotateY: frente }], backfaceVisibility: 'hidden' }]}>
        <View>
          <Text style={estilos.flipRotulo}>{persona.rotulo}</Text>
          <Text style={estilos.flipTituloFront}>{persona.titulo}</Text>
        </View>
        <View style={estilos.flipHintRow}>
          <Text style={estilos.flipHintTexto}>Ver detalhes</Text>
          <Ionicons name="arrow-forward-outline" size={13} color="#334155" />
        </View>
      </Animated.View>

      {/* Verso */}
      <Animated.View style={[estilos.flipFace, estilos.flipVerso, { transform: [{ perspective: 1200 }, { rotateY: verso }], backfaceVisibility: 'hidden', justifyContent: 'center' }]}>
        <Text style={estilos.flipDescricao}>{persona.descricao}</Text>
      </Animated.View>
    </View>
  );
}

function SecaoTese() {
  return (
    <View style={estilos.secao03Wrapper}>

      {/* Topo */}
      <View style={estilos.dossieTopo}>
        <Text style={estilos.dossieRotuloEsquerda}>TESE E RESULTADO</Text>
        <Text style={estilos.dossieRotuloDireita}>03 / TESE</Text>
      </View>

      <View style={estilos.dossieCardTopo}>
        <View style={estilos.dossieCardBadge}>
          <Text style={estilos.dossieCardBadgeTexto}>03</Text>
        </View>
        <Text style={[estilos.dossieCardTitulo, { fontSize: 26, lineHeight: 34 }]}>Por que isso importa?</Text>
      </View>
      <Text style={estilos.teseBodyText}>
        Dado espacial é abundante, gratuito e cada vez mais preciso. {'\n'}O que ainda é escasso é a capacidade de transformar esse dado em ação sob recurso limitado, em tempo real, por pessoas que não têm formação em sensoriamento remoto.
      </Text>


      {/* Personas */}
      <View style={estilos.personasBlocos}>
        <CardFlip persona={personasData[0]} />
        <CardFlip persona={personasData[1]} />
        <View style={estilos.personaFotoBloco}>
          <Animated.Image source={imgPersonas} style={estilos.personaFotoImg} />
        </View>
        <CardFlip persona={personasData[2]} />
      </View>

    </View>
  );
}

export default function Home() {
  const [ativo, setAtivo] = useState('home');
  const { height } = useWindowDimensions();
  const mostrarHome = ativo === 'home';
  const scrollRef = useRef(null);
  const scrollY = useRef(new Animated.Value(0)).current;

  return (
    <View style={estilos.container}>
      <Sidebar ativo={ativo} aoSelecionar={setAtivo} />

      <View style={estilos.conteudo}>
        <View style={estilos.fundoEspacial} pointerEvents="none">
          {estrelas.map((e) => (
            <Estrela key={e.id} {...e} />
          ))}
        </View>

        <View style={estilos.cabecalho}>
          <View style={estilos.cabecalhoEsquerda}>
            <View style={estilos.badgePill}>
              <View style={estilos.badgePonto} />
              <Text style={estilos.badgeTexto}>Global Solution FIAP · Space Connect · 2026.1</Text>
            </View>
          </View>
        </View>

        {mostrarHome ? (
          <ScrollView
            ref={scrollRef}
            showsVerticalScrollIndicator={false}
            style={{ flex: 1 }}
            onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
            scrollEventThrottle={16}
          >

            <View style={[estilos.hero, { minHeight: height }]}>
              <Text style={estilos.titulo}>
                Operar é aprender.{'\n'}Decidir é o impacto.
              </Text>

              <Text style={estilos.subtitulo}>
                O Orbital Academy é uma plataforma que ensina qualquer pessoa a
                transformar dado espacial em decisão real!
              </Text>

              <View style={estilos.barraEtapas}>
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

            <View style={estilos.secao01Wrapper}>
              <SecaoPrincipal atraso={0} alturaJanela={height} />
            </View>

            {/* Imagem — aparece abaixo da seção 02 */}
            <View style={estilos.parallaxContainer}>
              <Animated.Image
                source={imgParallax}
                style={estilos.parallaxImg}
              />
              {/* Fade superior */}
              <View
                pointerEvents="none"
                style={[
                  estilos.parallaxFadeTopo,
                  Platform.OS === 'web' && {
                    background: 'linear-gradient(to bottom, #050810 0%, transparent 100%)',
                  },
                ]}
              />
              {/* Fade inferior */}
              <View
                pointerEvents="none"
                style={[
                  estilos.parallaxFadeBase,
                  Platform.OS === 'web' && {
                    background: 'linear-gradient(to bottom, transparent 0%, #050810 100%)',
                  },
                ]}
              />
            </View>

            {/* Seção 03 — Tese e Resultado */}
            <SecaoTese />

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

  fundoEspacial: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  parallaxContainer: {
    height: 560,
    overflow: 'hidden',
    marginTop: 80,
    position: 'relative',
  },
  parallaxImg: {
    width: '100%',
    height: 720,
    resizeMode: 'cover',
    marginTop: -80,
  },
  parallaxFadeTopo: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 180,
  },
  parallaxFadeBase: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 220,
  },

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

  hero: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 40,
    zIndex: 5,
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
  subtitulo: {
    color: '#64748B',
    fontSize: 16,
    fontFamily: fonts.body,
    textAlign: 'center',
    lineHeight: 26,
    maxWidth: 540,
    marginBottom: 60,
  },

  barraEtapas: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
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

  setaContainer: {
    marginTop: 16,
    alignItems: 'center',
  },

  secao01Wrapper: {
    width: '100%',
    paddingHorizontal: 32,
    paddingBottom: 80,
  },

  // Seção DOSSIÊ
  dossieContainer: {
    gap: 40,
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
  dossieTituloGrande: {
    color: '#F1F5F9',
    fontSize: 42,
    fontFamily: fonts.titleBlack,
    lineHeight: 54,
    letterSpacing: -1,
  },
  dossieSubtitulo: {
    color: '#64748B',
    fontSize: 15,
    fontFamily: fonts.body,
    lineHeight: 28,
    maxWidth: 1800,
  },
  destaqueCiano: {
    color: '#38BDF8',
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

  // Seção 02 — layout dividido
  secao02Layout: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 0,
    marginTop: 90,
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

  // Carrossel
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

  secao03Wrapper: {
    marginTop: 160,
    paddingHorizontal: 64,
    paddingBottom: 90,
    gap: 40,
  },


  teseBodyText: {
    color: '#94A3B8',
    fontSize: 16,
    fontFamily: fonts.body,
    lineHeight: 26,
  },
  // Personas — blocos flip
  personasBlocos: {
    flexDirection: 'row',
    gap: 16,
    height: 580,
  },
  personaFotoBloco: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  personaFotoImg: {
    width: '100%',
    height: '70%',
    resizeMode: 'cover',
  },

  // Card flip
  flipContainer: {
    flex: 1,
    height: 400,
    position: 'relative',
  },
  flipFace: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0A0F1A',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ffffff0D',
    padding: 28,
    justifyContent: 'space-between',
  },
  flipVerso: {
    backgroundColor: '#0D1421',
    borderColor: '#208AEF15',
  },
  flipRotulo: {
    color: '#208AEF',
    fontSize: 11,
    fontFamily: fonts.bodyBold,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  flipTituloFront: {
    color: '#E2E8F0',
    fontSize: 30,
    fontFamily: fonts.titleBlack,
    lineHeight: 38,
    letterSpacing: -0.5,
  },
  flipDescricao: {
    color: '#94A3B8',
    fontSize: 15,
    fontFamily: fonts.body,
    lineHeight: 26,
  },
  flipHintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  flipHintTexto: {
    color: '#334155',
    fontSize: 12,
    fontFamily: fonts.bodySemiBold,
  },
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