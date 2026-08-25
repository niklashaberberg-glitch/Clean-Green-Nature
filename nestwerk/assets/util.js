/* =====================================================================
   Nestwerk – Werkzeugkasten
   Formatierung, DOM-Hilfen, Zufall mit Saat, Geo-Rechnung, Speicher.
   Keine Abhängigkeiten. Wird als erstes Skript geladen.
   ===================================================================== */
(function (NW) {
  'use strict';

  /* ------------------------- Kleinkram ------------------------- */

  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
  const sum = (arr) => arr.reduce((a, b) => a + b, 0);
  const uniq = (arr) => Array.from(new Set(arr));

  function debounce(fn, ms) {
    let t;
    return function () {
      const args = arguments, self = this;
      clearTimeout(t);
      t = setTimeout(() => fn.apply(self, args), ms);
    };
  }

  /* Deterministischer Zufall: gleiche Saat => gleiche Daten bei jedem Laden. */
  function rng(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* Stabile Zahl aus einer Zeichenkette – für Bilder, Farben, Streuung. */
  function hash(str) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  const pick = (r, arr) => arr[Math.floor(r() * arr.length)];

  function pickN(r, arr, n) {
    const pool = arr.slice(), out = [];
    while (out.length < n && pool.length) out.push(pool.splice(Math.floor(r() * pool.length), 1)[0]);
    return out;
  }

  const between = (r, min, max) => min + r() * (max - min);
  const intBetween = (r, min, max) => Math.floor(between(r, min, max + 1));

  /* ------------------------- Formate ------------------------- */

  /* Zahlen schreiben sich je Sprache anders: 1.274,50 € im Deutschen,
     €1,274.50 im Englischen. Wer das nicht umstellt, zeigt einem
     englischen Leser „4,5 Zimmer“ und meint viereinhalb. Die Formatierer
     werden zwischengespeichert, weil Intl.NumberFormat teuer ist und in
     jeder Trefferliste hundertfach gebraucht wird. */
  const nfCache = Object.create(null);
  function nf(art) {
    const ort = NW.i18n && NW.i18n.sprache() === 'en' ? 'en-GB' : 'de-DE';
    const schluessel = ort + ':' + art;
    if (!nfCache[schluessel]) {
      const opt = art === 'eur' ? { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }
        : art === 'eur2' ? { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 }
        : art === 'dec' ? { maximumFractionDigits: 1 } : {};
      nfCache[schluessel] = new Intl.NumberFormat(ort, opt);
    }
    return nfCache[schluessel];
  }

  const eur = (v) => nf('eur').format(Math.round(Number(v) || 0));
  const eur2 = (v) => nf('eur2').format(Number(v) || 0);
  const num = (v) => nf('num').format(Math.round(Number(v) || 0));
  const dec = (v) => nf('dec').format(Number(v) || 0);
  const qm = (v) => dec(v) + ' m²';
  const pct = (v) => dec(v) + ' %';

  function rooms(v) {
    return dec(v) + ' ' + uebersetze('Zimmer');
  }

  function dateDE(iso) {
    if (!iso) return '';
    const d = new Date(iso + (iso.length === 10 ? 'T12:00:00' : ''));
    if (isNaN(d)) return String(iso);
    /* Englisch schreibt 25/08/2026, Deutsch 25.08.2026 – dieselbe Reihenfolge,
       anderes Trennzeichen. Die amerikanische Reihenfolge wäre hier falsch:
       Der Bestand und die Fristen sind deutsch. */
    return d.toLocaleDateString(NW.i18n && NW.i18n.sprache() === 'en' ? 'en-GB' : 'de-DE',
      { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  function monthDE(iso) {
    const d = new Date(iso + (iso.length === 10 ? 'T12:00:00' : ''));
    if (isNaN(d)) return String(iso);
    return d.toLocaleDateString(NW.i18n && NW.i18n.sprache() === 'en' ? 'en-GB' : 'de-DE', { month: 'long', year: 'numeric' });
  }

  /* „vor 3 Tagen“ – relativ zum eingefrorenen Heute der App. */
  /* Ein Muster mit {0} durch das Wörterbuch schicken und die Zahl
     danach einsetzen. So darf Englisch die Stellung ändern („vor 2
     Tagen“ wird „2 days ago“) statt an der deutschen zu kleben. */
  function muster(vorlage, wert) {
    return uebersetze(vorlage).replace('{0}', wert);
  }

  function since(iso, now) {
    const then = new Date(iso + (iso.length === 10 ? 'T12:00:00' : ''));
    const ms = (now || NW.now()) - then;
    const min = Math.round(ms / 60000);
    if (min < 1) return uebersetze('gerade eben');
    if (min < 60) return muster('vor {0} Min.', min);
    const h = Math.round(min / 60);
    if (h < 24) return muster('vor {0} Std.', h);
    const d = Math.round(h / 24);
    if (d === 1) return uebersetze('gestern');
    if (d < 31) return muster('vor {0} Tagen', d);
    const mo = Math.round(d / 30);
    if (mo < 24) return muster('vor {0} Monaten', mo);
    return muster('vor {0} Jahren', Math.round(mo / 12));
  }

  /* Alter eines Inserats in Tagen. */
  function daysSince(iso, now) {
    const then = new Date(iso + (iso.length === 10 ? 'T12:00:00' : ''));
    return Math.max(0, Math.round(((now || NW.now()) - then) / 86400000));
  }

  function addDays(date, days) {
    const d = new Date(date.getTime());
    d.setDate(d.getDate() + days);
    return d;
  }

  const isoDate = (d) => d.toISOString().slice(0, 10);

  /* Eingefrorenes „Heute“, damit Daten und Texte zusammenpassen. */
  let _now = new Date();
  NW.now = () => _now;
  NW.setNow = (d) => { _now = d; };

  /* ------------------------- Nachschlagen ------------------------- */

  /* Schlüssel aus der Adresszeile treffen sonst den Prototyp: In einem
     gewöhnlichen Objekt liefert obj['constructor'] eine Funktion statt
     undefined, und die Seite bricht ab. Deshalb Karten ohne Prototyp
     anlegen und fremde Schlüssel nur als eigene Eigenschaft nachschlagen. */
  function karte(quelle) {
    const k = Object.create(null);
    if (quelle) Object.keys(quelle).forEach((x) => { k[x] = quelle[x]; });
    return k;
  }

  function hole(obj, schluessel) {
    if (!obj || schluessel === null || schluessel === undefined) return undefined;
    return Object.prototype.hasOwnProperty.call(obj, schluessel) ? obj[schluessel] : undefined;
  }

  /* ------------------------- Text ------------------------- */

  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  /* Fertiges Markup: wird beim Einsetzen nicht noch einmal escaped.
     toString sorgt dafür, dass sich das Ergebnis überall wie eine
     Zeichenkette verhält – auch bei innerHTML und String-Verkettung. */
  function markup(s) {
    return { __raw: s, toString: function () { return this.__raw; } };
  }

  function raw(s) { return markup(String(s)); }

  function val(v) {
    if (v === null || v === undefined || v === false || v === true) return '';
    if (Array.isArray(v)) return v.map(val).join('');
    if (typeof v === 'object' && v.__raw !== undefined) return v.__raw;
    /* Auch eingesetzte Werte durchlaufen das Wörterbuch: Beschriftungen
       aus Tabellen im Quelltext („Gemerkt“, „Zusage“) kommen als Wert an,
       nicht als Teil der Vorlage. Was nicht im Wörterbuch steht – Namen,
       Notizen, alles Eingetippte – geht unverändert durch. */
    return esc(uebersetze(String(v)));
  }

  /* ------------------------- Sprache ------------------------- */

  function uebersetze(text) {
    return NW.i18n ? NW.i18n.t(text) : text;
  }

  /* Ein Zeichen, das in Markup nicht vorkommt, markiert die Stellen der
     eingesetzten Werte, solange der Satz durch das Wörterbuch geht. */
  const MARKE = '\u0001';

  /* Im Wörterbuch stehen die Platzhalter als {0}, {1} – lesbar für den,
     der übersetzt. Innerhalb der Vorlage sind es Steuerzeichen, damit
     eine geschweifte Klammer im Fließtext nichts kaputtmacht. */
  const zuLesbar = (s) => s.replace(new RegExp(MARKE + '(\\d+)' + MARKE, 'g'), '{$1}');
  const zurueck = (s) => s.replace(/\{(\d+)\}/g, MARKE + '$1' + MARKE);

  function uebersetzeLauf(text) {
    if (text.indexOf(MARKE) < 0) return uebersetze(text);
    const lesbar = zuLesbar(text);
    const direkt = uebersetze(lesbar);
    if (direkt !== lesbar) return zurueck(direkt);
    /* Zweiter Versuch ohne die Platzhalter am Rand. Ein Zeichen vor dem
       Text – ${ico('herz')}Merken – gehört nicht zum Satz, verschiebt
       aber den Schlüssel auf „{0}Merken“. Ohne diesen Schritt müsste
       jeder Eintrag wissen, wie viele Werte zufällig davorstehen, und
       ein zusätzliches Zeichen im Markup bräche die Übersetzung. */
    const teile = /^(\s*(?:\{\d+\}\s*)*)([\s\S]*?)((?:\s*\{\d+\})*\s*)$/.exec(lesbar);
    if (teile && teile[2].trim()) {
      const innen = uebersetze(teile[2]);
      if (innen !== teile[2]) return zurueck(teile[1] + innen + teile[3]);
    }
    return text;
  }

  const ATTRIBUTE = /\b(aria-label|aria-description|title|placeholder|alt)\s*=\s*"([^"]*)"/gi;

  /* Textläufe sind alles außerhalb von <…>. Das Markup bleibt unberührt,
     übersetzt wird nur, was ein Mensch liest – dazu die Attribute, die
     ein Screenreader vorliest. */
  function laeufeUebersetzen(muster) {
    let out = '';
    let text = '';
    let i = 0;
    const spuelen = () => { out += uebersetzeLauf(text); text = ''; };
    while (i < muster.length) {
      const c = muster[i];
      /* Nur ein echtes Tag beendet den Textlauf – ein einzelnes „<“ im
         Fließtext (etwa „< 30 Minuten“) ist keins. */
      if (c === '<' && /[a-zA-Z/!]/.test(muster[i + 1] || '')) {
        spuelen();
        let tag = '';
        while (i < muster.length && muster[i] !== '>') { tag += muster[i]; i++; }
        tag += muster[i] || ''; i++;
        out += tag.replace(ATTRIBUTE, (ganz, name, wert) => name + '="' + uebersetzeLauf(wert) + '"');
        continue;
      }
      text += c; i++;
    }
    spuelen();
    return out;
  }

  /* Der Bauplan einer Vorlage: abwechselnd fester Text und die Nummer des
     Werts, der dort hingehört. Getaggte Vorlagen bekommen bei jedem Aufruf
     dasselbe strings-Array – deshalb lässt sich der Plan daran festmachen
     und muss je Sprache nur einmal gerechnet werden. */
  const plaene = new WeakMap();

  function planFuer(strings) {
    const sprache = NW.i18n ? NW.i18n.sprache() : 'de';
    const gemerkt = plaene.get(strings);
    if (gemerkt && gemerkt.sprache === sprache) return gemerkt.teile;

    let muster = '';
    for (let i = 0; i < strings.length; i++) {
      muster += strings[i];
      if (i + 1 < strings.length) muster += MARKE + i + MARKE;
    }
    const teile = laeufeUebersetzen(muster).split(new RegExp(MARKE + '(\\d+)' + MARKE));
    plaene.set(strings, { sprache, teile });
    return teile;
  }

  /* Tagged Template: eingesetzte Werte werden escaped, außer sie sind
     selbst schon Markup – also das Ergebnis von html() oder raw().
     Dadurch lassen sich Bausteine beliebig ineinander schachteln. */
  function html(strings) {
    const teile = planFuer(strings);
    let out = '';
    /* Ungerade Stellen tragen die Nummer des Werts. Dass die Nummer
       mitläuft statt der Reihenfolge zu folgen, ist der Punkt: Eine
       englische Fassung darf die Platzhalter umstellen. */
    for (let i = 0; i < teile.length; i++) {
      if (i % 2 === 0) out += teile[i];
      else out += val(arguments[Number(teile[i]) + 1]);
    }
    return markup(out);
  }

  /* Umlautsichere, lockere Suche: „koln“ findet „Köln“. */
  function norm(s) {
    return String(s).toLowerCase()
      .replace(/ä/g, 'a').replace(/ö/g, 'o').replace(/ü/g, 'u').replace(/ß/g, 'ss')
      .replace(/[^a-z0-9]+/g, ' ').trim();
  }

  const slug = (s) => norm(s).replace(/\s+/g, '-');

  /* Liefert nur das Wort, nie die Zahl – die schreibt die Aufrufstelle
     davor. Alles andere führt unweigerlich zu „2 2 Funde“. */
  function plural(n, ein, viele) {
    return Number(n) === 1 ? ein : viele;
  }

  function truncate(s, n) {
    s = String(s);
    return s.length <= n ? s : s.slice(0, n - 1).replace(/\s+\S*$/, '') + '…';
  }

  /* ------------------------- DOM ------------------------- */

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  function on(root, type, sel, fn) {
    root.addEventListener(type, function (e) {
      const t = e.target.closest(sel);
      if (t && root.contains(t)) fn.call(t, e, t);
    });
  }

  function setHTML(node, markup) {
    node.innerHTML = markup;
    return node;
  }

  function svg(name, cls) {
    return raw('<svg class="ico' + (cls ? ' ' + cls : '') + '" aria-hidden="true" focusable="false"><use href="#i-' + name + '"></use></svg>');
  }

  /* ------------------------- Geo ------------------------- */

  const R_EARTH = 6371;

  function distKm(a, b) {
    const toRad = (d) => d * Math.PI / 180;
    const dLat = toRad(b.lat - a.lat), dLng = toRad(b.lng - a.lng);
    const s = Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
    return 2 * R_EARTH * Math.asin(Math.sqrt(s));
  }

  /* Grobe Fahrzeit als Ersatz für einen Routendienst: Luftlinie mit
     Umwegfaktor, dazu ein fixer Zu-/Abgang je Verkehrsmittel. */
  const TRAVEL = {
    rad:  { speed: 15, detour: 1.25, fix: 3,  label: 'Rad' },
    oepnv:{ speed: 22, detour: 1.35, fix: 11, label: 'ÖPNV' },
    auto: { speed: 30, detour: 1.30, fix: 6,  label: 'Auto' },
    fuss: { speed: 4.8, detour: 1.20, fix: 1, label: 'zu Fuß' }
  };

  function travelMin(from, to, mode) {
    const m = TRAVEL[mode] || TRAVEL.oepnv;
    const km = distKm(from, to) * m.detour;
    return Math.max(1, Math.round(km / m.speed * 60 + m.fix));
  }

  function minutesLabel(min) {
    if (min < 60) return muster('{0} Min.', min);
    const h = Math.floor(min / 60), r = min % 60;
    return muster('{0} Std.', h) + (r ? ' ' + muster('{0} Min.', r) : '');
  }

  /* ------------------------- Speicher ------------------------- */

  const KEY = 'nestwerk.v1';

  function loadStore() {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  function saveStore(data) {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
      return true;
    } catch (e) { return false; }
  }

  function clearStore() {
    try { localStorage.removeItem(KEY); return true; } catch (e) { return false; }
  }

  /* ------------------------- Export ------------------------- */

  NW.util = {
    clamp, sum, uniq, debounce, rng, hash, pick, pickN, between, intBetween,
    eur, eur2, num, dec, qm, pct, rooms, dateDE, monthDE, since, daysSince, addDays, isoDate,
    esc, raw, markup, html, norm, slug, plural, truncate,
    t: uebersetze,
    karte, hole,
    $, $$, on, setHTML, svg,
    distKm, travelMin, minutesLabel, TRAVEL,
    loadStore, saveStore, clearStore
  };
})(window.NW = window.NW || {});
