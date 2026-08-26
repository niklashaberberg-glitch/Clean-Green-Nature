/* =====================================================================
   TrimmoTrade – Ansichten: Merkliste, Vergleich, Suchaufträge,
   Nachrichten und Umzugsplan.
   ===================================================================== */
(function (TT) {
  'use strict';

  const U = TT.util, ui = TT.ui, A = TT.analyse, S = TT.store, P = TT.plan, W = TT.werkzeuge;
  const h = U.html, raw = U.raw, ico = U.svg;

  /* ================================================================
     Merkliste als Bewerbungstafel
     ================================================================ */

  function merkKarte(id, eintrag) {
    const l = TT.data.byId[id];
    if (!l) return '';
    const b = A.bewerten(l, S.get().profil);
    return h`<article class="merkkarte" data-id="${id}">
      <a class="merkkarte__bild" href="#/objekt/${id}" aria-hidden="true" tabindex="-1">${raw(TT.img.make(l, 0))}</a>
      <div class="merkkarte__text">
        <b><a href="#/objekt/${id}">${U.truncate(l.titel, 52)}</a></b>
        <span>${l.viertel}, ${l.stadt} · ${l.kind === 'kauf' ? U.eur(l.kaufpreis) : U.eur(l.warm) + ' warm'}</span>
        ${eintrag.termin ? h`<i class="merkkarte__termin">${ico('kalender')}${U.dateDE(eintrag.termin.datum)}, ${eintrag.termin.zeit}</i>` : ''}
        ${eintrag.notiz ? h`<p class="merkkarte__notiz">${U.truncate(eintrag.notiz, 120)}</p>` : ''}
      </div>
      <div class="merkkarte__fuss">
        <span class="merkkarte__passung">${b.score} %</span>
        <label class="nur-sr" for="st-${id}">Status</label>
        <select id="st-${id}" data-tu-change="status-setzen" data-id="${id}">
          ${S.PIPELINE.map((p) => h`<option value="${p.id}" ${eintrag.status === p.id ? 'selected' : ''}>${p.label}</option>`)}
        </select>
        <button type="button" class="ikon-btn" data-tu="merken" data-id="${id}" title="Entfernen">${ico('muell')}</button>
      </div>
    </article>`;
  }

  function merkliste() {
    const s = S.get();
    const ids = Object.keys(s.merkliste);
    if (!ids.length) {
      return {
        titel: 'Merkliste',
        html: h`<div class="seite seite--schmal">
          <header class="seite__kopf"><h1>${ico('herz')}Merkliste</h1></header>
          <div class="leer">${ico('herz')}
            <h2>Noch nichts gemerkt</h2>
            <p>Klick bei einem Inserat auf das Herz. Hier entsteht daraus eine Tafel, die deine Bewerbungen
              von „gemerkt“ bis „Zusage“ begleitet.</p>
            <p><a class="knopf" href="#/suche">${ico('suche')}Zur Suche</a></p></div>
        </div>`
      };
    }

    const spalten = S.PIPELINE.map((p) => ({
      p, eintraege: ids.filter((id) => s.merkliste[id].status === p.id)
    }));
    const faellig = S.nachfassFaellig();
    const termine = ids.map((id) => {
      const e = s.merkliste[id];
      if (!e.termin) return null;
      const l = TT.data.byId[id];
      if (!l) return null;
      return { id, datum: e.termin.datum, zeit: e.termin.zeit, listing: l, titel: l.titel };
    }).filter(Boolean).sort((a, b) => (a.datum + a.zeit).localeCompare(b.datum + b.zeit));
    const gesamt = ids.length;
    const beworben = ids.filter((id) => ['kontakt', 'termin', 'unterlagen', 'zusage'].indexOf(s.merkliste[id].status) >= 0).length;
    const zusagen = ids.filter((id) => s.merkliste[id].status === 'zusage').length;
    const absagen = ids.filter((id) => s.merkliste[id].status === 'absage').length;
    const quote = beworben + absagen > 0 ? Math.round(zusagen / (beworben + absagen) * 100) : 0;

    return {
      titel: 'Merkliste',
      html: h`<div class="seite">
        <header class="seite__kopf">
          <h1>${ico('herz')}Merkliste und Bewerbungen</h1>
          <p class="seite__unter">Alles, was du im Blick hast – vom ersten Merken bis zur Zusage.</p>
        </header>

        <div class="kennzahlen kennzahlen--vier">
          <div><b>${gesamt}</b><span>Objekte insgesamt</span></div>
          <div><b>${beworben}</b><span>in Bearbeitung</span></div>
          <div><b>${zusagen}</b><span>Zusagen</span></div>
          <div><b>${quote} %</b><span>Erfolgsquote</span></div>
        </div>

        ${faellig.length ? h`<section class="block ${P.darf('nachfassen') ? 'block--betont' : ''}">
          <h2>${ico('verlauf')}Nachfassen</h2>
          ${P.darf('nachfassen')
        ? h`<p class="block__unter">Angeschrieben, keine Antwort. Eine freundliche Nachfrage nach ein paar Tagen
              bringt erfahrungsgemäß mehr als jede zweite ausbleibende Antwort erwarten lässt.</p>
            <ul class="nachfass">
              ${faellig.map((f) => h`<li>
                ${ico('nachricht')}
                <div><b><a href="#/objekt/${f.id}">${U.truncate(f.listing.titel, 46)}</a></b>
                  <span>seit ${f.tage} Tagen ohne Antwort · ${f.listing.anbieter.name}</span></div>
                <button type="button" class="knopf knopf--klein" data-tu="nachfassen" data-id="${f.id}">Nachricht öffnen</button>
              </li>`)}
            </ul>`
        : h`<p class="block__unter">${faellig.length} deiner Anfragen ${U.plural(faellig.length, 'ist', 'sind')}
              seit mehreren Tagen unbeantwortet.</p>
            ${ui.sperrHinweis('nachfassen', 'Mit Plus sagt TrimmoTrade dir, welche Anfrage wie lange liegt, und '
          + 'formuliert die Nachfrage vor. Ohne Plus musst du selbst mitzählen.')}`}
        </section>` : ''}

        ${termine.length > 1 ? h`<section class="block">
          <h2>${ico('route')}Besichtigungen ordnen</h2>
          ${P.darf('tagesplan') ? tagesplanBlock(termine) : h`
            <p class="block__unter">Du hast ${termine.length} Besichtigungstermine.</p>
            ${ui.sperrHinweis('tagesplan', 'Mit Plus ordnet TrimmoTrade deine Termine zu einer Route, rechnet die '
        + 'Fahrzeiten dazwischen und warnt, wenn zwei Termine zeitlich nicht zusammenpassen.')}`}
        </section>` : ''}

        ${P.darf('serienbewerbung') && ids.filter((id) => s.merkliste[id].status === 'gemerkt').length > 1
        ? h`<section class="block">
          <h2>${ico('nachricht')}Serienbewerbung</h2>
          <p class="block__unter">${U.t('{0} Objekte stehen auf „gemerkt“. TrimmoTrade schreibt für jedes ein '
            + 'eigenes Anschreiben aus deinem Profil – angepasst an Titel, Lage und Preis, nicht als Rundmail.')
            .replace('{0}', ids.filter((id) => s.merkliste[id].status === 'gemerkt').length)}</p>
          <button type="button" class="knopf" data-tu="serie">${ico('nachricht')}Anschreiben vorbereiten</button>
        </section>` : ''}

        <div class="tafel">
          ${spalten.map((sp) => h`<section class="tafel__spalte" aria-label="${sp.p.label}">
            <header class="tafel__kopf tafel__kopf--${sp.p.farbe}">
              <b>${sp.p.label}</b><span>${sp.eintraege.length}</span>
            </header>
            <div class="tafel__karten">
              ${sp.eintraege.length ? sp.eintraege.map((id) => merkKarte(id, s.merkliste[id]))
        : h`<p class="tafel__leer">leer</p>`}
            </div>
          </section>`)}
        </div>

        ${!P.istPlus() ? ui.anzeige('merkliste', 'breit') : ''}

        <p class="fein">Der Status lässt sich in jeder Karte umstellen. TrimmoTrade zählt daraus deine Erfolgsquote –
          nützlich, um zu merken, ob die Suche zu eng oder das Anschreiben zu blass ist.</p>
      </div>`
    };
  }

  function tagesplanBlock(termine) {
    const nachTag = {};
    termine.forEach((t) => { (nachTag[t.datum] = nachTag[t.datum] || []).push(t); });
    const tage = Object.keys(nachTag).sort();
    return h`<p class="block__unter">Nach kürzestem Weg geordnet. Wo zwei Termine zeitlich nicht zusammenpassen,
        steht es dabei.</p>
      ${tage.map((tag) => {
      const plan = W.tagesplan(nachTag[tag]);
      return h`<div class="tagesplan">
          <h3>${U.dateDE(tag)}${plan.gesamtMinuten ? h` <i>${U.minutesLabel(plan.gesamtMinuten)} unterwegs</i>` : ''}</h3>
          <ol class="tagesplan__liste">
            ${plan.reihenfolge.map((r, i) => h`<li>
              <span class="tagesplan__zeit">${r.termin.zeit}</span>
              <div>
                <b><a href="#/objekt/${r.termin.id}">${U.truncate(r.termin.titel, 42)}</a></b>
                <span>${r.termin.listing.viertel}, ${r.termin.listing.stadt}</span>
              </div>
              ${i ? h`<i class="tagesplan__fahrt">${ico('zug')}${U.minutesLabel(r.fahrtMinuten)}</i>` : ''}
            </li>`)}
          </ol>
          ${plan.konflikte.map((k) => h`<p class="warn-meldung">${ico('warnung')}
            Zwischen ${k.a.zeit} und ${k.b.zeit} fehlen rund ${k.fehlt} Minuten. Verschieb einen der beiden Termine.</p>`)}
        </div>`;
    })}
      <p class="fein">Fahrzeiten mit öffentlichen Verkehrsmitteln geschätzt, 30 Minuten je Besichtigung eingerechnet.</p>`;
  }

  /* ================================================================
     Vergleich
     ================================================================ */

  function vergleich() {
    const s = S.get();
    const objekte = s.vergleich.map((id) => TT.data.byId[id]).filter(Boolean);
    if (!objekte.length) {
      return {
        titel: 'Vergleich',
        html: h`<div class="seite seite--schmal">
          <header class="seite__kopf"><h1>${ico('waage')}Vergleich</h1></header>
          <div class="leer">${ico('waage')}
            <h2>Noch nichts im Vergleich</h2>
            <p>Bis zu ${S.maxVergleich()} Objekte lassen sich nebeneinanderstellen – mit echten Monatskosten,
              Vergleichsmiete und Passung in einer Tabelle.</p>
            <p><a class="knopf" href="#/suche">${ico('suche')}Objekte suchen</a></p></div>
        </div>`
      };
    }

    const daten = objekte.map((l) => ({
      l, b: A.bewerten(l, s.profil), k: A.kosten(l, s.profil)
    }));

    /* Zeilen mit Angabe, welche Richtung besser ist. */
    const zeilen = [
      { label: 'Passung', wert: (d) => d.b.score + ' %', zahl: (d) => d.b.score, hoch: true },
      { label: 'Preis', wert: (d) => d.l.kind === 'kauf' ? U.eur(d.l.kaufpreis) : U.eur(d.l.warm) + ' warm', zahl: (d) => d.l.kind === 'kauf' ? d.l.kaufpreis : d.l.warm, hoch: false },
      { label: 'Echte Monatskosten', wert: (d) => U.eur(d.k.monatSumme), zahl: (d) => d.k.monatSumme, hoch: false },
      { label: 'Einmalig beim Einzug', wert: (d) => U.eur(d.k.einmalSumme), zahl: (d) => d.k.einmalSumme, hoch: false },
      { label: 'Erstes Jahr insgesamt', wert: (d) => U.eur(d.k.erstesJahr), zahl: (d) => d.k.erstesJahr, hoch: false },
      { label: 'Belastungsquote', wert: (d) => d.k.quote ? d.k.quote + ' %' : '–', zahl: (d) => d.k.quote || 999, hoch: false },
      { label: 'Preis je m²', wert: (d) => d.l.kind === 'kauf' ? U.num(Math.round(d.l.kaufpreis / d.l.flaeche)) + ' €' : U.dec(d.l.kalt / d.l.flaeche) + ' €', zahl: (d) => d.l.kind === 'kauf' ? d.l.kaufpreis / d.l.flaeche : d.l.kalt / d.l.flaeche, hoch: false },
      { label: 'Zur Vergleichsmiete', wert: (d) => d.b.mietCheck ? (d.b.mietCheck.diff >= 0 ? '+' : '') + d.b.mietCheck.diff + ' %' : d.b.kaufCheck ? (d.b.kaufCheck.diff >= 0 ? '+' : '') + d.b.kaufCheck.diff + ' %' : '–', zahl: (d) => d.b.mietCheck ? d.b.mietCheck.diff : d.b.kaufCheck ? d.b.kaufCheck.diff : 0, hoch: false },
      { label: 'Zimmer', wert: (d) => U.dec(d.l.zimmer), zahl: (d) => d.l.zimmer, hoch: true },
      { label: 'Fläche', wert: (d) => d.l.flaeche + ' m²', zahl: (d) => d.l.flaeche, hoch: true },
      { label: 'Baujahr', wert: (d) => String(d.l.baujahr) + (d.l.saniert ? ' (san.)' : ''), zahl: (d) => d.l.baujahr, hoch: true },
      { label: 'Energie', wert: (d) => d.l.energie ? d.l.energie.klasse + ' · ' + d.l.energie.kwh + ' kWh' : 'entfällt',
        zahl: (d) => d.l.energie ? -A.ENERGIE_RANG[d.l.energie.klasse] : -99, hoch: true },
      { label: 'Heizung', wert: (d) => d.l.energie ? d.l.energie.heizung : 'entfällt' },
      { label: 'Etage', wert: (d) => U.t('{0} von {1}')
        .replace('{0}', d.l.etage === 0 ? U.t('EG') : d.l.etage >= d.l.etagen ? U.t('DG')
          : U.t('{0}. OG').replace('{0}', d.l.etage)).replace('{1}', d.l.etagen) },
      { label: 'Kaution', wert: (d) => d.l.kind === 'kauf' ? '–' : d.l.kaution ? U.eur(d.l.kalt * d.l.kaution) : 'keine', zahl: (d) => d.l.kalt * d.l.kaution, hoch: false },
      { label: 'Provision', wert: (d) => d.l.provision ? U.dec(d.l.provision) + (d.l.kind === 'kauf' ? ' %' : ' KM') : 'frei', zahl: (d) => d.l.provision, hoch: false },
      { label: 'Arbeitsweg', wert: (d) => d.b.pendel ? U.minutesLabel(d.b.pendel.min) : '–', zahl: (d) => d.b.pendel ? d.b.pendel.min : 999, hoch: false },
      { label: 'Frei ab', wert: (d) => U.daysSince(d.l.freiAb) > 0 ? 'sofort' : U.dateDE(d.l.freiAb) },
      { label: 'Interessenten', wert: (d) => String(d.l.stats.bewerber), zahl: (d) => d.l.stats.bewerber, hoch: false },
      { label: 'Anbieter antwortet', wert: (d) => d.l.anbieter.quote + ' %', zahl: (d) => d.l.anbieter.quote, hoch: true },
      { label: 'Prüfhinweis', wert: (d) => d.b.risiko.stufe === 'ok' ? 'unauffällig' : d.b.risiko.stufe === 'achtung' ? 'genau lesen' : 'Warnung', zahl: (d) => -d.b.risiko.punkte, hoch: true },
      { label: 'Auffällige Klauseln', wert: (d) => { const f = A.klauselCheck(d.l); return f.length ? f.length + ' (' + f[0].titel + ')' : 'keine'; }, zahl: (d) => -A.klauselCheck(d.l).length, hoch: true }
    ];

    /* Ausstattung: alle vorkommenden Merkmale nebeneinander. */
    const alleMerkmale = U.uniq(objekte.reduce((a, l) => a.concat(l.ausstattung), [])).sort();

    return {
      titel: 'Vergleich',
      html: h`<div class="seite">
        <header class="seite__kopf">
          <h1>${ico('waage')}Vergleich</h1>
          <p class="seite__unter">${objekte.length} von ${S.maxVergleich()} Plätzen belegt. Der jeweils beste Wert je Zeile ist hervorgehoben.
            ${!P.istPlus() ? raw('<a href="#/plus">Mit Plus sind es sechs.</a>') : ''}</p>
        </header>
        <div class="vergleich__rolle">
          <table class="vergleich">
            <thead>
              <tr>
                <th scope="col" class="vergleich__ecke">Merkmal</th>
                ${daten.map((d) => h`<th scope="col">
                  <a class="vergleich__kopf" href="#/objekt/${d.l.id}">
                    <span class="vergleich__bild">${raw(TT.img.make(d.l, 0))}</span>
                    <b>${U.truncate(d.l.titel, 40)}</b>
                    <i>${d.l.viertel}, ${d.l.stadt}</i>
                  </a>
                  <button type="button" class="link" data-tu="vergleich" data-id="${d.l.id}">entfernen</button>
                </th>`)}
              </tr>
            </thead>
            <tbody>
              ${zeilen.map((z) => {
        let bestIdx = -1;
        if (z.zahl) {
          const werte = daten.map(z.zahl);
          const best = z.hoch ? Math.max.apply(null, werte) : Math.min.apply(null, werte);
          if (werte.filter((w) => w === best).length < werte.length) bestIdx = werte.indexOf(best);
        }
        return h`<tr><th scope="row">${z.label}</th>
                  ${daten.map((d, i) => h`<td class="${i === bestIdx ? 'is-best' : ''}">${z.wert(d)}</td>`)}
                </tr>`;
      })}
              <tr class="vergleich__trenner"><th scope="row" colspan="${daten.length + 1}">Ausstattung</th></tr>
              ${alleMerkmale.map((m) => h`<tr><th scope="row">${m}</th>
                ${daten.map((d) => h`<td>${d.l.ausstattung.indexOf(m) >= 0 ? ui.ico('check') : raw('<span class="fehlt">–</span>')}</td>`)}
              </tr>`)}
            </tbody>
          </table>
        </div>
        <p><button type="button" class="knopf knopf--still" data-tu="vergleich-kopieren">${ico('kopieren')}Vergleich als Text kopieren</button></p>
      </div>`
    };
  }

  /* ================================================================
     Suchaufträge
     ================================================================ */

  /* ==================================================================
     Suchauftrag per Mail

     Der Suchauftrag im Browser zeigt beim nächsten Besuch, was neu ist.
     Das ist nützlich – und es setzt voraus, dass jemand vorbeikommt.
     Wohnungssuche besteht aber aus Warten: Man sucht zwei Wochen
     täglich und hört dann auf. Was zurückholt, ist eine Mail mit einer
     Wohnung, die passt, bevor dreihundert andere sie gesehen haben.

     Deshalb hat jeder Suchauftrag hier einen zweiten Schalter. Er legt
     denselben Filter noch einmal auf dem Server an – nur die Felder,
     die der Server auch prüfen kann. Alles Übrige (Ausstattung,
     Pendelzeit, WG-Merkmale) rechnet der Browser aus dem Profil, und
     das kennt der Server nicht und soll es nicht kennen.

     Die Folge davon ist ehrlich zu benennen: Die Mail meldet etwas
     mehr, als die Suche im Browser zeigen würde. Lieber ein Treffer zu
     viel in der Mail als eine Wohnung, die nie ankommt.
     ================================================================== */
  function serverFilter(f) {
    const raus = {};
    if (f.arten && f.arten.length === 1) raus.art = f.arten[0];
    if (f.staedte && f.staedte.length === 1) raus.stadt = f.staedte[0];
    if (f.viertel && f.viertel.length === 1) raus.viertelKey = f.viertel[0];
    ['zimmerMin', 'zimmerMax', 'flaecheMin', 'flaecheMax'].forEach((k) => {
      if (f[k] !== null && f[k] !== undefined && f[k] !== '') raus[k] = Number(f[k]);
    });
    if (f.preisMax) {
      /* Ein Preisfeld, zwei Bedeutungen: bei Miete die Warmmiete, beim
         Kauf der Kaufpreis. Beide zu setzen wäre falsch – dann fiele
         jede Mietwohnung durch die Kaufpreisgrenze. */
      if (raus.art === 'kauf') raus.preisMax = Number(f.preisMax);
      else raus.warmMax = Number(f.preisMax);
    }
    return raus;
  }

  /* Was die Mail mehr meldet als die Suche – in Worten, nicht als
     Fußnote. */
  function mailUnschaerfe(f) {
    const weg = [];
    if (f.arten && f.arten.length > 1) weg.push('mehrere Angebotsarten');
    if (f.staedte && f.staedte.length > 1) weg.push('mehrere Städte');
    if (f.viertel && f.viertel.length > 1) weg.push('einzelne Viertel');
    if (f.ausstattung && f.ausstattung.length) weg.push('Ausstattung');
    if (f.maxPendel) weg.push('Pendelzeit');
    if (f.energieMax) weg.push('Energieklasse');
    if (f.baujahrMin) weg.push('Baujahr');
    if (f.wgArt && f.wgArt.length) weg.push('WG-Merkmale');
    return weg;
  }

  let mailAuftraege = null;   // vom Server, Kennung des lokalen Auftrags im Namen

  function mailAuftraegeHolen() {
    if (!amServer()) return Promise.resolve([]);
    return TT.api.ruf('auftrag/meine').then((d) => {
      mailAuftraege = d.auftraege || [];
      return mailAuftraege;
    }, () => { mailAuftraege = []; return mailAuftraege; });
  }

  const mailAuftragZu = (a) => (mailAuftraege || []).find((x) => x.name === a.name);

  function mailSchalter(a) {
    if (!amServer()) {
      return h`<span class="fein agent__mail agent__mail--aus">${ico('nachricht')}Mail-Benachrichtigung
        braucht ein Konto auf trimmotrade.de.</span>`;
    }
    const da = mailAuftragZu(a);
    const unschaerfe = mailUnschaerfe(a.filter);
    return h`<div class="agent__mail">
      <label class="schalter schalter--klein">
        <input type="checkbox" data-tu-change="agent-mail" data-id="${a.id}" ${da ? 'checked' : ''}>
        <span>${ico('nachricht')}per Mail melden</span></label>
      ${da ? h`<span class="fein">${da.takt === 'sofort' ? 'stündlich' : da.takt === 'woechentlich'
        ? 'wöchentlich' : 'täglich'}${da.gesendet ? ' · zuletzt ' + U.since(new Date(da.gesendet * 1000).toISOString().slice(0, 10)) : ''}</span>`
        : ''}
      ${da && unschaerfe.length ? h`<p class="fein">Die Mail kann nicht alles: ${unschaerfe.join(', ')}
        ${unschaerfe.length === 1 ? 'bleibt' : 'bleiben'} beim Verschicken unberücksichtigt. Lieber ein
        Treffer zu viel in der Mail als eine Wohnung, die dich nie erreicht.</p>` : ''}
    </div>`;
  }

  function agenten() {
    const s = S.get();

    if (amServer() && mailAuftraege === null) {
      mailAuftraege = [];
      mailAuftraegeHolen().then(() => {
        if (ui.aktuell === 'agenten') ui.neuZeichnen();
      });
    }
    if (!s.agenten.length) {
      return {
        titel: 'Suchaufträge',
        html: h`<div class="seite seite--schmal">
          <header class="seite__kopf"><h1>${ico('glocke')}Suchaufträge</h1></header>
          <div class="leer">${ico('glocke')}
            <h2>Kein Suchauftrag angelegt</h2>
            <p>Stell in der Suche deine Filter ein und speichere sie. TrimmoTrade zeigt dir dann bei jedem Besuch,
              was seither neu dazugekommen ist – über alle vier Angebotsarten hinweg.</p>
            <p><a class="knopf" href="#/suche">${ico('suche')}Filter einstellen</a></p></div>
        </div>`
      };
    }

    return {
      titel: 'Suchaufträge',
      html: h`<div class="seite seite--schmal">
        <header class="seite__kopf">
          <h1>${ico('glocke')}Suchaufträge</h1>
          <p class="seite__unter">Gespeicherte Filter. Was seit dem letzten Öffnen dazugekommen ist, steht oben.
            ${P.grenze('suchauftraege') === Infinity
        ? 'Mit Plus kannst du beliebig viele anlegen.'
        : s.agenten.length + ' von ' + P.grenze('suchauftraege') + ' im freien Tarif belegt.'}</p>
        </header>
        ${!P.istPlus() ? h`<div class="block">
          ${ui.sperrHinweis('suchauftraege', 'Wer in mehreren Städten oder Preisklassen sucht, braucht mehr als '
        + 'einen Auftrag. Mit Plus sind es beliebig viele – alle mit sofortiger Meldung.')}
        </div>` : ''}
        ${s.agenten.map((a) => {
        const t = S.agentTreffer(a);
        return h`<section class="agent ${a.aktiv ? '' : 'is-aus'}">
            <header class="agent__kopf">
              <div>
                <h2>${a.name}</h2>
                <p>${beschreibeFilter(a.filter)}</p>
              </div>
              <div class="agent__zahlen">
                <b class="${t.neu.length ? 'is-neu' : ''}">${t.neu.length}</b><span>neu</span>
                <b>${t.alle.length}</b><span>gesamt</span>
              </div>
            </header>
            ${t.neu.length ? h`<div class="ergebnisse__liste ergebnisse__liste--drei">
              ${t.neu.slice(0, 3).map((l) => ui.inseratsKarte(l, A.bewerten(l, s.profil), { kompakt: true }))}
            </div>` : h`<p class="agent__leer">Seit ${U.since(a.zuletztGeprueft)} nichts Neues.</p>`}
            <footer class="agent__fuss">
              <button type="button" class="knopf knopf--klein" data-tu="agent-oeffnen" data-id="${a.id}">${ico('suche')}In der Suche öffnen</button>
              ${t.neu.length ? h`<button type="button" class="knopf knopf--klein knopf--still" data-tu="agent-gelesen" data-id="${a.id}">${ico('check')}Als gesehen markieren</button>` : ''}
              <label class="schalter schalter--klein">
                <input type="checkbox" data-tu-change="agent-aktiv" data-id="${a.id}" ${a.aktiv ? 'checked' : ''}>
                <span>aktiv</span></label>
              <button type="button" class="link" data-tu="agent-weg" data-id="${a.id}">löschen</button>
            </footer>
            ${mailSchalter(a)}
          </section>`;
      })}
      </div>`
    };
  }

  function beschreibeFilter(f) {
    const teile = [];
    teile.push(f.arten.map((a) => ui.ART_LABEL[a]).join(' + '));
    if (f.staedte.length) teile.push(f.staedte.join(', '));
    if (f.viertel.length) teile.push(f.viertel.map((v) => v.split('|')[1]).join(', '));
    if (f.preisMax) teile.push('bis ' + U.eur(f.preisMax));
    if (f.zimmerMin) teile.push(U.t('ab {0} Zi.').replace('{0}', U.dec(f.zimmerMin)));
    if (f.flaecheMin) teile.push('ab ' + f.flaecheMin + ' m²');
    if (f.ausstattung.length) teile.push(f.ausstattung.join(', '));
    if (f.provisionsfrei) teile.push('provisionsfrei');
    if (f.maxPendel) teile.push('höchstens ' + f.maxPendel + ' Min. Weg');
    return teile.join(' · ');
  }

  /* ================================================================
     Nachrichten
     ================================================================ */

  /* ---------------------- Anfragen zu eigenen Inseraten ----------------------

     Hier wird sichtbar, was auf der Preisseite behauptet wird: Anfragen
     mit Plus stehen oben. Damit das kein blindes Versprechen bleibt,
     steht daneben, warum – und zwar für die anbietende Seite lesbar. */

  /* ==================================================================
     Das echte Postfach

     Hier landet, was wirklich geschrieben wurde. Der Unterschied zum
     Block darunter ist kein technischer: Dort stehen Beispielanfragen
     einer Vorführung, hier stehen Menschen, die auf eine Antwort warten.

     Deshalb steht in jeder Zeile die Adresse und die Telefonnummer, wenn
     jemand sie mitgeschickt hat, und deshalb gibt es den Zustand
     „beantwortet“. Ein Postfach ohne Zustand ist nach zwanzig Anfragen
     ein Haufen: Man weiß nicht mehr, wem man geschrieben hat, und
     antwortet zweimal oder gar nicht.
     ================================================================== */
  let postfach = null;   // null = noch nicht geholt

  const amServer = () => !!(TT.api && TT.api.da && TT.konto && TT.konto.angemeldet());

  function postfachHolen() {
    if (!amServer()) return Promise.resolve(null);
    return TT.api.ruf('anfrage/postfach').then((d) => {
      postfach = { eingang: d.eingang || [], ausgang: d.ausgang || [] };
      return postfach;
    }, () => {
      postfach = { eingang: [], ausgang: [], fehler: true };
      return postfach;
    });
  }

  const ANFRAGE_STAND = [
    ['neu', 'neu'], ['gelesen', 'gelesen'], ['beantwortet', 'beantwortet'], ['abgelehnt', 'abgesagt']
  ];

  const ECK_WORT = {
    haushalt: 'Haushalt', einzug: 'Einzug ab', beschaeftigung: 'Beschäftigung',
    einkommen: 'Einkommen', haustiere: 'Haustiere', raucher: 'Rauchen',
    wbs: 'Wohnberechtigungsschein', buergschaft: 'Bürgschaft'
  };

  function echtesPostfach() {
    if (!amServer() || !postfach) return '';
    const ein = postfach.eingang || [];
    const aus = postfach.ausgang || [];
    if (!ein.length && !aus.length) return '';

    return h`<section class="block">
      <div class="block__kopfzeile">
        <h2>${ico('nachricht')}Echte Anfragen</h2>
        <span class="fein">${ein.length} ${U.plural(ein.length, 'eingegangen', 'eingegangen')} ·
          ${aus.length} ${U.plural(aus.length, 'geschrieben', 'geschrieben')}</span>
      </div>

      ${ein.length ? h`<h3 class="anfragen__ueber">An deine Inserate</h3>
        <ol class="anfragen__liste anfragen__liste--echt">
          ${ein.map((a) => h`<li class="stand-${a.stand}">
            ${raw(TT.img.avatar(a.name || '?', 34))}
            <div>
              <b>${a.name || 'ohne Namen'}
                ${a.stand === 'neu' ? ui.badge('neu', 'gut') : ''}
                ${a.stand === 'weg' ? ui.badge('Inserat gelöscht', 'neutral') : ''}</b>
              <span class="anfragen__zu"><a href="#/objekt/${a.inserat}">${U.truncate(a.titel || '', 44)}</a>
                · ${U.since(new Date(a.angelegt * 1000).toISOString().slice(0, 10))}</span>
              ${Object.keys(a.eckdaten || {}).length ? h`<ul class="anfragen__eck">
                ${Object.keys(a.eckdaten).map((k) => h`<li><span>${ECK_WORT[k] || k}</span> ${a.eckdaten[k]}</li>`)}
              </ul>` : ''}
              <p class="anfragen__text">${a.text}</p>
              <p class="anfragen__weg">
                ${a.mail ? h`<a href="mailto:${a.mail}">${ico('nachricht')}${a.mail}</a>` : ''}
                ${a.telefon ? h`<a href="tel:${String(a.telefon).replace(/\s/g, '')}">${ico('person')}${a.telefon}</a>` : ''}
              </p>
              <label class="feld feld--flach"><span class="nur-sr">Stand</span>
                <select data-tu-change="anfrage-stand" data-id="${a.id}">
                  ${ANFRAGE_STAND.map((st) => h`<option value="${st[0]}" ${a.stand === st[0] ? 'selected' : ''}>${st[1]}</option>`)}
                </select></label>
            </div>
          </li>`)}
        </ol>
        <p class="fein">Die Adresse steht hier und in keiner Mail. Wer antwortet, gibt seine eigene frei –
          niemand sonst.</p>` : ''}

      ${aus.length ? h`<h3 class="anfragen__ueber">Von dir geschrieben</h3>
        <ol class="anfragen__liste anfragen__liste--echt">
          ${aus.map((a) => h`<li class="stand-${a.stand}">
            <div>
              <b><a href="#/objekt/${a.inserat}">${U.truncate(a.titel || 'Inserat entfernt', 46)}</a>
                ${a.stand === 'beantwortet' ? ui.badge('beantwortet', 'gut') : ''}
                ${a.stand === 'abgelehnt' ? ui.badge('abgesagt', 'neutral') : ''}
                ${a.stand === 'weg' ? ui.badge('Inserat gelöscht', 'neutral') : ''}
                ${a.stand === 'neu' ? ui.badge('noch ungelesen', 'warn') : ''}</b>
              <span>${U.since(new Date(a.angelegt * 1000).toISOString().slice(0, 10))}</span>
              <p class="anfragen__text">${U.truncate(a.text, 220)}</p>
            </div>
          </li>`)}
        </ol>
        <p class="fein">„Noch ungelesen“ heißt nicht ignoriert. Viele öffnen ihr Postfach einmal am Tag.
          Nachfassen lohnt sich erfahrungsgemäß nach drei bis vier Tagen, nicht früher.</p>` : ''}
    </section>`;
  }

  function eigenesPostfach() {
    const s = S.get();
    if (!s.eigeneInserate.length) return '';
    return h`<section class="block">
      <div class="block__kopfzeile">
        <h2>${ico('nachricht')}Anfragen zu deinen Inseraten</h2>
        <span class="fein">${s.eigeneInserate.length} ${U.plural(s.eigeneInserate.length, 'Inserat', 'Inserate')}</span>
      </div>
      ${s.eigeneInserate.map((e) => {
      const anfragen = P.anfragenSortieren(TT.data.anfragenFuer(e));
      const mitPlus = anfragen.filter((a) => a.plus).length;
      return h`<article class="anfragen">
          <header class="anfragen__kopf">
            <b><a href="#/objekt/${e.id}">${U.truncate(e.titel, 52)}</a></b>
            <span>${anfragen.length} ${U.plural(anfragen.length, 'Anfrage', 'Anfragen')}${mitPlus
        ? ' · ' + mitPlus + ' mit Plus' : ''}</span>
          </header>
          <ol class="anfragen__liste">
            ${anfragen.map((a) => h`<li class="${a.plus ? 'is-plus' : ''}">
              ${raw(TT.img.avatar(a.name, 34))}
              <div>
                <b>${a.name}${a.plus ? ui.badge('Plus', 'info', 'plus5') : ''}
                  ${a.unterlagen ? ui.badge('Unterlagen dabei', 'gut') : ''}</b>
                <i>${U.truncate(a.text, 96)}</i>
                <span>${U.since(a.zeit)}</span>
              </div>
            </li>`)}
          </ol>
          <details class="anfragen__warum">
            <summary>${ico('info')}Warum stehen manche Anfragen oben?</summary>
            <p>Anfragen von Nutzenden mit <b>TrimmoTrade Plus</b> werden zuerst gezeigt und sind mit „Plus“
              gekennzeichnet. Das ist bezahlte Sichtbarkeit, kein Urteil über die Person: TrimmoTrade sagt damit
              nichts darüber, wer besser zu deiner Wohnung passt. Darunter folgen alle weiteren in der
              Reihenfolge des Eingangs – gelöscht oder versteckt wird keine.</p>
            <p class="fein">Du kannst die Reihenfolge ignorieren; die Liste zeigt alle Anfragen vollständig.</p>
          </details>
          <p class="fein anfragen__demo">${ico('info')}Beispielanfragen dieser Vorführung. Es hat niemand
            wirklich geschrieben – die Namen und Texte entstehen aus der Kennung des Inserats und bleiben
            deshalb gleich.</p>
        </article>`;
    })}
    </section>`;
  }

  function nachrichten(route) {
    const s = S.get();

    /* Beim ersten Öffnen vom Server holen und danach nur diesen einen
       Block nachtragen – nicht die Seite neu zeichnen: Darunter steht
       ein Verlauf, in dem jemand gerade tippt. */
    if (amServer() && postfach === null) {
      postfach = { eingang: [], ausgang: [] };
      postfachHolen().then(() => {
        if (ui.aktuell !== 'nachrichten') return;
        const kasten = U.$('#echtes-postfach');
        if (kasten) kasten.innerHTML = String(echtesPostfach());
      });
    }
    const aktivId = route.arg || (s.threads[0] ? s.threads[0].id : null);
    const aktiv = s.threads.find((t) => t.id === aktivId);
    if (aktiv && aktiv.ungelesen) setTimeout(() => { S.threadGelesen(aktiv.id); ui.aktualisiereZaehler(); }, 400);

    if (!s.threads.length) {
      return {
        titel: 'Nachrichten',
        html: h`<div class="seite seite--schmal">
          <header class="seite__kopf"><h1>${ico('nachricht')}Nachrichten</h1></header>
          <div id="echtes-postfach">${echtesPostfach()}</div>
          ${eigenesPostfach()}
          <div class="leer">${ico('nachricht')}<h2>Noch kein eigener Verlauf</h2>
            <p>Sobald du ein Inserat anschreibst, erscheint der Verlauf hier.</p>
            <p><a class="knopf" href="#/suche">${ico('suche')}Zur Suche</a></p></div></div>`
      };
    }

    return {
      titel: 'Nachrichten',
      html: h`<div class="seite">
        <header class="seite__kopf"><h1>${ico('nachricht')}Nachrichten</h1></header>
        <div id="echtes-postfach">${echtesPostfach()}</div>
        ${eigenesPostfach()}
        <div class="post">
          <nav class="post__liste" aria-label="Verläufe">
            ${s.threads.map((t) => {
        const l = TT.data.byId[t.listingId];
        const letzte = t.nachrichten[t.nachrichten.length - 1];
        return h`<a class="post__eintrag ${t.id === aktivId ? 'is-an' : ''}" href="#/nachrichten/${t.id}">
                ${raw(TT.img.avatar(t.partner, 40))}
                <div>
                  <b>${t.partner}${t.ungelesen ? raw('<i class="punkt" aria-label="ungelesen"></i>') : ''}</b>
                  <span>${l ? U.truncate(l.titel, 34) : 'Inserat entfernt'}</span>
                  <i>${letzte ? U.truncate(letzte.text.replace(/\n/g, ' '), 44) : ''}</i>
                </div>
              </a>`;
      })}
          </nav>
          <section class="post__verlauf" aria-label="Verlauf">
            ${aktiv ? verlauf(aktiv) : h`<p class="post__leer">Wähle links einen Verlauf.</p>`}
          </section>
        </div>
      </div>`
    };
  }

  function verlauf(t) {
    const l = TT.data.byId[t.listingId];
    const wartet = t.wartetSeit && t.nachrichten[t.nachrichten.length - 1].von === 'ich';
    return h`<header class="post__kopf">
        ${raw(TT.img.avatar(t.partner, 44))}
        <div><b>${t.partner}</b>
          ${l ? h`<a href="#/objekt/${l.id}">${l.titel}</a>` : ''}</div>
        ${l ? h`<span class="post__quote">antwortet in ${l.anbieter.quote} % der Fälle</span>` : ''}
      </header>
      <div class="post__blasen">
        ${t.nachrichten.map((n) => h`<div class="blase blase--${n.von}">
          <p>${raw(U.esc(n.text).replace(/\n/g, '<br>'))}</p>
          <time>${U.since(n.zeit)}</time>
        </div>`)}
        ${wartet ? h`<p class="post__warten">${ico('verlauf')}Abgeschickt. In dieser Vorführung antwortet niemand –
          in der Praxis meldet sich ${t.partner} laut Statistik binnen
          ${l ? (l.anbieter.antwortStd < 24 ? l.anbieter.antwortStd + ' Stunden' : Math.round(l.anbieter.antwortStd / 24) + ' Tagen') : 'einiger Zeit'}.</p>` : ''}
      </div>
      <form class="post__feld" data-tu-submit="post-senden" data-id="${t.id}">
        <label class="nur-sr" for="post-text">Nachricht</label>
        <textarea id="post-text" rows="2" placeholder="Antwort schreiben…"></textarea>
        <button type="submit" class="knopf">${ico('nachricht')}Senden</button>
      </form>`;
  }

  /* ================================================================
     Umzugsplan
     ================================================================ */

  /* Wann die Kündigung der alten Wohnung draußen sein muss.

     Die frühere Fassung rechnete „Einzug minus 90 Tage“. Das ist keine
     Näherung, sondern die falsche Regel: § 573c Abs. 1 BGB knüpft nicht
     an einen Abstand in Tagen an, sondern an den Monat. Die Kündigung
     muss bis zum dritten Werktag eines Monats zugehen, dann endet das
     Mietverhältnis mit Ablauf des übernächsten Monats.

     Wer zum 15. März einzieht, will das alte Mietverhältnis zum 31. März
     beenden – dafür muss die Kündigung bis zum dritten Werktag im Januar
     da sein. Die 90-Tage-Rechnung nannte den 15. Dezember: drei Wochen
     zu früh, und das unter der Überschrift „spätestens“. Wer daraufhin
     glaubt, die Frist verpasst zu haben, zahlt einen Monat länger doppelt. */
  function kuendigungsHinweis(datum, ausProfil) {
    const d = new Date(datum + 'T12:00:00');
    if (isNaN(d.getTime())) return '';
    const zu = new Date(d.getFullYear(), d.getMonth() + 1, 0, 12);
    const frist = U.dritterWerktag(d.getFullYear(), d.getMonth() - 2);
    return h`<p class="fein">${ausProfil ? 'Übernommen aus deinem Profil. ' : ''}Um das alte Mietverhältnis
      zum ${U.dateDE(U.isoDate(zu))} zu beenden, muss die Kündigung spätestens am
      ${U.dateDE(U.isoDate(frist))} beim Vermieter sein: bis zum dritten Werktag eines Monats, dann endet
      das Mietverhältnis mit Ablauf des übernächsten Monats (§ 573c Abs. 1 BGB).</p>
      <p class="fein">Feiertage sind dabei nicht berücksichtigt – sie sind je Bundesland verschieden. Gib
      die Kündigung ein paar Tage früher ab und lass dir den Zugang bestätigen: Es zählt der Zugang, nicht
      das Absendedatum.</p>`;
  }

  function umzug() {
    const s = S.get();
    const datum = S.einzugsdatum();
    const plan = S.umzugsPlan();
    const erledigt = plan.filter((a) => a.erledigt).length;
    const gruppen = {};
    plan.forEach((a) => { (gruppen[a.gruppe] = gruppen[a.gruppe] || []).push(a); });
    const heute = U.isoDate(TT.now());

    return {
      titel: 'Umzug',
      html: h`<div class="seite seite--schmal">
        <header class="seite__kopf">
          <h1>${ico('umzug')}Umzugsplan</h1>
          <p class="seite__unter">Zwanzig Aufgaben mit Fristen, die sich aus deinem Einzugstermin ergeben.
            Zwei davon haben harte gesetzliche Grenzen – die sind markiert.</p>
        </header>

        <section class="block">
          <label class="feld"><span>Geplanter Einzug</span>
            <input type="date" value="${datum}" data-tu-change="umzug-datum"></label>
          ${datum ? kuendigungsHinweis(datum, !s.einzugsdatum) : ''}
          <div class="fortschritt">
            <div class="fortschritt__spur"><i style="width:${Math.round(erledigt / plan.length * 100)}%"></i></div>
            <b>${erledigt} von ${plan.length} erledigt</b>
          </div>
        </section>

        ${Object.keys(gruppen).map((g) => h`<section class="block">
          <h2>${g}</h2>
          <ul class="umzugsliste">
            ${gruppen[g].map((a) => h`<li class="${a.erledigt ? 'is-fertig' : ''} ${a.faellig && a.faellig < heute && !a.erledigt ? 'is-ueberfaellig' : ''}">
              <label class="schalter">
                <input type="checkbox" data-tu-change="umzug-check" data-id="${a.id}" ${a.erledigt ? 'checked' : ''}>
                <span><b>${a.label}</b>
                  ${a.faellig ? h`<i class="umzugsliste__frist">${a.wann < 0 ? 'bis' : 'ab'} ${U.dateDE(a.faellig)}</i>`
        : h`<i class="umzugsliste__frist">${a.wann < 0 ? Math.abs(a.wann) + ' Tage vorher' : a.wann === 0 ? 'am Umzugstag' : a.wann + ' Tage danach'}</i>`}
                  ${a.hinweis ? h`<i class="umzugsliste__hinweis">${a.hinweis}</i>` : ''}
                </span>
              </label>
            </li>`)}
          </ul>
        </section>`)}

        <p><button type="button" class="knopf knopf--still" data-tu="umzug-kopieren">${ico('kopieren')}Plan als Text kopieren</button></p>
      </div>`
    };
  }

  /* ================================================================
     Aktionen
     ================================================================ */

  const A_ = ui.aktionRegistrieren;

  A_('nachfassen', (el) => {
    const id = el.dataset.id;
    const l = TT.data.byId[id];
    const f = S.nachfassFaellig().find((x) => x.id === id);
    const tage = f ? f.tage : S.NACHFASS_TAGE;
    const p = S.get().profil;
    const text = 'Guten Tag,\n\n' +
      'vor ' + tage + ' Tagen hatte ich mich auf Ihr Inserat „' + l.titel + '“ gemeldet. ' +
      'Da ich noch keine Rückmeldung habe, frage ich kurz nach: Ist die Wohnung noch verfügbar?\n\n' +
      'Falls sie bereits vergeben ist, freue ich mich über eine kurze Nachricht – dann kann ich weitersuchen. ' +
      'Falls nicht, stehe ich für einen Besichtigungstermin gern zur Verfügung; meine Unterlagen habe ich vollständig vorliegen.\n\n' +
      'Viele Grüße\n' + (p.name || '');
    ui.dialog({
      titel: 'Nachfassen',
      breit: true,
      inhalt: h`<p class="block__unter">Kurz, freundlich, mit einem einfachen Ausweg für die Gegenseite –
          so bekommt man am ehesten überhaupt eine Antwort.</p>
        <label class="feld"><span>Nachricht</span><textarea rows="10" id="nachfass-text">${text}</textarea></label>`,
      fuss: h`<button type="button" class="knopf knopf--still" data-tu="nachfass-erledigt" data-id="${id}">Nur als erledigt merken</button>
        <button type="button" class="knopf" data-tu="nachfass-senden" data-id="${id}">${ico('nachricht')}Absenden</button>`
    });
  });

  A_('nachfass-senden', (el) => {
    const text = (U.$('#nachfass-text') || {}).value || '';
    if (!text.trim()) return;
    S.anschreiben(el.dataset.id, text);
    S.nachgefasst(el.dataset.id);
    ui.dialogZu();
    ui.toast('Nachfrage abgeschickt.', 'gut');
    ui.neuZeichnen();
  });

  A_('nachfass-erledigt', (el) => {
    S.nachgefasst(el.dataset.id);
    ui.dialogZu();
    ui.neuZeichnen();
  });

  A_('serie', () => {
    const s = S.get();
    const ids = Object.keys(s.merkliste).filter((id) => s.merkliste[id].status === 'gemerkt' && TT.data.byId[id]);
    if (!ids.length) { ui.toast('Nichts auf „gemerkt“.'); return; }
    ui.dialog({
      titel: 'Serienbewerbung',
      breit: true,
      inhalt: h`<p>Für jedes Objekt entsteht ein eigenes Anschreiben aus deinem Profil – mit Titel, Lage und
          Einzugstermin des jeweiligen Inserats. Keine Rundmail: Wer erkennbar hundertfach kopiert, wird aussortiert.</p>
        <ul class="serienliste">
          ${ids.map((id) => {
        const l = TT.data.byId[id];
        return h`<li>
              <label class="schalter"><input type="checkbox" checked data-serie="${id}">
                <span><b>${U.truncate(l.titel, 44)}</b>
                  <i>${l.viertel}, ${l.stadt} · ${U.eur(l.kind === 'kauf' ? l.kaufpreis : l.warm)}
                    ${l.kind === 'kauf' ? '' : 'warm'} · ${l.anbieter.name}</i></span></label>
            </li>`;
      })}
        </ul>
        <label class="feld"><span>Zusatz für alle Anschreiben (freiwillig)</span>
          <textarea rows="3" id="serie-zusatz" placeholder="Etwas, das für alle gilt – etwa der frühestmögliche Einzugstermin."></textarea></label>
        ${TT.viewTresor ? TT.viewTresor.freigabeAbschnitt(null, '', { ohneKnopf: true,
        einleitung: 'Jede Bewerbung bekommt einen eigenen Verweis – ein gemeinsamer wäre ein Generalschlüssel, '
          + 'den jede Seite weiterreichen könnte. Widerrufen lässt sich später jeder einzeln.' }) : ''}`,
      fuss: h`<button type="button" class="knopf knopf--still" data-tu="dialog-zu">Abbrechen</button>
        <button type="button" class="knopf" data-tu="serie-senden">${ico('nachricht')}Alle ausgewählten absenden</button>`
    });
  });

  A_('serie-senden', () => {
    const zusatz = ((U.$('#serie-zusatz') || {}).value || '').trim();
    const gewaehlt = U.$$('[data-serie]').filter((el) => el.checked).map((el) => el.dataset.serie);
    if (!gewaehlt.length) { ui.toast('Nichts ausgewählt.', 'schlecht'); return; }
    const auftraege = gewaehlt.map((id) => ({
      objektId: id, empfaenger: (TT.data.byId[id].anbieter || {}).name || ''
    }));
    const verweise = TT.viewTresor ? TT.viewTresor.verweisJeEmpfaenger(auftraege) : Promise.resolve({});
    verweise.then((links) => senden(gewaehlt, zusatz, links));
  });

  function senden(gewaehlt, zusatz, links) {
    const p = S.get().profil;
    gewaehlt.forEach((id) => {
      const l = TT.data.byId[id];
      const anrede = l.anbieter.art === 'privat' ? 'Hallo ' + l.anbieter.name.split(' ')[0] + ',' : 'Guten Tag,';
      const text = anrede + '\n\n' +
        'Ihr Inserat „' + l.titel + '“ in ' + l.viertel + ' passt sehr gut zu dem, was ich suche.' +
        (p.name ? ' Ich heiße ' + p.name + '.' : '') +
        (p.beruf ? ' Ich arbeite als ' + p.beruf + '.' : '') +
        (p.haushalt > 1 ? ' Wir sind ' + p.haushalt + ' Personen.' : ' Ich würde allein einziehen.') +
        (p.nettoEinkommen ? ' Mein Nettoeinkommen liegt bei rund ' + U.eur(p.nettoEinkommen) + ' im Monat.' : '') +
        (p.einzugAb ? ' Einziehen könnte ich ab ' + U.dateDE(p.einzugAb) + '.' : '') +
        '\n\n' + (p.vorstellung ? p.vorstellung + '\n\n' : '') +
        (zusatz ? zusatz + '\n\n' : '') +
        W.unterlagenSatz(p) + ' ' +
        'Nennen Sie mir gern zwei Termine, die Ihnen passen.\n\n' +
        'Viele Grüße\n' + (p.name || '') + ((links || {})[id] || '');
      S.anschreiben(id, text);
    });
    ui.dialogZu();
    ui.toast(gewaehlt.length + ' ' + U.plural(gewaehlt.length, 'Anschreiben', 'Anschreiben') + ' abgeschickt.', 'gut');
    ui.neuZeichnen();
  }

  A_('vergleich-kopieren', () => {
    const s = S.get();
    const objekte = s.vergleich.map((id) => TT.data.byId[id]).filter(Boolean);
    const zeilen = ['Vergleich aus TrimmoTrade', ''];
    objekte.forEach((l) => {
      const k = A.kosten(l, s.profil), b = A.bewerten(l, s.profil);
      zeilen.push(l.titel);
      zeilen.push('  ' + l.strasse + ', ' + l.viertel + ', ' + l.stadt);
      zeilen.push('  ' + (l.kind === 'kauf' ? U.eur(l.kaufpreis) : U.eur(l.warm) + ' warm') +
        ' · ' + U.dec(l.zimmer) + ' Zi. · ' + l.flaeche + ' m² · Baujahr ' + l.baujahr);
      zeilen.push('  Echte Monatskosten: ' + U.eur(k.monatSumme) + ', einmalig ' + U.eur(k.einmalSumme));
      zeilen.push('  Passung ' + b.score + ' %' + (b.mietCheck ? ', ' + (b.mietCheck.diff >= 0 ? '+' : '') + b.mietCheck.diff + ' % zur Vergleichsmiete' : ''));
      zeilen.push('');
    });
    ui.AKTIONEN.kopieren({ dataset: { text: zeilen.join('\n') } });
  });

  A_('agent-oeffnen', (el) => {
    const a = S.get().agenten.find((x) => x.id === el.dataset.id);
    if (!a) return;
    S.set({ filter: JSON.parse(JSON.stringify(a.filter)) }, 'filter');
    S.agentGelesen(a.id);
    ui.gehe('suche');
  });

  A_('agent-gelesen', (el) => { S.agentGelesen(el.dataset.id); ui.neuZeichnen(); ui.toast('Als gesehen markiert.'); });

  A_('agent-aktiv', (el) => {
    S.update((s) => {
      const a = s.agenten.find((x) => x.id === el.dataset.id);
      if (a) a.aktiv = el.checked;
    }, 'agenten');
    ui.neuZeichnen();
  });

  A_('agent-weg', (el) => {
    if (!confirm('Diesen Suchauftrag löschen?')) return;
    S.agentLoeschen(el.dataset.id);
    ui.neuZeichnen();
    ui.toast('Suchauftrag gelöscht.');
  });

  A_('post-senden', (el) => {
    const feld = U.$('#post-text');
    const text = (feld.value || '').trim();
    /* Stillschweigend nichts zu tun ist die schlechteste Rückmeldung. */
    if (!text) { feld.focus(); ui.toast('Schreib erst etwas.', 'schlecht'); return; }
    const t = S.get().threads.find((x) => x.id === el.dataset.id);
    if (!t) return;
    S.update((s) => {
      const th = s.threads.find((x) => x.id === el.dataset.id);
      th.nachrichten.push({ von: 'ich', zeit: new Date().toISOString(), text });
      th.wartetSeit = new Date().toISOString();
    }, 'nachrichten');
    ui.neuZeichnen();
  });

  A_('umzug-datum', (el) => { S.set({ einzugsdatum: el.value }, 'umzug'); ui.neuZeichnen(); });
  A_('umzug-check', (el) => { S.umzugSetzen(el.dataset.id, el.checked); ui.neuZeichnen(); });

  A_('umzug-kopieren', () => {
    const plan = S.umzugsPlan();
    const zeilen = ['Umzugsplan', ''];
    plan.forEach((a) => {
      zeilen.push((a.erledigt ? '[x] ' : '[ ] ') + (a.faellig ? U.dateDE(a.faellig) + ' – ' : '') + a.label +
        (a.hinweis ? '\n      ' + a.hinweis : ''));
    });
    ui.AKTIONEN.kopieren({ dataset: { text: zeilen.join('\n') } });
  });

  ui.ansichten.merkliste = merkliste;
  ui.ansichten.vergleich = vergleich;
  ui.aktionRegistrieren('agent-mail', (el) => {
    const a = S.get().agenten.find((x) => x.id === el.dataset.id);
    if (!a) return;
    const da = mailAuftragZu(a);
    el.disabled = true;
    const fertig = () => { el.disabled = false; ui.neuZeichnen(); };

    if (da) {
      TT.api.ruf('auftrag/weg', { id: da.id })
        .then(() => mailAuftraegeHolen())
        .then(() => { ui.toast('Keine Mails mehr für diesen Suchauftrag.'); fertig(); },
          (e) => { ui.toast((e && e.text) || 'Das ging nicht.', 'schlecht'); fertig(); });
      return;
    }
    TT.api.ruf('auftrag/neu', {
      name: a.name,
      filter: serverFilter(a.filter),
      takt: P.istPlus() ? 'sofort' : 'taeglich',
      plus: P.istPlus()
    }).then(() => mailAuftraegeHolen())
      .then(() => {
        ui.toast('Eingerichtet. Du bekommst eine Mail, sobald etwas Passendes dazukommt.', 'gut');
        if (TT.markt) TT.markt.zaehle('auftrag-neu');
        fertig();
      }, (e) => {
        ui.toast((e && e.text) || 'Das ging nicht.', 'schlecht');
        fertig();
      });
  });

  ui.aktionRegistrieren('anfrage-stand', (el) => {
    const id = el.dataset.id;
    const stand = el.value;
    TT.api.ruf('anfrage/stand', { id, stand }).then(() => {
      const a = (postfach.eingang || []).find((x) => x.id === id);
      if (a) a.stand = stand;
      ui.toast('Vermerkt.', 'gut');
    }, (e) => ui.toast((e && e.text) || 'Das ließ sich nicht vermerken.', 'schlecht'));
  });

  ui.ansichten.agenten = agenten;
  ui.ansichten.nachrichten = nachrichten;
  ui.ansichten.umzug = umzug;
  TT.viewTools = { beschreibeFilter };
})(window.TT = window.TT || {});
