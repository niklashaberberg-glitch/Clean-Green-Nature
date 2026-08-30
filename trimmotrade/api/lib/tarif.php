<?php
/* =====================================================================
   Tarif: Plus und die Gründerplätze

   § 7 der Geschäftsbedingungen sagt: „Der Anbieter vergibt die ersten
   500 Plätze … Die Vergabe erfolgt in der Reihenfolge des Eingangs und
   endet, sobald das Kontingent erschöpft ist. Ein Gründerplatz wird je
   Person einmal vergeben.“

   Das war eine Zusage, die die Anwendung nicht halten konnte. Der
   Platz lag im Speicher des Browsers, die Zahl der vergebenen Plätze
   war eine Hochrechnung aus der Zeit seit dem Start – also geraten –,
   und wer die Browserdaten löschte, bekam einen zweiten. Auf dem
   Telefon hatte man gar keinen.

   Hier steht dasselbe noch einmal, nur zählbar: eine Nummer je Konto,
   fortlaufend, aus der Datenbank. Damit gilt, was in den AGB steht.

   Was hier bewusst nicht steht, ist die Bezahlung. Für ein
   Zahlungsverfahren braucht es einen Zahlungsdienstleister mit Vertrag,
   Konto und Zugangsdaten; ohne den ließe sich hier nur etwas
   nachbilden, und genau davon soll die Anwendung wegkommen. Solange
   keiner angeschlossen ist, gibt es Plus ausschließlich über einen
   Gründerplatz – und die Preisseite sagt das, statt einen Kaufknopf zu
   zeigen, hinter dem nichts liegt.
   ===================================================================== */

final class Tarif
{
    private static array $cfg = [];

    public static function start(array $cfg): void
    {
        self::$cfg = $cfg['zahlung'] ?? [];
    }

    /** So viele Plätze, so lange. Muss mit assets/plan.js
        übereinstimmen – der Browser zeigt die Zahlen, der Server
        vergibt sie. */
    public const PLAETZE = 10000;
    public const MONATE = 12;

    /** Wie viele Plätze schon weg sind. Eine Zahl, keine Schätzung. */
    public static function vergeben(): int
    {
        return (int) Db::wert('SELECT COUNT(*) FROM tt_konto WHERE gruender_nr > 0');
    }

    public static function frei(): int
    {
        return max(0, self::PLAETZE - self::vergeben());
    }

    /** Der Tarifstand eines Kontos – geht bei jedem Aufruf mit hinaus. */
    public static function stand(?array $konto): array
    {
        $jetzt = time();
        if (!$konto) {
            return [
                'plus'      => false,
                'quelle'    => '',
                'frei'      => self::frei(),
                'plaetze'   => self::PLAETZE,
                'monate'    => self::MONATE,
                'zahlbar'   => self::zahlbar(),
            ];
        }

        $nr  = (int) ($konto['gruender_nr'] ?? 0);
        $bis = (int) ($konto['gruender_bis'] ?? 0);
        $plusBis = (int) ($konto['plus_bis'] ?? 0);

        $gruenderLaeuft = $nr > 0 && $bis > $jetzt;
        $bezahltLaeuft  = $plusBis > $jetzt;

        return [
            'plus'    => $gruenderLaeuft || $bezahltLaeuft,
            /* Wer beides hat, hat es bezahlt – der Gründerplatz endet
               dann trotzdem von selbst und verlängert nichts. */
            'quelle'  => $bezahltLaeuft ? 'bezahlt' : ($gruenderLaeuft ? 'gruender' : ''),
            'bis'     => $bezahltLaeuft ? $plusBis : ($gruenderLaeuft ? $bis : 0),
            'gruender' => $nr > 0 ? ['nummer' => $nr, 'bis' => $bis, 'aktiv' => $gruenderLaeuft] : null,
            'frei'    => self::frei(),
            'plaetze' => self::PLAETZE,
            'monate'  => self::MONATE,
            'zahlbar' => self::zahlbar(),
        ];
    }

