/* =====================================================================
   TrimmoTrade – Start
   Letztes Skript: bindet die Darstellung an das System und startet die
   Oberfläche, sobald das Dokument bereit ist.
   ===================================================================== */
(function (TT) {
  'use strict';

  function los() {
    /* Zuerst die Sprache: Der erste Aufbau soll gleich richtig sein und
       nicht kurz auf Deutsch aufblitzen. */
    TT.i18n.laden();

    /* Dann die Frage, ob eine Serverseite antwortet. Sie entscheidet, ob
       die Anmeldung echt ist oder nachgebildet, und ob jemand schon
       angemeldet ist – beides muss vor dem ersten Zeichnen feststehen.
       Der Aufruf hat eine kurze eigene Frist und schlägt nie fehl; ohne
       Antwort läuft die Anwendung als Vorführung weiter. */
    if (TT.api) {
      /* Erst der Server, dann der Bestand: Ohne die echten Inserate
         würde die Suche einmal mit Beispielen aufblitzen und gleich
         darauf springen. Beides hat eine kurze Frist und schlägt nie
         fehl – ohne Antwort läuft die Anwendung als Vorführung weiter. */
      TT.api.pruefen()
        /* Erst der eigene Stand, dann der Bestand. Andersherum blitzte
           die Startseite kurz mit leerem Profil auf und sprang gleich
           darauf um, sobald die Merkliste ankam. */
        .then(() => (TT.store.laden(), Promise.all([
          TT.abgleich ? TT.abgleich.holen() : null,
          TT.plan ? TT.plan.standHolen() : null
        ])))
        .then(() => (TT.markt ? TT.markt.laden() : null))
        .then(weiter, weiter);
    } else {
      weiter();
    }
  }

  let schonGelaufen = false;

  function weiter() {
    if (schonGelaufen) return;
    schonGelaufen = true;

    /* Wechselt das System zwischen hell und dunkel, während die App läuft,
       und steht die Einstellung auf „automatisch“, wird neu gezeichnet. */
    const medium = window.matchMedia('(prefers-color-scheme: dark)');
    const beobachten = (e) => {
      if (TT.store.get().theme === 'auto') {
        document.documentElement.removeAttribute('data-theme');
      }
    };
    if (medium.addEventListener) medium.addEventListener('change', beobachten);
    else if (medium.addListener) medium.addListener(beobachten);

    TT.ui.start();

    /* Ein Besuch. Mehr wird darüber nicht festgehalten – keine Kennung,
       kein Verlauf, nur eine Tagessumme. */
    if (TT.markt) TT.markt.zaehle('besuch');

    /* Der Tresor liegt in einer eigenen Datenbank und antwortet erst kurz
       nach dem Start. Vorladen, damit die Freigabe im Anschreiben sofort
       zur Verfügung steht und nicht erst nach einem Besuch der Seite. */
    /* Erst den Kopf des Tresors holen – sonst stünde auf einem neuen
       Gerät „noch kein Tresor eingerichtet“, obwohl einer da ist. */
    if (TT.tresor && TT.viewTresor) {
      TT.tresor.metaHolen().then(() => TT.viewTresor.laden(), () => TT.viewTresor.laden());
    }

    /* Tastenkürzel auf einer Objektseite. */
    document.addEventListener('keydown', (e) => {
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (TT.ui.aktuell !== 'objekt' || !TT.ui.params.arg) return;
      const taste = e.key.toLowerCase();
      if (taste === 'm') { e.preventDefault(); TT.ui.AKTIONEN.merken({ dataset: { id: TT.ui.params.arg } }); }
      if (taste === 'v') { e.preventDefault(); TT.ui.AKTIONEN.vergleich({ dataset: { id: TT.ui.params.arg } }); }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', los);
  else los();
})(window.TT = window.TT || {});
