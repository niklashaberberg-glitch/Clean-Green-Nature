<?php
/* =====================================================================
   Besichtigungstermine

   Der häufigste Ablauf bei einer Wohnungsbesichtigung ist der
   Massentermin: dreißig Menschen stehen gleichzeitig im Treppenhaus,
   niemand sieht die Wohnung richtig, und die anbietende Seite hat
   danach dreißig Namen und keine Ordnung. Der zweithäufigste ist die
   Terminfindung per Mail – acht Nachrichten hin und her für ein
   Zeitfenster.

   Beides löst dieselbe Sache: feste Zeitfenster, die die anbietende
   Seite setzt, und ein Platz, der jemandem gehört, sobald er ihn nimmt.

   Zwei Entscheidungen stecken darin, die nicht offensichtlich sind:

   ERSTENS zählt der Server die Plätze aus den Buchungen und nicht in
   einer Spalte. Eine Zählspalte läuft auseinander, sobald zwei Leute im
   selben Moment buchen oder eine Absage abbricht – und dann steht „noch
   ein Platz frei“ an einem Termin, der voll ist.

   ZWEITENS sieht die suchende Seite nie, wer sonst gebucht hat. Sie
   sieht die Zahl der freien Plätze, mehr nicht. Wer zu einer
   Besichtigung geht, hat nicht eingewilligt, den anderen
   Bewerberinnen namentlich bekannt zu werden.
   ===================================================================== */

final class Termin
{
    private const MAX_JE_INSERAT = 40;
    private const MAX_PLAETZE = 50;

    /* ------------------------------------------------------------------
       Lesen
       ------------------------------------------------------------------ */

    /**
     * Die Termine zu einem Inserat.
     *
     * `$kontoId` entscheidet nur darüber, ob bei einem Termin steht,
     * dass man selbst darauf gebucht ist – nicht darüber, was sonst
     * sichtbar wird.
     */
    public static function zuInserat(string $inseratKennung, ?int $kontoId = null): array
    {
        $zeilen = Db::zeilen(
            'SELECT * FROM tt_termin WHERE inserat_id = ? ORDER BY datum, zeit',
            [$inseratKennung]
        );
        if (!$zeilen) {
            return [];
        }

        $ids = array_map(static fn ($z) => (string) $z['id'], $zeilen);
        $platz = implode(',', array_fill(0, count($ids), '?'));

        $belegt = [];
        foreach (Db::zeilen(
            "SELECT termin_id, COUNT(*) AS n FROM tt_buchung WHERE termin_id IN ($platz) GROUP BY termin_id",
            $ids
        ) as $z) {
            $belegt[(string) $z['termin_id']] = (int) $z['n'];
        }

        $meine = [];
        if ($kontoId) {
            foreach (Db::zeilen(
                "SELECT termin_id FROM tt_buchung WHERE konto_id = ? AND termin_id IN ($platz)",
                array_merge([$kontoId], $ids)
            ) as $z) {
                $meine[(string) $z['termin_id']] = true;
            }
        }

        $heute = date('Y-m-d');
        $raus = [];
        foreach ($zeilen as $z) {
            $id = (string) $z['id'];
            /* Vergangene Termine verschwinden aus der Liste, statt als
               „0 Plätze frei“ stehen zu bleiben. */
            if ((string) $z['datum'] < $heute) {
                continue;
            }
            $raus[] = [
                'id'      => $id,
                'datum'   => (string) $z['datum'],
                'zeit'    => (string) $z['zeit'],
                'art'     => (string) $z['art'],
                'plaetze' => (int) $z['plaetze'],
                'belegt'  => $belegt[$id] ?? 0,
                'meiner'  => isset($meine[$id]),
            ];
        }
        return $raus;
    }

