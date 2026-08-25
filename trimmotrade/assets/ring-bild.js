/* =====================================================================
   TrimmoTrade – Der Ringtausch als Bild

   Erklärt wurde der Ringtausch bisher in Sätzen. Sätze reichen dafür
   nicht: Wer zum ersten Mal davon hört, stellt sich einen Tausch zwischen
   zwei Leuten vor und stolpert genau an der Stelle, an der es interessant
   wird – dass niemand die Wohnung dessen bekommt, dem er die eigene gibt.

   Deshalb hier vier Bilder statt eines Absatzes. Sie sind gezeichnet, nicht
   geladen: reines SVG, das die Farben der Oberfläche übernimmt und in hell
   wie dunkel funktioniert.
   ===================================================================== */
(function (TT) {
  'use strict';

  const U = TT.util;

  /* Beispielhaushalte. Bewusst mit Zahlen, die den Grund sichtbar machen:
     Anna braucht mehr Platz, Ben weniger, Carla will in eine andere Stadt.
     Zwei von ihnen könnten nie direkt tauschen. */
  const LEUTE = [
    { name: 'Anna', hat: '2 Zi. · 58 m²', wo: 'Köln-Ehrenfeld', miete: '640 €', will: 'mehr Platz fürs Kind' },
    { name: 'Ben', hat: '4 Zi. · 96 m²', wo: 'Köln-Sülz', miete: '1.180 €', will: 'kleiner nach dem Auszug der Kinder' },
    { name: 'Carla', hat: '3 Zi. · 74 m²', wo: 'Bonn-Nordstadt', miete: '890 €', will: 'näher an die neue Arbeit' }
  ];

  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  /* ------------------------- Bausteine ------------------------- */

  /* Die Wohnung als Karte mit Kopfstreifen. Der Streifen trägt den Namen –
     früher schwebte er als Schild darüber, und die Pfeilspitzen der Kette
     liefen genau dort hinein. Innen liegend kollidiert nichts mehr. */
  const KARTE = { w: 176, h: 100, kopf: 28 };

  function wohnung(x, y, p, opt) {
    const o = opt || {};
    const w = KARTE.w, hh = KARTE.h, kh = KARTE.kopf;
    const rand = o.aktiv ? 'var(--akzent)' : 'var(--rand-stark)';
    const flaeche = o.aktiv ? 'var(--akzent-hell)' : 'var(--flaeche2)';
    const kopfFarbe = o.kopfFarbe || 'var(--akzent2)';
    return '<g class="ringbild__wohnung">' +
      '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + hh + '" rx="12" ' +
      'fill="' + flaeche + '" stroke="' + rand + '" stroke-width="' + (o.aktiv ? 2.4 : 1.4) + '"/>' +
      /* Kopfstreifen: oben rund, unten gerade – zwei Formen übereinander. */
      '<path d="M' + x + ' ' + (y + kh) + 'V' + (y + 12) + 'a12 12 0 0 1 12 -12h' + (w - 24) +
      'a12 12 0 0 1 12 12v' + (kh - 12) + 'z" fill="' + kopfFarbe + '"/>' +
      '<text x="' + (x + w / 2) + '" y="' + (y + 19) + '" text-anchor="middle" class="ringbild__schild">' +
      esc(o.kopf || p.name + ' wohnt hier') + '</text>' +
      '<text x="' + (x + 14) + '" y="' + (y + kh + 22) + '" class="ringbild__gross">' + esc(p.hat) + '</text>' +
      '<text x="' + (x + 14) + '" y="' + (y + kh + 41) + '" class="ringbild__klein">' + esc(p.wo) + '</text>' +
      '<text x="' + (x + 14) + '" y="' + (y + kh + 59) + '" class="ringbild__klein">' + esc(p.miete) + ' warm</text>' +
      '</g>';
  }

  /* Bogen von einem Punkt zum anderen, mit Beschriftung an der Mitte. */
  function bogen(a, b, opt) {
    const o = opt || {};
    const dx = b.x - a.x, dy = b.y - a.y;
    const len = Math.hypot(dx, dy) || 1;
    /* Der Kontrollpunkt sitzt seitlich der Verbindungsgeraden – dadurch
       laufen Hin- und Rückweg nicht übereinander. */
    const kruemmung = o.kruemmung === undefined ? 0.22 : o.kruemmung;
    const mx = (a.x + b.x) / 2 - dy / len * len * kruemmung;
    const my = (a.y + b.y) / 2 + dx / len * len * kruemmung;
    const farbe = o.blass ? 'var(--rand-stark)' : 'var(--akzent)';
    const breite = o.blass ? 1.6 : 2.6;
    let s = '<path d="M' + a.x + ' ' + a.y + 'Q' + mx.toFixed(0) + ' ' + my.toFixed(0) + ' ' + b.x + ' ' + b.y + '" ' +
      'fill="none" stroke="' + farbe + '" stroke-width="' + breite + '" ' +
      (o.gestrichelt ? 'stroke-dasharray="7 6" ' : '') + 'marker-end="url(#rb-spitze)"/>';
    if (o.text) {
      const tx = (a.x + b.x) / 4 + mx / 2, ty = (a.y + b.y) / 4 + my / 2;
      const br = o.text.length * 6.4 + 16;
      s += '<rect x="' + (tx - br / 2) + '" y="' + (ty - 11) + '" width="' + br + '" height="21" rx="10" ' +
        'fill="var(--flaeche)" stroke="' + farbe + '" stroke-width="1"/>' +
        '<text x="' + tx + '" y="' + (ty + 4) + '" text-anchor="middle" class="ringbild__kante">' + esc(o.text) + '</text>';
    }
    return s;
  }

  function rahmen(inhalt, hoehe) {
    return '<svg class="ringbild" viewBox="0 0 560 ' + hoehe + '" role="img" preserveAspectRatio="xMidYMid meet">' +
      '<defs><marker id="rb-spitze" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" ' +
      'orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="context-stroke"/></marker></defs>' +
      inhalt + '</svg>';
  }

  /* ------------------------- Die vier Bilder ------------------------- */

  /* 1. Warum der direkte Tausch fast nie klappt. */
  function bildDirekt() {
    /* Zwischen den beiden Karten bleiben nur gut 150 Pixel. Eine
       Beschriftung mitten auf dem Pfeil deckte dort die Spitze zu und
       stieß an die zweite – deshalb hier gerade Linien mit der Schrift
       darüber statt Bögen mit Schrift darin. */
    const A = { x: 26, y: 56 }, B = { x: 358, y: 56 };
    const linie = (x1, x2, y) =>
      '<path d="M' + x1 + ' ' + y + 'H' + x2 + '" stroke="var(--akzent)" stroke-width="2.6" ' +
      'marker-end="url(#rb-spitze)"/>';
    const wort = (t, y) =>
      '<text x="280" y="' + y + '" text-anchor="middle" class="ringbild__kante">' + esc(t) + '</text>';
    let s = '';
    s += wohnung(A.x, A.y, LEUTE[0]);
    s += wohnung(B.x, B.y, LEUTE[1]);
    s += wort('Anna zieht zu Ben', 92) + linie(212, 348, 106);
    s += wort('Ben zieht zu Anna', 134) + linie(348, 212, 148);
    s += '<text x="280" y="28" text-anchor="middle" class="ringbild__titel">Der direkte Tausch</text>';
    s += '<text x="280" y="204" text-anchor="middle" class="ringbild__fuss">Dafür müssen zwei Menschen genau das Gegenteil</text>';
    s += '<text x="280" y="224" text-anchor="middle" class="ringbild__fuss">voneinander wollen. Das passiert fast nie.</text>';
    return rahmen(s, 244);
  }

  /* 2. Die Kette: jeder muss nur die Wohnung des Nächsten wollen. */
  /* Dreieck: oben links, oben rechts, unten mittig. */
  const DREI = [{ x: 20, y: 48 }, { x: 364, y: 48 }, { x: 192, y: 246 }];
  const mitte = (i) => ({ x: DREI[i].x + KARTE.w / 2, y: DREI[i].y + KARTE.h / 2 });

  /* Ansatzpunkt am Kartenrand: sonst steckt die Spitze in der Fläche.
     Waagerecht ist mehr Luft nötig als senkrecht, weil die Karten breit
     und flach sind. */
  const randPunkt = (i, j, luft) => {
    const a = mitte(i), b = mitte(j);
    const dx = b.x - a.x, dy = b.y - a.y, l = Math.hypot(dx, dy) || 1;
    const zu = luft || 0;
    return { x: Math.round(a.x + dx / l * (KARTE.w / 2 + 22 + zu)),
      y: Math.round(a.y + dy / l * (KARTE.h / 2 + 16 + zu)) };
  };

  function bildKette(hervor) {
    let s = '';
    [0, 1, 2].forEach((i) => {
      s += wohnung(DREI[i].x, DREI[i].y, LEUTE[i], { aktiv: hervor === i });
    });
    [0, 1, 2].forEach((i) => {
      const j = (i + 1) % 3;
      s += bogen(randPunkt(i, j), randPunkt(j, i), {
        text: hervor === i || hervor === undefined ? LEUTE[i].name + ' → ' + LEUTE[j].name : '',
        blass: hervor !== undefined && hervor !== i,
        kruemmung: 0.1
      });
    });
    s += '<text x="280" y="28" text-anchor="middle" class="ringbild__titel">Die Kette</text>';
    s += '<text x="280" y="384" text-anchor="middle" class="ringbild__fuss">Niemand tauscht mit der Person, der er die eigene Wohnung übergibt.</text>';
    s += '<text x="280" y="404" text-anchor="middle" class="ringbild__fuss">Jede muss nur die Wohnung der nächsten Person wollen.</text>';
    return rahmen(s, 422);
  }

  /* 3. Der Umzugstag: alle ziehen gleichzeitig. */
  function bildUmzug() {
    let s = '';
    [0, 1, 2].forEach((i) => {
      const rein = LEUTE[(i + 2) % 3];   /* wer hier einzieht */
      s += wohnung(DREI[i].x, DREI[i].y, LEUTE[i], {
        aktiv: true, kopfFarbe: 'var(--gut)', kopf: rein.name + ' zieht ein'
      });
      s += '<text x="' + (DREI[i].x + KARTE.w / 2) + '" y="' + (DREI[i].y + KARTE.h + 18) + '" ' +
        'text-anchor="middle" class="ringbild__klein">' + esc(LEUTE[i].name) + ' zieht aus</text>';
    });
    [0, 1, 2].forEach((i) => {
      const j = (i + 1) % 3;
      s += bogen(randPunkt(i, j, 10), randPunkt(j, i, 10), { kruemmung: 0.1, gestrichelt: true });
    });
    s += '<text x="280" y="28" text-anchor="middle" class="ringbild__titel">Der Umzugstag</text>';
    s += '<text x="280" y="398" text-anchor="middle" class="ringbild__fuss">Alle drei Umzüge fallen in dieselbe Woche – sonst zahlt jemand doppelt Miete.</text>';
    return rahmen(s, 420);
  }

  /* 4. Was ein Ring braucht, damit er hält. */
  function bildBedingungen() {
    const punkte = [
      ['Alle sagen zu', 'Ein Wackelkandidat reißt die ganze Kette.'],
      ['Jede Vermieterseite stimmt zu', 'Einen Anspruch darauf gibt es nicht.'],
      ['Termine liegen beieinander', 'Sonst läuft irgendwo eine Miete doppelt.'],
      ['Für jede Wohnung ein neuer Vertrag', 'Rechtlich ist es kein Tausch. Alte Konditionen laufen nicht mit.']
    ];
    let s = '<text x="280" y="28" text-anchor="middle" class="ringbild__titel">Damit die Kette hält</text>';
    punkte.forEach((p, i) => {
      const y = 62 + i * 62;
      s += '<circle cx="46" cy="' + (y + 12) + '" r="17" fill="var(--gut-hell)"/>' +
        '<path d="M38 ' + (y + 12) + 'l6 6 12 -13" fill="none" stroke="var(--gut)" stroke-width="2.6" ' +
        'stroke-linecap="round" stroke-linejoin="round"/>' +
        '<text x="78" y="' + (y + 8) + '" class="ringbild__gross">' + esc(p[0]) + '</text>' +
        '<text x="78" y="' + (y + 28) + '" class="ringbild__klein">' + esc(p[1]) + '</text>';
    });
    return rahmen(s, 316);
  }

  /* ------------------------- Die Abfolge ------------------------- */

  const SCHRITTE = [
    {
      titel: 'Warum der direkte Tausch fast nie klappt',
      bild: bildDirekt,
      text: 'Anna hat zwei Zimmer und braucht mehr Platz. Ben hat vier und braucht weniger. Die beiden könnten '
        + 'tauschen – aber nur, weil sich hier zufällig genau zwei Menschen mit genau gegenläufigen Wünschen '
        + 'begegnet sind. In einer Stadt mit tausenden Wohnungen passiert das so gut wie nie.'
    },
    {
      titel: 'In der Kette reicht ein Wunsch je Person',
      bild: () => bildKette(),
      text: 'Kommt Carla dazu, muss niemand mehr das Gegenteil des anderen wollen. Anna zieht in Bens Wohnung, '
        + 'Ben in Carlas, Carla in Annas. Jede bekommt, was sie sucht – und keine tauscht mit der Person, der '
        + 'sie die eigene Wohnung übergibt. Genau das macht den Unterschied.'
    },
    {
      titel: 'Alle ziehen am selben Tag',
      bild: bildUmzug,
      text: 'Eine Kette funktioniert nur geschlossen: Jede Wohnung wird frei, weil eine andere frei wird. '
        + 'Deshalb liegen die Umzüge beieinander. TrimmoTrade sucht solche geschlossenen Ketten über zwei, drei '
        + 'und vier Haushalte automatisch im gesamten Bestand – von Hand findet sie niemand.'
    },
    {
      titel: 'Damit die Kette hält',
      bild: bildBedingungen,
      text: 'Ein Ring ist rechtlich kein Tausch, sondern für jede Wohnung ein neuer Mietvertrag. Und er steht '
        + 'und fällt mit den Zustimmungen. TrimmoTrade zeigt bei jeder gefundenen Kette, wie viele davon schon '
        + 'vorliegen und welches Glied das schwächste ist.'
    }
  ];

  TT.ringBild = { SCHRITTE, bildDirekt, bildKette, bildUmzug, bildBedingungen, LEUTE };
})(window.TT = window.TT || {});
