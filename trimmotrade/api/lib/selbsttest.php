<?php
/* =====================================================================
   Selbstprüfung

       php api/index.php pruefen

   Diese Datei beantwortet eine einzige Frage, und zwar für einen
   Menschen, der kein Serveradministrator ist: **Läuft hier alles, und
   wenn nicht, was fehlt?**

   Der Grund, warum es sie gibt: Ein Einzelbetrieb merkt nicht, dass der
   Cron-Auftrag seit drei Wochen nicht läuft. Er merkt es daran, dass
   niemand mehr wiederkommt – und dann sucht er den Fehler in der
   Anwendung. Eine Liste, die sagt „melden lief zuletzt vor 23 Tagen“,
   spart diese drei Wochen.

   Jede Zeile hier ist deshalb ein Fehler, den jemand tatsächlich machen
   kann, und keine Vollständigkeitsübung.
   ===================================================================== */

require_once __DIR__ . '/db.php';

final class Selbsttest
{
    private array $zeilen = [];
    private int $schlimm = 0;
    private int $warn = 0;

    public function __construct(private array $cfg, private string $wurzel)
    {
    }

    private function gut(string $was, string $mehr = ''): void
    {
        $this->zeilen[] = ['  ok  ', $was, $mehr];
    }

    private function hinweis(string $was, string $mehr = ''): void
    {
        $this->zeilen[] = ['  !   ', $was, $mehr];
        $this->warn++;
    }

    private function fehlt(string $was, string $mehr = ''): void
    {
        $this->zeilen[] = ['  FEHLT', $was, $mehr];
        $this->schlimm++;
    }

    public function lauf(): string
    {
        $this->php();
        $this->einstellungen();
        $this->datenbank();
        $this->dateien();
        $this->post();
        $this->bilder();
        $this->cron();
        $this->betrieb();
        return $this->bericht();
    }

    /* ------------------------------------------------------------------ */

    private function php(): void
    {
        $v = PHP_VERSION;
        if (version_compare($v, '8.1', '>=')) {
            $this->gut('PHP ' . $v);
        } else {
            $this->fehlt('PHP ' . $v . ' ist zu alt', 'Die Anwendung braucht mindestens 8.1.');
        }
    }

    private function einstellungen(): void
    {
        $basis = rtrim((string) ($this->cfg['basis'] ?? ''), '/');
        if ($basis === '') {
            $this->fehlt('basis fehlt', 'Ohne sie gehen Anmeldeverweise und Mails ins Leere.');
        } elseif (str_starts_with($basis, 'https://')) {
            $this->gut('basis', $basis);
        } else {
            $this->fehlt('basis ist nicht https', $basis . ' – Passkeys funktionieren nur über https.');
        }

        $rp = (string) ($this->cfg['rp_id'] ?? '');
        $host = (string) (parse_url($basis, PHP_URL_HOST) ?: '');
        if ($rp === '') {
            $this->fehlt('rp_id fehlt');
        } elseif (str_contains($rp, '/') || str_contains($rp, ':')) {
            $this->fehlt('rp_id ist keine reine Domain', $rp . ' – ohne https:// und ohne Pfad.');
        } elseif ($host !== '' && $host !== $rp && !str_ends_with($host, '.' . $rp)) {
            $this->fehlt('rp_id passt nicht zur basis', 'basis: ' . $host . ' · rp_id: ' . $rp);
        } elseif (str_starts_with($rp, 'www.')) {
            /* Das ist der eine Fehler, der später nicht mehr reparabel
               ist: Ändert man rp_id nachträglich, sind alle bestehenden
               Passkeys ungültig – jeder Betroffene ist ausgesperrt. */
            $this->hinweis('rp_id beginnt mit www.', 'Ohne www wäre sie auch für die www-Adresse gültig, '
                . 'umgekehrt nicht. Später ändern macht alle Passkeys ungültig.');
        } else {
            $this->gut('rp_id', $rp);
        }

        if (!empty($this->cfg['entwicklung'])) {
            $this->fehlt('entwicklung steht auf true',
                'Dann stehen interne Fehlermeldungen in den Antworten. Im Betrieb gehört dort false hin.');
        } else {
            $this->gut('entwicklung steht auf false');
        }
    }

    private function datenbank(): void
    {
        try {
            $pdo = Db::pdo();
            $treiber = $pdo->getAttribute(PDO::ATTR_DRIVER_NAME);
            $this->gut('Datenbank erreichbar', $treiber);
        } catch (Throwable $e) {
            $this->fehlt('Datenbank nicht erreichbar', $e->getMessage());
            return;
        }

        $stand = (int) (Db::wert("SELECT wert FROM tt_stand WHERE name = 'schema'") ?? 0);
        if ($stand === Schema::VERSION) {
            $this->gut('Datenmodell auf Stand', 'Version ' . $stand);
        } else {
            $this->hinweis('Datenmodell abweichend',
                'gespeichert ' . $stand . ', erwartet ' . Schema::VERSION
                . ' – der nächste Aufruf über den Browser gleicht das an.');
        }

        foreach (['tt_konto', 'tt_inserat', 'tt_anfrage', 'tt_auftrag', 'tt_meldung',
                  'tt_gruppe', 'tt_zaehler'] as $t) {
            try {
                Db::wert('SELECT COUNT(*) FROM ' . $t);
            } catch (Throwable $e) {
                $this->fehlt('Tabelle ' . $t . ' fehlt');
            }
        }
    }

