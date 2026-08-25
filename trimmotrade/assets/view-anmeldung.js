/* =====================================================================
   TrimmoTrade – Anmeldung und Konto: Oberfläche

   Zwei Dinge, die diese Seite anders macht als die meisten Anmeldungen:

   1. Impressum, Datenschutzerklärung und AGB sind auch ohne Anmeldung
      erreichbar. § 5 DDG verlangt, dass sie „leicht erkennbar, unmittelbar
      erreichbar und ständig verfügbar“ sind – hinter einer Anmeldung sind
      sie das nicht. Dasselbe gilt für die Hilfe: Wer nicht hereinkommt,
      braucht sie am dringendsten.

   2. Die Reihenfolge der Verfahren folgt der Sicherheit, nicht der
      Bekanntheit. Der Passkey steht oben, weil er als Einziges gegen
      nachgebaute Anmeldeseiten schützt.
   ===================================================================== */
(function (TT) {
  'use strict';

  const U = TT.util, ui = TT.ui, K = TT.konto, R = TT.recht;
  const h = U.html, raw = U.raw, ico = U.svg;

  /* Schritt: 'wahl' | 'mail' | 'code' | 'anbieter' */
  let schritt = 'wahl';
  let entwurf = { mail: '', name: '', anbieter: '', agb: false };
  let meldung = '';
  let passkeyDa = false;

  K.passkeyPlattform().then((ja) => {
    passkeyDa = ja;
    if (ui.aktuell === 'anmelden') ui.neuZeichnen();
  });

  /* ================================================================
     Anmeldeseite
     ================================================================ */

  function anbieterKnopf(a) {
    const gesperrt = a.id === 'passkey' && !K.passkeyMoeglich();
    return h`<button type="button" class="anmeldung__weg ${a.empfohlen ? 'is-empfohlen' : ''}"
      data-tu="anmelden-weg" data-id="${a.id}" ${gesperrt ? 'disabled' : ''}>
      <span class="anmeldung__zeichen" style="color:${a.farbe || 'currentColor'}">${ico(a.icon)}</span>
      <span class="anmeldung__wort">
        <b>${a.name}</b>
        <i>${gesperrt ? 'Dieser Browser kann keine Passkeys' : a.unter}</i>
      </span>
      ${a.empfohlen && !gesperrt ? h`<span class="anmeldung__marke">${passkeyDa ? 'am sichersten' : 'empfohlen'}</span>` : ''}
      ${a.nachbau ? h`<span class="anmeldung__nachbau"
        title="In dieser Vorführung nachgebildet">${a.nachbau}</span>` : ''}
    </button>`;
  }

  function wahlSchritt() {
    return h`<div class="anmeldung__wege">
        ${K.ANBIETER.map(anbieterKnopf)}
      </div>
      <details class="anmeldung__warum">
        <summary>${ico('schloss')}Warum steht der Passkey oben?</summary>
        <p>Weil er als Einziges gegen die häufigste Masche schützt: eine nachgebaute Anmeldeseite. Ein Passkey
          ist an die Adresse gebunden, unter der er angelegt wurde. Wer auf eine gefälschte Seite hereinfällt,
          gibt dort nichts preis – es gibt nichts einzugeben. Der Schlüssel entsteht im Sicherheitschip deines
          Geräts und verlässt ihn nie.</p>
        <p>Bei Google, Microsoft und Apple bekommt TrimmoTrade Name und E-Mail-Adresse, dein Passwort dort aber
          nie zu sehen. Beim Weg über die E-Mail-Adresse gibt es gar kein Passwort, sondern einen Code, der
          zehn Minuten gilt.</p>
      </details>`;
  }

  function mailSchritt() {
    return h`<form class="anmeldung__form" data-tu-submit="anmelden-code-anfordern" novalidate>
      <label class="feld"><span>E-Mail-Adresse</span>
        <input type="email" id="anmelden-mail" autocomplete="email" required inputmode="email"
          value="${entwurf.mail}" placeholder="name@beispiel.de"></label>
      <label class="feld"><span>Name (freiwillig)</span>
        <input type="text" id="anmelden-name" autocomplete="name" value="${entwurf.name}"
          placeholder="wie du in Anfragen erscheinst"></label>
      ${agbKasten()}
      <button type="submit" class="knopf knopf--voll">${ico('nachricht')}Code anfordern</button>
      <button type="button" class="link" data-tu="anmelden-zurueck">anderes Verfahren wählen</button>
    </form>`;
  }

  function codeSchritt() {
    const c = K.codeStand();
    return h`<form class="anmeldung__form" data-tu-submit="anmelden-code-pruefen" novalidate>
      <p>Wir haben einen sechsstelligen Code an <b>${entwurf.mail}</b> geschickt. Er gilt
        ${K.CODE_GUELTIG_MIN} Minuten.</p>
      ${c ? h`<div class="anmeldung__demo">
        ${ico('warnung')}
        <div><b>Vorführung: Der Code steht hier</b>
        <p>Es gibt keinen Server, der eine Mail verschicken könnte. Im Betrieb stünde hier nichts – der Code
          käme in dein Postfach.</p>
        <span class="anmeldung__code">${c.code}</span></div>
      </div>` : ''}
      <label class="feld"><span>Code</span>
        <input type="text" id="anmelden-code" inputmode="numeric" autocomplete="one-time-code"
          pattern="[0-9 ]{6,8}" maxlength="8" required placeholder="000000"></label>
      <button type="submit" class="knopf knopf--voll">${ico('pruefen')}Anmelden</button>
      <p class="werkzeug__weiter">
        <button type="button" class="link" data-tu="anmelden-code-neu">neuen Code anfordern</button>
        <button type="button" class="link" data-tu="anmelden-zurueck">Adresse ändern</button>
      </p>
    </form>`;
  }

  /* Der nachgebildete Zustimmungsdialog der drei Anbieter. Er zeigt genau
     das, was der echte zeigt – und sagt darüber, dass er nachgebildet ist. */
  function anbieterSchritt() {
    const a = K.anbieter(entwurf.anbieter);
    if (!a) { schritt = 'wahl'; return wahlSchritt(); }
    return h`<div class="anmeldung__form">
      <div class="anmeldung__demo">
        ${ico('warnung')}
        <div><b>Nachgebildeter Ablauf</b>
        <p>Das echte Verfahren braucht zwingend eine Serverseite, die das Geheimnis hält und das
          zurückgegebene Token prüft. Ein reiner Browser kann das nicht. Was du gleich siehst, entspricht dem
          Ablauf – die Bestätigung kommt aber nicht von ${a.name.replace('Weiter mit ', '')}.</p></div>
      </div>
      <div class="anmeldung__zustimmung">
        <p class="anmeldung__zustimmungKopf">
          <span class="anmeldung__zeichen" style="color:${a.farbe}">${ico(a.icon)}</span>
          <b>TrimmoTrade möchte auf dein Konto zugreifen</b>
        </p>
        <ul class="pruef">
          <li>${ico('pruefen')}<span>Name und Profilbild</span></li>
          <li>${ico('pruefen')}<span>E-Mail-Adresse und ob sie bestätigt ist</span></li>
          <li>${ico('x')}<span>Kein Zugriff auf Kontakte, Kalender, Dateien oder Postfach</span></li>
          <li>${ico('x')}<span>Dein Passwort bekommt TrimmoTrade nie zu sehen</span></li>
        </ul>
        ${a.id === 'apple' ? h`<label class="schalter">
          <input type="checkbox" id="anmelden-verbergen" checked>
          <span><b>E-Mail-Adresse verbergen</b>
            <i>TrimmoTrade bekommt eine Weiterleitungsadresse statt deiner echten.</i></span></label>` : ''}
        <label class="feld"><span>Welches Konto?</span>
          <input type="email" id="anmelden-mail" autocomplete="email" required
            value="${entwurf.mail}" placeholder="name@beispiel.de"></label>
        <label class="feld"><span>Name</span>
          <input type="text" id="anmelden-name" autocomplete="name" value="${entwurf.name}"></label>
      </div>
      ${agbKasten()}
      <button type="button" class="knopf knopf--voll" data-tu="anmelden-anbieter-fertig"
        data-id="${a.id}">${ico('pruefen')}Zulassen und anmelden</button>
      <button type="button" class="link" data-tu="anmelden-zurueck">Abbrechen</button>
      <details class="anmeldung__warum">
        <summary>${ico('werkzeug')}Was im Betrieb einzurichten ist</summary>
        <p>${a.einrichtung}</p>
      </details>
    </div>`;
  }

  /* § 305 Abs. 2 BGB: AGB werden nur Vertragsbestandteil, wenn vor
     Vertragsschluss ausdrücklich darauf hingewiesen wird und man sie zur
     Kenntnis nehmen kann. Ein vorausgewähltes Kästchen genügt dafür
     nicht – deshalb ist es leer und die Verweise sind echte Verweise. */
  function agbKasten() {
    return h`<label class="schalter anmeldung__agb">
      <input type="checkbox" id="anmelden-agb" ${entwurf.agb ? 'checked' : ''}>
      <span>Ich habe die <a href="#/recht/agb">Allgemeinen Geschäftsbedingungen</a> und die
        <a href="#/recht/datenschutz">Datenschutzerklärung</a> gelesen und bin damit einverstanden.</span>
    </label>`;
  }

  function anmeldeseite() {
    return {
      titel: 'Anmelden',
      html: h`<div class="anmeldung">
        <div class="anmeldung__kasten">
          <header class="anmeldung__kopf">
            <span class="anmeldung__logo">${ico('dach')}</span>
            <h1>Willkommen bei TrimmoTrade</h1>
            <p>Mietwohnungen, Eigentum, WG-Zimmer und Wohnungstausch – eine Suche, ein Profil,
              eine Bewerbermappe. Zum Start brauchst du eine Anmeldung.</p>
          </header>

          ${meldung ? h`<p class="warn-meldung">${ico('warnung')}${meldung}</p>` : ''}

          ${schritt === 'mail' ? mailSchritt()
        : schritt === 'code' ? codeSchritt()
          : schritt === 'anbieter' ? anbieterSchritt() : wahlSchritt()}

          <div class="anmeldung__ehrlich">
            ${ico('info')}
            <div>
              <b>Eine Anmeldung allein hält keinen Betrüger auf</b>
              <p>Ein Konto ist überall in zwei Minuten angelegt. Was wirklich hilft, ist die Stufe darüber –
                ein an das Gerät gebundener Schlüssel, eine bestätigte Telefonnummer, ein geprüfter Ausweis –
                und dass man <b>sieht</b>, welche Stufe das Gegenüber hat. TrimmoTrade zeigt das an jedem Inserat.</p>
            </div>
          </div>
        </div>

        <footer class="anmeldung__fuss">
          <a href="#/recht/impressum">Impressum</a>
          <a href="#/recht/datenschutz">Datenschutz</a>
          <a href="#/recht/agb">AGB</a>
          <a href="#/recht/widerruf">Widerruf</a>
          <a href="#/hilfe">Hilfe</a>
        </footer>
      </div>`
    };
  }

  /* ================================================================
     Kontoseite
     ================================================================ */

  function stufenLeiter(k) {
    return h`<ol class="stufen">
      ${K.STUFEN.map((s) => h`<li class="${s.n <= k.stufe ? 'is-erreicht' : ''} ${s.n === k.stufe ? 'is-jetzt' : ''}">
        <span class="stufen__n">${s.n}</span>
        <div><b>${s.name}</b><i>${s.text}</i></div>
        ${s.n === k.stufe ? h`<span class="stufen__marke">deine Stufe</span>` : ''}
      </li>`)}
    </ol>`;
  }

  function kontoseite() {
    const k = K.aktuell();
    if (!k) return anmeldeseite();
    const a = K.anbieter(k.anbieter);
    const st = K.stufe(k.stufe);
    return {
      titel: 'Konto',
      html: h`<div class="seite seite--schmal">
        <header class="seite__kopf">
          <h1>${ico('person')}Konto</h1>
          <p class="seite__unter">Wie du angemeldet bist, was davon bestätigt ist und wie du beides änderst.</p>
        </header>

        <section class="block block--betont">
          <div class="block__kopfzeile">
            <h2>${ico('person')}${K.anzeigeName()}</h2>
            ${ui.badge(st.name, st.ton)}
          </div>
          <dl class="rechtsliste">
            <dt>E-Mail</dt><dd>${k.mail || '–'}${k.mailBestaetigt ? ' · bestätigt' : ''}</dd>
            <dt>Angemeldet über</dt><dd>${a ? a.name.replace('Weiter mit ', '') : 'E-Mail'}</dd>
            <dt>Konto seit</dt><dd>${U.dateDE(k.angelegt)}</dd>
            <dt>Zuletzt angemeldet</dt><dd>${k.letzteAnmeldung ? U.since(k.letzteAnmeldung.slice(0, 10)) : '–'}</dd>
            <dt>Passkey</dt><dd>${k.passkey ? 'hinterlegt seit ' + U.dateDE(k.passkey.angelegt.slice(0, 10)) : 'keiner'}</dd>
          </dl>
          <p class="werkzeug__weiter">
            <button type="button" class="knopf knopf--still" data-tu="konto-abmelden">${ico('zurueck')}Abmelden</button>
            <button type="button" class="knopf knopf--still knopf--gefahr" data-tu="konto-loeschen">${ico('muell')}Konto löschen</button>
          </p>
        </section>

        <section class="block">
          <h2>${ico('schloss')}Vertrauensstufe</h2>
          <p class="block__unter">Was über ein Konto bekannt ist, entscheidet, wie viel es darf – und was
            andere über es sehen. Genau hier, nicht bei der Anmeldung selbst, sitzt der Schutz vor Betrug.</p>
          ${stufenLeiter(k)}
          <div class="anmeldung__wege anmeldung__wege--eng">
            ${!k.passkey && K.passkeyMoeglich() ? h`<button type="button" class="anmeldung__weg is-empfohlen"
              data-tu="konto-passkey">
              <span class="anmeldung__zeichen">${ico('schluessel')}</span>
              <span class="anmeldung__wort"><b>Passkey hinterlegen</b>
                <i>Anmelden mit Face ID, Windows Hello oder Fingerabdruck – auf Stufe 2</i></span>
            </button>` : ''}
            ${!k.telefonBestaetigt ? h`<button type="button" class="anmeldung__weg" data-tu="konto-telefon">
              <span class="anmeldung__zeichen">${ico('glocke')}</span>
              <span class="anmeldung__wort"><b>Telefonnummer bestätigen</b>
                <i>Eine Nummer je Konto – auf Stufe 3</i></span>
              <span class="anmeldung__nachbau">nachgebildet</span>
            </button>` : ''}
            ${!k.ausweisGeprueft ? h`<button type="button" class="anmeldung__weg" data-tu="konto-ausweis">
              <span class="anmeldung__zeichen">${ico('blatt')}</span>
              <span class="anmeldung__wort"><b>Ausweis prüfen lassen</b>
                <i>Für Inserierende der Maßstab – auf Stufe 4</i></span>
              <span class="anmeldung__nachbau">nachgebildet</span>
            </button>` : ''}
          </div>
          ${k.stufe >= 4 ? h`<p class="gut-meldung">${ico('pruefen')}Höchste Stufe erreicht.</p>` : ''}
        </section>

        <section class="block">
          <h2>${ico('stift')}Angaben ändern</h2>
          <form class="formraster" data-tu-submit="konto-speichern">
            <label class="feld"><span>Name</span>
              <input type="text" id="konto-name" value="${k.name || ''}" autocomplete="name"></label>
            <label class="feld"><span>E-Mail-Adresse</span>
              <input type="email" id="konto-mail" value="${k.mail || ''}" autocomplete="email"></label>
            <div class="feld feld--knopf">
              <button type="submit" class="knopf">${ico('speichern')}Übernehmen</button>
            </div>
          </form>
          <p class="fein">Wird die Adresse geändert, gilt sie erst nach einer neuen Bestätigung – sonst könnte
            man ein Konto auf eine fremde Adresse umschreiben.</p>
        </section>

        <div class="hinweisbox">${ico('schloss')}
          <div><b>Was von deinem Konto gespeichert wird</b>
          <p>Name, E-Mail-Adresse, das gewählte Verfahren und die Vertrauensstufe – im Speicher dieses
            Browsers, wie alles andere. Beim Passkey liegt nur die Kennung hier; der Schlüssel selbst bleibt
            im Sicherheitschip des Geräts und ist von hier aus nicht lesbar.</p>
          <p>„Konto löschen“ entfernt diese Angaben vollständig. Merkliste, Profil und Notizen bleiben
            erhalten – beides zusammen löschst du über <b>Meine Daten</b> im Fußbereich.</p></div>
        </div>
      </div>`
    };
  }

  /* ================================================================
     Aktionen
     ================================================================ */

  const A_ = ui.aktionRegistrieren;

  const agbGesetzt = () => {
    const el = U.$('#anmelden-agb');
    entwurf.agb = !!(el && el.checked);
    return entwurf.agb;
  };

  function felderLesen() {
    entwurf.mail = ((U.$('#anmelden-mail') || {}).value || '').trim();
    entwurf.name = ((U.$('#anmelden-name') || {}).value || '').trim();
  }

  A_('anmelden-weg', (el) => {
    const id = el.dataset.id;
    meldung = '';
    if (id === 'passkey') { passkeyAnmelden(); return; }
    entwurf.anbieter = id;
    schritt = id === 'mail' ? 'mail' : 'anbieter';
    ui.neuZeichnen();
  });

  A_('anmelden-zurueck', () => {
    schritt = 'wahl';
    meldung = '';
    ui.neuZeichnen();
  });

  A_('anmelden-code-anfordern', () => {
    felderLesen();
    if (!K.mailForm(entwurf.mail)) { meldung = 'Diese Adresse sieht nicht wie eine E-Mail-Adresse aus.'; ui.neuZeichnen(); return; }
    if (!agbGesetzt()) { meldung = 'Ohne Zustimmung zu AGB und Datenschutzerklärung geht es nicht weiter.'; ui.neuZeichnen(); return; }
    K.codeErzeugen(entwurf.mail);
    schritt = 'code';
    meldung = '';
    ui.neuZeichnen();
  });

  A_('anmelden-code-neu', () => {
    K.codeErzeugen(entwurf.mail);
    meldung = '';
    ui.neuZeichnen();
    ui.toast('Neuer Code erzeugt.', 'gut');
  });

  A_('anmelden-code-pruefen', () => {
    const eingabe = ((U.$('#anmelden-code') || {}).value || '');
    const p = K.codePruefen(eingabe);
    if (!p.ok) { meldung = p.grund; ui.neuZeichnen(); return; }
    fertig({
      mail: p.mail, name: entwurf.name, anbieter: 'mail', mailBestaetigt: true
    });
  });

  A_('anmelden-anbieter-fertig', (el) => {
    felderLesen();
    const id = el.dataset.id;
    if (!K.mailForm(entwurf.mail)) { meldung = 'Bitte die Adresse des Kontos angeben.'; ui.neuZeichnen(); return; }
    if (!agbGesetzt()) { meldung = 'Ohne Zustimmung zu AGB und Datenschutzerklärung geht es nicht weiter.'; ui.neuZeichnen(); return; }
    const verbergen = (U.$('#anmelden-verbergen') || {}).checked;
    const mail = (id === 'apple' && verbergen)
      ? entwurf.mail.split('@')[0].slice(0, 8) + '@privaterelay.appleid.com'
      : entwurf.mail;
    fertig({ mail, name: entwurf.name, anbieter: id, mailBestaetigt: true, relay: !!(id === 'apple' && verbergen) });
  });

  function passkeyAnmelden() {
    const vorhanden = K.aktuell() && K.aktuell().passkey;
    const arbeit = vorhanden ? K.passkeyPruefen(vorhanden) : K.passkeyAnlegen('TrimmoTrade');
    arbeit.then((erg) => {
      if (vorhanden) {
        fertig({ anbieter: K.aktuell().anbieter || 'passkey' });
      } else {
        /* Ohne Adresse geht es nicht weiter als Stufe 2 – aber anmelden
           kann man sich damit sofort. Die Adresse holt die Kontoseite. */
        fertig({ anbieter: 'passkey', passkey: erg, name: entwurf.name || '' });
      }
    }, (e) => {
      meldung = e && e.name === 'NotAllowedError'
        ? 'Die Anmeldung wurde abgebrochen oder ist abgelaufen.'
        : (e.message || 'Der Passkey ließ sich nicht anlegen.');
      ui.neuZeichnen();
    });
  }

  function fertig(daten) {
    const k = K.anmelden(Object.assign({ agbStand: R ? R.angaben().stand : '' }, daten));
    schritt = 'wahl';
    meldung = '';
    entwurf = { mail: '', name: '', anbieter: '', agb: false };
    ui.gehe(k.stufe < 2 ? 'konto' : 'start');
    ui.neuZeichnen();
    ui.toast('Angemeldet als ' + K.anzeigeName() + '.', 'gut');
  }

  A_('konto-abmelden', () => {
    if (!confirm('Abmelden? Merkliste, Profil und Notizen bleiben auf diesem Gerät erhalten.')) return;
    K.abmelden();
    ui.gehe('anmelden');
    ui.neuZeichnen();
  });

  A_('konto-loeschen', () => {
    if (!confirm('Das Konto wird vollständig gelöscht. Merkliste, Profil und Notizen bleiben erhalten – '
      + 'die löschst du über „Meine Daten“. Fortfahren?')) return;
    K.loeschen();
    ui.gehe('anmelden');
    ui.neuZeichnen();
    ui.toast('Konto gelöscht.');
  });

  A_('konto-speichern', () => {
    const name = ((U.$('#konto-name') || {}).value || '').trim();
    const mail = ((U.$('#konto-mail') || {}).value || '').trim();
    const k = K.aktuell();
    if (mail && !K.mailForm(mail)) { ui.toast('Diese Adresse sieht nicht wie eine E-Mail-Adresse aus.', 'schlecht'); return; }
    const geaendert = mail !== (k.mail || '');
    K.aendern({ name, mail, mailBestaetigt: geaendert ? false : k.mailBestaetigt });
    ui.neuZeichnen();
    ui.toast(geaendert ? 'Gespeichert. Die neue Adresse ist noch nicht bestätigt.' : 'Gespeichert.', 'gut');
  });

  A_('konto-passkey', () => {
    K.passkeyAnlegen(K.anzeigeName()).then((p) => {
      K.aendern({ passkey: p });
      ui.neuZeichnen();
      ui.toast('Passkey hinterlegt. Nächste Anmeldung ohne Eingabe.', 'gut');
    }, (e) => ui.toast(e && e.name === 'NotAllowedError'
      ? 'Abgebrochen.' : (e.message || 'Hat nicht geklappt.'), 'schlecht'));
  });

  A_('konto-telefon', () => {
    ui.dialog({
      titel: 'Telefonnummer bestätigen',
      inhalt: h`<p>Eine bestätigte Nummer ist der Punkt, an dem Betrug im großen Stil unwirtschaftlich wird:
          Nummern kosten Geld und lassen sich nicht beliebig oft neu beschaffen.</p>
        <label class="feld"><span>Mobilnummer</span>
          <input type="tel" id="konto-nummer" autocomplete="tel" placeholder="+49 …"></label>
        <div class="anmeldung__demo">${ico('warnung')}
          <div><b>Nachgebildet</b>
          <p>Es gibt keinen Server, der eine SMS verschicken könnte. Im Betrieb käme jetzt ein Code auf das
            Telefon – über einen Versanddienst, der pro Nachricht abrechnet.</p></div>
        </div>`,
      fuss: h`<button type="button" class="knopf knopf--still" data-tu="dialog-zu">Abbrechen</button>
        <button type="button" class="knopf" data-tu="konto-telefon-fertig">${ico('pruefen')}Als bestätigt eintragen</button>`
    });
  });

  A_('konto-telefon-fertig', () => {
    const nr = ((U.$('#konto-nummer') || {}).value || '').trim();
    if (nr.replace(/\D/g, '').length < 7) { ui.toast('Diese Nummer ist zu kurz.', 'schlecht'); return; }
    K.aendern({ telefon: nr, telefonBestaetigt: true });
    ui.dialogZu();
    ui.neuZeichnen();
    ui.toast('Stufe 3 erreicht.', 'gut');
  });

  A_('konto-ausweis', () => {
    ui.dialog({
      titel: 'Ausweis prüfen lassen',
      breit: true,
      inhalt: h`<p>Für Inserierende ist das der Maßstab. Geprüft wird über einen Dienst – POSTIDENT in der
          Filiale oder per Video, oder die eID-Funktion des Personalausweises.</p>
        <ul class="pruef">
          <li>${ico('pruefen')}<span><b>Der Ausweis selbst wird nicht gespeichert.</b> Zurück kommt nur die
            Bestätigung, dass die Person geprüft wurde, mit Name und Geburtsdatum.</span></li>
          <li>${ico('pruefen')}<span>Ein Ausweis je Konto. Wer aussortiert wird, kann nicht in fünf Minuten
            wiederkommen.</span></li>
          <li>${ico('warnung')}<span>Kostet Geld – je nach Verfahren wenige Euro je Prüfung. Deshalb sinnvoll
            für Inserierende, nicht für alle.</span></li>
        </ul>
        <div class="anmeldung__demo">${ico('warnung')}
          <div><b>Nachgebildet</b>
          <p>Hier gibt es keinen Prüfdienst. Der Knopf setzt die Stufe, damit du siehst, was sie bewirkt.</p></div>
        </div>`,
      fuss: h`<button type="button" class="knopf knopf--still" data-tu="dialog-zu">Abbrechen</button>
        <button type="button" class="knopf" data-tu="konto-ausweis-fertig">Als geprüft eintragen</button>`
    });
  });

  A_('konto-ausweis-fertig', () => {
    K.aendern({ ausweisGeprueft: true });
    ui.dialogZu();
    ui.neuZeichnen();
    ui.toast('Stufe 4 erreicht.', 'gut');
  });

  ui.ansichten.anmelden = anmeldeseite;
  ui.ansichten.konto = kontoseite;
  TT.viewAnmeldung = { anmeldeseite, kontoseite };
})(window.TT = window.TT || {});
