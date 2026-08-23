/* =====================================================================
   Nestwerk – Ansicht: ein Objekt
   Alles zu einem Inserat auf einer Seite: Kosten bis zum letzten Euro,
   Vergleichsmiete, Vertragslupe, Prüfhinweis, Lage, Anbieter, Termine.
   ===================================================================== */
(function (NW) {
  'use strict';

  const U = NW.util, ui = NW.ui, A = NW.analyse, S = NW.store, M = NW.match, P = NW.plan, W = NW.werkzeuge;
  const h = U.html, raw = U.raw, ico = U.svg;

  let bildIndex = 0;

  /* ------------------------- Galerie ------------------------- */

  function galerie(l) {
    const anzahl = NW.img.count(l);
    return h`<div class="galerie">
      <div class="galerie__gross" id="galerie-gross">
        ${raw(NW.img.make(l, bildIndex))}
        <span class="galerie__bu">${NW.img.caption(l, bildIndex)} · ${bildIndex + 1} von ${anzahl}</span>
        <button type="button" class="galerie__pfeil galerie__pfeil--links" data-tu="bild" data-schritt="-1" aria-label="Vorheriges Bild">${ico('zurueck')}</button>
        <button type="button" class="galerie__pfeil galerie__pfeil--rechts" data-tu="bild" data-schritt="1" aria-label="Nächstes Bild">${ico('chevron')}</button>
      </div>
      <div class="galerie__streifen" role="tablist" aria-label="Bildauswahl">
        ${Array.from({ length: anzahl }, (_, i) => h`<button type="button" role="tab" class="galerie__mini ${i === bildIndex ? 'is-an' : ''}"
          aria-selected="${i === bildIndex ? 'true' : 'false'}" data-tu="bild-zu" data-i="${i}"
          aria-label="${NW.img.caption(l, i)}">${raw(NW.img.make(l, i))}</button>`)}
      </div>
      ${NW.img.istGezeichnet(l)
      ? h`<p class="galerie__hinweis">${ico('info')}Die Ansichten sind schematische Zeichnungen aus den Objektdaten, keine Fotos.</p>`
      : h`<p class="galerie__hinweis">${ico('info')}Fotos aus dem Inserat. Sie liegen im Speicher dieses Geräts und wurden vor dem Ablegen verkleinert.</p>`}
    </div>`;
  }

  /* ------------------------- Kostenblock ------------------------- */

  function kostenBlock(l, k) {
    const ampel = { gut: 'Das passt zur Faustregel: höchstens 30 % des Nettoeinkommens fürs Wohnen.',
      mittel: 'Über der 30-Prozent-Faustregel. Machbar, aber ohne großen Puffer.',
      schlecht: 'Deutlich über der Faustregel. Rechne genau, ob der Rest zum Leben reicht.',
      unbekannt: 'Trag dein Nettoeinkommen im Profil ein, dann zeigt Nestwerk die Belastungsquote.' };
    return h`<section class="block" id="kosten">
      <h2>${ico('rechner')}Was es wirklich kostet</h2>
      <p class="block__unter">Nicht nur die Warmmiete – auch Strom, Internet, Rundfunkbeitrag und der Einzug selbst.</p>
      <div class="kosten">
        <div class="kosten__spalte">
          <h3>Jeden Monat</h3>
          <ul class="kosten__liste">
            ${k.monatlich.map((m) => h`<li><span>${m.label}${m.hinweis ? h`<i>${m.hinweis}</i>` : ''}</span><b>${U.eur(m.betrag)}</b></li>`)}
          </ul>
          <p class="kosten__summe"><span>Summe</span><b>${U.eur(k.monatSumme)}</b></p>
        </div>
        <div class="kosten__spalte">
          <h3>Einmalig beim Einzug</h3>
          <ul class="kosten__liste">
            ${k.einmalig.map((m) => h`<li><span>${m.label}${m.rueck ? raw('<i>wird bei Auszug zurückgezahlt</i>') : ''}</span><b>${U.eur(m.betrag)}</b></li>`)}
          </ul>
          <p class="kosten__summe"><span>Summe</span><b>${U.eur(k.einmalSumme)}</b></p>
          ${k.rueckzahlbar ? h`<p class="kosten__fein">davon ${U.eur(k.rueckzahlbar)} rückzahlbar</p>` : ''}
        </div>
      </div>
      <div class="ampel ampel--${ui.ampelFarbe(k.ampel === 'gut' ? 'gut' : k.ampel === 'mittel' ? 'mittel' : k.ampel === 'schlecht' ? 'schlecht' : 'neutral')}">
        <div class="ampel__zahl">${k.quote ? k.quote + ' %' : '–'}</div>
        <div>
          <b>Mietbelastungsquote</b>
          <p>${ampel[k.ampel]}</p>
        </div>
      </div>
      <p class="kosten__jahr">Erstes Jahr insgesamt: <b>${U.eur(k.erstesJahr)}</b>
        <button type="button" class="link" data-tu="kosten-anpassen">Haushaltsgröße und Einkommen anpassen</button></p>
    </section>`;
  }

  /* ------------------------- Vergleichsmiete ------------------------- */

  function spiegelBlock(l, mc, kc, bc) {
    if (bc) {
      const g = l.grund || {};
      return h`<section class="block" id="spiegel">
        <h2>${ico('waage')}Preis im Vergleich</h2>
        <div class="kennzahlen">
          <div><b>${U.num(bc.proQm)} €</b><span>je m² Grundstück</span></div>
          <div><b>${U.num(bc.referenz)} €</b><span>abgeleiteter Bodenwert ${l.viertel}</span></div>
          <div><b class="ton ton--${ui.ampelFarbe(bc.ton)}">${bc.diff >= 0 ? '+' : ''}${bc.diff} %</b><span>${bc.urteil}</span></div>
          <div><b>${U.num(bc.bebaubar)} m²</b><span>überbaubar bei GRZ ${U.dec(g.grz || 0)}</span></div>
          <div><b>${U.num(bc.geschossflaeche)} m²</b><span>Geschossfläche bei GFZ ${U.dec(g.gfz || 0)}</span></div>
        </div>
        ${bc.abschlag ? h`<p class="warn-meldung">${ico('warnung')}
          <span><b>${bc.abschlag} % Abschlag üblich.</b> „${g.baulandArt}“ ist nicht dasselbe wie
          voll erschlossenes Bauland: Bis zur Bebaubarkeit fehlen hier noch Schritte, deren Dauer und Kosten
          niemand zusagen kann.</span></p>` : ''}
        ${/kein Bebauungsplan|Außenbereich/.test(g.bplan || '') ? h`<div class="hinweisbox">${ico('warnung')}
          <div><b>Ohne Bebauungsplan entscheidet die Umgebung</b>
          <p>Innerhalb eines im Zusammenhang bebauten Ortsteils richtet sich die Zulässigkeit nach § 34 BauGB –
            das Vorhaben muss sich in die Eigenart der näheren Umgebung einfügen. Im Außenbereich nach § 35 BauGB
            ist Wohnbebauung nur ausnahmsweise zulässig. Vor dem Kauf gehört eine <b>Bauvoranfrage</b> gestellt;
            sie kostet wenig und beantwortet verbindlich, was gebaut werden darf.</p></div>
        </div>` : ''}
        <p class="fein">Der Bodenwert ist hier aus dem örtlichen Kaufpreisniveau abgeleitet, kein amtlicher
          Bodenrichtwert. Den führt der Gutachterausschuss der Gemeinde; die Auskunft ist meist kostenlos und
          in den meisten Bundesländern online abrufbar.</p>
      </section>`;
    }
    if (mc) {
      const pos = U.clamp(50 + mc.diff * 1.4, 3, 97);
      return h`<section class="block" id="spiegel">
        <h2>${ico('waage')}Preis im Vergleich</h2>
        <div class="spiegel">
          <div class="spiegel__balken">
            <span class="spiegel__zone spiegel__zone--gut"></span>
            <span class="spiegel__zone spiegel__zone--ok"></span>
            <span class="spiegel__zone spiegel__zone--teuer"></span>
            <span class="spiegel__marke" style="left:${U.dec(pos)}%">
              <b>${U.dec(mc.proQm)} €/m²</b>
            </span>
          </div>
          <div class="spiegel__skala"><span>günstig</span><span>ortsüblich</span><span>teuer</span></div>
        </div>
        <p class="spiegel__satz">
          <b class="ton ton--${ui.ampelFarbe(mc.ton)}">${mc.urteil}</b> –
          ${U.dec(mc.proQm)} €/m² gegenüber ${U.dec(mc.referenz)} €/m² Vergleichswert für ${l.viertel},
          Baujahr ${l.baujahr}${l.saniert ? ' (saniert)' : ''}, ${l.flaeche} m².
          Das sind ${mc.diff >= 0 ? '+' : ''}${mc.diff} %.
        </p>
        ${mc.mietpreisbremse ? h`<div class="hinweisbox">
          ${ico('info')}
          <div><b>Mietpreisbremse prüfen</b>
          <p>In Gebieten mit angespanntem Wohnungsmarkt darf die Miete bei Neuvermietung höchstens 10 % über der
          ortsüblichen Vergleichsmiete liegen. Danach wären hier rund <b>${U.eur(mc.zulaessig)}</b> Kaltmiete zulässig
          statt ${U.eur(l.kalt)}. Ausnahmen gelten unter anderem für Neubauten ab 2014 und umfassend modernisierte Wohnungen.
          Die Vermieterseite muss vor Vertragsschluss über eine Ausnahme informieren.</p></div>
        </div>` : ''}
        <p class="fein">Der Vergleichswert ist eine Rechengröße dieser Vorführung, kein amtlicher Mietspiegel.</p>
      </section>`;
    }
    if (kc) {
      return h`<section class="block" id="spiegel">
        <h2>${ico('waage')}Preis im Vergleich</h2>
        <div class="kennzahlen">
          <div><b>${U.num(kc.proQm)} €</b><span>je m² Kaufpreis</span></div>
          <div><b>${U.num(kc.referenz)} €</b><span>Vergleichswert ${l.viertel}</span></div>
          <div><b class="ton ton--${ui.ampelFarbe(kc.ton)}">${kc.diff >= 0 ? '+' : ''}${kc.diff} %</b><span>${kc.urteil}</span></div>
          <div><b>${U.dec(kc.faktor)}</b><span>Jahresmieten (Kaufpreisfaktor)</span></div>
          <div><b>${U.dec(kc.mietrendite)} %</b><span>Bruttomietrendite</span></div>
        </div>
        <p class="fein">Ein Faktor unter 25 gilt als günstig, über 35 als ambitioniert. Er sagt, wie viele Jahre
          Nettokaltmiete den Kaufpreis decken – ohne Nebenkosten und Instandhaltung.</p>
      </section>`;
    }
    return '';
  }

  /* ------------------------- Vertragslupe ------------------------- */

  function klauselBlock(l) {
    const funde = A.klauselCheck(l);
    if (!funde.length) {
      return h`<section class="block" id="lupe">
        <h2>${ico('blatt')}Vertragslupe</h2>
        <p class="gut-meldung">${ico('pruefen')}Im Inseratstext stehen keine der typischen Klauseln, die später Ärger machen.</p>
      </section>`;
    }
    const zahl = { kritisch: 'schlecht', achtung: 'warn', info: 'info' };
    const grenze = P.grenze('lupeFunde');
    const gezeigt = funde.slice(0, grenze === Infinity ? funde.length : grenze);
    const versteckt = funde.length - gezeigt.length;
    return h`<section class="block" id="lupe">
      <h2>${ico('blatt')}Vertragslupe</h2>
      <p class="block__unter">Nestwerk liest den Inseratstext auf Formulierungen, die im Mietvertrag Geld oder Rechte kosten können.
        ${funde.length} ${U.plural(funde.length, 'Fund', 'Funde')} in diesem Inserat.</p>
      <ul class="lupe">
        ${gezeigt.map((f) => h`<li class="lupe__fund lupe__fund--${zahl[f.bewertung]}">
          <details ${f.bewertung === 'kritisch' ? 'open' : ''}>
            <summary>
              ${ui.badge(f.bewertung === 'kritisch' ? 'kritisch' : f.bewertung === 'achtung' ? 'genau lesen' : 'zur Kenntnis', zahl[f.bewertung])}
              <b>${f.titel}</b>
            </summary>
            <blockquote>„${f.fundstelle}“</blockquote>
            <p>${f.erklaerung}</p>
            <p class="fein">${f.quelle}</p>
          </details>
        </li>`)}
        ${versteckt > 0 ? h`<li class="lupe__fund lupe__fund--gesperrt">
          <div class="lupe__verdeckt">
            ${funde.slice(gezeigt.length).map((f) => h`<span class="lupe__titel-verdeckt">
              ${ui.badge(f.bewertung === 'kritisch' ? 'kritisch' : f.bewertung === 'achtung' ? 'genau lesen' : 'zur Kenntnis',
        zahl[f.bewertung])}<b>${f.titel}</b></span>`)}
          </div>
          ${ui.sperrHinweis('lupe', versteckt + ' weitere ' + U.plural(versteckt, 'Klausel wurde', 'Klauseln wurden')
        + ' gefunden. Die Titel siehst du oben – die Erläuterung, warum das Geld kostet und was dagegen hilft, gehört zu Plus.')}
        </li>` : ''}
      </ul>
      <p class="fein">Allgemeine Hinweise zur Einordnung, keine Rechtsberatung. Im Zweifel hilft ein Mieterverein
        oder eine Anwältin für Mietrecht.</p>
    </section>`;
  }

  /* ------------------------- Prüfhinweis ------------------------- */

  function risikoBlock(l, risiko) {
    if (risiko.stufe === 'ok' && !risiko.gruende.length) return '';
    const art = risiko.stufe === 'warnung' ? 'schlecht' : risiko.stufe === 'achtung' ? 'warn' : 'info';
    return h`<section class="block block--${art}" id="pruefung">
      <h2>${ico('warnung')}Prüfhinweis</h2>
      <p class="block__unter">
        ${risiko.stufe === 'warnung'
        ? 'Dieses Inserat zeigt mehrere Merkmale, die typisch für erfundene Wohnungsangebote sind. Zahl nichts, bevor du die Wohnung gesehen und einen Vertrag unterschrieben hast.'
        : risiko.stufe === 'achtung'
          ? 'Einzelne Punkte solltest du vor dem Kontakt genau ansehen.'
          : 'Kleinere Auffälligkeiten, nichts Dramatisches.'}
      </p>
      <ul class="pruef">
        ${risiko.gruende.map((g) => h`<li>${ico('warnung')}<span>${g.grund}</span></li>`)}
      </ul>
      ${risiko.stufe === 'warnung' ? h`<div class="hinweisbox">
        ${ico('info')}
        <div><b>Drei Regeln, die zuverlässig schützen</b>
        <ul class="liste-schlicht">
          <li>Nie Geld überweisen, bevor du drin warst und unterschrieben hast – auch keine „Reservierung“.</li>
          <li>Keine Ausweiskopie und keine Schufa vor der Besichtigung verschicken.</li>
          <li>Wer nur schriftlich kommuniziert und Termine ablehnt, hat meist keine Wohnung.</li>
        </ul></div>
      </div>` : ''}
    </section>`;
  }

  /* ------------------------- Chancen ------------------------- */

  function chancenBlock(l) {
    if (l.kind === 'kauf') return '';
    const c = W.chancen(l, S.get().profil);
    const ton = { gut: 'gut', mittel: 'warn', schwach: 'schlecht', unbekannt: 'neutral' }[c.stufe];
    const andrangTon = { keiner: 'gut', gering: 'gut', 'spürbar': 'neutral', hoch: 'warn', 'sehr hoch': 'schlecht' }[c.andrang];
    return h`<section class="block" id="chancen">
      <h2>${ico('ziel')}Wie stehen deine Chancen?</h2>
      <p class="block__unter">Zwei Dinge entscheiden, und nur eines davon hast du in der Hand.
        Deshalb stehen sie hier getrennt.</p>
      <div class="chancenkopf">
        <div class="ampel ampel--${ui.ampelFarbe(ton)}">
          <div class="ampel__zahl">${ico(c.staerke === 'schwach' ? 'warnung' : c.staerke === 'unbekannt' ? 'info' : 'pruefen')}</div>
          <div>
            <b>${c.staerke === 'unbekannt' ? 'Deine Bewerbung: noch nicht einschätzbar' : 'Deine Bewerbung: ' + c.staerke}</b>
            <p>${c.staerke === 'unbekannt'
        ? 'Dafür fehlen Nestwerk noch Angaben aus deinem Profil.'
        : 'Das kannst du ändern – die Punkte unten sagen wie.'}</p>
          </div>
        </div>
        <div class="ampel ampel--${ui.ampelFarbe(andrangTon)}">
          <div class="ampel__zahl">${c.mitbewerber}</div>
          <div>
            <b>Andrang: ${c.andrang}</b>
            <p>Darauf hast du keinen Einfluss${c.mitbewerber > 1 ? ' – rechnerisch ' + c.prozent + ' von 100' : ''}.</p>
          </div>
        </div>
      </div>
      <p class="chancen__satz">${c.satz}</p>
      <ul class="chancen">
        ${c.faktoren.map((f) => h`<li class="chancen__${f.wirkung}">
          ${ico(f.wirkung === 'plus' ? 'pruefen' : f.wirkung === 'minus' ? 'warnung' : 'info')}
          <span><b>${f.label}</b> ${f.text}</span>
        </li>`)}
      </ul>
      ${c.tipps.length ? h`<h3>Was du jetzt tun kannst</h3>
        <ul class="pruef">
          ${c.tipps.map((t) => h`<li>${ico('blitz')}<span>${t}</span></li>`)}
        </ul>` : ''}
      <p class="fein">Die Schätzung geht von der Zahl der Interessenten aus und gewichtet dein Profil dagegen.
        Sie kennt nicht, wen die Vermieterseite tatsächlich sympathisch findet – das entscheidet oft mehr als jede Zahl.
        Und sie ist kein Grund, es nicht zu versuchen: Auch eine Wohnung mit hundert Interessenten wird an genau
        eine Person vergeben.</p>
    </section>`;
  }

  /* ------------------------- Doppelte Inserate ------------------------- */

  function duplikatBlock(l) {
    const treffer = W.duplikate(l);
    if (!treffer.length) return '';
    return h`<section class="block block--warn" id="duplikate">
      <h2>${ico('kopieren')}Diese Wohnung steht möglicherweise mehrfach im Angebot</h2>
      <p class="block__unter">Gleiche Fläche, gleicher Zuschnitt, fast gleicher Preis im selben Viertel.
        Bevor du dich zweimal auf dieselbe Wohnung bewirbst, vergleich die Angaben.</p>
      <ul class="duplikate">
        ${treffer.map((d) => h`<li>
          <a class="duplikate__bild" href="#/objekt/${d.listing.id}" aria-hidden="true" tabindex="-1">
            ${raw(NW.img.make(d.listing, 0))}</a>
          <div>
            <b><a href="#/objekt/${d.listing.id}">${d.listing.titel}</a></b>
            <span>${d.listing.anbieter.name} · ${U.eur(d.listing.kind === 'kauf' ? d.listing.kaufpreis : d.listing.warm)}
              ${d.listing.kind === 'kauf' ? '' : 'warm'} · ${d.merkmale.join(', ')}</span>
            <i>${d.deutung}</i>
          </div>
          <span class="duplikate__wert">${d.sicherheit} %</span>
        </li>`)}
      </ul>
      <p class="fein">Zwei Anfragen zum selben Objekt wirken bei der Vermieterseite unentschlossen. Such dir den
        Weg aus, der dir mehr Auskunft gibt – meist der direkte Eigentümer.</p>
    </section>`;
  }

  /* ------------------------- Passung ------------------------- */

  function passungBlock(l, b) {
    return h`<section class="block" id="passung">
      <h2>${ico('ziel')}Passung zu deinem Profil</h2>
      <div class="passung">
        <div class="passung__ring">${ui.passungsRing(b.score, 108)}</div>
        <div class="passung__balken">
          ${b.teile.map((t) => h`<div class="passung__zeile">
            <span class="passung__label">${t.label}</span>
            <span class="passung__spur"><i style="width:${Math.round(t.anteil * 100)}%"></i></span>
            <span class="passung__wert">${t.text}</span>
          </div>`)}
        </div>
      </div>
      ${b.fehlendePflicht.length ? h`<p class="warn-meldung">${ico('warnung')}Pflichtwunsch nicht erfüllt:
        ${b.fehlendePflicht.join(', ')}. Das zieht die Bewertung deutlich nach unten.</p>` : ''}
      <p class="fein">Die Reihenfolge deiner Suche entsteht ausschließlich aus diesen Werten.
        <a href="#/profil">Gewichtung ändern</a> – niemand kann sich hier nach oben kaufen.</p>
    </section>`;
  }

  /* ------------------------- WG ------------------------- */

  function wgBlock(l, b) {
    if (l.kind !== 'wg' || !l.wg) return '';
    const w = l.wg, m = b.wg;
    return h`<section class="block" id="wg">
      <h2>${ico('wg')}Die WG</h2>
      <div class="wg__kopf">
        <div class="wg__leute">
          ${w.bewohner.map((p) => h`<div class="wg__person">
            ${raw(NW.img.avatar(p.name, 44))}
            <div><b>${p.name}</b><span>${p.alter} Jahre · ${p.beruf}</span></div>
          </div>`)}
          <div class="wg__person wg__person--frei">
            <span class="wg__frei" aria-hidden="true">?</span>
            <div><b>Freies Zimmer</b><span>${l.flaeche} m² · ${U.eur(l.warm)} warm</span></div>
          </div>
        </div>
        ${m ? h`<div class="wg__score">${ui.passungsRing(m.score, 92)}<b>${m.kurz}</b></div>` : ''}
      </div>

      <dl class="fakten fakten--dicht">
        <div><dt>WG-Art</dt><dd>${w.art.join(', ')}</dd></div>
        <div><dt>Gesucht</dt><dd>${w.sucht.geschlecht === 'egal' ? 'alle Geschlechter' :
        w.sucht.geschlecht === 'w' ? 'eine Mitbewohnerin' : w.sucht.geschlecht === 'm' ? 'ein Mitbewohner' : 'nichtbinär'},
        ${w.sucht.alterVon}–${w.sucht.alterBis} Jahre</dd></div>
        <div><dt>Rauchen</dt><dd>${w.rauchen}</dd></div>
        <div><dt>Haustiere</dt><dd>${w.haustiere}</dd></div>
        <div><dt>Sprachen</dt><dd>${w.sprachen.join(', ')}</dd></div>
        <div><dt>Bad</dt><dd>${w.badGeteilt}</dd></div>
      </dl>

      ${m ? h`<h3>Wie ihr zusammenpasst</h3>
      <div class="lifestyle">
        ${m.details.map((d) => h`<div class="lifestyle__zeile">
          <span class="lifestyle__label">${d.label}</span>
          <span class="lifestyle__spur">
            <i class="lifestyle__wg" style="left:${d.wg * 10}%" title="WG: ${d.wg} von 10"></i>
            <i class="lifestyle__du" style="left:${d.du * 10}%" title="Du: ${d.du} von 10"></i>
            <em class="lifestyle__brueck" style="left:${Math.min(d.du, d.wg) * 10}%;width:${d.abweichung * 10}%"></em>
          </span>
          <span class="lifestyle__enden"><i>${d.links}</i><i>${d.rechts}</i></span>
        </div>`)}
        <p class="lifestyle__legende">
          <span class="lifestyle__punkt lifestyle__punkt--du"></span>du
          <span class="lifestyle__punkt lifestyle__punkt--wg"></span>diese WG
        </p>
      </div>
      ${m.ausschluss.length ? h`<p class="warn-meldung">${ico('warnung')}${m.ausschluss.join(' ')}</p>` : ''}
      ${m.hinweise.length ? h`<p class="info-meldung">${ico('info')}${m.hinweise.join(' ')}</p>` : ''}
      <p class="fein">Größte Übereinstimmung: ${m.staerke.label}. Größter Unterschied: ${m.schwaeche.label}.
        <a href="#/profil">Eigene Angaben ändern</a></p>` :
      h`<p class="info-meldung">${ico('info')}Fülle im <a href="#/profil">Profil</a> deine WG-Angaben aus,
        dann rechnet Nestwerk die Passung aus.</p>`}
    </section>`;
  }

  /* ------------------------- Tausch ------------------------- */

  function tauschBlock(l) {
    if (l.kind !== 'tausch' || !l.tausch) return '';
    const s = S.get();
    const alle = NW.data.listings.filter((x) => x.kind === 'tausch').concat(s.meinTausch ? [s.meinTausch] : []);
    const ringe = M.ringeFuer(alle, l.id).slice(0, 3);
    return h`<section class="block" id="tausch">
      <h2>${ico('tausch')}Tauschwunsch</h2>
      <p class="block__unter">${l.tausch.grund}</p>
      <dl class="fakten fakten--dicht">
        <div><dt>Wunschorte</dt><dd>${l.tausch.suche.staedte.join(', ')}</dd></div>
        <div><dt>Mindestens</dt><dd>${U.dec(l.tausch.suche.zimmerMin)} Zimmer, ${l.tausch.suche.flaecheMin} m²</dd></div>
        <div><dt>Warmmiete bis</dt><dd>${U.eur(l.tausch.suche.warmMax)}</dd></div>
        <div><dt>Wunschausstattung</dt><dd>${l.tausch.suche.wunschAusstattung.length ? l.tausch.suche.wunschAusstattung.join(', ') : 'keine Vorgabe'}</dd></div>
        <div><dt>Ringtausch</dt><dd>${l.tausch.dreiecktauschOk ? 'einverstanden' : 'nur direkter Tausch'}</dd></div>
        <div><dt>Vermieterzustimmung</dt><dd>${l.tausch.vermieterZustimmung}</dd></div>
      </dl>
      ${ringe.length ? h`<h3>${ringe.length} passende ${U.plural(ringe.length, 'Kette', 'Ketten')} im Bestand</h3>
        <ul class="ringliste">
          ${ringe.map((r) => h`<li>
            <b>${r.laenge === 2 ? 'Direkter Tausch' : r.laenge + 'er-Ring'}</b>
            <span>${r.knoten.map((k) => k.stadt + '/' + k.viertel).join(' → ')} → ${r.knoten[0].stadt}</span>
            <em>${Math.round(r.wert * 100)} % Güte</em>
          </li>`)}
        </ul>
        <p><a class="knopf knopf--still" href="#/tausch">${ico('ring')}Alle Ketten im Ringtausch ansehen</a></p>`
      : h`<p class="info-meldung">${ico('info')}Für dieses Angebot gibt es aktuell keine geschlossene Kette.
        Lege im <a href="#/tausch">Ringtausch</a> dein eigenes Angebot an – vielleicht schließt du den Ring.</p>`}
      <div class="hinweisbox">${ico('info')}
        <div><b>Wohnungstausch geht nur mit der Vermieterseite</b>
        <p>Ein Tausch ist rechtlich kein Übergang des Mietvertrags, sondern zweimal Kündigung und zweimal Neuabschluss.
        Beide Vermieter müssen mitspielen. Viele Genossenschaften und kommunale Gesellschaften unterstützen das
        ausdrücklich, private Eigentümer selten. Frag früh nach – nicht erst, wenn die Kette steht.</p></div>
      </div>
    </section>`;
  }

  /* ------------------------- Lage ------------------------- */

  function lageBlock(l, b) {
    const d = NW.geo.districtByKey[l.viertelKey];
    const werte = d ? [['ÖPNV', d.oepnv], ['Grün', d.gruen], ['Ruhe', d.ruhe], ['Einkauf', d.einkauf], ['Ausgehen', d.ausgehen]] : [];
    const profil = S.get().profil;
    const wege = (profil.anker || []).map((a) => ({
      name: a.name,
      zeiten: Object.keys(U.TRAVEL).map((mo) => ({ mo, label: U.TRAVEL[mo].label, min: U.travelMin(l, a, mo) }))
    }));
    return h`<section class="block" id="lage">
      <h2>${ico('karte')}Lage</h2>
      <p class="block__unter">${l.viertel}, ${l.stadt}${d ? ' – ' + d.charakter : ''}. ${l.strasse}.</p>
      <div class="lage">
        <div class="lage__karte" id="objekt-karte"></div>
        <div class="lage__werte">
          ${werte.map((w) => h`<div class="balkenzeile">
            <span>${w[0]}</span>
            <span class="balken"><i style="width:${w[1] * 20}%"></i></span>
            <b>${w[1]}/5</b>
          </div>`)}
        </div>
      </div>
      ${wege.length ? h`<h3>Wege</h3>
        <table class="tabelle">
          <thead><tr><th>Ziel</th>${Object.keys(U.TRAVEL).map((mo) => h`<th>${U.TRAVEL[mo].label}</th>`)}</tr></thead>
          <tbody>
            ${wege.map((w) => h`<tr><th scope="row">${w.name}</th>
              ${w.zeiten.map((z) => h`<td>${U.minutesLabel(z.min)}</td>`)}</tr>`)}
          </tbody>
        </table>
        <p class="fein">Geschätzt aus Entfernung, Umwegfaktor und Zu-/Abgang – kein Fahrplan.</p>`
      : h`<p class="info-meldung">${ico('info')}Trag im <a href="#/profil">Profil</a> deine Arbeits- oder Studienadresse ein,
        dann zeigt Nestwerk hier die Fahrzeiten.</p>`}
    </section>`;
  }

  /* ------------------------- Anbieter ------------------------- */

  function anbieterBlock(l) {
    const a = l.anbieter;
    const tage = U.daysSince(a.seit);
    const artLabel = { privat: 'Privatperson', makler: 'Maklerbüro', verwaltung: 'Hausverwaltung', genossenschaft: 'Genossenschaft' };
    return h`<section class="block" id="anbieter">
      <h2>${ico('person')}Anbieter</h2>
      <div class="anbieter">
        ${raw(NW.img.avatar(a.name, 56))}
        <div class="anbieter__text">
          <b>${a.name} ${a.verifiziert ? raw('<span class="pruefzeichen" title="Identität bestätigt">' + U.svg('pruefen').__raw + '</span>') : ''}</b>
          <span>${artLabel[a.art]} · aktiv seit ${tage > 365 ? Math.round(tage / 365) + ' Jahren' : tage + ' Tagen'}
            · ${a.inserate} ${U.plural(a.inserate, 'Inserat', 'Inserate')}</span>
        </div>
        <div class="anbieter__zahlen">
          <div><b>${a.quote} %</b><span>antwortet</span></div>
          <div><b>${a.antwortStd < 24 ? a.antwortStd + ' Std.' : Math.round(a.antwortStd / 24) + ' Tage'}</b><span>im Schnitt</span></div>
        </div>
      </div>
      <p class="fein">Antwortquote und Reaktionszeit stammen aus dem bisherigen Verhalten auf der Plattform.
        Unter 50 % lohnt sich eine zweite Option.</p>
    </section>`;
  }

  /* ------------------------- Termine ------------------------- */

  function termineBlock(l) {
    const eintrag = S.get().merkliste[l.id];
    const gebucht = eintrag && eintrag.termin;
    if (!l.besichtigungen || !l.besichtigungen.length) {
      return h`<section class="block" id="termine">
        <h2>${ico('kalender')}Besichtigung</h2>
        <p class="info-meldung">${ico('info')}Für dieses Objekt sind keine Termine hinterlegt.
          Frag beim Anschreiben direkt nach zwei konkreten Zeitfenstern – das spart eine Runde.</p>
      </section>`;
    }
    return h`<section class="block" id="termine">
      <h2>${ico('kalender')}Besichtigung buchen</h2>
      <p class="block__unter">Feste Zeitfenster statt Massenandrang. Ein Platz gehört dir, sobald du ihn nimmst.</p>
      ${gebucht ? h`<div class="gut-meldung">${ico('pruefen')}
        Du hast <b>${U.dateDE(gebucht.datum)} um ${gebucht.zeit}</b> gebucht (${gebucht.art}).
        <button type="button" class="link" data-tu="termin-ab" data-id="${l.id}">Termin absagen</button></div>` : ''}
      <ul class="termine">
        ${l.besichtigungen.map((t) => {
      const frei = t.plaetze - t.belegt;
      const dieser = gebucht && gebucht.id === t.id;
      return h`<li class="${dieser ? 'is-gebucht' : ''}">
            <div><b>${U.dateDE(t.datum)}</b><span>${t.zeit} Uhr · ${t.art}</span></div>
            <span class="termine__frei">${frei} ${U.plural(frei, 'Platz frei', 'Plätze frei')}</span>
            <button type="button" class="knopf knopf--klein ${dieser ? 'knopf--still' : ''}"
              data-tu="termin-buchen" data-id="${l.id}" data-termin="${t.id}" ${dieser ? 'disabled' : ''}>
              ${dieser ? 'gebucht' : 'nehmen'}</button>
          </li>`;
    })}
      </ul>
      <p><button type="button" class="link" data-tu="checkliste" data-id="${l.id}">${ico('blatt')}Besichtigungs-Checkliste öffnen</button></p>
    </section>`;
  }

  /* ------------------------- Finanzierung ------------------------- */

  function finanzBlock(l, k) {
    if (l.kind !== 'kauf') return '';
    const s = S.get();
    const ek = s.profil.eigenkapital || Math.round(l.kaufpreis * 0.2);
    const zins = s.profil.zins || 3.7;
    const tilgung = s.profil.tilgung || 2;
    const f = A.finanzierung(l.kaufpreis, k.einmalSumme, ek, zins, tilgung, 10);
    return h`<section class="block" id="finanz">
      <h2>${ico('euro')}Finanzierung überschlagen</h2>
      <div class="regler">
        <label class="feld feld--regler"><span>Eigenkapital <b>${U.eur(ek)}</b></span>
          <input type="range" min="0" max="${Math.round(l.kaufpreis * 0.6)}" step="5000" value="${ek}" data-tu-input="finanz" data-feld="eigenkapital"></label>
        <label class="feld feld--regler"><span>Sollzins <b>${U.dec(zins)} %</b></span>
          <input type="range" min="1" max="7" step="0.1" value="${zins}" data-tu-input="finanz" data-feld="zins"></label>
        <label class="feld feld--regler"><span>Anfangstilgung <b>${U.dec(tilgung)} %</b></span>
          <input type="range" min="1" max="5" step="0.5" value="${tilgung}" data-tu-input="finanz" data-feld="tilgung"></label>
      </div>
      <div class="kennzahlen">
        <div><b>${U.eur(f.gesamt)}</b><span>Gesamtkosten mit Nebenkosten</span></div>
        <div><b>${U.eur(f.darlehen)}</b><span>Darlehen</span></div>
        <div><b>${U.eur(f.rate)}</b><span>Rate im Monat</span></div>
        <div><b>${U.eur(f.restschuld)}</b><span>Restschuld nach 10 Jahren</span></div>
        <div><b>${U.dec(f.laufzeitJahre)} Jahre</b><span>bis zur Volltilgung</span></div>
        <div><b>${f.eigenkapitalQuote} %</b><span>Eigenkapitalquote</span></div>
      </div>
      <p class="fein">Annuitätendarlehen ohne Sondertilgung. Banken erwarten meist mindestens die Kaufnebenkosten
        als Eigenkapital, besser 20 % des Kaufpreises dazu.</p>
    </section>`;
  }

  /* ------------------------- Ähnliche ------------------------- */

  function aehnliche(l) {
    const profil = S.get().profil;
    const kandidaten = NW.data.listings
      .filter((x) => x.id !== l.id && x.kind === l.kind && x.stadt === l.stadt)
      .map((x) => {
        const preis = l.kind === 'kauf' ? Math.abs(x.kaufpreis - l.kaufpreis) / Math.max(1, l.kaufpreis)
          : Math.abs(x.warm - l.warm) / Math.max(1, l.warm);
        const flaeche = Math.abs(x.flaeche - l.flaeche) / Math.max(1, l.flaeche);
        const ort = U.distKm(x, l);
        return { x, d: preis * 2 + flaeche * 1.5 + ort * 0.12 };
      })
      .sort((a, b) => a.d - b.d).slice(0, 3);
    if (!kandidaten.length) return '';
    return h`<section class="block" id="aehnlich">
      <h2>${ico('liste')}Ähnliche Angebote</h2>
      <div class="ergebnisse__liste ergebnisse__liste--drei">
        ${kandidaten.map((k) => ui.inseratsKarte(k.x, A.bewerten(k.x, profil), { kompakt: true }))}
      </div>
    </section>`;
  }

  /* ------------------------- Seite ------------------------- */

  function ansicht(route) {
    const l = NW.data.byId[route.arg];
    if (!l) {
      return { titel: 'Nicht gefunden', html: h`<div class="leer">${ico('warnung')}<h2>Dieses Inserat gibt es nicht (mehr)</h2>
        <p><a class="knopf" href="#/suche">Zur Suche</a></p></div>` };
    }
    S.gesehenMerken(l.id);
    const s = S.get();
    const b = A.bewerten(l, s.profil);
    const k = A.kosten(l, s.profil);
    const gemerkt = S.gemerkt(l.id), imVergleich = S.imVergleich(l.id);
    const eintrag = s.merkliste[l.id];

    return {
      titel: l.titel,
      html: h`<div class="objekt">
        <nav class="brotkrumen" aria-label="Pfad">
          <a href="#/suche">Suche</a>${ico('chevron')}<a href="#/suche?stadt=${encodeURIComponent(l.stadt)}">${l.stadt}</a>
          ${ico('chevron')}<span>${l.viertel}</span>
        </nav>

        <div class="objekt__kopf">
          <div class="objekt__titel">
            <div class="karte-inserat__marken">${ui.kartenMarken(l, b)}</div>
            <h1>${l.titel}</h1>
            <p class="objekt__ort">${ico('karte')}${l.strasse}, ${l.viertel}, ${l.stadt}</p>
          </div>
          <div class="objekt__preis">
            <b>${l.kind === 'kauf' ? U.eur(l.kaufpreis) : U.eur(l.warm)}</b>
            <span>${l.kind === 'kauf' ? U.eur(Math.round(l.kaufpreis / l.flaeche)) + ' je m²' : 'warm · ' + U.eur(l.kalt) + ' kalt'}</span>
          </div>
        </div>

        ${galerie(l)}

        <div class="objekt__tun">
          <button type="button" class="knopf" data-tu="anschreiben" data-id="${l.id}">${ico('nachricht')}${anfrageWort(l)}</button>
          <button type="button" class="knopf knopf--still ${gemerkt ? 'is-an' : ''}" data-tu="merken" data-id="${l.id}"
            aria-pressed="${gemerkt ? 'true' : 'false'}">${ico('herz')}${gemerkt ? 'Gemerkt' : 'Merken'}</button>
          <button type="button" class="knopf knopf--still ${imVergleich ? 'is-an' : ''}" data-tu="vergleich" data-id="${l.id}"
            aria-pressed="${imVergleich ? 'true' : 'false'}">${ico('waage')}Vergleichen</button>
          <button type="button" class="knopf knopf--still" data-tu="objekt-teilen" data-id="${l.id}">${ico('teilen')}Teilen</button>
          ${eintrag ? h`<label class="feld feld--flach objekt__status">
            <span class="nur-sr">Status</span>
            <select data-tu-change="status-setzen" data-id="${l.id}">
              ${S.PIPELINE.map((p) => h`<option value="${p.id}" ${eintrag.status === p.id ? 'selected' : ''}>${p.label}</option>`)}
            </select></label>` : ''}
        </div>

        <div class="objekt__raster">
          <div class="objekt__haupt">
            <section class="block" id="eckdaten">
              <h2>${ico('haus')}Eckdaten</h2>
              <dl class="fakten">
                ${l.type === 'grundstueck' ? h`
                <div><dt>Grundstück</dt><dd>${U.num(l.grundstueck || l.flaeche)} m²</dd></div>
                <div><dt>Art</dt><dd>${(l.grund || {}).baulandArt || 'Bauland'}</dd></div>
                <div><dt>Bebauungsplan</dt><dd>${(l.grund || {}).bplan || 'unbekannt'}</dd></div>
                <div><dt>GRZ / GFZ</dt><dd>${U.dec((l.grund || {}).grz || 0)} / ${U.dec((l.grund || {}).gfz || 0)}</dd></div>
                <div><dt>Erschließung</dt><dd>${(l.grund || {}).erschliessung || 'unbekannt'}</dd></div>
                <div><dt>Verfügbar ab</dt><dd>${U.daysSince(l.freiAb) > 0 ? 'sofort' : U.dateDE(l.freiAb)}</dd></div>` : h`
                <div><dt>Zimmer</dt><dd>${U.dec(l.zimmer)}</dd></div>
                <div><dt>${l.kind === 'wg' ? 'Zimmergröße' : 'Wohnfläche'}</dt><dd>${l.flaeche} m²</dd></div>
                ${l.kind === 'wg' ? h`<div><dt>Wohnung gesamt</dt><dd>${l.wohnflaeche} m²</dd></div>` : ''}
                ${l.grundstueck ? h`<div><dt>Grundstück</dt><dd>${U.num(l.grundstueck)} m²</dd></div>` : ''}
                ${l.bauweise ? h`<div><dt>Bauweise</dt><dd>${l.bauweise}</dd></div>` : ''}
                ${l.type === 'haus' ? '' : h`<div><dt>Etage</dt><dd>${l.etage === 0 ? 'Erdgeschoss' : l.etage >= l.etagen ? 'Dachgeschoss' : l.etage + '. OG'} von ${l.etagen}</dd></div>`}
                <div><dt>Baujahr</dt><dd>${l.baujahr}${l.saniert ? ' · saniert' : ''}</dd></div>
                <div><dt>Frei ab</dt><dd>${U.daysSince(l.freiAb) > 0 ? 'sofort' : U.dateDE(l.freiAb)}</dd></div>
                ${l.befristetBis ? h`<div><dt>Befristet bis</dt><dd>${U.dateDE(l.befristetBis)}</dd></div>` : ''}
                <div><dt>Heizung</dt><dd>${l.energie.heizung}</dd></div>
                <div><dt>Energie</dt><dd>${ui.energieBalken(l.energie.klasse)} ${l.energie.kwh} kWh/(m²·a), ${l.energie.art}</dd></div>`}
                ${l.kind !== 'kauf' ? h`<div><dt>Kaution</dt><dd>${l.kaution ? l.kaution + ' ' + U.plural(l.kaution, 'Kaltmiete', 'Kaltmieten') + ' (' + U.eur(l.kalt * l.kaution) + ')' : 'keine'}</dd></div>` : ''}
                ${l.kind === 'kauf' && l.hausgeld ? h`<div><dt>Hausgeld</dt><dd>${U.eur(l.hausgeld)} im Monat</dd></div>` : ''}
                <div><dt>Provision</dt><dd>${l.provision ? U.dec(l.provision) + (l.kind === 'kauf' ? ' % des Kaufpreises' : ' Kaltmieten') : 'provisionsfrei'}</dd></div>
                <div><dt>Online seit</dt><dd>${U.since(l.stats.online)}</dd></div>
                <div><dt>Interessenten</dt><dd>${l.stats.bewerber} bei ${U.num(l.stats.aufrufe)} Aufrufen</dd></div>
              </dl>
            </section>

            <section class="block" id="ausstattung">
              <h2>${ico('check')}Ausstattung</h2>
              <ul class="merkmale">
                ${l.ausstattung.map((a) => h`<li>${ico('check')}${a}</li>`)}
              </ul>
            </section>

            <section class="block" id="beschreibung">
              <h2>${ico('blatt')}Beschreibung</h2>
              <p class="fliesstext">${l.beschreibung}</p>
            </section>

            ${risikoBlock(l, b.risiko)}
            ${duplikatBlock(l)}
            ${spiegelBlock(l, b.mietCheck, b.kaufCheck, b.bodenCheck)}
            ${klauselBlock(l)}
            ${chancenBlock(l)}
            ${kostenBlock(l, k)}
            ${finanzBlock(l, k)}
            ${wgBlock(l, b)}
            ${tauschBlock(l)}
            ${lageBlock(l, b)}
            ${termineBlock(l)}
            ${anbieterBlock(l)}
            ${aehnliche(l)}
          </div>

          <aside class="objekt__seite">
            <div class="haftbox">
              ${passungBlock(l, b)}
              <div class="haftbox__tun">
                <button type="button" class="knopf knopf--voll" data-tu="anschreiben" data-id="${l.id}">${ico('nachricht')}${anfrageWort(l)}</button>
                <a class="knopf knopf--still knopf--voll" href="#kosten">${ico('rechner')}${U.eur(k.monatSumme)} echte Monatskosten</a>
              </div>
              ${eintrag ? h`<label class="feld"><span>Deine Notiz</span>
                <textarea rows="3" data-tu-input="notiz" data-id="${l.id}" placeholder="Was ist dir aufgefallen?">${eintrag.notiz || ''}</textarea></label>` : ''}
              <p class="haftbox__expose">
                <button type="button" class="link" data-tu="expose" data-id="${l.id}">
                  ${ico('blatt')}Exposé als Datei${P.darf('exposeExport') ? '' : ' (Plus)'}</button>
              </p>
            </div>
            ${ui.anzeige('objekt-' + l.id, 'schmal')}
          </aside>
        </div>
      </div>`,
      danach() {
        const flaeche = U.$('#objekt-karte');
        if (flaeche) {
          const umgebung = NW.data.listings.filter((x) => x.stadt === l.stadt && U.distKm(x, l) < 3.2);
          const k2 = NW.karte.erzeugen(flaeche, { onSelect: (id) => ui.gehe('objekt/' + id) });
          k2.setzen(umgebung.length > 1 ? umgebung : [l], l.id, null);
        }
      }
    };
  }

  /* ------------------------- Aktionen ------------------------- */

  const A_ = ui.aktionRegistrieren;

  A_('bild', (el) => {
    const l = NW.data.byId[ui.params.arg];
    if (!l) return;
    const n = NW.img.count(l);
    bildIndex = (bildIndex + Number(el.dataset.schritt) + n) % n;
    ui.neuZeichnen();
  });

  A_('bild-zu', (el) => { bildIndex = Number(el.dataset.i); ui.neuZeichnen(); });

  A_('status-setzen', (el) => {
    S.setStatus(el.dataset.id, el.value);
    ui.toast('Status auf „' + (S.PIPELINE.find((p) => p.id === el.value) || {}).label + '“ gesetzt.');
    ui.aktualisiereZaehler();
  });

  A_('notiz', U.debounce((el) => { S.setNotiz(el.dataset.id, el.value); }, 500));

  A_('termin-buchen', (el) => {
    const t = S.terminBuchen(el.dataset.id, el.dataset.termin);
    if (t) ui.toast('Termin am ' + U.dateDE(t.datum) + ' um ' + t.zeit + ' gebucht.', 'gut');
    ui.neuZeichnen();
  });

  A_('termin-ab', (el) => { S.terminAbsagen(el.dataset.id); ui.toast('Termin abgesagt.'); ui.neuZeichnen(); });

  A_('objekt-teilen', (el) => {
    const l = NW.data.byId[el.dataset.id];
    const text = l.titel + ' – ' + (l.kind === 'kauf' ? U.eur(l.kaufpreis) : U.eur(l.warm) + ' warm') +
      ', ' + U.dec(l.zimmer) + ' Zi., ' + l.flaeche + ' m², ' + l.viertel + ' (' + l.stadt + ')\n' +
      location.href.split('#')[0] + '#/objekt/' + l.id;
    if (navigator.share) {
      navigator.share({ title: l.titel, text }).catch(() => { });
    } else {
      ui.AKTIONEN.kopieren({ dataset: { text } });
    }
  });

  A_('expose', (el) => {
    if (!P.darf('exposeExport')) {
      ui.AKTIONEN.sperre({ dataset: { leistung: 'expose' } });
      return;
    }
    const l = NW.data.byId[el.dataset.id];
    const s = S.get();
    const b = A.bewerten(l, s.profil), k = A.kosten(l, s.profil);
    const c = l.kind !== 'kauf' ? W.chancen(l, s.profil) : null;
    const funde = A.klauselCheck(l);
    const z = [];
    const linie = () => z.push('-'.repeat(64));

    z.push(l.titel);
    linie();
    z.push(l.strasse + ', ' + l.viertel + ', ' + l.stadt);
    z.push('Stand: ' + U.dateDE(U.isoDate(NW.now())) + ' · Nestwerk');
    z.push('');
    z.push('ECKDATEN');
    if (l.type === 'grundstueck') {
      const g = l.grund || {};
      z.push('  Grundstück:    ' + U.num(l.grundstueck || l.flaeche) + ' m²');
      z.push('  Art:           ' + (g.baulandArt || 'Bauland'));
      z.push('  Bebauungsplan: ' + (g.bplan || 'unbekannt'));
      z.push('  GRZ / GFZ:     ' + U.dec(g.grz || 0) + ' / ' + U.dec(g.gfz || 0));
      z.push('  Erschließung:  ' + (g.erschliessung || 'unbekannt'));
      z.push('  Verfügbar ab:  ' + U.dateDE(l.freiAb));
    } else {
      z.push('  Zimmer:        ' + U.dec(l.zimmer));
      z.push('  Fläche:        ' + l.flaeche + ' m²');
      if (l.grundstueck) z.push('  Grundstück:    ' + U.num(l.grundstueck) + ' m²');
      if (l.type !== 'haus') {
        z.push('  Etage:         ' + (l.etage === 0 ? 'Erdgeschoss' : l.etage >= l.etagen ? 'Dachgeschoss' : l.etage + '. OG') + ' von ' + l.etagen);
      }
      z.push('  Baujahr:       ' + l.baujahr + (l.saniert ? ' (saniert)' : ''));
      if (l.energie) z.push('  Energie:       ' + l.energie.klasse + ', ' + l.energie.kwh + ' kWh/(m²·a), ' + l.energie.heizung);
      z.push('  Frei ab:       ' + U.dateDE(l.freiAb));
      z.push('  Ausstattung:   ' + l.ausstattung.join(', '));
    }
    z.push('');
    z.push('KOSTEN');
    k.monatlich.forEach((m) => z.push('  ' + m.label.padEnd(34) + U.eur(m.betrag).padStart(12)));
    z.push('  ' + 'Monatlich insgesamt'.padEnd(34) + U.eur(k.monatSumme).padStart(12));
    z.push('');
    k.einmalig.forEach((m) => z.push('  ' + m.label.padEnd(34) + U.eur(m.betrag).padStart(12)));
    z.push('  ' + 'Einmalig insgesamt'.padEnd(34) + U.eur(k.einmalSumme).padStart(12));
    z.push('  ' + 'Erstes Jahr'.padEnd(34) + U.eur(k.erstesJahr).padStart(12));
    if (k.quote) z.push('  Mietbelastungsquote: ' + k.quote + ' %');
    z.push('');
    if (b.mietCheck) {
      z.push('PREIS IM VERGLEICH');
      z.push('  ' + U.dec(b.mietCheck.proQm) + ' €/m² gegenüber ' + U.dec(b.mietCheck.referenz) + ' €/m² Vergleichswert');
      z.push('  ' + (b.mietCheck.diff >= 0 ? '+' : '') + b.mietCheck.diff + ' % – ' + b.mietCheck.urteil);
      if (b.mietCheck.mietpreisbremse) z.push('  Bei greifender Mietpreisbremse wären rund ' + U.eur(b.mietCheck.zulaessig) + ' Kaltmiete zulässig.');
      z.push('');
    }
    if (b.risiko.gruende.length) {
      z.push('PRÜFHINWEIS (' + b.risiko.stufe + ')');
      b.risiko.gruende.forEach((g) => z.push('  - ' + g.grund));
      z.push('');
    }
    if (funde.length) {
      z.push('VERTRAGSLUPE');
      funde.forEach((f) => {
        z.push('  [' + f.bewertung + '] ' + f.titel + ' (' + f.quelle + ')');
        z.push('      „' + f.fundstelle + '“');
        z.push('      ' + f.erklaerung);
      });
      z.push('');
    }
    if (c) {
      z.push('CHANCEN');
      z.push('  Geschätzt ' + c.prozent + ' % bei ' + c.mitbewerber + ' weiteren Interessenten.');
      c.faktoren.forEach((f) => z.push('  ' + (f.wirkung === 'plus' ? '+' : f.wirkung === 'minus' ? '-' : '·') + ' ' + f.label + ': ' + f.text));
      z.push('');
    }
    z.push('PASSUNG ZU DEINEM PROFIL: ' + b.score + ' von 100');
    b.teile.forEach((t) => z.push('  ' + t.label.padEnd(20) + Math.round(t.anteil * 100) + ' %  ' + t.text));
    z.push('');
    z.push('ANBIETER');
    z.push('  ' + l.anbieter.name + ' · antwortet in ' + l.anbieter.quote + ' % der Fälle');
    z.push('');
    if (S.get().merkliste[l.id] && S.get().merkliste[l.id].notiz) {
      z.push('EIGENE NOTIZ');
      z.push('  ' + S.get().merkliste[l.id].notiz);
      z.push('');
    }
    z.push('BESCHREIBUNG');
    z.push('  ' + l.beschreibung.replace(/(.{1,72})(\s|$)/g, '$1\n  ').trim());
    z.push('');
    linie();
    z.push('Erzeugt mit Nestwerk. Vorführfassung mit erzeugtem Beispielbestand.');

    ui.dateiSichern('expose-' + U.slug(l.titel).slice(0, 40) + '.txt', z.join('\n'), 'text/plain;charset=utf-8');
  });

  A_('kosten-anpassen', () => {
    const p = S.get().profil;
    ui.dialog({
      titel: 'Angaben für die Kostenrechnung',
      inhalt: h`<label class="feld"><span>Personen im Haushalt</span>
          <input type="number" min="1" max="6" id="k-haushalt" value="${p.haushalt}"></label>
        <label class="feld"><span>Nettoeinkommen im Monat (Haushalt)</span>
          <input type="number" min="0" step="50" id="k-netto" value="${p.nettoEinkommen}"></label>
        <p class="fein">Beides fließt nur in die Rechnung auf diesem Gerät ein.</p>`,
      fuss: h`<button type="button" class="knopf" data-tu="kosten-uebernehmen">Übernehmen</button>`
    });
  });

  A_('kosten-uebernehmen', () => {
    const p = S.get().profil;
    p.haushalt = Number(U.$('#k-haushalt').value) || 1;
    p.nettoEinkommen = Number(U.$('#k-netto').value) || 0;
    S.set({ profil: p }, 'profil');
    ui.dialogZu();
    ui.neuZeichnen();
  });

  A_('finanz', U.debounce((el) => {
    const p = S.get().profil;
    p[el.dataset.feld] = Number(el.value);
    S.set({ profil: p }, 'profil');
    ui.neuZeichnen();
  }, 200));

  A_('checkliste', (el) => {
    const id = el.dataset.id;
    const eintrag = S.get().merkliste[id] || { checkliste: {} };
    const gruppen = {};
    S.BESICHTIGUNG_FRAGEN.forEach((f) => { (gruppen[f.gruppe] = gruppen[f.gruppe] || []).push(f); });
    ui.dialog({
      titel: 'Besichtigungs-Checkliste',
      breit: true,
      inhalt: h`<p>Abhaken, was du geprüft hast. Alles bleibt bei diesem Objekt gespeichert und lässt sich
        am Ende als Text kopieren.</p>
        ${Object.keys(gruppen).map((g) => h`<fieldset class="filter__gruppe"><legend>${g}</legend>
          ${gruppen[g].map((f) => h`<label class="schalter">
            <input type="checkbox" data-tu-change="check" data-id="${id}" data-frage="${f.id}"
              ${(eintrag.checkliste || {})[f.id] ? 'checked' : ''}>
            <span>${f.text}</span></label>`)}
        </fieldset>`)}
        <label class="feld"><span>Notizen vor Ort</span>
          <textarea rows="4" data-tu-input="notiz" data-id="${id}">${eintrag.notiz || ''}</textarea></label>`,
      fuss: h`<button type="button" class="knopf knopf--still" data-tu="check-kopieren" data-id="${id}">${ico('kopieren')}Als Text kopieren</button>
        <button type="button" class="knopf" data-tu="dialog-zu">Fertig</button>`
    });
  });

  A_('check', (el) => { S.checkSetzen(el.dataset.id, el.dataset.frage, el.checked); });

  A_('check-kopieren', (el) => {
    const id = el.dataset.id, l = NW.data.byId[id];
    const e = S.get().merkliste[id] || { checkliste: {} };
    const zeilen = ['Besichtigung: ' + l.titel, l.strasse + ', ' + l.viertel + ', ' + l.stadt, ''];
    S.BESICHTIGUNG_FRAGEN.forEach((f) => {
      zeilen.push(((e.checkliste || {})[f.id] ? '[x] ' : '[ ] ') + f.text);
    });
    if (e.notiz) { zeilen.push('', 'Notizen:', e.notiz); }
    ui.AKTIONEN.kopieren({ dataset: { text: zeilen.join('\n') } });
  });

  /* Bewerbung mit Mieterprofil */
  A_('anschreiben', (el) => {
    const l = NW.data.byId[el.dataset.id];
    const p = S.get().profil;
    const fehlt = Object.keys(p.unterlagen).filter((k) => !p.unterlagen[k] && k !== 'wbs' && k !== 'buergschaft');
    const namen = { schufa: 'Schufa-Auskunft', gehaltsnachweise: 'Gehaltsnachweise', ausweis: 'Ausweiskopie',
      mietschuldenfrei: 'Mietschuldenfreiheit', buergschaft: 'Bürgschaft', selbstauskunft: 'Selbstauskunft', wbs: 'WBS' };
    const vorlage = anschreibenText(l, p);
    const kauf = istKaufAnfrage(l);
    ui.dialog({
      titel: kauf ? 'Anfrage' : 'Anschreiben',
      breit: true,
      inhalt: h`<p class="block__unter">${kauf
        ? 'Nestwerk hat die Fragen zusammengestellt, deren Antworten den Preis mitbestimmen. Streich, was du '
        + 'schon weißt, und ergänze, was dir wichtig ist.'
        : 'Nestwerk hat aus deinem Profil einen Vorschlag geschrieben. Ändere ihn, bis er nach dir klingt.'}</p>
        <label class="feld"><span>Nachricht</span>
          <textarea rows="12" id="anschreiben-text">${vorlage}</textarea></label>
        ${kauf ? h`<div class="hinweisbox">${ico('info')}
          <div><b>Einkommen und Bonität gehören nicht in die erste Anfrage</b>
          <p>Beim Kauf verhandelst du. Wer gleich zu Beginn schreibt, was er verdient und wie viel Eigenkapital
            er hat, gibt seine Verhandlungsposition ohne Not preis. Ein Finanzierungsnachweis wird üblicherweise
            erst verlangt, wenn es konkret wird – und dann reicht die Bestätigung der Bank über eine Summe, nicht
            deine Gehaltsabrechnung.</p></div>
        </div>` : h`<fieldset class="filter__gruppe"><legend>Bewerbermappe</legend>
          <p class="fein">Was du mitschickst, entscheidet oft mehr als der Text. Fehlende Unterlagen erst
            nach der Besichtigung nachreichen – vorher gehören Ausweis und Schufa niemandem.</p>
          <ul class="mappe">
            ${Object.keys(p.unterlagen).map((kk) => h`<li class="${p.unterlagen[kk] ? 'is-da' : ''}">
              ${ico(p.unterlagen[kk] ? 'check' : 'x')}${namen[kk]}</li>`)}
          </ul>
          ${fehlt.length ? h`<p class="warn-meldung">${ico('warnung')}Es fehlen: ${fehlt.map((f) => namen[f]).join(', ')}.
            <a href="#/profil">Im Profil ergänzen</a></p>` : h`<p class="gut-meldung">${ico('pruefen')}Deine Mappe ist vollständig.</p>`}
        </fieldset>
        ${NW.viewTresor ? NW.viewTresor.freigabeAbschnitt(l.id, l.anbieter.name) : ''}`}
        ${P.darf('anfrageVorne')
        ? h`<p class="gut-meldung">${ico('plus5')}<span>Deine Anfrage erscheint im Postfach der anbietenden
          Seite <b>oben</b> und ist dort als Plus gekennzeichnet. Über deine Chancen sagt das nichts – es ist
          bezahlte Sichtbarkeit, kein Urteil.</span></p>`
        : h`<p class="info-meldung">${ico('info')}<span>Deine Anfrage erscheint in der Reihenfolge des Eingangs.
          <a href="#/plus">Mit Plus</a> stünde sie oben, sichtbar gekennzeichnet – am Inhalt ändert das nichts,
          und gelöscht wird ohne Plus nichts.</span></p>`}`,
      fuss: h`<button type="button" class="knopf knopf--still" data-tu="anschreiben-kopieren">${ico('kopieren')}Text kopieren</button>
        <button type="button" class="knopf" data-tu="anschreiben-senden" data-id="${l.id}">${ico('nachricht')}Absenden</button>`
    });
  });

  /* Beim Kauf heißt es nicht „bewerben“. Wer sein Nettoeinkommen und die
     Selbstauskunft in die erste Anfrage zu einem Grundstück schreibt,
     verrät ohne Not seine Verhandlungsposition. */
  const istKaufAnfrage = (l) => l.kind === 'kauf';
  const anfrageWort = (l) => istKaufAnfrage(l) ? 'Anfragen' : 'Anschreiben';

  function anschreibenText(l, p) {
    if (istKaufAnfrage(l)) return anfrageText(l, p);
    const anrede = l.anbieter.art === 'privat' ? 'Hallo ' + l.anbieter.name.split(' ')[0] + ','
      : 'Guten Tag,';
    const wer = [];
    if (p.name) wer.push('ich heiße ' + p.name);
    if (p.alter) wer.push('bin ' + p.alter);
    if (p.beruf) wer.push('arbeite ' + (/^(als|im|in|bei)\b/.test(p.beruf) ? p.beruf : 'als ' + p.beruf));
    const haushalt = p.haushalt > 1 ? 'Wir sind ' + p.haushalt + ' Personen.' : 'Ich würde allein einziehen.';
    const einkommen = p.nettoEinkommen ? 'Mein Nettoeinkommen liegt bei rund ' + U.eur(p.nettoEinkommen) + ' im Monat.' : '';
    const wann = p.einzugAb ? 'Einziehen könnte ich ab ' + U.dateDE(p.einzugAb) + '.'
      : 'Beim Einzugstermin bin ich flexibel.';
    const wg = l.kind === 'wg' ? ' Über ein Kennenlernen mit euch würde ich mich freuen.' : '';
    return anrede + '\n\n' +
      'Ihr Inserat „' + l.titel + '“ passt sehr gut zu dem, was ich suche. ' +
      (wer.length ? wer.join(', ').replace(/^i/, 'I') + '. ' : '') + haushalt + ' ' + einkommen + ' ' + wann + wg + '\n\n' +
      (p.vorstellung ? p.vorstellung + '\n\n' : '') +
      W.unterlagenSatz(p) + ' ' +
      'Nennen Sie mir gern zwei Termine, die Ihnen passen.\n\n' +
      'Viele Grüße\n' + (p.name || '');
  }

  function anfrageText(l, p) {
    const anrede = l.anbieter.art === 'privat' ? 'Hallo ' + l.anbieter.name.split(' ')[0] + ',' : 'Guten Tag,';
    const grund = l.type === 'grundstueck'
      ? 'ich interessiere mich für Ihr Grundstücksangebot „' + l.titel + '“.'
      : 'ich interessiere mich für Ihr Angebot „' + l.titel + '“.';
    /* Die Fragen, die vor jeder Besichtigung geklärt gehören und deren
       Antworten den Preis mitbestimmen. */
    const fragen = l.type === 'grundstueck'
      ? ['Liegt ein aktueller Auszug aus dem Baulastenverzeichnis vor?',
        'Sind die Erschließungsbeiträge nach § 127 BauGB vollständig gezahlt?',
        'Gibt es Altlastenverdacht oder ein Bodengutachten?',
        'Welche Dienstbarkeiten und Rechte sind in Abteilung II des Grundbuchs eingetragen?',
        'Gilt ein Bebauungsplan, und wenn ja: mit welcher Grund- und Geschossflächenzahl?']
      : ['Wie hoch sind Hausgeld und Instandhaltungsrücklage, und was ist darin enthalten?',
        'Welche Beschlüsse und Sonderumlagen stehen aus den letzten drei Eigentümerversammlungen an?',
        'Liegt der Energieausweis vor, und wann wurde die Heizung zuletzt erneuert?',
        'Gibt es Wohnrechte, Nießbrauch oder Dienstbarkeiten im Grundbuch?',
        'Ist das Objekt vermietet, und wenn ja: zu welchen Konditionen?'];
    return anrede + '\n\n' + grund + ' Bevor wir einen Besichtigungstermin vereinbaren, hätte ich einige '
      + 'Fragen:\n\n'
      + fragen.map((x, i) => (i + 1) + '. ' + x).join('\n')
      + '\n\nÜber die Unterlagen dazu würde ich mich freuen. Für eine Besichtigung nennen Sie mir gern zwei '
      + 'Termine, die Ihnen passen.\n\nViele Grüße\n' + (p.name || '');
  }

  A_('anschreiben-kopieren', () => {
    ui.AKTIONEN.kopieren({ dataset: { text: (U.$('#anschreiben-text') || {}).value || '' } });
  });

  A_('anschreiben-senden', (el) => {
    const text = (U.$('#anschreiben-text') || {}).value || '';
    if (!text.trim()) { ui.toast('Der Text ist leer.', 'schlecht'); return; }
    S.anschreiben(el.dataset.id, text);
    ui.dialogZu();
    ui.toast('Nachricht abgeschickt. Du findest sie unter Nachrichten.', 'gut');
    ui.neuZeichnen();
  });

  ui.ansichten.objekt = ansicht;
})(window.NW = window.NW || {});
