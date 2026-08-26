<?php
/* =====================================================================
   WG-Gründung

   Eine Wohngemeinschaft entsteht hier normalerweise so: Sie besteht
   schon, jemand zieht aus, ein Zimmer wird frei, jemand zieht ein. Für
   diesen Fall gibt es Portale, und sie funktionieren.

   Für den anderen Fall gibt es keins. Eine Vier-Zimmer-Wohnung für
   1.600 Euro warm steht monatelang leer, weil sie für eine Familie zu
   teuer und für eine Person zu groß ist. Drei Menschen könnten sie
   nehmen – aber sie kennen sich nicht, und keiner von ihnen kann allein
   zusagen. Jeder bräuchte gleichzeitig die Wohnung und zwei Mitbewohner,
   und beides hängt voneinander ab.

   Das ist derselbe doppelte Zufall, an dem der direkte Wohnungstausch
   scheitert. Und er lässt sich auf dieselbe Weise auflösen: indem man
   sichtbar macht, wer sucht, statt es dem Zufall zu überlassen. Jemand
   eröffnet eine Gruppe zu einer konkreten Wohnung, andere treten bei,
   und wenn sie voll ist, bewirbt sie sich als eine Bewerbung.

   Drei Dinge sind dabei ernst zu nehmen:

   1. **Wer wen sehen darf.** Eine Beitrittsanfrage sieht nur die
      gründende Person. Erst wer aufgenommen ist, sieht die anderen.
      E-Mail-Adressen sehen ausschließlich aufgenommene Mitglieder –
      denn die haben einander ausdrücklich angenommen.

   2. **Die Haftung.** Ein gemeinsamer Mietvertrag macht alle zu
      Gesamtschuldnern (§ 421 BGB): Zahlt einer nicht, schulden die
      anderen die volle Miete. Das steht in der Oberfläche, bevor jemand
      beitritt – nicht im Kleingedruckten danach.

   3. **Was hier nicht passiert.** TrimmoTrade prüft keine Personen. Wer
      sich hier zusammentut, entscheidet selbst. Alles andere zu
      behaupten wäre ein Versprechen, das niemand halten kann.
   ===================================================================== */

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/antwort.php';

final class Gruppe
{
    /** Wie lange eine Gruppe offen bleibt, wenn nichts passiert. */
    public const LAUFZEIT_TAGE = 45;

    public const HOECHSTENS_JE_KONTO = 5;
    public const ZIEL_MIN = 2;
    public const ZIEL_MAX = 8;

    /* Was eine Person über sich sagt. Feste Liste, aus demselben Grund
       wie bei der Anfrage: „schick einfach das Profil mit“ wäre der
       Anfang davon, dass hier Angaben zu Religion, Herkunft oder
       Gesundheit stehen – Daten nach Art. 9 DSGVO, die niemanden etwas
       angehen und die deshalb gar nicht erst durchkommen. */
    private const ECKDATEN = [
        'alter'      => 3,
        'beruf'      => 60,
        'einkommen'  => 40,   // Spanne, nie auf den Euro
        'raucher'    => 20,
        'haustiere'  => 40,
        'einzug'     => 20,
    ];

    /* Die sechs Dimensionen aus match.js. Sie werden hier nur
       durchgereicht und auf 0 bis 10 begrenzt – gerechnet wird im
       Browser, wo auch das eigene Profil liegt. */
    private const LIFESTYLE = ['sauber', 'ruhe', 'gaeste', 'gemeinsam', 'chrono', 'kochen'];

    /* ------------------------------------------------------------------
       Hereinkommende Angaben
       ------------------------------------------------------------------ */

    public static function eckdatenSaeubern(array $roh): array
    {
        $raus = [];
        foreach (self::ECKDATEN as $feld => $max) {
            $w = Inserat::text($roh[$feld] ?? '', $max);
            if ($w !== '') {
                $raus[$feld] = $w;
            }
        }
        $ls = [];
        $quelle = is_array($roh['lifestyle'] ?? null) ? $roh['lifestyle'] : [];
        foreach (self::LIFESTYLE as $k) {
            if (isset($quelle[$k]) && is_numeric($quelle[$k])) {
                $ls[$k] = (int) Inserat::zahl($quelle[$k], 0, 10, 5);
            }
        }
        if ($ls) {
            $raus['lifestyle'] = $ls;
        }
        return $raus;
    }

