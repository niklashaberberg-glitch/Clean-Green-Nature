/* =====================================================================
   Nestwerk – Ansicht: Dokumententresor und Freigaben
   ===================================================================== */
(function (NW) {
  'use strict';

  const U = NW.util, ui = NW.ui, S = NW.store, T = NW.tresor;
  const h = U.html, raw = U.raw, ico = U.svg;

  let dokumente = [];
  let ladefehler = '';

  const artName = (id) => (T.ARTEN.find((a) => a.id === id) || { name: 'Sonstiges' }).name;
  /* „0 kB“ hat schon manchen glauben lassen, die Datei sei leer. */
  const kb = (n) => n < 1024 ? 'unter 1 kB'
    : n < 1024 * 1024 ? Math.round(n / 1024) + ' kB'
      : (Math.round(n / 1024 / 102.4) / 10) + ' MB';

  /* ================================================================
     Erklärkasten – was hier echt ist und was nicht
     ================================================================ */

  function erklaerung() {
    return h`<details class="tresor__erklaerung">
      <summary>${ico('info')}Was hier tatsächlich passiert</summary>
      <p>Deine Dateien werden im Browser mit <b>AES-GCM und 256 Bit</b> verschlüsselt, bevor sie gespeichert
        werden. Der Schlüssel entsteht aus deinem Kennwort über <b>PBKDF2 mit ${U.num(T.RUNDEN)} Runden</b> und
        wird nirgends abgelegt – er lebt nur im Arbeitsspeicher, solange der Tresor offen ist. Nach dem Neuladen
        der Seite ist er weg.</p>
      <p>Jedes Dokument bekommt einen <b>eigenen Schlüssel</b>, der mit dem Tresorschlüssel umschlossen wird.
        Nur deshalb lässt sich eine einzelne Gehaltsabrechnung freigeben, ohne den ganzen Tresor zu öffnen.
        Auch der Dateiname wird verschlüsselt – er verrät sonst mehr, als vielen bewusst ist.</p>
      <p>Beim Freigeben wandern die Dokumentschlüssel in den <b>Fragmentteil</b> des Verweises, also hinter das
        Rautezeichen. Browser senden diesen Teil nie an einen Server. Ein Betreiber sähe also die Anfrage,
        aber nie den Schlüssel.</p>
      <p><b>Was hier fehlt, ist der Server.</b> In dieser Vorführung liegt das Chiffrat in diesem Browser, der
        Verweis funktioniert deshalb nur auf diesem Gerät. Im Betrieb läge dort das Chiffrat und sonst nichts:
        kein Schlüssel, keine Datei im Klartext, nichts, was ein Einbruch verwertbar machen würde. Ablauf und
        Abrufzähler würde der Server durchsetzen – hier tut es die Anwendung selbst.</p>
    </details>`;
  }

  /* ================================================================
     Zustände: nicht möglich, nicht eingerichtet, gesperrt, offen
     ================================================================ */

  function nichtMoeglich() {
    return h`<div class="block block--warn">
      <h2>${ico('warnung')}Dieser Browser kann das nicht</h2>
      <p>Für den Tresor braucht es die Verschlüsselungsfunktionen des Browsers und einen lokalen Datenspeicher.
        Beides fehlt hier – meist, weil die Seite ohne gesicherte Verbindung geöffnet wurde oder der private
        Modus den Speicher sperrt.</p>
      <p>Die Bewerbermappe im <a href="#/profil">Profil</a> funktioniert weiterhin; du verschickst deine
        Unterlagen dann wie gewohnt selbst.</p>
    </div>`;
  }

  function einrichtenBlock() {
    return h`<div class="block block--betont">
      <h2>${ico('schloss')}Tresor einrichten</h2>
      <p class="block__unter">Ein Kennwort, das nur du kennst. Daraus entsteht der Schlüssel – gespeichert wird
        er nirgends.</p>
      <form data-tu-submit="tresor-einrichten">
        <div class="formraster">
          <label class="feld"><span>Kennwort</span>
            <input type="password" id="tresor-kw1" autocomplete="new-password" minlength="8" required
              placeholder="mindestens acht Zeichen"></label>
          <label class="feld"><span>Kennwort wiederholen</span>
            <input type="password" id="tresor-kw2" autocomplete="new-password" minlength="8" required></label>
        </div>
        <div class="hinweisbox">${ico('warnung')}
          <div><b>Dieses Kennwort lässt sich nicht zurücksetzen</b>
          <p>Es gibt keinen Server, der es kennt, und keine Wiederherstellung per E-Mail. Genau das ist der
            Punkt: Wer den Speicher dieses Geräts in die Hände bekommt, kommt ohne das Kennwort nicht an deine
            Unterlagen. Vergisst du es, sind sie auch für dich verloren – dann bleibt nur, den Tresor zu leeren
            und neu zu füllen.</p></div>
        </div>
        <button type="submit" class="knopf">${ico('schloss')}Tresor anlegen</button>
      </form>
      ${erklaerung()}
    </div>`;
  }

  function gesperrtBlock() {
    const anzahl = dokumente.length;
    return h`<div class="block block--betont">
      <h2>${ico('schloss')}Tresor gesperrt</h2>
      <p class="block__unter">${anzahl
      ? anzahl + ' ' + U.plural(anzahl, 'Dokument liegt', 'Dokumente liegen') + ' verschlüsselt bereit. '
        + 'Ohne Kennwort sind nicht einmal die Dateinamen lesbar.'
      : 'Der Tresor ist noch leer.'}</p>
      <form data-tu-submit="tresor-oeffnen">
        <label class="feld"><span>Kennwort</span>
          <input type="password" id="tresor-kw" autocomplete="current-password" required></label>
        <p class="werkzeug__weiter">
          <button type="submit" class="knopf">${ico('schluessel')}Öffnen</button>
          <button type="button" class="knopf knopf--gefahr" data-tu="tresor-verwerfen">Kennwort vergessen – Tresor leeren</button>
        </p>
      </form>
      ${anzahl ? h`<ul class="tresorliste tresorliste--gesperrt">
        ${dokumente.map((d) => h`<li>
          ${ico('schloss')}
          <div><b>${artName(d.art)}</b><span>${kb(d.groesse)} · abgelegt ${U.since(d.hinzu)}</span></div>
        </li>`)}
      </ul>
      <p class="fein">Art, Größe und Datum liegen unverschlüsselt – sie werden gebraucht, um dir diese Liste zu
        zeigen, solange der Tresor zu ist. Alles andere, auch der Dateiname, ist nur mit Kennwort lesbar.</p>` : ''}
      ${erklaerung()}
    </div>`;
  }

  function offenBlock() {
    const nachArt = {};
    dokumente.forEach((d) => { (nachArt[d.art] = nachArt[d.art] || []).push(d); });
    const fg = T.freigaben();
    const offen = fg.filter((f) => T.freigabeStatus(f).gueltig);

    return h`<div class="block">
        <div class="block__kopfzeile">
          <h2>${ico('schluessel')}Deine Unterlagen</h2>
          <button type="button" class="link" data-tu="tresor-sperren">${ico('schloss')}Tresor schließen</button>
        </div>
        <p class="block__unter">${dokumente.length
      ? dokumente.length + ' ' + U.plural(dokumente.length, 'Dokument', 'Dokumente') + ' verschlüsselt abgelegt.'
      : 'Noch nichts abgelegt. Lade hier ein, was Vermieter regelmäßig verlangen.'}</p>

        <form class="tresor__aufnahme" data-tu-submit="tresor-hochladen">
          <label class="feld"><span>Art der Unterlage</span>
            <select id="tresor-art">
              ${T.ARTEN.map((a) => h`<option value="${a.id}">${a.name}</option>`)}
            </select></label>
          <div class="feld"><span>Datei</span>
            <div class="dateiwahl">
              <input type="file" id="tresor-datei" class="nur-sr" data-tu-change="tresor-dateiname"
                accept=".pdf,.jpg,.jpeg,.png,.webp,.heic" required>
              <label for="tresor-datei" class="knopf knopf--still knopf--klein">${ico('blatt')}Datei wählen</label>
              <i id="tresor-dateiname">noch keine gewählt</i>
            </div>
          </div>
          <div class="feld feld--knopf">
            <button type="submit" class="knopf">${ico('plus')}Verschlüsselt ablegen</button>
          </div>
        </form>
        <p class="fein">PDF, JPG, PNG, WEBP oder HEIC, je bis 8 MB. Die Datei wird verschlüsselt, bevor sie den
          Arbeitsspeicher verlässt – unverschlüsselt liegt sie zu keinem Zeitpunkt im Speicher des Geräts.</p>

        ${dokumente.length ? h`<ul class="tresorliste">
          ${dokumente.map((d) => h`<li>
            ${ico(d.typ === 'application/pdf' ? 'blatt' : 'blatt')}
            <div>
              <b>${d.name || '(Name nicht lesbar)'}</b>
              <span>${artName(d.art)} · ${kb(d.groesse)} · ${U.since(d.hinzu)}
                ${T.HEIKEL.indexOf(d.art) >= 0 ? ui.badge('heikel', 'warn') : ''}</span>
            </div>
            <button type="button" class="ikon-btn" data-tu="tresor-ansehen" data-id="${d.id}" title="Ansehen">${ico('lupe')}</button>
            <button type="button" class="ikon-btn" data-tu="tresor-weg" data-id="${d.id}" title="Löschen">${ico('muell')}</button>
          </li>`)}
        </ul>` : ''}

        ${dokumente.length ? h`<p class="werkzeug__weiter">
          <button type="button" class="knopf" data-tu="freigabe-neu">${ico('teilen')}Unterlagen freigeben</button>
        </p>` : ''}
      </div>

      <div class="block">
        <div class="block__kopfzeile">
          <h2>${ico('verlauf')}Freigaben</h2>
          <span class="fein">${offen.length} von ${fg.length} noch gültig</span>
        </div>
        ${fg.length ? h`<ul class="freigabeliste">
          ${fg.map((f) => {
      const st = T.freigabeStatus(f);
      return h`<li class="${st.gueltig ? '' : 'is-tot'}">
              <div class="freigabeliste__kopf">
                <b>${f.empfaenger || 'ohne Empfänger'}</b>
                ${ui.badge(st.gueltig ? 'gültig' : st.grund, st.gueltig ? 'gut' : 'neutral')}
              </div>
              <span>${f.dokumente.length} ${U.plural(f.dokumente.length, 'Dokument', 'Dokumente')} ·
                erstellt ${U.since(f.erstellt)} · ${st.text}</span>
              ${f.abrufe.length ? h`<i class="freigabeliste__protokoll">${ico('pruefen')}Abgerufen:
                ${f.abrufe.map((a) => U.dateDE(a.zeit.slice(0, 10)) + ' um ' + a.zeit.slice(11, 16)).join(', ')} Uhr</i>`
        : h`<i class="freigabeliste__protokoll">noch nicht abgerufen</i>`}
              <div class="freigabeliste__tun">
                ${st.gueltig ? h`<button type="button" class="knopf knopf--klein knopf--still" data-tu="freigabe-widerrufen" data-id="${f.id}">
                  Sofort widerrufen</button>` : ''}
                <button type="button" class="link" data-tu="freigabe-loeschen" data-id="${f.id}">aus der Liste entfernen</button>
              </div>
            </li>`;
    })}
        </ul>` : h`<p class="info-meldung">${ico('info')}Noch nichts freigegeben. Beim Anschreiben einer Wohnung
          kannst du direkt einen befristeten Verweis mitschicken, statt Dateien anzuhängen.</p>`}
        <p class="fein">Ein Widerruf wirkt sofort: Der Verweis führt danach ins Leere, auch wenn ihn jemand
          gespeichert hat. Bei Dateien im E-Mail-Postfach gibt es das nicht.</p>
      </div>

      ${erklaerung()}`;
  }

  /* ================================================================
     Seite
     ================================================================ */

  function seite() {
    return {
      titel: 'Dokumententresor',
      html: h`<div class="seite seite--schmal">
        <header class="seite__kopf">
          <h1>${ico('schloss')}Dokumententresor</h1>
          <p class="seite__unter">Wer sich auf zwanzig Wohnungen bewirbt, verschickt zwanzig Mal
            Gehaltsnachweise, Ausweiskopie und Schufa – an Fremde, ohne Ablaufdatum. Danach liegen die
            Unterlagen in zwanzig Postfächern und bleiben dort. Hier legst du sie einmal verschlüsselt ab und
            verschickst nur noch einen Verweis, der abläuft und sich widerrufen lässt.</p>
        </header>
        ${ladefehler ? h`<p class="warn-meldung">${ico('warnung')}${ladefehler}</p>` : ''}
        ${!T.verfuegbar() ? nichtMoeglich()
        : !T.eingerichtet() ? einrichtenBlock()
          : !T.istOffen() ? gesperrtBlock() : offenBlock()}

        <div class="block">
          <h2>${ico('info')}Was du ohnehin nie mitschicken solltest</h2>
          <p class="block__unter">Auch der beste Tresor hilft nicht gegen die falsche Reihenfolge.</p>
          <ul class="pruef">
            <li>${ico('warnung')}<span><b>Schufa und Ausweiskopie gehören nicht in die erste Anfrage.</b>
              Erst wenn die Wohnung ernsthaft in Betracht kommt – also nach der Besichtigung.</span></li>
            <li>${ico('warnung')}<span><b>Die Ausweisnummer schwärzen.</b> Für die Identitätsprüfung reichen
              Name, Geburtsdatum und Foto; die Nummer braucht niemand.</span></li>
            <li>${ico('warnung')}<span><b>Kontoauszüge sind keine Einkommensnachweise.</b> Sie zeigen jede
              Ausgabe deines Lebens. Gehaltsabrechnungen genügen.</span></li>
            <li>${ico('info')}<span><b>Fragen nach Familienplanung, Religion, Herkunft, Parteizugehörigkeit
              oder Vorstrafen</b> sind unzulässig. Sie dürfen falsch beantwortet werden, ohne dass der Vertrag
              deshalb angreifbar wird.</span></li>
          </ul>
        </div>
      </div>`,
      danach() { if (!dokumente.length && T.verfuegbar()) laden(); }
    };
  }

  function laden() {
    if (!T.verfuegbar()) return;
    T.liste().then((liste) => {
      const gleich = liste.length === dokumente.length &&
        liste.every((d, i) => dokumente[i] && d.id === dokumente[i].id && d.name === dokumente[i].name);
      dokumente = liste;
      /* Nur die Tresorseite zeigt diese Liste. Anderswo – etwa beim
         Vorladen nach dem Start oder aus einem Dialog heraus – würde ein
         Neuaufbau nur stören. */
      if (!gleich && ui.aktuell === 'tresor') ui.neuZeichnen();
    }).catch((e) => { ladefehler = e.message; });
  }

  /* ================================================================
     Empfängeransicht
     ================================================================ */

  function freigabeAnsicht(route) {
    const roh = route.arg || '';
    const teil = roh.split('~');
    const id = teil[0], geheim = teil.slice(1).join('~');

    return {
      titel: 'Freigegebene Unterlagen',
      html: h`<div class="seite seite--schmal">
        <header class="seite__kopf">
          <h1>${ico('blatt')}Freigegebene Unterlagen</h1>
        </header>
        <div id="freigabe-inhalt"><p class="info-meldung">${ico('verlauf')}Wird entschlüsselt…</p></div>
        <div class="hinweisbox">${ico('info')}
          <div><b>So funktioniert dieser Verweis</b>
          <p>Die Unterlagen wurden verschlüsselt abgelegt. Der Schlüssel steckt im Teil dieses Verweises hinter
            dem Rautezeichen – Browser senden ihn nie an einen Server. Wer den Verweis nicht hat, kann die
            Dateien nicht lesen, auch nicht der Betreiber.</p></div>
        </div>
      </div>`,
      danach(wurzel) {
        if (!T.verfuegbar() || !id || !geheim) {
          malen(h`<p class="warn-meldung">${ico('warnung')}Dieser Verweis ist unvollständig.</p>`);
          return;
        }
        T.freigabeAbrufen(id, geheim).then((ergebnis) => {
          const f = ergebnis.freigabe;
          const st = T.freigabeStatus(f);
          malen(h`<div class="block">
            <div class="kennzahlen kennzahlen--vier">
              <div><b>${ergebnis.dokumente.length}</b><span>${U.plural(ergebnis.dokumente.length, 'Dokument', 'Dokumente')}</span></div>
              <div><b>${U.dateDE(f.ablauf.slice(0, 10))}</b><span>gültig bis</span></div>
              <div><b>${f.abrufe.length} / ${f.maxAbrufe}</b><span>Abrufe</span></div>
              <div><b>${U.since(f.erstellt)}</b><span>freigegeben</span></div>
            </div>
            <p class="${st.gueltig ? 'gut-meldung' : 'warn-meldung'}">
              ${ico(st.gueltig ? 'pruefen' : 'warnung')}${st.text}. Nach Ablauf oder Widerruf führt dieser
              Verweis ins Leere – die Dateien lassen sich dann nicht mehr öffnen.</p>
            <ul class="tresorliste">
              ${ergebnis.dokumente.map((d, i) => h`<li>
                ${ico('blatt')}
                <div><b>${d.name}</b><span>${artName(d.art)} · ${kb(d.groesse)}</span></div>
                <button type="button" class="knopf knopf--klein knopf--still" data-tu="freigabe-ansehen" data-i="${i}">Ansehen</button>
                <button type="button" class="knopf knopf--klein" data-tu="freigabe-sichern" data-i="${i}">Sichern</button>
              </li>`)}
            </ul>
            <div id="freigabe-vorschau"></div>
          </div>`);
          NW.viewTresor.geoeffnet = ergebnis.dokumente;
        }).catch((e) => {
          malen(h`<div class="block block--warn">
            <h2>${ico('warnung')}Kein Zugriff</h2>
            <p>${e.message}</p>
            <p class="fein">Das ist der Sinn der Sache: Ein Verweis, der abgelaufen oder widerrufen wurde,
              lässt sich nicht wiederbeleben – auch nicht von der Person, die ihn erstellt hat.</p>
          </div>`);
        });

        function malen(markup) {
          const el = U.$('#freigabe-inhalt', wurzel);
          if (el) el.innerHTML = String(markup);
        }
      }
    };
  }

  /* ================================================================
     Aktionen
     ================================================================ */

  const A_ = ui.aktionRegistrieren;

  A_('tresor-einrichten', () => {
    const a = U.$('#tresor-kw1').value, b = U.$('#tresor-kw2').value;
    if (a !== b) { ui.toast('Die beiden Kennwörter stimmen nicht überein.', 'schlecht'); return; }
    T.einrichten(a).then(() => {
      ladefehler = '';
      ui.toast('Tresor angelegt und geöffnet.', 'gut');
      laden(); ui.neuZeichnen();
    }, (e) => ui.toast(e.message, 'schlecht'));
  });

  A_('tresor-oeffnen', () => {
    const kw = U.$('#tresor-kw').value;
    T.entsperren(kw).then(() => {
      ladefehler = '';
      ui.toast('Tresor geöffnet.', 'gut');
      laden(); ui.neuZeichnen();
    }, (e) => ui.toast(e.message, 'schlecht'));
  });

  A_('tresor-sperren', () => {
    T.sperren();
    dokumente = [];
    laden(); ui.neuZeichnen();
    ui.toast('Tresor geschlossen. Der Schlüssel ist aus dem Speicher entfernt.');
  });

  A_('tresor-verwerfen', () => {
    if (!confirm('Alle abgelegten Dokumente und Freigaben werden gelöscht. Ohne Kennwort lassen sie sich nicht wiederherstellen. Fortfahren?')) return;
    T.allesLoeschen().then(() => {
      dokumente = [];
      ui.neuZeichnen();
      ui.toast('Tresor geleert.');
    });
  });

  A_('tresor-hochladen', () => {
    const feld = U.$('#tresor-datei');
    const art = U.$('#tresor-art').value;
    const datei = feld.files && feld.files[0];
    if (!datei) { ui.toast('Wähle eine Datei.', 'schlecht'); return; }
    T.hinzufuegen(datei, art).then(() => {
      feld.value = '';
      const anzeige = U.$('#tresor-dateiname');
      if (anzeige) anzeige.textContent = 'noch keine gewählt';
      /* Was im Tresor liegt, gilt in der Bewerbermappe als vorhanden. */
      S.update((s) => { if (s.profil.unterlagen[art] !== undefined) s.profil.unterlagen[art] = true; }, 'profil');
      ui.toast('Verschlüsselt abgelegt.', 'gut');
      laden();
    }, (e) => ui.toast(e.message, 'schlecht'));
  });

  A_('tresor-dateiname', (el) => {
    const anzeige = U.$('#tresor-dateiname');
    const datei = el.files && el.files[0];
    if (anzeige) anzeige.textContent = datei ? datei.name + ' · ' + kb(datei.size) : 'noch keine gewählt';
  });

  A_('tresor-weg', (el) => {
    if (!confirm('Dieses Dokument endgültig löschen?')) return;
    T.loeschen(el.dataset.id).then(() => { ui.toast('Gelöscht.'); laden(); });
  });

  A_('tresor-ansehen', (el) => {
    T.oeffnen(el.dataset.id).then((d) => {
      const url = URL.createObjectURL(new Blob([d.bytes], { type: d.typ || 'application/octet-stream' }));
      ui.dialog({
        titel: d.name,
        breit: true,
        inhalt: /^image\//.test(d.typ)
          ? h`<img class="tresor__vorschau" src="${url}" alt="${d.name}">`
          : h`<p>Vorschau für diesen Dateityp gibt es hier nicht. Du kannst die Datei entschlüsselt sichern.</p>`,
        fuss: h`<button type="button" class="knopf knopf--still" data-tu="tresor-sichern" data-id="${el.dataset.id}">${ico('speichern')}Entschlüsselt sichern</button>
          <button type="button" class="knopf" data-tu="dialog-zu">Schließen</button>`,
        beimSchliessen: () => URL.revokeObjectURL(url)
      });
    }, (e) => ui.toast(e.message, 'schlecht'));
  });

  A_('tresor-sichern', (el) => {
    T.oeffnen(el.dataset.id).then((d) => {
      ui.dateiSichern(d.name, d.bytes, d.typ || 'application/octet-stream');
    }, (e) => ui.toast(e.message, 'schlecht'));
  });

  /* --------------------- Freigabe erstellen --------------------- */

  function freigabeDialog(objektId, empfaengerVorschlag) {
    if (!T.istOffen()) { ui.toast('Öffne zuerst den Tresor.', 'schlecht'); ui.gehe('tresor'); return; }
    if (!dokumente.length) { ui.toast('Im Tresor liegt noch nichts.', 'schlecht'); ui.gehe('tresor'); return; }
    ui.dialog({
      titel: 'Unterlagen freigeben',
      breit: true,
      inhalt: h`<p>Verschickt wird kein Anhang, sondern ein Verweis, der von selbst erlischt. Wähl nur aus,
          was in diesem Schritt wirklich gebraucht wird.</p>
        <fieldset class="filter__gruppe"><legend>Dokumente</legend>
          ${dokumente.map((d) => h`<label class="schalter">
            <input type="checkbox" data-freigabe="${d.id}" ${T.HEIKEL.indexOf(d.art) >= 0 ? '' : 'checked'}>
            <span><b>${d.name || artName(d.art)}</b>
              <i>${artName(d.art)} · ${kb(d.groesse)}${T.HEIKEL.indexOf(d.art) >= 0
        ? ' · vor der Besichtigung besser nicht' : ''}</i></span></label>`)}
        </fieldset>
        <div class="formraster">
          <label class="feld"><span>Empfänger (nur für deine Übersicht)</span>
            <input type="text" id="freigabe-empfaenger" value="${empfaengerVorschlag || ''}"></label>
          <label class="feld"><span>Gültig für</span>
            <select id="freigabe-tage">
              <option value="3">3 Tage</option>
              <option value="7" selected>7 Tage</option>
              <option value="14">14 Tage</option>
              <option value="30">30 Tage</option>
            </select></label>
          <label class="feld"><span>Höchstens abrufbar</span>
            <select id="freigabe-abrufe">
              <option value="1">einmal</option>
              <option value="3" selected>dreimal</option>
              <option value="5">fünfmal</option>
              <option value="10">zehnmal</option>
            </select></label>
        </div>
        <p class="fein">Kürzer und seltener ist besser. Für eine Besichtigung reicht meist ein Abruf über drei Tage.</p>`,
      fuss: h`<button type="button" class="knopf knopf--still" data-tu="dialog-zu">Abbrechen</button>
        <button type="button" class="knopf" data-tu="freigabe-erstellen" data-objekt="${objektId || ''}">${ico('teilen')}Verweis erzeugen</button>`
    });
  }

  A_('freigabe-neu', () => freigabeDialog(null, ''));

  /* --------------------- Freigabe im Anschreiben ---------------------
     Ein zweiter Dialog würde den ersten ersetzen und den getippten Text
     mitnehmen. Deshalb steckt die Freigabe hier direkt im Anschreiben. */

  function freigabeAbschnitt(objektId, empfaenger, optionen) {
    const opt = optionen || {};
    const rahmen = (inhalt) => h`<fieldset class="filter__gruppe"><legend>Unterlagen sicher mitschicken</legend>
      ${inhalt}</fieldset>`;
    const hinweis = (text, knopf) => rahmen(h`<p class="fein">${text}</p>
      <p class="werkzeug__weiter"><a class="knopf knopf--klein knopf--still" href="#/tresor">${ico('schloss')}${knopf}</a></p>`);

    if (!T.verfuegbar()) return '';
    if (!T.eingerichtet()) {
      return hinweis('Statt Dateien anzuhängen, die für immer im fremden Postfach liegen, kannst du deine '
        + 'Unterlagen einmal verschlüsselt ablegen und hier nur einen Verweis mitschicken, der nach gesetzter '
        + 'Frist erlischt.', 'Tresor einrichten');
    }
    if (!T.istOffen()) {
      return hinweis('Dein Tresor ist gesperrt. Öffne ihn, um statt Anhängen einen befristeten Verweis '
        + 'mitzuschicken.', 'Tresor öffnen');
    }
    if (!dokumente.length) {
      return hinweis('Im Tresor liegt noch nichts. Lade dort ab, was regelmäßig verlangt wird – danach '
        + 'genügt hier ein Verweis.', 'Unterlagen ablegen');
    }
    return rahmen(h`<p class="fein">${opt.einleitung || 'Verschickt wird kein Anhang, sondern ein Verweis, '
      + 'der von selbst erlischt und sich widerrufen lässt. Heikles bleibt bewusst abgewählt.'}</p>
      ${dokumente.map((d) => h`<label class="schalter">
        <input type="checkbox" data-freigabe="${d.id}" ${T.HEIKEL.indexOf(d.art) >= 0 ? '' : 'checked'}>
        <span><b>${d.name || artName(d.art)}</b>
          <i>${artName(d.art)} · ${kb(d.groesse)}${T.HEIKEL.indexOf(d.art) >= 0
      ? ' · vor der Besichtigung besser nicht' : ''}</i></span></label>`)}
      <div class="formraster">
        <label class="feld"><span>Gültig für</span>
          <select id="freigabe-tage">
            <option value="3">3 Tage</option>
            <option value="7" selected>7 Tage</option>
            <option value="14">14 Tage</option>
          </select></label>
        <label class="feld"><span>Höchstens abrufbar</span>
          <select id="freigabe-abrufe">
            <option value="1">einmal</option>
            <option value="3" selected>dreimal</option>
            <option value="5">fünfmal</option>
          </select></label>
      </div>
      <input type="hidden" id="freigabe-empfaenger" value="${empfaenger || ''}">
      ${opt.ohneKnopf ? '' : h`<p class="werkzeug__weiter">
        <button type="button" class="knopf knopf--klein" data-tu="anschreiben-verweis"
          data-objekt="${objektId || ''}" data-ziel="#anschreiben-text">${ico('teilen')}Verweis erzeugen und einfügen</button>
      </p>`}`);
  }

  A_('anschreiben-verweis', (el) => {
    const ids = U.$$('[data-freigabe]').filter((x) => x.checked).map((x) => x.dataset.freigabe);
    if (!ids.length) { ui.toast('Wähle mindestens ein Dokument.', 'schlecht'); return; }
    T.freigabeErstellen({
      dokumente: ids,
      empfaenger: (U.$('#freigabe-empfaenger') || {}).value || '',
      tage: Number((U.$('#freigabe-tage') || {}).value) || 7,
      maxAbrufe: Number((U.$('#freigabe-abrufe') || {}).value) || 3,
      objektId: el.dataset.objekt || null
    }).then((f) => {
      const feld = U.$(el.dataset.ziel || '#anschreiben-text');
      if (feld) {
        /* Bewusst eng: Nur ein zuvor von hier eingefügter Block wird
           ersetzt. Ein ähnlich beginnender Satz aus dem Anschreiben
           bleibt stehen. */
        feld.value = feld.value.replace(/\n*Meine Unterlagen liegen verschlüsselt bereit[\s\S]*$/, '')
          .replace(/\s+$/, '')
          + '\n\nMeine Unterlagen liegen verschlüsselt bereit. Dieser Verweis öffnet sie, gilt '
          + f.tage + ' ' + U.plural(f.tage, 'Tag', 'Tage') + ' und lässt sich ' + f.maxAbrufe + ' Mal öffnen:\n'
          + f.link;
      }
      /* Der Abschnitt hat seinen Zweck erfüllt – an seiner Stelle steht
         jetzt, was verschickt wird. */
      const feldsatz = el.closest('fieldset');
      if (feldsatz) {
        feldsatz.innerHTML = String(h`<legend>Unterlagen sicher mitschicken</legend>
          <p class="gut-meldung">${ico('pruefen')}Verweis erzeugt und unten in den Text eingefügt:
            ${ids.length} ${U.plural(ids.length, 'Dokument', 'Dokumente')}, gültig ${f.tage} ${U.plural(f.tage, 'Tag', 'Tage')},
            ${f.maxAbrufe} ${U.plural(f.maxAbrufe, 'Abruf', 'Abrufe')}.</p>
          <p class="fein">Widerrufen kannst du ihn jederzeit im <a href="#/tresor">Dokumententresor</a>.</p>`);
      }
      laden();
    }, (e) => ui.toast(e.message, 'schlecht'));
  });

  A_('freigabe-erstellen', (el) => {
    const ids = U.$$('[data-freigabe]').filter((x) => x.checked).map((x) => x.dataset.freigabe);
    if (!ids.length) { ui.toast('Wähle mindestens ein Dokument.', 'schlecht'); return; }
    T.freigabeErstellen({
      dokumente: ids,
      empfaenger: (U.$('#freigabe-empfaenger') || {}).value || '',
      tage: Number((U.$('#freigabe-tage') || {}).value) || 7,
      maxAbrufe: Number((U.$('#freigabe-abrufe') || {}).value) || 3,
      objektId: el.dataset.objekt || null
    }).then((f) => {
      ui.dialogZu();
      ui.dialog({
        titel: 'Verweis erzeugt',
        breit: true,
        inhalt: h`<p>Dieser Verweis gilt <b>${f.tage} Tage</b> und lässt sich <b>${f.maxAbrufe} Mal</b> öffnen.
            Danach ist er wertlos. Im Tresor kannst du ihn jederzeit vorher widerrufen.</p>
          <label class="feld"><span>Verweis</span>
            <textarea rows="3" id="freigabe-link" readonly>${f.link}</textarea></label>
          <div class="hinweisbox">${ico('warnung')}
            <div><b>Der Schlüssel steckt im Verweis</b>
            <p>Alles hinter dem Rautezeichen ist der Schlüssel. Wer den Verweis weitergibt, gibt die Unterlagen
              weiter. Verschick ihn deshalb einzeln und nicht in Verteilern.</p></div>
          </div>
          <p class="fein">In dieser Vorführung liegen die verschlüsselten Dateien in diesem Browser – der
            Verweis funktioniert deshalb nur auf diesem Gerät.</p>`,
        fuss: h`<button type="button" class="knopf knopf--still" data-tu="kopieren" data-quelle="#freigabe-link">${ico('kopieren')}Verweis kopieren</button>
          <button type="button" class="knopf" data-tu="dialog-zu">Fertig</button>`
      });
      NW.viewTresor.letzterLink = f.link;
      laden();
      /* Die Dokumentenliste ist unverändert – die Freigabenliste nicht.
         Ohne diesen Anstoß bliebe die neue Freigabe unsichtbar. */
      if (ui.aktuell === 'tresor') ui.neuZeichnen();
    }, (e) => ui.toast(e.message, 'schlecht'));
  });

  A_('freigabe-widerrufen', (el) => {
    T.widerrufen(el.dataset.id);
    ui.neuZeichnen();
    ui.toast('Widerrufen. Der Verweis führt ab sofort ins Leere.', 'gut');
  });

  A_('freigabe-loeschen', (el) => {
    T.freigabeLoeschen(el.dataset.id);
    ui.neuZeichnen();
  });

  A_('freigabe-ansehen', (el) => {
    const d = (NW.viewTresor.geoeffnet || [])[Number(el.dataset.i)];
    if (!d) return;
    const url = URL.createObjectURL(new Blob([d.bytes], { type: d.typ || 'application/octet-stream' }));
    ui.dialog({
      titel: d.name, breit: true,
      inhalt: /^image\//.test(d.typ)
        ? h`<img class="tresor__vorschau" src="${url}" alt="${d.name}">`
        : h`<p>Für diesen Dateityp gibt es hier keine Vorschau. Sichere die Datei, um sie zu öffnen.</p>`,
      fuss: h`<button type="button" class="knopf" data-tu="dialog-zu">Schließen</button>`,
      beimSchliessen: () => URL.revokeObjectURL(url)
    });
  });

  A_('freigabe-sichern', (el) => {
    const d = (NW.viewTresor.geoeffnet || [])[Number(el.dataset.i)];
    if (!d) return;
    ui.dateiSichern(d.name, d.bytes, d.typ || 'application/octet-stream');
  });

  /* Für die Serienbewerbung: je Empfänger ein eigener Verweis. Ein
     geteilter wäre ein Generalschlüssel – jede Seite könnte ihn
     weiterreichen, und der Abrufzähler liefe für alle zusammen. */
  function verweisJeEmpfaenger(auftraege) {
    const ids = U.$$('[data-freigabe]').filter((x) => x.checked).map((x) => x.dataset.freigabe);
    if (!ids.length || !T.istOffen()) return Promise.resolve({});
    const tage = Number((U.$('#freigabe-tage') || {}).value) || 7;
    const maxAbrufe = Number((U.$('#freigabe-abrufe') || {}).value) || 3;
    /* Nacheinander: Jede Freigabe schreibt dieselbe Liste zurück, parallel
       würden sich die Schreibvorgänge gegenseitig überholen. */
    const ergebnis = {};
    return auftraege.reduce((kette, a) => kette.then(() => T.freigabeErstellen({
      dokumente: ids, empfaenger: a.empfaenger, objektId: a.objektId, tage, maxAbrufe
    }).then((f) => {
      ergebnis[a.objektId] = '\n\nMeine Unterlagen liegen verschlüsselt bereit. Dieser Verweis öffnet sie, gilt '
        + f.tage + ' ' + U.plural(f.tage, 'Tag', 'Tage') + ' und lässt sich ' + f.maxAbrufe + ' Mal öffnen:\n' + f.link;
    }).catch(() => { })), Promise.resolve()).then(() => { laden(); return ergebnis; });
  }

  ui.ansichten.tresor = seite;
  ui.ansichten.freigabe = freigabeAnsicht;
  NW.viewTresor = { laden, freigabeDialog, freigabeAbschnitt, verweisJeEmpfaenger,
    geoeffnet: [], letzterLink: '', artName };
})(window.NW = window.NW || {});
