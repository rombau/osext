-- Zat-Erhöhung war nicht richtig! Zat 2/22 fehlt leider
UPDATE Spielertraining SET Zat = Zat-1 
WHERE Saison*72+Zat <= 2*72+22;

UPDATE Spielertraining SET Faktor = 1.35 WHERE Id = 499 AND Saison = 2 AND Zat = 21;
UPDATE Spielertraining SET Faktor = 1 WHERE Id = 41930 AND Saison = 2 AND Zat = 21;
UPDATE Spielertraining SET Faktor = 1.35 WHERE Id = 502 AND Saison = 2 AND Zat = 21;
UPDATE Spielertraining SET Faktor = 1 WHERE Id = 506 AND Saison = 2 AND Zat = 21;
UPDATE Spielertraining SET Faktor = 1 WHERE Id = 507 AND Saison = 2 AND Zat = 21;
UPDATE Spielertraining SET Faktor = 1.35 WHERE Id = 22707 AND Saison = 2 AND Zat = 21;
UPDATE Spielertraining SET Faktor = 1.35 WHERE Id = 23515 AND Saison = 2 AND Zat = 21;
UPDATE Spielertraining SET Faktor = 1.1 WHERE Id = 42185 AND Saison = 2 AND Zat = 21;
UPDATE Spielertraining SET Faktor = 1.1 WHERE Id = 58642 AND Saison = 2 AND Zat = 21;
UPDATE Spielertraining SET Faktor = 1.35 WHERE Id = 509 AND Saison = 2 AND Zat = 21;
UPDATE Spielertraining SET Faktor = 1 WHERE Id = 510 AND Saison = 2 AND Zat = 21;
UPDATE Spielertraining SET Faktor = 1 WHERE Id = 55287 AND Saison = 2 AND Zat = 21;
UPDATE Spielertraining SET Faktor = 1.1 WHERE Id = 463 AND Saison = 2 AND Zat = 21;
UPDATE Spielertraining SET Faktor = 1.35 WHERE Id = 511 AND Saison = 2 AND Zat = 21;
UPDATE Spielertraining SET Faktor = 1.35 WHERE Id = 513 AND Saison = 2 AND Zat = 21;
UPDATE Spielertraining SET Faktor = 1 WHERE Id = 6053 AND Saison = 2 AND Zat = 21;
UPDATE Spielertraining SET Faktor = 1.35 WHERE Id = 29610 AND Saison = 2 AND Zat = 21;
UPDATE Spielertraining SET Faktor = 1 WHERE Id = 29637 AND Saison = 2 AND Zat = 21;
UPDATE Spielertraining SET Faktor = 1 WHERE Id = 29922 AND Saison = 2 AND Zat = 21;
UPDATE Spielertraining SET Faktor = 1 WHERE Id = 519 AND Saison = 2 AND Zat = 21;
UPDATE Spielertraining SET Faktor = 1.1 WHERE Id = 521 AND Saison = 2 AND Zat = 21;
UPDATE Spielertraining SET Faktor = 1.35 WHERE Id = 523 AND Saison = 2 AND Zat = 21;
UPDATE Spielertraining SET Faktor = 1.35 WHERE Id = 16952 AND Saison = 2 AND Zat = 21;
UPDATE Spielertraining SET Faktor = 1 WHERE Id = 55286 AND Saison = 2 AND Zat = 21;