    /* ------------------------------------------------------------------
       Gründen und beitreten
       ------------------------------------------------------------------ */

    public static function anlegen(array $konto, array $roh): array
    {
        $offen = (int) Db::wert(
            "SELECT COUNT(*) FROM tt_gruppe WHERE gruender_id = ? AND stand IN ('offen','voll')",
            [$konto['id']]
        );
        if ($offen >= self::HOECHSTENS_JE_KONTO) {
            Antwort::fehler('Mehr als ' . self::HOECHSTENS_JE_KONTO . ' offene Gruppen gleichzeitig gehen '
                . 'nicht. Löse eine auf, dann geht die neue.', 409);
        }

        $inserat = null;
        $kennungInserat = Inserat::text($roh['inserat'] ?? '', 40);
        if ($kennungInserat !== '') {
            $inserat = Inserat::nachKennung($kennungInserat);
            if (!$inserat) {
                Antwort::fehler('Dieses Inserat gibt es nicht.', 404);
            }
            if ($inserat['stand'] !== 'aktiv' || (int) $inserat['laeuft_ab'] < time()) {
                Antwort::fehler('Dieses Inserat steht nicht mehr zur Verfügung.', 409);
            }
            if (!(int) $inserat['wg_gruendung']) {
                Antwort::fehler('Für diese Wohnung ist eine WG-Gründung nicht vorgesehen. '
                    . 'Das entscheidet die anbietende Seite.', 409);
            }
            if ((int) $inserat['konto_id'] === (int) $konto['id']) {
                Antwort::fehler('Das ist dein eigenes Inserat.', 409);
            }
            $schon = Db::zeile(
                "SELECT g.kennung FROM tt_gruppe g
                   JOIN tt_gruppe_person p ON p.gruppe_id = g.id
                  WHERE g.inserat_id = ? AND p.konto_id = ? AND p.stand IN ('angefragt','dabei')
                    AND g.stand IN ('offen','voll')",
                [$inserat['id'], $konto['id']]
            );
            if ($schon) {
                Antwort::fehler('Zu dieser Wohnung bist du schon in einer Gruppe.', 409,
                    ['kennung' => $schon['kennung']]);
            }
        }

        $ziel = (int) Inserat::zahl($roh['ziel'] ?? null, self::ZIEL_MIN, self::ZIEL_MAX, 3);
        /* Mehr Menschen als Zimmer geht nicht. Ein Zimmer bleibt für die
           gemeinsame Nutzung – eine WG ohne Wohnzimmer, in der jeder in
           seinem Zimmer sitzt, ist der häufigste Grund, warum eine
           Gründung nach vier Monaten wieder auseinanderfällt. Deshalb ein
           Hinweis, keine Sperre: Es gibt Wohnungen mit großer Küche, und
           die Entscheidung gehört den Beteiligten. */
        $zimmer = $inserat ? (float) $inserat['zimmer'] : 0;

        $kennung = 'g' . strtolower(bin2hex(random_bytes(8)));
        $jetzt = time();
        Db::fuehre(
            'INSERT INTO tt_gruppe (kennung, inserat_id, gruender_id, name, ziel, text, offen, stand,
               anfrage_id, angelegt, geaendert, laeuft_ab)
             VALUES (?,?,?,?,?,?,1,?,0,?,?,?)',
            [
                $kennung, $inserat ? (int) $inserat['id'] : 0, $konto['id'],
                Inserat::text($roh['name'] ?? '', 120) ?: 'Neue WG',
                $ziel,
                Inserat::text($roh['text'] ?? '', 2000),
                'offen', $jetzt, $jetzt, $jetzt + self::LAUFZEIT_TAGE * 86400,
            ]
        );
        $gruppeId = Db::letzteId();
        self::personEintragen($gruppeId, (int) $konto['id'], 'gruender', 'dabei', $roh);
        Zaehler::plus('wg-gruppe-neu');

