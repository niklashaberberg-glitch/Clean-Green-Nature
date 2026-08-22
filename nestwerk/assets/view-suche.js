/* =====================================================================
   Nestwerk – Ansicht: Suchen
   Eine Suche über alle vier Welten. Filter links, Ergebnisse rechts,
   Karte wahlweise daneben. Die Reihenfolge erklärt sich selbst.
   ===================================================================== */
(function (NW) {
  'use strict';

  const U = NW.util, ui = NW.ui, A = NW.analyse, S = NW.store, P = NW.plan;
  const h = U.html, raw = U.raw, ico = U.svg;

  let karte = null;
  let letzteTreffer = [];
  let umkreisModus = false;

  /* Jede Karte trägt eine eigene Zeichnung; 200 davon auf einmal zu bauen
     kostet spürbar Zeit. Deshalb häppchenweise nachladen. */
  const SEITE = 24;
  let sichtbar = SEITE;

  const ARTEN = [
    { id: 'miete', label: 'Mieten', icon: 'schluessel' },
    { id: 'kauf', label: 'Kaufen', icon: 'haus' },
    { id: 'wg', label: 'WG-Zimmer', icon: 'wg' },
    { id: 'tausch', label: 'Tauschen', icon: 'tausch' }
  ];

  const SORTIERUNG = [
    ['passung', 'Beste Passung'],
    ['neu', 'Neueste zuerst'],
    ['preis', 'Preis aufsteigend'],
    ['preisAb', 'Preis absteigend'],
    ['preisqm', 'Preis je m²'],
    ['gesamtkosten', 'Echte Monatskosten'],
    ['flaeche', 'Größte Fläche'],
    ['fairness', 'Fairster Preis'],
    ['chance', 'Beste Aussicht'],
    ['energie', 'Beste Energieklasse'],
    ['pendeln', 'Kürzester Arbeitsweg']
  ];

  const AUSSTATTUNG_FILTER = ['Balkon', 'Terrasse', 'Garten', 'Einbauküche', 'Aufzug', 'Barrierefrei',
    'Stellplatz', 'Keller', 'Waschmaschinenanschluss', 'Badewanne', 'Haustiere erlaubt', 'Möbliert',
    'Fußbodenheizung', 'Glasfaser', 'Gäste-WC', 'Fahrradkeller'];

  /* ------------------------- Filterleiste ------------------------- */

  function zahlFeld(label, feld, platzhalter, einheit) {
    const f = S.get().filter;
    return h`<label class="feld feld--zahl">
      <span>${label}</span>
      <span class="feld__eingabe">
        <input type="number" inputmode="numeric" data-feld="${feld}" data-tu-input="filter-zahl"
          value="${f[feld] == null ? '' : f[feld]}" placeholder="${platzhalter || ''}" min="0">
        ${einheit ? h`<i>${einheit}</i>` : ''}
      </span>
    </label>`;
  }

  function chipGruppe(titel, feld, werte, beschriftung) {
    const f = S.get().filter;
    const gewaehlt = f[feld] || [];
    return h`<fieldset class="filter__gruppe">
      <legend>${titel}</legend>
      <div class="chips">
        ${werte.map((w) => {
      const wert = typeof w === 'string' ? w : w[0];
      const label = typeof w === 'string' ? (beschriftung ? beschriftung(w) : w) : w[1];
      const an = gewaehlt.indexOf(wert) >= 0;
      return h`<button type="button" class="chip ${an ? 'is-an' : ''}" aria-pressed="${an ? 'true' : 'false'}"
            data-tu="filter-chip" data-feld="${feld}" data-wert="${wert}">${label}</button>`;
    })}
      </div>
    </fieldset>`;
  }

  function schalter(label, feld, hinweis) {
    const f = S.get().filter;
    return h`<label class="schalter">
      <input type="checkbox" data-feld="${feld}" data-tu-change="filter-schalter" ${f[feld] ? 'checked' : ''}>
      <span>${label}${hinweis ? h`<i>${hinweis}</i>` : ''}</span>
    </label>`;
  }

  function filterPanel() {
    const s = S.get(), f = s.filter;
    const wgAktiv = f.arten.indexOf('wg') >= 0;
    const kaufAktiv = f.arten.length === 1 && f.arten[0] === 'kauf';
    const alleViertel = f.staedte.length
      ? NW.geo.DISTRICTS.filter((d) => f.staedte.indexOf(d.city) >= 0)
      : [];
    const hatAnker = s.profil.anker && s.profil.anker.length;

    const abweichung = s.profilAngelegt ? A.profilAbweichung(f, s.profil) : [];

    return h`<form class="filter" data-tu-submit="filter-abschicken">
      <div class="filter__kopf">
        <h2>Filter</h2>
        <button type="button" class="link" data-tu="filter-leeren">Zurücksetzen</button>
      </div>

      ${s.profilAngelegt ? h`<div class="profilbezug">
        <button type="button" class="knopf knopf--still knopf--klein knopf--voll" data-tu="filter-aus-profil">
          ${ico('person')}Aus meinem Profil füllen</button>
        ${abweichung.length ? h`<p class="profilbezug__abweichung">
          ${ico('info')}Weicht ab: ${abweichung.map((a) => a.label + ' (Profil: ' + a.profil + ')').join(', ')}</p>` : ''}
      </div>` : h`<p class="filter__hinweis filter__hinweis--tipp">
        ${ico('person')}Leg ein <a href="#/profil">Profil</a> an, dann füllt Nestwerk diese Filter von selbst –
        und du musst nichts zweimal eintippen.</p>`}

      <fieldset class="filter__gruppe">
        <legend>Städte</legend>
        <div class="chips">
          ${NW.data.staedte.map((c) => {
      const an = f.staedte.indexOf(c) >= 0;
      return h`<button type="button" class="chip ${an ? 'is-an' : ''}" aria-pressed="${an ? 'true' : 'false'}"
              data-tu="filter-chip" data-feld="staedte" data-wert="${c}">${c}</button>`;
    })}
        </div>
      </fieldset>

      ${alleViertel.length ? h`<fieldset class="filter__gruppe">
        <legend>Viertel <i>${f.viertel.length ? f.viertel.length + ' gewählt' : 'alle'}</i></legend>
        <div class="chips chips--scroll">
          ${alleViertel.map((d) => {
      const an = f.viertel.indexOf(d.key) >= 0;
      return h`<button type="button" class="chip ${an ? 'is-an' : ''}" aria-pressed="${an ? 'true' : 'false'}"
              data-tu="filter-chip" data-feld="viertel" data-wert="${d.key}" title="${d.charakter}">${d.name}</button>`;
    })}
        </div>
      </fieldset>` : ''}

      <fieldset class="filter__gruppe">
        <legend>${kaufAktiv ? 'Kaufpreis' : 'Warmmiete im Monat'}</legend>
        <div class="feld__paar">
          ${zahlFeld('von', 'preisMin', '0', '€')}
          ${zahlFeld('bis', 'preisMax', kaufAktiv ? '750000' : '1200', '€')}
        </div>
      </fieldset>

      <fieldset class="filter__gruppe">
        <legend>Zuschnitt</legend>
        <div class="feld__paar">
          ${zahlFeld('Zimmer ab', 'zimmerMin', '2')}
          ${zahlFeld('Zimmer bis', 'zimmerMax', '')}
        </div>
        <div class="feld__paar">
          ${zahlFeld('Fläche ab', 'flaecheMin', '45', 'm²')}
          ${zahlFeld('Fläche bis', 'flaecheMax', '', 'm²')}
        </div>
      </fieldset>

      <fieldset class="filter__gruppe">
        <legend>Gebäude</legend>
        <div class="feld__paar">
          ${zahlFeld('Baujahr ab', 'baujahrMin', '1900')}
          <label class="feld">
            <span>Energieklasse bis</span>
            <select data-feld="energieMax" data-tu-change="filter-wert">
              <option value="">egal</option>
              ${['A+', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map((k) =>
      h`<option value="${k}" ${f.energieMax === k ? 'selected' : ''}>${k}</option>`)}
            </select>
          </label>
        </div>
      </fieldset>

      ${chipGruppe('Ausstattung', 'ausstattung', AUSSTATTUNG_FILTER)}

      <fieldset class="filter__gruppe">
        <legend>Einzug</legend>
        <label class="feld">
          <span>frei spätestens am</span>
          <input type="date" data-feld="freiBis" data-tu-change="filter-wert" value="${f.freiBis || ''}">
        </label>
      </fieldset>

      ${hatAnker ? h`<fieldset class="filter__gruppe">
        <legend>Arbeitsweg</legend>
        ${zahlFeld('höchstens', 'maxPendel', '35', 'Min.')}
        <p class="filter__hinweis">Gemessen ab ${s.profil.anker.map((a) => a.name).join(', ')} mit ${U.TRAVEL[s.profil.verkehrsmittel].label}.</p>
      </fieldset>` : h`<p class="filter__hinweis filter__hinweis--tipp">
        ${ico('zug')} Trag im <a href="#/profil">Profil</a> einen Arbeits- oder Uniort ein, dann filtert Nestwerk nach echter Fahrzeit statt nach Luftlinie.</p>`}

      ${f.umkreis ? h`<fieldset class="filter__gruppe">
        <legend>Umkreis</legend>
        <label class="feld feld--regler">
          <span>${U.dec(f.umkreis.km)} km um den gesetzten Punkt</span>
          <input type="range" min="0.5" max="25" step="0.5" value="${f.umkreis.km}" data-tu-input="umkreis-radius">
        </label>
        <button type="button" class="link" data-tu="umkreis-weg">Umkreis entfernen</button>
      </fieldset>` : ''}

      ${chipGruppe('Anbieter', 'anbieterArt', [
      ['privat', 'privat'], ['makler', 'Makler'], ['verwaltung', 'Hausverwaltung'], ['genossenschaft', 'Genossenschaft']
    ])}

      ${wgAktiv ? h`<fieldset class="filter__gruppe filter__gruppe--wg">
        <legend>${ico('wg')} WG-Merkmale</legend>
        <div class="chips">
          ${NW.data.WG_ART.map((a) => {
      const an = f.wgArt.indexOf(a) >= 0;
      return h`<button type="button" class="chip ${an ? 'is-an' : ''}" aria-pressed="${an ? 'true' : 'false'}"
              data-tu="filter-chip" data-feld="wgArt" data-wert="${a}">${a}</button>`;
    })}
        </div>
        <label class="schalter">
          <input type="checkbox" ${f.wgRauchen === 'rauchfrei' ? 'checked' : ''} data-tu-change="filter-wgrauchen">
          <span>nur rauchfreie WGs</span>
        </label>
        <label class="schalter">
          <input type="checkbox" ${f.wgHaustiere === 'erlaubt' ? 'checked' : ''} data-tu-change="filter-wgtiere">
          <span>Haustiere möglich</span>
        </label>
      </fieldset>` : ''}

      <fieldset class="filter__gruppe">
        <legend>Nur zeigen, wenn</legend>
        ${schalter('provisionsfrei', 'provisionsfrei')}
        ${schalter('Anbieter geprüft', 'nurVerifiziert')}
        ${schalter('ohne Prüfhinweis', 'ohneVerdacht', 'blendet Inserate mit deutlichen Betrugsmerkmalen aus')}
      </fieldset>

      <div class="filter__fuss">
        <button type="button" class="knopf knopf--voll" data-tu="agent-aus-filter">${ico('glocke')}Als Suchauftrag merken</button>
        ${s.agenten.length >= P.grenze('suchauftraege')
        ? h`<p class="filter__hinweis">${ico('schloss')}Im freien Tarif ist ein Suchauftrag möglich.
            <a href="#/plus">Mit Plus unbegrenzt viele.</a></p>` : ''}
      </div>
    </form>`;
  }

  /* ------------------------- Marktüberblick ------------------------- */

  function marktLeiste(treffer) {
    const m = A.marktLage(treffer);
    if (!m) return '';
    return h`<div class="markt">
      <span><b>${U.num(m.anzahl)}</b> ${U.plural(m.anzahl, 'Treffer', 'Treffer')}</span>
      ${m.medianWarm ? h`<span><b>${U.eur(m.medianWarm)}</b> mittlere Warmmiete
        ${m.medianQm ? h`(${U.dec(m.medianQm)} €/m² kalt)` : ''}</span>` : ''}
      ${m.medianZimmerWarm ? h`<span><b>${U.eur(m.medianZimmerWarm)}</b> mittleres WG-Zimmer</span>` : ''}
      ${m.medianKauf ? h`<span><b>${U.eur(m.medianKauf)}</b> mittlerer Kaufpreis</span>` : ''}
      <span><b>${m.neu7}</b> neu in 7 Tagen</span>
      ${m.medianBewerber !== null ? h`<span><b>${m.medianBewerber}</b> Interessenten im Mittel</span>` : ''}
      ${!m.genugFuerMittel ? h`<span class="markt__wenig">zu wenige Treffer für Mittelwerte</span>` : ''}
    </div>`;
  }

  /* ------------------------- Ergebnisliste ------------------------- */

  /* Ein Vorschlag, der die Lage nicht ändert, ist keiner. Deshalb wird
     jede Lockerung vorab durchgerechnet und mit ihrem Ertrag beschriftet.
     Was nichts bringt, taucht gar nicht erst auf. */
  /* Jede Lockerung steht genau einmal hier: mit Beschriftung, Bedingung
     und Wirkung. Anzeige und Knopfdruck greifen auf dieselbe Stelle zu,
     sodass der Knopf nie etwas anderes tut, als sein Text verspricht.

     Entscheidend ist das Feld `schmerz`: Ein Vorschlag allein nach Ertrag
     zu sortieren führt dazu, dass „such doch in einer anderen Stadt“ ganz
     oben steht – der Vorschlag bringt naturgemäß die meisten Treffer und
     ist zugleich der einzige, der die Suche im Kern verändert. Wer wegen
     einer Stelle nach Köln zieht, ist mit fünf Berliner Wohnungen nicht
     geholfen. Deshalb wird Ertrag gegen Schmerz abgewogen, und was die
     Suche grundlegend umdeutet, steht immer hinten und sagt das auch. */
  const LOCKERUNGEN = [
    {
      tu: 'lockern-preis', gilt: (f) => !!f.preisMax, schmerz: 3,
      /* In Stufen versuchen, bis eine wirklich Treffer bringt. */
      stufen: [1.1, 1.25, 1.5],
      label: (f, wert) => 'Budget auf ' + U.eur(wert) + ' anheben',
      wert: (f, stufe) => Math.round(f.preisMax * stufe / 10) * 10,
      aendern: (k, wert) => { k.preisMax = wert; }
    },
    { tu: 'lockern-ausstattung', gilt: (f) => f.ausstattung.length > 0, schmerz: 1,
      label: () => 'Ausstattungswünsche zurücksetzen', aendern: (k) => { k.ausstattung = []; } },
    { tu: 'lockern-viertel', gilt: (f) => f.viertel.length > 0, schmerz: 2,
      label: () => 'ganze Stadt statt einzelner Viertel', aendern: (k) => { k.viertel = []; } },
    { tu: 'lockern-flaeche', gilt: (f) => !!f.flaecheMin, schmerz: 2,
      label: (f) => Math.max(15, f.flaecheMin - 10) + ' m² statt ' + f.flaecheMin + ' m²',
      aendern: (k, w, f) => { k.flaecheMin = Math.max(15, f.flaecheMin - 10); } },
    { tu: 'lockern-zimmer', gilt: (f) => !!f.zimmerMin && f.zimmerMin > 1, schmerz: 2,
      label: () => 'ein halbes Zimmer weniger',
      aendern: (k, w, f) => { k.zimmerMin = Math.max(1, f.zimmerMin - 0.5); } },
    { tu: 'lockern-pendel', gilt: (f) => !!f.maxPendel, schmerz: 3,
      label: (f) => 'Arbeitsweg bis ' + Math.round(f.maxPendel * 1.6) + ' Min. zulassen',
      aendern: (k, w, f) => { k.maxPendel = Math.round(f.maxPendel * 1.6); } },
    { tu: 'lockern-umkreis', gilt: (f) => !!f.umkreis, schmerz: 2,
      label: (f) => 'Umkreis auf ' + U.dec(Math.min(25, f.umkreis.km * 2)) + ' km',
      aendern: (k, w, f) => { if (k.umkreis) k.umkreis.km = Math.min(25, f.umkreis.km * 2); } },
    { tu: 'lockern-arten', gilt: (f) => f.arten.indexOf('wg') < 0, schmerz: 4, gross: true,
      label: () => 'auch WG-Zimmer zeigen',
      aendern: (k) => { k.arten = U.uniq(k.arten.concat(['wg'])); } },
    { tu: 'lockern-staedte', gilt: (f) => f.staedte.length > 0, schmerz: 5, gross: true,
      label: () => 'auch in anderen Städten suchen', aendern: (k) => { k.staedte = []; k.viertel = []; } },
    { tu: 'lockern-energie', gilt: (f) => !!f.energieMax, schmerz: 1,
      label: () => 'Energieklasse offen lassen', aendern: (k) => { k.energieMax = null; } },
    { tu: 'lockern-provision', gilt: (f) => f.provisionsfrei, schmerz: 3,
      label: () => 'auch Inserate mit Provision zeigen', aendern: (k) => { k.provisionsfrei = false; } },
    { tu: 'lockern-anbieter', gilt: (f) => f.anbieterArt.length > 0, schmerz: 2,
      label: () => 'alle Anbieterarten zulassen', aendern: (k) => { k.anbieterArt = []; } }
    /* Bewusst nicht dabei: den Prüfhinweis abschalten. Betrugsschutz ist
       keine Stellschraube, an der man dreht, um mehr Treffer zu bekommen. */
  ];

  function zaehle(f) {
    const s = S.get();
    return A.filtern(NW.data.listings.concat(s.eigeneInserate), f, s.profil).length;
  }

  /* Liefert für eine Lockerung den konkreten Zielwert und den Ertrag –
     oder null, wenn sie nichts ändert. */
  function pruefeLockerung(eintrag, f, jetzt) {
    if (!eintrag.gilt(f)) return null;
    const stufen = eintrag.stufen || [null];
    for (let i = 0; i < stufen.length; i++) {
      const wert = eintrag.wert ? eintrag.wert(f, stufen[i]) : null;
      const kopie = JSON.parse(JSON.stringify(f));
      eintrag.aendern(kopie, wert, f);
      const neu = zaehle(kopie);
      if (neu > jetzt) {
        return {
          tu: eintrag.tu, label: eintrag.label(f, wert), wert,
          gewinn: neu - jetzt, danach: neu,
          schmerz: eintrag.schmerz || 2, gross: !!eintrag.gross
        };
      }
    }
    return null;
  }

  function lockerungen(f) {
    const jetzt = zaehle(f);
    const alle = LOCKERUNGEN.map((e) => pruefeLockerung(e, f, jetzt)).filter(Boolean);
    /* Ertrag je Einheit Schmerz. Was die Suche grundlegend umdeutet
       (andere Stadt, andere Wohnform), rutscht ans Ende. */
    const sanft = alle.filter((x) => !x.gross).sort((a, b) => b.gewinn / b.schmerz - a.gewinn / a.schmerz);
    const gross = alle.filter((x) => x.gross).sort((a, b) => b.gewinn - a.gewinn);
    return sanft.slice(0, 3).concat(gross.slice(0, sanft.length ? 1 : 2));
  }

  function lockerungsKnoepfe(f) {
    const vorschlaege = lockerungen(f);
    if (!vorschlaege.length) return '';
    const sanft = vorschlaege.filter((v) => !v.gross);
    const gross = vorschlaege.filter((v) => v.gross);
    return h`${sanft.length ? h`<div class="leer__tun">
        ${sanft.map((v) => h`<button type="button" class="knopf knopf--still" data-tu="${v.tu}">
          ${v.label}<em>+${v.gewinn}</em></button>`)}
      </div>` : ''}
      ${gross.length ? h`<div class="leer__gross">
        <p>${sanft.length ? 'Wenn das nicht reicht' : 'Es hilft nur noch'} – das ändert deine Suche allerdings grundlegend:</p>
        <div class="leer__tun">
          ${gross.map((v) => h`<button type="button" class="knopf knopf--still" data-tu="${v.tu}">
            ${v.label}<em>+${v.gewinn}</em></button>`)}
        </div>
      </div>` : ''}`;
  }

  function leerHinweis(f) {
    const vorschlaege = lockerungen(f);
    return h`<div class="leer">
      ${ico('lupe')}
      <h3>Keine Treffer</h3>
      <p>${vorschlaege.length
        ? 'Die Filter zusammen lassen nichts übrig. Diese Änderungen bringen sofort Treffer – die Zahl dahinter sagt, wie viele:'
        : 'Die Filter zusammen lassen nichts übrig, und keine einzelne Lockerung reicht aus. Setz die Filter zurück und fang enger an.'}</p>
      ${lockerungsKnoepfe(f)}
      ${!vorschlaege.length ? h`<p><button type="button" class="knopf" data-tu="filter-leeren">Filter zurücksetzen</button></p>` : ''}
    </div>`;
  }

  const WENIG = 4;

  function ergebnisListe(bewertet) {
    const f = S.get().filter;
    if (!bewertet.length) return leerHinweis(f);
    const teil = bewertet.slice(0, sichtbar);
    const rest = bewertet.length - teil.length;
    /* Zwei Treffer sind fast so wenig wie keiner – die Hilfe darf nicht
       erst bei null erscheinen. */
    const knapp = bewertet.length < WENIG ? lockerungsKnoepfe(f) : '';
    /* Anzeigen sitzen zwischen den Treffern, nie in der Reihenfolge:
       sie haben eine eigene Gestalt und tragen immer ihre Kennzeichnung. */
    const abstand = NW.plan.ANZEIGE_ABSTAND;
    return h`<div class="ergebnisse__liste">
      ${teil.map((x, i) => h`${ui.inseratsKarte(x.l, x.b)}${(i + 1) % abstand === 0 && i + 1 < teil.length
        ? ui.anzeige('treffer-' + Math.floor(i / abstand), 'breit') : ''}`)}
    </div>
    ${knapp ? h`<div class="wenig">
      ${ico('lupe')}
      <div>
        <b>Nur ${bewertet.length} ${U.plural(bewertet.length, 'Treffer', 'Treffer')}</b>
        <p>So findest du mehr – die Zahl sagt, wie viele dazukommen:</p>
      </div>
    </div>${knapp}` : ''}
    ${rest > 0 ? h`<div class="mehr">
      <button type="button" class="knopf knopf--still" data-tu="mehr-zeigen">
        ${ico('pfeilUnten')}Weitere ${Math.min(SEITE, rest)} von ${U.num(rest)} zeigen</button>
      <p class="fein">${U.num(teil.length)} von ${U.num(bewertet.length)} Treffern geladen</p>
    </div>` : bewertet.length > SEITE ? h`<p class="mehr__fertig fein">Alle ${U.num(bewertet.length)} Treffer geladen.</p>` : ''}`;
  }

  /* Erklärt, warum das erste Ergebnis vorne steht. */
  function rankingErklaerung(bewertet) {
    if (!bewertet.length || S.get().filter.sort !== 'passung') return '';
    const top = bewertet[0];
    const gruende = top.b.teile.slice(0, 3).map((t) =>
      t.label.toLowerCase() + ' (' + Math.round(t.anteil * 100) + ' %)');
    return h`<details class="erklaerung">
      <summary>${ico('info')}Warum steht „${U.truncate(top.l.titel, 46)}“ ganz oben?</summary>
      <p>Nestwerk sortiert nach deinem Profil, nicht nach bezahlter Platzierung. Für dieses Inserat zählen vor allem
        ${raw(gruende.join(', '))}. Insgesamt ergibt das ${top.b.score} von 100 Punkten.</p>
      <p class="erklaerung__mehr"><a href="#/profil">Gewichtung im Profil ändern</a> – dann ändert sich auch die Reihenfolge.</p>
    </details>`;
  }

  /* ------------------------- Ansicht ------------------------- */

  function rechnen() {
    const s = S.get();
    const gefiltert = A.filtern(NW.data.listings.concat(s.eigeneInserate), s.filter, s.profil);
    const bewertet = A.sortieren(gefiltert, s.filter.sort, s.profil);
    letzteTreffer = bewertet.map((x) => x.l);
    return bewertet;
  }

  function aktualisieren() {
    const bewertet = rechnen();
    const box = U.$('#ergebnisse');
    if (box) box.innerHTML = ergebnisListe(bewertet);
    const kopf = U.$('#markt');
    if (kopf) kopf.innerHTML = marktLeiste(letzteTreffer);
    const erkl = U.$('#erklaerung');
    if (erkl) erkl.innerHTML = rankingErklaerung(bewertet);
    if (karte) karte.setzen(letzteTreffer, null, S.get().filter.umkreis);
    const anzahl = U.$('#treffer-anzahl');
    if (anzahl) anzahl.textContent = U.num(letzteTreffer.length);
    ui.aktualisiereZaehler();
  }

  function ansicht(route) {
    const s = S.get();
    const f = s.filter;

    /* Solange niemand die Filter angefasst hat, folgt die Suche dem
       Profil. Wer einmal selbst filtert, behält die Kontrolle. */
    if (!s.filterBeruehrt && s.profilAngelegt) {
      const abgeleitet = A.filterAusProfil(s.profil, f);
      Object.assign(f, abgeleitet);
      S.set({ filter: f }, 'filter');
    }

    /* Parameter aus der Adresse übernehmen, z. B. aus der Schnellsuche. */
    if (route.params.stadt) { f.staedte = [route.params.stadt]; f.viertel = []; }
    if (route.params.viertel) {
      const d = NW.geo.districtByKey[route.params.viertel];
      if (d) { f.staedte = [d.city]; f.viertel = [route.params.viertel]; }
    }
    if (route.params.q !== undefined) f.q = route.params.q;
    if (route.params.art) f.arten = route.params.art.split(',');
    if (Object.keys(route.params).length) S.set({ filter: f, filterBeruehrt: true }, 'filter');

    const bewertet = rechnen();
    const ansichtsart = s.ansicht;

    return {
      titel: 'Suchen',
      html: h`<div class="suche" data-ansicht="${ansichtsart}">
        <h1 class="nur-sr">Wohnungen, WG-Zimmer und Tauschangebote suchen</h1>
        <div class="suche__leiste">
          <div class="suche__arten" role="group" aria-label="Angebotsart">
            ${ARTEN.map((a) => {
        const an = f.arten.indexOf(a.id) >= 0;
        return h`<button type="button" class="art ${an ? 'is-an' : ''}" aria-pressed="${an ? 'true' : 'false'}"
                data-tu="art-um" data-wert="${a.id}">${ico(a.icon)}<span>${a.label}</span></button>`;
      })}
          </div>
          <div class="suche__feld">
            ${ico('suche')}
            <input type="search" id="suchfeld" value="${f.q}" data-tu-input="such-text"
              placeholder="Stichwort, Straße, Viertel, Anbieter…" aria-label="Freitextsuche">
            ${f.q ? h`<button type="button" class="ikon-btn" data-tu="such-leeren" aria-label="Suchtext löschen">${ico('x')}</button>` : ''}
          </div>
          <div class="suche__stellen">
            <label class="feld feld--flach">
              <span class="nur-sr">Sortierung</span>
              <select data-tu-change="sortieren" aria-label="Sortierung">
                ${SORTIERUNG.map((so) => h`<option value="${so[0]}" ${f.sort === so[0] ? 'selected' : ''}>${so[1]}</option>`)}
              </select>
            </label>
            <div class="umschalter" role="group" aria-label="Darstellung">
              <button type="button" class="${ansichtsart === 'liste' ? 'is-an' : ''}" data-tu="ansicht" data-wert="liste" title="Nur Liste">${ico('liste')}</button>
              <button type="button" class="${ansichtsart === 'beides' ? 'is-an' : ''}" data-tu="ansicht" data-wert="beides" title="Liste und Karte">${ico('waage')}</button>
              <button type="button" class="${ansichtsart === 'karte' ? 'is-an' : ''}" data-tu="ansicht" data-wert="karte" title="Nur Karte">${ico('karte')}</button>
            </div>
            <button type="button" class="knopf knopf--still nur-schmal" data-tu="filter-auf">${ico('filter')}Filter</button>
          </div>
        </div>

        <div class="suche__raster">
          <aside class="suche__filter" id="filterspalte">${filterPanel()}</aside>

          <section class="suche__ergebnis" aria-label="Suchergebnisse">
            <div id="markt">${marktLeiste(letzteTreffer)}</div>
            <div id="erklaerung">${rankingErklaerung(bewertet)}</div>
            <div id="ergebnisse">${ergebnisListe(bewertet)}</div>
          </section>

          <section class="suche__karte" aria-label="Karte">
            <div class="karte__rahmen">
              <div id="kartenflaeche"></div>
              <div class="karte__werkzeug">
                <button type="button" class="knopf knopf--still knopf--klein" data-tu="umkreis-modus">
                  ${ico('ziel')}${umkreisModus ? 'Punkt setzen: klicke in die Karte' : 'Umkreis festlegen'}</button>
              </div>
            </div>
          </section>
        </div>
      </div>`,
      danach() {
        const flaeche = U.$('#kartenflaeche');
        if (!flaeche) return;
        karte = NW.karte.erzeugen(flaeche, {
          onSelect: (id) => ui.gehe('objekt/' + id),
          onUmkreis: (p) => {
            const filter = S.get().filter;
            filter.umkreis = { lat: p.lat, lng: p.lng, km: filter.umkreis ? filter.umkreis.km : 3 };
            umkreisModus = false;
            S.set({ filter }, 'filter');
            ui.neuZeichnen();
          },
          umkreisModus
        });
        karte.setzen(letzteTreffer, null, S.get().filter.umkreis);
      }
    };
  }

  /* ------------------------- Aktionen ------------------------- */

  function filterAendern(patch) {
    const f = Object.assign(S.get().filter, patch);
    sichtbar = SEITE;
    S.set({ filter: f, filterBeruehrt: true }, 'filter');
  }

  const A_ = ui.aktionRegistrieren;

  A_('mehr-zeigen', () => {
    sichtbar += SEITE;
    aktualisieren();
    /* Fokus auf die erste neu geladene Karte, damit die Tastatur nicht springt. */
    const karten = U.$$('#ergebnisse .karte-inserat');
    const ziel = karten[Math.max(0, sichtbar - SEITE)];
    if (ziel) { const a = ziel.querySelector('a'); if (a) a.focus(); }
  });

  A_('art-um', (el) => {
    sichtbar = SEITE;
    const f = S.get().filter;
    const i = f.arten.indexOf(el.dataset.wert);
    if (i >= 0) { if (f.arten.length > 1) f.arten.splice(i, 1); }
    else f.arten.push(el.dataset.wert);
    S.set({ filter: f, filterBeruehrt: true }, 'filter');
    ui.neuZeichnen();
  });

  A_('such-text', U.debounce((el) => { filterAendern({ q: el.value }); aktualisieren(); }, 260));
  A_('such-leeren', () => { filterAendern({ q: '' }); ui.neuZeichnen(); });

  A_('filter-zahl', U.debounce((el) => {
    const wert = el.value === '' ? null : Number(el.value);
    const patch = {}; patch[el.dataset.feld] = (wert !== null && isNaN(wert)) ? null : wert;
    filterAendern(patch);
    aktualisieren();
  }, 300));

  A_('filter-wert', (el) => {
    const patch = {}; patch[el.dataset.feld] = el.value || null;
    filterAendern(patch);
    aktualisieren();
  });

  A_('filter-schalter', (el) => {
    const patch = {}; patch[el.dataset.feld] = el.checked;
    filterAendern(patch);
    aktualisieren();
  });

  A_('filter-chip', (el) => {
    sichtbar = SEITE;
    const f = S.get().filter;
    const feld = el.dataset.feld, wert = el.dataset.wert;
    const liste = f[feld] || [];
    const i = liste.indexOf(wert);
    if (i >= 0) liste.splice(i, 1); else liste.push(wert);
    f[feld] = liste;
    if (feld === 'staedte') f.viertel = f.viertel.filter((v) => f.staedte.indexOf(v.split('|')[0]) >= 0);
    S.set({ filter: f, filterBeruehrt: true }, 'filter');
    if (feld === 'staedte') ui.neuZeichnen();
    else { el.classList.toggle('is-an'); el.setAttribute('aria-pressed', el.classList.contains('is-an') ? 'true' : 'false'); aktualisieren(); }
  });

  A_('filter-wgrauchen', (el) => { filterAendern({ wgRauchen: el.checked ? 'rauchfrei' : null }); aktualisieren(); });
  A_('filter-wgtiere', (el) => { filterAendern({ wgHaustiere: el.checked ? 'erlaubt' : null }); aktualisieren(); });

  A_('filter-leeren', () => {
    const arten = S.get().filter.arten;
    const neu = A.leerFilter();
    neu.arten = arten;
    sichtbar = SEITE;
    S.set({ filter: neu, filterBeruehrt: false }, 'filter');
    ui.neuZeichnen();
    ui.toast('Filter zurückgesetzt.');
  });

  A_('filter-aus-profil', () => {
    const s = S.get();
    const neu = A.filterAusProfil(s.profil, s.filter);
    sichtbar = SEITE;
    S.set({ filter: neu, filterBeruehrt: true }, 'filter');
    ui.neuZeichnen();
    const treffer = A.filtern(NW.data.listings.concat(s.eigeneInserate), neu, s.profil).length;
    ui.toast('Filter aus deinem Profil übernommen – ' + treffer + ' ' + U.plural(treffer, 'Treffer', 'Treffer') + '.', 'gut');
  });

  A_('filter-abschicken', () => aktualisieren());

  A_('sortieren', (el) => { filterAendern({ sort: el.value }); ui.neuZeichnen(); });

  A_('ansicht', (el) => { S.set({ ansicht: el.dataset.wert }, 'ansicht'); ui.neuZeichnen(); });

  A_('filter-auf', () => {
    ui.dialog({
      titel: 'Filter',
      breit: true,
      inhalt: filterPanel(),
      fuss: h`<button type="button" class="knopf knopf--voll" data-tu="dialog-zu"><span
        id="treffer-anzahl">${U.num(letzteTreffer.length)}</span>&nbsp;Treffer zeigen</button>`,
      beimSchliessen: () => ui.neuZeichnen()
    });
  });

  A_('umkreis-modus', () => { umkreisModus = !umkreisModus; ui.neuZeichnen(); });
  A_('umkreis-weg', () => { filterAendern({ umkreis: null }); ui.neuZeichnen(); });
  A_('umkreis-radius', U.debounce((el) => {
    const f = S.get().filter;
    if (!f.umkreis) return;
    f.umkreis.km = Number(el.value);
    S.set({ filter: f }, 'filter');
    aktualisieren();
    const anzeige = el.closest('label').querySelector('span');
    if (anzeige) anzeige.textContent = U.dec(f.umkreis.km) + ' km um den gesetzten Punkt';
  }, 120));

  /* Eine Aktion für alle Lockerungen – sie rechnet dieselbe Änderung
     noch einmal, damit Knopf und Beschriftung nicht auseinanderfallen. */
  LOCKERUNGEN.forEach((eintrag) => {
    A_(eintrag.tu, () => {
      const f = S.get().filter;
      const treffer = pruefeLockerung(eintrag, f, zaehle(f));
      if (!treffer) { ui.toast('Das allein bringt keine weiteren Treffer.'); return; }
      eintrag.aendern(f, treffer.wert, JSON.parse(JSON.stringify(f)));
      sichtbar = SEITE;
      S.set({ filter: f, filterBeruehrt: true }, 'filter');
      ui.neuZeichnen();
      ui.toast(treffer.danach + ' ' + U.plural(treffer.danach, 'Treffer', 'Treffer') + ' nach der Änderung.', 'gut');
    });
  });

  A_('agent-aus-filter', () => {
    if (S.get().agenten.length >= P.grenze('suchauftraege')) {
      ui.AKTIONEN.sperre({ dataset: { leistung: 'suchauftraege' } });
      return;
    }
    const f = S.get().filter;
    const teile = [];
    if (f.staedte.length) teile.push(f.staedte.join('/'));
    if (f.viertel.length) teile.push(f.viertel.map((v) => v.split('|')[1]).join(', '));
    teile.push(f.arten.map((a) => ui.ART_LABEL[a]).join(' + '));
    if (f.preisMax) teile.push('bis ' + U.eur(f.preisMax));
    const vorschlag = teile.join(' · ') || 'Mein Suchauftrag';
    ui.dialog({
      titel: 'Suchauftrag anlegen',
      inhalt: h`<p>Nestwerk merkt sich diese Filter und zeigt dir beim nächsten Besuch, was seither neu hinzugekommen ist.</p>
        <label class="feld"><span>Name</span><input type="text" id="agent-name" value="${vorschlag}" maxlength="80"></label>
        <p class="hinweis">${A.filtern(NW.data.listings, f, S.get().profil).length} Objekte passen aktuell.</p>`,
      fuss: h`<button type="button" class="knopf knopf--still" data-tu="dialog-zu">Abbrechen</button>
        <button type="button" class="knopf" data-tu="agent-speichern">${ico('glocke')}Anlegen</button>`
    });
  });

  A_('agent-speichern', () => {
    const name = (U.$('#agent-name') || {}).value || 'Suchauftrag';
    if (!S.agentAnlegen(name, S.get().filter)) {
      ui.dialogZu();
      ui.AKTIONEN.sperre({ dataset: { leistung: 'suchauftraege' } });
      return;
    }
    ui.dialogZu();
    ui.toast('Suchauftrag angelegt. Beim nächsten Besuch steht hier, was neu ist.', 'gut');
    ui.aktualisiereZaehler();
  });

  ui.ansichten.suche = ansicht;
  NW.viewSuche = { aktualisieren };
})(window.NW = window.NW || {});
