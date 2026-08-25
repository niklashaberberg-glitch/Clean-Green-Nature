/* =====================================================================
   TrimmoTrade – Marktdaten
   Wie sich die Mieten je Viertel entwickelt haben. Drei Reihen im
   Vergleich, dazu der Stadtdurchschnitt als ruhige Bezugslinie.

   Die Farben der Reihen sind auf Farbfehlsichtigkeit geprüft (alle
   Paare, hell und dunkel). Zusätzlich trägt jede Linie am Ende ihren
   Namen und es gibt eine Tabellenansicht – beides notwendig, weil eine
   der drei Farben im hellen Modus knapp unter 3:1 Kontrast liegt.
   ===================================================================== */
(function (TT) {
  'use strict';

  const U = TT.util, ui = TT.ui, S = TT.store, W = TT.werkzeuge, P = TT.plan, G = TT.geo;
  const h = U.html, raw = U.raw, ico = U.svg;

  let sicht = { stadt: 'Köln', haupt: null, vergleich: [], tabelle: false };

  const MONATE = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];

  function stadtWaehlen(stadt) {
    sicht.stadt = stadt;
    const c = G.cityByName[stadt];
    sicht.haupt = c.districtList[0].key;
    sicht.vergleich = [];
  }

  function reihenFuer() {
    const haupt = W.preisreihe(sicht.haupt);
    const weitere = sicht.vergleich.map((k) => W.preisreihe(k)).filter(Boolean);
    return [haupt].concat(weitere).filter(Boolean);
  }

  /* Stadtdurchschnitt als Bezug – bewusst keine Reihenfarbe, sondern grau. */
  function durchschnitt(reihen) {
    const c = G.cityByName[sicht.stadt];
    const alle = c.districtList.map((d) => W.preisreihe(d.key));
    const n = alle[0].punkte.length;
    const punkte = [];
    for (let i = 0; i < n; i++) {
      punkte.push({
        datum: alle[0].punkte[i].datum,
        monat: alle[0].punkte[i].monat,
        jahr: alle[0].punkte[i].jahr,
        wert: Math.round(U.sum(alle.map((a) => a.punkte[i].wert)) / alle.length * 100) / 100
      });
    }
    return { viertel: { name: sicht.stadt + ' im Mittel' }, punkte, jetzt: punkte[punkte.length - 1].wert };
  }

  /* ================================================================
     Liniendiagramm
     ================================================================ */

  function verlaufsDiagramm(reihen, mittel) {
    const B = 760, H = 300, links = 54, rechts = 118, oben = 16, unten = 32;
    const alle = reihen.concat([mittel]);
    const werte = alle.reduce((a, r) => a.concat(r.punkte.map((p) => p.wert)), []);
    let min = Math.min.apply(null, werte), max = Math.max.apply(null, werte);
    const luft = (max - min) * 0.14 || 1;
    min = Math.max(0, min - luft); max = max + luft;

    const n = reihen[0].punkte.length;
    const x = (i) => links + i / (n - 1) * (B - links - rechts);
    const y = (v) => H - unten - (v - min) / (max - min) * (H - unten - oben);

    /* Ruhiges Raster mit Beschriftung in Euro je Quadratmeter. */
    let raster = '';
    const stufen = 4;
    for (let i = 0; i <= stufen; i++) {
      const v = min + (max - min) * i / stufen;
      const yy = y(v).toFixed(1);
      raster += '<line class="viz__raster" x1="' + links + '" y1="' + yy + '" x2="' + (B - rechts) + '" y2="' + yy + '"/>' +
        '<text class="viz__achse" x="' + (links - 10) + '" y="' + (Number(yy) + 4) + '" text-anchor="end">' +
        U.dec(Math.round(v * 10) / 10) + '</text>';
    }

    /* Jahresmarken statt aller 36 Monate. */
    let xachse = '';
    reihen[0].punkte.forEach((p, i) => {
      if (p.monat !== 0 && i !== n - 1) return;
      xachse += '<text class="viz__achse" x="' + x(i).toFixed(1) + '" y="' + (H - 10) + '" text-anchor="middle">' +
        (i === n - 1 ? MONATE[p.monat] + ' ' + String(p.jahr).slice(2) : String(p.jahr)) + '</text>';
    });

    const pfad = (r) => r.punkte.map((p, i) => (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(p.wert).toFixed(1)).join('');

    /* Bezugslinie zuerst, damit sie hinter den Reihen liegt. */
    let linien = '<path class="viz__mittel" d="' + pfad(mittel) + '"/>';
    let enden = '';
    reihen.forEach((r, si) => {
      linien += '<path class="viz__linie" style="stroke:var(--serie-' + (si + 1) + ')" d="' + pfad(r) + '"/>';
      const letzterY = y(r.punkte[n - 1].wert);
      linien += '<circle class="viz__ende" style="fill:var(--serie-' + (si + 1) + ')" cx="' + x(n - 1).toFixed(1) +
        '" cy="' + letzterY.toFixed(1) + '" r="4.5"/>';
      enden += '<text class="viz__endname" x="' + (x(n - 1) + 10) + '" y="' + (letzterY - 3).toFixed(1) + '">' +
        U.esc(U.truncate(r.viertel.name, 14)) + '</text>' +
        '<text class="viz__endwert" x="' + (x(n - 1) + 10) + '" y="' + (letzterY + 11).toFixed(1) + '">' +
        U.esc(U.dec(r.punkte[n - 1].wert) + ' €/m²') + '</text>';
    });
    const mittelY = y(mittel.punkte[n - 1].wert);
    enden += '<text class="viz__endmittel" x="' + (x(n - 1) + 10) + '" y="' + (mittelY + 4).toFixed(1) + '">Mittel</text>';

    return raw('<div class="viz" data-min="' + min + '" data-max="' + max + '" data-n="' + n +
      '" data-links="' + links + '" data-rechts="' + rechts + '" data-oben="' + oben + '" data-unten="' + unten + '">' +
      '<svg class="viz__svg" viewBox="0 0 ' + B + ' ' + H + '" role="img" aria-label="' +
      U.esc('Mietentwicklung je Quadratmeter über ' + Math.round(n / 12) + ' Jahre: ' +
        reihen.map((r) => r.viertel.name + ' zuletzt ' + U.dec(r.punkte[n - 1].wert) + ' Euro').join(', ')) + '">' +
      raster + xachse +
      '<g class="viz__fadenkreuz" hidden><line class="viz__faden" y1="' + oben + '" y2="' + (H - unten) + '"/></g>' +
      linien + enden +
      '<rect class="viz__flaeche" x="' + links + '" y="' + oben + '" width="' + (B - links - rechts) +
      '" height="' + (H - unten - oben) + '" fill="transparent"/>' +
      '</svg><div class="viz__tip" hidden></div></div>');
  }

  /* ================================================================
     Balken: alle Viertel heute
     ================================================================ */

  function viertelBalken() {
    const alle = W.preisvergleich(sicht.stadt);
    const max = Math.max.apply(null, alle.map((a) => a.jetzt));
    return h`<div class="vizbalken" role="img"
        aria-label="${'Mieten je Quadratmeter in ' + sicht.stadt + ': ' + alle.map((a) => a.viertel.name + ' ' + U.dec(a.jetzt) + ' Euro').join(', ')}">
      ${alle.map((a) => {
      const ist = a.viertel.key === sicht.haupt;
      return h`<button type="button" class="vizbalken__zeile ${ist ? 'is-gewaehlt' : ''}"
          data-tu="markt-viertel" data-wert="${a.viertel.key}"
          aria-pressed="${ist ? 'true' : 'false'}">
          <span class="vizbalken__name">${a.viertel.name}</span>
          <span class="vizbalken__spur"><i style="width:${(a.jetzt / max * 100).toFixed(1)}%"></i></span>
          <span class="vizbalken__wert">${U.dec(a.jetzt)} €</span>
          <span class="vizbalken__trend ${a.veraenderungJahr >= 0 ? 'is-hoch' : 'is-runter'}">
            ${a.veraenderungJahr >= 0 ? '+' : ''}${U.dec(a.veraenderungJahr)} %</span>
        </button>`;
    })}
    </div>`;
  }

  /* ================================================================
     Tabellenansicht
     ================================================================ */

  function tabelle(reihen, mittel) {
    const n = reihen[0].punkte.length;
    const zeilen = [];
    for (let i = 0; i < n; i += 3) zeilen.push(i);
    if (zeilen[zeilen.length - 1] !== n - 1) zeilen.push(n - 1);
    return h`<div class="vergleich__rolle">
      <table class="tabelle">
        <caption class="nur-sr">Mietentwicklung je Quadratmeter, alle drei Monate</caption>
        <thead><tr><th scope="col">Monat</th>
          ${reihen.map((r) => h`<th scope="col">${r.viertel.name}</th>`)}
          <th scope="col">${sicht.stadt} im Mittel</th></tr></thead>
        <tbody>
          ${zeilen.map((i) => h`<tr>
            <th scope="row">${MONATE[reihen[0].punkte[i].monat]} ${reihen[0].punkte[i].jahr}</th>
            ${reihen.map((r) => h`<td>${U.dec(r.punkte[i].wert)} €</td>`)}
            <td>${U.dec(mittel.punkte[i].wert)} €</td>
          </tr>`)}
        </tbody>
      </table>
    </div>`;
  }

  /* ================================================================
     Ansicht
     ================================================================ */

  function gesperrt() {
    return {
      titel: 'Marktdaten',
      html: h`<div class="seite seite--schmal">
        <header class="seite__kopf">
          <h1>${ico('trend')}Marktdaten und Preisverlauf</h1>
          <p class="seite__unter">Wie sich die Mieten je Viertel über drei Jahre entwickelt haben – und welche
            Viertel gerade am schnellsten teurer werden.</p>
        </header>
        <section class="block">
          <h2>Heute in ${sicht.stadt}</h2>
          <p class="block__unter">Das aktuelle Preisniveau je Viertel siehst du auch im freien Tarif –
            hier und als Wärmefläche auf der Karte.</p>
          ${viertelBalken()}
        </section>
        <section class="block block--betont">
          <h2>${ico('schloss')}Der Verlauf gehört zu Plus</h2>
          <p>Was der freie Tarif nicht zeigt: die 36-Monats-Reihe je Viertel, der Vergleich mehrerer Viertel
            nebeneinander, die Veränderung im letzten Jahr und der Stadtdurchschnitt als Bezugslinie.</p>
          <p class="fein">Das ist eine der wenigen Funktionen hinter der Schranke, weil man sie beim Eingrenzen
            der Suche immer wieder aufruft – anders als etwa das Übergabeprotokoll, das man einmal braucht
            und das deshalb frei bleibt.</p>
          ${ui.sperrHinweis('marktdaten')}
        </section>
        ${ui.anzeige('markt', 'breit')}
      </div>`
    };
  }

  function ansicht() {
    if (!sicht.haupt) stadtWaehlen(sicht.stadt);
    if (!G.districtByKey[sicht.haupt]) stadtWaehlen(sicht.stadt);
    if (!P.darf('marktdaten')) return gesperrt();

    const reihen = reihenFuer();
    const mittel = durchschnitt(reihen);
    const haupt = reihen[0];
    const stadtListe = W.preisvergleich(sicht.stadt);
    const rang = stadtListe.findIndex((a) => a.viertel.key === sicht.haupt) + 1;
    const schnellste = stadtListe.slice().sort((a, b) => b.veraenderungJahr - a.veraenderungJahr)[0];

    return {
      titel: 'Marktdaten',
      html: h`<div class="seite seite--schmal">
        <header class="seite__kopf">
          <h1>${ico('trend')}Marktdaten und Preisverlauf</h1>
          <p class="seite__unter">Angebotsmieten je Quadratmeter, Monat für Monat über drei Jahre.
            Wähle unten ein Viertel und stell bis zu zwei weitere daneben.</p>
        </header>

        <div class="marktleiste">
          <label class="feld feld--flach"><span>Stadt</span>
            <select data-tu-change="markt-stadt">
              ${TT.data.staedte.map((c) => h`<option value="${c}" ${sicht.stadt === c ? 'selected' : ''}>${c}</option>`)}
            </select></label>
          <label class="feld feld--flach"><span>Viertel</span>
            <select data-tu-change="markt-haupt">
              ${G.cityByName[sicht.stadt].districtList.map((d) =>
        h`<option value="${d.key}" ${sicht.haupt === d.key ? 'selected' : ''}>${d.name}</option>`)}
            </select></label>
        </div>

        <div class="kennzahlen">
          <div><b>${U.dec(haupt.jetzt)} €/m²</b><span>Angebotsmiete in ${haupt.viertel.name}</span></div>
          <div><b class="${haupt.veraenderungJahr >= 0 ? 'ton--schlecht' : 'ton--gut'}">${haupt.veraenderungJahr >= 0 ? '+' : ''}${U.dec(haupt.veraenderungJahr)} %</b>
            <span>in zwölf Monaten</span></div>
          <div><b>${haupt.veraenderungGesamt >= 0 ? '+' : ''}${U.dec(haupt.veraenderungGesamt)} %</b><span>in drei Jahren</span></div>
          <div><b>${rang}. von ${stadtListe.length}</b><span>teuerstes Viertel in ${sicht.stadt}</span></div>
        </div>

        <section class="block">
          <div class="block__kopfzeile">
            <h2>Verlauf</h2>
            <button type="button" class="link" data-tu="markt-tabelle">
              ${sicht.tabelle ? 'als Diagramm' : 'als Tabelle'}</button>
          </div>

          <div class="viz__legende">
            ${reihen.map((r, i) => h`<span class="viz__legende-eintrag">
              <i style="background:var(--serie-${i + 1})"></i>${r.viertel.name}</span>`)}
            <span class="viz__legende-eintrag viz__legende-eintrag--mittel"><i></i>${sicht.stadt} im Mittel</span>
          </div>

          ${sicht.tabelle ? tabelle(reihen, mittel) : verlaufsDiagramm(reihen, mittel)}

          <fieldset class="filter__gruppe"><legend>Bis zu zwei Viertel danebenstellen</legend>
            <div class="chips">
              ${G.cityByName[sicht.stadt].districtList.filter((d) => d.key !== sicht.haupt).map((d) => {
        const an = sicht.vergleich.indexOf(d.key) >= 0;
        return h`<button type="button" class="chip ${an ? 'is-an' : ''}" aria-pressed="${an ? 'true' : 'false'}"
                  data-tu="markt-vergleich" data-wert="${d.key}">${d.name}</button>`;
      })}
            </div>
            <p class="fein">Mehr als drei Linien lassen sich nicht mehr sicher unterscheiden – deshalb ist bei
              zwei Vergleichsvierteln Schluss.</p>
          </fieldset>
        </section>

        <section class="block">
          <h2>Alle Viertel in ${sicht.stadt} heute</h2>
          <p class="block__unter">Klick auf ein Viertel, um es oben in den Verlauf zu holen.</p>
          ${viertelBalken()}
        </section>

        <section class="block">
          <h2>${ico('info')}Was daraus folgt</h2>
          <p>In ${haupt.viertel.name} liegt die Angebotsmiete bei ${U.dec(haupt.jetzt)} €/m² und ist binnen
            zwölf Monaten um ${U.dec(Math.abs(haupt.veraenderungJahr))} % ${haupt.veraenderungJahr >= 0 ? 'gestiegen' : 'gefallen'}.
            Am schnellsten zieht gerade ${schnellste.viertel.name} an (${U.dec(schnellste.veraenderungJahr)} % im Jahr) –
            solche Viertel sind oft noch bezahlbar, aber nicht mehr lange.</p>
          <p>Für die Praxis heißt das zweierlei. Erstens: Eine Wohnung, die heute
            ${U.dec(haupt.jetzt)} €/m² kostet, wird bei gleichbleibendem Tempo in fünf Jahren
            ${U.dec(haupt.jetzt * Math.pow(1 + haupt.veraenderungJahr / 100, 5))} €/m² kosten – für dich als
            Bestandsmieter nicht, denn deine Miete steigt nur nach den Regeln des Mietvertrags. Wer bleibt, spart.
            Zweitens: Weicht ein Inserat stark vom Verlauf ab, lohnt der Blick in die Vergleichsmiete auf der Objektseite.</p>
          <p class="fein">Angebotsmieten, nicht Bestandsmieten. Sie liegen systematisch höher, weil nur neu
            vermietete Wohnungen einfließen. In dieser Vorführung sind die Reihen erzeugt.</p>
        </section>
      </div>`,
      danach(wurzel) { fadenkreuz(wurzel, reihen, mittel); }
    };
  }

  /* ================================================================
     Fadenkreuz und Tooltip
     ================================================================ */

  function fadenkreuz(wurzel, reihen, mittel) {
    const box = U.$('.viz', wurzel);
    if (!box) return;
    const svg = box.querySelector('.viz__svg');
    const tip = box.querySelector('.viz__tip');
    const gruppe = box.querySelector('.viz__fadenkreuz');
    const faden = box.querySelector('.viz__faden');
    const n = Number(box.dataset.n);
    const links = Number(box.dataset.links), rechts = Number(box.dataset.rechts);
    const B = 760;

    function zeigen(e) {
      const kasten = svg.getBoundingClientRect();
      const sx = (e.clientX - kasten.left) / kasten.width * B;
      const anteil = (sx - links) / (B - links - rechts);
      if (anteil < -0.02 || anteil > 1.02) return verstecken();
      const i = U.clamp(Math.round(anteil * (n - 1)), 0, n - 1);
      const x = links + i / (n - 1) * (B - links - rechts);
      faden.setAttribute('x1', x); faden.setAttribute('x2', x);
      gruppe.hidden = false;

      const p0 = reihen[0].punkte[i];
      tip.hidden = false;
      tip.innerHTML = '<b>' + MONATE[p0.monat] + ' ' + p0.jahr + '</b>' +
        reihen.map((r, si) => '<span><i style="background:var(--serie-' + (si + 1) + ')"></i>' +
          U.esc(r.viertel.name) + ' <em>' + U.dec(r.punkte[i].wert) + ' €/m²</em></span>').join('') +
        '<span class="viz__tip-mittel"><i></i>im Mittel <em>' + U.dec(mittel.punkte[i].wert) + ' €/m²</em></span>';
      const relX = x / B * kasten.width;
      tip.style.left = U.clamp(relX, 100, kasten.width - 100) + 'px';
    }

    function verstecken() {
      gruppe.hidden = true;
      tip.hidden = true;
    }

    svg.addEventListener('pointermove', zeigen);
    svg.addEventListener('pointerleave', verstecken);
    svg.addEventListener('pointerdown', zeigen);
  }

  /* ================================================================
     Aktionen
     ================================================================ */

  const A_ = ui.aktionRegistrieren;

  A_('markt-stadt', (el) => { stadtWaehlen(el.value); ui.neuZeichnen(); });
  A_('markt-haupt', (el) => {
    sicht.haupt = el.value;
    sicht.vergleich = sicht.vergleich.filter((k) => k !== el.value);
    ui.neuZeichnen();
  });
  A_('markt-viertel', (el) => {
    sicht.haupt = el.dataset.wert;
    sicht.vergleich = sicht.vergleich.filter((k) => k !== el.dataset.wert);
    ui.neuZeichnen();
  });
  A_('markt-vergleich', (el) => {
    const k = el.dataset.wert;
    const i = sicht.vergleich.indexOf(k);
    if (i >= 0) sicht.vergleich.splice(i, 1);
    else if (sicht.vergleich.length >= 2) {
      ui.toast('Mehr als drei Linien lassen sich nicht mehr sicher unterscheiden.');
      return;
    } else sicht.vergleich.push(k);
    ui.neuZeichnen();
  });
  A_('markt-tabelle', () => { sicht.tabelle = !sicht.tabelle; ui.neuZeichnen(); });

  ui.ansichten.markt = ansicht;
  TT.viewMarkt = { sicht, stadtWaehlen };
})(window.TT = window.TT || {});
