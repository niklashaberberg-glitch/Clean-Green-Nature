/* =====================================================================
   Nestwerk – Tarife und Werbung

   Leitgedanke, an dem sich jede Entscheidung hier messen lassen muss:

     Plus bezahlt Zeitersparnis bei häufiger Nutzung.
     Plus bezahlt niemals einen Vorteil gegenüber anderen Bewerbern.

   Deshalb bleibt alles frei, was schützt (Prüfhinweis, Vergleichsmiete,
   Chancen), was gerechnet werden muss (Leistbarkeit, Wohngeld, Kosten)
   und was man einmal im Leben braucht (Übergabe, Nebenkosten, Umzug).
   Hinter Plus liegt, was jemand zehnmal am Tag anfasst.
   ===================================================================== */
(function (NW) {
  'use strict';

  const U = NW.util;

  /* ------------------------- Tarife ------------------------- */

  const TARIFE = {
    frei: {
      id: 'frei', name: 'Nestwerk frei', preisMonat: 0, preisJahr: 0,
      zeile: 'Vollständige Suche, dauerhaft kostenlos – finanziert über Anzeigen.'
    },
    plus: {
      id: 'plus', name: 'Nestwerk Plus', preisMonat: 7.90, preisJahr: 69,
      zeile: 'Für alle, die täglich suchen: keine Anzeigen, keine Limits, weniger Handarbeit.'
    }
  };

  /* Alles, was sich zwischen den Tarifen unterscheidet, steht hier –
     einmal, an einer Stelle, damit Preisseite und Sperren nie auseinanderlaufen. */
  const GRENZEN = {
    frei: {
      suchauftraege: 1,
      vergleich: 2,
      anker: 1,
      lupeFunde: 1,
      ringLaenge: 2,
      werbung: true,
      stellschrauben: false,
      serienbewerbung: false,
      marktdaten: false,
      exposeExport: false,
      nachfassen: false,
      tagesplan: false
    },
    plus: {
      suchauftraege: Infinity,
      vergleich: 6,
      anker: Infinity,
      lupeFunde: Infinity,
      ringLaenge: 4,
      werbung: false,
      stellschrauben: true,
      serienbewerbung: true,
      marktdaten: true,
      exposeExport: true,
      nachfassen: true,
      tagesplan: true
    }
  };

  /* Beschreibung jeder Leistung – Grundlage für Preisseite und Sperrhinweise. */
  const LEISTUNGEN = [
    { id: 'suche', gruppe: 'Suchen', name: 'Alle Inserate, alle vier Angebotsarten',
      frei: 'vollständig', plus: 'vollständig', gleich: true },
    { id: 'passung', gruppe: 'Suchen', name: 'Passung nach eigenem Profil, ohne bezahlte Plätze',
      frei: 'vollständig', plus: 'vollständig', gleich: true },
    { id: 'karte', gruppe: 'Suchen', name: 'Karte mit Preisniveau und Umkreis',
      frei: 'vollständig', plus: 'vollständig', gleich: true },
    { id: 'merkliste', gruppe: 'Suchen', name: 'Merkliste und Bewerbungstafel',
      frei: 'unbegrenzt', plus: 'unbegrenzt', gleich: true },

    { id: 'pruefhinweis', gruppe: 'Schutz', name: 'Prüfhinweis gegen erfundene Inserate',
      frei: 'vollständig', plus: 'vollständig', gleich: true,
      warum: 'Betrugsschutz hinter eine Bezahlschranke zu stellen wäre zynisch.' },
    { id: 'spiegel', gruppe: 'Schutz', name: 'Vergleichsmiete und Mietpreisbremse',
      frei: 'vollständig', plus: 'vollständig', gleich: true },
    { id: 'chancen', gruppe: 'Schutz', name: 'Ehrliche Einschätzung deiner Chancen',
      frei: 'vollständig', plus: 'vollständig', gleich: true },
    { id: 'duplikate', gruppe: 'Schutz', name: 'Doppelt eingestellte Wohnungen erkennen',
      frei: 'vollständig', plus: 'vollständig', gleich: true },

    { id: 'rechner', gruppe: 'Rechnen', name: 'Leistbarkeit, Wohngeld, WBS, echte Monatskosten',
      frei: 'vollständig', plus: 'vollständig', gleich: true },
    { id: 'nebenkosten', gruppe: 'Rechnen', name: 'Nebenkostenabrechnung prüfen',
      frei: 'vollständig', plus: 'vollständig', gleich: true },
    { id: 'uebergabe', gruppe: 'Rechnen', name: 'Übergabeprotokoll und Umzugsplan',
      frei: 'vollständig', plus: 'vollständig', gleich: true,
      warum: 'Braucht man einmal beim Umzug – dafür ein Abo zu verlangen wäre unverschämt.' },

    { id: 'tresor', gruppe: 'Schutz', name: 'Dokumententresor mit Ende-zu-Ende-Verschlüsselung',
      frei: 'unbegrenzt', plus: 'unbegrenzt', gleich: true,
      warum: 'Wer für Datenschutz zahlen muss, hat keinen. Verschlüsselung ist kein Zusatzverkauf.' },
    { id: 'freigaben', gruppe: 'Schutz', name: 'Befristete Verweise statt Anhänge, jederzeit widerrufbar',
      frei: 'unbegrenzt', plus: 'unbegrenzt', gleich: true },

    { id: 'werbung', gruppe: 'Täglich', name: 'Anzeigenfrei', frei: 'mit Anzeigen', plus: 'ohne Anzeigen' },
    { id: 'suchauftraege', gruppe: 'Täglich', name: 'Suchaufträge mit sofortiger Meldung',
      frei: '1 Auftrag', plus: 'unbegrenzt' },
    { id: 'anker', gruppe: 'Täglich', name: 'Ankerpunkte für Fahrzeiten',
      frei: '1 Ort', plus: 'unbegrenzt' },
    { id: 'vergleich', gruppe: 'Täglich', name: 'Objekte nebeneinander vergleichen',
      frei: '2 Objekte', plus: '6 Objekte' },
    { id: 'lupe', gruppe: 'Täglich', name: 'Vertragslupe',
      frei: 'erster Fund', plus: 'alle Funde mit Erläuterung' },
    { id: 'ring', gruppe: 'Täglich', name: 'Ringtausch',
      frei: 'direkte Tausche', plus: 'Ketten über drei und vier Haushalte' },
    { id: 'stellschrauben', gruppe: 'Täglich', name: 'Durchgerechnete Stellschrauben beim Tausch',
      frei: 'nein', plus: 'ja' },
    { id: 'serie', gruppe: 'Täglich', name: 'Serienbewerbung aus der Merkliste',
      frei: 'nein', plus: 'ja' },
    { id: 'nachfassen', gruppe: 'Täglich', name: 'Erinnerung ans Nachfassen',
      frei: 'nein', plus: 'ja' },
    { id: 'tagesplan', gruppe: 'Täglich', name: 'Besichtigungen zu einer Route ordnen',
      frei: 'nein', plus: 'ja' },
    { id: 'marktdaten', gruppe: 'Täglich', name: 'Preisverlauf und Marktdaten je Viertel',
      frei: 'nein', plus: 'ja' },
    { id: 'expose', gruppe: 'Täglich', name: 'Exposé und Merkliste als Datei',
      frei: 'nein', plus: 'ja' }
  ];

  /* Was Plus ausdrücklich nicht kauft. Steht so auch auf der Preisseite. */
  const NICHT_KAEUFLICH = [
    'Keine bessere Platzierung in der Trefferliste – die Reihenfolge entsteht allein aus deinem Profil.',
    'Kein Vorrang bei Vermietern und keine Markierung in deiner Bewerbung.',
    'Kein Frühzugang zu neuen Inseraten. Alle sehen jedes Inserat in derselben Sekunde.',
    'Keine Daten anderer Nutzerinnen und Nutzer.',
    'Kein besserer Datenschutz gegen Aufpreis – der Dokumententresor und die widerrufbaren Verweise sind im freien Tarif vollständig enthalten.',
    'Keine Werbung, die sich als Inserat ausgibt – Anzeigen sind immer als solche gekennzeichnet.'
  ];

  /* ------------------------- Zustand ------------------------- */

  function aktuell() {
    const s = NW.store.get();
    return s.tarif === 'plus' ? 'plus' : 'frei';
  }

  const istPlus = () => aktuell() === 'plus';
  const grenze = (name) => GRENZEN[aktuell()][name];
  const darf = (name) => !!GRENZEN[aktuell()][name];

  function leistung(id) {
    return LEISTUNGEN.find((l) => l.id === id);
  }

  function wechseln(tarif, intervall) {
    NW.store.set({
      tarif: tarif === 'plus' ? 'plus' : 'frei',
      tarifIntervall: intervall || 'monat',
      tarifSeit: U.isoDate(NW.now())
    }, 'tarif');
  }

  /* ------------------------- Anzeigen ------------------------- */

  /* Erfundene Beispielanzeigen. Keine echten Marken, keine echten
     Angebote – sie zeigen nur, wie Werbung im freien Tarif aussieht:
     immer gekennzeichnet, nie im Gewand eines Inserats. */
  const ANZEIGEN = [
    {
      id: 'umzug', art: 'Umzug', icon: 'umzug',
      titel: 'Umzugshelfer im Umkreis vergleichen',
      text: 'Drei Angebote für den Umzugstag, Halteverbot inklusive.',
      absender: 'Beispiel-Umzugsdienst', ruf: 'Angebote ansehen'
    },
    {
      id: 'kaution', art: 'Finanzen', icon: 'euro',
      titel: 'Kautionsbürgschaft statt Barkaution',
      text: 'Drei Monatsmieten nicht auf einmal binden – gegen Jahresbeitrag.',
      absender: 'Beispiel-Bürgschaft', ruf: 'Bedingungen lesen'
    },
    {
      id: 'hausrat', art: 'Versicherung', icon: 'schluessel',
      titel: 'Hausrat zum Einzug versichern',
      text: 'Schutz ab dem Tag der Schlüsselübergabe.',
      absender: 'Beispiel-Versicherung', ruf: 'Tarif berechnen'
    },
    {
      id: 'internet', art: 'Anschluss', icon: 'blitz',
      titel: 'Internet an der neuen Adresse prüfen',
      text: 'Verfügbarkeit und Schaltdauer vor dem Einzug klären.',
      absender: 'Beispiel-Anbieter', ruf: 'Adresse prüfen'
    },
    {
      id: 'moebel', art: 'Einrichtung', icon: 'haus',
      titel: 'Küche nach Maß für kleine Grundrisse',
      text: 'Planung vor Ort, Aufbau am Einzugstag.',
      absender: 'Beispiel-Küchenstudio', ruf: 'Termin anfragen'
    },
    {
      id: 'strom', art: 'Energie', icon: 'blitz',
      titel: 'Stromtarif zum Einzug wechseln',
      text: 'Anmeldung an der neuen Adresse in wenigen Minuten.',
      absender: 'Beispiel-Energieversorger', ruf: 'Tarife vergleichen'
    },
    {
      id: 'handwerk', art: 'Handwerk', icon: 'stift',
      titel: 'Malerarbeiten vor dem Einzug',
      text: 'Wände streichen, bevor die Möbel kommen.',
      absender: 'Beispiel-Malerbetrieb', ruf: 'Angebot einholen'
    }
  ];

  /* Wählt eine Anzeige stabil zur Position – beim Blättern springt
     dadurch nichts herum. */
  function anzeige(schluessel) {
    if (!GRENZEN[aktuell()].werbung) return null;
    return ANZEIGEN[U.hash(String(schluessel)) % ANZEIGEN.length];
  }

  /* Nach wie vielen Treffern eine Anzeige eingeschoben wird. */
  const ANZEIGE_ABSTAND = 6;

  NW.plan = {
    TARIFE, GRENZEN, LEISTUNGEN, NICHT_KAEUFLICH, ANZEIGEN, ANZEIGE_ABSTAND,
    aktuell, istPlus, grenze, darf, leistung, wechseln, anzeige
  };
})(window.NW = window.NW || {});
