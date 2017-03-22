/**
 * Klasse für Datenbankzugriffe.
 * 
 * @constructor
 */
OSext.Database = function (preferences, sql) {
	
	this.sql = sql;
	if (!this.sql && OSext.Sqlite) {
		this.sql = new OSext.Sqlite(preferences);
	}
};

OSext.Database.prototype = {

	/**
	 * Liefert {@code true}, wenn das Result-Array befüllt ist.
	 * 
	 * @param {Array} result
	 * @returns {Boolean}
	 */
	isNotEmpty : function (result) {
		return (result && result.length > 0);
	},	
		
	/**
	 * Liefert den ersten {@code OSext.Termin} aus der Tabelle Spielerwerte.
	 * 
	 * @return Ersten gespeicherten {@code OSext.Termin}
	 */
	getMinTermin : function () {

		var result = this.sql.executeSql("SELECT DISTINCT Saison, Zat FROM Spielerwerte " +
				"WHERE (Saison * " + OSext.ZATS_PRO_SAISON + " + Zat) = (SELECT MIN(Saison * " + OSext.ZATS_PRO_SAISON + " + Zat) FROM Spielerwerte)");
		if (this.isNotEmpty(result)) {
			return new OSext.Termin(result[0].Saison, result[0].Zat);
		}
		return null;
	},

	/**
	 * Liefert den letzten {@code OSext.Termin} aus der Tabelle Spielerwerte.
	 * 
	 * @return Letzten gespeicherten {@code OSext.Termin}
	 */
	getMaxTermin : function () {
		
		var result = this.sql.executeSql("SELECT DISTINCT Saison, Zat FROM Spielerwerte " +
				"WHERE (Saison * " + OSext.ZATS_PRO_SAISON + " + Zat) = (SELECT MAX(Saison * " + OSext.ZATS_PRO_SAISON + " + Zat) FROM Spielerwerte)");
		if (this.isNotEmpty(result)) {
			return new OSext.Termin(result[0].Saison, result[0].Zat);
		}
		return null;
	},
	
	/**
	 * Liefert eine Liste von {@code OSext.Spieltag}en der {@code saison} aus der Tabelle
	 * Spieltage.
	 * 
	 * @param {Number} saison Die gewünschte Saison
	 * @return {Array} Liste mit Spieltagen
	 */
	getSpieltage : function (saison) {

		var result, r, colname, spieltag, spieltage = [];
		
		result = this.sql.executeSql("SELECT * FROM Spieltage WHERE Saison = " + saison + " ORDER BY Zat ");
		if (this.isNotEmpty(result)) {
			for (r = 0; r < result.length; r++) {
				spieltag = new OSext.Spieltag(result[r].Saison, result[r].Zat);
				spieltag.gegner = new OSext.Team(result[r].Gegnerid, result[r].Gegner);
				for (colname in result[r]) {
					if (result[r][colname] !== null) {
						if ("Saison;Zat;Gegnerid;Gegner".indexOf(colname) == -1) {
							spieltag[colname.toLowerCase()] = result[r][colname];
						}
					}
				}
				spieltage.push(spieltag);
			}
		}
		return spieltage;
	},
	
	/**
	 * Liefert eine Liste der {@code OSext.Kaderspieler} zum {@code OSext.Termin} aus der Tabelle
	 * Spieler, Spielerwerte und Spielertraining.
	 * <p>
	 * Wurde kein {@code OSext.Termin} angegeben, wird der erste Eintrag des jeweiligen Spielers
	 * ausgelesen.
	 * 
	 * @param {OSext.Termin} termin - Der gewünschte {@code OSext.Termin} (optional)
	 * 
	 * @return Liste von {@code OSext.Kaderspieler}n
	 */
	getKaderspielerListe : function (termin) {

		var result, r, skill, colname, spieler, spielerliste = [];
		
		result = this.sql.executeSql("SELECT S.*, SW.*, ST.* " + 
			"FROM (Spieler S INNER JOIN Spielerwerte SW ON S.Id = SW.Id) " +
			" LEFT OUTER JOIN Spielertraining ST ON S.Id = ST.Id AND ST.Saison = SW.Saison AND ST.Zat = SW.Zat " +  
			"WHERE S.Id > 0 AND (SW.Saison * " + OSext.ZATS_PRO_SAISON + " + SW.Zat) = " + termin.getZats());
		
		if (this.isNotEmpty(result)) {
			for (r = 0; r < result.length; r++) {
				spieler = new OSext.Kaderspieler();
				
				spieler.pos = result[r].Position;
				if (result[r].BlitzKz) {
					spieler.blitzzat = result[r].BlitzKz;
				}
				spieler.mw = result[r].Marktwert;

				for (skill in OSext.SKILL) {
					if (OSext.SKILL.hasOwnProperty(skill)) {
						spieler.skills[OSext.SKILL[skill]] = result[r][skill];
					}
				}
				spieler.getSonderskills();
				spieler.setSperren(result[r].Sperre);
				
				for (colname in result[r]) {
					if (result[r][colname] !== null && result[r][colname] !== "") {
						if (("Position;Marktwert;Sonderskills;Sperre;BlitzKz;Geburtstag;GebAktuell;" +
								"SCH;BAK;KOB;ZWK;DEC;GES;FUQ;ERF;AGG;PAS;AUS;UEB;WID;SEL;DIS;ZUV;EIN;" +
								"Saison;Zat;Skill;Wert;Trainer;Tskill;Tpreis;Wahrscheinlichkeit;Faktor;Aufwertung").indexOf(colname) == -1) {
							spieler[colname.toLowerCase()] = result[r][colname];
						}
					}
				}
				
				spieler.training.aktuell = new OSext.Training(spieler);
				spieler.training.aktuell.trainer = new OSext.Trainer();
				spieler.training.aktuell.trainer.skill = result[r].TSkill;
				spieler.training.aktuell.trainernr = result[r].Trainer;
				spieler.training.aktuell.skillidx = result[r].Skill;
				spieler.training.aktuell.wahrscheinlichkeit = result[r].Wahrscheinlichkeit;
				spieler.training.aktuell.faktor = result[r].Faktor; 
				spieler.training.aktuell.aufwertung = result[r].Aufwertung;
				
				spielerliste.push(spieler);
			}
			this.initKaderspielerSummen(spielerliste, null, termin);
		}
		return spielerliste;
	},

	/**
	 * Liefert eine Liste der {@code OSext.Jugendspieler} zum {@code OSext.Termin} aus der Tabelle
	 * Spieler und Spielerwerte.
	 * <p>
	 * Wurde kein {@code OSext.Termin} angegeben, wird der erste Eintrag des jeweiligen Spielers
	 * ausgelesen.
	 * 
	 * @param {OSext.Termin} termin - Der gewünschte {@code OSext.Termin} (optional)
	 * 
	 * @return Liste von {@code OSext.Jugendspieler}n
	 */
	getJugendspielerListe : function (termin) {

		var result, r, skill, colname, spieler, spielerliste = [];
		
		result = this.sql.executeSql("SELECT S.*, SW.* " +
			"FROM Spieler S INNER JOIN Spielerwerte SW ON S.Id = SW.Id " +
			"WHERE S.Id < 0 AND (SW.Saison * " + OSext.ZATS_PRO_SAISON + " + SW.Zat) = " + termin.getZats());

		if (this.isNotEmpty(result)) {
			for (r = 0; r < result.length; r++) {
				spieler = new OSext.Jugendspieler();
				
				spieler.pos = result[r].Position; 
				spieler.talent = result[r].Name;
				spieler.nr = result[r].Status;
				spieler.mw = result[r].Marktwert;

				for (skill in OSext.SKILL) {
					if (OSext.SKILL.hasOwnProperty(skill)) {
						spieler.skills[OSext.SKILL[skill]] = result[r][skill];
					}
				}
				spieler.getSonderskills();

				for (colname in result[r]) {
					if (result[r][colname] !== null && result[r][colname] !== "") {
						if (("Saison;Zat;Position;Name;Status;Herkunft;BlitzKz;Marktwert;Aufstellung;Moral;Fitness;Sonderskills;Sperre;Verletzung;TSperre;TStatus;Vertrag;Gehalt;" +
								"SCH;BAK;KOB;ZWK;DEC;GES;FUQ;ERF;AGG;PAS;AUS;UEB;WID;SEL;DIS;ZUV;EIN").indexOf(colname) == -1) {
							spieler[colname.toLowerCase()] = result[r][colname];
						}
					}
				}
				
				spielerliste.push(spieler);
			}
			this.initJugendspielerSummen(spielerliste, null, termin);
		}
		return spielerliste;
	},

	/**
	 * Liefert die Wahrscheinlichkeit aus der Tabelle Spielertraining.
	 * 
	 * @param {Number} tskill
	 * @param {Number} alter
	 * @param {Number} wert
	 * 
	 * @return Prozentwert der gespeicherten Wahrscheinlichkeit
	 */
	getWahrscheinlichkeit : function (tskill, alter, wert) {
		
		var result = this.sql.executeSql("SELECT Wahrscheinlichkeit FROM Spielertraining " +
				"WHERE TSkill = " + tskill + " AND \"Alter\" = " + alter + " AND Wert = " + wert +
						" ORDER BY Saison * " + OSext.ZATS_PRO_SAISON + " + Zat DESC");
		if (this.isNotEmpty(result)) {
			return result[0].Wahrscheinlichkeit;
		}
		return null;
	},
	
	/**
	 * Initialisiert den Saisonplan mit den gespeicherten Spieltagen.
	 * 
	 * @param saisonplan Liste der {@code OSext.Spieltag}e
	 */
	initSaisonplan : function (saisonplan) {
		
		var s, spieltage = this.getSpieltage(saisonplan[1].termin.saison);
		
		for (s = 0; s < spieltage.length; s++) {
			saisonplan[s + 1] = spieltage[s];
		}
	},
	
	/**
	 * Initialisiert die Ids der Jugendspielers.
	 * <p>
	 * Um Jugendspieler zu identifizieren, werden alle unveränderlichen Werte des Spielers
	 * herangezogen.
	 * <p>
	 * Ist der Jugendspieler noch nicht bekannt, wird die nächstkleinere negative Id ermittelt und
	 * verwendet.
	 * 
	 * @param {Array} spielerliste - Liste von {@code OSext.Jugendspieler}n
	 */
	initJugendspielerIDs : function (spielerliste) {
		
		var s, spieler, result, newID = 0;
		
		result = this.sql.executeSql("SELECT MIN(Id) AS Id FROM Spieler");
		if (this.isNotEmpty(result)) {
			newID = +result[0].Id;
		} else {
			newID = 0;
		}
		
		for (s = 0; s < spielerliste.length; s++) {
			spieler = spielerliste[s];
			
			result = this.sql.executeSql("SELECT S.Id AS Id " +
				"FROM Spieler S INNER JOIN Spielerwerte SW ON S.Id = SW.Id " +
				"WHERE S.Id < 0 " +
				" AND SW.WID = " + spieler.skills[OSext.SKILL.WID] + 
				" AND SW.SEL = " + spieler.skills[OSext.SKILL.SEL] +
				" AND SW.DIS = " + spieler.skills[OSext.SKILL.DIS] +
				" AND SW.EIN = " + spieler.skills[OSext.SKILL.EIN] +
				" AND S.Land = :land " +
				" AND S.Name = :talent ",
				[spieler.land, spieler.talent]);
			
			if (this.isNotEmpty(result)) {
				spieler.id = +result[0].Id;
			} else {
				spieler.id = --newID;
			}
			OSext.Log.log(["Jugendspieler-ID", spieler.id])
		}	
	},

	/**
	 * Initialisiert die globalen Einstellung der angegebenen Kaderspieler, und die
	 * Trainingseinstellung des vergangenen (aktuellen) Spieltags
	 * 
	 * @param {Array} spielerliste - Die Spieler, dessen Einstellung ermittelt werden soll
	 * @param {OSext.Termin} termin - Der gewünschte {@code OSext.Termin}
	 */
	initKaderspielerZusatzwerte : function (spielerliste, termin) {
		
		var result, s, spieler, 
			subtermin = new OSext.Termin(termin.saison, termin.zat).subtractZats(OSext.ZATS_PRO_SAISON);
		
		result = this.sql.executeSql("SELECT S.Id, S.Herkunft, S.BlitzKz, " +
				"ST.TSkill, ST.Trainer, ST.Skill, ST.Wahrscheinlichkeit, " +
				"(MAX(SW.FUQ) - MIN(SW.FUQ)) * " + OSext.ZATS_PRO_SAISON + " / COUNT(SW.FUQ) AS FUQ, " +
				"(MAX(SW.ERF) - MIN(SW.ERF)) * " + OSext.ZATS_PRO_SAISON + " / COUNT(SW.ERF) AS ERF " +
				"FROM Spieler S LEFT OUTER JOIN Spielertraining ST ON " +
					"S.Id = ST.Id AND (ST.Saison * " + OSext.ZATS_PRO_SAISON + " + ST.Zat) = " + termin.getZats() + " " +
						"LEFT OUTER JOIN Spielerwerte SW ON " +
							"S.Id = SW.Id AND (SW.Saison * " + OSext.ZATS_PRO_SAISON + " + SW.Zat) > " + subtermin.getZats() + " " +
				"WHERE S.Id > 0 " + 
				"GROUP BY S.Id, S.Herkunft, S.BlitzKz, ST.TSkill, ST.Trainer, ST.Skill, ST.Wahrscheinlichkeit ");
	
		if (this.isNotEmpty(result)) {
			for (s = 0; s < spielerliste.length; s++) {
				spieler = OSext.getListElement(result, "Id", spielerliste[s].id);
				if (spieler) {
					spielerliste[s].herkunft = spieler.Herkunft;
					spielerliste[s].blitzzat = spieler.BlitzKz;
					spielerliste[s].fuqprosaison = spieler.FUQ;
					spielerliste[s].erfprosaison = spieler.ERF;
					if (spieler.Trainer && spieler.TSkill) {
						spielerliste[s].training.aktuell.trainer = new OSext.Trainer();
						spielerliste[s].training.aktuell.trainer.skill = spieler.TSkill;
						spielerliste[s].training.aktuell.trainernr = spieler.Trainer;
						spielerliste[s].training.aktuell.skillidx = spieler.Skill;
						spielerliste[s].training.aktuell.wahrscheinlichkeit = spieler.Wahrscheinlichkeit;
					}
				}
			}
		}
	},
	
	/**
	 * Initialisiert die Geburtstage der angegebenen Kaderspieler.
	 * 
	 * @param {Array} spielerliste - Die Spieler, dessen Einstellung ermittelt werden soll
	 */
	initKaderspielerGeburtstage : function (spielerliste) {

		var result, s, spieler;
	
		if (this.sql) {
			result = this.sql.executeSql("SELECT Id, Geburtstag, GebAktuell FROM Spieler WHERE Id > 0");
		
			if (this.isNotEmpty(result)) {
				for (s = 0; s < spielerliste.length; s++) {
					spieler = OSext.getListElement(result, "Id", spielerliste[s].id);
					if (spieler) {
						spielerliste[s].geburtstag = spieler.Geburtstag;
						spielerliste[s].gebaktuell = spieler.GebAktuell;
					}
				}
			}
		}
	},
		
	/**
	 * Initialisiert eine Kaderspielerliste mit Summen in eines angegebenen Zeitraums aus der
	 * Tabelle Spielerwerte und Spielertraining.
	 * <p>
	 * Wurde kein Zeitraum angegeben, werden alle Werte summiert.
	 * 
	 * @param {Array} spielerliste - Die Spielerliste, die um Summen ergänzt werden soll
	 * @param {OSext.Termin} von - Der gewünschte Beginn (optional)
	 * @param {OSext.Termin} bis - Das gewünschte Ende (optional)
	 * 
	 */
	initKaderspielerSummen : function (spielerliste, von, bis) {

		var where, result, result2, s, summen,
			zatMwUpdate = OSext.ZATS_PRO_SAISON * 10;

		where = "WHERE S.Id > 0 ";
		if (von && bis) {
			where += "AND (SW.Saison * " + OSext.ZATS_PRO_SAISON + " + SW.Zat) BETWEEN " + von.getZats() + " AND " + bis.getZats();
		} else if (von) {
			where += "AND (SW.Saison * " + OSext.ZATS_PRO_SAISON + " + SW.Zat) >= " + von.getZats();
		} else if (bis) {
			where += "AND (SW.Saison * " + OSext.ZATS_PRO_SAISON + " + SW.Zat) <= " + bis.getZats();
		}
				
		result = this.sql.executeSql("SELECT S.Id AS Id, " + 
			" MAX(SW.Saison * " + OSext.ZATS_PRO_SAISON + " + SW.Zat) AS MaxZat, " +
			" MIN(SW.Saison * " + OSext.ZATS_PRO_SAISON + " + SW.Zat) AS MinZat, " + 
			" SUM(SW.Gehalt) / COUNT(SW.Gehalt) AS Gehaltsschnitt, " +
			" SUM(ST.Aufwertung) AS Aufwertungen, " +
			" COUNT(ST.Id) AS Trainingszats, " +
			" SUM(ST.TPreis) AS Trainingskosten, " + 
			" SUM(ST.Wahrscheinlichkeit * ST.Faktor) / COUNT(ST.Wahrscheinlichkeit * ST.Faktor) AS Wahrscheinlichkeit " +
			"FROM (Spieler S INNER JOIN Spielerwerte SW ON S.Id = SW.Id) " +
			" LEFT OUTER JOIN Spielertraining ST ON S.Id = ST.Id AND ST.Saison = SW.Saison AND ST.Zat = SW.Zat " +  
			where + " GROUP BY S.Id ");
		
		if (this.isNotEmpty(result)) {
			for (s = 0; s < spielerliste.length; s++) {
				summen = OSext.getListElement(result, "Id", spielerliste[s].id);
				if (summen) {		
					spielerliste[s].kaderzats = summen.MaxZat - summen.MinZat;
					spielerliste[s].mwzuwachs = 0;
					spielerliste[s].gehaelter = Math.round(summen.Gehaltsschnitt * spielerliste[s].kaderzats / OSext.ZATS_PRO_MONAT);
					spielerliste[s].trainingszats = summen.Trainingszats;
					spielerliste[s].trainingskosten = summen.Trainingskosten || 0;
					spielerliste[s].istaufwertungen = summen.Aufwertungen || 0;
					spielerliste[s].sollaufwertungenproz = summen.Wahrscheinlichkeit || 0;
					spielerliste[s].sollaufwertungen = Math.round(spielerliste[s].trainingszats * spielerliste[s].sollaufwertungenproz / 100);
					spielerliste[s].istaufwertungenproz = +(spielerliste[s].istaufwertungen / spielerliste[s].trainingszats * 100).toFixed(2);
					
					result2 = this.sql.executeSql("SELECT Marktwert FROM Spielerwerte WHERE Id = " + spielerliste[s].id +
							" AND (Saison * " + OSext.ZATS_PRO_SAISON + " + Zat) " +
							" IN (" + summen.MinZat + "," + (zatMwUpdate - 1) + "," + zatMwUpdate + "," + summen.MaxZat + ")" +
							" ORDER BY (Saison * " + OSext.ZATS_PRO_SAISON + " + Zat)");
					if (result2) {
						if (result2.length > 3) {
							spielerliste[s].mwzuwachs = (result2[result2.length-1].Marktwert - result2[0].Marktwert)
								 - (result2[2].Marktwert - result2[1].Marktwert);
						}
						else if (result2.length > 2) {
							spielerliste[s].mwzuwachs = (result2[result2.length-1].Marktwert - result2[0].Marktwert)
								 - (result2[1].Marktwert - result2[0].Marktwert);
						}
						else {
							spielerliste[s].mwzuwachs = 0;
						}
					}
				}
			}
		}
	},

	/**
	 * Initialisiert eine Jugendspielerliste mit Summen in eines angegebenen Zeitraums aus der
	 * Tabelle Spielerwerte.
	 * <p>
	 * Wurde kein Zeitraum angegeben, werden alle Werte summiert.
	 * 
	 * @param {Array} spielerliste - Die Spielerliste, die um Summen ergänzt werden soll
	 * @param {OSext.Termin} von - Der gewünschte Beginn (optional)
	 * @param {OSext.Termin} bis - Das gewünschte Ende (optional)
	 * 
	 */
	initJugendspielerSummen : function (spielerliste, von, bis) {

		var where, result, s, summen;

		where = "WHERE S.Id < 0 ";
		if (von && bis) {
			where += "AND (SW.Saison * " + OSext.ZATS_PRO_SAISON + " + SW.Zat) BETWEEN " + von.getZats() + " AND " + bis.getZats();
		} else if (von) {
			where += "AND (SW.Saison * " + OSext.ZATS_PRO_SAISON + " + SW.Zat) >= " + von.getZats();
		} else if (bis) {
			where += "AND (SW.Saison * " + OSext.ZATS_PRO_SAISON + " + SW.Zat) <= " + bis.getZats();
		}
		 
		result = this.sql.executeSql("SELECT S.Id AS Id, S.Geburtstag AS Geburtstag, " +
			" MAX(SW.\"Alter\") AS MaxAlter, " +
			" MIN(SW.Saison * " + OSext.ZATS_PRO_SAISON + " + SW.Zat) AS MinZat, " +
			" MAX(SW.Saison * " + OSext.ZATS_PRO_SAISON + " + SW.Zat) " +
			" - MIN(SW.Saison * " + OSext.ZATS_PRO_SAISON + " + SW.Zat) AS Zats, " + 
			" MAX(SW.Marktwert) - MIN(SW.Marktwert) AS Marktwertzuwachs, " +
			" SUM(SW.Gehalt) / COUNT(SW.Gehalt) AS Gehaltsschnitt, " +
			" MAX(SW.SCH + SW.BAK + SW.KOB + SW.ZWK + SW.DEC + SW.GES + SW.AGG + SW.PAS + SW.AUS + SW.UEB + SW.ZUV) " +
			" - MIN(SW.SCH + SW.BAK + SW.KOB + SW.ZWK + SW.DEC + SW.GES + SW.AGG + SW.PAS + SW.AUS + SW.UEB + SW.ZUV) AS Aufwertungen " +
			"FROM Spieler S INNER JOIN Spielerwerte SW ON S.Id = SW.Id " +
			where + " GROUP BY S.Id ");
		
		if (this.isNotEmpty(result)) {
			for (s = 0; s < spielerliste.length; s++) {
				summen = OSext.getListElement(result, "Id", spielerliste[s].id);
				if (summen) {
					if (summen.MaxAlter < OSext.MIN_JUGEND_ALTER) {
						spielerliste[s].kaderzats = 0;
						spielerliste[s].foerderung = 0;
						spielerliste[s].mwzuwachs = 0;
						spielerliste[s].gesamtaufwertungen = 0;
					} else {
						if (summen.MinZat == 142) {
							// Erste Saison nur 70 Zats (72 + 70 = 142)
							spielerliste[s].kaderzats = summen.Zats - 2;
						} else if (summen.MinZat >= 720 && summen.Zats) {
							// Spieler fange erst am Geburtstag zum Trainieren an
							spielerliste[s].kaderzats = summen.Zats - summen.Geburtstag + (summen.MinZat % OSext.ZATS_PRO_SAISON);
							OSext.Log.log([summen.Zats,summen.Geburtstag,(summen.MinZat % OSext.ZATS_PRO_SAISON), spielerliste[s].kaderzats]);
						} else {
							spielerliste[s].kaderzats = summen.Zats;
						}
						spielerliste[s].foerderung = summen.Zats ? summen.Gehaltsschnitt : 0;
						spielerliste[s].mwzuwachs = summen.Zats ? summen.Marktwertzuwachs : 0;
						spielerliste[s].gesamtaufwertungen = summen.Aufwertungen;
					}
				}
			}
		}
	},
	
	/**
	 * Speichert alle {@code OSext.Trainer} der übergebenen Liste in der Datenbank.
	 * 
	 * @param {Array} trainerliste - Die Liste der Trainer
	 * @param {OSext.Termin} termin - Aktueller Zeitpunkt
	 */
	saveTrainer : function (trainerliste, termin) {

		var t, trainer;
		
		for (t = 1; t < trainerliste.length; t++) {
			trainer = trainerliste[t];
			this.sql.executeSql(
				"REPLACE INTO Trainer VALUES " +
				"(:nr, :saison, :zat, :skill, :laufzeit, :gehalt )",
				[t, termin.saison, termin.zat, 
				 trainer.skill, trainer.vertrag, trainer.gehalt]);
		}
	},
	
	/**
	 * Speichert die Trainingseinstellungen der übergebenen Spieler in der Datenbank.
	 * 
	 * @param {Array} spielerliste - Die Liste der Spieler
	 * @param {OSext.Termin} termin - Aktueller Zeitpunkt
	 */
	saveTraining : function (spielerliste, termin) {

		var s, spieler, trainerpreis;
		
		termin.addZats(1);
		
		for (s = 0; s < spielerliste.length; s++) {
			spieler = spielerliste[s];

			if (spieler.training.plan.trainer) {
				
				trainerpreis = Math.round(spieler.training.plan.trainer.gehalt / OSext.ZATS_PRO_MONAT / 5);
				
				this.sql.executeSql(
					"REPLACE INTO Spielertraining VALUES " +
					"(:id, :saison, :zat, :skill, :wert, :alter, :trainer, " +
					" :tskill, :tpreis, :wahrscheinlichkeit, :faktor, :aufwertung )",
					[spieler.id, termin.saison, termin.zat,
					 spieler.training.plan.skillidx, spieler.skills[spieler.training.plan.skillidx], 
					 spieler.alter, spieler.training.plan.trainernr, spieler.training.plan.trainer.skill, 
					 trainerpreis, spieler.training.plan.wahrscheinlichkeit, 1, 0]);
			}
			else {
				this.sql.executeSql(
						"DELETE FROM Spielertraining WHERE id = :id AND saison = :saison AND zat = :zat",
						[spieler.id, termin.saison, termin.zat]);
			}
		}

		termin.subtractZats(1);
	},
	
	/**
	 * Speichert die Daten der übergebenen Spieler in der Datenbank.
	 * 
	 * @param {Array} spielerliste
	 * @param {OSext.Termin} termin
	 */
	saveKaderspieler : function (spielerliste, termin) {

		var s, spieler;
		
		for (s = 0; s < spielerliste.length; s++) {
			spieler = spielerliste[s];

			this.sql.executeSql(
				"REPLACE INTO Spieler VALUES " +
				"(:id, :position, :name, :land, :uefa, :herkunft, :blitzkz, :geburtstag, :gebaktuell)",
				[spieler.id, spieler.pos, spieler.name, 
				 spieler.land, spieler.uefa, spieler.herkunft, spieler.blitzzat, spieler.geburtstag, spieler.gebaktuell]);
			
			this.sql.executeSql(
				"REPLACE INTO Spielerwerte VALUES " +
				"(:id, :saison, :zat, :alter, :aufstellung, :moral, :fitness, :ss, :opti, " +
				" :sonderskills, :sperre, :verletzung, :status, :tstatus, :tsperre, " +
				" :vertrag, :gehalt, :marktwert, " +
				" :sch, :bak, :kob, :zwk, :dec, :ges, :fuq, :erf, :agg, " +
				" :pas, :aus, :ueb, :wid, :sel, :dis, :zuv, :ein )",
				[ spieler.id, termin.saison, termin.zat,
				  spieler.alter, spieler.aufstellung, spieler.moral, spieler.fitness, spieler.skillschnitt, spieler.opti,
				  spieler.getSonderskillsText(), spieler.getSperrenText(), 
				  spieler.verletzung, spieler.status, spieler.tstatus, spieler.tsperre,
				  spieler.vertrag, spieler.gehalt, spieler.mw,
				  spieler.skills[0], spieler.skills[1], spieler.skills[2], spieler.skills[3], spieler.skills[4],
				  spieler.skills[5], spieler.skills[6], spieler.skills[7], spieler.skills[8], spieler.skills[9],
				  spieler.skills[10], spieler.skills[11], spieler.skills[12], spieler.skills[13],
				  spieler.skills[14], spieler.skills[15], spieler.skills[16] ]);

			// Training am vergangenen Zat
			this.sql.executeSql(
				"UPDATE Spielertraining SET " +
				"Faktor = :faktor, aufwertung = :aufwertung " +
				"WHERE Id = :id AND Saison = :saison AND Zat = :zat",
				[spieler.training.aktuell.faktor || 1, spieler.training.aktuell.aufwertung || 0,
				 spieler.id, termin.saison, termin.zat]);
		}

		// Training für den kommenden Zat
		this.saveTraining(spielerliste, termin);
	},

	/**
	 * Speichert bzw. aktualisiert den BlitzZat eines Kaderspielers.
	 * 
	 * @param {OSext.Kaderspieler} spieler
	 */
	saveKaderspielerBlitzZat : function (spieler) {

		this.sql.executeSql(
			"UPDATE Spieler SET BlitzKz = :blitzzat WHERE Id = :id ",
			[spieler.blitzzat, spieler.id]);
	},

	/**
	 * Speichert die Daten der übergebenen Jugendspieler in der Datenbank.
	 * 
	 * @param {Array} spielerliste
	 * @param {Number} foerderung
	 * @param {OSext.Termin} termin
	 */
	saveJugendspieler : function (spielerliste, foerderung, termin) {

		var s, spieler;
		
		for (s = 0; s < spielerliste.length; s++) {
			spieler = spielerliste[s];

			this.sql.executeSql(
				"REPLACE INTO Spieler VALUES " +
				"(:id, :position, :name, :land, :uefa, 1, 0, :geburtstag, :gebaktuell)",
				[spieler.id, spieler.getPos(), spieler.talent, spieler.land, spieler.uefa, spieler.geburtstag, 1]);
			
			this.sql.executeSql(
				"REPLACE INTO Spielerwerte VALUES " +
				"(:id, :saison, :zat, :alter, null, 99, 99, :ss, :opti, " +
				" :sonderskills, null, null, :status, null, null, 0, :gehalt, :marktwert, " +
				" :sch, :bak, :kob, :zwk, :dec, :ges, :fuq, :erf, :agg, " +
				" :pas, :aus, :ueb, :wid, :sel, :dis, :zuv, :ein )",
				[ spieler.id, termin.saison, termin.zat,
				  spieler.alter, spieler.skillschnitt, spieler.getOpti(),
				  spieler.getSonderskillsText(), spieler.nr, foerderung, spieler.getMarktwert(null, termin.zat),
				  spieler.skills[0], spieler.skills[1], spieler.skills[2], spieler.skills[3], spieler.skills[4],
				  spieler.skills[5], spieler.skills[6], spieler.skills[7], spieler.skills[8], spieler.skills[9],
				  spieler.skills[10], spieler.skills[11], spieler.skills[12], spieler.skills[13],
				  spieler.skills[14], spieler.skills[15], spieler.skills[16] ]);
		}
	},
	
	/**
	 * Speichert die Daten des übergebenen Spieltags in der Datenbank.
	 * 
	 * @param {OSext.Spieltag} spieltag
	 */
	saveSpieltag : function (spieltag) {
		
		this.sql.executeSql(
			"INSERT OR IGNORE INTO Spieltage VALUES " +
			"(:saison, :zat, :datum, :spielart, :ort, " +
			":gegner, :gegnerid, :zuseher, :eintritt, :stadioneinnahmen, " +
			":stadionkosten, :punktpraemie, :torpraemie, :tvgelder, :fanartikel, " +
			":grundpraemie, :spielergehaelter, :trainergehaelter, :jugend, " +
			":physio, :summe, :saldo, :leihen, :siegpraemie )",
			[spieltag.termin.saison, spieltag.termin.zat, spieltag.datum, 
			 spieltag.spielart, spieltag.ort, spieltag.gegner.name, spieltag.gegner.id, 
			 spieltag.zuseher, spieltag.eintritt, spieltag.stadioneinnahmen,
			 spieltag.stadionkosten, spieltag.punktpraemie, spieltag.torpraemie, 
			 spieltag.tvgelder, spieltag.fanartikel, spieltag.grundpraemie, 
			 spieltag.spielergehaelter, spieltag.trainergehaelter, spieltag.jugend,
			 spieltag.physio, spieltag.summe, spieltag.saldo, spieltag.leihen, spieltag.siegpraemie]);
	},
	
	
	/**
	 * Speichert die Daten des übergebenen Stadions in der Datenbank, sofern sich die Stadionwerte
	 * verändert haben.
	 * 
	 * @param {OSext.Stadion} stadion
	 * @param {OSext.Termin} termin
	 */
	saveStadion : function (stadion, termin) {
		
		var result = this.sql.executeSql("SELECT * FROM Stadion " +
			"WHERE Saison * " + OSext.ZATS_PRO_SAISON + " + Zat = " +
			"(SELECT MAX(Saison * " + OSext.ZATS_PRO_SAISON + " + Zat) FROM Stadion)");
		
		if (!result || result.length === 0 ||
			result[0].Steher != stadion.steher ||
			result[0].Sitzer != stadion.sitzer ||
			result[0].USteher != stadion.uesteher ||
			result[0].USitzer != stadion.uesitzer ||
			result[0].Anzeigetafel != stadion.anzeigetafel ||
			result[0].Rasenheizung != (stadion.rasenheizung ? "Ja" : "Nein")) {

			this.sql.executeSql(
				"REPLACE INTO Stadion VALUES " +
				"(:saison, :zat, :steher, :sitzer, :usteher, :usitzer, :anzeigetafel, :rasenheizung )",
				[termin.saison, termin.zat,
				 stadion.steher, stadion.sitzer, stadion.uesteher, stadion.uesitzer, 
				 stadion.anzeigetafel, stadion.rasenheizung ? "Ja" : "Nein"]);
		}
	}
};