    /**
     * Einen Gründerplatz nehmen.
     *
     * Die Nummer entsteht aus der Zahl der schon vergebenen Plätze. Zwei
     * Anmeldungen im selben Moment könnten dieselbe Nummer bekommen;
     * dagegen steht die Prüfung nach dem Schreiben, die den zweiten
     * zurückstuft und es noch einmal versuchen lässt. Ein Sperrmechanismus
     * über beide Datenbanken hinweg wäre hier mehr Aufwand als Nutzen –
     * es geht um eine Nummer, nicht um eine Buchung.
     */
    public static function gruenderSichern(array $konto): array
    {
        $kontoId = (int) $konto['id'];

        $vorhanden = (int) Db::wert('SELECT gruender_nr FROM tt_konto WHERE id = ?', [$kontoId]);
        if ($vorhanden > 0) {
            Antwort::fehler('Du hast schon einen Gründerplatz.', 409, ['nummer' => $vorhanden]);
        }

        /* Wer noch nicht bestätigt hat, dass er die Adresse abrufen
           kann, bekommt keinen. Sonst wäre das Kontingent an einem
           Nachmittag mit erfundenen Adressen leer. */
        if ((int) ($konto['stufe'] ?? 0) < 1) {
            Antwort::fehler(
                'Für einen Gründerplatz braucht es eine bestätigte E-Mail-Adresse – '
                . 'sonst wäre das Kontingent in einer Stunde leer.',
                403
            );
        }

        for ($versuch = 0; $versuch < 5; $versuch++) {
            $vergeben = self::vergeben();
            if ($vergeben >= self::PLAETZE) {
                Antwort::fehler('Alle ' . self::PLAETZE . ' Plätze sind vergeben.', 409, ['frei' => 0]);
            }
            $nummer = $vergeben + 1;
            $bis = time() + self::MONATE * 30 * 86400;

            Db::fuehre(
                'UPDATE tt_konto SET gruender_nr = ?, gruender_bis = ? WHERE id = ? AND gruender_nr = 0',
                [$nummer, $bis, $kontoId]
            );

            /* Hat jemand anderes dieselbe Nummer bekommen, wird sie
               freigegeben und der nächste Anlauf nimmt die folgende. */
            $doppelt = (int) Db::wert(
                'SELECT COUNT(*) FROM tt_konto WHERE gruender_nr = ?',
                [$nummer]
            );
            if ($doppelt <= 1) {
                $meine = (int) Db::wert('SELECT gruender_nr FROM tt_konto WHERE id = ?', [$kontoId]);
                if ($meine === $nummer) {
                    return ['nummer' => $nummer, 'bis' => $bis, 'frei' => self::frei()];
                }
                Antwort::fehler('Der Platz ließ sich nicht eintragen. Versuch es noch einmal.', 500);
            }
            Db::fuehre('UPDATE tt_konto SET gruender_nr = 0, gruender_bis = 0 WHERE id = ?', [$kontoId]);
            usleep(random_int(20000, 90000));
        }

        Antwort::fehler('Gerade greifen zu viele gleichzeitig zu. Versuch es in einem Moment noch einmal.', 503);
    }

    /**
     * Einen Gründerplatz zurückgeben.
     *
     * Die Nummer wird nicht neu vergeben – sonst hätten zwei Menschen
     * nacheinander „Platz 37“, und die Zusage „einer je Person“ ließe
     * sich nicht mehr belegen. Frei wird der Platz trotzdem: `vergeben()`
     * zählt die belegten, nicht die höchste Nummer.
     */
    public static function gruenderAufgeben(array $konto): array
    {
        Db::fuehre(
            'UPDATE tt_konto SET gruender_nr = 0, gruender_bis = 0 WHERE id = ?',
            [(int) $konto['id']]
        );
        return ['frei' => self::frei()];
    }

    /**
     * Ob ein Zahlungsweg eingerichtet ist.
     *
     * Solange nicht, zeigt die Preisseite keinen Kaufknopf. Ein Knopf,
     * der zu einer Fehlermeldung führt, ist schlimmer als keiner – und
     * ein Knopf, der so tut, als hätte er etwas abgebucht, wäre nach
     * § 312j BGB nicht einmal zulässig.
     */
    public static function zahlbar(): bool
    {
        return !empty(self::$cfg['anbieter']) && !empty(self::$cfg['schluessel']);
    }

    /** Abgelaufene Gründerjahre schließen – für die Selbstprüfung. */
    public static function abgelaufen(): int
    {
        return (int) Db::wert(
            'SELECT COUNT(*) FROM tt_konto WHERE gruender_nr > 0 AND gruender_bis > 0 AND gruender_bis < ?',
            [time()]
        );
    }
}
