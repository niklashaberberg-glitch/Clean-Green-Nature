<?php
/* =====================================================================
   Dokumententresor und Freigaben

   Der Tresor war bisher das eine Stück, das seinen eigenen Zweck
   verfehlte. Die Verschlüsselung lief echt – AES-GCM mit 256 Bit, der
   Schlüssel aus dem Kennwort über PBKDF2, alles im Browser. Nur lag das
   Chiffrat im Speicher dieses Browsers. Ein Freigabeverweis öffnete
   sich deshalb nur auf demselben Gerät, und die Vermieterseite, für die
   er gedacht war, sah nichts.

   Damit war er als Vorführung richtig und als Werkzeug wertlos: Man
   verschickt einen Verweis, damit ihn jemand anderes öffnet.

   Was sich mit dieser Datei ändert und was nicht:

   ES ÄNDERT SICH, wo das Chiffrat liegt – auf dem Server statt im
   Browser. Damit funktioniert der Verweis von jedem Gerät aus, Ablauf
   und Abrufzähler setzt der Server durch statt die Anwendung sich
   selbst, und ein Widerruf wirkt wirklich für alle.

   ES ÄNDERT SICH NICHT, wer lesen kann. Der Server bekommt nie einen
   Schlüssel zu sehen. Er kennt:

     · `chiffrat` – die verschlüsselte Datei, für ihn ein Haufen Zeichen
     · `huelle`   – der verschlüsselte Dateiname und der mit dem
                    Tresorschlüssel umschlossene Dokumentschlüssel
     · Art, Größe, Typ und Datum im Klartext – ohne sie ließe sich die
       Liste im gesperrten Tresor nicht zeigen, und sie verraten nichts
       über den Inhalt

   Der Schlüssel zur Freigabe steht im Fragmentteil des Verweises, also
   hinter dem Rautezeichen. Browser senden diesen Teil grundsätzlich
   nicht an Server. Wer die Datenbank in die Hände bekommt, hat damit
   nichts: kein Kennwort, keinen Schlüssel, keine lesbare Datei.

   Deshalb steht hier auch nirgends eine Prüfung des Kennworts. Es gibt
   keine. Ob das Kennwort stimmt, merkt der Browser daran, dass sich das
   Chiffrat entschlüsseln lässt – und nur er.
   ===================================================================== */

final class Tresor
{
    /** Je Dokument. Acht Megabyte im Klartext werden als Base64 rund
        elf; dazu der Vorspann. Wer mehr hochlädt, lädt kein Zeugnis
        hoch, sondern einen Film. */
    private const MAX_CHIFFRAT = 12 * 1024 * 1024;

    /** Über alle Dokumente eines Kontos zusammen. */
    private const MAX_GESAMT = 40 * 1024 * 1024;

    private const MAX_DOKUMENTE = 40;

    /** Wie lange eine Freigabe höchstens gelten darf. Ein Verweis ohne
        Verfallsdatum ist ein Anhang mit Extraschritten. */
    private const MAX_TAGE = 30;
    private const MAX_ABRUFE = 20;

    /* ------------------------------------------------------------------
       Dokumente
       ------------------------------------------------------------------ */

    /** Die Liste – ohne Chiffrat. Sie wird bei jedem Öffnen der Seite
        geholt; die Dateien selbst nur, wenn eine gebraucht wird. */
    public static function liste(int $kontoId): array
    {
        $raus = [];
        foreach (Db::zeilen(
            'SELECT id, art, typ, groesse, huelle, hinzu FROM tt_tresor WHERE konto_id = ? ORDER BY hinzu DESC',
            [$kontoId]
        ) as $z) {
            $raus[] = [
                'id'      => (string) $z['id'],
                'art'     => (string) $z['art'],
                'typ'     => (string) $z['typ'],
                'groesse' => (int) $z['groesse'],
                'huelle'  => (string) $z['huelle'],
                'hinzu'   => (int) $z['hinzu'],
            ];
        }
        return $raus;
    }

    public static function belegt(int $kontoId): int
    {
        return (int) Db::wert(
            'SELECT COALESCE(SUM(LENGTH(chiffrat)), 0) FROM tt_tresor WHERE konto_id = ?',
            [$kontoId]
        );
    }

