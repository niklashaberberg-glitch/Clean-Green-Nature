<?php
/* =====================================================================
   CBOR – so viel davon, wie WebAuthn braucht

   WebAuthn liefert den öffentlichen Schlüssel und die Attestierung in
   CBOR (RFC 8949), einem binären Format wie JSON, nur kompakt. Gebraucht
   wird davon der Lesepfad für die tatsächlich vorkommenden Typen:
   Zahlen, Zeichenketten, Bytefolgen, Listen, Abbildungen.

   Nicht unterstützt und auch nicht nötig: Gleitkomma, unbestimmte
   Längen, Datumsangaben. Was nicht vorkommen darf, wird abgelehnt statt
   erraten – ein Parser, der bei Unbekanntem weiterrät, ist der Anfang
   jeder Sicherheitslücke.
   ===================================================================== */

final class CborFehler extends RuntimeException
{
}

final class Cbor
{
    private string $roh;
    private int $pos = 0;
    private int $len;

    private function __construct(string $roh)
    {
        $this->roh = $roh;
        $this->len = strlen($roh);
    }

    /** Liest genau einen Wert und meldet, wie viele Bytes verbraucht
        wurden. WebAuthn hängt hinter das CBOR-Objekt manchmal weitere
        Daten – ohne diese Angabe wüsste man nicht, wo sie beginnen. */
    public static function lesen(string $roh, ?int &$verbraucht = null): mixed
    {
        $l = new self($roh);
        $wert = $l->wert();
        $verbraucht = $l->pos;
        return $wert;
    }

    private function byte(): int
    {
        if ($this->pos >= $this->len) {
            throw new CborFehler('CBOR endet zu früh.');
        }
        return ord($this->roh[$this->pos++]);
    }

    private function bytes(int $n): string
    {
        if ($n < 0 || $this->pos + $n > $this->len) {
            throw new CborFehler('CBOR: Länge greift über das Ende hinaus.');
        }
        $s = substr($this->roh, $this->pos, $n);
        $this->pos += $n;
        return $s;
    }

    /** Der Wert hinter dem Typ-Byte: entweder direkt darin (0–23) oder
        in den folgenden 1, 2, 4 oder 8 Bytes. */
    private function laenge(int $klein): int
    {
        if ($klein < 24) {
            return $klein;
        }
        if ($klein === 24) {
            return $this->byte();
        }
        if ($klein === 25) {
            $b = $this->bytes(2);
            return (ord($b[0]) << 8) | ord($b[1]);
        }
        if ($klein === 26) {
            $b = $this->bytes(4);
            return (ord($b[0]) << 24) | (ord($b[1]) << 16) | (ord($b[2]) << 8) | ord($b[3]);
        }
        if ($klein === 27) {
            $b = $this->bytes(8);
            $w = 0;
            for ($i = 0; $i < 8; $i++) {
                /* Über PHP_INT_MAX hinaus gäbe es stille Ungenauigkeiten.
                   In WebAuthn kommt so etwas nicht vor; erfundene Eingaben
                   sollen daran scheitern, nicht durchrutschen. */
                $w = $w * 256 + ord($b[$i]);
                if ($w > PHP_INT_MAX / 2) {
                    throw new CborFehler('CBOR: Zahl zu groß.');
                }
            }
            return $w;
        }
        throw new CborFehler('CBOR: unbestimmte Länge wird nicht unterstützt.');
    }

    private function wert(): mixed
    {
        $kopf  = $this->byte();
        $typ   = $kopf >> 5;
        $klein = $kopf & 0x1f;

        switch ($typ) {
            case 0:                                   // vorzeichenlose Zahl
                return $this->laenge($klein);

            case 1:                                   // negative Zahl
                return -1 - $this->laenge($klein);

            case 2:                                   // Bytefolge
                return $this->bytes($this->laenge($klein));

            case 3:                                   // Text
                return $this->bytes($this->laenge($klein));

            case 4:                                   // Liste
                $n = $this->laenge($klein);
                $a = [];
                for ($i = 0; $i < $n; $i++) {
                    $a[] = $this->wert();
                }
                return $a;

            case 5:                                   // Abbildung
                $n = $this->laenge($klein);
                $a = [];
                for ($i = 0; $i < $n; $i++) {
                    $s = $this->wert();
                    if (!is_int($s) && !is_string($s)) {
                        throw new CborFehler('CBOR: unzulässiger Schlüssel.');
                    }
                    /* PHP macht aus dem Schlüssel "1" stillschweigend die
                        Zahl 1. In COSE stehen negative Zahlen und Texte
                        nebeneinander, deshalb wird die Art mitgeführt. */
                    $a[is_int($s) ? $s : 's:' . $s] = $this->wert();
                }
                return $a;

            case 7:                                   // einfache Werte
                if ($klein === 20) {
                    return false;
                }
                if ($klein === 21) {
                    return true;
                }
                if ($klein === 22) {
                    return null;
                }
                throw new CborFehler('CBOR: einfacher Wert ' . $klein . ' wird nicht unterstützt.');

            default:
                throw new CborFehler('CBOR: Typ ' . $typ . ' wird nicht unterstützt.');
        }
    }
}
