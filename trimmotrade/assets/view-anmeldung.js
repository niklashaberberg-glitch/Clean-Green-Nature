/* =====================================================================
   TrimmoTrade – Anmeldung und Konto: Oberfläche

   Drei Dinge, die diese Seite anders macht als die meisten Anmeldungen:

   1. Impressum, Datenschutzerklärung und AGB sind auch ohne Anmeldung
      erreichbar. § 5 DDG verlangt, dass sie „leicht erkennbar, unmittelbar
      erreichbar und ständig verfügbar“ sind – hinter einer Anmeldung sind
      sie das nicht. Dasselbe gilt für die Hilfe: Wer nicht hereinkommt,
      braucht sie am dringendsten.

   2. Die Reihenfolge der Verfahren folgt der Sicherheit, nicht der
      Bekanntheit. Der Passkey steht oben, weil er als Einziges gegen
      nachgebaute Anmeldeseiten schützt.

   3. Angezeigt wird nur, was tatsächlich geht. Läuft die Anwendung auf
      dem eigenen Server, sagt der, welche Verfahren eingerichtet sind –
      ein Knopf, der nur in eine Fehlermeldung führt, erscheint nicht.
      Läuft sie ohne Server, steht an jedem nachgebildeten Schritt, dass
      er nachgebildet ist.
   ===================================================================== */