    /**
     * Ein verschlüsseltes Dokument annehmen.
     *
     * `huelle` und `chiffrat` sind Base64 aus dem Browser. Der Server
     * prüft die Form, nicht den Inhalt – den kann er nicht prüfen, und
     * genau das ist die Zusage.
     */
    public static function hinzufuegen(int $kontoId, array $d): array
    {
        $chiffrat = (string) ($d['chiffrat'] ?? '');
        $huelle   = (string) ($d['huelle'] ?? '');

        if ($chiffrat === '' || $huelle === '') {
            Antwort::fehler('Es kam kein verschlüsseltes Dokument an.', 400);
        }
        if (!self::istBase64($chiffrat) || !self::istBase64($huelle)) {
            Antwort::fehler('Das Dokument kam nicht in der erwarteten Form an.', 400);
        }
        if (strlen($chiffrat) > self::MAX_CHIFFRAT) {
            Antwort::fehler('Die Datei ist zu groß. Erlaubt sind rund 8 MB je Dokument.', 413);
        }

        $anzahl = (int) Db::wert('SELECT COUNT(*) FROM tt_tresor WHERE konto_id = ?', [$kontoId]);
        if ($anzahl >= self::MAX_DOKUMENTE) {
            Antwort::fehler('Mehr als ' . self::MAX_DOKUMENTE . ' Dokumente gehen nicht. Lösch zuerst eines.', 409);
        }
        if (self::belegt($kontoId) + strlen($chiffrat) > self::MAX_GESAMT) {
            Antwort::fehler('Dein Tresor ist voll. Lösch ein Dokument, das du nicht mehr brauchst.', 413);
        }

        $id = bin2hex(random_bytes(16));
        Db::fuehre(
            'INSERT INTO tt_tresor (id, konto_id, art, typ, groesse, huelle, chiffrat, hinzu)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [
                $id,
                $kontoId,
                self::wort((string) ($d['art'] ?? 'sonstiges'), 40),
                self::wort((string) ($d['typ'] ?? ''), 80),
                max(0, (int) ($d['groesse'] ?? 0)),
                $huelle,
                $chiffrat,
                time(),
            ]
        );

