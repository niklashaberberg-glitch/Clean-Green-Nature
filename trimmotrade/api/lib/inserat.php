<?php
/* =====================================================================
   Inserate

   Hier hört die Anwendung auf, ein Werkzeug zu sein, und wird ein Markt.
   Ein Inserat, das das Gerät nie verlässt, ist eine Notiz; erst wenn es
   auf dem Server liegt, kann es jemand anderes finden.

   Der Grundsatz dieser Datei in einem Satz: Dem Browser wird kein
   einziges Feld geglaubt. Was ankommt, ist ein Vorschlag. Was gespeichert
   wird, baut der Server aus einer festen Liste erlaubter Felder mit
   festen Grenzen zusammen – alles Übrige fällt weg, still und
   vollständig. Der Unterschied ist nicht theoretisch:

     – „anbieter.verifiziert = true“ aus dem Browser wäre ein Siegel,
       das sich jeder selbst ausstellt.
     – „lat/lng“ aus dem Browser wäre eine Wohnung, die auf der Karte
       überall stehen kann, nur nicht dort, wo sie ist.
     – „stats.aufrufe = 4000“ wäre eine erfundene Beliebtheit.

   Alle drei setzt der Server selbst, aus dem Konto und aus der Ortsliste.
   ===================================================================== */

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/antwort.php';
require_once __DIR__ . '/orte.php';

final class Inserat
{
    /** Wie lange ein Inserat steht, bis es bestätigt werden muss. */
    public const LAUFZEIT_TAGE = 60;

    /** Wie viele Inserate ein Konto gleichzeitig offen haben darf.
        Nicht als Verkaufsschranke gedacht, sondern gegen den, der
        tausend Wohnungen erfindet. */
    public const HOECHSTENS = 25;

    public const ARTEN  = ['miete', 'kauf', 'wg', 'tausch'];
    public const TYPEN  = ['wohnung', 'haus', 'zimmer', 'grundstueck'];

    /* ------------------------------------------------------------------
       Vom Browser hereinkommende Werte
       ------------------------------------------------------------------ */