(function (TT) {
  'use strict';

  const U = TT.util, ui = TT.ui, K = TT.konto, R = TT.recht;
  const h = U.html, raw = U.raw, ico = U.svg;

  /* Schritt: 'wahl' | 'mail' | 'code' | 'anbieter' */
  let schritt = 'wahl';
  let entwurf = { mail: '', name: '', anbieter: '', agb: false };
  let meldung = '';
  let hinweis = '';
  let passkeyDa = false;
  let laeuft = '';           // Welcher Knopf gerade arbeitet
  let neuAnbieten = false;   // Nach vergeblicher Passkey-Anmeldung
  let demoCode = '';

  K.passkeyPlattform().then((ja) => {
    passkeyDa = ja;
    if (ui.aktuell === 'anmelden') ui.neuZeichnen();
  });

  /* Die Rückkehr von Google oder Microsoft kann eine Nachricht tragen.
     Sie steht im Adressteil hinter dem Rautezeichen, damit sie den
     Server nie erreicht. */
  const RUECKMELDUNG = {
    'abgebrochen': 'Die Anmeldung wurde abgebrochen. Es ist nichts passiert.',
    'anbieter-fehler': 'Der Anbieter hat die Anmeldung nicht abgeschlossen. Versuch es noch einmal '
      + 'oder nimm ein anderes Verfahren.',
    'nicht-eingerichtet': 'Dieses Verfahren ist auf diesem Server nicht eingerichtet.'
  };

  /* ================================================================
     Anmeldeseite
     ================================================================ */

  function anbieterKnopf(a) {
    const gesperrt = a.id === 'passkey' && !K.passkeyMoeglich();
    const arbeitet = laeuft === a.id;
    return h`<button type="button" class="anmeldung__weg ${a.empfohlen ? 'is-empfohlen' : ''}"
      data-tu="anmelden-weg" data-id="${a.id}" ${gesperrt || laeuft ? 'disabled' : ''}>
      <span class="anmeldung__zeichen" style="color:${a.farbe || 'currentColor'}">${ico(a.icon)}</span>
      <span class="anmeldung__wort">
        <b>${a.name}</b>
        <i>${gesperrt ? K.passkeyGrund()
        : arbeitet ? 'einen Moment …' : a.unter}</i>
      </span>
      ${a.empfohlen && !gesperrt ? h`<span class="anmeldung__marke">${passkeyDa ? 'am sichersten' : 'empfohlen'}</span>` : ''}
      ${!K.echt() && !a.echt ? h`<span class="anmeldung__nachbau"
        title="In dieser Vorführung nachgebildet">nachgebildet</span>` : ''}
    </button>`;
  }

  function wahlSchritt() {
    const wege = K.verfuegbar();
    return h`<div class="anmeldung__wege">
        ${wege.map(anbieterKnopf)}
      </div>
      ${neuAnbieten ? h`<div class="info-meldung">${ico('info')}Noch kein Passkey auf diesem Gerät?
        <button type="button" class="link" data-tu="anmelden-passkey-neu">Jetzt einen anlegen und
        damit ein Konto eröffnen</button></div>` : ''}
      <p class="anmeldung__stoebern">
        <a href="#/suche">${ico('suche')}Erst einmal umsehen – Angebote ohne Anmeldung ansehen</a>
      </p>
      <details class="anmeldung__warum">
        <summary>${ico('schloss')}Warum steht der Passkey oben?</summary>
        <p>Weil er als Einziges gegen die häufigste Masche schützt: eine nachgebaute Anmeldeseite. Ein Passkey
          ist an die Adresse gebunden, unter der er angelegt wurde. Wer auf eine gefälschte Seite hereinfällt,
          gibt dort nichts preis – es gibt nichts einzugeben. Der Schlüssel entsteht im Sicherheitschip deines
          Geräts und verlässt ihn nie.</p>
        <p>Bei Google und Microsoft bekommt TrimmoTrade Name und E-Mail-Adresse, dein Passwort dort aber
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
      <button type="submit" class="knopf knopf--voll" ${laeuft ? 'disabled' : ''}>${ico('nachricht')}${laeuft === 'code' ? 'Code wird verschickt …' : 'Code anfordern'}</button>
      <button type="button" class="link" data-tu="anmelden-zurueck">anderes Verfahren wählen</button>
    </form>`;
  }

  function codeSchritt() {
    return h`<form class="anmeldung__form" data-tu-submit="anmelden-code-pruefen" novalidate>
      <p>Wir haben einen sechsstelligen Code an <b>${entwurf.mail}</b> geschickt. Er gilt
        ${K.CODE_GUELTIG_MIN} Minuten.</p>
      ${demoCode ? h`<div class="anmeldung__demo">
        ${ico('warnung')}
        <div><b>Vorführung: Der Code steht hier</b>
        <p>Diese Kopie läuft ohne Server, also gibt es niemanden, der eine Mail verschicken könnte. Auf
          <b>trimmotrade.de</b> steht hier nichts – der Code kommt dann in dein Postfach.</p>
        <span class="anmeldung__code">${demoCode}</span></div>
      </div>` : h`<p class="fein">Nichts angekommen? Schau in den Spam-Ordner. Die Mail kommt von
        <b>anmeldung@trimmotrade.de</b>.</p>`}
      <label class="feld"><span>Code</span>
        <input type="text" id="anmelden-code" inputmode="numeric" autocomplete="one-time-code"
          pattern="[0-9 ]{6,8}" maxlength="8" required placeholder="000000"></label>
      <button type="submit" class="knopf knopf--voll" ${laeuft ? 'disabled' : ''}>${ico('pruefen')}${laeuft === 'pruefen' ? 'wird geprüft …' : 'Anmelden'}</button>
      <p class="werkzeug__weiter">
        <button type="button" class="link" data-tu="anmelden-code-neu">neuen Code anfordern</button>
        <button type="button" class="link" data-tu="anmelden-zurueck">Adresse ändern</button>
      </p>
    </form>`;
  }

  /* Der nachgebildete Zustimmungsdialog. Er erscheint nur ohne Server –
     mit Server verlässt der Browser die Seite und kommt vom Anbieter
     zurück, so wie es sich gehört. */
  function anbieterSchritt() {
    const a = K.anbieter(entwurf.anbieter);
    if (!a) { schritt = 'wahl'; return wahlSchritt(); }
    return h`<div class="anmeldung__form">
      <div class="anmeldung__demo">
        ${ico('warnung')}
        <div><b>Nachgebildeter Ablauf</b>
        <p>Diese Kopie läuft ohne Server. Das echte Verfahren braucht zwingend eine Serverseite, die das
          Geheimnis hält und das zurückgegebene Token prüft; ein reiner Browser kann das nicht. Was du gleich
          siehst, entspricht dem Ablauf – die Bestätigung kommt aber nicht von
          ${a.name.replace('Weiter mit ', '')}.</p></div>
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
    /* Eine Rückmeldung vom Anbieter wird beim Zeichnen übernommen und
       gleich aus der Adresse entfernt – sonst stünde sie beim nächsten
       Neuladen wieder da. */
    const code = (ui.params && ui.params.params && ui.params.params.fehler) || '';
    if (code && RUECKMELDUNG[code]) {
      meldung = RUECKMELDUNG[code];
      setTimeout(() => { if (location.hash.indexOf('fehler=') >= 0) location.replace('#/anmelden'); }, 0);
    }

    return {
      titel: 'Anmelden',
      html: h`<div class="anmeldung">
        <div class="anmeldung__kasten">
          <header class="anmeldung__kopf">
            <span class="anmeldung__logo" aria-hidden="true"></span>
            <h1>Willkommen bei TrimmoTrade</h1>
              <p>Mietwohnungen, Eigentum, WG-Zimmer und Wohnungstausch – eine Suche, ein Profil,
              eine Bewerbermappe.</p>
          </header>

          ${meldung ? h`<p class="warn-meldung">${ico('warnung')}${meldung}</p>` : ''}
          ${hinweis ? h`<p class="gut-meldung">${ico('pruefen')}${hinweis}</p>` : ''}

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

  function passkeyListe(k) {
    const liste = k.passkeys || [];
    if (!liste.length) return '';
    return h`<h3 class="passkeyliste__kopf">${liste.length === 1 ? 'Dein Passkey' : 'Deine Passkeys'}</h3>
    <ul class="passkeyliste">
      ${liste.map((p) => h`<li>
        <span class="passkeyliste__zeichen">${ico('schluessel')}</span>
        <span class="passkeyliste__wort"><b>${p.geraet || 'Gerät'}</b>
          <i>hinterlegt am <span>${U.dateDE(String(p.angelegt).slice(0, 10))}</span></i></span>
        <button type="button" class="link" data-tu="konto-passkey-weg"
          data-id="${p.id}">entfernen</button>
      </li>`)}
    </ul>`;
  }

  function kontoseite() {
    const k = K.aktuell();
    if (!k) return anmeldeseite();
    const a = K.anbieter(k.anbieter);
    const st = K.stufe(k.stufe);
    const liste = k.passkeys || [];
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
            <dt>E-Mail</dt><dd>${k.mail || '–'}${k.mail && k.mailBestaetigt ? ' · bestätigt'
        : k.mail ? ' · noch nicht bestätigt' : ''}</dd>
            <dt>Angemeldet über</dt><dd>${a ? a.name.replace('Weiter mit ', '') : 'E-Mail'}</dd>
            <dt>Konto seit</dt><dd>${U.dateDE(k.angelegt)}</dd>
            <dt>Zuletzt angemeldet</dt><dd>${k.letzteAnmeldung ? U.since(k.letzteAnmeldung.slice(0, 10)) : '–'}</dd>
            <dt>Passkeys</dt><dd>${liste.length
        ? h`${liste.length} ${U.plural(liste.length, 'Gerät', 'Geräte')}` : 'keine'}</dd>
          </dl>
          <p class="werkzeug__weiter">
            <button type="button" class="knopf knopf--still" data-tu="konto-abmelden">${ico('zurueck')}Abmelden</button>
            ${K.echt() ? h`<button type="button" class="knopf knopf--still"
              data-tu="konto-abmelden-alle">${ico('schloss')}Auf allen Geräten abmelden</button>` : ''}
            <button type="button" class="knopf knopf--still knopf--gefahr" data-tu="konto-loeschen">${ico('muell')}Konto löschen</button>
          </p>
        </section>

        <section class="block">
          <h2>${ico('schloss')}Vertrauensstufe</h2>
          <p class="block__unter">Was über ein Konto bekannt ist, entscheidet, wie viel es darf – und was
            andere über es sehen. Genau hier, nicht bei der Anmeldung selbst, sitzt der Schutz vor Betrug.</p>
          ${stufenLeiter(k)}
          ${passkeyListe(k)}
          <div class="anmeldung__wege anmeldung__wege--eng">
            ${K.passkeyMoeglich() ? h`<button type="button" class="anmeldung__weg ${liste.length ? '' : 'is-empfohlen'}"
              data-tu="konto-passkey">
              <span class="anmeldung__zeichen">${ico('schluessel')}</span>
              <span class="anmeldung__wort"><b>${liste.length ? 'Weiteres Gerät hinterlegen' : 'Passkey hinterlegen'}</b>
                <i>${liste.length ? 'Damit du dich auch von deinem anderen Gerät anmelden kannst'
        : 'Anmelden mit Face ID, Windows Hello oder Fingerabdruck – auf Stufe 2'}</i></span>
            </button>` : ''}
            ${!K.echt() && !k.telefonBestaetigt ? h`<button type="button" class="anmeldung__weg" data-tu="konto-telefon">
              <span class="anmeldung__zeichen">${ico('glocke')}</span>
              <span class="anmeldung__wort"><b>Telefonnummer bestätigen</b>
                <i>Eine Nummer je Konto – auf Stufe 3</i></span>
              <span class="anmeldung__nachbau">nachgebildet</span>
            </button>` : ''}
            ${!K.echt() && !k.ausweisGeprueft ? h`<button type="button" class="anmeldung__weg" data-tu="konto-ausweis">
              <span class="anmeldung__zeichen">${ico('blatt')}</span>
              <span class="anmeldung__wort"><b>Ausweis prüfen lassen</b>
                <i>Für Inserierende der Maßstab – auf Stufe 4</i></span>
              <span class="anmeldung__nachbau">nachgebildet</span>
            </button>` : ''}
          </div>
          ${K.echt() && k.stufe < 3 ? h`<p class="fein">Die Stufen 3 und 4 brauchen einen Prüfdienst –
            einen SMS-Versender für die Nummer, POSTIDENT oder eID für den Ausweis. Beides ist auf diesem
            Server noch nicht eingerichtet, deshalb steht hier kein Knopf, der nichts täte.</p>` : ''}
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
          ${K.echt() ? h`<p>Auf dem Server: E-Mail-Adresse, Name, das gewählte Verfahren, die Vertrauensstufe
            und der öffentliche Teil deiner Passkeys. Sonst nichts – keine Inserate, keine Merkliste, keine
            Nachrichten, kein Profil. Das alles bleibt im Speicher dieses Browsers.</p>
          <p>Der private Teil des Passkeys bleibt im Sicherheitschip deines Geräts und ist weder von hier
            noch vom Server aus lesbar.</p>`
        : h`<p>Name, E-Mail-Adresse, das gewählte Verfahren und die Vertrauensstufe – im Speicher dieses
            Browsers, wie alles andere. Beim Passkey liegt nur die Kennung hier; der Schlüssel selbst bleibt
            im Sicherheitschip des Geräts und ist von hier aus nicht lesbar.</p>`}
          <p>„Konto löschen“ entfernt diese Angaben vollständig${K.echt() ? ' – auch auf dem Server' : ''}.
            Merkliste, Profil und Notizen bleiben erhalten; beides zusammen löschst du über
            <b>Meine Daten</b> im Fußbereich.</p></div>
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

  /* Ein Knopf, der arbeitet, wird gesperrt und sagt es. Ohne das drückt
     man zweimal, und die zweite Anfrage läuft in die Sperre der ersten.

     Nach dem Ende wird in beiden Fällen noch einmal gezeichnet – auch
     dann, wenn der Aufrufer das schon getan hat. Sonst bliebe der Knopf
     gesperrt: Der Aufrufer zeichnet, während `laeuft` noch gesetzt ist,
     und danach käme kein Anlass mehr. */
  function arbeiten(marke, arbeit) {
    if (laeuft) return Promise.resolve(null);
    laeuft = marke;
    meldung = '';
    ui.neuZeichnen();
    const loesen = () => { laeuft = ''; };
    return arbeit().then((w) => {
      loesen();
      ui.neuZeichnen();
      return w;
    }, (e) => {
      loesen();
      meldung = (e && (e.text || e.message)) || 'Hat nicht geklappt.';
      ui.neuZeichnen();
      throw e;
    });
  }

  A_('anmelden-weg', (el) => {
    const id = el.dataset.id;
    meldung = '';
    hinweis = '';
    neuAnbieten = false;
    if (id === 'passkey') { passkeyAnmelden(); return; }
    if (id !== 'mail' && K.echt()) {
      /* Vor dem Verlassen der Seite festhalten, wohin es zurückgehen
         soll – nach der Rückkehr ist der alte Stand weg. */
      const weiter = ui.zielHolen();
      /* Mit Server: erst zustimmen, dann zum Anbieter. Die Zustimmung
         muss vor dem Vertragsschluss vorliegen, und der beginnt mit dem
         Anlegen des Kontos beim Rückweg. */
      if (!entwurf.agb) { ui.zielMerken('#/' + weiter); anbieterZustimmung(id); return; }
      K.anbieterStarten(id, weiter);
      return;
    }
    entwurf.anbieter = id;
    schritt = id === 'mail' ? 'mail' : 'anbieter';
    ui.neuZeichnen();
  });

  /* Vor der Weiterreise zu Google oder Microsoft: die Zustimmung
     einholen, ohne die kein Konto entstehen darf. */
  function anbieterZustimmung(id) {
    const a = K.anbieter(id);
    ui.dialog({
      titel: a ? a.name : 'Weiter',
      inhalt: h`<p>${a ? a.erklaerung : ''}</p>
        <label class="schalter">
          <input type="checkbox" id="anmelden-agb-dialog">
          <span>Ich habe die <a href="#/recht/agb">Allgemeinen Geschäftsbedingungen</a> und die
            <a href="#/recht/datenschutz">Datenschutzerklärung</a> gelesen und bin damit
            einverstanden.</span>
        </label>
        <p class="fein">Du wirst gleich zu ${a ? a.name.replace('Weiter mit ', '') : 'dem Anbieter'}
          weitergeleitet und kommst danach hierher zurück.</p>`,
      fuss: h`<button type="button" class="knopf knopf--still" data-tu="dialog-zu">Abbrechen</button>
        <button type="button" class="knopf" data-tu="anmelden-anbieter-los"
          data-id="${id}">${ico('pruefen')}Weiter</button>`
    });
  }

  A_('anmelden-anbieter-los', (el) => {
    const el2 = U.$('#anmelden-agb-dialog');
    if (!el2 || !el2.checked) {
      ui.toast('Ohne Zustimmung zu AGB und Datenschutzerklärung geht es nicht weiter.', 'schlecht');
      return;
    }
    entwurf.agb = true;
    ui.dialogZu();
    /* Der Server gibt `weiter` nach der Rückkehr wieder heraus – so
       überlebt das Ziel auch den Ausflug zum Anbieter. */
    K.anbieterStarten(el.dataset.id, ui.zielHolen());
  });

  A_('anmelden-zurueck', () => {
    schritt = 'wahl';
    meldung = '';
    hinweis = '';
    demoCode = '';
    ui.neuZeichnen();
  });

  A_('anmelden-code-anfordern', () => {
    felderLesen();
    if (!K.mailForm(entwurf.mail)) { meldung = 'Diese Adresse sieht nicht wie eine E-Mail-Adresse aus.'; ui.neuZeichnen(); return; }
    if (!agbGesetzt()) { meldung = 'Ohne Zustimmung zu AGB und Datenschutzerklärung geht es nicht weiter.'; ui.neuZeichnen(); return; }
    arbeiten('code', () => K.codeAnfordern(entwurf.mail, entwurf.name).then((d) => {
      demoCode = d.code || '';
      schritt = 'code';
      ui.neuZeichnen();
      /* Die Aufmerksamkeit gehört jetzt in das Codefeld – wer hier
         suchen muss, hat den Faden verloren. */
      setTimeout(() => { const f = U.$('#anmelden-code'); if (f) f.focus(); }, 30);
    })).catch(() => {});
  });

  A_('anmelden-code-neu', () => {
    arbeiten('code', () => K.codeAnfordern(entwurf.mail, entwurf.name).then((d) => {
      demoCode = d.code || '';
      ui.neuZeichnen();
      ui.toast(K.echt() ? 'Neuer Code verschickt.' : 'Neuer Code erzeugt.', 'gut');
    })).catch(() => {});
  });

  A_('anmelden-code-pruefen', () => {
    const eingabe = ((U.$('#anmelden-code') || {}).value || '');
    arbeiten('pruefen', () => K.codeEinloesen(eingabe).then((k) => {
      if (K.echt()) merken();
      fertig(k);
    })).catch((e) => {
      if (e && e.neu) { schritt = 'mail'; demoCode = ''; ui.neuZeichnen(); }
    });
  });

  A_('anmelden-anbieter-fertig', (el) => {
    felderLesen();
    const id = el.dataset.id;
    if (!K.mailForm(entwurf.mail)) { meldung = 'Bitte die Adresse des Kontos angeben.'; ui.neuZeichnen(); return; }
    if (!agbGesetzt()) { meldung = 'Ohne Zustimmung zu AGB und Datenschutzerklärung geht es nicht weiter.'; ui.neuZeichnen(); return; }
    fertig(K.anmelden({
      mail: entwurf.mail, name: entwurf.name, anbieter: id, mailBestaetigt: true,
      agbStand: R ? R.angaben().stand : ''
    }));
  });

  function passkeyAnmelden() {
    arbeiten('passkey', () => K.passkeyAnmelden().then((k) => {
      if (K.echt()) merken();
      fertig(k);
    })).catch(() => {
      /* Wer keinen Passkey hat, bekommt jetzt den Weg dorthin angeboten
         statt nur eine Fehlermeldung. */
      neuAnbieten = true;
      ui.neuZeichnen();
    });
  }

  A_('anmelden-passkey-neu', () => {
    if (K.echt() && !entwurf.agb) {
      ui.dialog({
        titel: 'Konto mit Passkey anlegen',
        inhalt: h`<p>Dein Gerät erzeugt gleich einen Schlüssel, der nur für trimmotrade.de gilt und den
            Sicherheitschip nie verlässt. Eine E-Mail-Adresse brauchst du dafür nicht – die kannst du später
            auf der Kontoseite nachtragen.</p>
          <label class="feld"><span>Name (freiwillig)</span>
            <input type="text" id="anmelden-pk-name" autocomplete="name" placeholder="wie du in Anfragen erscheinst"></label>
          <label class="schalter">
            <input type="checkbox" id="anmelden-agb-dialog">
            <span>Ich habe die <a href="#/recht/agb">Allgemeinen Geschäftsbedingungen</a> und die
              <a href="#/recht/datenschutz">Datenschutzerklärung</a> gelesen und bin damit
              einverstanden.</span>
          </label>`,
        fuss: h`<button type="button" class="knopf knopf--still" data-tu="dialog-zu">Abbrechen</button>
          <button type="button" class="knopf" data-tu="anmelden-passkey-neu-los">${ico('schluessel')}Passkey anlegen</button>`
      });
      return;
    }
    passkeyNeuLos(entwurf.name);
  });

  A_('anmelden-passkey-neu-los', () => {
    const zu = U.$('#anmelden-agb-dialog');
    if (!zu || !zu.checked) {
      ui.toast('Ohne Zustimmung zu AGB und Datenschutzerklärung geht es nicht weiter.', 'schlecht');
      return;
    }
    const name = ((U.$('#anmelden-pk-name') || {}).value || '').trim();
    entwurf.agb = true;
    ui.dialogZu();
    passkeyNeuLos(name);
  });

  function passkeyNeuLos(name) {
    neuAnbieten = false;
    arbeiten('passkey', () => K.passkeyAnlegen(name || '', entwurf.mail || '').then((k) => {
      if (K.echt()) merken();
      fertig(k);
    })).catch(() => {});
  }

  /* Ohne Server steht der Stand der AGB im Konto; mit Server steht er im
     Browser, weil der Server ihn nicht braucht – zugestimmt hat man vor
     dem Anlegen, und das Konto entsteht erst danach. */
  function merken() {
    try {
      localStorage.setItem('trimmotrade.agb.v1', JSON.stringify({
        stand: R ? R.angaben().stand : '', wann: new Date().toISOString()
      }));
    } catch (e) { /* Speicher voll oder gesperrt – kein Grund abzubrechen */ }
  }

  function fertig(k) {
    schritt = 'wahl';
    meldung = '';
    hinweis = '';
    demoCode = '';
    neuAnbieten = false;
    entwurf = { mail: '', name: '', anbieter: '', agb: false };
    /* Zurück dorthin, wo jemand hinwollte, als die Anmeldung dazwischen
       kam. Nur wer von sich aus zur Anmeldung ging, landet auf der
       Startseite – oder auf der Kontoseite, solange die Stufe niedrig
       ist und dort noch etwas zu tun wäre. */
    const ziel = ui.zielHolen();
    ui.gehe(ziel || (k && k.stufe < 2 ? 'konto' : 'start'));
    ui.neuZeichnen();
    ui.toast('Angemeldet als ' + K.anzeigeName() + '.', 'gut');
  }

  A_('konto-abmelden', () => {
    if (!confirm('Abmelden? Merkliste, Profil und Notizen bleiben auf diesem Gerät erhalten.')) return;
    K.abmelden().then(() => { ui.gehe('anmelden'); ui.neuZeichnen(); });
  });

  A_('konto-abmelden-alle', () => {
    if (!confirm('Auf allen Geräten abmelden? Du musst dich danach überall neu anmelden.')) return;
    K.abmelden(true).then(() => {
      ui.gehe('anmelden');
      ui.neuZeichnen();
      ui.toast('Überall abgemeldet.', 'gut');
    });
  });

  A_('konto-loeschen', () => {
    if (!confirm('Das Konto wird vollständig gelöscht. Merkliste, Profil und Notizen bleiben erhalten – '
      + 'die löschst du über „Meine Daten“. Fortfahren?')) return;
    K.loeschen().then(() => {
      ui.gehe('anmelden');
      ui.neuZeichnen();
      ui.toast('Konto gelöscht.');
    }, (e) => ui.toast((e && e.text) || 'Hat nicht geklappt.', 'schlecht'));
  });

  A_('konto-speichern', () => {
    const name = ((U.$('#konto-name') || {}).value || '').trim();
    const mail = ((U.$('#konto-mail') || {}).value || '').trim();
    K.angabenSpeichern({ name, mail }).then((d) => {
      ui.neuZeichnen();
      ui.toast(d.bestaetigen ? 'Gespeichert. Die neue Adresse ist noch nicht bestätigt.' : 'Gespeichert.', 'gut');
    }, (e) => ui.toast((e && e.text) || 'Hat nicht geklappt.', 'schlecht'));
  });

  A_('konto-passkey', () => {
    K.passkeyAnlegen(K.anzeigeName(), (K.aktuell() || {}).mail || '').then(() => {
      ui.neuZeichnen();
      ui.toast('Passkey hinterlegt. Nächste Anmeldung ohne Eingabe.', 'gut');
    }, (e) => ui.toast((e && e.text) || 'Hat nicht geklappt.', 'schlecht'));
  });

  A_('konto-passkey-weg', (el) => {
    if (!confirm('Diesen Passkey entfernen? Von diesem Gerät kannst du dich danach nicht mehr damit anmelden.')) return;
    K.passkeyLoeschen(el.dataset.id).then(() => {
      ui.neuZeichnen();
      ui.toast('Passkey entfernt.');
    }, (e) => ui.toast((e && e.text) || 'Hat nicht geklappt.', 'schlecht'));
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
          <p>Diese Kopie läuft ohne Server, also kann niemand eine SMS verschicken. Im Betrieb käme jetzt ein
            Code auf das Telefon – über einen Versanddienst, der pro Nachricht abrechnet.</p></div>
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
