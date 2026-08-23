/* Prüft die Farbtoken: Kontraste nach WCAG 2.2 und Unterscheidbarkeit der
   Diagrammfarben, auch bei den drei häufigen Farbfehlsichtigkeiten. */
const fs = require('fs');
const css = fs.readFileSync(process.argv[2] || 'nestwerk/assets/app.css', 'utf8');

function tokenBlock(start) {
  const i = css.indexOf(start);
  if (i < 0) throw new Error('Block nicht gefunden: ' + start);
  const ende = css.indexOf('}', i);
  const out = {};
  css.slice(i, ende).replace(/(--[a-z0-9-]+)\s*:\s*([^;]+);/g, (_, k, v) => { out[k] = v.trim(); return ''; });
  return out;
}
const hell = tokenBlock(':root {');
const dunkel = tokenBlock(':root[data-theme="dark"] {');

const zuRgb = (hex) => {
  const m = String(hex).trim().replace('#', '');
  if (!/^[0-9a-f]{6}$/i.test(m)) return null;
  return [0, 2, 4].map((i) => parseInt(m.slice(i, i + 2), 16));
};
const lin = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
const lum = (rgb) => 0.2126 * lin(rgb[0]) + 0.7152 * lin(rgb[1]) + 0.0722 * lin(rgb[2]);
const kontrast = (a, b) => {
  const l1 = lum(a), l2 = lum(b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
};

/* Farbfehlsichtigkeit nach Brettel/Viénot, Matrizen in linearem RGB. */
const CVD = {
  Protanopie: [[0.152, 1.053, -0.205], [0.115, 0.786, 0.099], [-0.004, -0.048, 1.052]],
  Deuteranopie: [[0.367, 0.861, -0.228], [0.280, 0.673, 0.047], [-0.012, 0.043, 0.969]],
  Tritanopie: [[1.256, -0.077, -0.179], [-0.078, 0.931, 0.148], [0.005, 0.691, 0.304]]
};
function simuliere(rgb, m) {
  const l = rgb.map(lin);
  const o = m.map((row) => row[0] * l[0] + row[1] * l[1] + row[2] * l[2]);
  return o.map((v) => {
    v = Math.max(0, Math.min(1, v));
    return Math.round(255 * (v <= 0.0031308 ? v * 12.92 : 1.055 * Math.pow(v, 1 / 2.4) - 0.055));
  });
}

/* CIEDE2000 – die einzige Abstandsformel, die kleinen Unterschieden traut. */
function zuLab(rgb) {
  const [r, g, b] = rgb.map(lin);
  const x = (0.4124 * r + 0.3576 * g + 0.1805 * b) / 0.95047;
  const y = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const z = (0.0193 * r + 0.1192 * g + 0.9505 * b) / 1.08883;
  const f = (t) => t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116;
  return [116 * f(y) - 16, 500 * (f(x) - f(y)), 200 * (f(y) - f(z))];
}
function deltaE(rgb1, rgb2) {
  const [L1, a1, b1] = zuLab(rgb1), [L2, a2, b2] = zuLab(rgb2);
  const rad = Math.PI / 180, deg = 180 / Math.PI;
  const C1 = Math.hypot(a1, b1), C2 = Math.hypot(a2, b2), Cm = (C1 + C2) / 2;
  const G = 0.5 * (1 - Math.sqrt(Math.pow(Cm, 7) / (Math.pow(Cm, 7) + Math.pow(25, 7))));
  const ap1 = (1 + G) * a1, ap2 = (1 + G) * a2;
  const Cp1 = Math.hypot(ap1, b1), Cp2 = Math.hypot(ap2, b2);
  const hp = (b, a) => { if (b === 0 && a === 0) return 0; const x = Math.atan2(b, a) * deg; return x < 0 ? x + 360 : x; };
  const hp1 = hp(b1, ap1), hp2 = hp(b2, ap2);
  const dL = L2 - L1, dC = Cp2 - Cp1;
  let dh = 0;
  if (Cp1 * Cp2 !== 0) { dh = hp2 - hp1; if (dh > 180) dh -= 360; else if (dh < -180) dh += 360; }
  const dH = 2 * Math.sqrt(Cp1 * Cp2) * Math.sin(dh / 2 * rad);
  const Lm = (L1 + L2) / 2, Cpm = (Cp1 + Cp2) / 2;
  let hpm;
  if (Cp1 * Cp2 === 0) hpm = hp1 + hp2;
  else { hpm = (hp1 + hp2) / 2; if (Math.abs(hp1 - hp2) > 180) hpm += (hp1 + hp2 < 360) ? 180 : -180; }
  const T = 1 - 0.17 * Math.cos((hpm - 30) * rad) + 0.24 * Math.cos(2 * hpm * rad)
    + 0.32 * Math.cos((3 * hpm + 6) * rad) - 0.20 * Math.cos((4 * hpm - 63) * rad);
  const dTh = 30 * Math.exp(-Math.pow((hpm - 275) / 25, 2));
  const Rc = 2 * Math.sqrt(Math.pow(Cpm, 7) / (Math.pow(Cpm, 7) + Math.pow(25, 7)));
  const Sl = 1 + 0.015 * Math.pow(Lm - 50, 2) / Math.sqrt(20 + Math.pow(Lm - 50, 2));
  const Sc = 1 + 0.045 * Cpm, Sh = 1 + 0.015 * Cpm * T;
  const Rt = -Math.sin(2 * dTh * rad) * Rc;
  return Math.sqrt(Math.pow(dL / Sl, 2) + Math.pow(dC / Sc, 2) + Math.pow(dH / Sh, 2)
    + Rt * (dC / Sc) * (dH / Sh));
}

const FLAECHEN = ['--papier', '--flaeche', '--flaeche2', '--flaeche3', '--werbung'];
const TEXTE = [
  ['--text', 4.5], ['--text-leise', 4.5], ['--text-still', 4.5],
  ['--akzent', 4.5], ['--gut', 4.5], ['--warn', 4.5], ['--schlecht', 4.5], ['--info', 4.5]
];
/* Schrift auf gefüllter Fläche */
const PAARE = [
  ['--auf-akzent', '--akzent', 4.5], ['--auf-akzent2', '--akzent2', 4.5],
  ['--auf-schlecht', '--schlecht', 4.5],
  ['--gut', '--gut-hell', 4.5], ['--warn', '--warn-hell', 4.5],
  ['--schlecht', '--schlecht-hell', 4.5], ['--info', '--info-hell', 4.5],
  ['--akzent', '--akzent-hell', 4.5],
  /* Ränder von Bedienelementen: WCAG 1.4.11 verlangt 3 zu 1. Für rein
     strukturelle Striche (--rand, --rand-stark) gilt das nicht. */
  ['--rand-feld', '--flaeche', 3], ['--rand-feld', '--flaeche2', 3], ['--rand-feld', '--papier', 3]
];
const VIZ = ['--miete', '--kauf', '--wg', '--tausch'];

let fehler = 0;
for (const [name, T] of [['hell', hell], ['dunkel', dunkel]]) {
  console.log('\n########## ' + name + ' ##########');
  const c = (k) => zuRgb(T[k]);
  for (const [t, min] of TEXTE) {
    for (const f of FLAECHEN) {
      if (!c(t) || !c(f)) continue;
      const v = kontrast(c(t), c(f));
      if (v < min) { console.log('  KONTRAST ' + t + ' auf ' + f + ': ' + v.toFixed(2) + ' < ' + min); fehler++; }
    }
  }
  for (const [a, b, min] of PAARE) {
    if (!c(a) || !c(b)) { console.log('  FEHLT ' + a + ' oder ' + b); fehler++; continue; }
    const v = kontrast(c(a), c(b));
    if (v < min) { console.log('  KONTRAST ' + a + ' auf ' + b + ': ' + v.toFixed(2) + ' < ' + min); fehler++; }
  }
  /* Diagrammfarben: alle Paare, normal und bei Farbfehlsichtigkeit */
  for (let i = 0; i < VIZ.length; i++) {
    for (let j = i + 1; j < VIZ.length; j++) {
      const A = c(VIZ[i]), B = c(VIZ[j]);
      if (!A || !B) continue;
      const proben = [['normal', A, B]].concat(Object.keys(CVD).map((k) => [k, simuliere(A, CVD[k]), simuliere(B, CVD[k])]));
      for (const [art, x, y] of proben) {
        const d = deltaE(x, y);
        if (d < 9) { console.log('  ZU ÄHNLICH ' + VIZ[i] + '/' + VIZ[j] + ' bei ' + art + ': ΔE ' + d.toFixed(1)); fehler++; }
      }
    }
    for (const f of ['--flaeche', '--papier']) {
      const v = kontrast(c(VIZ[i]), c(f));
      if (v < 3) { console.log('  KONTRAST ' + VIZ[i] + ' auf ' + f + ': ' + v.toFixed(2) + ' < 3'); fehler++; }
    }
  }
}
console.log('\n===== ' + fehler + ' Beanstandungen =====');
process.exit(fehler ? 1 : 0);
