<?php
/* =====================================================================
   WebAuthn – Passkeys, serverseitig geprüft

   Der Punkt, an dem sich echte Anmeldung und Vorführung trennen. Ein
   Browser kann einen Passkey erzeugen und eine Signatur erhalten – ob
   die Signatur stimmt, kann nur eine Gegenseite sagen, die den
   öffentlichen Schlüssel kennt und die Aufforderung selbst gestellt hat.
   Genau das passiert hier.

   Was geprüft wird, und warum jedes Einzelne unverzichtbar ist:

   · Die Aufforderung („challenge“) stammt vom Server und wurde noch
     nicht eingelöst. Ohne diese Prüfung ließe sich eine einmal
     mitgeschnittene Antwort beliebig wiederverwenden.
   · Die Herkunft („origin“) in den Client-Daten ist die eigene Adresse.
     Das ist der Schutz gegen nachgebaute Anmeldeseiten: Der Browser
     schreibt dort die tatsächliche Adresse hinein, und eine gefälschte
     Seite kann das nicht ändern.
   · Der Hash der Relying-Party-ID in den Authenticator-Daten passt zur
     eigenen Domain. Dieselbe Bindung noch einmal, diesmal vom Gerät
     bezeugt statt vom Browser.
   · Das Nutzer-anwesend-Bit und, wo verlangt, das Nutzer-geprüft-Bit
     sind gesetzt. Sonst wäre auch ein Schlüssel gültig, den niemand
     berührt hat.
   · Die Signatur passt zum hinterlegten öffentlichen Schlüssel.
   · Der Signaturzähler ist nicht zurückgesprungen. Ein Rücksprung heißt:
     Es gibt zwei Geräte mit demselben Schlüssel – also eine Kopie.

   Attestierung wird bewusst nicht geprüft. Sie würde beantworten, von
   welchem Hersteller der Sicherheitschip stammt – eine Frage, die
   Unternehmen mit Geräteflotten stellen, nicht eine Wohnungsplattform.
   Wer sie prüft, ohne sie zu brauchen, schließt Nutzer aus.
   ===================================================================== */

require_once __DIR__ . '/cbor.php';
require_once __DIR__ . '/der.php';
require_once __DIR__ . '/antwort.php';

final class WebauthnFehler extends RuntimeException
{
}

final class Webauthn
{
    private const FLAG_UP = 0x01;   // user present – jemand hat das Gerät berührt
    private const FLAG_UV = 0x04;   // user verified – PIN, Fingerabdruck, Gesicht
    private const FLAG_AT = 0x40;   // attested credential data liegt bei

    /* -----------------------------------------------------------------
       Aufforderungen erzeugen
       ----------------------------------------------------------------- */

    /** Was der Browser für `navigator.credentials.create` braucht. */
    public static function neuOptionen(
        string $rpId,
        string $rpName,
        string $nutzerKennung,
        string $nutzerName,
        string $anzeigeName,
        string $aufforderung,
        array $schonDa = []
    ): array {
        return [
            'challenge' => $aufforderung,
            'rp' => ['id' => $rpId, 'name' => $rpName],
            'user' => [
                /* Nicht die E-Mail-Adresse und nicht die Datenbank-Zeile:
                   Diese Kennung landet im Schlüsselbund des Geräts und
                   ist dort unter Umständen für andere Apps sichtbar. */
                'id'          => $nutzerKennung,
                'name'        => $nutzerName,
                'displayName' => $anzeigeName !== '' ? $anzeigeName : $nutzerName,
            ],
            /* -7 = ES256 (elliptische Kurve, der Normalfall),
               -257 = RS256 (RSA, was ältere Windows-Geräte liefern).
               Die Reihenfolge ist die Vorliebe: kürzere Signaturen zuerst. */
            'pubKeyCredParams' => [
                ['type' => 'public-key', 'alg' => -7],
                ['type' => 'public-key', 'alg' => -257],
            ],
            'timeout' => 120000,
            'attestation' => 'none',
            'authenticatorSelection' => [
                /* 'preferred' statt 'required': Ein Sicherheitsschlüssel
                   am USB-Anschluss ist genauso gut wie Face ID, und wer
                   ihn benutzen will, soll das dürfen. */
                'residentKey'      => 'preferred',
                'userVerification' => 'preferred',
            ],
            /* Verhindert, dass dasselbe Gerät einen zweiten Schlüssel für
               dasselbe Konto anlegt – der Browser sagt dann „gibt es
               schon“, statt eine Karteileiche zu erzeugen. */
            'excludeCredentials' => array_map(
                static fn (string $id): array => ['type' => 'public-key', 'id' => $id],
                $schonDa
            ),
        ];
    }

