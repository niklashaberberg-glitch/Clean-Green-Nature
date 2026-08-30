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
        $this->impressum();
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

    /* Das konnte diese Prüfung früher nicht: Die Angaben lagen im
       Browser des Betreibers und waren dem Server unbekannt. Jetzt
       stehen sie in der Konfiguration – und damit lässt sich sagen, ob
       das Impressum vollständig ist. */
    /** Sieht der Wert aus wie eine Angabe oder wie ein Platzhalter? */
    private static function istPlatzhalter(string $wert): bool
    {
        $t = mb_strtolower($wert, 'UTF-8');
        foreach (['muster', 'beispiel', 'example.', 'test@', 'eintragen', 'xxx', 'todo',
                  'max mustermann', 'ihre ', 'irgendwo'] as $wort) {
            if (str_contains($t, $wort)) {
                return true;
            }
        }
        /* Aufsteigende oder gleiche Ziffernfolgen: 1234567, 1111111.
           Erst ab sechs Stellen, damit eine echte Durchwahl bleibt. */
        $ziffern = preg_replace('/\D+/', '', $t);
        if (is_string($ziffern) && strlen($ziffern) >= 6) {
            foreach (['0123456789', '1234567890'] as $reihe) {
                if (str_contains($reihe, substr($ziffern, -6))) {
                    return true;
                }
            }
            if (preg_match('/(\d)\1{5,}/', $ziffern)) {
                return true;
            }
        }
        return false;
    }

    private function impressum(): void
    {
        $b = is_array($this->cfg['betreiber'] ?? null) ? $this->cfg['betreiber'] : [];
        $pflicht = [
            'name' => 'Name des Anbieters (§ 5 Abs. 1 Nr. 1 DDG)',
            'strasse' => 'Straße und Hausnummer – ladungsfähig, kein Postfach',
            'plz' => 'Postleitzahl',
            'ort' => 'Ort',
            'email' => 'E-Mail-Adresse (§ 5 Abs. 1 Nr. 2 DDG)',
            'telefon' => 'Telefonnummer (§ 5 Abs. 1 Nr. 2 DDG)',
        ];
        $fehlen = [];
        $erfunden = [];
        foreach ($pflicht as $feld => $was) {
            $wert = trim((string) ($b[$feld] ?? ''));
            if ($wert === '') {
                $fehlen[] = $was;
            } elseif (self::istPlatzhalter($wert)) {
                $erfunden[] = $was . ' → „' . $wert . '“';
            }
        }
        /* Ein Platzhalter ist schlimmer als eine Lücke: Die Lücke sieht
           man, den Platzhalter hält man für eine Angabe. „0221 1234567“
           erfüllt § 5 DDG nicht, und wer unter der Nummer niemanden
           erreicht, schreibt statt einer Mail eine Abmahnung. */
        if ($erfunden) {
            $this->fehlt(count($erfunden) . ' Angaben im Impressum sehen erfunden aus',
                implode(' · ', $erfunden) . ' — das ist keine Angabe, sondern eine, die so aussieht. '
                . 'Zu ändern unter \'betreiber\' in api/config.php.');
        }
        if ($fehlen) {
            $this->fehlt(count($fehlen) . ' Pflichtangaben im Impressum fehlen',
                implode(' · ', $fehlen) . ' — einzutragen unter \'betreiber\' in api/config.php. '
                . 'Ein unvollständiges Impressum ist der am häufigsten abgemahnte Fehler im '
                . 'deutschen Internet.');
        } elseif (!$erfunden) {
            $this->gut('Impressum vollständig', trim((string) ($b['name'] ?? '')) . ', '
                . trim((string) ($b['ort'] ?? '')));
        }

        if (trim((string) ($b['aufsichtsbehoerde'] ?? '')) === '') {
            $this->hinweis('Datenschutz-Aufsichtsbehörde nicht eingetragen',
                'Art. 13 Abs. 2 lit. d DSGVO – der Hinweis auf das Beschwerderecht gehört in die '
                . 'Datenschutzerklärung.');
        }
        if (trim((string) ($b['service'] ?? '')) === '') {
            $this->hinweis('Keine Kontaktstelle eingetragen',
                'Art. 11 und 12 DSA verlangen eine benannte Stelle für Behörden und Nutzende.');
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
                  'tt_gruppe', 'tt_zaehler', 'tt_ablage', 'tt_tresor', 'tt_freigabe',
                  'tt_termin', 'tt_buchung'] as $t) {
            try {
                Db::wert('SELECT COUNT(*) FROM ' . $t);
            } catch (Throwable $e) {
                $this->fehlt('Tabelle ' . $t . ' fehlt');
            }
        }

        /* Die drei Spalten, die mit Version 4 dazukamen. Eine fehlende
           Tabelle fällt sofort auf; eine fehlende Spalte erst dann, wenn
           jemand einen Gründerplatz nehmen will – und das ist zu spät. */
        foreach (['plus_bis', 'gruender_nr', 'gruender_bis'] as $spalte) {
            try {
                Db::wert('SELECT ' . $spalte . ' FROM tt_konto LIMIT 1');
            } catch (Throwable $e) {
                $this->fehlt('Spalte tt_konto.' . $spalte . ' fehlt',
                    'Ohne sie lässt sich kein Gründerplatz vergeben. Ein Aufruf über den Browser legt sie an.');
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
            /* Auf der Kommandozeile liest PHP keine .user.ini – die gilt
               nur für Anfragen über den Webserver. Wer diese Zeile beim
               `pruefen` sieht, obwohl die Datei liegt, hat nichts falsch
               gemacht; der Wert im Betrieb ist ein anderer. */
            $userIni = is_file(rtrim($this->wurzel, '/') . '/.user.ini');
            $this->hinweis('post_max_size ist ' . ini_get('post_max_size'),
                $userIni && PHP_SAPI === 'cli'
                    ? '.user.ini liegt, wird auf der Kommandozeile aber nicht gelesen. '
                      . 'Was im Betrieb gilt, zeigt api/status – dort steht markt.bilder.'
                    : 'Für den Bildupload sollten es 16M sein – siehe .user.ini.');
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
            'aufraeumen' => [180000, 'Ohne ihn bleiben alte Sitzungen, abgelaufene Freigaben und '
                . 'vergangene Besichtigungstermine liegen.'],
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
        $beispiele = ($this->cfg['beispielmarkt'] ?? false) !== false;
        if ($echte >= 300 && $beispiele) {
            $this->hinweis('Der Beispielmarkt läuft neben ' . $echte . ' echten Inseraten',
                "In api/config.php gehört jetzt 'beispielmarkt' => false.");
        } elseif ($echte < 20 && !$beispiele) {
            $this->hinweis('Beispielmarkt aus, aber nur ' . $echte
                . ($echte === 1 ? ' echtes Inserat' : ' echte Inserate'),
                'Eine fast leere Suche überzeugt niemanden.');
        } else {
            $this->gut('Bestand', $echte . ($echte === 1 ? ' echtes Inserat' : ' echte Inserate')
                . ' · Beispiele ' . ($beispiele ? 'an' : 'aus'));
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

        /* Was seit Version 4 mitläuft. Der Tresor ist der einzige Teil,
           der ungebremst wachsen kann – vierzig Megabyte je Konto sind
           erlaubt, und ein Webhosting-Paket ist irgendwann voll. Wer das
           erst merkt, wenn nichts mehr hochlädt, merkt es zu spät. */
        $tresorBytes = (int) Db::wert('SELECT COALESCE(SUM(LENGTH(chiffrat)), 0) FROM tt_tresor');
        $tresorZahl = (int) Db::wert('SELECT COUNT(*) FROM tt_tresor');
        if ($tresorZahl > 0) {
            $this->gut('Dokumententresor', $tresorZahl
                . ($tresorZahl === 1 ? ' Unterlage · ' : ' Unterlagen · ')
                . self::menge($tresorBytes) . ' verschlüsselt');
        }

        $ablageBytes = (int) Db::wert('SELECT COALESCE(SUM(LENGTH(wert)), 0) FROM tt_ablage');
        $ablageKonten = (int) Db::wert('SELECT COUNT(DISTINCT konto_id) FROM tt_ablage');
        if ($ablageKonten > 0) {
            $this->gut('Ablage für den Gerätewechsel', $ablageKonten
                . ($ablageKonten === 1 ? ' Konto · ' : ' Konten · ') . self::menge($ablageBytes));
        }

        $termine = (int) Db::wert('SELECT COUNT(*) FROM tt_termin WHERE datum >= ?', [date('Y-m-d')]);
        $buchungen = (int) Db::wert(
            'SELECT COUNT(*) FROM tt_buchung b JOIN tt_termin t ON t.id = b.termin_id WHERE t.datum >= ?',
            [date('Y-m-d')]
        );
        if ($termine > 0) {
            $this->gut('Besichtigungstermine', $termine . ' anstehend · ' . $buchungen . ' gebucht');
        }

        $gruender = (int) Db::wert('SELECT COUNT(*) FROM tt_konto WHERE gruender_nr > 0');
        if ($gruender > 0) {
            $frei = Tarif::PLAETZE - $gruender;
            $this->gut('Gründerplätze', $gruender . ' vergeben, ' . max(0, $frei) . ' frei');
        }
    }

    /** Byte in etwas, das man vorlesen kann. */
    private static function menge(int $bytes): string
    {
        if ($bytes >= 1048576) {
            return number_format($bytes / 1048576, 1, ',', '.') . ' MB';
        }
        if ($bytes >= 1024) {
            return (int) round($bytes / 1024) . ' kB';
        }
        return $bytes . ' B';
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
