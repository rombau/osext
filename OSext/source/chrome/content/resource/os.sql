CREATE TABLE IF NOT EXISTS "SaisonZat" (		-- Letzter gespeicherter Zat
	"Saison" INTEGER NOT NULL, 
	"Zat" INTEGER NOT NULL,
	PRIMARY KEY ("Saison", "Zat") );
	
CREATE TABLE IF NOT EXISTS "Spieler" (
	"Id" INTEGER PRIMARY KEY NOT NULL, 
	"Position" VARCHAR NOT NULL,
	"Name" VARCHAR NOT NULL,
	"Land" VARCHAR NOT NULL,
	"Uefa" CHAR,								-- NULL=Uefa, '#'=NichtUefa	
	"Herkunft" INTEGER NOT NULL DEFAULT 0,		-- 0=Kauf, 1=Jugend, 2=Leihe
	"BlitzKz" INTEGER NOT NULL DEFAULT 0);

CREATE TABLE IF NOT EXISTS "Spielerwerte" (
	"Id" INTEGER NOT NULL,
	"Saison" INTEGER NOT NULL,
	"Zat" INTEGER NOT NULL,
	"Alter" INTEGER NOT NULL,
	"Aufstellung" VARCHAR,
	"Moral" INTEGER NOT NULL,
	"Fitness" INTEGER NOT NULL,
	"Skillschnitt" NUMERIC NOT NULL,
	"Opti" NUMERIC NOT NULL,
	"Sonderskills" VARCHAR,
	"Sperre" VARCHAR,
	"Verletzung" VARCHAR,
	"Status" INTEGER NOT NULL, 					-- 1=Aktiv, 2=Verliehen bzw. Nummer bei Jugendspielern
	"TStatus" CHAR,								-- 'L', 'A', 'T'
	"TSperre" INTEGER,							-- bzw. Leihdauer in ZAT (einmalig?)
	"Vertrag" INTEGER NOT NULL,
	"Gehalt" INTEGER NOT NULL,
	"Marktwert" INTEGER NOT NULL,
	"SCH" INTEGER NOT NULL,
	"BAK" INTEGER NOT NULL,
	"KOB" INTEGER NOT NULL,
	"ZWK" INTEGER NOT NULL,
	"DEC" INTEGER NOT NULL,
	"GES" INTEGER NOT NULL,
	"FUQ" INTEGER NOT NULL,
	"ERF" INTEGER NOT NULL,
	"AGG" INTEGER NOT NULL,
	"PAS" INTEGER NOT NULL,
	"AUS" INTEGER NOT NULL,
	"UEB" INTEGER NOT NULL,
	"WID" INTEGER NOT NULL,
	"SEL" INTEGER NOT NULL,
	"DIS" INTEGER NOT NULL,
	"ZUV" INTEGER NOT NULL,
	"EIN" INTEGER NOT NULL,
	PRIMARY KEY ("Id", "Saison", "Zat") );

CREATE TABLE IF NOT EXISTS "Trainer" (
	"Nr" INTEGER NOT NULL,
	"Saison" INTEGER NOT NULL,
	"Zat" INTEGER NOT NULL,
	"Skill" INTEGER NOT NULL,
	"Laufzeit" INTEGER NOT NULL,
	"Gehalt" INTEGER NOT NULL,
	PRIMARY KEY ("Nr", "Saison", "Zat") );

CREATE TABLE IF NOT EXISTS "Spielertraining" (
	"Id" INTEGER NOT NULL,
	"Saison" INTEGER NOT NULL,
	"Zat" INTEGER NOT NULL,						-- Training für Zat+1
	"Skill" INTEGER NOT NULL,					-- Arrayindex der Skills (0=SCH,1=BAK,etc.)
	"Wert" INTEGER NOT NULL,					-- Skillwert VOR Training
	"Alter" INTEGER NOT NULL,					-- Alter VOR Training
	"Trainer" INTEGER NOT NULL,					-- Trainernummer
	"TSkill" INTEGER NOT NULL,					-- Trainerskill
	"TPreis" INTEGER NOT NULL,					-- Trainerpreis pro Spieler
	"Wahrscheinlichkeit" NUMERIC NOT NULL,		-- VOR Training
	"Faktor" NUMERIC,							-- 1.0, 1.1, 1.25, 1.35
	"Aufwertung" INTEGER,						-- Training hat geklappt = 1
	PRIMARY KEY ("Id", "Saison", "Zat") );	

CREATE TABLE IF NOT EXISTS "Spieltage" (
	"Saison" INTEGER NOT NULL,
	"Zat" INTEGER NOT NULL,
	"Datum" VARCHAR,
	"Spielart" VARCHAR,
	"ort" VARCHAR,
	"Gegner" VARCHAR,
	"Gegnerid" INTEGER,
	"Zuseher" INTEGER,
	"Eintritt" INTEGER,
	"Stadioneinnahmen" INTEGER,
	"Stadionkosten" INTEGER,
	"Punktpraemie" INTEGER,
	"Torpraemie" INTEGER,
	"Tvgelder" INTEGER,
	"Fanartikel" INTEGER,
	"Grundpraemie" INTEGER,
	"Spielergehaelter" INTEGER,
	"Trainergehaelter" INTEGER,
	"Jugend" INTEGER,
	"Physio" INTEGER,
	"Summe" INTEGER,
	"Saldo" INTEGER,
	"Leihen" INTEGER,	
	PRIMARY KEY ("Saison", "Zat") );	

CREATE TABLE IF NOT EXISTS "Stadion" (
	"Saison" INTEGER NOT NULL,
	"Zat" INTEGER NOT NULL,
	"Steher" INTEGER NOT NULL,
	"Sitzer" INTEGER NOT NULL,
	"USteher" INTEGER NOT NULL,
	"USitzer" INTEGER NOT NULL,
	"Anzeigetafel" VARCHAR,
	"Rasenheizung" VARCHAR,
	PRIMARY KEY ("Saison", "Zat") );
	
DELETE FROM Spielertraining WHERE Zat > 72;
