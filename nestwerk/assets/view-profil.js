/* =====================================================================
   Nestwerk – Ansichten: Profil, Inserieren, Rechner
   Das Profil ist der Motor: Es bestimmt Reihenfolge, Passung, Kosten
   und den Text der Bewerbung. Alles bleibt auf diesem Gerät.
   ===================================================================== */
(function (NW) {
  'use strict';

  const U = NW.util, ui = NW.ui, A = NW.analyse, S = NW.store, M = NW.match, P = NW.plan;
  const h = U.html, raw = U.raw, ico = U.svg;

  /* ================================================================
     Profil
     ================================================================ */

  const GEWICHTE = [
    ['preis', 'Preis', 'Wie stark der Abstand zum Budget zählt'],
    ['lage', 'Lage', 'Wunschviertel gegenüber Wunschstadt'],
    ['groesse', 'Zuschnitt', 'Zimmerzahl und Fläche'],
    ['ausstattung', 'Ausstattung', 'Pflicht- und Wunschmerkmale'],
    ['energie', 'Energie', 'Verbrauch und Heizung'],
    ['pendeln', 'Arbeitsweg', 'Fahrzeit zu deinen Ankerpunkten'],
    ['fairness', 'Preis-Leistung', 'Abstand zur Vergleichsmiete']
  ];

  const UNTERLAGEN = [
    ['selbstauskunft', 'Selbstauskunft', 'Standardformular mit Angaben zu Person, Beruf, Einkommen'],
    ['gehaltsnachweise', 'Gehaltsnachweise', 'die letzten drei Abrechnungen'],
    ['schufa', 'Schufa-Bonitätsauskunft', 'nicht älter als drei Monate – erst nach der Besichtigung herausgeben'],
    ['mietschuldenfrei', 'Mietschuldenfreiheit', 'Bescheinigung der bisherigen Vermieterseite'],
    ['ausweis', 'Ausweiskopie', 'nur mit geschwärzter Nummer und erst bei ernsthaftem Interesse'],
    ['buergschaft', 'Bürgschaft', 'falls Einkommen oder Bonität nicht reichen'],
    ['wbs', 'Wohnberechtigungsschein', 'nur für geförderte Wohnungen nötig']
  ];

  function reglerZeile(feld, gruppe, label, links, rechts, wert, max) {
    return h`<div class="reglerzeile">
      <label for="r-${gruppe}-${feld}">${label}</label>
      <span class="reglerzeile__enden"><i>${links}</i><i>${rechts}</i></span>
      <input type="range" id="r-${gruppe}-${feld}" min="0" max="${max || 10}" step="1" value="${wert}"
        data-tu-input="profil-regler" data-gruppe="${gruppe}" data-feld="${feld}">
      <output>${wert}</output>
    </div>`;
  }

  function profil() {
    const s = S.get(), p = s.profil;
    const alleViertel = NW.geo.DISTRICTS;

    return {
      titel: 'Profil',
      html: h`<div class="seite seite--schmal">
        <header class="seite__kopf">
          <h1>${ico('person')}Dein Profil</h1>
          <p class="seite__unter">Nestwerk sortiert und rechnet ausschließlich mit diesen Angaben.
            Sie liegen im Speicher dieses Browsers – es gibt keinen Server und kein Konto.</p>
          <p class="gespeichert" id="profil-gespeichert" aria-live="polite">${ico('speichern')}Änderungen werden sofort übernommen</p>
        </header>

        <section class="block">
          <h2>Über dich</h2>
          <div class="formraster">
            <label class="feld"><span>Name</span>
              <input type="text" data-tu-change="profil-text" data-feld="name" value="${p.name}" placeholder="Vorname Nachname"></label>
            <label class="feld"><span>Alter</span>
              <input type="number" min="16" max="99" data-tu-change="profil-zahl" data-feld="alter" value="${p.alter || ''}"></label>
            <label class="feld"><span>Geschlecht (für WG-Suchen)</span>
              <select data-tu-change="profil-text" data-feld="geschlecht">
                ${[['egal', 'keine Angabe'], ['w', 'weiblich'], ['m', 'männlich'], ['d', 'nichtbinär']].map((o) =>
        h`<option value="${o[0]}" ${p.geschlecht === o[0] ? 'selected' : ''}>${o[1]}</option>`)}
              </select></label>
            <label class="feld"><span>Beruf oder Tätigkeit</span>
              <input type="text" data-tu-change="profil-text" data-feld="beruf" value="${p.beruf}" placeholder="z. B. Erzieherin"></label>
            <label class="feld"><span>Personen im Haushalt</span>
              <input type="number" min="1" max="6" data-tu-change="profil-zahl" data-feld="haushalt" value="${p.haushalt}"></label>
            <label class="feld"><span>Nettoeinkommen im Monat</span>
              <input type="number" min="0" step="50" data-tu-change="profil-zahl" data-feld="nettoEinkommen" value="${p.nettoEinkommen}"></label>
            <label class="feld"><span>Haustiere</span>
              <select data-tu-change="profil-text" data-feld="haustiere">
                ${[['keine', 'keine'], ['katze', 'Katze'], ['hund', 'Hund'], ['klein', 'Kleintier']].map((o) =>
          h`<option value="${o[0]}" ${p.haustiere === o[0] ? 'selected' : ''}>${o[1]}</option>`)}
              </select></label>
            <label class="schalter"><input type="checkbox" data-tu-change="profil-schalter" data-feld="raucher" ${p.raucher ? 'checked' : ''}>
              <span>ich rauche</span></label>
          </div>
          ${p.nettoEinkommen ? h`<p class="fein">Nach der 30-Prozent-Faustregel liegt deine Obergrenze bei rund
            <b>${U.eur(Math.round(p.nettoEinkommen * 0.3))}</b> Warmmiete. Viele Vermieter rechnen zusätzlich mit
            dem Dreifachen der Kaltmiete als Mindesteinkommen.</p>` : ''}
        </section>

        <section class="block">
          <h2>Was du suchst</h2>
          <div class="formraster">
            <label class="feld"><span>Budget Warmmiete</span>
              <input type="number" min="0" step="50" data-tu-change="profil-zahl" data-feld="budgetWarm" value="${p.budgetWarm}"></label>
            <label class="feld"><span>Budget Kaufpreis</span>
              <input type="number" min="0" step="10000" data-tu-change="profil-zahl" data-feld="budgetKauf" value="${p.budgetKauf || ''}" placeholder="nur bei Kaufinteresse"></label>
            <label class="feld"><span>Zimmer mindestens</span>
              <input type="number" min="1" max="8" step="0.5" data-tu-change="profil-zahl" data-feld="zimmerMin" value="${p.zimmerMin}"></label>
            <label class="feld"><span>Fläche mindestens (m²)</span>
              <input type="number" min="10" max="300" data-tu-change="profil-zahl" data-feld="flaecheMin" value="${p.flaecheMin}"></label>
            <label class="feld"><span>Einzug ab</span>
              <input type="date" data-tu-change="profil-text" data-feld="einzugAb" value="${p.einzugAb || ''}"></label>
          </div>

          <fieldset class="filter__gruppe"><legend>Städte</legend>
            <div class="chips">
              ${NW.data.staedte.map((c) => h`<button type="button" class="chip ${p.staedte.indexOf(c) >= 0 ? 'is-an' : ''}"
                aria-pressed="${p.staedte.indexOf(c) >= 0 ? 'true' : 'false'}"
                data-tu="profil-chip" data-feld="staedte" data-wert="${c}">${c}</button>`)}
            </div>
          </fieldset>

          <fieldset class="filter__gruppe"><legend>Muss vorhanden sein</legend>
            <div class="chips">
              ${NW.data.AUSSTATTUNG.slice(0, 22).map((a) => h`<button type="button" class="chip ${p.mussHaben.indexOf(a) >= 0 ? 'is-an' : ''}"
                aria-pressed="${p.mussHaben.indexOf(a) >= 0 ? 'true' : 'false'}"
                data-tu="profil-chip" data-feld="mussHaben" data-wert="${a}">${a}</button>`)}
            </div>
            <p class="fein">Fehlt ein Pflichtmerkmal, rutscht das Inserat deutlich nach unten – aber es verschwindet nicht.</p>
          </fieldset>

          <fieldset class="filter__gruppe"><legend>Wäre schön</legend>
            <div class="chips">
              ${NW.data.AUSSTATTUNG.slice(0, 22).map((a) => h`<button type="button" class="chip ${p.schoenWaere.indexOf(a) >= 0 ? 'is-an' : ''}"
                aria-pressed="${p.schoenWaere.indexOf(a) >= 0 ? 'true' : 'false'}"
                data-tu="profil-chip" data-feld="schoenWaere" data-wert="${a}">${a}</button>`)}
            </div>
          </fieldset>
        </section>

        <section class="block">
          <h2>${ico('zug')}Ankerpunkte für den Arbeitsweg</h2>
          <p class="block__unter">Statt Luftlinie rechnet Nestwerk die Fahrzeit zu den Orten, an denen du regelmäßig
            sein musst – Arbeit, Uni, Kita, Familie.</p>
          ${p.anker.length ? h`<ul class="anker">
            ${p.anker.map((a, i) => h`<li>
              ${ico('ziel')}
              <div><b>${a.name}</b><span>${a.viertel}, ${a.stadt}</span></div>
              <button type="button" class="ikon-btn" data-tu="anker-weg" data-i="${i}" aria-label="Entfernen">${ico('muell')}</button>
            </li>`)}
          </ul>` : ''}
          <div class="formraster formraster--drei">
            <label class="feld"><span>Bezeichnung</span>
              <input type="text" id="anker-name" placeholder="Arbeit, Uni, Kita…"></label>
            <label class="feld"><span>Ort</span>
              <select id="anker-ort">
                ${NW.geo.DISTRICTS.map((d) => h`<option value="${d.key}">${d.city} – ${d.name}</option>`)}
              </select></label>
            <div class="feld feld--knopf">
              <button type="button" class="knopf knopf--still" data-tu="anker-neu">${ico('plus')}Hinzufügen</button>
            </div>
          </div>
          ${p.anker.length >= P.grenze('anker') ? h`<p class="filter__hinweis">${ico('schloss')}
            Im freien Tarif ist ein Ankerpunkt möglich. <a href="#/plus">Mit Plus beliebig viele</a> –
            praktisch, wenn Arbeit, Kita und Familie in verschiedenen Ecken liegen.</p>` : ''}
          <label class="feld"><span>Verkehrsmittel für die Rechnung</span>
            <select data-tu-change="profil-text" data-feld="verkehrsmittel">
              ${Object.keys(U.TRAVEL).map((k) => h`<option value="${k}" ${p.verkehrsmittel === k ? 'selected' : ''}>${U.TRAVEL[k].label}</option>`)}
            </select></label>
        </section>

        <section class="block">
          <h2>${ico('ziel')}Was dir wichtig ist</h2>
          <p class="block__unter">Diese Regler bestimmen die Reihenfolge deiner Suchergebnisse. Kein Anbieter kann
            sich hier nach oben kaufen.</p>
          <div class="regler">
            ${GEWICHTE.map((g) => h`<div class="reglerzeile">
              <label for="r-gewichtung-${g[0]}">${g[1]}<i>${g[2]}</i></label>
              <input type="range" id="r-gewichtung-${g[0]}" min="0" max="5" step="1" value="${p.gewichtung[g[0]]}"
                data-tu-input="profil-regler" data-gruppe="gewichtung" data-feld="${g[0]}">
              <output>${p.gewichtung[g[0]]}</output>
            </div>`)}
          </div>
          <p><button type="button" class="link" data-tu="gewichtung-zurueck">auf Standard zurücksetzen</button></p>
        </section>

        <section class="block">
          <h2>${ico('wg')}Dein WG-Profil</h2>
          <p class="block__unter">Sechs Fragen, aus denen sich die Passung zu jeder WG errechnet.
            Es gibt kein Richtig – ehrlich ist besser als sympathisch.</p>
          <div class="regler">
            ${M.DIMENSIONEN.map((d) => reglerZeile(d.key, 'lifestyle', d.label, d.links2 || d.links, d.rechts, p.lifestyle[d.key], 10))}
          </div>
        </section>

        ${NW.konto && NW.konto.angemeldet() ? (() => {
        const k = NW.konto.aktuell();
        const st = NW.konto.stufe(k.stufe);
        return h`<section class="block">
          <div class="block__kopfzeile">
            <h2>${ico('person')}Konto</h2>
            ${ui.badge(st.name, st.ton)}
          </div>
          <p class="block__unter">Angemeldet als <b>${NW.konto.anzeigeName()}</b>${k.mail ? ' · ' + k.mail : ''}.
            Die Vertrauensstufe zählt vor allem, wenn du selbst inserierst – andere sehen sie an deinem Angebot.</p>
          <p class="werkzeug__weiter">
            <a class="knopf knopf--still" href="#/konto">${ico('schloss')}Konto und Vertrauensstufe</a></p>
        </section>`;
      })() : ''}

        <section class="block">
          <h2>${ico('blatt')}Bewerbermappe</h2>
          <p class="block__unter">Wer die Unterlagen parat hat, bewirbt sich in Minuten statt in Tagen.
            Hak ab, was bei dir bereitliegt.</p>
          <ul class="mappe mappe--gross">
            ${UNTERLAGEN.map((u) => h`<li>
              <label class="schalter">
                <input type="checkbox" data-tu-change="profil-unterlage" data-feld="${u[0]}" ${p.unterlagen[u[0]] ? 'checked' : ''}>
                <span><b>${u[1]}</b><i>${u[2]}</i></span>
              </label>
            </li>`)}
          </ul>
          <div class="hinweisbox">${ico('info')}
            <div><b>Datensparsam bewerben</b>
            <p>Vor der Besichtigung darf niemand Schufa, Kontoauszüge, Ausweiskopie oder Angaben zu Familienplanung,
              Religion oder Vorstrafen verlangen. Solche Fragen dürfen im Zweifel falsch beantwortet werden, ohne dass
              der Vertrag angreifbar wird. Erst wenn die Wohnung ernsthaft in Betracht kommt, sind Einkommensnachweise
              und Schufa üblich.</p></div>
          </div>
          <p class="werkzeug__weiter">
            <a class="knopf knopf--still" href="#/tresor">${ico('schloss')}Unterlagen verschlüsselt ablegen</a>
          </p>
          <p class="fein">Im Dokumententresor liegen die Dateien verschlüsselt. Beim Bewerben verschickst du
            dann keinen Anhang, sondern einen Verweis, der nach gesetzter Frist erlischt und sich widerrufen
            lässt. Was dort liegt, wird hier automatisch abgehakt.</p>
        </section>

        <section class="block">
          <h2>Kurze Vorstellung</h2>
          <p class="block__unter">Zwei bis drei Sätze über dich. Nestwerk baut sie in jedes Anschreiben ein.</p>
          <label class="feld"><span class="nur-sr">Vorstellung</span>
            <textarea rows="4" data-tu-change="profil-text" data-feld="vorstellung"
              placeholder="Zum Beispiel: Ich arbeite seit vier Jahren fest bei …, bin ruhig, nicht rauchend und suche etwas Langfristiges.">${p.vorstellung}</textarea></label>
        </section>

        <section class="block block--betont">
          <h2>${ico('pruefen')}Wie vollständig ist dein Profil?</h2>
          ${(() => {
        const punkte = [
          ['Name', !!p.name], ['Alter', !!p.alter], ['Beruf', !!p.beruf],
          ['Einkommen', !!p.nettoEinkommen], ['Budget', !!p.budgetWarm], ['Städte', p.staedte.length > 0],
          ['Ankerpunkt', p.anker.length > 0], ['Vorstellung', !!p.vorstellung],
          ['Unterlagen', Object.keys(p.unterlagen).filter((k) => p.unterlagen[k]).length >= 3]
        ];
        const da = punkte.filter((x) => x[1]).length;
        return h`<div class="fortschritt">
              <div class="fortschritt__spur"><i style="width:${Math.round(da / punkte.length * 100)}%"></i></div>
              <b>${da} von ${punkte.length}</b>
            </div>
            <ul class="mappe">
              ${punkte.map((x) => h`<li class="${x[1] ? 'is-da' : ''}">${ico(x[1] ? 'check' : 'x')}${x[0]}</li>`)}
            </ul>`;
      })()}
        </section>
      </div>`
    };
  }

  /* ================================================================
     Inserieren
     ================================================================ */

  /* ------------------------- Inserieren -------------------------

     Sechs Angebotsarten aus zwei Merkmalen: kind (miete, kauf, wg,
     tausch) und type (wohnung, haus, zimmer, grundstueck). Die Tabelle
     hält beides zusammen und sagt zugleich, welche Feldgruppen die Art
     braucht – sonst müsste jede Stelle im Formular ihre eigene Bedingung
     mitschleppen und würde bei der siebten Art vergessen. */
  const ARTEN = [
    { id: 'miete', kind: 'miete', type: 'wohnung', icon: 'schluessel', label: 'Wohnung vermieten',
      gruppen: ['wohnung', 'miete'] },
    { id: 'wg', kind: 'wg', type: 'zimmer', icon: 'wg', label: 'WG-Zimmer',
      gruppen: ['wohnung', 'miete'] },
    { id: 'tausch', kind: 'tausch', type: 'wohnung', icon: 'tausch', label: 'Wohnung tauschen',
      gruppen: ['wohnung', 'miete', 'tausch'] },
    { id: 'kauf-wohnung', kind: 'kauf', type: 'wohnung', icon: 'haus', label: 'Wohnung verkaufen',
      gruppen: ['wohnung', 'kauf'] },
    { id: 'kauf-haus', kind: 'kauf', type: 'haus', icon: 'dach', label: 'Haus verkaufen',
      gruppen: ['wohnung', 'kauf', 'haus'] },
    { id: 'kauf-grundstueck', kind: 'kauf', type: 'grundstueck', icon: 'karte', label: 'Grundstück verkaufen',
      gruppen: ['kauf', 'grundstueck'] }
  ];

  const artNach = (id) => ARTEN.find((a) => a.id === id) || ARTEN[0];

  /* ------------------------- Bilder zum Inserat -------------------------

     Ein Inserat ohne Fotos wird kaum angeklickt – das gilt beim Vermieten
     wie beim Verkaufen. Die Dateien bleiben auf diesem Gerät, deshalb
     werden sie vor dem Ablegen verkleinert: Ein Foto aus einer heutigen
     Kamera hat gut vier Megabyte, und der Speicher eines Browsers fasst
     insgesamt oft nur fünf. Verkleinert auf 1.400 Pixel Kantenlänge und
     als JPEG mit 78 Prozent Güte bleiben davon rund 150 Kilobyte, ohne
     dass man den Unterschied sieht. */

  const BILD_MAX = 10;
  const BILD_KANTE = 1400;
  const BILD_GUETE = 0.78;
  const BILD_TYPEN = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];

  /* Zwischenspeicher, solange das Formular offen ist. */
  let neueBilder = [];

  function verkleinern(datei) {
    return new Promise((gut, schlecht) => {
      const url = URL.createObjectURL(datei);
      const bild = new Image();
      bild.onload = () => {
        try {
          const faktor = Math.min(1, BILD_KANTE / Math.max(bild.naturalWidth, bild.naturalHeight));
          const b = Math.max(1, Math.round(bild.naturalWidth * faktor));
          const hh = Math.max(1, Math.round(bild.naturalHeight * faktor));
          const leinwand = document.createElement('canvas');
          leinwand.width = b; leinwand.height = hh;
          const stift = leinwand.getContext('2d');
          stift.drawImage(bild, 0, 0, b, hh);
          URL.revokeObjectURL(url);
          gut({ datei: leinwand.toDataURL('image/jpeg', BILD_GUETE), breite: b, hoehe: hh, text: '' });
        } catch (e) { URL.revokeObjectURL(url); schlecht(e); }
      };
      bild.onerror = () => { URL.revokeObjectURL(url); schlecht(new Error('Die Datei ließ sich nicht lesen.')); };
      bild.src = url;
    });
  }

  const bildGroesse = (b) => Math.round(b.datei.length * 0.75 / 1024) + ' kB';

  function bilderBlock() {
    return h`<fieldset class="filter__gruppe bilder"><legend>Fotos</legend>
      <p class="fein">Inserate mit Fotos werden deutlich häufiger geöffnet. Bis zu ${BILD_MAX} Bilder,
        JPG, PNG, WEBP oder HEIC. Das erste ist das Titelbild.</p>
      <div class="bilder__wahl">
        <input type="file" id="inserat-bilder" class="nur-sr" accept="image/*" multiple
          data-tu-change="inserat-bilder">
        <label for="inserat-bilder" class="knopf knopf--still">${ico('plus')}Bilder hochladen</label>
        <i id="inserat-bilder-zahl">${neueBilder.length
      ? neueBilder.length + ' ' + U.plural(neueBilder.length, 'Bild', 'Bilder') + ' gewählt'
      : 'noch keine gewählt'}</i>
      </div>
      <ul class="bilder__liste" id="inserat-bilder-liste">${bilderListe()}</ul>
      <p class="fein">Die Bilder werden beim Ablegen auf ${U.num(BILD_KANTE)} Pixel Kantenlänge verkleinert und
        bleiben im Speicher dieses Geräts. Sie werden nirgendwohin übertragen – es gibt keinen Server.</p>
      <div class="hinweisbox">${ico('warnung')}
        <div><b>Was auf ein Inseratsfoto nicht gehört</b>
        <p>Keine Personen ohne deren Einwilligung, keine Kennzeichen, keine Namensschilder an Klingel oder
          Briefkasten, keine Post auf dem Tisch. Wer die Wohnung noch bewohnt, sollte vorher gefragt werden:
          Fotos der Innenräume dürfen ohne Zustimmung der Mietpartei nicht veröffentlicht werden.</p></div>
      </div>
    </fieldset>`;
  }

  function bilderListe() {
    if (!neueBilder.length) return '';
    return h`${neueBilder.map((b, i) => h`<li>
      <img src="${b.datei}" alt="Vorschau ${i + 1}">
      <div>
        <b>${i === 0 ? 'Titelbild' : 'Bild ' + (i + 1)}</b>
        <span>${b.breite} × ${b.hoehe} · ${bildGroesse(b)}</span>
        <input type="text" class="bilder__text" data-tu-input="inserat-bildtext" data-i="${i}"
          value="${b.text || ''}" placeholder="Bildunterschrift (freiwillig)"
          aria-label="Bildunterschrift für Bild ${i + 1}">
      </div>
      <span class="bilder__tun">
        <button type="button" class="ikon-btn" data-tu="inserat-bild-vor" data-i="${i}"
          ${i === 0 ? 'disabled' : ''} aria-label="Bild ${i + 1} nach vorn">${ico('zurueck')}</button>
        <button type="button" class="ikon-btn" data-tu="inserat-bild-weg" data-i="${i}"
          aria-label="Bild ${i + 1} entfernen">${ico('muell')}</button>
      </span>
    </li>`)}`;
  }

  function inserieren() {
    const s = S.get();
    return {
      titel: 'Inserieren',
      html: h`<div class="seite seite--schmal">
        <header class="seite__kopf">
          <h1>${ico('plus')}Inserat aufgeben</h1>
          <p class="seite__unter">Vermieten, verkaufen, ein Zimmer anbieten oder tauschen – ein Formular für
            alles. Das Inserat bleibt auf diesem Gerät und taucht in deiner Suche, in der Karte und im
            Ringtausch auf.</p>
        </header>

        ${s.eigeneInserate.length ? h`<section class="block">
          <h2>Deine Inserate</h2>
          <ul class="eigene">
            ${s.eigeneInserate.map((e) => {
        const b = e.boost, prod = b ? P.hervorhebung(b.art) : null;
        const laeuft = P.boostAktiv(e);
        return h`<li>
              <div>
                <b><a href="#/objekt/${e.id}">${U.truncate(e.titel, 46)}</a>
                  ${laeuft && prod ? ui.badge(prod.name, 'info', prod.icon) : ''}</b>
                <span>${ui.artLabel(e)} · ${e.viertel}, ${e.stadt} · seit ${U.since(e.erstellt)}${laeuft && b.bis
          ? ' · hervorgehoben bis ' + U.dateDE(b.bis) : ''}</span>
              </div>
              <button type="button" class="knopf knopf--klein knopf--still" data-tu="hervorheben" data-id="${e.id}">
                ${ico('blitz')}${laeuft ? 'Ändern' : 'Hervorheben'}</button>
              <button type="button" class="ikon-btn" data-tu="inserat-weg" data-id="${e.id}" aria-label="Löschen">${ico('muell')}</button>
            </li>`;
      })}
          </ul>
          <p class="fein">Hervorgehobene Inserate stehen in einem eigenen, als bezahlt gekennzeichneten Block
            über den Treffern – nie zwischen ihnen. Die Reihenfolge der Suche bleibt unberührt.</p>
        </section>` : ''}

        <form class="block" data-tu-submit="inserat-speichern" id="inserat-form">
          <h2>Neues Inserat</h2>

          <fieldset class="filter__gruppe"><legend>Art des Angebots</legend>
            <div class="chips">
              ${ARTEN.map((o, i) =>
        h`<label class="chip chip--radio"><input type="radio" name="art" value="${o.id}" ${i === 0 ? 'checked' : ''}
                  data-tu-change="inserat-art"> ${ico(o.icon)}${o.label}</label>`)}
            </div>
          </fieldset>

          <div class="formraster" data-gruppe="ort">
            <label class="feld"><span>Stadt und Viertel</span>
              <select name="viertelKey" required>
                ${NW.geo.DISTRICTS.map((d) => h`<option value="${d.key}">${d.city} – ${d.name}</option>`)}
              </select></label>
            <label class="feld"><span>Straße (ungefähr)</span>
              <input type="text" name="strasse" placeholder="Nähe Beispielstraße"></label>
          </div>

          <div class="formraster" data-gruppe="wohnung">
            <label class="feld"><span>Zimmer</span>
              <input type="number" name="zimmer" min="1" max="9" step="0.5" value="2"></label>
            <label class="feld"><span>Wohnfläche in m²</span>
              <input type="number" name="flaeche" min="8" max="900" value="60"></label>
            <label class="feld"><span>Etage</span>
              <input type="number" name="etage" min="0" max="20" value="1"></label>
            <label class="feld"><span>Etagen im Haus</span>
              <input type="number" name="etagen" min="1" max="25" value="4"></label>
            <label class="feld"><span>Baujahr</span>
              <input type="number" name="baujahr" min="1800" max="2030" value="1965"></label>
            <label class="feld"><span>Heizung</span>
              <select name="heizung">
                ${['Gas-Zentralheizung', 'Fernwärme', 'Wärmepumpe', 'Öl-Zentralheizung', 'Gasetagenheizung', 'Pelletheizung'].map((x) =>
        h`<option>${x}</option>`)}
              </select></label>
          </div>

          <div class="formraster" data-gruppe="haus">
            <label class="feld"><span>Grundstücksfläche in m²</span>
              <input type="number" name="grundstueck" min="0" max="20000" value="420"></label>
            <label class="feld"><span>Bauweise</span>
              <select name="bauweise">
                ${['freistehend', 'Doppelhaushälfte', 'Reihenmittelhaus', 'Reihenendhaus', 'Bungalow', 'Stadtvilla'].map((x) =>
          h`<option>${x}</option>`)}
              </select></label>
          </div>

          <div class="formraster" data-gruppe="grundstueck">
            <label class="feld"><span>Grundstücksfläche in m²</span>
              <input type="number" name="gflaeche" min="30" max="100000" value="600"></label>
            <label class="feld"><span>Art des Grundstücks</span>
              <select name="baulandArt">
                ${['Bauland, voll erschlossen', 'Bauland, teilerschlossen', 'Bauland, unerschlossen',
            'Bauerwartungsland', 'Gartenland', 'Wohnbaugrundstück mit Altbestand'].map((x) => h`<option>${x}</option>`)}
              </select></label>
            <label class="feld"><span>Bebauungsplan</span>
              <select name="bplan">
                ${['liegt vor', 'im Verfahren', 'kein Bebauungsplan – § 34 BauGB', 'Außenbereich – § 35 BauGB'].map((x) =>
            h`<option>${x}</option>`)}
              </select></label>
            <label class="feld"><span>Grundflächenzahl (GRZ)</span>
              <input type="number" name="grz" min="0" max="1" step="0.05" value="0.4"></label>
            <label class="feld"><span>Geschossflächenzahl (GFZ)</span>
              <input type="number" name="gfz" min="0" max="3" step="0.1" value="0.8"></label>
            <label class="feld"><span>Erschließungskosten</span>
              <select name="erschliessung">
                ${['bereits bezahlt', 'noch offen', 'anteilig offen', 'unbekannt'].map((x) => h`<option>${x}</option>`)}
              </select></label>
          </div>

          <div class="formraster" data-gruppe="miete">
            <label class="feld"><span>Kaltmiete</span>
              <input type="number" name="kalt" min="0" step="10" value="750"></label>
            <label class="feld"><span>Nebenkosten</span>
              <input type="number" name="nebenkosten" min="0" step="10" value="140"></label>
            <label class="feld"><span>Heizkosten</span>
              <input type="number" name="heizkosten" min="0" step="10" value="90"></label>
            <label class="feld"><span>Kaution in Kaltmieten</span>
              <input type="number" name="kaution" min="0" max="3" value="3"></label>
            <label class="feld"><span>Frei ab</span>
              <input type="date" name="freiAb" value="${U.isoDate(U.addDays(NW.now(), 30))}"></label>
          </div>

          <div class="formraster" data-gruppe="kauf">
            <label class="feld"><span>Kaufpreis</span>
              <input type="number" name="kaufpreis" min="0" step="1000" value="350000"></label>
            <label class="feld"><span>Käuferprovision in Prozent</span>
              <input type="number" name="provision" min="0" max="8" step="0.01" value="0"></label>
            <label class="feld" data-gruppe="wohnung"><span>Hausgeld im Monat</span>
              <input type="number" name="hausgeld" min="0" step="10" value="260"></label>
            <label class="feld"><span>Bezugsfrei ab</span>
              <input type="date" name="freiAbKauf" value="${U.isoDate(U.addDays(NW.now(), 90))}"></label>
          </div>

          <div class="hinweisbox" data-gruppe="kauf">${ico('info')}
            <div><b>Provision und Kosten beim Kauf</b>
            <p>Seit dem 23. Dezember 2020 gilt bei Wohnungen und Einfamilienhäusern an Verbraucher: Die
              Maklerprovision wird geteilt, und die Käuferseite zahlt höchstens so viel wie die Verkäuferseite
              (§§ 656c, 656d BGB). Für Grundstücke und Mehrfamilienhäuser gilt das nicht. Nestwerk rechnet die
              Nebenkosten des Erwerbs – Grunderwerbsteuer nach Bundesland, Notar und Grundbuch – bei jedem
              Angebot durch und zeigt sie neben dem Kaufpreis.</p></div>
          </div>

          <fieldset class="filter__gruppe" data-gruppe="wohnung"><legend>Ausstattung</legend>
            <div class="chips">
              ${NW.data.AUSSTATTUNG.slice(0, 22).map((a) =>
              h`<label class="chip chip--radio"><input type="checkbox" name="ausstattung" value="${a}"> ${a}</label>`)}
            </div>
          </fieldset>

          <fieldset class="filter__gruppe" data-gruppe="tausch"><legend>Tauschwunsch</legend>
            <label class="feld"><span>Grund für den Tausch</span>
              <input type="text" name="grund" placeholder="z. B. neuer Job in Leipzig"></label>
            <div class="chips">
              ${NW.data.staedte.map((c) =>
                h`<label class="chip chip--radio"><input type="checkbox" name="wunschStadt" value="${c}"> ${c}</label>`)}
            </div>
            <div class="formraster">
              <label class="feld"><span>Zimmer mindestens</span><input type="number" name="tZimmer" min="1" step="0.5" value="2"></label>
              <label class="feld"><span>Fläche mindestens</span><input type="number" name="tFlaeche" min="10" value="55"></label>
              <label class="feld"><span>Warmmiete höchstens</span><input type="number" name="tWarm" min="0" step="50" value="1100"></label>
            </div>
            <label class="schalter"><input type="checkbox" name="ringOk" checked><span>auch Ringtausch über mehrere Haushalte</span></label>
          </fieldset>

          ${bilderBlock()}

          <label class="feld"><span>Beschreibung</span>
            <textarea name="beschreibung" rows="5" placeholder="Was sollte man über die Wohnung und die Nachbarschaft wissen?"></textarea></label>

          <div class="hinweisbox">${ico('info')}
            <div><b>Was du nicht schreiben darfst</b>
            <p>Formulierungen, die nach Herkunft, Religion, Geschlecht, Behinderung oder Alter aussortieren, sind
              nach dem Allgemeinen Gleichbehandlungsgesetz unzulässig. Bei WG-Zimmern in der eigenen Wohnung ist die
              Auswahl freier – trotzdem gilt: Beschreibe die WG, nicht wen du ausschließt.</p></div>
          </div>

          <button type="submit" class="knopf knopf--voll">${ico('speichern')}Inserat anlegen</button>
        </form>
      </div>`,
      /* Die Feldgruppen richten sich nach der Art. Beim ersten Aufbau
         muss das einmal von Hand geschehen – danach erledigt es der
         Wechsel der Auswahl. */
      danach() { gruppenZeigen((U.$('input[name="art"]:checked') || {}).value || 'miete'); }
    };
  }

  /* ================================================================
     Rechner: mieten oder kaufen
     ================================================================ */

  const R_VORGABE = {
    kaufpreis: 420000, flaeche: 85, eigenkapital: 90000, zins: 3.7, tilgung: 2.0,
    bundesland: 'NRW', makler: 3.57, miete: 1150, mietsteigerung: 2.0,
    wertsteigerung: 1.5, anlage: 4.0, hausgeld: 290, instand: 1.0, jahre: 15
  };
  let rWerte = Object.assign({}, R_VORGABE);

  function rechnen(w) {
    const grest = A.GRUNDERWERB[w.bundesland] || 6;
    const nebenkosten = w.kaufpreis * (grest + 2 + w.makler) / 100;
    const gesamt = w.kaufpreis + nebenkosten;
    const darlehen = Math.max(0, gesamt - w.eigenkapital);
    const rate = darlehen * (w.zins + w.tilgung) / 100 / 12;
    const mZins = w.zins / 100 / 12;

    let rest = darlehen, zinsSumme = 0;
    let wert = w.kaufpreis;
    let depot = Math.max(0, w.eigenkapital - 0);  /* Mieter legt das Eigenkapital an */
    let miete = w.miete;
    let mieteGesamt = 0, kaeuferAusgaben = 0;
    const mAnlage = w.anlage / 100 / 12;
    const mWert = w.wertsteigerung / 100 / 12;
    const verlauf = [];

    for (let m = 1; m <= w.jahre * 12; m++) {
      /* Käufer */
      const z = rest * mZins;
      const tilg = Math.max(0, rate - z);
      if (rest > 0) { zinsSumme += z; rest = Math.max(0, rest - tilg); }
      const instandMonat = w.kaufpreis * w.instand / 100 / 12;
      const kaeuferMonat = (rest > 0 || tilg > 0 ? rate : 0) + w.hausgeld + instandMonat;
      kaeuferAusgaben += kaeuferMonat;
      wert *= (1 + mWert);

      /* Mieter: zahlt Miete, legt die Differenz an */
      mieteGesamt += miete;
      const differenz = kaeuferMonat - miete;
      depot = depot * (1 + mAnlage) + Math.max(0, differenz);
      if (differenz < 0) depot += differenz;   /* Miete teurer als Kauf: Depot schrumpft */
      if (depot < 0) depot = 0;
      if (m % 12 === 0) {
        miete *= (1 + w.mietsteigerung / 100);
        verlauf.push({
          jahr: m / 12,
          kaeufer: Math.round(wert - rest),
          mieter: Math.round(depot)
        });
      }
    }

    return {
      nebenkosten: Math.round(nebenkosten), gesamt: Math.round(gesamt), darlehen: Math.round(darlehen),
      rate: Math.round(rate), restschuld: Math.round(rest), zinsSumme: Math.round(zinsSumme),
      immobilienwert: Math.round(wert),
      vermoegenKauf: Math.round(wert - rest),
      vermoegenMiete: Math.round(depot),
      kaeuferAusgaben: Math.round(kaeuferAusgaben), mieteGesamt: Math.round(mieteGesamt),
      erstesJahrRate: Math.round(rate + w.hausgeld + w.kaufpreis * w.instand / 100 / 12),
      verlauf, grest
    };
  }

  function verlaufGrafik(v) {
    if (!v.length) return '';
    const max = Math.max.apply(null, v.map((p) => Math.max(p.kaeufer, p.mieter, 1)));
    const min = Math.min.apply(null, v.map((p) => Math.min(p.kaeufer, p.mieter, 0)));
    const B = 640, H = 240, links = 62, unten = 24, pad = 10;
    const x = (i) => links + i / Math.max(1, v.length - 1) * (B - links - pad);
    const y = (val) => H - unten - (val - min) / Math.max(1, max - min) * (H - unten - pad);
    const linie = (feld) => v.map((p, i) => (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(p[feld]).toFixed(1)).join('');

    /* Waagerechte Hilfslinien mit Beschriftung in Tausend Euro. */
    let raster = '';
    const stufen = 4;
    for (let i = 0; i <= stufen; i++) {
      const wert = min + (max - min) * i / stufen;
      const yy = y(wert).toFixed(1);
      raster += '<line x1="' + links + '" y1="' + yy + '" x2="' + (B - pad) + '" y2="' + yy +
        '" stroke="currentColor" opacity="' + (i === 0 ? '.32' : '.12') + '"/>' +
        '<text class="verlauf__achse" x="' + (links - 8) + '" y="' + (Number(yy) + 4) + '" text-anchor="end">' +
        U.num(Math.round(wert / 1000)) + 'k</text>';
    }

    /* Jahresmarken, höchstens sechs, damit es lesbar bleibt. */
    const schritt = Math.max(1, Math.ceil(v.length / 6));
    let jahre = '';
    v.forEach((p, i) => {
      if (i % schritt && i !== v.length - 1) return;
      jahre += '<text class="verlauf__achse" x="' + x(i).toFixed(1) + '" y="' + (H - 7) + '" text-anchor="middle">' +
        p.jahr + '</text>';
    });
    jahre += '<text class="verlauf__achse" x="' + (B - pad) + '" y="' + (H - 7) +
      '" text-anchor="end" opacity=".7">Jahre</text>';

    const letzte = v[v.length - 1];
    return raw('<svg class="verlauf" viewBox="0 0 ' + B + ' ' + H + '" role="img" ' +
      'aria-label="Vermögensentwicklung: nach ' + letzte.jahr + ' Jahren ' + U.eur(letzte.kaeufer) +
      ' mit Kauf gegenüber ' + U.eur(letzte.mieter) + ' mit Miete und Anlage">' +
      raster + jahre +
      '<path d="' + linie('mieter') + '" fill="none" stroke="var(--akzent2)" stroke-width="2.6" stroke-linejoin="round"/>' +
      '<path d="' + linie('kaeufer') + '" fill="none" stroke="var(--akzent)" stroke-width="2.6" stroke-linejoin="round"/>' +
      '<circle cx="' + x(v.length - 1).toFixed(1) + '" cy="' + y(letzte.kaeufer).toFixed(1) + '" r="4.5" fill="var(--akzent)"/>' +
      '<circle cx="' + x(v.length - 1).toFixed(1) + '" cy="' + y(letzte.mieter).toFixed(1) + '" r="4.5" fill="var(--akzent2)"/>' +
      '</svg>');
  }

  function rechnerOben(w, e) {
    const vorne = e.vermoegenKauf > e.vermoegenMiete;
    const abstand = Math.abs(e.vermoegenKauf - e.vermoegenMiete);
    return h`<div class="ergebnis-gross">
        <div>
          <b class="${vorne ? 'is-vorne' : ''}">${U.eur(e.vermoegenKauf)}</b>
          <span>Vermögen nach ${w.jahre} Jahren mit Kauf</span>
          <i>Immobilienwert ${U.eur(e.immobilienwert)} minus Restschuld ${U.eur(e.restschuld)}</i>
        </div>
        <div>
          <b class="${!vorne ? 'is-vorne' : ''}">${U.eur(e.vermoegenMiete)}</b>
          <span>Vermögen nach ${w.jahre} Jahren mit Miete</span>
          <i>angelegtes Eigenkapital plus monatliche Differenz bei ${U.dec(w.anlage)} % Rendite</i>
        </div>
      </div>
      <p class="ergebnis-satz">
        ${vorne ? 'Der Kauf liegt nach ' + w.jahre + ' Jahren um ' + U.eur(abstand) + ' vorn.'
        : 'Mieten und anlegen liegt nach ' + w.jahre + ' Jahren um ' + U.eur(abstand) + ' vorn.'}
      </p>
      ${verlaufGrafik(e.verlauf)}
      <p class="verlauf__legende">
        <span class="verlauf__punkt verlauf__punkt--kauf"></span>Kauf
        <span class="verlauf__punkt verlauf__punkt--miete"></span>Miete plus Anlage
      </p>`;
  }

  function rechnerZahlen(w, e) {
    return h`<div><b>${U.eur(e.nebenkosten)}</b><span>Kaufnebenkosten (${U.dec(e.grest)} % Grunderwerbsteuer, 2 % Notar, ${U.dec(w.makler)} % Makler)</span></div>
      <div><b>${U.eur(e.darlehen)}</b><span>Darlehen</span></div>
      <div><b>${U.eur(e.rate)}</b><span>Annuität im Monat</span></div>
      <div><b>${U.eur(e.erstesJahrRate)}</b><span>echte Monatsbelastung mit Hausgeld und Rücklage</span></div>
      <div><b>${U.eur(e.zinsSumme)}</b><span>gezahlte Zinsen in ${w.jahre} Jahren</span></div>
      <div><b>${U.eur(e.restschuld)}</b><span>Restschuld nach ${w.jahre} Jahren</span></div>
      <div><b>${U.eur(e.mieteGesamt)}</b><span>gezahlte Miete in ${w.jahre} Jahren</span></div>
      <div><b>${U.eur(e.kaeuferAusgaben)}</b><span>Ausgaben als Käufer in ${w.jahre} Jahren</span></div>`;
  }

  function rechner() {
    const w = rWerte;
    const e = rechnen(w);

    const feld = (name, label, min, max, step, einheit) => h`<label class="feld feld--regler">
      <span>${label} <b>${einheit === '€' ? U.eur(w[name]) : U.dec(w[name]) + (einheit || '')}</b></span>
      <input type="range" min="${min}" max="${max}" step="${step}" value="${w[name]}"
        data-tu-input="rechner" data-feld="${name}" data-einheit="${einheit || ''}"></label>`;

    return {
      titel: 'Mieten oder kaufen',
      html: h`<div class="seite seite--schmal">
        <header class="seite__kopf">
          <h1>${ico('rechner')}Mieten oder kaufen</h1>
          <p class="seite__unter">Der Vergleich rechnet ehrlich: Der Mietende legt das Eigenkapital an und
            investiert jeden Monat die Differenz zur Kaufrate. Verglichen wird am Ende das Vermögen, nicht das Gefühl.</p>
        </header>

        <section class="block block--betont" id="rechner-oben">${rechnerOben(w, e)}</section>

        <section class="block">
          <h2>Die Immobilie</h2>
          <div class="regler">
            ${feld('kaufpreis', 'Kaufpreis', 80000, 1500000, 10000, '€')}
            ${feld('eigenkapital', 'Eigenkapital', 0, 600000, 5000, '€')}
            ${feld('zins', 'Sollzins', 0.5, 8, 0.1, ' %')}
            ${feld('tilgung', 'Anfangstilgung', 1, 6, 0.5, ' %')}
            ${feld('makler', 'Maklercourtage', 0, 7.14, 0.01, ' %')}
            ${feld('hausgeld', 'Hausgeld im Monat', 0, 900, 10, '€')}
            ${feld('instand', 'Instandhaltung je Jahr', 0, 3, 0.1, ' % vom Kaufpreis')}
            ${feld('wertsteigerung', 'Wertsteigerung je Jahr', -2, 6, 0.1, ' %')}
            <label class="feld"><span>Bundesland (Grunderwerbsteuer)</span>
              <select data-tu-change="rechner-land">
                ${Object.keys(A.GRUNDERWERB).map((k) => h`<option value="${k}" ${w.bundesland === k ? 'selected' : ''}>${k} – ${U.dec(A.GRUNDERWERB[k])} %</option>`)}
              </select></label>
          </div>
        </section>

        <section class="block">
          <h2>Die Alternative</h2>
          <div class="regler">
            ${feld('miete', 'Vergleichbare Warmmiete', 300, 4000, 25, '€')}
            ${feld('mietsteigerung', 'Mietsteigerung je Jahr', 0, 6, 0.1, ' %')}
            ${feld('anlage', 'Rendite der Geldanlage', 0, 9, 0.1, ' %')}
            ${feld('jahre', 'Betrachtungszeitraum', 5, 40, 1, ' Jahre')}
          </div>
        </section>

        <section class="block">
          <h2>Zahlen im Detail</h2>
          <div class="kennzahlen" id="rechner-zahlen">${rechnerZahlen(w, e)}</div>
          <p class="fein">Ohne Steuern, Sondertilgung, Modernisierungsstau und Umzugskosten. Die Rechnung reagiert
            empfindlich auf Wertsteigerung und Anlagerendite – schieb beide Regler bewusst, nicht optimistisch.</p>
          <p><button type="button" class="link" data-tu="rechner-zurueck">Werte zurücksetzen</button></p>
        </section>
      </div>`
    };
  }

  /* ================================================================
     Aktionen
     ================================================================ */

  const A_ = ui.aktionRegistrieren;

  /* Das Profil speichert bei jeder Änderung. Eine Meldung je Feld wäre
     eine Wand aus Hinweisen – deshalb nur eine ruhige Zeile, die sagt,
     dass gespeichert wurde. */
  function profilSpeichern(fn) {
    S.update((s) => { fn(s.profil); s.profilAngelegt = true; }, 'profil');
    gespeichertZeigen();
  }

  function gespeichertZeigen() {
    const el = U.$('#profil-gespeichert');
    if (!el) return;
    const jetzt = new Date();
    el.innerHTML = String(h`${ico('pruefen')}Automatisch gespeichert um
      ${jetzt.getHours() + ':' + String(jetzt.getMinutes()).padStart(2, '0')} Uhr`);
    el.classList.add('is-frisch');
    clearTimeout(Number(el.dataset.timer));
    el.dataset.timer = String(setTimeout(() => el.classList.remove('is-frisch'), 1400));
  }

  A_('profil-text', (el) => { profilSpeichern((p) => { p[el.dataset.feld] = el.value; }); });
  A_('profil-zahl', (el) => { profilSpeichern((p) => { p[el.dataset.feld] = el.value === '' ? null : Number(el.value); }); });
  A_('profil-schalter', (el) => { profilSpeichern((p) => { p[el.dataset.feld] = el.checked; }); });
  A_('profil-unterlage', (el) => { profilSpeichern((p) => { p.unterlagen[el.dataset.feld] = el.checked; }); });

  A_('profil-regler', (el) => {
    profilSpeichern((p) => { p[el.dataset.gruppe][el.dataset.feld] = Number(el.value); });
    const out = el.parentNode.querySelector('output');
    if (out) out.textContent = el.value;
  });

  A_('profil-chip', (el) => {
    const feld = el.dataset.feld, wert = el.dataset.wert;
    profilSpeichern((p) => {
      const liste = p[feld] || [];
      const i = liste.indexOf(wert);
      if (i >= 0) liste.splice(i, 1); else liste.push(wert);
      p[feld] = liste;
      /* Ein Merkmal kann nicht Pflicht und Wunsch zugleich sein. */
      if (feld === 'mussHaben') p.schoenWaere = p.schoenWaere.filter((x) => p.mussHaben.indexOf(x) < 0);
      if (feld === 'schoenWaere') p.mussHaben = p.mussHaben.filter((x) => p.schoenWaere.indexOf(x) < 0);
    });
    ui.neuZeichnen();
  });

  A_('gewichtung-zurueck', () => {
    profilSpeichern((p) => { p.gewichtung = Object.assign({}, NW.data.profilVorlage.gewichtung); });
    ui.neuZeichnen();
    ui.toast('Gewichtung zurückgesetzt.');
  });

  A_('anker-neu', () => {
    if (S.get().profil.anker.length >= P.grenze('anker')) {
      ui.AKTIONEN.sperre({ dataset: { leistung: 'anker' } });
      return;
    }
    const name = (U.$('#anker-name').value || '').trim();
    const key = U.$('#anker-ort').value;
    const d = NW.geo.districtByKey[key];
    if (!name) { ui.toast('Gib dem Ankerpunkt einen Namen.', 'schlecht'); return; }
    if (!d) return;
    profilSpeichern((p) => {
      p.anker.push({ name, stadt: d.city, viertel: d.name, lat: d.lat, lng: d.lng, mittel: p.verkehrsmittel });
    });
    ui.neuZeichnen();
    ui.toast('Ankerpunkt hinzugefügt. Die Suche rechnet ab jetzt Fahrzeiten.', 'gut');
  });

  A_('anker-weg', (el) => {
    profilSpeichern((p) => { p.anker.splice(Number(el.dataset.i), 1); });
    ui.neuZeichnen();
  });

  /* Zeigt nur die Feldgruppen, die zur gewählten Art gehören. Ein
     verstecktes Feld bleibt im Formular und liefert weiter seinen Wert –
     das ist gewollt: Wer zwischen Vermieten und Verkaufen hin- und
     herschaltet, verliert dabei nichts. */
  function gruppenZeigen(artId) {
    const a = artNach(artId);
    U.$$('[data-gruppe]').forEach((el) => {
      const noetig = el.dataset.gruppe.split(' ').every((g) => g === 'ort' || a.gruppen.indexOf(g) >= 0);
      el.hidden = !noetig;
      /* Pflichtfelder einer verborgenen Gruppe würden das Absenden
         blockieren, ohne dass man sähe, warum. */
      U.$$('input,select,textarea', el).forEach((f) => { f.disabled = !noetig; });
    });
  }

  A_('inserat-art', (el) => { gruppenZeigen(el.value); });

  A_('inserat-bilder', (el) => {
    const dateien = Array.from(el.files || []);
    el.value = '';
    if (!dateien.length) return;
    const platz = BILD_MAX - neueBilder.length;
    if (platz <= 0) { ui.toast('Mehr als ' + BILD_MAX + ' Bilder gehen nicht.', 'schlecht'); return; }
    const nehmen = dateien.slice(0, platz);
    if (dateien.length > platz) {
      ui.toast('Nur die ersten ' + platz + ' ' + U.plural(platz, 'Datei', 'Dateien') + ' wurden übernommen.', 'schlecht');
    }
    const falsch = nehmen.filter((d) => d.type && BILD_TYPEN.indexOf(d.type) < 0);
    if (falsch.length) { ui.toast('Erlaubt sind JPG, PNG, WEBP und HEIC.', 'schlecht'); }

    Promise.all(nehmen.filter((d) => !d.type || BILD_TYPEN.indexOf(d.type) >= 0).map(verkleinern))
      .then((neue) => {
        neueBilder = neueBilder.concat(neue);
        bilderNeuZeichnen();
        ui.toast(neue.length + ' ' + U.plural(neue.length, 'Bild', 'Bilder') + ' übernommen und verkleinert.', 'gut');
      })
      .catch((e) => ui.toast(e.message || 'Ein Bild ließ sich nicht lesen.', 'schlecht'));
  });

  /* Nur die Bilderliste neu setzen, nicht die ganze Seite: Sonst wäre
     jede Eingabe im Formular darüber wieder weg. */
  function bilderNeuZeichnen() {
    const liste = U.$('#inserat-bilder-liste');
    if (liste) liste.innerHTML = String(bilderListe());
    const zahl = U.$('#inserat-bilder-zahl');
    if (zahl) {
      zahl.textContent = neueBilder.length
        ? neueBilder.length + ' ' + U.plural(neueBilder.length, 'Bild', 'Bilder') + ' gewählt'
        : 'noch keine gewählt';
    }
  }

  A_('inserat-bildtext', (el) => {
    const b = neueBilder[Number(el.dataset.i)];
    if (b) b.text = el.value.slice(0, 120);
  });

  A_('inserat-bild-weg', (el) => {
    neueBilder.splice(Number(el.dataset.i), 1);
    bilderNeuZeichnen();
  });

  A_('inserat-bild-vor', (el) => {
    const i = Number(el.dataset.i);
    if (i <= 0) return;
    const b = neueBilder.splice(i, 1)[0];
    neueBilder.splice(i - 1, 0, b);
    bilderNeuZeichnen();
  });

  /* ------------------------- Hervorheben -------------------------

     Das Modell von Kleinanzeigen, aber mit sichtbarer Trennlinie: bezahlt
     wird Sichtbarkeit, nicht ein besserer Platz in der Bewertung. */

  A_('hervorheben', (el) => {
    const id = el.dataset.id;
    const e = S.get().eigeneInserate.find((x) => x.id === id);
    if (!e) return;
    const laeuft = P.boostAktiv(e);
    const rabatt = P.istPlus();
    ui.dialog({
      titel: 'Inserat hervorheben',
      breit: true,
      inhalt: h`<p>Wer schneller vermieten oder verkaufen will, kann für Sichtbarkeit zahlen. Was du dabei
          <b>nicht</b> kaufst: eine bessere Bewertung, einen anderen Platz in der Trefferreihenfolge oder das
          Verschwinden anderer Inserate.</p>
        ${rabatt ? h`<p class="gut-meldung">${ico('plus5')}Mit Plus sind alle Preise
          ${Math.round(P.PLUS_RABATT * 100)} % günstiger.</p>` : ''}
        <ul class="hervorliste">
          ${P.HERVORHEBUNG.map((x) => h`<li class="${laeuft && e.boost.art === x.id ? 'is-an' : ''}">
            <span class="hervorliste__zeichen">${ico(x.icon)}</span>
            <div>
              <b>${x.name}</b>
              <i>${x.kurz}</i>
              <span>${x.wirkung}</span>
            </div>
            <span class="hervorliste__preis">
              <b>${U.eur2(P.hervorhebungPreis(x.id))}</b>
              ${rabatt ? h`<s>${U.eur2(x.preis)}</s>` : ''}
            </span>
            <button type="button" class="knopf knopf--klein" data-tu="hervorheben-buchen"
              data-id="${id}" data-art="${x.id}">
              ${laeuft && e.boost.art === x.id ? 'Läuft' : 'Buchen'}</button>
          </li>`)}
        </ul>
        <p class="fein">${NW.recht ? NW.recht.preisHinweis() : ''}</p>
        <div class="hinweisbox">${ico('info')}
          <div><b>Warum das gekennzeichnet wird</b>
          <p>Bezahlte Platzierung in Suchergebnissen muss als solche erkennbar sein (§ 5b Abs. 1 Nr. 6 und
            Abs. 2 UWG). Nestwerk löst das nicht mit einem kleinen Sternchen, sondern mit einem eigenen Block
            über den Treffern. Das ist ehrlicher – und wirkt erfahrungsgemäß besser als ein getarnter Platz,
            weil niemand sich getäuscht fühlt.</p></div>
        </div>
        <p class="fein">In dieser Vorführung wird nichts abgebucht. Im Betrieb liefe die Zahlung über den
          Zahlungsdienstleister, mit Rechnung und Widerrufsbelehrung.</p>`,
      fuss: h`${laeuft ? h`<button type="button" class="knopf knopf--still knopf--gefahr"
          data-tu="hervorheben-beenden" data-id="${id}">Hervorhebung beenden</button>` : ''}
        <button type="button" class="knopf knopf--still" data-tu="dialog-zu">Schließen</button>`
    });
  });

  A_('hervorheben-buchen', (el) => {
    const prod = P.hervorhebung(el.dataset.art);
    S.inseratHervorheben(el.dataset.id, el.dataset.art);
    ui.dialogZu();
    ui.neuZeichnen();
    ui.toast(prod.name + ' läuft' + (prod.tage ? ' für ' + prod.tage + ' Tage' : '') + '.', 'gut');
  });

  A_('hervorheben-beenden', (el) => {
    S.inseratHervorheben(el.dataset.id, null);
    ui.dialogZu();
    ui.neuZeichnen();
    ui.toast('Hervorhebung beendet.');
  });

  A_('inserat-speichern', (el) => {
    const f = new FormData(el);
    const key = f.get('viertelKey');
    const d = NW.geo.districtByKey[key];
    if (!d) { ui.toast('Bitte ein Viertel wählen.', 'schlecht'); return; }

    const art = artNach(f.get('art'));
    const kind = art.kind, typ = art.type;
    const istKauf = kind === 'kauf';
    const istGrund = typ === 'grundstueck';

    const zahl = (name, ersatz) => {
      const v = Number(f.get(name));
      return Number.isFinite(v) && f.get(name) !== null && f.get(name) !== '' ? v : ersatz;
    };

    const zimmer = istGrund ? 0 : zahl('zimmer', 2);
    const gflaeche = istGrund ? zahl('gflaeche', 600) : zahl('grundstueck', 0);
    /* Beim Grundstück ist die Fläche das Grundstück selbst – sonst hätte
       jede Auswertung, die durch die Fläche teilt, eine Null im Nenner. */
    const flaeche = istGrund ? gflaeche : zahl('flaeche', 50);
    const kalt = istKauf ? 0 : zahl('kalt', 0);
    const nk = istKauf ? 0 : zahl('nebenkosten', 0);
    const heiz = istKauf ? 0 : zahl('heizkosten', 0);
    const kaufpreis = istKauf ? zahl('kaufpreis', 0) : 0;
    const hausgeld = istKauf && typ === 'wohnung' ? zahl('hausgeld', 0) : 0;
    const provision = istKauf ? zahl('provision', 0) : 0;
    const baujahr = istGrund ? 0 : zahl('baujahr', 1970);
    const heizung = f.get('heizung') || 'Gas-Zentralheizung';
    const ausstattung = istGrund ? [] : f.getAll('ausstattung');
    const kwh = baujahr >= 2020 ? 55 : baujahr >= 2000 ? 95 : baujahr >= 1978 ? 125 : 168;
    const p = S.get().profil;

    const titel = istGrund
      ? U.num(gflaeche) + ' m² ' + (String(f.get('baulandArt') || 'Bauland').split(',')[0]) + ' – ' + d.name
      : typ === 'haus'
        ? (f.get('bauweise') || 'Haus') + ', ' + U.dec(zimmer) + ' Zi., ' + flaeche + ' m² – ' + d.name
        : kind === 'wg' ? flaeche + ' m² Zimmer – ' + d.name
          : U.dec(zimmer) + '-Zimmer-Wohnung' + (kind === 'tausch' ? ' zum Tausch' : '') + ' – ' + d.name;

    const daten = {
      kind, type: typ,
      titel,
      stadt: d.city, viertel: d.name, viertelKey: d.key,
      strasse: f.get('strasse') || 'Nähe ' + d.name,
      lat: d.lat, lng: d.lng,
      zimmer, flaeche, wohnflaeche: istGrund ? 0 : flaeche,
      grundstueck: gflaeche,
      etage: istGrund ? 0 : zahl('etage', 0), etagen: istGrund ? 0 : zahl('etagen', 4),
      baujahr, saniert: false,
      kalt, nebenkosten: nk, heizkosten: heiz, warm: kalt + nk + heiz,
      kaufpreis, hausgeld, provision,
      kaution: istKauf ? 0 : zahl('kaution', 0),
      /* Ein Grundstück hat keinen Energieausweis – § 80 GEG verlangt ihn
         nur für Gebäude. Eine erfundene Klasse hinzuschreiben wäre falsch. */
      energie: istGrund ? null : {
        klasse: kwh <= 75 ? 'B' : kwh <= 100 ? 'C' : kwh <= 130 ? 'D' : kwh <= 160 ? 'E' : 'F',
        kwh, art: 'Bedarfsausweis', heizung, ausweisBis: U.isoDate(U.addDays(NW.now(), 3000))
      },
      ausstattung,
      freiAb: (istKauf ? f.get('freiAbKauf') : f.get('freiAb')) || U.isoDate(NW.now()),
      befristetBis: null,
      beschreibung: f.get('beschreibung') || 'Keine weitere Beschreibung hinterlegt.',
      bilder: neueBilder.slice(),
      quirks: [],
      anbieter: {
        name: p.name || 'Du', art: 'privat', stadt: d.city, quote: 100, antwortStd: 4,
        verifiziert: true, seit: U.isoDate(NW.now()), inserate: 1, bewertung: 0, bewertungen: 0
      },
      stats: { aufrufe: 0, bewerber: 0, online: U.isoDate(NW.now()) },
      vergleichsmiete: istKauf ? 0 : NW.geo.vergleichsmiete(d.key, flaeche, baujahr, false),
      besichtigungen: [],
      verdacht: false
    };

    if (typ === 'haus') daten.bauweise = f.get('bauweise') || 'freistehend';

    if (istGrund) {
      daten.grund = {
        baulandArt: f.get('baulandArt') || 'Bauland, voll erschlossen',
        bplan: f.get('bplan') || 'liegt vor',
        grz: zahl('grz', 0.4),
        gfz: zahl('gfz', 0.8),
        erschliessung: f.get('erschliessung') || 'unbekannt'
      };
    }

    if (kind === 'wg') {
      daten.wg = {
        groesse: 2, bewohner: [{ name: p.name || 'Du', alter: p.alter || 30, geschlecht: p.geschlecht || 'egal', beruf: p.beruf || '' }],
        durchschnittsalter: p.alter || 30,
        sucht: { geschlecht: 'egal', alterVon: 18, alterBis: 99 },
        art: ['gemischte WG'], rauchen: p.raucher ? 'überall erlaubt' : 'nicht erwünscht',
        haustiere: ausstattung.indexOf('Haustiere erlaubt') >= 0 ? 'erlaubt' : 'nicht erlaubt',
        sprachen: ['Deutsch'], lifestyle: Object.assign({}, p.lifestyle),
        putzplan: true, gemeinsamesEssen: false, badGeteilt: 'geteilt'
      };
    }
    if (kind === 'tausch') {
      const staedte = f.getAll('wunschStadt');
      daten.tausch = {
        grund: f.get('grund') || 'Veränderung.',
        suche: {
          staedte: staedte.length ? staedte : [d.city],
          zimmerMin: zahl('tZimmer', 1),
          flaecheMin: zahl('tFlaeche', 30),
          warmMax: zahl('tWarm', 1200),
          wunschAusstattung: []
        },
        flexibelAb: daten.freiAb,
        dreiecktauschOk: f.get('ringOk') === 'on',
        vermieterZustimmung: 'noch offen'
      };
    }

    let id;
    try {
      id = S.inseratAnlegen(daten);
    } catch (e) {
      /* Der Browserspeicher ist begrenzt; Bilder füllen ihn am schnellsten. */
      ui.toast('Der Speicher dieses Browsers ist voll. Entferne einige Bilder oder ältere Inserate.', 'schlecht');
      return;
    }
    neueBilder = [];
    ui.toast(daten.bilder.length
      ? 'Inserat mit ' + daten.bilder.length + ' ' + U.plural(daten.bilder.length, 'Bild', 'Bildern') + ' angelegt.'
      : 'Inserat angelegt.', 'gut');
    ui.gehe(kind === 'tausch' ? 'tausch' : 'objekt/' + id);
  });

  A_('inserat-weg', (el) => {
    if (!confirm('Dieses Inserat löschen?')) return;
    S.inseratLoeschen(el.dataset.id);
    ui.neuZeichnen();
    ui.toast('Inserat gelöscht.');
  });

  /* Nur die Ergebnisbereiche austauschen. Würde die ganze Seite neu
     entstehen, bräche jeder Regler mitten im Ziehen ab. */
  function rechnerAktualisieren() {
    const e = rechnen(rWerte);
    const oben = U.$('#rechner-oben');
    if (oben) oben.innerHTML = String(rechnerOben(rWerte, e));
    const zahlen = U.$('#rechner-zahlen');
    if (zahlen) zahlen.innerHTML = String(rechnerZahlen(rWerte, e));
  }

  A_('rechner', (el) => {
    rWerte[el.dataset.feld] = Number(el.value);
    const einheit = el.dataset.einheit || '';
    NW.viewWerkzeuge.reglerText(el, einheit === '€' ? U.eur(rWerte[el.dataset.feld])
      : U.dec(rWerte[el.dataset.feld]) + einheit);
    rechnerAktualisieren();
  });

  A_('rechner-land', (el) => { rWerte.bundesland = el.value; rechnerAktualisieren(); });
  A_('rechner-zurueck', () => { rWerte = Object.assign({}, R_VORGABE); ui.neuZeichnen(); ui.toast('Werte zurückgesetzt.'); });

  ui.ansichten.profil = profil;
  ui.ansichten.inserieren = inserieren;
  ui.ansichten.rechner = rechner;
})(window.NW = window.NW || {});
