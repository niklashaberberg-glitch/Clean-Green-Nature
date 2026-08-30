<?php
/* =====================================================================
   Was jemand für sich festhält

   Profil, Merkliste, Bewerbungstafel, Notizen, Suchaufträge, Umzugsplan,
   Übergabeprotokoll, die Werte in den Rechnern. Das lag bisher
   ausschließlich im Speicher des Browsers, und dafür gab es einen guten
   Grund: Es geht niemanden etwas an.

   Der Grund trägt nur nicht weit genug. Wer die Wohnungssuche am
   Rechner beginnt und abends im Bus weitersucht, findet auf dem Telefon
   nichts wieder – kein Profil, keine Merkliste, keinen Stand seiner
   Bewerbungen. Und wer die Browserdaten löscht, verliert alles. Für
   eine Vorführung ist das hinnehmbar. Für einen Dienst, mit dem jemand
   wirklich eine Wohnung sucht, ist es der Grund, warum er ihn nicht
   benutzt.

   Deshalb liegt es jetzt auch hier, mit drei Regeln:

   ERSTENS ist der Server Schrank und nicht Buchhalter. Er nimmt JSON
   entgegen, gibt es zurück und wertet nichts davon aus. Keine Suche
   über Profile, keine Auswertung, keine Statistik. Was gerechnet wird,
   rechnet weiterhin der Browser.

   ZWEITENS ein Feld je Zeile. Der Browser schreibt nach einer Änderung
   nur das Feld zurück, das sich geändert hat. Läge alles in einem
   Klumpen, überschriebe das Telefon beim Merken einer Wohnung das
   Profil, das am Rechner gerade bearbeitet wird.

   DRITTENS bleibt der Browser die Wahrheit für den laufenden Besuch.
   Der Server ist die Kopie, die den Gerätewechsel überlebt. Fällt er
   aus, arbeitet die Anwendung weiter – nur eben ohne Abgleich.

   Nicht hierher gehört der Dokumententresor: Der hat seine eigene
   Tabelle, weil dort Chiffrat liegt und nicht JSON.
   ===================================================================== */

final class Ablage
{
    /** Welche Felder es gibt. Eine geschlossene Liste, kein freier
        Schlüsselraum – sonst wird aus dem Schrank ein Datenlager, in
        das jeder alles schieben kann, was er möchte. */
    private const FELDER = [
        'profil', 'merkliste', 'vergleich', 'agenten', 'threads', 'gesehen',
        'filter', 'einstellungen', 'umzug', 'protokoll', 'werkzeuge',
        'meinTausch', 'hinweise', 'eigeneInserate',
        /* Der Kopf des Tresors: Salz, Rundenzahl und die Probe, an der
           der Browser merkt, ob das Kennwort stimmt. Nichts davon ist
           geheim – das Salz ist bei PBKDF2 öffentlich, die Probe ist
           Chiffrat. Ohne diesen Eintrag ließe sich der Tresor auf einem
           zweiten Gerät nicht öffnen, weil das Salz fehlte. */
        'tresorMeta',
    ];

    /** Je Feld. Ein Profil ist ein paar Kilobyte; wer mehr schickt,
        verwechselt die Ablage mit einem Dateispeicher. */
    private const MAX_FELD = 256 * 1024;

    /** Über alles zusammen. Bei zwanzig Feldern wäre die Obergrenze
        sonst fünf Megabyte je Konto – das trägt kein Webhosting-Paket
        mit tausend Konten. */
    private const MAX_GESAMT = 1024 * 1024;

    public static function kennt(string $feld): bool
    {
        return in_array($feld, self::FELDER, true);
    }

    /** Alles, was zu einem Konto abgelegt ist. */
    public static function alles(int $kontoId): array
    {
        $raus = [];
        foreach (Db::zeilen('SELECT feld, wert, geaendert FROM tt_ablage WHERE konto_id = ?', [$kontoId]) as $z) {
            $wert = json_decode((string) $z['wert'], true);
            /* Kaputtes JSON ist kein Grund, die ganze Ablage zu
               verweigern – dann käme jemand nie wieder an sein Profil.
               Das eine Feld fehlt, der Rest kommt. */
            if ($wert === null && trim((string) $z['wert']) !== 'null') {
                continue;
            }
            $raus[(string) $z['feld']] = $wert;
        }
        return $raus;
    }

