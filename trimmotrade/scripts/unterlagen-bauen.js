/* =====================================================================
   Was ein Kunde in die Hand bekommt

   Zwei Unterlagen verlassen den Betrieb und landen bei jemandem, der
   sie weiterreicht: das Angebot, das ein Vorstand vorgelegt bekommt,
   und der Vertrag nach Art. 28 DSGVO, den eine Datenschutzbeauftragte
   prüft. Beide müssen aussehen, als hätte sie jemand gesetzt – ein
   ausgedrucktes Textdokument mit Standardschrift sagt schon vor dem
   ersten Satz etwas über den Absender.

   Beide entstehen hier aus derselben Quelle wie die Website: das
   Angebot aus scripts/preise.js, der Vertrag aus AVV.md. Von Hand
   gepflegte Kopien wären beim nächsten Preiswechsel falsch, und zwar
   genau in dem Exemplar, das schon verschickt ist.

   Ohne fremde Bibliotheken: Der Browser für die Prüfläufe liegt
   ohnehin bereit, und der kann Seiten drucken.

   Aufruf:  node scripts/unterlagen-bauen.js
   ===================================================================== */
'use strict';

const fs = require('fs');
const path = require('path');
const P = require('./preise.js');

const WURZEL = path.resolve(__dirname, '..');
const ZIEL = path.join(WURZEL, 'unterlagen');

const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/* ------------------------------------------------------------------
   Ein sehr kleiner Markdown-Leser

   Er kann genau das, was in AVV.md vorkommt: Überschriften, Absätze,
   Listen, Tabellen, Zitate, Trennlinien, fett, kursiv. Keine
   Bibliothek, weil eine Bibliothek für sechs Zeichenfolgen ein
   schlechtes Geschäft ist – und weil ein Vertrag nichts enthalten
   sollte, das ein Leser mit hundert Zeilen nicht versteht.
   ------------------------------------------------------------------ */

function inline(t) {
  return esc(t)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[\s(„])\*([^*]+)\*/g, '$1<em>$2</em>')
    .replace(/_{4,}/g, (m) => '<span class="linie" style="--n:' + m.length + '"></span>');
}