INSERT INTO Spielertraining VALUES ("41930","2","22","5","76","19","1","99","3790","27.77","1.35","0");
INSERT INTO Spielertraining VALUES ("55631","2","21","0","19","17","6","20","333","73.71","1.1","1");
INSERT INTO Spielertraining VALUES ("55631","2","22","15","16","17","6","20","333","79.95","1.1","1");
INSERT INTO Spielertraining VALUES ("502","2","22","1","46","29","4","60","1848","18.38","1","0");
INSERT INTO Spielertraining VALUES ("506","2","22","3","72","23","1","99","3790","26.24","1.35","0");
INSERT INTO Spielertraining VALUES ("507","2","22","4","74","29","1","99","3790","12.28","1.35","0");
INSERT INTO Spielertraining VALUES ("22707","2","22","0","54","33","5","60","1584","8.4","1","0");
INSERT INTO Spielertraining VALUES ("23515","2","22","9","54","31","4","60","1584","10.32","1","0");
INSERT INTO Spielertraining VALUES ("42185","2","22","2","37","18","4","60","1584","73.45","1.1","0");
INSERT INTO Spielertraining VALUES ("58642","2","22","4","54","17","3","80","2960","59.81","1.1","0");
INSERT INTO Spielertraining VALUES ("509","2","22","0","54","32","4","60","1584","9.31","1","0");
INSERT INTO Spielertraining VALUES ("510","2","22","1","74","24","1","99","4422","19.77","1.35","1");
INSERT INTO Spielertraining VALUES ("55287","2","22","4","77","19","1","99","3790","26.27","1.35","1");
INSERT INTO Spielertraining VALUES ("463","2","22","3","49","21","5","60","1584","33.9","1.1","0");
INSERT INTO Spielertraining VALUES ("511","2","22","8","47","29","5","60","1584","17.58","1","0");
INSERT INTO Spielertraining VALUES ("513","2","22","11","74","29","2","99","4422","12.28","1.35","0");
INSERT INTO Spielertraining VALUES ("6053","2","22","3","62","21","3","80","2537","29.4","1.35","1");
INSERT INTO Spielertraining VALUES ("29610","2","22","1","74","30","2","99","4422","11.12","1.1","0");
INSERT INTO Spielertraining VALUES ("29637","2","22","3","59","29","3","80","2537","16.05","1","1");
INSERT INTO Spielertraining VALUES ("29922","2","22","9","73","23","2","99","3790","22.81","1.35","1");
INSERT INTO Spielertraining VALUES ("519","2","22","2","60","23","3","80","2960","27.04","1.1","1");
INSERT INTO Spielertraining VALUES ("521","2","22","2","33","19","5","60","1584","79.11","1.1","0");
INSERT INTO Spielertraining VALUES ("523","2","22","1","52","31","5","60","1584","11.4","1","1");
INSERT INTO Spielertraining VALUES ("16952","2","22","10","52","31","5","60","1584","11.4","1","0");
INSERT INTO Spielertraining VALUES ("29642","2","22","5","73","30","1","99","4422","11.7","1.35","0");
INSERT INTO Spielertraining VALUES ("29953","2","21","11","17","19","6","20","1584","67.4","1","0");
INSERT INTO Spielertraining VALUES ("29953","2","22","11","18","19","6","20","1584","64.73","1","1");
INSERT INTO Spielertraining VALUES ("55286","2","22","0","77","19","2","99","3790","26.27","1.35","0");

INSERT INTO Trainer VALUES ("6","1","0","20","1000","10000");


ALTER TABLE Spielertraining RENAME TO _Spielertraining;

CREATE VIEW IF NOT EXISTS Aufwertungen 
AS SELECT SW1.Id, SW1.Saison, SW1.Zat  
FROM Spielerwerte SW1, Spielerwerte SW2
WHERE SW1.Id >= 0
  AND SW1.Id = SW2.Id
  AND SW2.Saison*72+SW2.Zat =
  	(SELECT MAX(SW3.Saison*72+SW3.Zat) FROM Spielerwerte SW3 
  	 WHERE SW3.Id = SW1.Id AND SW3.Saison*72+SW3.Zat < SW1.Saison*72+SW1.Zat)
  AND SW1.Zat > 0
  AND ( SW1.SCH <> SW2.SCH
	  OR SW1.BAK <> SW2.BAK
	  OR SW1.KOB <> SW2.KOB
	  OR SW1.ZWK <> SW2.ZWK
	  OR SW1.DEC <> SW2.DEC
	  OR SW1.GES <> SW2.GES
	  OR SW1.AGG <> SW2.AGG
	  OR SW1.PAS <> SW2.PAS
	  OR SW1.AUS <> SW2.AUS
	  OR SW1.UEB <> SW2.UEB
	  OR SW1.ZUV <> SW2.ZUV )
ORDER BY 1,2,3;

CREATE VIEW IF NOT EXISTS Trainings 
AS SELECT ST.Id, ST.Saison, ST.Zat, ST.Skill, ST.Wert, SW."Alter", ST.Trainer, ST.TSkill, 
	ROUND(T.Gehalt/(7-ST.Saison+1)/5) AS TPreis, ST.Wahrscheinlichkeit, ST.Faktor, ST.Aufwertung
FROM Spielerwerte SW, _Spielertraining ST, Trainer T
WHERE T.Nr = ST.Trainer 
  AND T.Saison*72+T.Zat = 
  	(SELECT MAX(T2.Saison*72+T2.Zat) FROM Trainer T2 
  	 WHERE T2.Nr = ST.Trainer AND T2.Saison*72+T2.Zat <= ST.Saison*72+ST.Zat) 
  AND SW.Id = ST.Id 
  AND (SW.Saison*72+SW.Zat) = 
  	(SELECT MAX(SW2.Saison*72+SW2.Zat) FROM Spielerwerte SW2 
  	 WHERE SW2.Id = ST.Id AND SW2.Saison*72+SW2.Zat <= ST.Saison*72+ST.Zat);

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

INSERT INTO Spielertraining SELECT * FROM Trainings;

UPDATE Spielertraining SET Aufwertung = 0;

UPDATE Spielertraining SET Aufwertung = 1
WHERE (1000000*(Saison*72+Zat))+Id IN (SELECT (1000000*(Saison*72+Zat))+Id FROM Aufwertungen);

DROP TABLE _Spielertraining;

DROP VIEW Aufwertungen;
DROP VIEW Trainings;