    /** Was der Browser für `navigator.credentials.get` braucht. */
    public static function anmeldeOptionen(string $rpId, string $aufforderung, array $erlaubt = []): array
    {
        $o = [
            'challenge'        => $aufforderung,
            'rpId'             => $rpId,
            'timeout'          => 120000,
            'userVerification' => 'preferred',
        ];
        /* Leer lassen, wenn nichts bekannt ist: Dann sucht der Browser
           selbst einen passenden Schlüssel heraus, und die Anmeldung
           läuft ganz ohne Eingabe – der eigentliche Reiz an Passkeys. */
        if ($erlaubt) {
            $o['allowCredentials'] = array_map(
                static fn (string $id): array => ['type' => 'public-key', 'id' => $id],
                $erlaubt
            );
        }
        return $o;
    }

    /* -----------------------------------------------------------------
       Antworten prüfen
       ----------------------------------------------------------------- */

    /**
     * Registrierung. Gibt die Kennung des Schlüssels, den öffentlichen
     * Schlüssel als PEM und den Anfangszählerstand zurück.
     *
     * @return array{cred_id:string, pem:string, zaehler:int}
     */
    public static function neuPruefen(
        array $antwort,
        string $erwarteteAufforderung,
        string $erwarteteHerkunft,
        string $rpId
    ): array {
        $clientDaten = self::clientDatenPruefen(
            $antwort['clientDataJSON'] ?? '',
            'webauthn.create',
            $erwarteteAufforderung,
            $erwarteteHerkunft
        );

        $authDaten = b64u_dekodieren($antwort['attestationObject'] ?? '');
        if ($authDaten === '') {
            throw new WebauthnFehler('Die Antwort des Geräts fehlt.');
        }

        try {
            $att = Cbor::lesen($authDaten);
        } catch (CborFehler $e) {
            throw new WebauthnFehler('Die Antwort des Geräts ist unlesbar.');
        }
        if (!is_array($att) || !isset($att['s:authData']) || !is_string($att['s:authData'])) {
            throw new WebauthnFehler('Die Antwort des Geräts ist unvollständig.');
        }

        $auth = self::authDatenLesen($att['s:authData'], $rpId, false);

        if (!($auth['flags'] & self::FLAG_AT) || $auth['cred_id'] === null) {
            throw new WebauthnFehler('Das Gerät hat keinen Schlüssel mitgeschickt.');
        }

        $pem = self::coseZuPem($auth['cose']);

        return [
            'cred_id' => b64u_kodieren($auth['cred_id']),
            'pem'     => $pem,
            'zaehler' => $auth['zaehler'],
            'uv'      => (bool) ($auth['flags'] & self::FLAG_UV),
        ];
    }

