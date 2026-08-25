/* =====================================================================
   TrimmoTrade – Sprachen

   Deutsch ist die Ausgangssprache und steht im Quelltext. Englisch kommt
   aus einem Wörterbuch, dessen Schlüssel der deutsche Satz selbst ist.
   Das hat zwei Gründe: Es gibt keine erfundenen Bezeichner zu pflegen,
   und wenn ein Eintrag fehlt, erscheint der deutsche Satz statt einer
   leeren Stelle oder eines Schlüssels wie „profil.anker.titel“.

   Übersetzt wird an genau einer Stelle: im Vorlagen-Tag `h` in util.js.
   Von dort geht jeder Text durch `t()`. Deshalb musste keine der
   dreißig Ansichtsdateien angefasst werden.

   Wortstellung: Ein Satz, der durch ${…} unterbrochen wird, ergibt im
   Wörterbuch einen Schlüssel mit Platzhaltern – „Noch {0} Plätze frei“.
   Die englische Fassung darf die Platzhalter umstellen. Ohne das wäre
   jeder eingeschobene Wert an die deutsche Satzstellung genagelt.
   ===================================================================== */
(function (TT) {
  'use strict';

  const SCHLUESSEL = 'trimmotrade.sprache.v1';
  const SPRACHEN = [
    { id: 'de', name: 'Deutsch', kurz: 'DE', htmlLang: 'de' },
    { id: 'en', name: 'English', kurz: 'EN', htmlLang: 'en' }
  ];

  /* Beim Nachschlagen zählt weder Einrückung noch Zeilenumbruch: Im
     Quelltext ist derselbe Satz einmal auf drei Zeilen umbrochen und
     einmal nicht, im Browser sieht man keinen Unterschied. Schlüssel
     müssen deshalb schon beim Eintragen genauso zugerichtet werden –
     sonst findet ein Eintrag wie „ mit Balkon“ sich selbst nicht.
     Die Werte werden ebenfalls beschnitten, weil t() die Leerzeichen
     der Fundstelle wieder anlegt. */
  const eng = (s) => s.replace(/\s+/g, ' ').trim();

  /* Die Wörterbücher tragen sich selbst ein (sprache-en.js). */
  const woerter = Object.create(null);
  function eintragen(id, tabelle) {
    woerter[id] = woerter[id] || Object.create(null);
    Object.keys(tabelle).forEach((k) => { woerter[id][eng(k)] = eng(tabelle[k]); });
  }

  let aktuell = 'de';
  const hoerer = [];

  function spracheBestimmen() {
    let gespeichert = null;
    try { gespeichert = localStorage.getItem(SCHLUESSEL); } catch (e) { gespeichert = null; }
    /* Deutsch ist die Sprache dieser Anwendung; Englisch ist eine Wahl,
       keine Vermutung. Automatisch nach der Browsersprache umzuschalten
       wäre bequem, aber es überrascht: Der Bestand, die Städte und die
       Rechtstexte sind deutsch, und wer ein englisches Betriebssystem
       benutzt, sucht deswegen nicht in einem anderen Land. Wer umstellt,
       bleibt umgestellt – das merkt sich der Browser. */
    aktuell = gespeichert && SPRACHEN.some((s) => s.id === gespeichert) ? gespeichert : 'de';
    return aktuell;
  }

  /* Beim Start noch einmal aufgerufen, wenn das Dokument steht – dann
     lassen sich lang und die Klasse am body wirklich setzen. */
  function laden() {
    anwenden();
    return aktuell;
  }

  function anwenden() {
    const s = SPRACHEN.find((x) => x.id === aktuell) || SPRACHEN[0];
    try {
      document.documentElement.lang = s.htmlLang;
      document.body.classList.toggle('ist-englisch', aktuell === 'en');
    } catch (e) { /* vor DOMContentLoaded */ }
  }

  function setze(id) {
    if (!SPRACHEN.some((s) => s.id === id) || id === aktuell) return aktuell;
    aktuell = id;
    try { localStorage.setItem(SCHLUESSEL, id); } catch (e) { /* privater Modus */ }
    anwenden();
    hoerer.forEach((f) => f(aktuell));
    return aktuell;
  }

  /* ------------------------- Nachschlagen ------------------------- */

  function t(text) {
    if (aktuell === 'de' || text === null || text === undefined) return text;
    const tabelle = woerter[aktuell];
    if (!tabelle) return text;
    const roh = String(text);
    const kern = eng(roh);
    if (!kern) return text;
    const treffer = tabelle[kern];
    if (treffer === undefined) return text;
    /* Führende und schließende Leerzeichen gehören zum Satzbau drumherum
       („Noch “ + Zahl), nicht zum Eintrag – also wieder anlegen. */
    const vorn = /^\s*/.exec(roh)[0];
    const hinten = /\s*$/.exec(roh)[0];
    return vorn + treffer + hinten;
  }

  /* Gibt es zu diesem Text überhaupt einen Eintrag? Nur für die Prüfung
     der Vollständigkeit, nicht für die Darstellung. */
  function kennt(text) {
    const tabelle = woerter[aktuell];
    return !!(tabelle && tabelle[eng(String(text))] !== undefined);
  }

  /* Die Sprache muss feststehen, bevor irgendetwas anderes lädt: data.js
     baut den Beispielbestand beim Einlesen der Datei auf, und der trägt
     seine Titel und Beschreibungen fertig zusammengesetzt bei sich.
     Deshalb wird hier sofort entschieden – nur der Teil, der das Dokument
     anfasst, wartet auf DOMContentLoaded. */
  spracheBestimmen();

  TT.i18n = {
    SPRACHEN,
    sprache: () => aktuell,
    setze,
    t,
    kennt,
    eintragen,
    laden,
    on: (f) => { hoerer.push(f); },
    /* Nur für die Prüfskripte. */
    _tabelle: () => woerter[aktuell] || Object.create(null)
  };
})(window.TT = window.TT || {});
