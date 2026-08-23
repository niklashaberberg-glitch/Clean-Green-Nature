/* =====================================================================
   Nestwerk – Start
   Letztes Skript: bindet die Darstellung an das System und startet die
   Oberfläche, sobald das Dokument bereit ist.
   ===================================================================== */
(function (NW) {
  'use strict';

  function los() {
    /* Wechselt das System zwischen hell und dunkel, während die App läuft,
       und steht die Einstellung auf „automatisch“, wird neu gezeichnet. */
    const medium = window.matchMedia('(prefers-color-scheme: dark)');
    const beobachten = (e) => {
      if (NW.store.get().theme === 'auto') {
        document.documentElement.removeAttribute('data-theme');
      }
    };
    if (medium.addEventListener) medium.addEventListener('change', beobachten);
    else if (medium.addListener) medium.addListener(beobachten);

    NW.ui.start();

    /* Der Tresor liegt in einer eigenen Datenbank und antwortet erst kurz
       nach dem Start. Vorladen, damit die Freigabe im Anschreiben sofort
       zur Verfügung steht und nicht erst nach einem Besuch der Seite. */
    if (NW.viewTresor) NW.viewTresor.laden();

    /* Tastenkürzel auf einer Objektseite. */
    document.addEventListener('keydown', (e) => {
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (NW.ui.aktuell !== 'objekt' || !NW.ui.params.arg) return;
      const taste = e.key.toLowerCase();
      if (taste === 'm') { e.preventDefault(); NW.ui.AKTIONEN.merken({ dataset: { id: NW.ui.params.arg } }); }
      if (taste === 'v') { e.preventDefault(); NW.ui.AKTIONEN.vergleich({ dataset: { id: NW.ui.params.arg } }); }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', los);
  else los();
})(window.NW = window.NW || {});
