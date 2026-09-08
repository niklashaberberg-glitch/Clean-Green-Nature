/* =====================================================================
   Die Preise – an einer Stelle

   Sie stehen auf der Website, im Angebot als PDF und in PREISE.md. Drei
   Orte, an denen dieselbe Zahl steht, sind zwei Orte zu viel: Beim
   nächsten Preiswechsel wird einer vergessen, und dann bekommt ein
   Kunde ein Angebot, das der eigenen Website widerspricht. Das ist der
   Fehler, den niemand bemerkt, bis er im Termin auf dem Tisch liegt.

   PREISE.md begründet die Zahlen. Hier stehen sie.
   ===================================================================== */
'use strict';

const eur = (n) => n.toLocaleString('de-DE') + ' €';

/* Wohnungsunternehmen, gestaffelt nach verwalteten Wohneinheiten. */
const STUFEN = [
  { bis: 500, wort: 'bis 500 Einheiten', monat: 149 },
  { bis: 2000, wort: '501 bis 2.000', monat: 299 },
  { bis: 5000, wort: '2.001 bis 5.000', monat: 499 },
  { bis: Infinity, wort: 'über 5.000', monat: null }
];

/* Zwei Monate geschenkt bei Jahreszahlung – das ist keine Großzügigkeit,
   sondern gekaufte Planbarkeit: Ein Jahresbetrag im Voraus ersetzt zwölf
   Mahnläufe bei einem Betrieb ohne Buchhaltung. */
const JAHR_STATT_MONATE = 10;

module.exports = {
  eur,
  STUFEN,
  JAHR_STATT_MONATE,

  einrichtung: 490,
  pilotPreis: 900,
  pilotMonate: 3,

  /* Hausverwaltungen rechnen je vermieteter Wohnung ab, nicht je
     Inserat. Wer nicht vermietet, zahlt nichts – im Gespräch das
     stärkste Argument, und es kostet fast nichts. */
  hv: { einzeln: 39, zehner: 290, zehnerJe: 29, dauerMonat: 99, dauerBis: 200 },

  /* Verbraucher */
  plusMonat: '7,90 €',
  plusJahr: '69 €',

  /* Als Zeilen für eine Tabelle – dieselbe Form für HTML und PDF. */
  stufenZeilen() {
    return STUFEN.map((s) => [
      s.wort,
      s.monat === null ? 'nach Absprache' : eur(s.monat) + ' im Monat'
    ]);
  }
};