    /** Woraufhin jemand selbst gebucht ist – für die Merkliste. */
    public static function meine(int $kontoId): array
    {
        $raus = [];
        foreach (Db::zeilen(
            'SELECT t.*, b.angelegt AS gebucht FROM tt_buchung b
               JOIN tt_termin t ON t.id = b.termin_id
              WHERE b.konto_id = ? ORDER BY t.datum, t.zeit',
            [$kontoId]
        ) as $z) {
            $raus[] = [
                'id'      => (string) $z['id'],
                'inserat' => (string) $z['inserat_id'],
                'datum'   => (string) $z['datum'],
                'zeit'    => (string) $z['zeit'],
                'art'     => (string) $z['art'],
                'gebucht' => (int) $z['gebucht'],
            ];
        }
        return $raus;
    }

    /* ------------------------------------------------------------------
       Die anbietende Seite
       ------------------------------------------------------------------ */

    public static function anlegen(array $konto, string $inseratKennung, array $d): array
    {
        $inserat = self::eigenesInserat($konto, $inseratKennung);

        $datum = (string) ($d['datum'] ?? '');
        $zeit  = (string) ($d['zeit'] ?? '');
        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $datum)) {
            Antwort::fehler('Das Datum fehlt oder hat die falsche Form.', 400, ['feld' => 'datum']);
        }
        if (!preg_match('/^\d{2}:\d{2}$/', $zeit)) {
            Antwort::fehler('Die Uhrzeit fehlt oder hat die falsche Form.', 400, ['feld' => 'zeit']);
        }
        if ($datum < date('Y-m-d')) {
            Antwort::fehler('Dieser Termin liegt in der Vergangenheit.', 400, ['feld' => 'datum']);
        }
        if ($datum > date('Y-m-d', time() + 400 * 86400)) {
            Antwort::fehler('So weit im Voraus lässt sich kein Termin anlegen.', 400, ['feld' => 'datum']);
        }

        $anzahl = (int) Db::wert('SELECT COUNT(*) FROM tt_termin WHERE inserat_id = ?', [$inseratKennung]);
        if ($anzahl >= self::MAX_JE_INSERAT) {
            Antwort::fehler('Mehr als ' . self::MAX_JE_INSERAT . ' Termine je Inserat gehen nicht.', 409);
        }

        $doppelt = Db::wert(
            'SELECT 1 FROM tt_termin WHERE inserat_id = ? AND datum = ? AND zeit = ?',
            [$inseratKennung, $datum, $zeit]
        );
        if ($doppelt) {
            Antwort::fehler('Zu dieser Zeit steht schon ein Termin.', 409);
        }

        $id = bin2hex(random_bytes(12));
        Db::fuehre(
            'INSERT INTO tt_termin (id, inserat_id, datum, zeit, art, plaetze, angelegt)
             VALUES (?, ?, ?, ?, ?, ?, ?)',
            [
                $id,
                $inseratKennung,
                $datum,
                $zeit,
                self::art((string) ($d['art'] ?? 'Einzeltermin')),
                min(self::MAX_PLAETZE, max(1, (int) ($d['plaetze'] ?? 1))),
                time(),
            ]
        );

        return ['id' => $id, 'termine' => self::zuInserat($inseratKennung, (int) $konto['id'])];
    }

    /**
     * Einen Termin entfernen. Wer gebucht hatte, bekommt eine Nachricht –
     * ein Termin, der ohne Wort verschwindet, ist schlimmer als keiner.
     */
    public static function entfernen(array $konto, string $terminId, string $basis): array
    {
        $t = Db::zeile('SELECT * FROM tt_termin WHERE id = ?', [$terminId]);
        if (!$t) {
            Antwort::fehler('Diesen Termin gibt es nicht.', 404);
        }
        $inserat = self::eigenesInserat($konto, (string) $t['inserat_id']);

        $betroffene = Db::zeilen(
            'SELECT k.mail FROM tt_buchung b JOIN tt_konto k ON k.id = b.konto_id WHERE b.termin_id = ?',
            [$terminId]
        );

        Db::fuehre('DELETE FROM tt_buchung WHERE termin_id = ?', [$terminId]);
        Db::fuehre('DELETE FROM tt_termin WHERE id = ?', [$terminId]);

        $titel = (string) ($inserat['titel'] ?? 'einem Inserat');
        foreach ($betroffene as $z) {
            $mail = (string) ($z['mail'] ?? '');
            if ($mail === '') {
                continue;
            }
            Post::senden(
                $mail,
                'Besichtigungstermin abgesagt',
                "Guten Tag,\n\n"
                . "der Besichtigungstermin am " . self::deutsch((string) $t['datum']) . " um "
                . (string) $t['zeit'] . " Uhr zu „" . $titel . "“ wurde von der anbietenden Seite "
                . "abgesagt.\n\n"
                . "Ob es einen Ersatztermin gibt, steht auf der Seite des Inserats:\n"
                . $basis . "/#/objekt/" . (string) $t['inserat_id'] . "\n\n"
                . "TrimmoTrade"
            );
        }

        return ['abgesagt' => count($betroffene), 'termine' => self::zuInserat((string) $t['inserat_id'], (int) $konto['id'])];
    }

    /* ------------------------------------------------------------------
       Die suchende Seite
       ------------------------------------------------------------------ */

    public static function buchen(array $konto, string $terminId, string $basis): array
    {
        $t = Db::zeile('SELECT * FROM tt_termin WHERE id = ?', [$terminId]);
        if (!$t) {
            Antwort::fehler('Diesen Termin gibt es nicht mehr.', 404);
        }
        if ((string) $t['datum'] < date('Y-m-d')) {
            Antwort::fehler('Dieser Termin liegt in der Vergangenheit.', 409);
        }

        $inserat = Db::zeile('SELECT * FROM tt_inserat WHERE kennung = ?', [(string) $t['inserat_id']]);
        if (!$inserat) {
            Antwort::fehler('Das Inserat gibt es nicht mehr.', 404);
        }
        if ((int) $inserat['konto_id'] === (int) $konto['id']) {
            Antwort::fehler('Zur eigenen Wohnung braucht es keinen Besichtigungstermin.', 409);
        }

        $schon = Db::wert(
            'SELECT 1 FROM tt_buchung WHERE termin_id = ? AND konto_id = ?',
            [$terminId, (int) $konto['id']]
        );
        if ($schon) {
            Antwort::fehler('Diesen Termin hast du schon.', 409);
        }

        /* Ein Termin je Inserat und Person. Wer zwei Fenster belegt,
           nimmt einem anderen einen Platz weg, den er nicht braucht. */
        $anderer = Db::wert(
            'SELECT t.id FROM tt_buchung b JOIN tt_termin t ON t.id = b.termin_id
              WHERE b.konto_id = ? AND t.inserat_id = ?',
            [(int) $konto['id'], (string) $t['inserat_id']]
        );
        if ($anderer) {
            Antwort::fehler('Du hast zu dieser Wohnung schon einen Termin. Sag ihn zuerst ab.', 409);
        }

        $belegt = (int) Db::wert('SELECT COUNT(*) FROM tt_buchung WHERE termin_id = ?', [$terminId]);
        if ($belegt >= (int) $t['plaetze']) {
            Antwort::fehler('Dieser Termin ist inzwischen voll.', 409);
        }

        Db::fuehre(
            'INSERT INTO tt_buchung (termin_id, konto_id, angelegt) VALUES (?, ?, ?)',
            [$terminId, (int) $konto['id'], time()]
        );

        /* Die anbietende Seite erfährt, dass jemand kommt – ohne Namen
           in der Mail. Wer wissen will, wer gebucht hat, sieht es im
           Postfach, und dort gilt dieselbe Zurückhaltung wie bei einer
           Anfrage. */
        $anbieter = Db::zeile('SELECT mail FROM tt_konto WHERE id = ?', [(int) $inserat['konto_id']]);
        if ($anbieter && (string) ($anbieter['mail'] ?? '') !== '') {
            Post::senden(
                (string) $anbieter['mail'],
                'Ein Besichtigungstermin wurde gebucht',
                "Guten Tag,\n\n"
                . "zu Ihrem Inserat „" . (string) $inserat['titel'] . "“ hat jemand den Termin am "
                . self::deutsch((string) $t['datum']) . " um " . (string) $t['zeit'] . " Uhr genommen.\n\n"
                . "Übersicht Ihrer Termine:\n" . $basis . "/#/objekt/" . (string) $t['inserat_id'] . "\n\n"
                . "TrimmoTrade"
            );
        }

        return ['termine' => self::zuInserat((string) $t['inserat_id'], (int) $konto['id'])];
    }

    public static function absagen(array $konto, string $terminId): array
    {
        $t = Db::zeile('SELECT * FROM tt_termin WHERE id = ?', [$terminId]);
        if (!$t) {
            Antwort::fehler('Diesen Termin gibt es nicht mehr.', 404);
        }
        Db::fuehre(
            'DELETE FROM tt_buchung WHERE termin_id = ? AND konto_id = ?',
            [$terminId, (int) $konto['id']]
        );
        return ['termine' => self::zuInserat((string) $t['inserat_id'], (int) $konto['id'])];
    }

    /* ------------------------------------------------------------------
       Aufräumen
       ------------------------------------------------------------------ */

    /** Termine, die drei Monate zurückliegen, samt Buchungen. */
    public static function aufraeumen(): int
    {
        $alt = date('Y-m-d', time() - 90 * 86400);
        $ids = array_map(
            static fn ($z) => (string) $z['id'],
            Db::zeilen('SELECT id FROM tt_termin WHERE datum < ?', [$alt])
        );
        if (!$ids) {
            return 0;
        }
        $platz = implode(',', array_fill(0, count($ids), '?'));
        Db::fuehre("DELETE FROM tt_buchung WHERE termin_id IN ($platz)", $ids);
        Db::fuehre("DELETE FROM tt_termin WHERE id IN ($platz)", $ids);
        return count($ids);
    }

    /** Mit dem Inserat verschwinden seine Termine. */
    public static function zuInseratLoeschen(string $inseratKennung): void
    {
        $ids = array_map(
            static fn ($z) => (string) $z['id'],
            Db::zeilen('SELECT id FROM tt_termin WHERE inserat_id = ?', [$inseratKennung])
        );
        if ($ids) {
            $platz = implode(',', array_fill(0, count($ids), '?'));
            Db::fuehre("DELETE FROM tt_buchung WHERE termin_id IN ($platz)", $ids);
        }
        Db::fuehre('DELETE FROM tt_termin WHERE inserat_id = ?', [$inseratKennung]);
    }

    /* ------------------------------------------------------------------
       Kleinigkeiten
       ------------------------------------------------------------------ */

    private static function eigenesInserat(array $konto, string $kennung): array
    {
        $i = Db::zeile('SELECT * FROM tt_inserat WHERE kennung = ?', [$kennung]);
        if (!$i) {
            Antwort::fehler('Dieses Inserat gibt es nicht.', 404);
        }
        if ((int) $i['konto_id'] !== (int) $konto['id']) {
            Antwort::fehler('Termine legt fest, wem das Inserat gehört.', 403);
        }
        return $i;
    }

    private static function art(string $s): string
    {
        $erlaubt = ['Einzeltermin', 'Sammeltermin', 'Videobesichtigung', 'Offene Besichtigung'];
        return in_array($s, $erlaubt, true) ? $s : 'Einzeltermin';
    }

    private static function deutsch(string $iso): string
    {
        $t = explode('-', $iso);
        return count($t) === 3 ? $t[2] . '.' . $t[1] . '.' . $t[0] : $iso;
    }
}