    /** Text ohne Steuerzeichen, ohne Randleerraum, auf Länge gestutzt.
        Kein HTML-Escapen: Das gehört an die Stelle, an der ausgegeben
        wird, und die Oberfläche macht es ohnehin. Doppeltes Escapen
        erzeugt „&amp;amp;“ und macht Texte unlesbar. */
    public static function text(mixed $w, int $max): string
    {
        if (!is_string($w)) {
            return '';
        }
        $w = str_replace(["\r\n", "\r"], "\n", $w);
        $w = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $w) ?? '';
        /* Mehr als zwei leere Zeilen hintereinander sind kein Absatz,
           sondern der Versuch, ein Inserat größer wirken zu lassen. */
        $w = preg_replace("/\n{3,}/", "\n\n", $w) ?? '';
        $w = trim($w);
        return mb_substr($w, 0, $max, 'UTF-8');
    }

    public static function zahl(mixed $w, float $von, float $bis, float $vorgabe = 0): float
    {
        if (is_string($w)) {
            $w = str_replace(',', '.', trim($w));
        }
        if (!is_numeric($w)) {
            return $vorgabe;
        }
        return max($von, min($bis, (float) $w));
    }

    public static function ganz(mixed $w, int $von, int $bis, int $vorgabe = 0): int
    {
        return (int) round(self::zahl($w, $von, $bis, $vorgabe));
    }

    /** Datum im Format JJJJ-MM-TT oder leer. Alles andere wird leer –
        ein „frei ab: sofort!!!“ im Datumsfeld hilft niemandem. */
    public static function datum(mixed $w): string
    {
        if (!is_string($w) || !preg_match('/^(\d{4})-(\d{2})-(\d{2})$/', trim($w), $m)) {
            return '';
        }
        if (!checkdate((int) $m[2], (int) $m[3], (int) $m[1])) {
            return '';
        }
        $jahr = (int) $m[1];
        if ($jahr < 2000 || $jahr > (int) date('Y') + 10) {
            return '';
        }
        return trim($w);
    }

    /** Liste von Texten aus einer festen Auswahl. */
    public static function ausListe(mixed $w, array $erlaubt, int $hoechstens = 40): array
    {
        if (!is_array($w)) {
            return [];
        }
        $raus = [];
        foreach ($w as $e) {
            if (is_string($e) && in_array($e, $erlaubt, true) && !in_array($e, $raus, true)) {
                $raus[] = $e;
                if (count($raus) >= $hoechstens) {
                    break;
                }
            }
        }
        return $raus;
    }

    /** Freie Textliste – gestutzt an Länge und Anzahl. */
    public static function textListe(mixed $w, int $max, int $hoechstens): array
    {
        if (!is_array($w)) {
            return [];
        }
        $raus = [];
        foreach ($w as $e) {
            $t = self::text($e, $max);
            if ($t !== '' && !in_array($t, $raus, true)) {
                $raus[] = $t;
                if (count($raus) >= $hoechstens) {
                    break;
                }
            }
        }
        return $raus;
    }

    /** Geschlecht auf die Kürzel bringen, mit denen der Browser rechnet:
        w, m, d, egal. Die ausgeschriebenen Formen werden mit angenommen –
        sie standen vorher allein in dieser Prüfung, und ein Datensatz,
        der sie noch trägt, soll nicht stillschweigend auf „egal“
        zurückfallen. Alles andere wird zu „egal“: Eine WG darf sich nach
        § 19 Abs. 5 AGG etwas wünschen, aber nur aus dieser Liste.

        Ohne diese Umsetzung ging jede Angabe verloren – der Browser
        schickt seit jeher die Kürzel, die Prüfung kannte nur die
        Langformen, und was sie nicht kannte, wurde „egal“. */
    public static function geschlecht(mixed $w): string
    {
        $karte = [
            'w' => 'w', 'm' => 'm', 'd' => 'd', 'egal' => 'egal',
            'weiblich' => 'w', 'männlich' => 'm', 'maennlich' => 'm',
            'divers' => 'd', 'nichtbinär' => 'd', 'nichtbinaer' => 'd',
        ];
        $t = is_string($w) ? mb_strtolower(trim($w)) : '';
        return $karte[$t] ?? 'egal';
    }

    /* ------------------------------------------------------------------
       Prüfung auf typische Betrugsmuster

       Die Masche im deutschen Wohnungsmarkt ist immer dieselbe: eine
       auffällig günstige Wohnung, die anbietende Seite ist „im Ausland“,
       der Schlüssel kommt per Post, vorher bitte die Kaution überweisen
       oder sich bei einem Treuhänder anmelden. Wer das einmal gesehen
       hat, erkennt es sofort – wer zum ersten Mal eine Wohnung sucht,
       nicht.

       Deshalb prüft der Server, nicht der Browser: Ein Hinweis, den man
       abschalten kann, schützt niemanden. Gefunden wird nicht gelöscht,
       sondern markiert; die Entscheidung bleibt beim Menschen, aber sie
       wird informiert getroffen.
       ------------------------------------------------------------------ */

    private const MUSTER = [
        ['vorkasse',   '/\b(vorkasse|voraus(zahlung|kasse)|anzahlung vor|kaution vorab|vorab überweisen)\b/iu'],
        ['treuhand',   '/\b(treuhand|escrow|airbnb.?(service|garantie)|western union|moneygram|paysafe)\b/iu'],
        ['schluessel', '/\b(schlüssel).{0,30}\b(post|dhl|kurier|versand|zusenden|schicken)\b/iu'],
        ['ausland',    '/\b(befinde mich|bin derzeit|halte mich).{0,40}\b(ausland|england|london|usa|amerika)\b/iu'],
        ['ohnetermin', '/\b(ohne besichtigung|besichtigung nicht (möglich|nötig)|keine besichtigung)\b/iu'],
        ['drang',      '/\b(nur heute|sofort zuschlagen|schnell entscheiden|erste[rn]? kommt)\b/iu'],
    ];

    /** @return string[] Namen der gefundenen Muster */
    public static function verdachtsgruende(array $d): array
    {
        $text = mb_strtolower(
            ($d['beschreibung'] ?? '') . ' ' . ($d['titel'] ?? '') . ' ' . ($d['strasse'] ?? ''),
            'UTF-8'
        );
        $gruende = [];
        foreach (self::MUSTER as [$name, $regel]) {
            if (preg_match($regel, $text)) {
                $gruende[] = $name;
            }
        }

        /* Der Preis. Eine Wohnung deutlich unter der halben ortsüblichen
           Vergleichsmiete ist entweder ein Sonderfall (Werkswohnung,
           Verwandtschaft) oder ein Köder. Beides verdient einen Hinweis –
           der Sonderfall lässt sich in einem Satz erklären, der Köder
           nicht. */
        $kalt = (float) ($d['kalt'] ?? 0);
        $flaeche = (float) ($d['flaeche'] ?? 0);
        $vergleich = (float) ($d['vergleichsmiete'] ?? 0);
        if ($kalt > 0 && $flaeche > 0 && $vergleich > 0 && $kalt < $vergleich * $flaeche * 0.5) {
            $gruende[] = 'preis';
        }
        return $gruende;
    }

    /* ------------------------------------------------------------------
       Aus dem Vorschlag des Browsers ein gespeichertes Inserat machen
       ------------------------------------------------------------------ */

    private const AUSSTATTUNG = [
        'Balkon', 'Terrasse', 'Garten', 'Aufzug', 'Einbauküche', 'Badewanne', 'Dusche',
        'Gäste-WC', 'Keller', 'Dachboden', 'Stellplatz', 'Garage', 'Fahrradkeller',
        'Waschmaschinenanschluss', 'Barrierefrei', 'Haustiere erlaubt', 'Möbliert',
        'Teilmöbliert', 'Fußbodenheizung', 'Parkett', 'Laminat', 'Fliesen',
        'Glasfaser', 'Rollstuhlgerecht', 'Denkmalschutz', 'Kamin', 'Sauna', 'Pool',
        'WG-geeignet', 'Neubau', 'Erstbezug', 'Saniert'
    ];

    private const HEIZUNGEN = [
        'Gas-Zentralheizung', 'Fernwärme', 'Wärmepumpe', 'Öl-Zentralheizung',
        'Gasetagenheizung', 'Pelletheizung', 'Nachtspeicheröfen', 'Blockheizkraftwerk'
    ];

    private const BAUWEISEN = [
        'freistehend', 'Doppelhaushälfte', 'Reihenmittelhaus', 'Reihenendhaus',
        'Bungalow', 'Stadtvilla'
    ];

    /**
     * Baut aus rohen Browserdaten ein sauberes Inserat.
     * Bricht mit einer Meldung ab, wenn Pflichtangaben fehlen.
     *
     * @return array{daten:array,spalten:array}
     */
    public static function bauen(array $roh, array $konto): array
    {
        $kind = is_string($roh['kind'] ?? null) && in_array($roh['kind'], self::ARTEN, true)
            ? $roh['kind'] : 'miete';
        $typ = is_string($roh['type'] ?? null) && in_array($roh['type'], self::TYPEN, true)
            ? $roh['type'] : ($kind === 'wg' ? 'zimmer' : 'wohnung');
        if ($kind === 'wg') {
            $typ = 'zimmer';
        }
        if ($kind === 'tausch') {
            $typ = 'wohnung';
        }

        $key = is_string($roh['viertelKey'] ?? null) ? $roh['viertelKey'] : '';
        $ort = Orte::hole($key);
        if (!$ort) {
            Antwort::fehler('Zu dieser Stadt und diesem Viertel gibt es keinen Eintrag.', 422, ['feld' => 'viertelKey']);
        }
        [$stadt, $viertel, $lat, $lng] = $ort;

        $istKauf  = $kind === 'kauf';
        $istGrund = $typ === 'grundstueck';

        $zimmer   = $istGrund ? 0.0 : self::zahl($roh['zimmer'] ?? null, 1, 20, 2);
        $gflaeche = self::ganz($roh['grundstueck'] ?? null, 0, 200000, 0);
        $flaeche  = $istGrund
            ? self::ganz($roh['flaeche'] ?? $gflaeche, 30, 200000, 600)
            : self::ganz($roh['flaeche'] ?? null, 6, 2000, 50);
        if ($istGrund) {
            $gflaeche = $flaeche;
        }

        $kalt  = $istKauf ? 0 : self::ganz($roh['kalt'] ?? null, 0, 100000, 0);
        $nk    = $istKauf ? 0 : self::ganz($roh['nebenkosten'] ?? null, 0, 20000, 0);
        $heiz  = $istKauf ? 0 : self::ganz($roh['heizkosten'] ?? null, 0, 20000, 0);
        $kauf  = $istKauf ? self::ganz($roh['kaufpreis'] ?? null, 0, 100000000, 0) : 0;

        if (!$istKauf && $kalt <= 0) {
            Antwort::fehler('Ohne Kaltmiete lässt sich das Inserat nicht veröffentlichen.', 422, ['feld' => 'kalt']);
        }
        if ($istKauf && $kauf <= 0) {
            Antwort::fehler('Ohne Kaufpreis lässt sich das Inserat nicht veröffentlichen.', 422, ['feld' => 'kaufpreis']);
        }

        $baujahr = $istGrund ? 0 : self::ganz($roh['baujahr'] ?? null, 1500, (int) date('Y') + 8, 1970);
        $heizung = is_string($roh['energie']['heizung'] ?? null)
            && in_array($roh['energie']['heizung'], self::HEIZUNGEN, true)
            ? $roh['energie']['heizung'] : 'Gas-Zentralheizung';

        $beschreibung = self::text($roh['beschreibung'] ?? '', 4000);
        $titel        = self::text($roh['titel'] ?? '', 160);
        if ($titel === '') {
            $titel = self::titelBauen($kind, $typ, $zimmer, $flaeche, $viertel);
        }

        $d = [
            'kind' => $kind,
            'type' => $typ,
            'titel' => $titel,
            'stadt' => $stadt,
            'viertel' => $viertel,
            'viertelKey' => $key,
            'strasse' => self::text($roh['strasse'] ?? '', 120) ?: ('Nähe ' . $viertel),
            'lat' => $lat,
            'lng' => $lng,
            'zimmer' => $zimmer,
            'flaeche' => $flaeche,
            'wohnflaeche' => $istGrund ? 0 : self::ganz($roh['wohnflaeche'] ?? $flaeche, 6, 2000, $flaeche),
            'grundstueck' => $gflaeche,
            'etage' => $istGrund ? 0 : self::ganz($roh['etage'] ?? null, 0, 60, 0),
            'etagen' => $istGrund ? 0 : self::ganz($roh['etagen'] ?? null, 1, 60, 4),
            'baujahr' => $baujahr,
            'saniert' => !empty($roh['saniert']),
            'kalt' => $kalt,
            'nebenkosten' => $nk,
            'heizkosten' => $heiz,
            'warm' => $kalt + $nk + $heiz,
            'kaufpreis' => $kauf,
            'hausgeld' => $istKauf && $typ === 'wohnung' ? self::ganz($roh['hausgeld'] ?? null, 0, 20000, 0) : 0,
            'provision' => $istKauf ? self::zahl($roh['provision'] ?? null, 0, 8, 0) : 0,
            'kaution' => $istKauf ? 0 : self::ganz($roh['kaution'] ?? null, 0, 3, 0),
            'ausstattung' => self::ausListe($roh['ausstattung'] ?? null, self::AUSSTATTUNG),
            'freiAb' => self::datum($roh['freiAb'] ?? '') ?: date('Y-m-d'),
            'befristetBis' => self::datum($roh['befristetBis'] ?? '') ?: null,
            'beschreibung' => $beschreibung !== '' ? $beschreibung : 'Keine weitere Beschreibung hinterlegt.',
            'quirks' => [],
            'bilder' => [],
        ];

        /* Energieausweis. Ein Grundstück hat keinen – § 80 GEG verlangt
           ihn nur für Gebäude –, und eine erfundene Klasse wäre nach
           § 87 GEG sogar eine Ordnungswidrigkeit. */
        if (!$istGrund) {
            $kwh = self::ganz($roh['energie']['kwh'] ?? null, 5, 800, 0);
            if ($kwh === 0) {
                $kwh = $baujahr >= 2020 ? 55 : ($baujahr >= 2000 ? 95 : ($baujahr >= 1978 ? 125 : 168));
            }
            $art = ($roh['energie']['art'] ?? '') === 'Verbrauchsausweis' ? 'Verbrauchsausweis' : 'Bedarfsausweis';
            $d['energie'] = [
                'klasse' => self::klasse($kwh),
                'kwh' => $kwh,
                'art' => $art,
                'heizung' => $heizung,
                'ausweisBis' => self::datum($roh['energie']['ausweisBis'] ?? '') ?: '',
            ];
        } else {
            $d['energie'] = null;
        }

        if ($typ === 'haus') {
            $d['bauweise'] = is_string($roh['bauweise'] ?? null)
                && in_array($roh['bauweise'], self::BAUWEISEN, true) ? $roh['bauweise'] : 'freistehend';
        }

        if ($istGrund) {
            $g = is_array($roh['grund'] ?? null) ? $roh['grund'] : [];
            $d['grund'] = [
                'baulandArt' => self::text($g['baulandArt'] ?? '', 60) ?: 'Bauland, voll erschlossen',
                'bplan' => self::text($g['bplan'] ?? '', 60) ?: 'liegt vor',
                'grz' => self::zahl($g['grz'] ?? null, 0, 1, 0.4),
                'gfz' => self::zahl($g['gfz'] ?? null, 0, 4, 0.8),
                'erschliessung' => self::text($g['erschliessung'] ?? '', 40) ?: 'unbekannt',
            ];
        }

        if ($kind === 'wg') {
            $wg = is_array($roh['wg'] ?? null) ? $roh['wg'] : [];
            $bewohner = [];
            foreach (is_array($wg['bewohner'] ?? null) ? $wg['bewohner'] : [] as $b) {
                if (!is_array($b) || count($bewohner) >= 8) {
                    continue;
                }
                $bewohner[] = [
                    'name' => self::text($b['name'] ?? '', 40),
                    'alter' => self::ganz($b['alter'] ?? null, 16, 99, 30),
                    'geschlecht' => self::geschlecht($b['geschlecht'] ?? ''),
                    'beruf' => self::text($b['beruf'] ?? '', 40),
                ];
            }
            $d['wg'] = [
                'groesse' => self::ganz($wg['groesse'] ?? null, 2, 12, max(2, count($bewohner) + 1)),
                'bewohner' => $bewohner,
                'durchschnittsalter' => self::ganz($wg['durchschnittsalter'] ?? null, 16, 99, 30),
                'sucht' => [
                    'geschlecht' => self::geschlecht($wg['sucht']['geschlecht'] ?? ''),
                    'alterVon' => self::ganz($wg['sucht']['alterVon'] ?? null, 16, 99, 18),
                    'alterBis' => self::ganz($wg['sucht']['alterBis'] ?? null, 16, 99, 99),
                ],
                'art' => self::textListe($wg['art'] ?? null, 40, 4),
                'rauchen' => self::text($wg['rauchen'] ?? '', 40) ?: 'nicht erwünscht',
                'haustiere' => self::text($wg['haustiere'] ?? '', 40) ?: 'nicht erlaubt',
                'sprachen' => self::textListe($wg['sprachen'] ?? null, 30, 6) ?: ['Deutsch'],
                'putzplan' => !empty($wg['putzplan']),
                'gemeinsamesEssen' => !empty($wg['gemeinsamesEssen']),
                'badGeteilt' => self::text($wg['badGeteilt'] ?? '', 20) ?: 'geteilt',
            ];
        }

        if ($kind === 'tausch') {
            $ta = is_array($roh['tausch'] ?? null) ? $roh['tausch'] : [];
            $staedte = [];
            foreach (self::textListe($ta['suche']['staedte'] ?? null, 60, 6) as $s) {
                if (in_array($s, Orte::STAEDTE, true)) {
                    $staedte[] = $s;
                }
            }
            $d['tausch'] = [
                'grund' => self::text($ta['grund'] ?? '', 600) ?: 'Veränderung.',
                'suche' => [
                    'staedte' => $staedte ?: [$stadt],
                    'zimmerMin' => self::zahl($ta['suche']['zimmerMin'] ?? null, 1, 12, 1),
                    'flaecheMin' => self::ganz($ta['suche']['flaecheMin'] ?? null, 10, 500, 30),
                    'warmMax' => self::ganz($ta['suche']['warmMax'] ?? null, 100, 20000, 1200),
                    'wunschAusstattung' => self::ausListe($ta['suche']['wunschAusstattung'] ?? null, self::AUSSTATTUNG, 8),
                ],
                'flexibelAb' => $d['freiAb'],
                'dreiecktauschOk' => !empty($ta['dreiecktauschOk']),
                'vermieterZustimmung' => self::text($ta['vermieterZustimmung'] ?? '', 40) ?: 'noch offen',
            ];
        }

        /* --- Für eine WG-Gründung geeignet? ---------------------------
           Das entscheidet ausschließlich die anbietende Seite, und sie
           entscheidet es bewusst: Eine Vier-Zimmer-Wohnung an drei
           Fremde zu vermieten ist etwas anderes, als sie an eine Familie
           zu vermieten – gesamtschuldnerische Haftung, mehr Fluktuation,
           mehr Verwaltungsaufwand. Wer das nicht will, bekommt keine
           Gruppenbewerbung. Wer es anhakt, macht eine Wohnung vermietbar,
           die als Familienwohnung monatelang steht.

           Nur bei Miete und nur bei Wohnung oder Haus: Ein WG-Zimmer ist
           schon Teil einer WG, ein Kauf ist keine Vermietung, und ein
           Grundstück hat keine Zimmer. */
        $gruendungMoeglich = false;
        if ($kind === 'miete' && in_array($typ, ['wohnung', 'haus'], true) && $zimmer >= 2) {
            $wgG = is_array($roh['wgGruendung'] ?? null) ? $roh['wgGruendung'] : [];
            $gruendungMoeglich = !empty($wgG['moeglich']);
            if ($gruendungMoeglich) {
                $d['wgGruendung'] = [
                    'moeglich' => true,
                    /* Höchstens so viele Personen wie Zimmer. Mehr wäre
                       keine WG, sondern eine Matratzenlage. */
                    'maxPersonen' => (int) self::zahl(
                        $wgG['maxPersonen'] ?? null, 2, max(2, (int) floor($zimmer)), max(2, (int) floor($zimmer))
                    ),
                    'vertrag' => in_array($wgG['vertrag'] ?? '', ['gemeinsam', 'einzeln', 'offen'], true)
                        ? $wgG['vertrag'] : 'gemeinsam',
                    'hinweis' => self::text($wgG['hinweis'] ?? '', 600),
                ];
            }
        }
        if (!$gruendungMoeglich) {
            $d['wgGruendung'] = null;
        }

        $gruende = self::verdachtsgruende($d + ['vergleichsmiete' => self::zahl($roh['vergleichsmiete'] ?? null, 0, 100, 0)]);
        $d['verdacht'] = $gruende !== [];
        $d['verdachtsgruende'] = $gruende;

        return [
            'daten' => $d,
            'spalten' => [
                'kind' => $kind,
                'typ' => $typ,
                'titel' => mb_substr($titel, 0, 200, 'UTF-8'),
                'stadt' => $stadt,
                'viertel_key' => $key,
                'lat' => $lat,
                'lng' => $lng,
                'zimmer' => $zimmer,
                'flaeche' => $flaeche,
                'kalt' => $kalt,
                'warm' => $d['warm'],
                'kaufpreis' => $kauf,
                'frei_ab' => $d['freiAb'],
                'wg_gruendung' => $gruendungMoeglich ? 1 : 0,
            ],
        ];
    }

    private static function klasse(int $kwh): string
    {
        /* Die Skala des § 86 GEG in Anlage 10 – nicht selbst erfunden. */
        if ($kwh <= 30) return 'A+';
        if ($kwh <= 50) return 'A';
        if ($kwh <= 75) return 'B';
        if ($kwh <= 100) return 'C';
        if ($kwh <= 130) return 'D';
        if ($kwh <= 160) return 'E';
        if ($kwh <= 200) return 'F';
        if ($kwh <= 250) return 'G';
        return 'H';
    }

    private static function titelBauen(string $kind, string $typ, float $zimmer, int $flaeche, string $viertel): string
    {
        $zi = rtrim(rtrim(number_format($zimmer, 1, ',', ''), '0'), ',');
        if ($typ === 'grundstueck') {
            return $flaeche . ' m² Grundstück – ' . $viertel;
        }
        if ($typ === 'haus') {
            return 'Haus, ' . $zi . ' Zi., ' . $flaeche . ' m² – ' . $viertel;
        }
        if ($kind === 'wg') {
            return $flaeche . ' m² Zimmer – ' . $viertel;
        }
        return $zi . '-Zimmer-Wohnung' . ($kind === 'tausch' ? ' zum Tausch' : '') . ' – ' . $viertel;
    }

    /* ------------------------------------------------------------------
       Schreiben
       ------------------------------------------------------------------ */

    /** Gibt das fertige Inserat so zurück, wie der Browser es kennt –
        nicht die Datenbankzeile. Wer eine Zeile zurückgibt, verrät
        laufende Nummern und zwingt jeden Aufrufer, sie noch einmal zu
        übersetzen. */
    public static function anlegen(array $konto, array $roh): array
    {
        $offen = (int) Db::wert(
            "SELECT COUNT(*) FROM tt_inserat WHERE konto_id = ? AND stand <> 'geloescht'",
            [$konto['id']]
        );
        if ($offen >= self::HOECHSTENS) {
            Antwort::fehler('Mehr als ' . self::HOECHSTENS . ' Inserate gleichzeitig gehen nicht. '
                . 'Nimm ein älteres vom Netz, dann geht das neue.', 409);
        }

        $gebaut = self::bauen($roh, $konto);
        $jetzt = time();
        $kennung = 'tt' . strtolower(bin2hex(random_bytes(8)));

        $sp = $gebaut['spalten'];
        Db::fuehre(
            'INSERT INTO tt_inserat (kennung, konto_id, kind, typ, titel, stadt, viertel_key, lat, lng,
              zimmer, flaeche, kalt, warm, kaufpreis, frei_ab, bilder, wg_gruendung, daten, stand,
              aufrufe, anfragen, angelegt, geaendert, laeuft_ab, erinnert)
             VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,0,?,?,?,0,0,?,?,?,0)',
            [
                $kennung, $konto['id'], $sp['kind'], $sp['typ'], $sp['titel'], $sp['stadt'], $sp['viertel_key'],
                $sp['lat'], $sp['lng'], $sp['zimmer'], $sp['flaeche'], $sp['kalt'], $sp['warm'],
                $sp['kaufpreis'], $sp['frei_ab'], $sp['wg_gruendung'],
                json_encode($gebaut['daten'], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
                'aktiv', $jetzt, $jetzt, $jetzt + self::LAUFZEIT_TAGE * 86400,
            ]
        );
        $z = self::nachKennung($kennung);
        return $z ? self::nachAussen($z) : [];
    }

    public static function aendern(array $konto, string $kennung, array $roh): array
    {
        $alt = self::nachKennung($kennung);
        if (!$alt || (int) $alt['konto_id'] !== (int) $konto['id']) {
            Antwort::fehler('Dieses Inserat gibt es nicht oder es gehört einem anderen Konto.', 404);
        }
        $gebaut = self::bauen($roh, $konto);
        /* Bilder gehören nicht in den Vorschlag des Browsers: Sie liegen
           in einer eigenen Tabelle und werden über einen eigenen Weg
           hochgeladen. Was hier ankäme, wäre bestenfalls veraltet. */
        $sp = $gebaut['spalten'];
        $jetzt = time();
        Db::fuehre(
            'UPDATE tt_inserat SET kind=?, typ=?, titel=?, stadt=?, viertel_key=?, lat=?, lng=?,
               zimmer=?, flaeche=?, kalt=?, warm=?, kaufpreis=?, frei_ab=?, wg_gruendung=?, daten=?,
               geaendert=?, laeuft_ab=?, erinnert=0
             WHERE id = ?',
            [
                $sp['kind'], $sp['typ'], $sp['titel'], $sp['stadt'], $sp['viertel_key'], $sp['lat'], $sp['lng'],
                $sp['zimmer'], $sp['flaeche'], $sp['kalt'], $sp['warm'], $sp['kaufpreis'], $sp['frei_ab'],
                $sp['wg_gruendung'],
                json_encode($gebaut['daten'], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
                $jetzt, $jetzt + self::LAUFZEIT_TAGE * 86400, $alt['id'],
            ]
        );
        $z = self::nachKennung($kennung);
        return $z ? self::nachAussen($z) : [];
    }

    /** Vom Netz nehmen oder wieder aufnehmen. */
    public static function stand(array $konto, string $kennung, string $neu): array
    {
        if (!in_array($neu, ['aktiv', 'pausiert'], true)) {
            Antwort::fehler('Unbekannter Zustand.', 422);
        }
        $z = self::nachKennung($kennung);
        if (!$z || (int) $z['konto_id'] !== (int) $konto['id']) {
            Antwort::fehler('Dieses Inserat gibt es nicht oder es gehört einem anderen Konto.', 404);
        }
        if ($z['stand'] === 'gesperrt') {
            Antwort::fehler('Dieses Inserat ist nach einer Meldung gesperrt. Gegen die Entscheidung '
                . 'kannst du Widerspruch einlegen – die Begründung steht in der Mail dazu.', 409);
        }
        $jetzt = time();
        Db::fuehre(
            'UPDATE tt_inserat SET stand = ?, geaendert = ?, laeuft_ab = ?, erinnert = 0 WHERE id = ?',
            [$neu, $jetzt, $jetzt + self::LAUFZEIT_TAGE * 86400, $z['id']]
        );
        $z = self::nachKennung($kennung);
        return $z ? self::nachAussen($z) : [];
    }

    /** „Steht noch“ – verlängert die Laufzeit, ohne etwas zu ändern. */
    public static function bestaetigen(array $konto, string $kennung): array
    {
        $z = self::nachKennung($kennung);
        if (!$z || (int) $z['konto_id'] !== (int) $konto['id']) {
            Antwort::fehler('Dieses Inserat gibt es nicht oder es gehört einem anderen Konto.', 404);
        }
        Db::fuehre(
            'UPDATE tt_inserat SET laeuft_ab = ?, erinnert = 0 WHERE id = ?',
            [time() + self::LAUFZEIT_TAGE * 86400, $z['id']]
        );
        $z = self::nachKennung($kennung);
        return $z ? self::nachAussen($z) : [];
    }

    public static function loeschen(array $konto, string $kennung): void
    {
        $z = self::nachKennung($kennung);
        if (!$z || (int) $z['konto_id'] !== (int) $konto['id']) {
            Antwort::fehler('Dieses Inserat gibt es nicht oder es gehört einem anderen Konto.', 404);
        }
        self::hartLoeschen((int) $z['id']);
    }

    /** Löscht Inserat, Bilder und Bilddateien. Anfragen bleiben: Sie
        gehören auch der anfragenden Seite, und ein Gesprächsverlauf, der
        verschwindet, weil die Gegenseite aufräumt, ist keiner. */
    public static function hartLoeschen(int $id): void
    {
        foreach (Db::zeilen('SELECT datei FROM tt_bild WHERE inserat_id = ?', [$id]) as $b) {
            Bild::dateiWeg((string) $b['datei']);
        }
        Db::fuehre('DELETE FROM tt_bild WHERE inserat_id = ?', [$id]);
        Db::fuehre("UPDATE tt_anfrage SET stand = 'weg' WHERE inserat_id = ?", [$id]);
        Db::fuehre('DELETE FROM tt_inserat WHERE id = ?', [$id]);
    }

    /* ------------------------------------------------------------------
       Lesen
       ------------------------------------------------------------------ */

    public static function nachKennung(string $kennung): ?array
    {
        return Db::zeile('SELECT * FROM tt_inserat WHERE kennung = ?', [$kennung]);
    }

    public static function meine(int $kontoId): array
    {
        return Db::zeilen(
            'SELECT * FROM tt_inserat WHERE konto_id = ? ORDER BY geaendert DESC LIMIT 100',
            [$kontoId]
        );
    }

    /**
     * Öffentliche Suche. Alles, was hier an Filtern ankommt, ist eine
     * feste Liste – zusammengesetztes SQL gibt es nicht, und Sortierung
     * nach einem Feldnamen aus dem Browser erst recht nicht.
     */
    public static function suchen(array $f, int $ab = 0, int $wieviele = 60): array
    {
        $wo = ["stand = 'aktiv'", 'laeuft_ab > ?'];
        $w  = [time()];

        $art = is_string($f['art'] ?? null) && in_array($f['art'], self::ARTEN, true) ? $f['art'] : '';
        if ($art !== '') {
            $wo[] = 'kind = ?';
            $w[] = $art;
        }
        $stadt = is_string($f['stadt'] ?? null) ? $f['stadt'] : '';
        if ($stadt !== '' && in_array($stadt, Orte::STAEDTE, true)) {
            $wo[] = 'stadt = ?';
            $w[] = $stadt;
        }
        $key = is_string($f['viertelKey'] ?? null) ? $f['viertelKey'] : '';
        if ($key !== '' && Orte::gibt($key)) {
            $wo[] = 'viertel_key = ?';
            $w[] = $key;
        }
        foreach ([['zimmerMin', 'zimmer >= ?', 0, 20], ['zimmerMax', 'zimmer <= ?', 0, 20],
                  ['flaecheMin', 'flaeche >= ?', 0, 200000], ['flaecheMax', 'flaeche <= ?', 0, 200000],
                  ['warmMax', 'warm <= ?', 0, 100000], ['kaltMax', 'kalt <= ?', 0, 100000],
                  ['preisMax', 'kaufpreis <= ?', 0, 100000000]] as [$name, $sql, $von, $bis]) {
            if (isset($f[$name]) && is_numeric($f[$name])) {
                $wo[] = $sql;
                $w[] = self::zahl($f[$name], $von, $bis, 0);
            }
        }
        if (!empty($f['nurMitBild'])) {
            $wo[] = 'bilder > 0';
        }
        /* Wohnungen, für die eine WG-Gründung vorgesehen ist. Der
           wichtigste Filter für alle, die allein keine Wohnung bezahlen
           können – und das sind in den großen Städten die meisten. */
        if (!empty($f['nurWgGruendung'])) {
            $wo[] = 'wg_gruendung = 1';
        }
        /* Nur was seit einem Zeitpunkt dazukam – der Suchauftrag braucht
           genau das, und zwar über die laufende Nummer statt über die
           Uhrzeit: Zwei Inserate in derselben Sekunde gehen sonst
           verloren. */
        if (isset($f['abId']) && is_numeric($f['abId'])) {
            $wo[] = 'id > ?';
            $w[] = (int) $f['abId'];
        }

        $sortierbar = [
            'neu' => 'id DESC',
            'preis' => 'CASE WHEN kaufpreis > 0 THEN kaufpreis ELSE warm END ASC, id DESC',
            'preis-ab' => 'CASE WHEN kaufpreis > 0 THEN kaufpreis ELSE warm END DESC, id DESC',
            'flaeche' => 'flaeche DESC, id DESC',
            'zimmer' => 'zimmer DESC, id DESC',
        ];
        $sortWunsch = is_string($f['sortierung'] ?? null) ? $f['sortierung'] : 'neu';
        $sort = $sortierbar[$sortWunsch] ?? $sortierbar['neu'];

        $wieviele = max(1, min(120, $wieviele));
        $ab = max(0, min(5000, $ab));

        $sql = 'SELECT * FROM tt_inserat WHERE ' . implode(' AND ', $wo)
            . ' ORDER BY ' . $sort . ' LIMIT ' . $wieviele . ' OFFSET ' . $ab;
        return Db::zeilen($sql, $w);
    }

    public static function anzahl(array $f = []): int
    {
        return (int) Db::wert(
            "SELECT COUNT(*) FROM tt_inserat WHERE stand = 'aktiv' AND laeuft_ab > ?",
            [time()]
        );
    }

    /* ------------------------------------------------------------------
       Nach außen

       Aus einer Datenbankzeile wird das Inserat, wie der Browser es
       kennt. Zwei Blöcke setzt hier ausschließlich der Server: `anbieter`
       und `stats`. Beide sind Vertrauensangaben – wer sie selbst
       ausfüllen dürfte, könnte sich jedes Siegel geben.
       ------------------------------------------------------------------ */

    public static function nachAussen(array $z, bool $mitBildern = true): array
    {
        $d = json_decode((string) $z['daten'], true);
        if (!is_array($d)) {
            $d = [];
        }

        $konto = Db::zeile('SELECT kennung, name, stufe, angelegt FROM tt_konto WHERE id = ?', [$z['konto_id']]);
        $inserate = (int) Db::wert(
            "SELECT COUNT(*) FROM tt_inserat WHERE konto_id = ? AND stand = 'aktiv'",
            [$z['konto_id']]
        );

        $d['id'] = $z['kennung'];
        $d['echt'] = true;
        $d['anbieter'] = [
            'name' => ($konto['name'] ?? '') !== '' ? $konto['name'] : 'Privat',
            'art' => 'privat',
            'stadt' => $z['stadt'],
            /* Was hier steht, ist gemessen, nicht behauptet. Wo nichts
               gemessen wurde, steht null – und die Oberfläche schreibt
               „noch keine Erfahrung“ statt einer Zahl. */
            'quote' => null,
            'antwortStd' => null,
            'verifiziert' => (int) ($konto['stufe'] ?? 0) >= 2,
            'stufe' => (int) ($konto['stufe'] ?? 0),
            'seit' => date('Y-m-d', (int) ($konto['angelegt'] ?? time())),
            'inserate' => $inserate,
            'bewertung' => 0,
            'bewertungen' => 0,
        ];
        $d['stats'] = [
            'aufrufe' => (int) $z['aufrufe'],
            'bewerber' => (int) $z['anfragen'],
            'online' => date('Y-m-d', (int) $z['angelegt']),
        ];
        $d['wgGruendungMoeglich'] = (int) $z['wg_gruendung'] === 1;
        $d['erstellt'] = date('Y-m-d', (int) $z['angelegt']);
        $d['laeuftAb'] = date('Y-m-d', (int) $z['laeuft_ab']);
        $d['stand'] = $z['stand'];

        if ($mitBildern) {
            $d['bilder'] = Bild::zuInserat((int) $z['id']);
        }
        return $d;
    }
}
