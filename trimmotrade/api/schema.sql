-- TrimmoTrade – Tabellen für die Anmeldung (MariaDB / MySQL)
-- Erzeugt aus api/lib/schema.php · Modellversion 1
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

INSERT INTO tt_stand (name, wert) VALUES ('schema', '1')
  ON DUPLICATE KEY UPDATE wert = VALUES(wert);
