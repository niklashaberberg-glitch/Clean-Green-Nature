<?php
/* Erzeugt api/schema.sql aus dem Modell in lib/schema.php.
   Aufruf: php api/schema-ausgeben.php
   Nötig ist die Datei nur für alle, die die Tabellen lieber selbst über
   phpMyAdmin anlegen – die Anwendung tut es beim ersten Aufruf sonst
   von allein. */

/* Nur von der Kommandozeile. Über das Web aufgerufen würde das Skript
   eine Datei in das Web-Verzeichnis schreiben – dafür gibt es keinen
   Grund, und Schreibzugriff aus dem Netz ist immer ein schlechter Anfang. */
if (PHP_SAPI !== 'cli') {
    http_response_code(403);
    exit('Nur von der Kommandozeile.');
}

require_once __DIR__ . '/lib/schema.php';

$kopf = "-- TrimmoTrade – Tabellen für die Anmeldung (MariaDB / MySQL)\n"
      . "-- Erzeugt aus api/lib/schema.php · Modellversion " . Schema::VERSION . "\n"
      . "--\n"
      . "-- Die Anwendung legt diese Tabellen beim ersten Aufruf selbst an.\n"
      . "-- Diese Datei ist für den Fall, dass der Datenbanknutzer keine\n"
      . "-- Tabellen anlegen darf – dann einmal über phpMyAdmin einspielen.\n\n";

$sql = $kopf;
foreach (Schema::anweisungen('mysql') as $a) {
    $sql .= rtrim($a) . ";\n\n";
}
$sql .= "INSERT INTO tt_stand (name, wert) VALUES ('schema', '" . Schema::VERSION . "')\n"
     .  "  ON DUPLICATE KEY UPDATE wert = VALUES(wert);\n";

file_put_contents(__DIR__ . '/schema.sql', $sql);
echo "api/schema.sql geschrieben (" . strlen($sql) . " Zeichen)\n";
