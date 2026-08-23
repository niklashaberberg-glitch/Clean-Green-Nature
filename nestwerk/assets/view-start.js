/* =====================================================================
   Nestwerk – Ansicht: Start
   Kein Werbebanner, sondern ein Arbeitsplatz: Was ist neu, wo stehst du,
   was ist als Nächstes zu tun.
   ===================================================================== */
(function (NW) {
  'use strict';

  const U = NW.util, ui = NW.ui, A = NW.analyse, S = NW.store, M = NW.match, P = NW.plan;
  const h = U.html, raw = U.raw, ico = U.svg;

  function begruessung() {
    const std = NW.now().getHours();
    return std < 5 ? 'Noch wach' : std < 11 ? 'Guten Morgen' : std < 18 ? 'Guten Tag' : 'Guten Abend';
  }

  /* Was steht an? Aus Terminen, Suchaufträgen, Nachrichten und Profil. */
  function aufgaben() {
    const s = S.get();
    const out = [];

    const offeneTermine = Object.keys(s.merkliste)
      .map((id) => ({ id, e: s.merkliste[id] }))
      .filter((x) => x.e.termin && x.e.termin.datum >= U.isoDate(NW.now()))
      .sort((a, b) => a.e.termin.datum.localeCompare(b.e.termin.datum));
    offeneTermine.slice(0, 2).forEach((x) => {
      const l = NW.data.byId[x.id];
      if (!l) return;
      out.push({
        icon: 'kalender', dringend: U.daysSince(x.e.termin.datum) > -3,
        titel: 'Besichtigung ' + U.dateDE(x.e.termin.datum) + ' um ' + x.e.termin.zeit,
        text: l.titel + ', ' + l.viertel, ziel: 'objekt/' + l.id, knopf: 'Checkliste'
      });
    });

    let neu = 0;
    s.agenten.forEach((a) => { if (a.aktiv) neu += S.agentTreffer(a).neu.length; });
    if (neu) out.push({
      icon: 'glocke', dringend: true, titel: neu + ' neue Treffer in deinen Suchaufträgen',
      text: 'seit dem letzten Blick hinzugekommen', ziel: 'agenten', knopf: 'Ansehen'
    });

    const faellig = S.nachfassFaellig();
    if (faellig.length) out.push({
      icon: 'verlauf', dringend: true,
      titel: faellig.length + ' ' + U.plural(faellig.length, 'Anfrage wartet', 'Anfragen warten') + ' seit Tagen auf Antwort',
      text: 'Die älteste liegt ' + faellig[0].tage + ' Tage – eine kurze Nachfrage kostet nichts.',
      ziel: 'merkliste', knopf: 'Ansehen'
    });

    const ungelesen = U.sum(s.threads.map((t) => t.ungelesen));
    if (ungelesen) out.push({
      icon: 'nachricht', dringend: true, titel: ungelesen + ' ' + U.plural(ungelesen, 'neue Nachricht', 'neue Nachrichten'),
      text: 'Anbieter warten auf eine Antwort', ziel: 'nachrichten', knopf: 'Öffnen'
    });

    if (!s.profilAngelegt) out.push({
      icon: 'person', dringend: false, titel: 'Profil ausfüllen',
      text: 'Erst damit sortiert Nestwerk nach deiner Passung statt nach Zufall.', ziel: 'profil', knopf: 'Ausfüllen'
    });

    const fehlend = Object.keys(s.profil.unterlagen).filter((k) => !s.profil.unterlagen[k] && k !== 'wbs' && k !== 'buergschaft');
    if (s.profilAngelegt && fehlend.length) out.push({
      icon: 'blatt', dringend: false, titel: 'Bewerbermappe unvollständig',
      text: fehlend.length + ' ' + U.plural(fehlend.length, 'Unterlage fehlt', 'Unterlagen fehlen') + ' – wer sie parat hat, ist schneller.',
      ziel: 'profil', knopf: 'Ergänzen'
    });

    if (!s.profil.nettoEinkommen) out.push({
      icon: 'euro', dringend: false, titel: 'Wie viel Miete kannst du tragen?',
      text: 'Zwei Grenzen entscheiden: dein Budget und die Regel, die Vermieter anwenden.',
      ziel: 'leistbarkeit', knopf: 'Ausrechnen'
    });

    if (!s.meinTausch && s.filter.arten.indexOf('tausch') >= 0) out.push({
      icon: 'tausch', dringend: false, titel: 'Tauschangebot fehlt',
      text: 'Ohne eigene Wohnung im Topf findet der Ringtausch dich nicht.', ziel: 'tausch', knopf: 'Anlegen'
    });

    if (s.einzugsdatum) {
      const plan = S.umzugsPlan().filter((a) => !a.erledigt && a.faellig <= U.isoDate(U.addDays(NW.now(), 14)));
      if (plan.length) out.push({
        icon: 'umzug', dringend: true, titel: plan.length + ' ' + U.plural(plan.length, 'Umzugsaufgabe', 'Umzugsaufgaben') + ' in den nächsten 14 Tagen',
        text: plan[0].label, ziel: 'umzug', knopf: 'Plan öffnen'
      });
    }

    return out;
  }

  function pipelineLeiste() {
    const s = S.get();
    const zahlen = {};
    S.PIPELINE.forEach((p) => { zahlen[p.id] = 0; });
    Object.keys(s.merkliste).forEach((id) => {
      const st = s.merkliste[id].status;
      if (zahlen[st] !== undefined) zahlen[st]++;
    });
    const gesamt = U.sum(Object.keys(zahlen).map((k) => zahlen[k]));
    if (!gesamt) return '';
    return h`<section class="block">
      <div class="block__kopfzeile">
        <h2>${ico('waage')}Deine Bewerbungen</h2>
        <a class="link" href="#/merkliste">alle ansehen</a>
      </div>
      <ol class="pipeline">
        ${S.PIPELINE.map((p) => h`<li class="pipeline__stufe pipeline__stufe--${p.farbe}">
          <b>${zahlen[p.id]}</b><span>${p.label}</span></li>`)}
      </ol>
    </section>`;
  }

  function neuesteTreffer() {
    const s = S.get();
    const passend = A.sortieren(
      A.filtern(NW.data.listings, Object.assign({}, s.filter, { sort: 'neu' }), s.profil),
      'neu', s.profil
    ).slice(0, 6);
    return passend;
  }

  function ansicht() {
    const s = S.get();
    const tun = aufgaben();
    const treffer = neuesteTreffer();
    const gesehen = s.gesehen.map((id) => NW.data.byId[id]).filter(Boolean).slice(0, 4);
    const tauschAngebote = NW.data.listings.filter((x) => x.kind === 'tausch');
    const ringZahl = M.ringe(tauschAngebote, { maxLen: 3 }).length;

    return {
      titel: 'Start',
      html: h`<div class="seite">
        <header class="start__kopf">
          <div>
            <h1>${begruessung()}${s.profil.name ? ', ' + s.profil.name.split(' ')[0] : ''}.</h1>
            <p class="seite__unter">Mietwohnungen, Eigentum, WG-Zimmer und Wohnungstausch – eine Suche, ein Profil,
              eine Bewerbermappe.</p>
          </div>
          <div class="start__suchfeld">
            <button type="button" class="grosseSuche" data-tu="palette">
              ${ico('lupe')}<span>Stadt, Viertel oder Stichwort suchen</span><kbd>Strg</kbd><kbd>K</kbd>
            </button>
            <div class="start__schnell">
              ${['Köln', 'Berlin', 'Hamburg', 'Leipzig', 'München'].map((c) =>
        h`<a class="chip" href="#/suche?stadt=${encodeURIComponent(c)}">${c}</a>`)}
            </div>
          </div>
        </header>

        ${!P.gruender().nummer && P.gruenderFrei() ? h`<section class="gruender gruender--schmal">
          <div class="gruender__marke">${ico('stern')}Gründerplätze</div>
          <h2>Die ersten ${U.num(P.GRUENDER.plaetze)} bekommen Plus ein Jahr geschenkt</h2>
          <p>Noch <b>${U.num(P.gruenderFrei())}</b> ${U.plural(P.gruenderFrei(), 'Platz', 'Plätze')} frei.
            Kein Abo, keine Zahlungsdaten, keine Verlängerung – nach zwölf Monaten endet der Platz von selbst.</p>
          <p class="werkzeug__weiter">
            <a class="knopf" href="#/plus">${ico('stern')}Platz sichern</a>
            <a class="link" href="#/plus">was Plus enthält</a></p>
        </section>` : ''}

        ${tun.length ? h`<section class="block block--betont">
          <h2>${ico('check')}Als Nächstes</h2>
          <ul class="aufgaben">
            ${tun.map((a) => h`<li class="${a.dringend ? 'is-dringend' : ''}">
              ${ico(a.icon)}
              <div><b>${a.titel}</b><span>${a.text}</span></div>
              <a class="knopf knopf--klein knopf--still" href="#/${a.ziel}">${a.knopf}</a>
            </li>`)}
          </ul>
        </section>` : ''}

        ${pipelineLeiste()}

        <section class="block">
          <div class="block__kopfzeile">
            <h2>${ico('blitz')}Neu und passend</h2>
            <a class="link" href="#/suche">zur vollen Suche</a>
          </div>
          ${treffer.length ? h`<div class="ergebnisse__liste ergebnisse__liste--drei">
            ${treffer.map((x) => ui.inseratsKarte(x.l, x.b, { kompakt: true }))}
          </div>` : h`<p class="info-meldung">${ico('info')}Deine Filter lassen aktuell nichts durch.
            <a href="#/suche">In der Suche anpassen</a></p>`}
        </section>

        <section class="block">
          <h2>${ico('ring')}Was Nestwerk anders macht</h2>
          <div class="vorteile">
            <article><span class="vorteile__zeichen">${ico('ring')}</span>
              <b>Ringtausch statt Sackgasse</b>
              <p>Der direkte Wohnungstausch scheitert am doppelten Zufall. Nestwerk sucht Ketten über mehrere
                Haushalte – gerade sind ${ringZahl} Dreierketten offen.</p>
              <button type="button" class="link" data-tu="ring-erklaeren">in vier Bildern erklärt</button>
              <a class="link" href="#/tausch">Ketten ansehen</a></article>
            <article><span class="vorteile__zeichen">${ico('waage')}</span>
              <b>Preis mit Vergleichswert</b>
              <p>Jedes Inserat wird gegen die ortsübliche Vergleichsmiete gestellt – samt Hinweis, wo die
                Mietpreisbremse greifen könnte.</p></article>
            <article><span class="vorteile__zeichen">${ico('blatt')}</span>
              <b>Vertragslupe</b>
              <p>Staffelmiete, Schönheitsreparaturen, Abstandszahlung, Kaution über drei Mieten: Nestwerk liest
                den Text und erklärt, was das bedeutet.</p></article>
            <article><span class="vorteile__zeichen">${ico('warnung')}</span>
              <b>Betrugsmuster erkennen</b>
              <p>Zu billig, Anbieter angeblich im Ausland, keine Besichtigung, Kaution vorab – die typischen
                Muster werden markiert statt versteckt.</p></article>
            <article><span class="vorteile__zeichen">${ico('rechner')}</span>
              <b>Echte Monatskosten</b>
              <p>Warmmiete plus Strom, Internet, Rundfunkbeitrag – und was der Einzug einmalig kostet,
                inklusive Kaution und Küche.</p></article>
            <article><span class="vorteile__zeichen">${ico('ziel')}</span>
              <b>Reihenfolge ohne Bezahlung</b>
              <p>Sortiert wird nach deinem Profil. Es gibt keine gekauften Plätze, und die Bewertung legt offen,
                warum etwas oben steht. Auch Plus kauft keinen Platz weiter oben.</p></article>
            <article><span class="vorteile__zeichen">${ico('kopieren')}</span>
              <b>Doppelte Inserate erkennen</b>
              <p>Dieselbe Wohnung steht oft zweimal im Angebot, von zwei Maklern. Nestwerk merkt das und sagt es,
                bevor du dich zweimal bewirbst.</p></article>
            <article><span class="vorteile__zeichen">${ico('werkzeug')}</span>
              <b>Auch nach dem Einzug</b>
              <p>Übergabeprotokoll, Umzugsplan und die Prüfung der Nebenkostenabrechnung – die Werkzeuge hören
                nicht auf, wenn der Vertrag unterschrieben ist.</p></article>
          </div>
        </section>

        <section class="block">
          <div class="block__kopfzeile">
            <h2>${ico('werkzeug')}Werkzeuge</h2>
            <a class="link" href="#/werkzeuge">alle ansehen</a>
          </div>
          <p class="block__unter">Rechnen und prüfen – von der ersten Frage „was kann ich mir leisten“ bis zur
            Nebenkostenabrechnung zwei Jahre später.</p>
          <div class="werkzeuge werkzeuge--klein">
            ${NW.viewWerkzeuge.KATALOG.slice(0, 4).map((k) => h`<a class="werkzeugkachel" href="#/${k.route}">
              <span class="werkzeugkachel__zeichen">${ico(k.icon)}</span>
              <b>${k.name}${k.plus ? ui.badge('Plus', 'info') : ''}</b>
              <p>${U.truncate(k.text, 90)}</p>
            </a>`)}
          </div>
        </section>

        ${!P.istPlus() ? ui.anzeige('start', 'breit') : ''}

        ${gesehen.length ? h`<section class="block">
          <div class="block__kopfzeile"><h2>${ico('verlauf')}Zuletzt angesehen</h2></div>
          <div class="ergebnisse__liste ergebnisse__liste--vier">
            ${gesehen.map((x) => ui.inseratsKarte(x, A.bewerten(x, s.profil), { kompakt: true }))}
          </div>
        </section>` : ''}
      </div>`
    };
  }

  ui.ansichten.start = ansicht;
})(window.NW = window.NW || {});