    private function dateien(): void
    {
        $w = rtrim($this->wurzel, '/');
        foreach ([
            '/.htaccess' => 'Ohne sie beantwortet der Server /api/ nicht.',
            '/api/lib/.htaccess' => 'Riegel vor den Programmteilen.',
            '/api/daten/.htaccess' => 'Riegel vor Datenbank und Bildern.',
            '/.user.ini' => 'Ohne sie schneidet PHP den Bildupload ab.',
        ] as $datei => $warum) {
            if (is_file($w . $datei)) {
                $this->gut('vorhanden: ' . ltrim($datei, '/'));
            } else {
                $this->fehlt('fehlt: ' . ltrim($datei, '/'), $warum
                    . ' Sie beginnt mit einem Punkt – viele FTP-Programme blenden sie aus.');
            }
        }

        $cfg = $w . '/api/config.php';
        if (is_file($cfg)) {
            $rechte = substr(sprintf('%o', @fileperms($cfg)), -3);
            if (in_array($rechte, ['600', '640', '660', '400', '440'], true)) {
                $this->gut('api/config.php geschützt', 'Rechte ' . $rechte);
            } else {
                $this->hinweis('api/config.php mit Rechten ' . $rechte,
                    'Darin stehen Passwörter. 600 wäre richtig.');
            }
        }

        foreach (['/api/daten', '/api/daten/bilder'] as $ordner) {
            $pfad = $w . $ordner;
            if (!is_dir($pfad)) {
                @mkdir($pfad, 0770, true);
            }
            if (is_dir($pfad) && is_writable($pfad)) {
                $this->gut('beschreibbar: ' . ltrim($ordner, '/'));
            } else {
                $this->fehlt('nicht beschreibbar: ' . ltrim($ordner, '/'),
                    'Ohne das lassen sich keine Bilder ablegen.');
            }
        }
    }

    private function post(): void
    {
        $art = (string) ($this->cfg['mail']['art'] ?? '');
        if (!Post::moeglich()) {
            $this->fehlt('Mailversand nicht eingerichtet',
                'Ohne ihn gibt es keine Anmeldung per Code, keine Anfragemail und keinen Suchauftrag.');
            return;
        }
        if ($art === 'log') {
            $this->hinweis('Mailversand schreibt nur ins Protokoll',
                'api/daten/mail.log – zum Ausprobieren richtig, im Betrieb nicht.');
        } elseif ($art === 'mail') {
            $this->hinweis('Mailversand über PHP-mail()',
                'Landet häufig im Spam-Ordner. SMTP über das eigene Postfach ist deutlich besser.');
        } else {
            $this->gut('Mailversand über SMTP', (string) ($this->cfg['mail']['smtp']['host'] ?? ''));
        }
    }

    private function bilder(): void
    {
        if (function_exists('imagecreatefromstring') && function_exists('imagejpeg')) {
            $this->gut('Bildbibliothek GD vorhanden');
        } else {
            $this->hinweis('Bildbibliothek GD fehlt',
                'Inserate gehen, Bilder nicht. Im Kundenbereich einschalten.');
        }
        $max = self::alsBytes((string) ini_get('post_max_size'));
        if ($max > 0 && $max < 12 * 1024 * 1024) {
            $this->hinweis('post_max_size ist ' . ini_get('post_max_size'),
                'Für den Bildupload sollten es 16M sein – siehe .user.ini.');
        } else {
            $this->gut('post_max_size', (string) ini_get('post_max_size'));
        }
    }

    private static function alsBytes(string $w): int
    {
        $w = trim($w);
        if ($w === '') {
            return 0;
        }
        $zahl = (int) $w;
        return match (strtolower(substr($w, -1))) {
            'g' => $zahl * 1024 * 1024 * 1024,
            'm' => $zahl * 1024 * 1024,
            'k' => $zahl * 1024,
            default => $zahl,
        };
    }

