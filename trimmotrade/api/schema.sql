-- TrimmoTrade – Tabellen für die Anmeldung (MariaDB / MySQL)
-- Erzeugt aus api/lib/schema.php · Modellversion 3
--
-- Die Anwendung legt diese Tabellen beim ersten Aufruf selbst an.
-- Diese Datei ist für den Fall, dass der Datenbanknutzer keine
-- Tabellen anlegen darf – dann einmal über phpMyAdmin einspielen.

CREATE TABLE IF NOT EXISTS tt_konto (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  kennung VARCHAR(64) NOT NULL,
  mail VARCHAR(254) DEFAULT NULL,
  mail_bestaetigt TINYINT(1) NOT NULL DEFAULT 0,
  name VARCHAR(120) NOT NULL DEFAULT '',
  anbieter VARCHAR(20) NOT NULL DEFAULT 'mail',
  stufe INTEGER NOT NULL DEFAULT 0,
  gesperrt TINYINT(1) NOT NULL DEFAULT 0,
  angelegt BIGINT NOT NULL,
  gesehen BIGINT NOT NULL,
  UNIQUE (kennung),
  UNIQUE (mail)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS tt_fremd (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  konto_id BIGINT NOT NULL,
  anbieter VARCHAR(20) NOT NULL,
  fremd_id VARCHAR(255) NOT NULL,
  mail VARCHAR(254) NOT NULL DEFAULT '',
  angelegt BIGINT NOT NULL,
  UNIQUE (anbieter, fremd_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS tt_passkey (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  konto_id BIGINT NOT NULL,
  cred_id TEXT NOT NULL,
  cred_hash VARCHAR(64) NOT NULL,
  oeff_schluessel TEXT NOT NULL,
  zaehler BIGINT NOT NULL DEFAULT 0,
  geraet VARCHAR(120) NOT NULL DEFAULT '',
  angelegt BIGINT NOT NULL,
  gesehen BIGINT NOT NULL,
  UNIQUE (cred_hash)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS tt_sitzung (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  konto_id BIGINT NOT NULL,
  merkmal_hash VARCHAR(64) NOT NULL,
  ip VARCHAR(45) NOT NULL DEFAULT '',
  browser VARCHAR(200) NOT NULL DEFAULT '',
  angelegt BIGINT NOT NULL,
  gesehen BIGINT NOT NULL,
  laeuft_ab BIGINT NOT NULL,
  UNIQUE (merkmal_hash)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS tt_vorgang (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  kennung VARCHAR(64) NOT NULL,
  art VARCHAR(24) NOT NULL,
  bezug VARCHAR(254) NOT NULL DEFAULT '',
  geheim_hash VARCHAR(64) NOT NULL DEFAULT '',
  daten TEXT NOT NULL,
  versuche INTEGER NOT NULL DEFAULT 0,
  angelegt BIGINT NOT NULL,
  laeuft_ab BIGINT NOT NULL,
  UNIQUE (kennung)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS tt_versuch (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  schluessel VARCHAR(190) NOT NULL,
  wann BIGINT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS tt_inserat (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  kennung VARCHAR(40) NOT NULL,
  konto_id BIGINT NOT NULL,
  kind VARCHAR(12) NOT NULL DEFAULT 'miete',
  typ VARCHAR(16) NOT NULL DEFAULT 'wohnung',
  titel VARCHAR(200) NOT NULL DEFAULT '',
  stadt VARCHAR(80) NOT NULL DEFAULT '',
  viertel_key VARCHAR(60) NOT NULL DEFAULT '',
  lat DOUBLE NOT NULL DEFAULT 0,
  lng DOUBLE NOT NULL DEFAULT 0,
  zimmer DOUBLE NOT NULL DEFAULT 0,
  flaeche INTEGER NOT NULL DEFAULT 0,
  kalt INTEGER NOT NULL DEFAULT 0,
  warm INTEGER NOT NULL DEFAULT 0,
  kaufpreis INTEGER NOT NULL DEFAULT 0,
  frei_ab VARCHAR(10) NOT NULL DEFAULT '',
  bilder INTEGER NOT NULL DEFAULT 0,
  wg_gruendung TINYINT(1) NOT NULL DEFAULT 0,
  daten MEDIUMTEXT NOT NULL,
  stand VARCHAR(12) NOT NULL DEFAULT 'aktiv',
  aufrufe BIGINT NOT NULL DEFAULT 0,
  anfragen BIGINT NOT NULL DEFAULT 0,
  angelegt BIGINT NOT NULL,
  geaendert BIGINT NOT NULL,
  laeuft_ab BIGINT NOT NULL,
  erinnert BIGINT NOT NULL,
  UNIQUE (kennung)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS tt_bild (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  kennung VARCHAR(40) NOT NULL,
  inserat_id BIGINT NOT NULL,
  pos INTEGER NOT NULL DEFAULT 0,
  datei VARCHAR(100) NOT NULL,
  breite INTEGER NOT NULL DEFAULT 0,
  hoehe INTEGER NOT NULL DEFAULT 0,
  bytes INTEGER NOT NULL DEFAULT 0,
  angelegt BIGINT NOT NULL,
  UNIQUE (kennung)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS tt_anfrage (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  kennung VARCHAR(40) NOT NULL,
  inserat_id BIGINT NOT NULL,
  von_konto_id BIGINT NOT NULL DEFAULT 0,
  an_konto_id BIGINT NOT NULL DEFAULT 0,
  name VARCHAR(120) NOT NULL DEFAULT '',
  mail VARCHAR(254) NOT NULL DEFAULT '',
  telefon VARCHAR(40) NOT NULL DEFAULT '',
  text TEXT NOT NULL,
  eckdaten TEXT NOT NULL,
  vorne TINYINT(1) NOT NULL DEFAULT 0,
  stand VARCHAR(12) NOT NULL DEFAULT 'neu',
  angelegt BIGINT NOT NULL,
  gelesen BIGINT NOT NULL,
  UNIQUE (kennung)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS tt_auftrag (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  kennung VARCHAR(40) NOT NULL,
  konto_id BIGINT NOT NULL,
  name VARCHAR(120) NOT NULL DEFAULT '',
  filter TEXT NOT NULL,
  takt VARCHAR(10) NOT NULL DEFAULT 'taeglich',
  mail VARCHAR(254) NOT NULL DEFAULT '',
  ab_id BIGINT NOT NULL DEFAULT 0,
  treffer BIGINT NOT NULL DEFAULT 0,
  aus TINYINT(1) NOT NULL DEFAULT 0,
  abmelde_hash VARCHAR(64) NOT NULL DEFAULT '',
  angelegt BIGINT NOT NULL,
  gesendet BIGINT NOT NULL,
  UNIQUE (kennung)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS tt_meldung (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  kennung VARCHAR(40) NOT NULL,
  inserat_id BIGINT NOT NULL,
  konto_id BIGINT NOT NULL DEFAULT 0,
  mail VARCHAR(254) NOT NULL DEFAULT '',
  grund VARCHAR(40) NOT NULL DEFAULT '',
  text TEXT NOT NULL,
  stand VARCHAR(12) NOT NULL DEFAULT 'offen',
  entscheidung TEXT NOT NULL,
  angelegt BIGINT NOT NULL,
  erledigt BIGINT NOT NULL,
  UNIQUE (kennung)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS tt_gruppe (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  kennung VARCHAR(40) NOT NULL,
  inserat_id BIGINT NOT NULL DEFAULT 0,
  gruender_id BIGINT NOT NULL,
  name VARCHAR(120) NOT NULL DEFAULT '',
  ziel INTEGER NOT NULL DEFAULT 3,
  text TEXT NOT NULL,
  offen TINYINT(1) NOT NULL DEFAULT 0,
  stand VARCHAR(12) NOT NULL DEFAULT 'offen',
  anfrage_id BIGINT NOT NULL DEFAULT 0,
  angelegt BIGINT NOT NULL,
  geaendert BIGINT NOT NULL,
  laeuft_ab BIGINT NOT NULL,
  UNIQUE (kennung)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS tt_gruppe_person (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  kennung VARCHAR(40) NOT NULL,
  gruppe_id BIGINT NOT NULL,
  konto_id BIGINT NOT NULL,
  rolle VARCHAR(10) NOT NULL DEFAULT 'mitglied',
  stand VARCHAR(12) NOT NULL DEFAULT 'angefragt',
  vorstellung TEXT NOT NULL,
  eckdaten TEXT NOT NULL,
  angelegt BIGINT NOT NULL,
  entschieden BIGINT NOT NULL,
  UNIQUE (kennung),
  UNIQUE (gruppe_id, konto_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS tt_zaehler (
  tag VARCHAR(10) NOT NULL,
  name VARCHAR(60) NOT NULL,
  wert BIGINT NOT NULL DEFAULT 0,
  PRIMARY KEY (tag, name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS tt_stand (
  name VARCHAR(40) NOT NULL PRIMARY KEY,
  wert VARCHAR(190) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX IF NOT EXISTS ix_fremd_konto ON tt_fremd (konto_id);

CREATE INDEX IF NOT EXISTS ix_passkey_konto ON tt_passkey (konto_id);

CREATE INDEX IF NOT EXISTS ix_sitzung_konto ON tt_sitzung (konto_id);

CREATE INDEX IF NOT EXISTS ix_sitzung_ab ON tt_sitzung (laeuft_ab);

CREATE INDEX IF NOT EXISTS ix_vorgang_ab ON tt_vorgang (laeuft_ab);

CREATE INDEX IF NOT EXISTS ix_vorgang_bezug ON tt_vorgang (art, bezug);

CREATE INDEX IF NOT EXISTS ix_versuch ON tt_versuch (schluessel, wann);

CREATE INDEX IF NOT EXISTS ix_inserat_suche ON tt_inserat (stand, laeuft_ab);

CREATE INDEX IF NOT EXISTS ix_inserat_konto ON tt_inserat (konto_id);

CREATE INDEX IF NOT EXISTS ix_inserat_ort ON tt_inserat (viertel_key, stand);

CREATE INDEX IF NOT EXISTS ix_bild_inserat ON tt_bild (inserat_id, pos);

CREATE INDEX IF NOT EXISTS ix_anfrage_an ON tt_anfrage (an_konto_id, angelegt);

CREATE INDEX IF NOT EXISTS ix_anfrage_von ON tt_anfrage (von_konto_id, angelegt);

CREATE INDEX IF NOT EXISTS ix_anfrage_inserat ON tt_anfrage (inserat_id);

CREATE INDEX IF NOT EXISTS ix_auftrag_konto ON tt_auftrag (konto_id);

CREATE INDEX IF NOT EXISTS ix_auftrag_lauf ON tt_auftrag (aus, gesendet);

CREATE INDEX IF NOT EXISTS ix_meldung_stand ON tt_meldung (stand, angelegt);

CREATE INDEX IF NOT EXISTS ix_gruppe_inserat ON tt_gruppe (inserat_id, stand);

CREATE INDEX IF NOT EXISTS ix_gruppe_gruender ON tt_gruppe (gruender_id);

CREATE INDEX IF NOT EXISTS ix_person_gruppe ON tt_gruppe_person (gruppe_id, stand);

CREATE INDEX IF NOT EXISTS ix_person_konto ON tt_gruppe_person (konto_id);

INSERT INTO tt_stand (name, wert) VALUES ('schema', '3')
  ON DUPLICATE KEY UPDATE wert = VALUES(wert);
