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

    /* Der Tresor liegt in einer eigenen Datenbank und antwortet erst kurz
       nach dem Start. Vorladen, damit die Freigabe im Anschreiben sofort
       zur Verfügung steht und nicht erst nach einem Besuch der Seite. */
    if (TT.viewTresor) TT.viewTresor.laden();

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