    /**
     * Anmeldung. Prüft die Signatur gegen den hinterlegten Schlüssel.
     *
     * @return array{zaehler:int, uv:bool}
     */
    public static function anmeldungPruefen(
        array $antwort,
        string $pem,
        int $bekannterZaehler,
        string $erwarteteAufforderung,
        string $erwarteteHerkunft,
        string $rpId
    ): array {
        $clientRoh = b64u_dekodieren($antwort['clientDataJSON'] ?? '');
        self::clientDatenPruefen(
            $antwort['clientDataJSON'] ?? '',
            'webauthn.get',
            $erwarteteAufforderung,
            $erwarteteHerkunft
        );

        $authRoh = b64u_dekodieren($antwort['authenticatorData'] ?? '');
        $signatur = b64u_dekodieren($antwort['signature'] ?? '');
        if ($authRoh === '' || $signatur === '') {
            throw new WebauthnFehler('Die Antwort des Geräts ist unvollständig.');
        }

        $auth = self::authDatenLesen($authRoh, $rpId, true);

        /* Signiert wird über die Authenticator-Daten unverändert, gefolgt
           vom SHA-256 der Client-Daten. Beides zusammen bindet die
           Signatur an genau diese Aufforderung von genau dieser Seite. */
        $unterschrieben = $authRoh . hash('sha256', $clientRoh, true);

        $schluessel = openssl_pkey_get_public($pem);
        if ($schluessel === false) {
            throw new WebauthnFehler('Der hinterlegte Schlüssel ist unbrauchbar.');
        }
        $ok = openssl_verify($unterschrieben, $signatur, $schluessel, OPENSSL_ALGO_SHA256);
        if ($ok !== 1) {
            throw new WebauthnFehler('Die Signatur stimmt nicht.');
        }

        /* Der Zähler zählt, wie oft dieser Schlüssel benutzt wurde. Geräte,
           die ihn führen, erhöhen ihn bei jeder Anmeldung. Bleibt er bei
           null, führt das Gerät ihn nicht – das ist erlaubt und häufig
           (Apple etwa tut es nicht). Nur ein Rücksprung von einem echten
           Wert ist verdächtig: Dann existiert der Schlüssel zweimal. */
        if ($bekannterZaehler > 0 && $auth['zaehler'] > 0 && $auth['zaehler'] <= $bekannterZaehler) {
            throw new WebauthnFehler('Dieser Passkey wurde möglicherweise kopiert. '
                . 'Melde dich anders an und lösche ihn auf der Kontoseite.');
        }

        return [
            'zaehler' => $auth['zaehler'],
            'uv'      => (bool) ($auth['flags'] & self::FLAG_UV),
        ];
    }

    /* -----------------------------------------------------------------
       Die einzelnen Prüfungen
       ----------------------------------------------------------------- */

    private static function clientDatenPruefen(
        string $b64,
        string $erwarteterTyp,
        string $aufforderung,
        string $herkunft
    ): array {
        $roh = b64u_dekodieren($b64);
        if ($roh === '') {
            throw new WebauthnFehler('Die Client-Daten fehlen.');
        }
        $d = json_decode($roh, true);
        if (!is_array($d)) {
            throw new WebauthnFehler('Die Client-Daten sind unlesbar.');
        }

        if (($d['type'] ?? '') !== $erwarteterTyp) {
            /* Ohne diese Prüfung ließe sich eine Registrierungsantwort als
               Anmeldung ausgeben und umgekehrt. */
            throw new WebauthnFehler('Unerwarteter Vorgang.');
        }

        if (!gleich_sicher((string) ($d['challenge'] ?? ''), $aufforderung)) {
            throw new WebauthnFehler('Die Aufforderung passt nicht. Versuch es noch einmal.');
        }

        $kam = rtrim((string) ($d['origin'] ?? ''), '/');
        if (!gleich_sicher($kam, rtrim($herkunft, '/'))) {
            throw new WebauthnFehler('Diese Anmeldung kam von einer anderen Adresse.');
        }

        /* Ein Browser darf melden, dass die Seite in einem fremden Rahmen
           steckt. Dann ist sie es vermutlich nicht selbst, die fragt. */
        if (!empty($d['crossOrigin'])) {
            throw new WebauthnFehler('Anmeldung aus einem fremden Rahmen ist nicht zulässig.');
        }

        return $d;
    }

