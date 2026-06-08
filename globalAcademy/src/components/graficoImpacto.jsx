import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Line, Polyline, Text as SvgText } from 'react-native-svg';
import { fonts } from '../styles/fonts';

const COR_SEM_ACAO = '#EF4444';
const COR_COM_ACAO = '#22C55E';

export default function GraficoImpacto({ semAcao, comAcao, rotulosX, marcasY, yMax }) {
  const [dim, setDim] = useState({ l: 0, a: 0 });

  function aoMedir(evento) {
    const { width, height } = evento.nativeEvent.layout;
    setDim({ l: width, a: height });
  }

  const padE = 34;
  const padD = 16;
  const padT = 16;
  const padB = 26;

  const areaL = dim.l - padE - padD;
  const areaA = dim.a - padT - padB;
  const n = rotulosX.length;

  const px = (i) => padE + (n === 1 ? 0 : (i / (n - 1)) * areaL);
  const py = (v) => padT + ((yMax - v) / yMax) * areaA;

  const pontos = (serie) => serie.map((v, i) => `${px(i)},${py(v)}`).join(' ');

  return (
    <View style={estilos.area} onLayout={aoMedir}>
      {dim.l > 0 && (
        <Svg width={dim.l} height={dim.a}>
          {marcasY.map((m) => (
            <Line key={m} x1={padE} y1={py(m)} x2={dim.l - padD} y2={py(m)} stroke="#ffffff0A" strokeWidth={1} />
          ))}
          {marcasY.map((m) => (
            <SvgText key={`r-${m}`} x={padE - 8} y={py(m) + 4} fill="#475569" fontSize={11} fontFamily={fonts.body} textAnchor="end">
              {m}
            </SvgText>
          ))}

          <Polyline
            points={pontos(semAcao)}
            fill="none"
            stroke={COR_SEM_ACAO}
            strokeWidth={2.5}
            strokeDasharray="7 5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <Polyline points={pontos(comAcao)} fill="none" stroke={COR_COM_ACAO} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />

          {semAcao.map((v, i) => (
            <Circle key={`s-${i}`} cx={px(i)} cy={py(v)} r={3} fill={COR_SEM_ACAO} />
          ))}
          {comAcao.map((v, i) => (
            <Circle key={`c-${i}`} cx={px(i)} cy={py(v)} r={3} fill={COR_COM_ACAO} />
          ))}

          {rotulosX.map((rotulo, i) => (
            <SvgText key={rotulo} x={px(i)} y={dim.a - 7} fill="#475569" fontSize={11} fontFamily={fonts.body} textAnchor="middle">
              {rotulo}
            </SvgText>
          ))}
        </Svg>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  area: {
    flex: 1,
    minHeight: 240,
  },
});
