<?php
/* =====================================================================
   Bilder zu Inseraten

   Ein Inserat ohne Foto wird nicht angeklickt. Das ist keine Vermutung,
   sondern der Alltag jedes Wohnungsportals – und deshalb ist der Umgang
   mit Bildern kein Nebenschauplatz.

   Drei Dinge passieren hier, und jedes davon aus einem Grund, der nichts
   mit Bequemlichkeit zu tun hat:

   1. Jedes Bild wird neu berechnet, nie durchgereicht. Wer eine Datei
      unverändert ablegt, legt ab, was drin ist – und in Handyfotos ist
      der genaue Aufnahmeort drin. Ein Wohnungsfoto mit GPS-Koordinaten
      im EXIF verrät die Adresse einer Wohnung, deren Anbieter bewusst
      nur „Nähe Ehrenfeld“ geschrieben hat. Neu berechnen entfernt das
      vollständig, ohne dass jemand daran denken muss.

   2. Es wird auf 1600 Pixel begrenzt. Ein 12-Megapixel-Foto kostet den
      Suchenden auf dem Weg zur Arbeit vier Megabyte Datenvolumen und
      bringt ihm nichts.

   3. Es wird geprüft, ob es überhaupt ein Bild ist – mit den Mitteln der
      Bibliothek, nicht anhand der Dateiendung. Eine PHP-Datei, die
      „bild.jpg“ heißt, ist eine PHP-Datei.
   ===================================================================== */

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/antwort.php';

final class Bild
{
    public const HOECHSTENS   = 12;        // Bilder je Inserat
    public const KANTE        = 1600;      // längste Kante
    public const VORSCHAU     = 480;
    public const ROH_BYTES    = 8000000;   // was hereinkommen darf
    private const GUETE       = 82;

    private static string $ordner = '';

    public static function start(array $cfg): void
    {
        self::$ordner = rtrim((string) ($cfg['bilder'] ?? (__DIR__ . '/../daten/bilder')), '/');
    }

    public static function ordner(): string
    {
        if (self::$ordner === '') {
            self::$ordner = __DIR__ . '/../daten/bilder';
        }
        if (!is_dir(self::$ordner)) {
            @mkdir(self::$ordner, 0770, true);
        }
        return self::$ordner;
    }

    public static function moeglich(): bool
    {
        return function_exists('imagecreatefromstring') && function_exists('imagejpeg');
    }

    /* ------------------------------------------------------------------
       Hereinnehmen
       ------------------------------------------------------------------ */

    /**
     * Nimmt ein Bild als Daten-URI oder als reines Base64 entgegen.
     * Gibt die Zeile aus tt_bild zurück.
     */
    public static function anlegen(int $inseratId, string $roh, int $pos): array
    {
        if (!self::moeglich()) {
            Antwort::fehler('Auf diesem Server fehlt die Bildbibliothek GD. '
                . 'Das Inserat lässt sich anlegen, Bilder gehen noch nicht.', 501);
        }

        $anzahl = (int) Db::wert('SELECT COUNT(*) FROM tt_bild WHERE inserat_id = ?', [$inseratId]);
        if ($anzahl >= self::HOECHSTENS) {
            Antwort::fehler('Mehr als ' . self::HOECHSTENS . ' Bilder je Inserat gehen nicht.', 409);
        }

        $bytes = self::rohBytes($roh);
        $bild = @imagecreatefromstring($bytes);
        if (!$bild) {
            Antwort::fehler('Diese Datei ist kein Bild, das sich lesen lässt. '
                . 'JPEG, PNG und WebP gehen.', 415);
        }

        $gross = self::verkleinern($bild, self::KANTE);
        $klein = self::verkleinern($bild, self::VORSCHAU);
        imagedestroy($bild);

        $kennung = 'b' . strtolower(bin2hex(random_bytes(9)));
        $datei   = $kennung . '.jpg';
        $ordner  = self::ordner();

        $ok = imagejpeg($gross, $ordner . '/' . $datei, self::GUETE)
            && imagejpeg($klein, $ordner . '/' . $kennung . '-k.jpg', self::GUETE);
        $breite = imagesx($gross);
        $hoehe  = imagesy($gross);
        imagedestroy($gross);
        imagedestroy($klein);

        if (!$ok) {
            Antwort::fehler('Das Bild ließ sich nicht ablegen. Ist der Ordner api/daten beschreibbar?', 500);
        }

        Db::fuehre(
            'INSERT INTO tt_bild (kennung, inserat_id, pos, datei, breite, hoehe, bytes, angelegt)
             VALUES (?,?,?,?,?,?,?,?)',
            [$kennung, $inseratId, $pos, $datei, $breite, $hoehe,
                (int) @filesize($ordner . '/' . $datei), time()]
        );
        self::zaehlerNeu($inseratId);
        return Db::zeile('SELECT * FROM tt_bild WHERE kennung = ?', [$kennung]) ?? [];
    }

