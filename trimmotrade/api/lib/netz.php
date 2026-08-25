<?php
/* =====================================================================
   Anfragen nach draußen

   Genau zwei Gegenstellen: Google und Microsoft. Beide über HTTPS, beide
   mit geprüftem Zertifikat – ohne diese Prüfung wäre der ganze Aufwand
   mit Signaturen umsonst, weil sich jeder dazwischenschalten könnte.

   Kurze Fristen sind hier Absicht: Wenn Google zehn Sekunden nicht
   antwortet, soll der Nutzer eine Fehlermeldung sehen und es noch einmal
   versuchen können – nicht eine Minute vor einer weißen Seite sitzen.
   ===================================================================== */

require_once __DIR__ . '/antwort.php';

final class NetzFehler extends RuntimeException
{
}

final class Netz
{
    /** @param array<string,string> $felder */
    public static function post(string $url, array $felder, array $kopf = []): array
    {
        return self::hole($url, http_build_query($felder), array_merge(
            ['Content-Type: application/x-www-form-urlencoded'],
            $kopf
        ));
    }

    public static function get(string $url): array
    {
        return self::hole($url, null, []);
    }

    private static function hole(string $url, ?string $rumpf, array $kopf): array
    {
        if (!str_starts_with($url, 'https://')) {
            throw new NetzFehler('Nur HTTPS.');
        }

        if (function_exists('curl_init')) {
            $c = curl_init($url);
            curl_setopt_array($c, [
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_CONNECTTIMEOUT => 6,
                CURLOPT_TIMEOUT        => 12,
                CURLOPT_SSL_VERIFYPEER => true,
                CURLOPT_SSL_VERIFYHOST => 2,
                /* Weiterleitungen bewusst aus: Ein Token-Endpunkt, der
                   umleitet, ist ein Zeichen für ein Problem, kein
                   normaler Fall – und automatisches Folgen hat schon
                   viele Anwendungen an unerwartete Adressen geschickt. */
                CURLOPT_FOLLOWLOCATION => false,
                CURLOPT_HTTPHEADER     => array_merge(['Accept: application/json'], $kopf),
                CURLOPT_USERAGENT      => 'TrimmoTrade/1.0',
            ]);
            if ($rumpf !== null) {
                curl_setopt($c, CURLOPT_POST, true);
                curl_setopt($c, CURLOPT_POSTFIELDS, $rumpf);
            }
            $text = curl_exec($c);
            $status = (int) curl_getinfo($c, CURLINFO_RESPONSE_CODE);
            $panne = curl_error($c);
            curl_close($c);
            if ($text === false) {
                throw new NetzFehler('Verbindung fehlgeschlagen: ' . $panne);
            }
            return self::auswerten($text, $status);
        }

        /* Ohne cURL: Der Umweg über die Stream-Schicht. Funktioniert,
           solange allow_url_fopen an ist – bei netcup ist es das. */
        $rahmen = stream_context_create(['http' => [
            'method'        => $rumpf === null ? 'GET' : 'POST',
            'header'        => implode("\r\n", array_merge(['Accept: application/json'], $kopf)),
            'content'       => $rumpf ?? '',
            'timeout'       => 12,
            'ignore_errors' => true,
        ], 'ssl' => ['verify_peer' => true, 'verify_peer_name' => true]]);

        $text = @file_get_contents($url, false, $rahmen);
        if ($text === false) {
            throw new NetzFehler('Verbindung fehlgeschlagen.');
        }
        $status = 0;
        foreach ($http_response_header ?? [] as $z) {
            if (preg_match('#^HTTP/\S+\s+(\d{3})#', $z, $m)) {
                $status = (int) $m[1];
            }
        }
        return self::auswerten($text, $status);
    }

    private static function auswerten(string $text, int $status): array
    {
        $d = json_decode($text, true);
        if (!is_array($d)) {
            throw new NetzFehler('Unerwartete Antwort (' . $status . ').');
        }
        if ($status >= 400) {
            $grund = $d['error_description'] ?? ($d['error'] ?? ('HTTP ' . $status));
            throw new NetzFehler(is_string($grund) ? $grund : ('HTTP ' . $status));
        }
        return $d;
    }
}
