/* =====================================================================
   TrimmoTrade – Hilfe: Fenster, Verlauf und Weitergabe an den Service

   Das Fenster hängt an jeder Seite, nicht an einer Route – wer eine Frage
   hat, hat sie dort, wo er gerade steht, und soll nicht erst zu einer
   Hilfeseite navigieren müssen. Unter #/hilfe gibt es dieselbe Sache noch
   einmal als vollständige Seite: verlinkbar, druckbar und ohne die
   Einschränkungen eines kleinen Fensters.

   Zur Weitergabe: Die Anwendung verschickt selbst keine Post. Sie baut
   die Nachricht vollständig zusammen und übergibt sie dem E-Mail-Programm
   des Geräts. Das ist keine Notlösung, sondern datenschutzrechtlich die
   saubere Variante – es
   verlässt nichts das Gerät, bevor jemand bewusst auf Senden geklickt
   hat, und der Text steht vorher sichtbar da. Wo kein Mailprogramm
   eingerichtet ist, lässt sich derselbe Text kopieren oder sichern.
   ===================================================================== */
(function (TT) {
  'use strict';

  const U = TT.util, ui = TT.ui, H = TT.hilfe, R = TT.recht;
  const h = U.html, raw = U.raw, ico = U.svg;

  /* ------------------------- Zustand ------------------------- */

  /* Der Verlauf ist bewusst flüchtig: Er lebt, solange die Seite offen
     ist. Ein Hilfegespräch, das Wochen später noch im Speicher steht,
     nützt niemandem und ist nur ein weiterer Ort mit persönlichen Daten. */
  let offen = false;
  let verlauf = [];
  let vorgang = '';
  let zuletztOffen = null;    /* Element, das den Fokus zurückbekommt */

  const MAX_MAILTO = 1600;    /* konservativ: manche Programme kürzen früher */

  function vorgangsnummer() {
    const d = TT.now();
    const teil = Math.random().toString(36).slice(2, 6).toUpperCase();
    return 'TT-' + U.isoDate(d).replace(/-/g, '') + '-' + teil;
  }

  function beginnen() {
    vorgang = vorgangsnummer();
    verlauf = [{
      von: 'bot', art: 'gruss',
      text: 'Hallo. Ich beantworte die häufigsten Fragen zu TrimmoTrade – zu Tarifen, zum Bewerben, zum '
        + 'Datenschutz und zur Anwendung selbst.\n\nWorum geht es?'
    }];
  }

  /* ------------------------- Bausteine ------------------------- */

  /* Antworten enthalten wenige, feste Auszeichnungen (<b>). Sie stammen
     aus dem eigenen Quelltext, nicht aus einer Eingabe – deshalb dürfen
     sie durch, alles andere wird maskiert. */
  function absaetze(text) {
    return raw(String(text).split(/\n\n+/).map((p) =>
      '<p>' + U.esc(p).replace(/\n/g, '<br>')
        .replace(/&lt;b&gt;/g, '<b>').replace(/&lt;\/b&gt;/g, '</b>') + '</p>').join(''));
  }

  function blase(n, i) {
    if (n.von === 'ich') {
      return h`<li class="hb hb--ich"><div class="hb__text">${n.text}</div></li>`;
    }
    return h`<li class="hb hb--bot">
      <span class="hb__zeichen" aria-hidden="true">${ico('nachricht')}</span>
      <div class="hb__text">
        ${n.titel ? h`<b class="hb__titel">${n.titel}</b>` : ''}
        ${absaetze(n.text)}
        ${(n.ziele || []).length ? h`<p class="hb__ziele">
          ${n.ziele.map((z) => h`<a class="knopf knopf--klein knopf--still" href="#/${z[1]}"
            data-tu="hilfe-gehen">${z[0]}</a>`)}
        </p>` : ''}
        ${(n.vorschlaege || []).length ? h`<p class="hb__chips">
          ${n.vorschlaege.map((t) => h`<button type="button" class="chip" data-tu="hilfe-thema"
            data-id="${t.id}">${t.titel}</button>`)}
        </p>` : ''}
        ${n.art === 'antwort' && n.bewertet === undefined ? h`<p class="hb__nutzen">
          <span>Hat das geholfen?</span>
          <button type="button" class="knopf knopf--klein knopf--still" data-tu="hilfe-nutzen"
            data-i="${i}" data-wert="ja">${ico('pruefen')}Ja</button>
          <button type="button" class="knopf knopf--klein knopf--still" data-tu="hilfe-nutzen"
            data-i="${i}" data-wert="nein">${ico('x')}Nein</button>
        </p>` : ''}
        ${n.bewertet === 'ja' ? h`<p class="hb__quittung">${ico('pruefen')}Freut mich.</p>` : ''}
      </div>
    </li>`;
  }

  function einstiegChips() {
    return h`<p class="hb__chips">
      ${H.einstieg().map((t) => h`<button type="button" class="chip" data-tu="hilfe-thema"
        data-id="${t.id}">${t.titel}</button>`)}
    </p>`;
  }

  function verlaufListe() {
    return h`<ol class="hilfe__verlauf" id="hilfe-verlauf">
      ${verlauf.map((n, i) => blase(n, i))}
      ${verlauf.length === 1 ? h`<li class="hb hb--frei">${einstiegChips()}</li>` : ''}
    </ol>`;
  }

  function eingabe() {
    return h`<form class="hilfe__eingabe" data-tu-submit="hilfe-fragen">
      <label class="nur-sr" for="hilfe-feld">Deine Frage</label>
      <input type="text" id="hilfe-feld" autocomplete="off" placeholder="Frage eingeben…"
        maxlength="300">
      <button type="submit" class="ikon-btn" aria-label="Frage senden">${ico('chevron')}</button>
    </form>`;
  }

  function fuss() {
    return h`<div class="hilfe__fuss">
      <button type="button" class="link" data-tu="hilfe-service">${ico('nachricht')}Ans Service-Team weitergeben</button>
      <a class="link" href="#/hilfe" data-tu="hilfe-gehen">alle Themen</a>
    </div>`;
  }

  /* ------------------------- Fenster ------------------------- */

  function fensterMarkup() {
    return h`<button type="button" class="hilfe__knopf ${offen ? 'is-offen' : ''}" data-tu="hilfe-umschalten"
        aria-expanded="${offen ? 'true' : 'false'}"${offen ? ' aria-controls="hilfe-fenster"' : ''}>
        ${ico(offen ? 'x' : 'nachricht')}<span class="hilfe__knopfwort">Hilfe</span>
      </button>
      ${offen ? h`<section class="hilfe__fenster" id="hilfe-fenster" role="dialog"
        aria-label="Hilfe zu TrimmoTrade">
        <header class="hilfe__kopf">
          <div>
            <b>Hilfe</b>
            <span>Antwortet sofort, im Browser</span>
          </div>
          <button type="button" class="ikon-btn" data-tu="hilfe-umschalten" aria-label="Hilfe schließen">${ico('x')}</button>
        </header>
        <div class="hilfe__koerper">
          ${verlaufListe()}
        </div>
        ${eingabe()}
        ${fuss()}
      </section>` : ''}`;
  }

  function zeichnen(scrollen) {
    const wurzel = U.$('#hilfe');
    if (!wurzel) return;
    const feld = U.$('#hilfe-feld');
    const wert = feld ? feld.value : '';
    wurzel.innerHTML = String(fensterMarkup());
    const neuFeld = U.$('#hilfe-feld');
    if (neuFeld) {
      neuFeld.value = wert;
      if (offen) neuFeld.focus({ preventScroll: true });
    }
    if (scrollen !== false) ansEnde();
  }

  function ansEnde() {
    const box = U.$('.hilfe__koerper');
    if (box) box.scrollTop = box.scrollHeight;
  }

  /* ------------------------- Ablauf ------------------------- */

  function frageStellen(text) {
    const t = String(text || '').trim();
    if (!t) return;
    verlauf.push({ von: 'ich', text: t });
    const ergebnis = H.antworten(t);
    if (ergebnis.sicher) {
      themaAntworten(ergebnis.thema);
    } else {
      verlauf.push({
        von: 'bot', art: 'unsicher',
        text: ergebnis.unklar
          ? 'Da bin ich mir nicht sicher – es könnte um mehreres gehen. Welches trifft es?'
          : (ergebnis.vorschlaege.length
            ? 'Das habe ich nicht sicher verstanden. Meintest du eines davon?'
            : 'Dazu habe ich keine Antwort. Ich beantworte nur, was jemand hier hinterlegt hat – raten wäre '
            + 'schlechter als zugeben, dass ich es nicht weiß.\n\nGib die Frage ans Service-Team weiter, dann '
            + 'schaut ein Mensch darauf.'),
        vorschlaege: ergebnis.vorschlaege
      });
    }
    zeichnen();
  }

  function themaAntworten(t) {
    verlauf.push({
      von: 'bot', art: 'antwort', themaId: t.id, titel: t.titel,
      text: H.text(t), ziele: t.ziele || []
    });
  }

  /* ------------------------- Weitergabe ------------------------- */

  /* Die Kerninhalte: was gefragt wurde, welche Themen beantwortet wurden
     und ob es geholfen hat. Nicht der ganze Antworttext – der steht schon
     auf der Seite und würde die Nachricht nur unlesbar machen. */
  function kern() {
    const fragen = verlauf.filter((n) => n.von === 'ich').map((n) => n.text);
    const themen = verlauf.filter((n) => n.art === 'antwort').map((n) => ({
      titel: n.titel,
      geholfen: n.bewertet === 'ja' ? 'hat geholfen' : n.bewertet === 'nein' ? 'hat nicht geholfen' : 'ohne Rückmeldung'
    }));
    const offeneThemen = verlauf.filter((n) => n.art === 'unsicher').length;
    return { fragen, themen, offeneThemen };
  }

  function nachrichtText(angaben) {
    const k = kern();
    const z = [];
    z.push('Support-Anfrage über die Hilfe von TrimmoTrade');
    z.push('Vorgang: ' + vorgang);
    z.push('Datum: ' + U.dateDE(U.isoDate(TT.now())));
    z.push('Zuletzt geöffnet: ' + (ui.aktuell || 'start'));
    z.push('');
    z.push('ANLIEGEN');
    z.push(angaben.anliegen || '(nicht ausgefüllt)');
    z.push('');
    if (k.fragen.length) {
      z.push('GESTELLTE FRAGEN');
      k.fragen.forEach((f, i) => z.push('  ' + (i + 1) + '. ' + f));
      z.push('');
    }
    if (k.themen.length) {
      z.push('GEZEIGTE ANTWORTEN');
      k.themen.forEach((t) => z.push('  · ' + t.titel + ' – ' + t.geholfen));
      z.push('');
    }
    if (k.offeneThemen) {
      z.push('Die Hilfe konnte ' + k.offeneThemen + ' '
        + U.plural(k.offeneThemen, 'Frage', 'Fragen') + ' nicht zuordnen.');
      z.push('');
    }
    z.push('RÜCKMELDUNG AN');
    z.push('  Name:   ' + (angaben.name || '(nicht angegeben)'));
    z.push('  E-Mail: ' + (angaben.email || '(nicht angegeben)'));
    z.push('');
    z.push('---');
    z.push('Zusammengestellt von der Hilfe in TrimmoTrade. Es wurden keine Profildaten,');
    z.push('Merklisten oder Unterlagen aus dem Dokumententresor übertragen.');
    return z.join('\n');
  }

  function serviceDialog() {
    const a = R.angaben();
    if (!vorgang) beginnen();
    ui.dialog({
      titel: 'Ans Service-Team weitergeben',
      breit: true,
      inhalt: h`<p>Die Zusammenfassung dieses Gesprächs geht an
          <b>${a.service || 'das Service-Postfach'}</b>. Sie wird gleich vollständig angezeigt – abgeschickt
          wird sie erst, wenn du es auslöst.</p>
        <div class="formraster">
          <label class="feld"><span>Dein Name (freiwillig)</span>
            <input type="text" id="hilfe-name" autocomplete="name"></label>
          <label class="feld"><span>Deine E-Mail für die Antwort</span>
            <input type="email" id="hilfe-mail" autocomplete="email"
              placeholder="ohne Adresse kann niemand antworten"></label>
        </div>
        <label class="feld"><span>Worum geht es? Was fehlt dir noch?</span>
          <textarea rows="4" id="hilfe-anliegen"
            placeholder="Je konkreter, desto schneller die Antwort."></textarea></label>
        <p class="werkzeug__weiter">
          <button type="button" class="knopf knopf--still" data-tu="hilfe-vorschau">${ico('lupe')}Nachricht anzeigen</button>
        </p>
        <div id="hilfe-vorschau"></div>
        <div class="hinweisbox">${ico('schloss')}
          <div><b>Was übertragen wird – und was nicht</b>
          <p>Übertragen wird ausschließlich der Text, der dir gleich angezeigt wird: deine Fragen, die Titel
            der gezeigten Antworten, dein Anliegen und die Kontaktangaben, die du selbst einträgst. <b>Nicht
            übertragen werden</b> dein Profil, deine Merkliste, deine Suchaufträge und die Unterlagen aus dem
            Dokumententresor.</p>
          <p>TrimmoTrade verschickt die Nachricht nicht selbst, sondern übergibt sie dem E-Mail-Programm
            dieses Geräts – dort kannst du sie vor dem Senden noch ändern. Wo kein Programm eingerichtet ist,
            kopier den Text oder sichere ihn als Datei.</p></div>
        </div>`,
      fuss: h`<button type="button" class="knopf knopf--still" data-tu="hilfe-kopieren">${ico('kopieren')}Text kopieren</button>
        <button type="button" class="knopf knopf--still" data-tu="hilfe-sichern">${ico('speichern')}Als Datei</button>
        <button type="button" class="knopf" data-tu="hilfe-senden">${ico('nachricht')}E-Mail öffnen</button>`
    });
  }

  function formularWerte() {
    return {
      name: (U.$('#hilfe-name') || {}).value || '',
      email: (U.$('#hilfe-mail') || {}).value || '',
      anliegen: (U.$('#hilfe-anliegen') || {}).value || ''
    };
  }

  function vorschauZeigen() {
    const el = U.$('#hilfe-vorschau');
    if (!el) return '';
    const text = nachrichtText(formularWerte());
    el.innerHTML = String(h`<label class="feld"><span>Diese Nachricht wird übergeben</span>
      <textarea rows="14" id="hilfe-text" readonly>${text}</textarea></label>`);
    return text;
  }

  /* ------------------------- Vollständige Seite ------------------------- */

  function seite() {
    const gruppen = H.GRUPPEN();
    const a = R.angaben();
    return {
      titel: 'Hilfe',
      html: h`<div class="seite seite--schmal">
        <header class="seite__kopf">
          <h1>${ico('nachricht')}Hilfe</h1>
          <p class="seite__unter">Alle Themen auf einen Blick. Für eine einzelne Frage genügt das Hilfefenster
            unten rechts – es ist auf jeder Seite erreichbar.</p>
        </header>

        <div class="hinweisbox">${ico('info')}
          <div><b>Das hier ist kein Sprachmodell</b>
          <p>Die Hilfe rechnet im Browser und ordnet deine Frage einer von
            ${TT.hilfe.THEMEN.length} hinterlegten Antworten zu. Sie erfindet nichts, und wo sie unsicher ist,
            sagt sie es und fragt nach. Führt das nicht weiter, geht die Zusammenfassung auf deinen Klick an
            ${a.service || 'das Service-Postfach'} – dort schaut ein Mensch darauf.</p></div>
        </div>

        <p class="werkzeug__weiter">
          <button type="button" class="knopf" data-tu="hilfe-oeffnen">${ico('nachricht')}Frage stellen</button>
          <button type="button" class="knopf knopf--still" data-tu="hilfe-service">Direkt ans Service-Team</button>
        </p>

        ${Object.keys(gruppen).map((g) => h`<section class="block">
          <h2>${g}</h2>
          <div class="hilfeliste">
            ${gruppen[g].map((t) => h`<details class="rechtsfrage">
              <summary>${t.titel}</summary>
              <div class="hilfeliste__antwort">
                ${absaetze(H.text(t))}
                ${(t.ziele || []).length ? h`<p class="hb__ziele">
                  ${t.ziele.map((z) => h`<a class="knopf knopf--klein knopf--still" href="#/${z[1]}">${z[0]}</a>`)}
                </p>` : ''}
              </div>
            </details>`)}
          </div>
        </section>`)}
      </div>`
    };
  }

  /* ------------------------- Aktionen ------------------------- */

  const A_ = ui.aktionRegistrieren;

  A_('hilfe-umschalten', (el) => {
    offen = !offen;
    if (offen) {
      zuletztOffen = el;
      if (!verlauf.length) beginnen();
    }
    zeichnen();
    if (!offen && zuletztOffen) {
      const knopf = U.$('.hilfe__knopf');
      if (knopf) knopf.focus();
    }
  });

  A_('hilfe-oeffnen', () => {
    if (!verlauf.length) beginnen();
    offen = true;
    zeichnen();
  });

  A_('hilfe-fragen', () => {
    const feld = U.$('#hilfe-feld');
    if (!feld) return;
    const text = feld.value;
    feld.value = '';
    frageStellen(text);
  });

  A_('hilfe-thema', (el) => {
    const t = H.thema(el.dataset.id);
    if (!t) return;
    verlauf.push({ von: 'ich', text: t.titel });
    themaAntworten(t);
    zeichnen();
  });

  A_('hilfe-nutzen', (el) => {
    const i = Number(el.dataset.i);
    const n = verlauf[i];
    if (!n) return;
    n.bewertet = el.dataset.wert;
    if (el.dataset.wert === 'nein') {
      verlauf.push({
        von: 'bot', art: 'weiter',
        text: 'Dann bringt Raten nichts. Zwei Wege: Entweder du fragst anders – dann versuche ich es noch '
          + 'einmal –, oder ich fasse das Gespräch zusammen und gebe es ans Service-Team weiter. Dort '
          + 'antwortet ein Mensch.',
        ziele: []
      });
    }
    zeichnen();
  });

  A_('hilfe-gehen', () => {
    /* Ein Verweis aus dem Fenster wechselt die Seite – das Fenster darf
       dabei nicht über dem neuen Inhalt stehen bleiben. */
    offen = false;
    setTimeout(() => zeichnen(false), 0);
  });

  A_('hilfe-service', () => { serviceDialog(); });

  A_('hilfe-vorschau', () => { vorschauZeigen(); });

  A_('hilfe-senden', () => {
    const w = formularWerte();
    const text = vorschauZeigen();
    const a = R.angaben();
    const ziel = a.service || 'service@trimmotrade.de';
    const betreff = 'Support-Anfrage ' + vorgang;
    const kurz = text.length > MAX_MAILTO
      ? text.slice(0, MAX_MAILTO) + '\n\n[gekürzt – die vollständige Fassung liegt in der Zwischenablage]'
      : text;
    if (text.length > MAX_MAILTO) ui.AKTIONEN.kopieren({ dataset: { text } });
    const url = 'mailto:' + encodeURIComponent(ziel)
      + '?subject=' + encodeURIComponent(betreff)
      + '&body=' + encodeURIComponent(kurz);
    try {
      window.location.href = url;
      ui.toast('E-Mail-Programm geöffnet. Abgeschickt wird erst dort.', 'gut');
    } catch (e) {
      ui.toast('Kein E-Mail-Programm gefunden. Kopier den Text stattdessen.', 'schlecht');
    }
  });

  A_('hilfe-kopieren', () => {
    ui.AKTIONEN.kopieren({ dataset: { text: nachrichtText(formularWerte()) } });
  });

  A_('hilfe-sichern', () => {
    ui.dateiSichern('trimmotrade-anfrage-' + (vorgang || 'entwurf') + '.txt',
      nachrichtText(formularWerte()), 'text/plain');
  });

  /* Escape schließt das Fenster – aber nur, wenn kein Dialog darüber liegt. */
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape' || !offen) return;
    const dialogOffen = U.$('#dialog') && !U.$('#dialog').hidden;
    if (dialogOffen) return;
    offen = false;
    zeichnen(false);
    const knopf = U.$('.hilfe__knopf');
    if (knopf) knopf.focus();
  });

  ui.ansichten.hilfe = seite;
  TT.viewHilfe = { zeichnen, frageStellen, nachrichtText, kern, oeffnen: () => { offen = true; zeichnen(); } };
})(window.TT = window.TT || {});
