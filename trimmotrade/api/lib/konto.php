<?php
/* =====================================================================
   Konten

   Ein Konto ist hier bewusst wenig: eine Kennung, vielleicht eine
   E-Mail-Adresse, vielleicht ein Name, und die Wege, über die man
   hineinkommt. Kein Profil, keine Inserate, keine Merkliste – das alles
   liegt weiter im Browser, wo es hingehört.

   Die Vertrauensstufe ist die einzige abgeleitete Größe, und sie wird
   bei jeder Änderung neu gerechnet statt gespeichert-und-vergessen:
   Wer seine Adresse ändert, fällt damit zurück, und das soll er auch.
   ===================================================================== */

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/antwort.php';

final class Konto
{
    /* Wegwerfadressen sind kein Betrugsbeweis, aber ein Grund, die Stufe
       nicht anzuheben. Die Liste ist absichtlich klein – vollständig
       wäre sie nie, und eine Sperre auf halber Liste ärgert nur die
       Falschen. Deshalb sperrt sie auch nicht, sie deckelt. */
    private const WEGWERF = [
        'mailinator.com', 'trashmail.com', 'wegwerfmail.de', 'guerrillamail.com',
        '10minutemail.com', 'yopmail.com', 'temp-mail.org', 'sharklasers.com',
        'getnada.com', 'dispostable.com', 'maildrop.cc', 'mohmal.com',
    ];

    public static function istWegwerf(string $mail): bool
    {
        $teil = explode('@', mb_strtolower($mail));
        return in_array(end($teil), self::WEGWERF, true);
    }

    public static function stufe(array $k): int
    {
        $n = 0;
        if (!empty($k['mail']) && !empty($k['mail_bestaetigt'])) {
            $n = 1;
        }
        if (!empty($k['hat_passkey']) || (($k['anbieter'] ?? 'mail') !== 'mail')) {
            $n = 2;
        }
        if (!empty($k['mail']) && self::istWegwerf($k['mail'])) {
            $n = min($n, 1);
        }
        return $n;
    }

    public static function nachId(int $id): ?array
    {
        return Db::zeile('SELECT * FROM tt_konto WHERE id = ?', [$id]);
    }

    public static function nachMail(string $mail): ?array
    {
        $mail = mail_normal($mail);
        if ($mail === '') {
            return null;
        }
        return Db::zeile('SELECT * FROM tt_konto WHERE mail = ?', [$mail]);
    }

    public static function nachFremd(string $anbieter, string $fremdId): ?array
    {
        $v = Db::zeile(
            'SELECT konto_id FROM tt_fremd WHERE anbieter = ? AND fremd_id = ?',
            [$anbieter, $fremdId]
        );
        return $v ? self::nachId((int) $v['konto_id']) : null;
    }