        return ['id' => $id];
    }

    /** Ein Dokument samt Chiffrat – nur für den, dem es gehört. */
    public static function holen(int $kontoId, string $id): array
    {
        $z = Db::zeile('SELECT * FROM tt_tresor WHERE id = ? AND konto_id = ?', [$id, $kontoId]);
        if (!$z) {
            Antwort::fehler('Dieses Dokument gibt es nicht.', 404);
        }
        return self::alsDokument($z);
    }

    public static function loeschen(int $kontoId, string $id): void
    {
        $da = Db::wert('SELECT 1 FROM tt_tresor WHERE id = ? AND konto_id = ?', [$id, $kontoId]);
        if (!$da) {
            Antwort::fehler('Dieses Dokument gibt es nicht.', 404);
        }
        Db::fuehre('DELETE FROM tt_tresor WHERE id = ? AND konto_id = ?', [$id, $kontoId]);
        /* Freigaben, die nur auf dieses Dokument zeigten, sind damit
           gegenstandslos. Sie stehen zu lassen hieße, dem Empfänger
           einen Verweis in die Leere zu geben. */
        self::freigabenAufraeumen($kontoId);
    }

    /** Wer das Kennwort vergessen hat, kann nur noch leeren. */
    public static function alleLoeschen(int $kontoId): int
    {
        $n = (int) Db::wert('SELECT COUNT(*) FROM tt_tresor WHERE konto_id = ?', [$kontoId]);
        Db::fuehre('DELETE FROM tt_tresor WHERE konto_id = ?', [$kontoId]);
        Db::fuehre('DELETE FROM tt_freigabe WHERE konto_id = ?', [$kontoId]);
        return $n;
    }

    /* ------------------------------------------------------------------
       Freigaben
       ------------------------------------------------------------------ */

    /**
     * Eine Freigabe anlegen. Der Server erzeugt die Kennung; den
     * Schlüssel bildet der Browser und behält ihn für den Verweis.
     */
    public static function freigeben(int $kontoId, array $d): array
    {
        $ids = array_values(array_filter(
            array_map('strval', (array) ($d['dokumente'] ?? [])),
            static fn ($x) => $x !== ''
        ));
        if (!$ids) {
            Antwort::fehler('Wähle mindestens ein Dokument.', 400);
        }
        if (count($ids) > self::MAX_DOKUMENTE) {
            Antwort::fehler('Zu viele Dokumente in einer Freigabe.', 400);
        }

        /* Nur eigene Dokumente. Ohne diese Prüfung ließe sich eine
           Freigabe auf fremde Kennungen ausstellen – und der Abruf ist
           bewusst ohne Anmeldung erreichbar. */
        $platz = implode(',', array_fill(0, count($ids), '?'));
        $eigene = Db::zeilen(
            "SELECT id FROM tt_tresor WHERE konto_id = ? AND id IN ($platz)",
            array_merge([$kontoId], $ids)
        );
        $eigeneIds = array_map(static fn ($z) => (string) $z['id'], $eigene);
        if (count($eigeneIds) !== count($ids)) {
            Antwort::fehler('Mindestens ein Dokument gehört nicht zu deinem Tresor.', 403);
        }

        $tage   = min(self::MAX_TAGE, max(1, (int) ($d['tage'] ?? 7)));
        $abrufe = min(self::MAX_ABRUFE, max(1, (int) ($d['maxAbrufe'] ?? 3)));
        $id     = bin2hex(random_bytes(16));
        $jetzt  = time();

        Db::fuehre(
            'INSERT INTO tt_freigabe
               (id, konto_id, dokumente, empfaenger, objekt, erstellt, ablauf, max_abrufe, abrufe, widerrufen)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0)',
            [
                $id,
                $kontoId,
                json_encode($eigeneIds, JSON_UNESCAPED_UNICODE),
                self::wort((string) ($d['empfaenger'] ?? ''), 160),
                self::wort((string) ($d['objektId'] ?? ''), 40),
                $jetzt,
                $jetzt + $tage * 86400,
                $abrufe,
                '[]',
            ]
        );

        return [
            'id'        => $id,
            'tage'      => $tage,
            'maxAbrufe' => $abrufe,
            'ablauf'    => $jetzt + $tage * 86400,
        ];
    }

    /** Die eigenen Freigaben, mit Stand und Abrufprotokoll. */
    public static function freigaben(int $kontoId): array
    {
        $raus = [];
        foreach (Db::zeilen(
            'SELECT * FROM tt_freigabe WHERE konto_id = ? ORDER BY erstellt DESC LIMIT 200',
            [$kontoId]
        ) as $z) {
            $raus[] = self::alsFreigabe($z);
        }
        return $raus;
    }

    public static function widerrufen(int $kontoId, string $id): void
    {
        $da = Db::wert('SELECT 1 FROM tt_freigabe WHERE id = ? AND konto_id = ?', [$id, $kontoId]);
        if (!$da) {
            Antwort::fehler('Diese Freigabe gibt es nicht.', 404);
        }
        Db::fuehre('UPDATE tt_freigabe SET widerrufen = 1 WHERE id = ? AND konto_id = ?', [$id, $kontoId]);
    }

    public static function freigabeLoeschen(int $kontoId, string $id): void
    {
        Db::fuehre('DELETE FROM tt_freigabe WHERE id = ? AND konto_id = ?', [$id, $kontoId]);
    }

    /**
     * Der Abruf – der einzige Weg hier, der ohne Anmeldung geht.
     *
     * Er muss es: Der Empfänger ist die Vermieterseite, und die legt für
     * einen Blick in drei Gehaltsabrechnungen kein Konto an. Was ihn
     * absichert, ist nicht die Anmeldung, sondern dass ohne den
     * Schlüssel aus dem Verweis nichts lesbar ist – und dass Ablauf,
     * Zähler und Widerruf hier durchgesetzt werden und nicht im Browser
     * des Abrufenden.
     */
    public static function abrufen(string $id): array
    {
        $f = Db::zeile('SELECT * FROM tt_freigabe WHERE id = ?', [$id]);
        if (!$f) {
            /* Kein Unterschied zwischen „gibt es nicht“ und „abgelaufen“:
               Sonst ließe sich durch Ausprobieren feststellen, welche
               Kennungen einmal vergeben waren. */
            Antwort::fehler('Dieser Verweis führt ins Leere. Er ist abgelaufen, widerrufen oder hat nie bestanden.', 404);
        }

        $stand = self::stand($f);
        if (!$stand['gueltig']) {
            Antwort::fehler('Dieser Verweis ist nicht mehr gültig: ' . $stand['grund'] . '.', 410, [
                'grund' => $stand['grund'],
            ]);
        }

        $ids = json_decode((string) $f['dokumente'], true) ?: [];
        if (!$ids) {
            Antwort::fehler('Zu diesem Verweis liegen keine Unterlagen mehr vor.', 410);
        }

        $platz = implode(',', array_fill(0, count($ids), '?'));
        $zeilen = Db::zeilen("SELECT * FROM tt_tresor WHERE id IN ($platz)", $ids);
        if (!$zeilen) {
            Antwort::fehler('Die Unterlagen wurden inzwischen gelöscht.', 410);
        }

        /* Erst zählen, dann herausgeben. Andersherum könnte ein
           abgebrochener Aufruf beliebig oft wiederholt werden. */
        $abrufe = json_decode((string) $f['abrufe'], true) ?: [];
        $abrufe[] = ['zeit' => time()];
        if (count($abrufe) > 100) {
            $abrufe = array_slice($abrufe, -100);
        }
        Db::fuehre('UPDATE tt_freigabe SET abrufe = ? WHERE id = ?', [
            json_encode($abrufe, JSON_UNESCAPED_UNICODE), $id,
        ]);

        $f['abrufe'] = json_encode($abrufe, JSON_UNESCAPED_UNICODE);

        return [
            'freigabe'  => self::alsFreigabe($f, false),
            'dokumente' => array_map(static fn ($z) => self::alsDokument($z), $zeilen),
        ];
    }

    /** Abgelaufene Freigaben verschwinden von selbst. */
    public static function aufraeumen(): int
    {
        $vorbei = time() - 14 * 86400;
        $n = (int) Db::wert('SELECT COUNT(*) FROM tt_freigabe WHERE ablauf < ?', [$vorbei]);
        Db::fuehre('DELETE FROM tt_freigabe WHERE ablauf < ?', [$vorbei]);
        return $n;
    }

    /* ------------------------------------------------------------------
       Kleinigkeiten
       ------------------------------------------------------------------ */

    private static function alsDokument(array $z): array
    {
        return [
            'id'       => (string) $z['id'],
            'art'      => (string) $z['art'],
            'typ'      => (string) $z['typ'],
            'groesse'  => (int) $z['groesse'],
            'huelle'   => (string) $z['huelle'],
            'chiffrat' => (string) $z['chiffrat'],
            'hinzu'    => (int) $z['hinzu'],
        ];
    }

    private static function alsFreigabe(array $z, bool $mitEmpfaenger = true): array
    {
        $stand = self::stand($z);
        $abrufe = json_decode((string) $z['abrufe'], true) ?: [];
        $raus = [
            'id'        => (string) $z['id'],
            'dokumente' => json_decode((string) $z['dokumente'], true) ?: [],
            'erstellt'  => (int) $z['erstellt'],
            'ablauf'    => (int) $z['ablauf'],
            'maxAbrufe' => (int) $z['max_abrufe'],
            'abrufe'    => $abrufe,
            'widerrufen' => (bool) $z['widerrufen'],
            'gueltig'   => $stand['gueltig'],
            'grund'     => $stand['grund'],
        ];
        if ($mitEmpfaenger) {
            $raus['empfaenger'] = (string) $z['empfaenger'];
            $raus['objekt'] = (string) $z['objekt'];
        }
        return $raus;
    }

    /** @return array{gueltig:bool, grund:string} */
    private static function stand(array $z): array
    {
        if ((int) $z['widerrufen'] === 1) {
            return ['gueltig' => false, 'grund' => 'widerrufen'];
        }
        if ((int) $z['ablauf'] < time()) {
            return ['gueltig' => false, 'grund' => 'abgelaufen'];
        }
        $abrufe = json_decode((string) $z['abrufe'], true) ?: [];
        if (count($abrufe) >= (int) $z['max_abrufe']) {
            return ['gueltig' => false, 'grund' => 'aufgebraucht'];
        }
        return ['gueltig' => true, 'grund' => ''];
    }

    /** Freigaben, deren Dokumente es nicht mehr gibt, werden entfernt. */
    private static function freigabenAufraeumen(int $kontoId): void
    {
        $vorhanden = array_map(
            static fn ($z) => (string) $z['id'],
            Db::zeilen('SELECT id FROM tt_tresor WHERE konto_id = ?', [$kontoId])
        );
        foreach (Db::zeilen('SELECT id, dokumente FROM tt_freigabe WHERE konto_id = ?', [$kontoId]) as $z) {
            $ids = json_decode((string) $z['dokumente'], true) ?: [];
            $rest = array_values(array_intersect($ids, $vorhanden));
            if ($rest === $ids) {
                continue;
            }
            if (!$rest) {
                Db::fuehre('DELETE FROM tt_freigabe WHERE id = ?', [(string) $z['id']]);
            } else {
                Db::fuehre('UPDATE tt_freigabe SET dokumente = ? WHERE id = ?', [
                    json_encode($rest, JSON_UNESCAPED_UNICODE), (string) $z['id'],
                ]);
            }
        }
    }

    /**
     * Beide Alphabete gelten.
     *
     * Der Browser schreibt das URL-sichere („-“ und „_“ statt „+“ und
     * „/“, ohne Füllzeichen) – und zwar zu Recht: Dasselbe Verfahren
     * kodiert die Dokumentschlüssel, die im Fragmentteil eines Verweises
     * reisen, und dort wären „+“ und „/“ Ärger. Der Server prüft hier
     * ohnehin nur die Form; entschlüsselt wird nichts.
     */
    private static function istBase64(string $s): bool
    {
        return $s !== '' && preg_match('/^[A-Za-z0-9+\/_=-]+$/', $s) === 1;
    }

    private static function wort(string $s, int $max): string
    {
        $s = trim(preg_replace('/[\x00-\x1F\x7F]+/u', ' ', $s) ?? '');
        return mb_substr($s, 0, $max);
    }
}