    public static function belegt(int $kontoId): int
    {
        return (int) Db::wert('SELECT COALESCE(SUM(LENGTH(wert)), 0) FROM tt_ablage WHERE konto_id = ?', [$kontoId]);
    }

    /**
     * Felder schreiben. Erwartet eine Abbildung Feldname → Wert; ein
     * Wert von null löscht das Feld.
     *
     * @param array<string,mixed> $felder
     * @return array{gesetzt:string[], geloescht:string[], belegt:int}
     */
    public static function setzen(int $kontoId, array $felder): array
    {
        if (!$felder) {
            Antwort::fehler('Es wurde nichts übergeben.', 400);
        }
        if (count($felder) > 40) {
            Antwort::fehler('Zu viele Felder auf einmal.', 400);
        }

        $jetzt = time();
        $gesetzt = [];
        $geloescht = [];

        /* Erst alles prüfen, dann alles schreiben. Ein Aufruf, der beim
           siebten Feld abbricht, hinterlässt sonst einen Stand, den
           weder Browser noch Server kennen. */
        $vorbereitet = [];
        foreach ($felder as $feld => $wert) {
            $feld = (string) $feld;
            if (!self::kennt($feld)) {
                Antwort::fehler('Unbekanntes Feld: ' . substr($feld, 0, 40), 400, ['feld' => $feld]);
            }
            if ($wert === null) {
                $geloescht[] = $feld;
                continue;
            }
            $json = json_encode($wert, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            if ($json === false) {
                Antwort::fehler('Das Feld ' . $feld . ' ließ sich nicht ablegen.', 400, ['feld' => $feld]);
            }
            if (strlen($json) > self::MAX_FELD) {
                Antwort::fehler(
                    'Das Feld ' . $feld . ' ist zu groß (' . round(strlen($json) / 1024) . ' kB, '
                    . 'erlaubt sind ' . round(self::MAX_FELD / 1024) . ' kB).',
                    413,
                    ['feld' => $feld]
                );
            }
            $vorbereitet[$feld] = $json;
        }

        /* Die Gesamtgrenze gegen den Stand nach dem Schreiben prüfen,
           nicht gegen den davor – sonst ließe sie sich in kleinen
           Schritten beliebig überschreiten. */
        $alt = [];
        foreach (Db::zeilen('SELECT feld, LENGTH(wert) AS n FROM tt_ablage WHERE konto_id = ?', [$kontoId]) as $z) {
            $alt[(string) $z['feld']] = (int) $z['n'];
        }
        foreach ($geloescht as $feld) {
            unset($alt[$feld]);
        }
        foreach ($vorbereitet as $feld => $json) {
            $alt[$feld] = strlen($json);
        }
        $summe = array_sum($alt);
        if ($summe > self::MAX_GESAMT) {
            Antwort::fehler(
                'Deine Ablage ist voll (' . round($summe / 1024) . ' kB von '
                . round(self::MAX_GESAMT / 1024) . ' kB). Räum die Merkliste auf oder lösche alte Suchaufträge.',
                413
            );
        }

        foreach ($geloescht as $feld) {
            Db::fuehre('DELETE FROM tt_ablage WHERE konto_id = ? AND feld = ?', [$kontoId, $feld]);
        }
        foreach ($vorbereitet as $feld => $json) {
            $da = Db::wert('SELECT 1 FROM tt_ablage WHERE konto_id = ? AND feld = ?', [$kontoId, $feld]);
            if ($da) {
                Db::fuehre(
                    'UPDATE tt_ablage SET wert = ?, geaendert = ? WHERE konto_id = ? AND feld = ?',
                    [$json, $jetzt, $kontoId, $feld]
                );
            } else {
                Db::fuehre(
                    'INSERT INTO tt_ablage (konto_id, feld, wert, geaendert) VALUES (?, ?, ?, ?)',
                    [$kontoId, $feld, $json, $jetzt]
                );
            }
            $gesetzt[] = $feld;
        }

        return ['gesetzt' => $gesetzt, 'geloescht' => $geloescht, 'belegt' => $summe];
    }

    /** Art. 17 DSGVO: Mit dem Konto verschwindet auch die Ablage. */
    public static function leeren(int $kontoId): void
    {
        Db::fuehre('DELETE FROM tt_ablage WHERE konto_id = ?', [$kontoId]);
    }
}
