/* =====================================================================
   Nestwerk – Betreiberangaben und Rechtsgrundlagen

   Hier steht alles an einer Stelle, was in Impressum, Datenschutz-
   erklärung und AGB immer wieder auftaucht: wer der Anbieter ist, wie er
   erreichbar ist, welche Preise gelten. Die Texte greifen ausschließlich
   auf diese Werte zu. Wer umzieht, den Namen ändert oder den Preis
   anpasst, ändert das hier – und nicht an vierzehn Stellen im Fließtext.

   Was leer bleibt, wird in den Texten sichtbar als fehlende Angabe
   markiert, statt still zu verschwinden. Ein Impressum mit einer Lücke
   ist ein Fehler, den man sehen muss: Fehlt die ladungsfähige Anschrift
   oder eine schnelle elektronische Kontaktmöglichkeit, ist die
   Impressumspflicht nach § 5 DDG nicht erfüllt, und das ist abmahnbar.
   ===================================================================== */
(function (NW) {
  'use strict';

  const U = NW.util;

  /* Die Angaben, die der Betrieb selbst setzt. Was hier steht, ist
     Voreinstellung; überschrieben wird sie in der Anwendung unter
     „Angaben zum Anbieter“ und liegt dann im Speicher dieses Browsers. */
  const VORGABE = {
    name: 'Niklas Haberberg',
    rechtsform: 'Einzelunternehmen (Kleingewerbe)',
    zusatz: '',                 /* etwa „Nestwerk“ als Geschäftsbezeichnung */
    strasse: '',
    plz: '',
    ort: '',
    land: 'Deutschland',
    email: '',
    telefon: '',
    ustId: '',                  /* § 27a UStG – bei Kleinunternehmern meist keine */
    kleinunternehmer: true,     /* § 19 UStG: kein Ausweis von Umsatzsteuer */
    handelsregister: '',        /* Kleingewerbe: keins */
    gewerbeamt: '',             /* zuständige Stelle der Gewerbeanmeldung */
    aufsichtsbehoerde: '',      /* Datenschutz: Aufsichtsbehörde am Sitz */
    verantwortlichMStV: '',     /* § 18 Abs. 2 MStV – Name und Anschrift */
    stand: '2026-08-23'
  };

  /* Welche Felder wofür gebraucht werden. Grundlage für die Prüfliste
     und für die Markierungen im Text. */
  const PFLICHT = [
    { feld: 'name', label: 'Name des Anbieters', wofuer: 'Impressum, Datenschutz, AGB',
      grund: '§ 5 Abs. 1 Nr. 1 DDG, Art. 13 Abs. 1 lit. a DSGVO' },
    { feld: 'strasse', label: 'Straße und Hausnummer', wofuer: 'Impressum',
      grund: '§ 5 Abs. 1 Nr. 1 DDG – ladungsfähige Anschrift, kein Postfach' },
    { feld: 'plz', label: 'Postleitzahl', wofuer: 'Impressum', grund: '§ 5 Abs. 1 Nr. 1 DDG' },
    { feld: 'ort', label: 'Ort', wofuer: 'Impressum', grund: '§ 5 Abs. 1 Nr. 1 DDG' },
    { feld: 'email', label: 'E-Mail-Adresse', wofuer: 'Impressum, Datenschutz, Widerruf',
      grund: '§ 5 Abs. 1 Nr. 2 DDG – Pflichtangabe' },
    { feld: 'telefon', label: 'Telefonnummer', wofuer: 'Impressum',
      grund: '§ 5 Abs. 1 Nr. 2 DDG – oder ein anderes ebenso schnelles Mittel; die Rechtsprechung verlangt in der Regel die Nummer' },
    { feld: 'gewerbeamt', label: 'Stelle der Gewerbeanmeldung', wofuer: 'Prüfliste',
      grund: 'keine Impressumspflicht, aber nützlich für die eigene Ablage', freiwillig: true },
    { feld: 'aufsichtsbehoerde', label: 'Datenschutz-Aufsichtsbehörde', wofuer: 'Datenschutzerklärung',
      grund: 'Art. 13 Abs. 2 lit. d DSGVO – Hinweis auf das Beschwerderecht' }
  ];

  function angaben() {
    const eigene = (NW.store.get().betreiber) || {};
    return Object.assign({}, VORGABE, eigene);
  }

  function fehlt(feld) {
    const a = angaben();
    return !String(a[feld] || '').trim();
  }

  function fehlendeAngaben() {
    return PFLICHT.filter((p) => !p.freiwillig && fehlt(p.feld));
  }

  /* Im Text: entweder der Wert oder eine sichtbare Lücke. */
  function wert(feld, beschreibung) {
    const a = angaben();
    const v = String(a[feld] || '').trim();
    if (v) return U.html`${v}`;
    return U.html`<mark class="luecke" title="Diese Angabe fehlt noch">[${beschreibung || feld} eintragen]</mark>`;
  }

  function anschrift() {
    const a = angaben();
    return U.html`${wert('name', 'Name')}${a.zusatz ? U.html`<br>${a.zusatz}` : ''}<br>
      ${wert('strasse', 'Straße und Hausnummer')}<br>
      ${wert('plz', 'PLZ')} ${wert('ort', 'Ort')}<br>
      ${a.land}`;
  }

  const anschriftZeile = () => {
    const a = angaben();
    return [a.name, a.strasse, [a.plz, a.ort].filter(Boolean).join(' '), a.land].filter(Boolean).join(', ');
  };

  /* ------------------------- Preise ------------------------- */

  /* Preisangaben brauchen einen Gesamtpreis (§ 3 PAngV) und, bei
     Kleinunternehmern, den Hinweis auf § 19 UStG. Beides entsteht hier
     einmal und wird überall gleich verwendet. */
  function preisHinweis() {
    return angaben().kleinunternehmer
      ? 'Im Preis ist keine Umsatzsteuer enthalten; es wird keine ausgewiesen (Kleinunternehmerregelung nach § 19 UStG).'
      : 'Alle Preise verstehen sich als Gesamtpreise einschließlich der gesetzlichen Umsatzsteuer.';
  }

  /* ------------------------- Fassung ------------------------- */

  const stand = () => U.dateDE(angaben().stand);

  /* ------------------------- Was noch zu klären ist -------------------------

     Punkte, die keine Textbausteine sind, sondern Entscheidungen. Sie
     stehen in der Anwendung offen sichtbar, weil sie sonst untergehen. */

  const OFFEN = [
    {
      titel: 'Erlaubnis nach § 34c GewO – vermutlich nicht nötig, aber zu prüfen',
      text: 'Wer gewerbsmäßig den Abschluss von Verträgen über Wohnräume vermittelt oder die Gelegenheit dazu '
        + 'nachweist, braucht eine Erlaubnis der Gewerbebehörde. Nestwerk führt fremde Angebote zusammen und '
        + 'verlangt dafür kein Erfolgshonorar von Vermietenden – das spricht dagegen, dass eine Erlaubnis nötig '
        + 'ist. Sobald aber eine Provision im Erfolgsfall fließt, sieht es anders aus. Diese Frage gehört vor '
        + 'dem Start einmal schriftlich geklärt, am besten beim zuständigen Ordnungs- oder Gewerbeamt.'
    },
    {
      titel: 'Auftragsverarbeitung mit dem Hoster',
      text: 'Sobald die Seite bei einem Anbieter liegt, verarbeitet dieser Anbieter personenbezogene Daten – '
        + 'mindestens die IP-Adressen der Aufrufe. Dafür braucht es einen Vertrag nach Art. 28 DSGVO. Die '
        + 'meisten Hoster stellen ihn zum Abschluss im Kundenkonto bereit.'
    },
    {
      titel: 'Verzeichnis von Verarbeitungstätigkeiten',
      text: 'Art. 30 DSGVO verlangt es auch von kleinen Betrieben, sobald die Verarbeitung nicht nur '
        + 'gelegentlich erfolgt – bei einer laufenden Website ist das der Fall. Es ist kein Formular für die '
        + 'Behörde, sondern eine eigene Übersicht, die auf Verlangen vorgelegt wird.'
    },
    {
      titel: 'Zahlungsabwicklung',
      text: 'Sobald Plus bezahlt wird, kommt ein Zahlungsdienstleister ins Spiel. Er wird in der '
        + 'Datenschutzerklärung als Empfänger genannt, und die Bestellstrecke braucht die Schaltfläche mit '
        + 'der Aufschrift „zahlungspflichtig bestellen“ (§ 312j Abs. 3 BGB) sowie die Bestätigung des '
        + 'Vertrags auf einem dauerhaften Datenträger (§ 312f BGB).'
    },
    {
      titel: 'Gewerbeanmeldung und Finanzamt',
      text: 'Das Kleingewerbe wird beim Gewerbeamt der Wohnsitzgemeinde angemeldet; das Finanzamt schickt '
        + 'danach den Fragebogen zur steuerlichen Erfassung, in dem die Kleinunternehmerregelung nach § 19 UStG '
        + 'gewählt werden kann. Sie gilt, solange der Umsatz im laufenden Jahr 100.000 Euro nicht übersteigt. '
        + 'Wird die Grenze im Jahr überschritten, endet die Regelung ab diesem Umsatz – dann ist Umsatzsteuer '
        + 'auszuweisen, und die Preisangaben auf der Seite müssen mit.'
    },
    {
      titel: 'Diese Texte durch eine anwaltliche Prüfung schicken',
      text: 'Was hier steht, ist mit Sorgfalt und nach den geltenden Vorschriften geschrieben, aber es ist keine '
        + 'Rechtsberatung und ersetzt sie nicht. Vor dem ersten echten Nutzer sollte jemand mit Zulassung '
        + 'darüber gesehen haben – vor allem AGB, Haftung und die Frage nach § 34c GewO.'
    }
  ];

  NW.recht = {
    VORGABE, PFLICHT, OFFEN,
    angaben, fehlt, fehlendeAngaben, wert, anschrift, anschriftZeile,
    preisHinweis, stand
  };
})(window.NW = window.NW || {});
