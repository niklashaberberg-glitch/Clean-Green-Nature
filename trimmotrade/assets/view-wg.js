/* =====================================================================
   TrimmoTrade – Ansicht: WG gründen

   Auf jedem Wohnungsportal gilt: Wer allein die Miete nicht aufbringt,
   sucht ein WG-Zimmer und hofft, dass eine bestehende WG ihn nimmt. Was
   dabei nie passiert: dass sich drei Menschen zusammentun und eine
   Wohnung nehmen, die keiner von ihnen allein bekommen hätte.

   Das liegt nicht am Wollen. Es liegt daran, dass jeder gleichzeitig die
   Wohnung und die Mitbewohner bräuchte – und beides voneinander abhängt.
   Genau diese Abhängigkeit löst diese Ansicht auf: Eine Person eröffnet
   eine Gruppe zu einer konkreten Wohnung, andere sehen sie und treten
   bei, und wenn sie voll ist, bewirbt sie sich gemeinsam.

   Was hier bewusst nicht steht: eine Bewertung von Menschen. Die Passung
   rechnet über sechs Fragen zum Alltag, und sie sagt genau das – nicht,
   ob jemand ein guter Mensch ist.
   ===================================================================== */
(function (TT) {
  'use strict';

  const U = TT.util, ui = TT.ui, S = TT.store, W = TT.wg;
  const h = U.html, raw = U.raw, ico = U.svg;
  const A_ = ui.aktionRegistrieren;

  let offene = null;      // Gruppen, die noch jemanden suchen
  let geladen = false;

  /* ==================================================================
     Der Rechtsteil

     Er steht hier und nicht im Kleingedruckten, weil er die eine
     Entscheidung betrifft, die man nicht rückgängig machen kann. Eine
     WG zu gründen ist rechtlich kein Zusammenwohnen, sondern ein
     Mietvertrag – und welcher es ist, entscheidet über sehr viel Geld.
     ================================================================== */

  const VERTRAGSFORMEN = {
    gemeinsam: {
      name: 'Ein gemeinsamer Vertrag',
      kurz: 'Alle stehen zusammen im Vertrag.',
      gut: ['Die anbietende Seite bevorzugt das fast immer.',
        'Wer auszieht, kann ersetzt werden – wenn alle zustimmen.'],
      schlecht: ['Ihr haftet als Gesamtschuldner (§ 421 BGB): Zahlt einer nicht, kann die '
        + 'Vermieterseite die volle Miete von jedem Einzelnen verlangen.',
        'Ein Auszug allein geht nicht. Der Wechsel einer Person ist eine Vertragsänderung und '
        + 'braucht die Zustimmung aller Mitmietenden und der Vermieterseite.']
    },
    einzeln: {
      name: 'Ein Vertrag je Zimmer',
      kurz: 'Jede Person hat einen eigenen Vertrag.',
      gut: ['Keine Haftung für die anderen.',
        'Jede Person kann für sich kündigen, ohne die anderen zu fragen.'],
      schlecht: ['Deutlich seltener – für die Vermieterseite ist es mehr Verwaltung.',
        'Die Gemeinschaftsräume gehören dann niemandem allein; das gehört geregelt.']
    },
    offen: {
      name: 'Noch offen',
      kurz: 'Die Vertragsform ist noch nicht entschieden.',
      gut: ['Ihr könnt danach fragen, bevor ihr euch festlegt.'],
      schlecht: ['Fragt früh. Nach der Zusage ist die Verhandlungsposition schlechter.']
    }
  };

  function rechtsKasten(form) {
    const f = VERTRAGSFORMEN[form] || VERTRAGSFORMEN.offen;
    return h`<details class="wg-recht">
      <summary>${ico('blatt')}<span>Was ihr rechtlich unterschreibt: <b>${f.name}</b></span></summary>
      <p class="fein">${f.kurz}</p>
      <div class="spalten2">
        <div>
          <h4>${ico('check')}Spricht dafür</h4>
          <ul class="pruef">${f.gut.map((x) => h`<li><span>${x}</span></li>`)}</ul>
        </div>
        <div>
          <h4>${ico('warnung')}Solltet ihr wissen</h4>
          <ul class="pruef">${f.schlecht.map((x) => h`<li><span>${x}</span></li>`)}</ul>
        </div>
      </div>
      <h4>Vier Dinge, die fast alle falsch machen</h4>
      <ul class="pruef">
        <li><span><b>Die Kaution gilt für die Wohnung, nicht je Person.</b> Höchstens drei
          Nettokaltmieten insgesamt (§ 551 Abs. 1 BGB). Wer von jedem drei Monatsmieten verlangt,
          verlangt zu viel – und ihr dürft in drei Raten zahlen.</span></li>
        <li><span><b>Ein Auszug beim gemeinsamen Vertrag ist keine Kündigung.</b> Man kündigt nur
          gemeinsam. Wer allein gehen will, braucht eine Vertragsänderung – und damit das Ja aller
          anderen und der Vermieterseite.</span></li>
        <li><span><b>Jede Person muss sich anmelden</b>, innerhalb von zwei Wochen. Die Vermieterseite
          ist verpflichtet, dafür eine Wohnungsgeberbestätigung auszustellen (§ 19 BMG).</span></li>
        <li><span><b>Der Rundfunkbeitrag fällt einmal je Wohnung an</b>, nicht je Person. Eine WG
          zahlt zusammen einen Beitrag – klärt gleich, wer ihn anmeldet und wie ihr teilt.</span></li>
      </ul>
      <p class="fein">Allgemeine Hinweise, keine Rechtsberatung. Bei einem gemeinsamen Vertrag über
        mehrere Jahre lohnt der Blick eines Mietervereins, bevor unterschrieben wird.</p>
    </details>`;
  }

  /* ==================================================================
     Bausteine
     ================================================================== */

  /* Die Passung zu einer Gruppe. Gerechnet wird gegen jedes Mitglied
     einzeln, nicht gegen einen Durchschnitt aus allen – „im Mittel
     passt es“ ist genau die Aussage, die niemandem hilft, der mit einer
     bestimmten Person eine Küche teilen wird.

     Ausschlussgründe stehen im Klartext und ohne Zahl daneben: Eine
     Allergie ist keine Prozentzahl. */
  function passungsZeile(gruppe) {
    const p = S.get().profil;
    const b = TT.passung.inGruppe(gruppe, p);
    if (!b || (b.score === null && !b.harte.length)) {
      return h`<p class="fein wg-karte__passung">${ico('info')}Für eine Einschätzung fehlt dein
        Alltagsprofil. <a href="#/profil">Die Fragen im Profil</a> genügen.</p>`;
    }
    if (b.harte.length) {
      return h`<p class="wg-karte__passung is-schlecht">${ico('warnung')}
        <b>${U.t(b.harte.length === 1 ? 'Ein Ausschlusskriterium' : 'Ausschlusskriterien')}</b>
        <span>${b.harte.map((x) => (x.wer ? x.wer + ': ' : '') + U.t(x.text)).join(' ')}</span></p>`;
    }
    const ton = b.score >= 75 ? 'gut' : b.score >= 55 ? 'warn' : 'schlecht';
    const schwach = b.schwaechste && b.einzeln.length > 1 && b.schwaechste.score < b.score - 8
      ? b.schwaechste : null;
    return h`<p class="wg-karte__passung is-${ton}">${ico('wg')}
      <b>${U.t('{0} % Passung').replace('{0}', b.score)}</b>
      <span>${U.t(b.kurz)}${schwach ? ' · ' + U.t('am wenigsten mit {0} ({1} %)')
        .replace('{0}', schwach.name).replace('{1}', schwach.score) : ''}${schwach && schwach.reibung
        ? ' – ' + U.t(schwach.reibung.label) : b.einzeln[0] && b.einzeln[0].reibung
          ? ' – ' + U.t(b.einzeln[0].reibung.label) : ''}</span></p>`;
  }

  function person(m, gruppe) {
    const e = m.eckdaten || {};
    return h`<li class="wg-person ${m.ich ? 'is-ich' : ''}">
      ${raw(TT.img.avatar(m.name || '?', 38))}
      <div>
        <b>${m.name || U.t('jemand')}${m.rolle === 'gruender' ? ui.badge('gegründet', 'neutral') : ''}
          ${m.ich ? ui.badge('du', 'info') : ''}</b>
        <span class="wg-person__eck">
          ${['alter', 'beruf', 'einzug'].filter((k) => e[k]).map((k) =>
        h`<i>${k === 'alter' ? U.t('{0} Jahre').replace('{0}', e[k]) : e[k]}</i>`)}
        </span>
        ${m.vorstellung ? h`<p class="wg-person__text">${m.vorstellung}</p>` : ''}
        ${m.mail ? h`<a class="wg-person__mail" href="mailto:${m.mail}">${ico('nachricht')}${m.mail}</a>` : ''}
      </div>
      ${gruppe && gruppe.meineRolle === 'gruender' && m.rolle !== 'gruender' && m.__anfrage
        ? h`<span class="wg-person__tun">
            <button type="button" class="knopf knopf--klein" data-tu="wg-annehmen"
              data-id="${gruppe.id}" data-person="${m.id}">${ico('check')}Aufnehmen</button>
            <button type="button" class="knopf knopf--klein knopf--still" data-tu="wg-ablehnen"
              data-id="${gruppe.id}" data-person="${m.id}">Absagen</button>
          </span>` : ''}
    </li>`;
  }

  /* Eine Gruppe als Karte. Dieselbe Darstellung auf der Objektseite und
     in der Übersicht – eine Gruppe ist an beiden Stellen dieselbe Sache,
     und zwei Darstellungen davon würden auseinanderlaufen. */
  function karte(g, opt) {
    const o = opt || {};
    const teil = W.anteil(g);
    const drin = g.meineRolle === 'dabei' || g.meineRolle === 'gruender';
    const angefragt = g.meineRolle === 'angefragt';
    const zu = g.stand !== 'offen' || !g.offen;

    return h`<article class="wg-karte ${drin ? 'is-drin' : ''}">
      <header class="wg-karte__kopf">
        <div>
          <h3>${g.name}</h3>
          ${o.mitWohnung && g.inserat ? h`<p class="wg-karte__wohnung">${ico('haus')}
            <a href="#/objekt/${g.inserat.id}">${U.truncate(g.inserat.titel, 44)}</a>
            ${g.inserat.weg ? ui.badge('Wohnung weg', 'schlecht') : ''}</p>` : ''}
        </div>
        <div class="wg-karte__zahl">
          <b>${g.dabei}<i>/${g.ziel}</i></b>
          <span>${g.frei > 0 ? U.t('{0} frei').replace('{0}', g.frei) : U.t('voll')}</span>
        </div>
      </header>

      ${teil ? h`<p class="wg-karte__geld">${ico('euro')}
        <b>${U.eur(teil)}</b> <span>je Person warm, bei ${g.ziel} Personen</span></p>` : ''}

      ${g.text ? h`<p class="wg-karte__text">${g.text}</p>` : ''}

      ${g.stand === 'beworben' ? h`<p class="gut-meldung">${ico('pruefen')}Diese Gruppe hat sich
        gemeinsam beworben.</p>` : ''}
      ${g.stand === 'voll' && g.stand !== 'beworben' ? h`<p class="info-meldung">${ico('info')}Vollzählig –
        die Gruppe kann sich bewerben.</p>` : ''}

      ${g.mitglieder && g.mitglieder.length ? h`<ul class="wg-personen">
        ${g.mitglieder.map((m) => person(m, g))}
      </ul>` : h`<p class="fein">${TT.konto && TT.konto.angemeldet()
        ? 'Noch niemand hat sich vorgestellt.'
        : 'Wer dabei ist, siehst du nach der Anmeldung. Ohne Konto zeigen wir keine Personen.'}</p>`}

      ${g.anfragen && g.anfragen.length ? h`<div class="wg-anfragen">
        <h4>${ico('person')}${U.t('{0} möchten dazukommen').replace('{0}', g.anfragen.length)}</h4>
        <ul class="wg-personen">
          ${g.anfragen.map((m) => person(Object.assign({}, m, { __anfrage: true }), g))}
        </ul>
        <p class="fein">Du entscheidest. Bis dahin sehen die übrigen Mitglieder diese Anfragen nicht.</p>
      </div>` : ''}

      ${!drin && !angefragt && g.mitglieder && g.mitglieder.length ? passungsZeile(g) : ''}

      <footer class="wg-karte__fuss">
        ${angefragt ? h`<span class="fein">${ico('verlauf')}Deine Anfrage liegt bei der Gruppe.</span>
          <button type="button" class="link" data-tu="wg-verlassen" data-id="${g.id}">zurückziehen</button>`
        : drin ? h`
          ${g.meineRolle === 'gruender' && g.dabei >= 2 && g.stand !== 'beworben' && g.inserat && !g.inserat.weg
          ? h`<button type="button" class="knopf" data-tu="wg-bewerben" data-id="${g.id}">
              ${ico('nachricht')}Gemeinsam bewerben</button>` : ''}
          <button type="button" class="link" data-tu="wg-verlassen" data-id="${g.id}">
            ${g.meineRolle === 'gruender' ? 'Gruppe auflösen' : 'Gruppe verlassen'}</button>`
        : zu ? h`<span class="fein">Diese Gruppe nimmt gerade niemanden auf.</span>`
          : h`<button type="button" class="knopf" data-tu="wg-beitreten" data-id="${g.id}">
            ${ico('plus')}Beitreten</button>`}
      </footer>
    </article>`;
  }

  /* ==================================================================
     Die Ansicht
     ================================================================== */

  function wg() {
    if (!W.amServer()) {
      return {
        titel: 'WG gründen',
        html: h`<div class="seite seite--schmal">
          ${kopf()}
          <div class="hinweisbox">${ico('info')}
            <div><b>Dafür braucht es die Website</b>
            <p>Eine WG zu gründen heißt, dass sich Menschen finden, die sich nicht kennen. Das geht
              nur dort, wo mehr als ein Browser beteiligt ist – auf <b>trimmotrade.de</b>. Diese Kopie
              läuft ohne Verbindung und zeigt nur, wie es aussieht.</p></div>
          </div>
          ${rechtsKasten('gemeinsam')}
        </div>`
      };
    }

    if (!geladen) {
      geladen = true;
      Promise.all([W.meineHolen(true), W.offeneHolen().then((g) => { offene = g; })])
        .then(() => { if (ui.aktuell === 'wg') ui.neuZeichnen(); });
    }

    const meine = W.meine;
    const fremde = (offene || []).filter((g) => !meine.some((m) => m.id === g.id));

    return {
      titel: 'WG gründen',
      html: h`<div class="seite seite--schmal">
        ${kopf()}

        ${TT.konto && !TT.konto.angemeldet() ? h`<div class="hinweisbox">${ico('schluessel')}
          <div><b>Ansehen geht ohne Konto, mitmachen nicht</b>
          <p>Wer einer Gruppe beitritt, erzählt Fremden etwas über sich. Das setzt voraus, dass man
            weiß, mit wem man es zu tun hat – deshalb geht es nur mit bestätigter Adresse.
            <a href="#/anmelden">Anmelden</a> dauert eine halbe Minute.</p></div>
        </div>` : ''}

        ${meine.length ? h`<section class="block">
          <h2>${ico('wg')}Deine Gruppen</h2>
          <div class="wg-liste">${meine.map((g) => karte(g, { mitWohnung: true }))}</div>
        </section>` : ''}

        <section class="block">
          <div class="block__kopfzeile">
            <h2>${ico('suche')}Gruppen, die noch jemanden suchen</h2>
            ${fremde.length ? h`<span class="fein">${fremde.length}</span>` : ''}
          </div>
          ${fremde.length
        ? h`<div class="wg-liste">${fremde.map((g) => karte(g, { mitWohnung: true }))}</div>`
        : h`<div class="leer">${ico('wg')}
            <h3>Gerade sucht keine Gruppe</h3>
            <p>Gruppen entstehen an einer konkreten Wohnung. Such dir eine, die für eine WG-Gründung
              freigegeben ist, und eröffne die erste.</p>
            <p><a class="knopf" href="#/suche?wg=1">${ico('suche')}Wohnungen für WG-Gründung</a></p>
          </div>`}
        </section>

        ${rechtsKasten('gemeinsam')}
      </div>`
    };
  }

  function kopf() {
    return h`<header class="seite__kopf">
      <h1>${ico('wg')}WG gründen</h1>
      <p class="seite__unter">Eine Wohnung, die für eine Person zu groß und für eine Familie zu teuer
        ist, wird bezahlbar, sobald sich drei Leute finden. Hier findet man sie – vor der Wohnung,
        nicht danach.</p>
    </header>`;
  }

  /* ==================================================================
     Der Block auf der Objektseite
     ================================================================== */

  function objektBlock(l) {
    if (!l || !l.wgGruendungMoeglich) return '';
    const g = (l.wgGruendung || {});
    const gruppen = (TT.wg && TT.wg.amServer()) ? (gruppenZu[l.id] || null) : [];
    const maxP = g.maxPersonen || Math.max(2, Math.floor(l.zimmer || 2));
    const jeder = l.warm ? Math.round(l.warm / maxP) : null;

    return h`<section class="block wg-block" id="wg-block">
      <div class="block__kopfzeile">
        <h2>${ico('wg')}Für eine WG-Gründung freigegeben</h2>
        ${ui.badge('bis ' + maxP + ' Personen', 'info')}
      </div>
      <p class="block__unter">Die anbietende Seite vermietet diese Wohnung ausdrücklich auch an
        mehrere Personen, die sich nicht kennen.${jeder ? U.t(' Bei {0} Personen zahlt jede etwa {1} warm.')
        .replace('{0}', maxP).replace('{1}', U.eur(jeder)) : ''}</p>
      ${g.hinweis ? h`<p class="wg-block__hinweis">${ico('info')}${g.hinweis}</p>` : ''}

      ${gruppen === null
        ? h`<p class="fein">${ico('verlauf')}Gruppen werden geladen …</p>`
        : gruppen.length
          ? h`<div class="wg-liste">${gruppen.map((x) => karte(x, { mitWohnung: false }))}</div>`
          : h`<p class="fein">Zu dieser Wohnung gibt es noch keine Gruppe.</p>`}

      ${gruppen && !gruppen.some((x) => x.meineRolle) ? h`<p class="werkzeug__weiter">
        <button type="button" class="knopf" data-tu="wg-gruenden" data-id="${l.id}">
          ${ico('plus')}Gruppe gründen</button></p>` : ''}

      ${rechtsKasten(g.vertrag || 'offen')}
    </section>`;
  }

  /* Der Zwischenspeicher der Objektseite. Er liegt hier und nicht in
     wg.js, weil nur diese Ansicht ihn zeichnet. */
  const gruppenZu = {};

  function objektLaden(id, danach) {
    if (!TT.wg || !TT.wg.amServer()) return;
    TT.wg.fuerInserat(id, true).then((g) => {
      gruppenZu[id] = g;
      if (danach) danach();
    });
  }

  /* ==================================================================
     Aktionen
     ================================================================== */

  function vorstellungsFelder(vorgabe) {
    const p = S.get().profil;
    const e = W.eckdatenAus(p);
    const felder = W.eckdatenZeilen(e);
    return h`<label class="feld"><span>Ein paar Sätze über dich</span>
        <textarea rows="5" id="wg-vorstellung" placeholder="Wer du bist, was du arbeitest, wie du wohnst – und warum diese Wohnung.">${vorgabe || p.vorstellung || ''}</textarea></label>
      ${felder.length ? h`<fieldset class="filter__gruppe eckdaten">
        <legend>Das geht aus deinem Profil mit</legend>
        <ul class="eckdaten__liste">
          ${felder.map((z) => h`<li><span>${U.t(z[0])}</span><b>${z[1]}</b></li>`)}
        </ul>
        ${p.lifestyle ? h`<p class="fein">${ico('wg')}Dazu deine Antworten zum Alltag – daraus rechnet
          sich die Passung. Ohne sie sieht die Gruppe keine Einschätzung.</p>` : ''}
        <p class="fein">Mehr als diese Liste geht nicht mit. Weder deine Adresse noch dein Einkommen
          auf den Euro, und nichts, wonach niemand fragen darf.</p>
      </fieldset>` : h`<div class="hinweisbox">${ico('info')}
        <div><b>Dein Profil ist leer</b>
        <p>Alter, Beruf und die sechs Fragen zum Alltag entscheiden darüber, ob jemand dich aufnimmt.
          <a href="#/profil">Im Profil ergänzen</a> – es dauert zwei Minuten.</p></div>
      </div>`}
      <p class="fein">Deine E-Mail-Adresse sehen die anderen erst, wenn ihr euch gegenseitig
        angenommen habt. Vorher steht dort nur dein Rufname.</p>`;
  }

  A_('wg-gruenden', (el) => {
    const l = TT.data.byId[el.dataset.id];
    if (!l) return;
    const maxP = (l.wgGruendung || {}).maxPersonen || Math.max(2, Math.floor(l.zimmer || 2));
    ui.dialog({
      titel: 'Gruppe gründen',
      breit: true,
      inhalt: h`<p class="block__unter">Du eröffnest eine Gruppe für <b>${U.truncate(l.titel, 50)}</b>.
          Andere sehen sie, stellen sich vor, und du entscheidest, wer dazukommt.</p>
        <label class="feld"><span>Name der Gruppe</span>
          <input type="text" id="wg-name" maxlength="60" value="${U.t('WG in {0}').replace('{0}', l.viertel)}"></label>
        <label class="feld"><span>Zu wie vielt?</span>
          <select id="wg-ziel">
            ${Array.from({ length: maxP - 1 }, (x, i) => i + 2).map((n) =>
        h`<option value="${n}" ${n === Math.min(3, maxP) ? 'selected' : ''}>${n} ${U.t('Personen')}${l.warm
          ? ' · ' + U.eur(Math.round(l.warm / n)) + U.t(' je Person') : ''}</option>`)}
          </select></label>
        <label class="feld"><span>Was für eine WG soll das werden?</span>
          <textarea rows="4" id="wg-text" placeholder="Zweck-WG oder gemeinsam kochen? Ruhig oder offen für Besuch? Je klarer, desto passender melden sich Leute."></textarea></label>
        ${vorstellungsFelder()}`,
      fuss: h`<button type="button" class="knopf knopf--still" data-tu="dialog-zu">Abbrechen</button>
        <button type="button" class="knopf" data-tu="wg-gruenden-los" data-id="${l.id}">${ico('wg')}Gruppe eröffnen</button>`
    });
  });

  A_('wg-gruenden-los', (el) => {
    const id = el.dataset.id;
    const p = S.get().profil;
    const vorstellung = (U.$('#wg-vorstellung') || {}).value || '';
    if (vorstellung.trim().length < 20) {
      ui.toast('Schreib ein paar Sätze über dich – ohne das meldet sich niemand.', 'schlecht');
      return;
    }
    ui.knopfArbeit(el, TT.api.ruf('gruppe/neu', {
      inserat: id,
      name: (U.$('#wg-name') || {}).value || '',
      ziel: Number((U.$('#wg-ziel') || {}).value || 3),
      text: (U.$('#wg-text') || {}).value || '',
      vorstellung,
      eckdaten: W.eckdatenAus(p)
    }).then((d) => {
      W.vergessen(id);
      objektLaden(id, () => ui.neuZeichnen());
      ui.dialogZu();
      if (TT.markt) TT.markt.zaehle('wg-gruppe-neu');
      ui.toast(d.gruppe && d.gruppe.hinweis
        ? d.gruppe.hinweis
        : 'Gruppe eröffnet. Jetzt kann sich jemand melden.', d.gruppe && d.gruppe.hinweis ? 'warn' : 'gut');
      ui.neuZeichnen();
    }, (e) => ui.toast((e && e.text) || 'Das ging nicht.', 'schlecht')), 'Wird eröffnet …');
  });

  A_('wg-beitreten', (el) => {
    const id = el.dataset.id;
    const g = alleGruppen().find((x) => x.id === id);
    if (!g) return;
    const teil = W.anteil(g);
    ui.dialog({
      titel: 'Der Gruppe beitreten',
      breit: true,
      inhalt: h`<p class="block__unter">Du stellst dich <b>${g.name}</b> vor. Die gründende Person
          entscheidet, ob du dazukommst; die übrigen Mitglieder sehen deine Anfrage bis dahin nicht.</p>
        ${teil ? h`<p class="wg-karte__geld">${ico('euro')}<b>${U.eur(teil)}</b>
          <span>je Person warm, bei ${g.ziel} Personen</span></p>` : ''}
        ${vorstellungsFelder()}
        <div class="hinweisbox">${ico('warnung')}
          <div><b>Bevor du zusagst</b>
          <p>Bei einem gemeinsamen Mietvertrag haftet ihr als Gesamtschuldner: Zahlt eine Person nicht,
            kann die Vermieterseite die volle Miete von jeder Einzelnen verlangen (§ 421 BGB). Trefft
            euch, bevor ihr unterschreibt.</p></div>
        </div>`,
      fuss: h`<button type="button" class="knopf knopf--still" data-tu="dialog-zu">Abbrechen</button>
        <button type="button" class="knopf" data-tu="wg-beitreten-los" data-id="${g.id}">${ico('plus')}Anfrage schicken</button>`
    });
  });

  A_('wg-beitreten-los', (el) => {
    const vorstellung = (U.$('#wg-vorstellung') || {}).value || '';
    if (vorstellung.trim().length < 20) {
      ui.toast('Schreib ein paar Sätze über dich – sonst kann niemand entscheiden.', 'schlecht');
      return;
    }
    ui.knopfArbeit(el, TT.api.ruf('gruppe/beitreten', {
      id: el.dataset.id, vorstellung, eckdaten: W.eckdatenAus(S.get().profil)
    }).then(() => {
      neuLaden();
      ui.dialogZu();
      if (TT.markt) TT.markt.zaehle('wg-beitritt');
      ui.toast('Anfrage geschickt. Die Gruppe bekommt eine Mail.', 'gut');
    }, (e) => ui.toast((e && e.text) || 'Das ging nicht.', 'schlecht')), 'Wird geschickt …');
  });

  const entscheiden = (el, ja) => ui.knopfArbeit(el, TT.api.ruf('gruppe/entscheiden', {
    id: el.dataset.id, person: el.dataset.person, ja
  }).then(() => {
    neuLaden();
    ui.toast(ja ? 'Aufgenommen. Ihr seht jetzt eure Adressen.' : 'Abgesagt.', ja ? 'gut' : 'info');
  }, (e) => ui.toast((e && e.text) || 'Das ging nicht.', 'schlecht')), '…');

  A_('wg-annehmen', (el) => entscheiden(el, true));
  A_('wg-ablehnen', (el) => entscheiden(el, false));

  A_('wg-verlassen', (el) => {
    const g = alleGruppen().find((x) => x.id === el.dataset.id);
    const gruender = g && g.meineRolle === 'gruender';
    if (!confirm(U.t(gruender
      ? 'Die Gruppe auflösen? Alle Mitglieder werden benachrichtigt.'
      : 'Diese Gruppe wirklich verlassen?'))) return;
    ui.knopfArbeit(el, TT.api.ruf('gruppe/verlassen', { id: el.dataset.id }).then(() => {
      neuLaden();
      ui.toast(gruender ? 'Gruppe aufgelöst.' : 'Du bist raus.');
    }, (e) => ui.toast((e && e.text) || 'Das ging nicht.', 'schlecht')));
  });

  /* „zu zweit“, „zu dritt“, „zu viert“ – und ab sieben „mit sieben
     Personen“. Aus einer Zahl mit angehängtem „t“ wird kein deutsches
     Wort, und in der englischen Fassung erst recht nicht. */
  const ZU = ['', '', 'zu zweit', 'zu dritt', 'zu viert', 'zu fünft', 'zu sechst'];
  const zuWieViel = (n) => (ZU[n] ? U.t(ZU[n]) : U.t('mit {0} Personen').replace('{0}', n));

  A_('wg-bewerben', (el) => {
    const g = alleGruppen().find((x) => x.id === el.dataset.id);
    if (!g) return;
    ui.dialog({
      titel: 'Gemeinsam bewerben',
      breit: true,
      inhalt: h`<p class="block__unter">Eure Bewerbung geht als <b>eine</b> Anfrage hinaus – nicht als
          ${g.dabei} einzelne. Für die anbietende Seite ist das der Unterschied zwischen
          ${g.dabei} Leuten, die allein nicht zahlen können, und einem vollständigen Haushalt.</p>
        <label class="feld"><span>Eure Nachricht</span>
          <textarea rows="8" id="wg-bewerbung">${U.t('Guten Tag,\n\nwir sind {0} und würden die Wohnung gern gemeinsam nehmen. Wir haben uns über TrimmoTrade gefunden und stellen uns gern persönlich vor.\n\nÜber einen Besichtigungstermin würden wir uns freuen.')
        .replace('{0}', zuWieViel(g.dabei))}</textarea></label>
        <fieldset class="filter__gruppe eckdaten">
          <legend>Das steht automatisch dabei</legend>
          <ul class="eckdaten__liste">
            <li><span>Haushalt</span><b>${g.dabei} ${U.t('Personen als WG')}</b></li>
            <li><span>Beschäftigung</span><b>${(g.mitglieder || []).map((m) => (m.eckdaten || {}).beruf)
        .filter(Boolean).join(', ') || '–'}</b></li>
          </ul>
          <p class="fein">Namen und Adressen der Einzelnen gehen nicht mit. Wer antwortet, entscheidet
            selbst, wem er sie gibt.</p>
        </fieldset>`,
      fuss: h`<button type="button" class="knopf knopf--still" data-tu="dialog-zu">Abbrechen</button>
        <button type="button" class="knopf" data-tu="wg-bewerben-los" data-id="${g.id}">${ico('nachricht')}Bewerbung abschicken</button>`
    });
  });

  A_('wg-bewerben-los', (el) => {
    const text = (U.$('#wg-bewerbung') || {}).value || '';
    ui.knopfArbeit(el, TT.api.ruf('gruppe/bewerben', { id: el.dataset.id, text }).then(() => {
      neuLaden();
      ui.dialogZu();
      if (TT.markt) TT.markt.zaehle('wg-bewerbung');
      ui.toast('Bewerbung abgeschickt. Die anbietende Seite bekommt eine Mail.', 'gut');
    }, (e) => ui.toast((e && e.text) || 'Das ging nicht.', 'schlecht')), 'Wird gesendet …');
  });

  /* Alles, was gerade irgendwo gezeichnet ist – für die Aktionen, die
     eine Gruppe nachschlagen müssen. */
  function alleGruppen() {
    const raus = (W.meine || []).concat(offene || []);
    Object.keys(gruppenZu).forEach((k) => { (gruppenZu[k] || []).forEach((g) => raus.push(g)); });
    return raus;
  }

  function neuLaden() {
    W.vergessen();
    Promise.all([
      W.meineHolen(true),
      W.offeneHolen().then((g) => { offene = g; }),
      ui.aktuell === 'objekt' && ui.params.arg
        ? W.fuerInserat(ui.params.arg, true).then((g) => { gruppenZu[ui.params.arg] = g; })
        : null
    ]).then(() => ui.neuZeichnen());
  }

  TT.viewWg = { objektBlock, objektLaden, karte, rechtsKasten };
  ui.ansichten.wg = wg;
})(window.TT = window.TT || {});