    /* Die Cron-Aufträge merken sich, wann sie zuletzt gelaufen sind.
       Ohne diese Zeile bliebe der häufigste Betriebsfehler unsichtbar:
       ein Auftrag, der nie eingerichtet wurde. */
    private function cron(): void
    {
        foreach ([
            'melden' => [90000, 'Suchaufträge – ohne ihn kommt niemand zurück.'],
            'erinnern' => [180000, 'Ohne ihn verfallen Inserate ohne Nachfrage.'],
            'aufraeumen' => [180000, 'Ohne ihn bleiben alte Sitzungen liegen.'],
        ] as $name => [$frist, $warum]) {
            $wann = (int) (Db::wert('SELECT wert FROM tt_stand WHERE name = ?', ['cron_' . $name]) ?? 0);
            if (!$wann) {
                $this->fehlt('Cron „' . $name . '“ lief noch nie', $warum);
            } elseif (time() - $wann > $frist) {
                $tage = (int) floor((time() - $wann) / 86400);
                $this->fehlt('Cron „' . $name . '“ lief zuletzt vor ' . $tage . ' Tagen', $warum);
            } else {
                $this->gut('Cron „' . $name . '“', 'zuletzt ' . date('d.m. H:i', $wann));
            }
        }
    }

    private function betrieb(): void
    {
        $echte = (int) Db::wert("SELECT COUNT(*) FROM tt_inserat WHERE stand = 'aktiv' AND laeuft_ab > ?",
            [time()]);
        $beispiele = ($this->cfg['beispielmarkt'] ?? true) !== false;
        if ($echte >= 300 && $beispiele) {
            $this->hinweis('Der Beispielmarkt läuft neben ' . $echte . ' echten Inseraten',
                "In api/config.php gehört jetzt 'beispielmarkt' => false.");
        } elseif ($echte < 20 && !$beispiele) {
            $this->hinweis('Beispielmarkt aus, aber nur ' . $echte . ' echte Inserate',
                'Eine fast leere Suche überzeugt niemanden.');
        } else {
            $this->gut('Bestand', $echte . ' echte Inserate · Beispiele '
                . ($beispiele ? 'an' : 'aus'));
        }

        $abgelaufen = (int) Db::wert("SELECT COUNT(*) FROM tt_inserat WHERE stand = 'aktiv' AND laeuft_ab < ?",
            [time()]);
        if ($abgelaufen > 0) {
            $this->gut('Abgelaufene Inserate werden ausgeblendet', $abgelaufen . ' Stück');
        }

        $offen = (int) Db::wert("SELECT COUNT(*) FROM tt_meldung WHERE stand = 'offen'");
        $alt = (int) Db::wert("SELECT COUNT(*) FROM tt_meldung WHERE stand = 'offen' AND angelegt < ?",
            [time() - 3 * 86400]);
        if ($alt > 0) {
            $this->fehlt($alt . ' Meldungen liegen länger als drei Tage',
                'Art. 16 DSA verlangt eine zeitnahe Bearbeitung. php api/index.php meldungen');
        } elseif ($offen > 0) {
            $this->hinweis($offen . ' offene ' . ($offen === 1 ? 'Meldung' : 'Meldungen'),
                'php api/index.php meldungen');
        } else {
            $this->gut('Keine offenen Meldungen');
        }

        $gesperrt = (int) Db::wert("SELECT COUNT(*) FROM tt_inserat WHERE stand = 'gesperrt'");
        if ($gesperrt > 0) {
            $this->gut('Gesperrte Inserate', (string) $gesperrt);
        }
    }

    /* ------------------------------------------------------------------ */

    private function bericht(): string
    {
        $raus = "TrimmoTrade – Selbstprüfung\n" . str_repeat('=', 60) . "\n\n";
        foreach ($this->zeilen as [$marke, $was, $mehr]) {
            $raus .= $marke . '  ' . $was . "\n";
            if ($mehr !== '') {
                $raus .= '        ' . wordwrap($mehr, 66, "\n        ", false) . "\n";
            }
        }
        $raus .= "\n" . str_repeat('-', 60) . "\n";
        if ($this->schlimm === 0 && $this->warn === 0) {
            $raus .= "Alles in Ordnung.\n";
        } else {
            $raus .= $this->schlimm . ' zu beheben, ' . $this->warn . " zum Ansehen.\n";
        }
        $raus .= "\nWas diese Prüfung nicht sehen kann: ob das Impressum vollständig ist.\n"
            . "Die Angaben stehen im Browser des Betreibers, nicht auf dem Server.\n"
            . "Nachsehen unter Rechtliches → Angaben zum Anbieter.\n";
        return $raus;
    }

    /** Von den Cron-Aufträgen aufgerufen. */
    public static function laufMerken(string $name): void
    {
        try {
            $pdo = Db::pdo();
            $sql = $pdo->getAttribute(PDO::ATTR_DRIVER_NAME) === 'sqlite'
                ? 'INSERT INTO tt_stand (name, wert) VALUES (?,?) ON CONFLICT(name) DO UPDATE SET wert = excluded.wert'
                : 'INSERT INTO tt_stand (name, wert) VALUES (?,?) ON DUPLICATE KEY UPDATE wert = VALUES(wert)';
            Db::fuehre($sql, ['cron_' . $name, (string) time()]);
        } catch (Throwable $e) {
            /* Ein nicht vermerkter Lauf ist kein Grund, den Lauf
               abzubrechen. */
        }
    }
}
