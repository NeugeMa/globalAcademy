// Monta o logo completo (símbolo + ORBITAL + ACADEMY) a partir dos 3 SVGs soltos.
// Usa <svg> aninhados: cada peça mantém seu viewBox e escala para o slot.
const fs = require('fs');
const path = require('path');

const SRC = 'C:/Users/mneugebauer/Downloads/Logo_0667';
const OUT = path.join(__dirname, '..', 'assets', 'logo-orbital.svg');

function inner(file) {
  let s = fs.readFileSync(path.join(SRC, file), 'utf8');
  s = s.replace(/<\?xml[^>]*\?>/, '');     // tira a declaração XML
  s = s.replace(/<svg[^>]*>/, '');          // tira o <svg ...> de abertura
  s = s.replace(/<\/svg>\s*$/, '');         // tira o </svg> final
  return s.trim();
}

// Larguras/alturas dos slots (master units). Wordmark = 300; símbolo = 300.
const W = 300, PAD = 20;
const hSimbolo = (W * 718) / 1281;   // 168.10
const hOrbital = (W * 40.08) / 389.86; // 30.84
const hAcademy = (W * 22.7) / 386.24;  // 17.63

const ySimbolo = PAD;
const yOrbital = ySimbolo + hSimbolo + 24;
const yAcademy = yOrbital + hOrbital + 10;
const totalH = yAcademy + hAcademy + PAD;
const totalW = W + PAD * 2;

const r = (n) => Number(n.toFixed(2));

const out = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${r(totalW)} ${r(totalH)}" width="${r(totalW)}" height="${r(totalH)}">
  <!-- Símbolo (átomo + órbitas) -->
  <svg x="${PAD}" y="${r(ySimbolo)}" width="${W}" height="${r(hSimbolo)}" viewBox="0 0 1281 718" overflow="visible">
    ${inner('Simbolo.svg')}
  </svg>
  <!-- Palavra ORBITAL -->
  <svg x="${PAD}" y="${r(yOrbital)}" width="${W}" height="${r(hOrbital)}" viewBox="0 0 389.86 40.08">
    ${inner('ORBITALAll_corrigido_v2.svg')}
  </svg>
  <!-- Palavra ACADEMY -->
  <svg x="${PAD}" y="${r(yAcademy)}" width="${W}" height="${r(hAcademy)}" viewBox="0 0 386.24 22.7">
    ${inner('ACADEMYAll_corrigido_v4.svg')}
  </svg>
</svg>
`;

fs.writeFileSync(OUT, out, 'utf8');
console.log('Logo gerado em', OUT);
console.log(`viewBox 0 0 ${r(totalW)} ${r(totalH)}`);