function markdown(text) {
  const zeilen = text.split('\n');
  const raus = [];
  let i = 0;

  const absatzEnde = (j) => {
    while (j < zeilen.length && zeilen[j].trim() !== '') j++;
    return j;
  };

  while (i < zeilen.length) {
    const z = zeilen[i];
    const roh = z.trim();

    if (roh === '') { i++; continue; }

    /* Trennlinie */
    if (/^-{3,}$/.test(roh)) { raus.push('<hr>'); i++; continue; }

    /* Überschrift */
    const h = roh.match(/^(#{1,4})\s+(.*)$/);
    if (h) {
      const n = h[1].length;
      raus.push('<h' + n + '>' + inline(h[2]) + '</h' + n + '>');
      i++; continue;
    }

    /* Tabelle: Kopfzeile, Trennzeile, dann Inhalt */
    if (roh.startsWith('|') && zeilen[i + 1] && /^\|[\s:|-]+\|$/.test(zeilen[i + 1].trim())) {
      const zellen = (s) => s.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
      const kopf = zellen(roh);
      i += 2;
      const koerper = [];
      while (i < zeilen.length && zeilen[i].trim().startsWith('|')) {
        koerper.push(zellen(zeilen[i])); i++;
      }
      raus.push('<table><thead><tr>' + kopf.map((c) => '<th>' + inline(c) + '</th>').join('')
        + '</tr></thead><tbody>'
        + koerper.map((r) => '<tr>' + r.map((c) => '<td>' + inline(c) + '</td>').join('') + '</tr>').join('')
        + '</tbody></table>');
      continue;
    }

    /* Zitat – im Vertrag die Randbemerkungen */
    if (roh.startsWith('>')) {
      const teile = [];
      while (i < zeilen.length && zeilen[i].trim().startsWith('>')) {
        teile.push(zeilen[i].trim().replace(/^>\s?/, '')); i++;
      }
      raus.push('<blockquote>' + markdown(teile.join('\n')) + '</blockquote>');
      continue;
    }

    /* Liste */
    if (/^[-*]\s+/.test(roh) || /^\d+\.\s+/.test(roh)) {
      const geordnet = /^\d+\./.test(roh);
      const punkte = [];
      while (i < zeilen.length) {
        const m = zeilen[i].trim().match(/^(?:[-*]|\d+\.)\s+(.*)$/);
        if (!m) {
          /* Fortsetzungszeile einer Aufzählung */
          if (punkte.length && /^\s{2,}\S/.test(zeilen[i])) {
            punkte[punkte.length - 1] += ' ' + zeilen[i].trim(); i++; continue;
          }
          break;
        }
        punkte.push(m[1]); i++;
      }
      const tag = geordnet ? 'ol' : 'ul';
      raus.push('<' + tag + '>' + punkte.map((p) => '<li>' + inline(p) + '</li>').join('') + '</' + tag + '>');
      continue;
    }

    /* Vier Leerzeichen Einzug: eine Anschrift oder eine Zeile zum
       Ausfüllen. Beides lebt davon, dass die Zeilen Zeilen bleiben –
       als Absatz zusammengezogen stand die ganze Anschrift des
       Auftragnehmers in einer einzigen Zeile. */
    if (/^ {4}\S/.test(z)) {
      const teile = [];
      while (i < zeilen.length && (/^ {4}/.test(zeilen[i]) || zeilen[i].trim() === '')) {
        if (zeilen[i].trim() === '' && !/^ {4}\S/.test(zeilen[i + 1] || '')) break;
        teile.push(zeilen[i].replace(/^ {4}/, '').trimEnd()); i++;
      }
      raus.push('<div class="anschrift">'
        + teile.map((t) => t === '' ? '<br>' : inline(t)).join('<br>') + '</div>');
      continue;
    }

    /* Alles Übrige ist ein Absatz bis zur nächsten Leerzeile */
    const ende = absatzEnde(i);
    raus.push('<p>' + inline(zeilen.slice(i, ende).join(' ').trim()) + '</p>');
    i = ende;
  }
  return raus.join('\n');
}

/* ------------------------------------------------------------------
   Der Stil für den Druck

   Serifen für den Fließtext: Ein Vertrag auf Papier liest sich damit
   besser, und er sieht aus wie ein Vertrag und nicht wie eine Website
   auf Papier. Die Marke bleibt beim Grün.
   ------------------------------------------------------------------ */
const STIL = `
  @page { size: A4; margin: 22mm 20mm 20mm; }
  * { box-sizing: border-box; }
  body { margin: 0; font: 10.5pt/1.55 "Georgia", "Times New Roman", serif; color: #191c17; }
  h1, h2, h3, h4 { font-family: "Helvetica Neue", Arial, sans-serif; line-height: 1.2;
    letter-spacing: -.01em; color: #124528; page-break-after: avoid; }
  h1 { font-size: 20pt; margin: 0 0 4pt; letter-spacing: -.02em; }
  h2 { font-size: 13pt; margin: 18pt 0 5pt; padding-top: 5pt; border-top: .5pt solid #c3c0b5; }
  h3 { font-size: 11pt; margin: 12pt 0 3pt; }
  h4 { font-size: 10.5pt; margin: 10pt 0 2pt; }
  p { margin: 0 0 6pt; }
  ul, ol { margin: 0 0 6pt; padding-left: 16pt; }
  li { margin-bottom: 2pt; }
  table { width: 100%; border-collapse: collapse; margin: 6pt 0 10pt; font-size: 9.5pt;
    page-break-inside: avoid; }
  th, td { border-bottom: .5pt solid #d8d5cc; padding: 4pt 6pt; text-align: left;
    vertical-align: top; }
  th { font-family: "Helvetica Neue", Arial, sans-serif; font-size: 8.5pt;
    text-transform: uppercase; letter-spacing: .06em; color: #4c5044; border-bottom-width: 1pt; }
  blockquote { margin: 8pt 0; padding: 7pt 10pt; border-left: 2pt solid #1a5c37;
    background: #f4f7f4; font-size: 9.5pt; page-break-inside: avoid; }
  blockquote p:last-child { margin-bottom: 0; }
  code { font-family: "Menlo", "Consolas", monospace; font-size: 9pt; background: #f0efea;
    padding: 0 2pt; border-radius: 2pt; }
  hr { border: 0; border-top: .5pt solid #d8d5cc; margin: 14pt 0; }
  strong { font-weight: 700; }
  .linie { display: inline-block; border-bottom: .5pt solid #545848;
    width: calc(var(--n) * 0.42em); vertical-align: baseline; }
  /* Anschriften und Zeilen zum Ausfüllen: eingerückt, mit Zeilenfall. */
  .anschrift { margin: 0 0 8pt; padding-left: 10pt; line-height: 1.7; }

  /* Kopf des Dokuments */
  .marke { display: flex; align-items: baseline; justify-content: space-between;
    padding-bottom: 6pt; border-bottom: 1.5pt solid #1a5c37; margin-bottom: 14pt; }
  .marke b { font-family: "Helvetica Neue", Arial, sans-serif; font-size: 13pt;
    letter-spacing: -.02em; color: #124528; }
  .marke span { font-family: "Helvetica Neue", Arial, sans-serif; font-size: 8pt;
    color: #545848; }
  .vorspann { font-size: 11pt; color: #4c5044; margin: 0 0 14pt; }
  .fuss { margin-top: 20pt; padding-top: 6pt; border-top: .5pt solid #d8d5cc;
    font-family: "Helvetica Neue", Arial, sans-serif; font-size: 8pt; color: #545848; }
  .umbruch { page-break-before: always; }
`;

const seite = (titel, inhalt) => `<!DOCTYPE html><html lang="de"><head>
<meta charset="utf-8"><title>${esc(titel)}</title><style>${STIL}</style></head><body>
<div class="marke"><b>TrimmoTrade</b><span>Niklas Haberberg · Plankgasse 34 · 50668 Köln ·
info@trimmotrade.de · +49 163 502 1968</span></div>
${inhalt}
<p class="fuss">TrimmoTrade ist ein Einzelunternehmen (Kleingewerbe) von Niklas Haberberg,
Plankgasse 34, 50668 Köln. Stand: ${new Date().toISOString().slice(0, 10)}.
www.trimmotrade.de</p>
</body></html>`;

/* ------------------------------------------------------------------
   Das Angebot

   Ein Blatt, das ein Vorstand ohne Rückfragen weiterreichen kann. Was
   nicht daraufpasst, gehört ins Gespräch und nicht auf das Blatt.
   ------------------------------------------------------------------ */
function angebot() {
  const zeilen = P.stufenZeilen()
    .map(([a, b]) => `<tr><td>${esc(a)}</td><td>${esc(b)}</td></tr>`).join('');
  return seite('Angebot – Tauschbörse und Vorauswahl', `
<h1>Tauschbörse und Vorauswahl</h1>
<p class="vorspann">Für Wohnungsgenossenschaften, kommunale Wohnungsgesellschaften
und Hausverwaltungen</p>

<h2>Was es löst</h2>
<p><strong>Der Tausch, der am Aushang scheitert.</strong> In jedem größeren Bestand wohnen zwei
Gruppen aneinander vorbei: ältere Mitglieder in Wohnungen, die zu groß geworden sind, und Familien
in Wohnungen, die zu klein sind. Ein direkter Tausch verlangt einen doppelten Zufall. TrimmoTrade
sucht deshalb <strong>Ketten</strong> über drei oder vier Haushalte: A zieht zu B, B zu C, C zu A.</p>
<p>Jeder interne Tausch ist eine Neuvermietung, die nicht stattfindet – kein Leerstand zwischen
Aus- und Einzug, kein Inserat, keine Auswahl unter Fremden, und zwei Mitglieder, die bleiben.</p>
<p><strong>Achtzig Anfragen, zehn gelesen.</strong> Welche zehn, entscheidet heute die Uhrzeit des
Eingangs. TrimmoTrade sortiert nach Mietbelastung, Einkommensart, Bürgschaft, Unterlagen,
gewünschter Mietdauer, Termin und Haushaltsgröße – jede Teilzahl mit ihrer Begründung daneben.
Ausgeblendet wird nichts.</p>
<p>Alter, Geschlecht und Herkunft kommen in der Rechnung nicht vor: Sie stehen in keiner Anfrage.
Und weil eine Reihenfolge entsteht und keine Entscheidung, liegt keine automatisierte Entscheidung
im Einzelfall nach Art. 22 DSGVO vor.</p>

<h2>Was heute läuft</h2>
<ul>
<li>Ringtausch über zwei bis vier Haushalte</li>
<li>Vorauswahl der Anfragen mit offengelegter Begründung</li>
<li>Inserate mit Bildern, Ablauf nach 60 Tagen, Erinnerung vorher</li>
<li>Betrugsmuster-Erkennung und Meldeweg nach Art. 16 DSA</li>
<li>Unterlagen Ende-zu-Ende verschlüsselt im Dokumententresor</li>
</ul>

<h2>Was es noch nicht gibt</h2>
<p>Dieser Abschnitt steht vor dem Preis, weil ein verkaufter Bereich, den es nicht gibt, beim
Einrichten auffliegt.</p>
<ul>
<li>Ein eigener, geschlossener Bereich je Haus – der Pilot läuft auf der offenen Plattform</li>
<li>Eigenes Erscheinungsbild, Anbindung an eine Wohnungswirtschafts-Software</li>
<li>Rollen und Rechte für mehrere Mitarbeitende</li>
</ul>
<p>Der Pilotpreis ist deshalb kein Rabatt, sondern der Preis dafür, der erste zu sein und
mitzubestimmen, was als Nächstes gebaut wird.</p>

<h2>Preise</h2>
<p><strong>Pilot: ${P.eur(P.pilotPreis)} für ${P.pilotMonate} Monate</strong>, vollständig
anrechenbar auf das erste Jahresentgelt.</p>
<table><thead><tr><th>Verwaltete Wohneinheiten</th><th>Entgelt</th></tr></thead>
<tbody>${zeilen}
<tr><td>Einrichtung, einmalig</td><td>${P.eur(P.einrichtung)}</td></tr></tbody></table>
<p>Enthalten: Tauschbörse mit Ringsuche, Vorauswahl, Inserate ohne Stückzahlbegrenzung, Meldeweg,
Auswertung, E-Mail-Hilfe innerhalb von zwei Werktagen. Die Einrichtung umfasst Ersteinrichtung,
Übernahme des vorhandenen Bestands im Rahmen des Möglichen, eine Schulung von zwei Stunden und die
Abstimmung des Auftragsverarbeitungsvertrages.</p>
<p><strong>Hausverwaltungen</strong> rechnen je vermieteter Wohnung ab: ${P.eur(P.hv.einzeln)}, im
Zehnerpaket ${P.eur(P.hv.zehnerJe)} je Wohnung. Wird nicht vermietet, fällt nichts an.</p>
<p>Alle Preise netto. <strong>Laufzeit ein Jahr, danach monatlich kündbar</strong> – keine
automatische Verlängerung um ein weiteres Jahr.</p>

<h2>Datenschutz</h2>
<p>Sie bleiben Verantwortlicher, TrimmoTrade ist Auftragsverarbeiter. Der Vertrag nach Art. 28
DSGVO liegt fertig vor und geht Ihnen vor der Unterschrift zu – mit einer Anlage, in der auch
steht, was <em>nicht</em> vorhanden ist. Verarbeitung ausschließlich in Deutschland. Keine
Kennwörter: Anmeldung per Passkey oder Einmalcode. Meldung einer Datenpanne innerhalb von 24
Stunden. Rückgabe Ihrer Daten in maschinenlesbarer Form bei Vertragsende.</p>

<h2>Das nächste</h2>
<p>Ein Gespräch von dreißig Minuten, bei Ihnen oder am Bildschirm. Ich bringe eine Rechnung mit
Ihren Zahlen mit – Fluktuationsquote, Leerstandsdauer, Wechsel im Jahr –, nicht mit meinen.</p>
<p><strong>Niklas Haberberg</strong> · +49 163 502 1968 · info@trimmotrade.de ·
www.trimmotrade.de/fuer-unternehmen.html</p>
<p>TrimmoTrade ist ein Einzelunternehmen aus Köln. Das ist ein Risiko, und Sie sollten es
einpreisen – deshalb beträgt die Laufzeit ein Jahr und nicht fünf, und deshalb steht die Rückgabe
Ihrer Daten im Vertrag.</p>
`);
}

/* ------------------------------------------------------------------
   Der Vertrag

   Aus AVV.md, ohne den Kasten am Anfang: Der richtet sich an den
   Betreiber und hat auf dem Blatt, das der Kunde bekommt, nichts zu
   suchen.
   ------------------------------------------------------------------ */
function avv() {
  let md = fs.readFileSync(path.join(WURZEL, 'AVV.md'), 'utf8');
  const anfang = md.indexOf('\n## Zwischen');
  if (anfang < 0) throw new Error('AVV.md: „## Zwischen“ nicht gefunden – Aufbau geändert?');
  /* Der Strich am Ende des Kopfes fällt weg: Direkt darunter beginnt
     eine Überschrift, und die bringt ihren eigenen oberen Rand mit.
     Zwei Striche mit vier Millimetern Abstand sehen aus wie ein
     Versehen, weil sie eines wären. */
  const kopf = md.slice(0, md.indexOf('\n>')).replace(/\n-{3,}\s*$/, '');
  md = kopf + md.slice(anfang);
  /* Jede Anlage beginnt auf einer neuen Seite. */
  return seite('Auftragsverarbeitungsvertrag',
    markdown(md).replace(/<h1>(Anlage [123][^<]*)<\/h1>/g, '<h1 class="umbruch">$1</h1>'));
}

/* ------------------------------------------------------------------
   Die Prüfung vor dem Verschicken

   Ein Vertrag, in dem noch ein Sternchenpaar oder ein senkrechter
   Strich aus der Markdown-Quelle steht, sieht nach Versehen aus – und
   ein Vertrag, der nach Versehen aussieht, wird nicht unterschrieben.
   Der kleine Leser oben kann etwas übersehen; diese Prüfung sagt es,
   bevor es jemand anders tut.
   ------------------------------------------------------------------ */
function pruefen(datei, html) {
  const text = html.replace(/<[^>]+>/g, ' ');
  const funde = [];
  if (/\*\*/.test(text)) funde.push('unaufgelöstes **');
  if (/(^|\s)\|(\s|$)/.test(text)) funde.push('unaufgelöster Tabellenstrich |');
  if (/(^|\s)#{1,4}\s/.test(text)) funde.push('unaufgelöste Überschrift #');
  if (/\[[^\]]+\]\(/.test(text)) funde.push('unaufgelöster Verweis');
  if (/undefined|\[object Object\]|NaN/.test(text)) funde.push('Spur einer leeren Vorlage');
  if (funde.length) {
    throw new Error(datei + ': ' + funde.join(', '));
  }
}

/* ------------------------------------------------------------------ */

async function bauen() {
  const { chromium } = require('/opt/node22/lib/node_modules/playwright');
  fs.mkdirSync(ZIEL, { recursive: true });

  const stuecke = [
    { datei: 'Angebot.pdf', html: angebot() },
    { datei: 'AVV.pdf', html: avv() }
  ];

  for (const s of stuecke) pruefen(s.datei, s.html);

  const browser = await chromium.launch();
  const seiteAuf = await browser.newPage();
  for (const s of stuecke) {
    await seiteAuf.setContent(s.html, { waitUntil: 'load' });
    await seiteAuf.pdf({
      path: path.join(ZIEL, s.datei),
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: '<span></span>',
      footerTemplate: '<div style="width:100%;font:8pt Helvetica,Arial,sans-serif;'
        + 'color:#545848;padding:0 20mm;text-align:right">'
        + '<span class="pageNumber"></span> von <span class="totalPages"></span></div>',
      margin: { top: '22mm', bottom: '20mm', left: '20mm', right: '20mm' }
    });
    const kb = (fs.statSync(path.join(ZIEL, s.datei)).size / 1024).toFixed(0);
    console.log(s.datei.padEnd(20) + kb + ' kB');
  }
  await browser.close();
  console.log('\nunterlagen/ – zum Beilegen und Verschicken.');
}

/* Als Modul einbindbar, damit sich die Unterlagen ansehen und prüfen
   lassen, ohne jedes Mal ein PDF zu schreiben. */
module.exports = { angebot, avv, markdown, pruefen };

if (require.main === module) {
  bauen().catch((e) => { console.error('Unterlagen fehlgeschlagen: ' + e.message); process.exit(1); });
}