        $z = self::nachKennung($kennung);
        $raus = $z ? self::nachAussen($z, $konto) : [];
        if ($zimmer > 0 && $ziel > $zimmer - 1) {
            $raus['hinweis'] = 'Bei ' . rtrim(rtrim(number_format($zimmer, 1, ',', ''), '0'), ',')
                . ' Zimmern und ' . $ziel . ' Personen bleibt kein Gemeinschaftsraum. '
                . 'Das geht – es sollte nur vorher besprochen sein.';
        }
        return $raus;
    }

    private static function personEintragen(int $gruppeId, int $kontoId, string $rolle, string $stand, array $roh): string
    {
        $kennung = 'p' . strtolower(bin2hex(random_bytes(8)));
        Db::fuehre(
            'INSERT INTO tt_gruppe_person (kennung, gruppe_id, konto_id, rolle, stand, vorstellung,
               eckdaten, angelegt, entschieden)
             VALUES (?,?,?,?,?,?,?,?,?)',
            [
                $kennung, $gruppeId, $kontoId, $rolle, $stand,
                Inserat::text($roh['vorstellung'] ?? '', 1500),
                json_encode(self::eckdatenSaeubern(is_array($roh['eckdaten'] ?? null) ? $roh['eckdaten'] : []),
                    JSON_UNESCAPED_UNICODE),
                time(), $stand === 'dabei' ? time() : 0,
            ]
        );
        return $kennung;
    }

    public static function beitreten(array $konto, string $kennung, array $roh): array
    {
        $g = self::nachKennung($kennung);
        if (!$g) {
            Antwort::fehler('Diese Gruppe gibt es nicht.', 404);
        }
        if ($g['stand'] !== 'offen' || !(int) $g['offen']) {
            Antwort::fehler('Diese Gruppe nimmt gerade niemanden auf.', 409);
        }
        if ((int) $g['laeuft_ab'] < time()) {
            Antwort::fehler('Diese Gruppe ist abgelaufen.', 409);
        }
        if ((int) $g['gruender_id'] === (int) $konto['id']) {
            Antwort::fehler('Das ist deine eigene Gruppe.', 409);
        }
        /* Die anbietende Seite gehört nicht in die Gruppe, die sich bei
           ihr bewirbt. Was die Bewerbenden einander erzählen, erzählen
           sie einander – nicht dem Vermieter. Was er erfahren soll,
           steht in der Bewerbung. */
        if ((int) $g['inserat_id']) {
            $eigner = (int) Db::wert('SELECT konto_id FROM tt_inserat WHERE id = ?', [$g['inserat_id']]);
            if ($eigner === (int) $konto['id']) {
                Antwort::fehler('Das ist deine eigene Wohnung.', 409);
            }
        }
        $da = Db::zeile('SELECT * FROM tt_gruppe_person WHERE gruppe_id = ? AND konto_id = ?',
            [$g['id'], $konto['id']]);
        if ($da && in_array($da['stand'], ['angefragt', 'dabei'], true)) {
            Antwort::fehler('Du bist hier schon dabei oder hast angefragt.', 409);
        }
        if ($da && $da['stand'] === 'abgelehnt') {
            Antwort::fehler('Diese Gruppe hat sich anders entschieden.', 409);
        }
        if (self::dabei((int) $g['id']) >= (int) $g['ziel']) {
            Antwort::fehler('Diese Gruppe ist voll.', 409);
        }

        $text = Inserat::text($roh['vorstellung'] ?? '', 1500);
        if (mb_strlen($text, 'UTF-8') < 20) {
            Antwort::fehler('Schreib ein paar Sätze über dich – sonst kann niemand entscheiden.',
                422, ['feld' => 'vorstellung']);
        }

        if ($da) {
            /* Wer die Gruppe verlassen hatte, darf zurück – aber wieder
               über die Anfrage, nicht an der Entscheidung vorbei. */
            Db::fuehre("UPDATE tt_gruppe_person SET stand = 'angefragt', vorstellung = ?, eckdaten = ?,
                          angelegt = ?, entschieden = 0 WHERE id = ?",
                [$text, json_encode(self::eckdatenSaeubern(is_array($roh['eckdaten'] ?? null) ? $roh['eckdaten'] : []),
                    JSON_UNESCAPED_UNICODE), time(), $da['id']]);
        } else {
            self::personEintragen((int) $g['id'], (int) $konto['id'], 'mitglied', 'angefragt', $roh);
        }
        Db::fuehre('UPDATE tt_gruppe SET geaendert = ? WHERE id = ?', [time(), $g['id']]);
        self::gruenderBenachrichtigen($g, $konto);
        Zaehler::plus('wg-beitritt');

        return self::nachAussen(self::nachKennung($kennung) ?? [], $konto);
    }

    /** Der gründenden Person sagen, dass jemand angefragt hat. Ohne diese
        Mail bleibt eine Anfrage liegen, bis jemand zufällig vorbeischaut –
        und eine Gruppe, in der niemand entscheidet, ist keine. */
    private static function gruenderBenachrichtigen(array $g, array $wer): void
    {
        $an = Db::wert('SELECT mail FROM tt_konto WHERE id = ? AND mail_bestaetigt = 1', [$g['gruender_id']]);
        if (!is_string($an) || $an === '') {
            return;
        }
        $basis = rtrim((string) (Post::basis() ?? ''), '/');
        Post::senden(
            $an,
            'Jemand möchte in deine Gruppe „' . mb_substr((string) $g['name'], 0, 50, 'UTF-8') . '“',
            "Für deine Gruppe ist eine Beitrittsanfrage eingegangen.\n\n"
            . 'Gruppe: ' . $g['name'] . "\n\n"
            . "Wer es ist und was er über sich schreibt, steht in der Anwendung:\n"
            . $basis . "/#/wg\n\n"
            . "Du entscheidest, wer dazukommt. Bis dahin sehen die übrigen Mitglieder\n"
            . "die Anfrage nicht.\n"
        );
    }

    /* ------------------------------------------------------------------
       Entscheiden, verlassen, auflösen
       ------------------------------------------------------------------ */

    public static function entscheiden(array $konto, string $kennung, string $person, bool $ja): array
    {
        $g = self::nachKennung($kennung);
        if (!$g || (int) $g['gruender_id'] !== (int) $konto['id']) {
            Antwort::fehler('Diese Gruppe gibt es nicht oder sie gehört jemand anderem.', 404);
        }
        $p = Db::zeile('SELECT * FROM tt_gruppe_person WHERE kennung = ? AND gruppe_id = ?',
            [$person, $g['id']]);
        if (!$p || $p['stand'] !== 'angefragt') {
            Antwort::fehler('Diese Anfrage gibt es nicht mehr.', 404);
        }
        if ($ja && self::dabei((int) $g['id']) >= (int) $g['ziel']) {
            Antwort::fehler('Die Gruppe ist schon voll.', 409);
        }

        Db::fuehre('UPDATE tt_gruppe_person SET stand = ?, entschieden = ? WHERE id = ?',
            [$ja ? 'dabei' : 'abgelehnt', time(), $p['id']]);

        Db::fuehre('UPDATE tt_gruppe SET stand = ?, geaendert = ? WHERE id = ?',
            [self::standNeu($g), time(), $g['id']]);

        self::entscheidungMelden($g, (int) $p['konto_id'], $ja);
        return self::nachAussen(self::nachKennung($kennung) ?? [], $konto);
    }

    private static function entscheidungMelden(array $g, int $kontoId, bool $ja): void
    {
        $an = Db::wert('SELECT mail FROM tt_konto WHERE id = ? AND mail_bestaetigt = 1', [$kontoId]);
        if (!is_string($an) || $an === '') {
            return;
        }
        $basis = rtrim((string) (Post::basis() ?? ''), '/');
        if ($ja) {
            Post::senden($an, 'Du bist dabei: „' . mb_substr((string) $g['name'], 0, 50, 'UTF-8') . '“',
                "Die Gruppe hat dich aufgenommen.\n\n"
                . 'Gruppe: ' . $g['name'] . "\n"
                . $basis . "/#/wg\n\n"
                . "Ab jetzt siehst du die anderen Mitglieder und sie dich – mit den Angaben,\n"
                . "die ihr beim Beitritt gemacht habt, und mit euren E-Mail-Adressen.\n\n"
                . "Ein Rat, der nichts kostet: Trefft euch, bevor ihr euch gemeinsam bewerbt.\n"
                . "Ein gemeinsamer Mietvertrag macht euch zu Gesamtschuldnern – zahlt einer\n"
                . "nicht, schulden die anderen die volle Miete (§ 421 BGB).\n");
        } else {
            Post::senden($an, 'Absage von „' . mb_substr((string) $g['name'], 0, 50, 'UTF-8') . '“',
                "Diese Gruppe hat sich anders entschieden.\n\n"
                . "Das sagt nichts über dich – meistens war jemand einfach schneller da.\n"
                . "Andere Gruppen zur selben Wohnung und zu anderen findest du hier:\n"
                . $basis . "/#/wg\n");
        }
    }

    public static function verlassen(array $konto, string $kennung): array
    {
        $g = self::nachKennung($kennung);
        if (!$g) {
            Antwort::fehler('Diese Gruppe gibt es nicht.', 404);
        }
        /* Die gründende Person kann nicht einfach gehen – sie löst auf.
           Eine Gruppe ohne Gründer, in der niemand mehr entscheiden
           kann, wäre eine Sackgasse für alle Übrigen. */
        if ((int) $g['gruender_id'] === (int) $konto['id']) {
            Db::fuehre("UPDATE tt_gruppe SET stand = 'aufgeloest', geaendert = ? WHERE id = ?",
                [time(), $g['id']]);
            foreach (Db::zeilen("SELECT konto_id FROM tt_gruppe_person WHERE gruppe_id = ? AND stand = 'dabei' AND konto_id <> ?",
                [$g['id'], $konto['id']]) as $m) {
                self::aufloesungMelden($g, (int) $m['konto_id']);
            }
            return ['aufgeloest' => true];
        }
        $p = Db::zeile('SELECT * FROM tt_gruppe_person WHERE gruppe_id = ? AND konto_id = ?',
            [$g['id'], $konto['id']]);
        if (!$p) {
            Antwort::fehler('Du bist in dieser Gruppe nicht eingetragen.', 404);
        }
        Db::fuehre("UPDATE tt_gruppe_person SET stand = 'weg', entschieden = ? WHERE id = ?", [time(), $p['id']]);
        Db::fuehre('UPDATE tt_gruppe SET stand = ?, geaendert = ? WHERE id = ?',
            [self::standNeu($g), time(), $g['id']]);
        return self::nachAussen(self::nachKennung($kennung) ?? [], $konto);
    }

    private static function aufloesungMelden(array $g, int $kontoId): void
    {
        $an = Db::wert('SELECT mail FROM tt_konto WHERE id = ? AND mail_bestaetigt = 1', [$kontoId]);
        if (!is_string($an) || $an === '') {
            return;
        }
        $basis = rtrim((string) (Post::basis() ?? ''), '/');
        Post::senden($an, 'Die Gruppe „' . mb_substr((string) $g['name'], 0, 50, 'UTF-8') . '“ wurde aufgelöst',
            "Die gründende Person hat die Gruppe aufgelöst.\n\n"
            . "Andere Gruppen und Wohnungen, für die eine Gründung vorgesehen ist:\n"
            . $basis . "/#/wg\n");
    }

    /* ------------------------------------------------------------------
       Gemeinsam bewerben

       Der Punkt, an dem aus einer Gruppe eine Bewerbung wird. Sie geht
       als **eine** Anfrage hinaus, nicht als drei – für die anbietende
       Seite ist das der ganze Unterschied: Drei einzelne Anfragen sind
       drei Menschen, die alle die Wohnung allein nicht bezahlen können.
       Eine gemeinsame Anfrage ist ein vollständiger Haushalt.
       ------------------------------------------------------------------ */

    public static function bewerben(array $konto, string $kennung, string $text, string $basis): array
    {
        $g = self::nachKennung($kennung);
        if (!$g || (int) $g['gruender_id'] !== (int) $konto['id']) {
            Antwort::fehler('Diese Gruppe gibt es nicht oder sie gehört jemand anderem.', 404);
        }
        if (!(int) $g['inserat_id']) {
            Antwort::fehler('Diese Gruppe hängt an keiner Wohnung.', 409);
        }
        if ($g['stand'] === 'beworben') {
            Antwort::fehler('Diese Gruppe hat sich schon beworben.', 409);
        }
        $mitglieder = self::personen((int) $g['id'], 'dabei');
        if (count($mitglieder) < 2) {
            Antwort::fehler('Zu zweit fängt eine WG an. Wartet, bis jemand dazukommt.', 409);
        }
        $inserat = Db::zeile('SELECT * FROM tt_inserat WHERE id = ?', [$g['inserat_id']]);
        if (!$inserat) {
            Antwort::fehler('Die Wohnung gibt es nicht mehr.', 409);
        }

        /* Die Eckdaten der ganzen Gruppe, zusammengefasst: Das ist die
           Angabe, auf die es der anbietenden Seite ankommt. */
        $eck = [
            'haushalt' => count($mitglieder) . ' Personen als WG',
            'beschaeftigung' => implode(', ', array_values(array_filter(array_map(
                static fn ($m) => $m['eck']['beruf'] ?? '', $mitglieder)))),
        ];
        $einzug = array_values(array_filter(array_map(static fn ($m) => $m['eck']['einzug'] ?? '', $mitglieder)));
        if ($einzug) {
            $eck['einzug'] = $einzug[0];
        }
        $raucher = array_values(array_filter(array_map(static fn ($m) => $m['eck']['raucher'] ?? '', $mitglieder)));
        if ($raucher) {
            $eck['raucher'] = implode(', ', array_unique($raucher));
        }

        $voll = Inserat::text($text, 4000);
        if (mb_strlen($voll, 'UTF-8') < 20) {
            Antwort::fehler('Schreibt ein paar Sätze – eine leere Bewerbung wird nicht beantwortet.',
                422, ['feld' => 'text']);
        }
        $voll .= "\n\n— Diese Bewerbung kommt von einer Gruppe, die sich über TrimmoTrade "
            . 'zusammengefunden hat: ' . count($mitglieder) . ' Personen für '
            . rtrim(rtrim(number_format((float) $inserat['zimmer'], 1, ',', ''), '0'), ',') . ' Zimmer.';

        $anfrage = Anfrage::senden($konto, $inserat, [
            'text' => $voll,
            'name' => (string) ($konto['name'] ?? '') . ' und ' . (count($mitglieder) - 1) . ' weitere',
            'eckdaten' => $eck,
        ], $basis);

        Db::fuehre("UPDATE tt_gruppe SET stand = 'beworben', anfrage_id = ?, geaendert = ?, offen = 0 WHERE id = ?",
            [$anfrage['id'] ?? 0, time(), $g['id']]);
        Zaehler::plus('wg-bewerbung');
        return self::nachAussen(self::nachKennung($kennung) ?? [], $konto);
    }

    /* ------------------------------------------------------------------
       Lesen
       ------------------------------------------------------------------ */

    public static function nachKennung(string $kennung): ?array
    {
        return Db::zeile('SELECT * FROM tt_gruppe WHERE kennung = ?', [$kennung]);
    }

    public static function dabei(int $gruppeId): int
    {
        return (int) Db::wert("SELECT COUNT(*) FROM tt_gruppe_person WHERE gruppe_id = ? AND stand = 'dabei'",
            [$gruppeId]);
    }

    /** @return array<int,array{zeile:array,eck:array}> */
    private static function personen(int $gruppeId, string $stand = ''): array
    {
        $sql = 'SELECT p.*, k.name AS konto_name, k.mail AS konto_mail, k.stufe AS konto_stufe
                  FROM tt_gruppe_person p JOIN tt_konto k ON k.id = p.konto_id
                 WHERE p.gruppe_id = ?';
        $w = [$gruppeId];
        if ($stand !== '') {
            $sql .= ' AND p.stand = ?';
            $w[] = $stand;
        }
        $raus = [];
        foreach (Db::zeilen($sql . ' ORDER BY p.id', $w) as $z) {
            $eck = json_decode((string) $z['eckdaten'], true);
            $raus[] = ['zeile' => $z, 'eck' => is_array($eck) ? $eck : []];
        }
        return $raus;
    }

    /** Nur der Rufname. „Anna B.“ statt „Anna Bergmann“ – genug, um
        miteinander zu reden, zu wenig, um jemanden zu suchen. */
    private static function rufname(string $voll): string
    {
        $teile = preg_split('/\s+/', trim($voll)) ?: [];
        $vorn = $teile[0] ?? '';
        if ($vorn === '') {
            return 'ohne Namen';
        }
        $rest = $teile[1] ?? '';
        return $vorn . ($rest !== '' ? ' ' . mb_substr($rest, 0, 1, 'UTF-8') . '.' : '');
    }

    /**
     * Eine Gruppe nach außen. Wer was sieht, hängt daran, wie nah jemand
     * dran ist – und das ist keine Bequemlichkeit, sondern der Grund,
     * warum man einer Gruppe von Fremden überhaupt etwas über sich
     * erzählen kann:
     *
     *   ohne Konto   Zahlen und der Text der Gruppe. Keine Person.
     *   angemeldet   Rufname, Alter, Beruf, Lebensrhythmus, Vorstellung.
     *   dabei        dasselbe plus die E-Mail-Adressen – die Mitglieder
     *                haben einander angenommen.
     *   gründend     zusätzlich die offenen Beitrittsanfragen.
     */
    public static function nachAussen(array $g, ?array $ich): array
    {
        if (!$g) {
            return [];
        }
        $ichId = $ich ? (int) $ich['id'] : 0;
        $bin = self::rolleVon((int) $g['id'], $ichId);
        $gruender = $ichId && (int) $g['gruender_id'] === $ichId;
        $drin = $gruender || $bin === 'dabei';

        $mitglieder = [];
        $anfragen = [];
        foreach (self::personen((int) $g['id']) as $m) {
            $z = $m['zeile'];
            if (!in_array($z['stand'], ['dabei', 'angefragt'], true)) {
                continue;
            }
            $eintrag = [
                'id' => $z['kennung'],
                'rolle' => $z['rolle'],
                'ich' => $ichId && (int) $z['konto_id'] === $ichId,
                'eckdaten' => $m['eck'],
                'vorstellung' => $z['vorstellung'],
                'stufe' => (int) $z['konto_stufe'],
                'seit' => (int) $z['angelegt'],
            ];
            if ($ich) {
                $eintrag['name'] = self::rufname((string) $z['konto_name']);
            }
            if ($drin && $z['stand'] === 'dabei') {
                $eintrag['mail'] = (string) $z['konto_mail'];
            }
            if ($z['stand'] === 'dabei') {
                $mitglieder[] = $eintrag;
            } elseif ($gruender) {
                $anfragen[] = $eintrag;
            }
        }

        $inserat = null;
        if ((int) $g['inserat_id']) {
            $i = Db::zeile('SELECT kennung, titel, zimmer, flaeche, warm, stadt, viertel_key, stand, laeuft_ab
                              FROM tt_inserat WHERE id = ?', [$g['inserat_id']]);
            if ($i) {
                $inserat = [
                    'id' => $i['kennung'],
                    'titel' => $i['titel'],
                    'zimmer' => (float) $i['zimmer'],
                    'flaeche' => (int) $i['flaeche'],
                    'warm' => (int) $i['warm'],
                    'stadt' => $i['stadt'],
                    'weg' => $i['stand'] !== 'aktiv' || (int) $i['laeuft_ab'] < time(),
                ];
            }
        }

        $anzahl = count($mitglieder);
        return [
            'id' => $g['kennung'],
            'name' => $g['name'],
            'text' => $g['text'],
            'ziel' => (int) $g['ziel'],
            'dabei' => $anzahl,
            'frei' => max(0, (int) $g['ziel'] - $anzahl),
            'stand' => $g['stand'],
            'offen' => (int) $g['offen'] === 1,
            'angelegt' => (int) $g['angelegt'],
            'laeuftAb' => (int) $g['laeuft_ab'],
            'inserat' => $inserat,
            /* Was jede Person zahlen würde, wenn gleichmäßig geteilt wird.
               Die Zahl steht hier, weil sie die erste ist, die jemand
               wissen will – und weil sie sonst jeder selbst im Kopf
               rechnet und sich dabei verrechnet. */
            'jeAnteil' => $inserat && $anzahl > 0 ? (int) round($inserat['warm'] / max(1, (int) $g['ziel'])) : null,
            'meineRolle' => $gruender ? 'gruender' : ($bin ?: ''),
            'mitglieder' => $mitglieder,
            'anfragen' => $anfragen,
        ];
    }

    /** Der Zustand nach jeder Änderung an der Besetzung.

        Der Sonderfall, den man beim ersten Schreiben übersieht: Eine
        Gruppe, die sich schon beworben hat, darf nicht auf „offen“
        zurückfallen, wenn jemand aussteigt. Sonst stünde sie wieder in
        der Liste und nähme Beitritte an, während bei der anbietenden
        Seite längst eine Bewerbung von drei Personen liegt – und die
        vierte, die dazukäme, stünde in keiner davon. */
    private static function standNeu(array $g): string
    {
        if (in_array($g['stand'], ['beworben', 'aufgeloest'], true)) {
            return (string) $g['stand'];
        }
        return self::dabei((int) $g['id']) >= (int) $g['ziel'] ? 'voll' : 'offen';
    }

    private static function rolleVon(int $gruppeId, int $kontoId): string
    {
        if (!$kontoId) {
            return '';
        }
        $z = Db::zeile('SELECT stand FROM tt_gruppe_person WHERE gruppe_id = ? AND konto_id = ?',
            [$gruppeId, $kontoId]);
        return $z ? (string) $z['stand'] : '';
    }

    /** Alle offenen Gruppen zu einer Wohnung. */
    public static function zuInserat(int $inseratId, ?array $ich): array
    {
        $raus = [];
        foreach (Db::zeilen(
            "SELECT * FROM tt_gruppe WHERE inserat_id = ? AND stand IN ('offen','voll','beworben')
              AND laeuft_ab > ? ORDER BY id",
            [$inseratId, time()]
        ) as $z) {
            $raus[] = self::nachAussen($z, $ich);
        }
        return $raus;
    }

    /** Alles, woran ein Konto beteiligt ist – gegründet, dabei, angefragt. */
    public static function meine(array $konto): array
    {
        $raus = [];
        foreach (Db::zeilen(
            "SELECT DISTINCT g.* FROM tt_gruppe g
               LEFT JOIN tt_gruppe_person p ON p.gruppe_id = g.id AND p.konto_id = ?
              WHERE (g.gruender_id = ? OR p.stand IN ('angefragt','dabei'))
                AND g.stand <> 'aufgeloest'
              ORDER BY g.geaendert DESC LIMIT 50",
            [$konto['id'], $konto['id']]
        ) as $z) {
            $raus[] = self::nachAussen($z, $konto);
        }
        return $raus;
    }

    /** Gruppen, die noch jemanden suchen – für die Übersichtsseite. */
    public static function offene(?array $ich, int $wieviele = 40): array
    {
        $raus = [];
        foreach (Db::zeilen(
            "SELECT g.* FROM tt_gruppe g
              WHERE g.stand = 'offen' AND g.offen = 1 AND g.laeuft_ab > ?
              ORDER BY g.geaendert DESC LIMIT " . max(1, min(100, $wieviele)),
            [time()]
        ) as $z) {
            $d = self::nachAussen($z, $ich);
            if ($d['frei'] > 0) {
                $raus[] = $d;
            }
        }
        return $raus;
    }

    /** Läuft beim Aufräumen mit: abgelaufene Gruppen schließen. */
    public static function aufraeumen(): void
    {
        Db::fuehre("UPDATE tt_gruppe SET stand = 'aufgeloest' WHERE laeuft_ab < ? AND stand IN ('offen','voll')",
            [time()]);
    }
}
