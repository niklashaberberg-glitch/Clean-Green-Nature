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

  const nfEur = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
  const nfEur2 = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const nfNum = new Intl.NumberFormat('de-DE');
  const nfDec = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 1 });

  const eur = (v) => nfEur.format(Math.round(Number(v) || 0));
  const eur2 = (v) => nfEur2.format(Number(v) || 0);
  const num = (v) => nfNum.format(Math.round(Number(v) || 0));
  const dec = (v) => nfDec.format(Number(v) || 0);
  const qm = (v) => dec(v) + ' m²';
  const pct = (v) => dec(v) + ' %';

  function rooms(v) {
    const s = dec(v);
    return s + (v === 1 ? ' Zimmer' : ' Zimmer');
  }

  function dateDE(iso) {
    if (!iso) return '';
    const d = new Date(iso + (iso.length === 10 ? 'T12:00:00' : ''));
    if (isNaN(d)) return String(iso);
    return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  function monthDE(iso) {
    const d = new Date(iso + (iso.length === 10 ? 'T12:00:00' : ''));
    if (isNaN(d)) return String(iso);
    return d.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });
  }

  /* „vor 3 Tagen“ – relativ zum eingefrorenen Heute der App. */
  function since(iso, now) {
    const then = new Date(iso + (iso.length === 10 ? 'T12:00:00' : ''));
    const ms = (now || NW.now()) - then;
    const min = Math.round(ms / 60000);
    if (min < 1) return 'gerade eben';
    if (min < 60) return 'vor ' + min + ' Min.';
    const h = Math.round(min / 60);
    if (h < 24) return 'vor ' + h + ' Std.';
    const d = Math.round(h / 24);
    if (d === 1) return 'gestern';
    if (d < 31) return 'vor ' + d + ' Tagen';
    const mo = Math.round(d / 30);
    if (mo < 24) return 'vor ' + mo + ' Monaten';
    return 'vor ' + Math.round(mo / 12) + ' Jahren';
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
    return esc(String(v));
  }

  /* Tagged Template: eingesetzte Werte werden escaped, außer sie sind
     selbst schon Markup – also das Ergebnis von html() oder raw().
     Dadurch lassen sich Bausteine beliebig ineinander schachteln. */
  function html(strings) {
    let out = '';
    for (let i = 0; i < strings.length; i++) {
      out += strings[i];
      if (i + 1 < arguments.length) out += val(arguments[i + 1]);
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
    if (min < 60) return min + ' Min.';
    const h = Math.floor(min / 60), r = min % 60;
    return h + ' Std.' + (r ? ' ' + r + ' Min.' : '');
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
    karte, hole,
    $, $$, on, setHTML, svg,
    distKm, travelMin, minutesLabel, TRAVEL,
    loadStore, saveStore, clearStore
  };
})(window.NW = window.NW || {});