    /**
     * Zerlegt die Authenticator-Daten:
     *   32 Byte rpIdHash · 1 Byte Flags · 4 Byte Zähler
     *   und, wenn das AT-Bit gesetzt ist:
     *   16 Byte AAGUID · 2 Byte Länge · Kennung · COSE-Schlüssel
     */
    private static function authDatenLesen(string $roh, string $rpId, bool $nurKopf): array
    {
        if (strlen($roh) < 37) {
            throw new WebauthnFehler('Die Gerätedaten sind zu kurz.');
        }

        $rpHash = substr($roh, 0, 32);
        if (!gleich_sicher($rpHash, hash('sha256', $rpId, true))) {
            throw new WebauthnFehler('Dieser Passkey gehört zu einer anderen Adresse.');
        }

        $flags = ord($roh[32]);
        if (!($flags & self::FLAG_UP)) {
            throw new WebauthnFehler('Das Gerät meldet keine Anwesenheit. Bestätige die Abfrage am Gerät.');
        }

        $zaehler = unpack('N', substr($roh, 33, 4))[1];

        $erg = ['flags' => $flags, 'zaehler' => (int) $zaehler, 'cred_id' => null, 'cose' => null];

        if ($nurKopf || !($flags & self::FLAG_AT)) {
            return $erg;
        }

        if (strlen($roh) < 55) {
            throw new WebauthnFehler('Die Schlüsseldaten sind zu kurz.');
        }
        $laenge = unpack('n', substr($roh, 53, 2))[1];
        if ($laenge < 1 || $laenge > 1023 || strlen($roh) < 55 + $laenge) {
            throw new WebauthnFehler('Die Schlüsselkennung hat eine unmögliche Länge.');
        }
        $erg['cred_id'] = substr($roh, 55, $laenge);

        try {
            $erg['cose'] = Cbor::lesen(substr($roh, 55 + $laenge));
        } catch (CborFehler $e) {
            throw new WebauthnFehler('Der öffentliche Schlüssel ist unlesbar.');
        }
        if (!is_array($erg['cose'])) {
            throw new WebauthnFehler('Der öffentliche Schlüssel fehlt.');
        }

        return $erg;
    }

    /* -----------------------------------------------------------------
       COSE → PEM

       Das Gerät liefert den öffentlichen Schlüssel als COSE-Abbildung
       (RFC 8152). OpenSSL will PEM. Der Weg dazwischen führt über DER
       und ist in `Der` zusammengefasst – dieselben Bausteine braucht
       auch die Prüfung der Token von Google und Microsoft.
       ----------------------------------------------------------------- */

    private static function coseZuPem(array $cose): string
    {
        $kty = $cose[1] ?? null;
        $alg = $cose[3] ?? null;

        if ($kty === 2) {                       // EC2 – elliptische Kurve
            if ($alg !== -7) {
                throw new WebauthnFehler('Nicht unterstütztes Signaturverfahren (EC ' . var_export($alg, true) . ').');
            }
            if (($cose[-1] ?? null) !== 1) {
                throw new WebauthnFehler('Nur die Kurve P-256 wird unterstützt.');
            }
            $x = $cose[-2] ?? '';
            $y = $cose[-3] ?? '';
            if (!is_string($x) || !is_string($y) || strlen($x) !== 32 || strlen($y) !== 32) {
                throw new WebauthnFehler('Der Kurvenpunkt hat eine falsche Länge.');
            }
            return Der::p256Pem($x, $y);
        }

        if ($kty === 3) {                       // RSA
            if ($alg !== -257) {
                throw new WebauthnFehler('Nicht unterstütztes Signaturverfahren (RSA ' . var_export($alg, true) . ').');
            }
            $n = $cose[-1] ?? '';
            $e = $cose[-2] ?? '';
            if (!is_string($n) || !is_string($e) || strlen($n) < 128) {
                throw new WebauthnFehler('Der RSA-Schlüssel ist unbrauchbar.');
            }
            return Der::rsaPem($n, $e);
        }

        throw new WebauthnFehler('Unbekannte Schlüsselart.');
    }
}