    /**
     * Legt ein Konto an oder findet das vorhandene zur selben Adresse.
     *
     * Die Zusammenführung über die Adresse ist der heikelste Punkt der
     * ganzen Anmeldung: Wer bei Google eine fremde, unbestätigte Adresse
     * hinterlegen kann, übernähme damit ein fremdes Konto. Deshalb wird
     * nur zusammengeführt, wenn der Anbieter die Adresse ausdrücklich
     * als bestätigt meldet – `$mailBestaetigt`. Ist sie das nicht,
     * entsteht ein eigenes Konto ohne Adresse.
     */
    public static function findenOderAnlegen(
        ?string $mail,
        bool $mailBestaetigt,
        string $anbieter,
        string $name = ''
    ): array {
        $mail = $mail !== null ? mail_normal($mail) : null;
        if ($mail === '') {
            $mail = null;
        }

        if ($mail !== null && $mailBestaetigt) {
            $vorhanden = self::nachMail($mail);
            if ($vorhanden) {
                if (!empty($vorhanden['gesperrt'])) {
                    Antwort::fehler('Dieses Konto ist gesperrt. Melde dich bei uns, wenn das ein Irrtum ist.', 403);
                }
                $felder = ['gesehen' => time()];
                if (empty($vorhanden['mail_bestaetigt'])) {
                    $felder['mail_bestaetigt'] = 1;
                }
                if ($name !== '' && ($vorhanden['name'] ?? '') === '') {
                    $felder['name'] = mb_substr($name, 0, 120);
                }
                self::aendern((int) $vorhanden['id'], $felder);
                return self::nachId((int) $vorhanden['id']);
            }
        }

        $jetzt = time();
        $kennung = 'k-' . zufall_text(9);
        Db::fuehre(
            'INSERT INTO tt_konto (kennung, mail, mail_bestaetigt, name, anbieter, stufe, angelegt, gesehen)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [
                $kennung,
                $mailBestaetigt ? $mail : null,
                $mailBestaetigt && $mail !== null ? 1 : 0,
                mb_substr($name, 0, 120),
                $anbieter,
                0,
                $jetzt,
                $jetzt,
            ]
        );
        $id = Db::letzteId();
        self::stufeNeu($id);
        return self::nachId($id);
    }

    /** @param array<string,mixed> $felder */
    public static function aendern(int $id, array $felder): void
    {
        if (!$felder) {
            return;
        }
        $erlaubt = ['mail', 'mail_bestaetigt', 'name', 'anbieter', 'stufe', 'gesperrt', 'gesehen'];
        $teile = [];
        $werte = [];
        foreach ($felder as $sp => $w) {
            if (!in_array($sp, $erlaubt, true)) {
                continue;
            }
            $teile[] = $sp . ' = ?';
            $werte[] = $w;
        }
        if (!$teile) {
            return;
        }
        $werte[] = $id;
        Db::fuehre('UPDATE tt_konto SET ' . implode(', ', $teile) . ' WHERE id = ?', $werte);
    }

    /** Rechnet die Stufe neu und schreibt sie fort. */
    public static function stufeNeu(int $id): int
    {
        $k = self::nachId($id);
        if (!$k) {
            return 0;
        }
        $k['hat_passkey'] = (int) Db::wert('SELECT COUNT(*) FROM tt_passkey WHERE konto_id = ?', [$id]) > 0;
        if (($k['anbieter'] ?? 'mail') === 'mail') {
            $fremd = (int) Db::wert('SELECT COUNT(*) FROM tt_fremd WHERE konto_id = ?', [$id]);
            if ($fremd > 0) {
                $k['anbieter'] = 'fremd';
            }
        }
        $st = self::stufe($k);
        self::aendern($id, ['stufe' => $st]);
        return $st;
    }

    public static function fremdVerknuepfen(int $kontoId, string $anbieter, string $fremdId, string $mail): void
    {
        $da = Db::zeile('SELECT id, konto_id FROM tt_fremd WHERE anbieter = ? AND fremd_id = ?', [$anbieter, $fremdId]);
        if ($da) {
            if ((int) $da['konto_id'] !== $kontoId) {
                /* Dieselbe Google-Kennung an zwei Konten wäre ein Fehler
                   im Datenbestand, kein normaler Fall. Umhängen statt
                   doppelt führen. */
                Db::fuehre('UPDATE tt_fremd SET konto_id = ?, mail = ? WHERE id = ?', [$kontoId, $mail, $da['id']]);
            }
            return;
        }
        Db::fuehre(
            'INSERT INTO tt_fremd (konto_id, anbieter, fremd_id, mail, angelegt) VALUES (?, ?, ?, ?, ?)',
            [$kontoId, $anbieter, $fremdId, mb_substr($mail, 0, 254), time()]
        );
    }

    /**
     * Art. 17 DSGVO – und zwar wirklich, nicht als Häkchen „gelöscht“.
     * Alles, was zu diesem Konto gehört, verschwindet: Sitzungen,
     * Passkeys, verknüpfte Fremdkonten, laufende Vorgänge.
     */
    /**
     * Ein Konto vollständig löschen – Art. 17 DSGVO.
     *
     * Das war lange zu kurz gesprungen: Gelöscht wurden Sitzungen,
     * Passkeys und die Verknüpfungen zu Google und Microsoft. Stehen
     * blieben die Inserate – mit Namen darauf –, die Suchaufträge, die
     * Gruppenmitgliedschaften und alles, was jemand für sich abgelegt
     * hatte. Wer sein Konto löschte, hatte danach immer noch eine
     * Wohnung im Angebot, an die niemand mehr herankam.
     *
     * Jetzt geht alles mit. Drei Dinge verdienen eine Erklärung:
     *
     * ANFRAGEN bleiben bestehen, aber ohne Namen, Adresse und
     * Telefonnummer. Sie gehören zwei Seiten: Ein Verlauf, der
     * verschwindet, weil die Gegenseite aufräumt, ist keiner. Was daran
     * eine Person erkennbar macht, verschwindet trotzdem – bleiben darf
     * der Text, den die Gegenseite ohnehin gelesen hat.
     *
     * GRUPPEN verlieren das Mitglied. Ist es die gründende Person,
     * löst sich die Gruppe auf: Ohne sie entscheidet niemand mehr über
     * Aufnahmen, und eine Gruppe, in die niemand mehr hineinkommt, ist
     * eine Sackgasse für alle Übrigen.
     *
     * DER TRESOR verschwindet vollständig, samt Freigaben. Ein Verweis,
     * der nach dem Löschen noch Gehaltsabrechnungen öffnet, wäre das
     * Gegenteil dessen, wofür er da ist.
     */
    public static function loeschen(int $id): void
    {
        $k = self::nachId($id);

        /* Inserate mit Bildern, Bilddateien und Terminen. */
        foreach (Db::zeilen('SELECT id FROM tt_inserat WHERE konto_id = ?', [$id]) as $z) {
            Inserat::hartLoeschen((int) $z['id']);
        }

        /* Gruppen: erst die eigenen auflösen, dann austreten. */
        foreach (Db::zeilen('SELECT id FROM tt_gruppe WHERE gruender_id = ?', [$id]) as $z) {
            Db::fuehre('DELETE FROM tt_gruppe_person WHERE gruppe_id = ?', [(int) $z['id']]);
            Db::fuehre('DELETE FROM tt_gruppe WHERE id = ?', [(int) $z['id']]);
        }
        Db::fuehre('DELETE FROM tt_gruppe_person WHERE konto_id = ?', [$id]);

        /* Anfragen: Der Text bleibt, die Person verschwindet daraus. */
        Db::fuehre(
            "UPDATE tt_anfrage SET name = '', mail = '', telefon = '', eckdaten = '{}', von_konto_id = 0
              WHERE von_konto_id = ?",
            [$id]
        );
        Db::fuehre('UPDATE tt_anfrage SET an_konto_id = 0 WHERE an_konto_id = ?', [$id]);

        Db::fuehre('DELETE FROM tt_auftrag WHERE konto_id = ?', [$id]);
        Db::fuehre('DELETE FROM tt_buchung WHERE konto_id = ?', [$id]);
        Db::fuehre('DELETE FROM tt_ablage WHERE konto_id = ?', [$id]);
        Db::fuehre('DELETE FROM tt_tresor WHERE konto_id = ?', [$id]);
        Db::fuehre('DELETE FROM tt_freigabe WHERE konto_id = ?', [$id]);

        Db::fuehre('DELETE FROM tt_sitzung WHERE konto_id = ?', [$id]);
        Db::fuehre('DELETE FROM tt_passkey WHERE konto_id = ?', [$id]);
        Db::fuehre('DELETE FROM tt_fremd WHERE konto_id = ?', [$id]);
        if ($k && !empty($k['mail'])) {
            Db::fuehre('DELETE FROM tt_vorgang WHERE bezug = ?', [$k['mail']]);
        }
        Db::fuehre('DELETE FROM tt_konto WHERE id = ?', [$id]);
    }

    /**
     * Die Fassung, die an den Browser geht. Interne Schlüssel bleiben
     * hier: Die Zeilennummer der Datenbank verrät, wie viele Konten es
     * gibt, und geht niemanden etwas an.
     */
    public static function nachAussen(array $k): array
    {
        $id = (int) $k['id'];
        $passkeys = Db::zeilen(
            'SELECT cred_id, geraet, angelegt, gesehen FROM tt_passkey WHERE konto_id = ? ORDER BY angelegt',
            [$id]
        );
        $fremd = Db::zeilen('SELECT anbieter, mail, angelegt FROM tt_fremd WHERE konto_id = ? ORDER BY angelegt', [$id]);

        return [
            'id'             => $k['kennung'],
            'mail'           => $k['mail'] ?? '',
            'mailBestaetigt' => (bool) $k['mail_bestaetigt'],
            'name'           => $k['name'] ?? '',
            'anbieter'       => $k['anbieter'] ?? 'mail',
            'stufe'          => (int) $k['stufe'],
            'angelegt'       => gmdate('Y-m-d', (int) $k['angelegt']),
            'letzteAnmeldung' => gmdate('c', (int) $k['gesehen']),
            'passkeys'       => array_map(static fn ($p) => [
                'id'       => $p['cred_id'],
                'geraet'   => $p['geraet'],
                'angelegt' => gmdate('Y-m-d', (int) $p['angelegt']),
                'gesehen'  => gmdate('Y-m-d', (int) $p['gesehen']),
            ], $passkeys),
            'verknuepft'     => array_map(static fn ($f) => [
                'anbieter' => $f['anbieter'],
                'mail'     => $f['mail'],
            ], $fremd),
            'serverKonto'    => true,
        ];
    }
}