    private static function rohBytes(string $roh): string
    {
        if (str_starts_with($roh, 'data:')) {
            $komma = strpos($roh, ',');
            if ($komma === false) {
                Antwort::fehler('Das Bild kam unvollständig an.', 400);
            }
            $kopf = substr($roh, 5, $komma - 5);
            if (!str_contains($kopf, 'base64')) {
                Antwort::fehler('Das Bild kam in einer Schreibweise an, die hier nicht vorgesehen ist.', 415);
            }
            $roh = substr($roh, $komma + 1);
        }
        if (strlen($roh) > self::ROH_BYTES * 4 / 3 + 1024) {
            Antwort::fehler('Das Bild ist größer als 8 MB. Verkleinere es vorher.', 413);
        }
        $bytes = base64_decode($roh, true);
        if ($bytes === false || strlen($bytes) < 64) {
            Antwort::fehler('Das Bild ließ sich nicht lesen.', 400);
        }
        if (strlen($bytes) > self::ROH_BYTES) {
            Antwort::fehler('Das Bild ist größer als 8 MB. Verkleinere es vorher.', 413);
        }
        return $bytes;
    }

    /** Verkleinert auf die längste Kante; kleinere Bilder bleiben, wie
        sie sind – Hochrechnen macht nichts besser. */
    private static function verkleinern(\GdImage $bild, int $kante): \GdImage
    {
        $b = imagesx($bild);
        $h = imagesy($bild);
        $faktor = min(1.0, $kante / max($b, $h));
        $nb = max(1, (int) round($b * $faktor));
        $nh = max(1, (int) round($h * $faktor));

        $ziel = imagecreatetruecolor($nb, $nh);
        /* Durchsichtige PNGs werden sonst schwarz: erst weiß füllen. */
        $weiss = imagecolorallocate($ziel, 255, 255, 255);
        imagefilledrectangle($ziel, 0, 0, $nb, $nh, $weiss);
        imagecopyresampled($ziel, $bild, 0, 0, 0, 0, $nb, $nh, $b, $h);
        return $ziel;
    }

    /* ------------------------------------------------------------------
       Lesen und Löschen
       ------------------------------------------------------------------ */

    /** @return array<int,array{id:string,breite:int,hoehe:int,url:string,klein:string}> */
    public static function zuInserat(int $inseratId): array
    {
        $raus = [];
        foreach (Db::zeilen('SELECT * FROM tt_bild WHERE inserat_id = ? ORDER BY pos, id', [$inseratId]) as $b) {
            $raus[] = [
                'id' => $b['kennung'],
                'breite' => (int) $b['breite'],
                'hoehe' => (int) $b['hoehe'],
                'url' => '/api/bild/' . $b['kennung'],
                'klein' => '/api/bild/' . $b['kennung'] . '-k',
            ];
        }
        return $raus;
    }

    public static function loeschen(int $inseratId, string $kennung): void
    {
        $b = Db::zeile('SELECT * FROM tt_bild WHERE kennung = ? AND inserat_id = ?', [$kennung, $inseratId]);
        if (!$b) {
            Antwort::fehler('Dieses Bild gibt es nicht.', 404);
        }
        self::dateiWeg((string) $b['datei']);
        Db::fuehre('DELETE FROM tt_bild WHERE id = ?', [$b['id']]);
        self::zaehlerNeu($inseratId);
    }

    public static function dateiWeg(string $datei): void
    {
        $datei = basename($datei);
        if ($datei === '' || !preg_match('/^b[0-9a-f]{18}\.jpg$/', $datei)) {
            return;
        }
        $o = self::ordner();
        @unlink($o . '/' . $datei);
        @unlink($o . '/' . substr($datei, 0, -4) . '-k.jpg');
    }

    private static function zaehlerNeu(int $inseratId): void
    {
        $n = (int) Db::wert('SELECT COUNT(*) FROM tt_bild WHERE inserat_id = ?', [$inseratId]);
        Db::fuehre('UPDATE tt_inserat SET bilder = ? WHERE id = ?', [$n, $inseratId]);
    }

    /* ------------------------------------------------------------------
       Ausliefern

       Läuft durch PHP, weil der Ordner für den Webserver gesperrt ist.
       Das kostet ein paar Millisekunden und spart die Sorge, dass jemand
       im Bilderordner etwas ablegt, das der Server ausführt.
       ------------------------------------------------------------------ */

    public static function ausliefern(string $wunsch): never
    {
        $klein = str_ends_with($wunsch, '-k');
        $kennung = $klein ? substr($wunsch, 0, -2) : $wunsch;
        if (!preg_match('/^b[0-9a-f]{18}$/', $kennung)) {
            http_response_code(404);
            exit;
        }
        $b = Db::zeile('SELECT datei FROM tt_bild WHERE kennung = ?', [$kennung]);
        if (!$b) {
            http_response_code(404);
            exit;
        }
        $pfad = self::ordner() . '/' . ($klein ? $kennung . '-k.jpg' : (string) $b['datei']);
        if (!is_file($pfad)) {
            http_response_code(404);
            exit;
        }

        /* Der Name ist zufällig und ändert sich nie – deshalb darf der
           Browser das Bild ein Jahr behalten. Ein geändertes Bild bekommt
           einen neuen Namen. */
        header('Content-Type: image/jpeg');
        header('Content-Length: ' . filesize($pfad));
        header('Cache-Control: public, max-age=31536000, immutable');
        header('X-Content-Type-Options: nosniff');
        header('Content-Security-Policy: default-src \'none\'; sandbox');
        readfile($pfad);
        exit;
    }
}
