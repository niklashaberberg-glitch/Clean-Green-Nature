<?php
/* =====================================================================
   Zählen, ohne jemanden zu zählen

   Ein Geschäft, das seinen Trichter nicht kennt, rät. Wie viele sehen
   die Suche, wie viele legen ein Konto an, wie viele schreiben jemanden
   an, wie viele inserieren – ohne diese vier Zahlen ist jede Änderung
   an der Anwendung eine Meinung.

   Die übliche Antwort darauf ist ein Messdienst, ein Cookie-Banner und
   ein Auftragsverarbeitungsvertrag mit einem Unternehmen in Kalifornien.
   Die Antwort hier ist eine Tabelle mit drei Spalten:

       tag | name | wert

   Mehr wird nicht gespeichert. Keine Kennung, keine IP-Adresse, keine
   Sitzung, keine Reihenfolge, kein Verlauf. Aus „am 3. März 412 Suchen“
   lässt sich niemand herauslesen – es ist kein personenbezogenes Datum
   im Sinne des Art. 4 Nr. 1 DSGVO, und weil auf dem Gerät nichts abgelegt
   wird, stellt sich die Frage nach § 25 TDDDG gar nicht erst. Kein
   Banner, keine Einwilligung, keine Auftragsverarbeitung.

   Was damit nicht geht: einzelne Wege nachverfolgen, Kohorten bilden,
   wiederkehrende Besucher erkennen. Das ist der Preis. Er ist niedrig:
   Für die Frage „wirkt die Änderung?“ genügen Tagessummen.
   ===================================================================== */

require_once __DIR__ . '/db.php';

final class Zaehler
{
    /* Eine feste Liste. Der Browser darf zählen lassen, aber nicht
       bestimmen, was es zu zählen gibt – sonst legt der erste Neugierige
       zehntausend Zeilen an. */
    public const NAMEN = [
        /* Trichter der suchenden Seite */
        'besuch', 'suche', 'objekt', 'konto-noetig', 'anmeldung-start', 'anmeldung-fertig',
        'merken', 'anfrage', 'auftrag-neu',
        /* WG-Gründung: drei Zahlen, die zusammen sagen, ob die Sache
           trägt – wie viele Gruppen entstehen, wie viele Menschen
           beitreten, wie viele es bis zur gemeinsamen Bewerbung
           schaffen. Der Abstand zwischen der zweiten und der dritten
           ist die eigentliche Frage. */
        'wg-seite', 'wg-gruppe-neu', 'wg-beitritt', 'wg-bewerbung',
        /* Trichter der anbietenden Seite */
        'inserieren-seite', 'inserat-neu', 'inserat-bild', 'inserat-verlaengert',
        /* Geld */
        'plus-seite', 'plus-start', 'hervorheben-seite',
        /* Sonstiges, das eine Entscheidung tragen kann */
        'werkzeug', 'recht', 'hilfe', 'meldung', 'tausch', 'sprache-en',
    ];

    public static function erlaubt(string $name): bool
    {
        return in_array($name, self::NAMEN, true);
    }

    public static function plus(string $name, int $wieviel = 1): void
    {
        if (!self::erlaubt($name) || $wieviel < 1 || $wieviel > 100) {
            return;
        }
        $tag = gmdate('Y-m-d');
        try {
            /* Ein Aufruf statt Lesen-und-Schreiben: Zwei Besucher in
               derselben Sekunde zählen sonst als einer. */
            $pdo = Db::pdo();
            $treiber = $pdo->getAttribute(PDO::ATTR_DRIVER_NAME);
            $sql = $treiber === 'sqlite'
                ? 'INSERT INTO tt_zaehler (tag, name, wert) VALUES (?,?,?)
                   ON CONFLICT(tag, name) DO UPDATE SET wert = wert + excluded.wert'
                : 'INSERT INTO tt_zaehler (tag, name, wert) VALUES (?,?,?)
                   ON DUPLICATE KEY UPDATE wert = wert + VALUES(wert)';
            Db::fuehre($sql, [$tag, $name, $wieviel]);
        } catch (Throwable $e) {
            /* Eine Zahl, die nicht gezählt wurde, ist ein kleiner
               Verlust. Eine Seite, die deswegen nicht lädt, ein großer. */
            error_log('TrimmoTrade: Zählen fehlgeschlagen – ' . $e->getMessage());
        }
    }

    /** Tabelle für die Kommandozeile: die letzten Tage, alle Namen. */
    public static function bericht(int $tage = 14): string
    {
        $ab = gmdate('Y-m-d', time() - $tage * 86400);
        $zeilen = Db::zeilen('SELECT tag, name, wert FROM tt_zaehler WHERE tag >= ? ORDER BY tag DESC', [$ab]);
        if (!$zeilen) {
            return "Noch nichts gezählt.\n";
        }
        $nachTag = [];
        foreach ($zeilen as $z) {
            $nachTag[$z['tag']][$z['name']] = (int) $z['wert'];
        }
        $spalten = ['besuch', 'suche', 'objekt', 'konto-noetig', 'anmeldung-fertig', 'anfrage', 'inserat-neu'];
        $raus = str_pad('Tag', 12);
        foreach ($spalten as $s) {
            $raus .= str_pad(mb_substr($s, 0, 9), 11, ' ', STR_PAD_LEFT);
        }
        $raus .= "\n" . str_repeat('-', 12 + 11 * count($spalten)) . "\n";
        foreach ($nachTag as $tag => $werte) {
            $raus .= str_pad($tag, 12);
            foreach ($spalten as $s) {
                $raus .= str_pad((string) ($werte[$s] ?? 0), 11, ' ', STR_PAD_LEFT);
            }
            $raus .= "\n";
        }

        /* Die drei Verhältnisse, auf die es ankommt. Absolute Zahlen
           schmeicheln, Quoten nicht. */
        $summe = [];
        foreach ($nachTag as $werte) {
            foreach ($werte as $n => $v) {
                $summe[$n] = ($summe[$n] ?? 0) + $v;
            }
        }
        $quote = static function (string $a, string $b) use ($summe): string {
            $oben = $summe[$a] ?? 0;
            $unten = $summe[$b] ?? 0;
            return $unten > 0 ? number_format($oben / $unten * 100, 1, ',', '.') . ' %' : '–';
        };
        $raus .= "\nÜber den ganzen Zeitraum:\n";
        $raus .= '  Suche → Objekt        ' . $quote('objekt', 'suche') . "\n";
        $raus .= '  Objekt → Konto nötig  ' . $quote('konto-noetig', 'objekt') . "\n";
        $raus .= '  Konto nötig → Konto   ' . $quote('anmeldung-fertig', 'konto-noetig') . "\n";
        $raus .= '  Objekt → Anfrage      ' . $quote('anfrage', 'objekt') . "\n";
        $raus .= '  Inserieren → Inserat  ' . $quote('inserat-neu', 'inserieren-seite') . "\n";
        return $raus;
    }
}
