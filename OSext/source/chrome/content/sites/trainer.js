/**
 * Klasse für die Trainerseite
 * @constructor
 */
OSext.Sites.Trainer = function (wrappeddoc) {
	
	this.classname = "OSext.Sites.Trainer";
	
	this.columns = ["#", "Skill", "Gehalt", "Vertrag", "Aktion"];
	
	this.wrappeddoc = wrappeddoc;
	
	this.alwaysExtract = true;
};

OSext.Sites.Trainer.prototype = {

	/**
	 * Prüft die Seite auf Änderungen und Anmeldungsinformationen.
	 * @throws 
	 * {@link OSext.SiteChangeError} oder {@link OSext.AuthenticationError}
	 */
	check : function (params) {

		var divs = this.wrappeddoc.doc.getElementsByTagName("div"),
			bolds = this.wrappeddoc.doc.getElementsByTagName("b"),
			tables = this.wrappeddoc.doc.getElementsByTagName("table"), c;
	
		if (divs && divs.length > 0) {
			if (divs[0].lastChild.textContent.search("Diese Seite ist ohne Team nicht verf.+gbar!") != -1) {
				throw new OSext.AuthenticationError("Demoteam");
			} else if (divs[0].lastChild.textContent.search("Diese Funktion ist erst ZAT 1 wieder verf.+gbar") != -1) {
				return false;
			}
		}

		if (!bolds || bolds.length === 0 || 
				bolds[0].textContent.search(/.+bersicht des Trainerstabes.*/) == -1) {
			throw new OSext.SiteChangeError("Trainer -> Überschrift wurde geändert!");
		}
		
		if (!tables[0] || !tables[0].rows || tables[0].rows.length < 2 || 
				tables[0].rows[0].cells.length != this.columns.length) {
			throw new OSext.SiteChangeError("Trainer -> Tabelle wurde geändert!");
		} else {
			for (c = 0; c < this.columns.length - 1; c++) {
				if (tables[0].rows[0].cells[c].textContent != this.columns[c]) {
					throw new OSext.SiteChangeError("Trainer -> Tabellenspalten wurden geändert!");
				}
			}
		}
		return true;
	},

	/**
	 * Extrahiert die Daten der Trainer
	 */
	extract : function (data, params) {

		var table = this.wrappeddoc.doc.getElementsByTagName("table")[0],
			r, row, trainer, skill;
		
		for (r = 1; r < table.rows.length; r++) {

			row = table.rows[r];
			trainer = data.team.trainer[r];

			if (!trainer) {
				trainer = new OSext.Trainer();
			}

			trainer.skill = this.mapTrainerSkill(row.cells[1].textContent);
			trainer.gehalt = +row.cells[2].textContent.replace(/\./g, "");
			trainer.vertrag = +row.cells[3].textContent;
			
			data.team.trainer[r] = trainer;
		}
		
		// Cache leeren
		data.ansicht.saison.cache = null;
	},
	
	/**
	 * Mapped den Trainer-Skill-Text auf den "alten" Skillwert.
	 * 
	 * @param {String} skilltext
	 */
	mapTrainerSkill : function (skilltext) {
		
		var skill = +skilltext.split(" ")[1];
		
		if (skill == 1) {
			return 20;
		} else if (skill == 2) {
			return 25;
		} else if (skill == 3) {
			return 30;
		} else if (skill == 4) {
			return 35;
		} else if (skill == 5) {
			return 40;
		} else if (skill == 6) {
			return 45;
		} else if (skill == 7) {
			return 50;
		} else if (skill == 8) {
			return 55;
		} else if (skill == 9) {
			return 60;
		} else if (skill == 10) {
			return 65;
		} else if (skill == 11) {
			return 70;
		} else if (skill == 12) {
			return 75;
		} else if (skill == 13) {
			return 80;
		} else if (skill == 14) {
			return 85;
		} else if (skill == 15) {
			return 90;
		} else if (skill == 16) {
			return 95;
		} else if (skill == 17) {
			return 99;
		}
	},
	
	/**
	 * Speichert die Trainerdaten, sofern die Initialisierung bereits abgeschlossen ist.
	 */
	save : function (data, params) {
		
		OSext.Log.info("Trainer speichern ...");
		
		try {

			data.database.sql.beginTransaction();
			
			data.database.saveTrainer(data.team.trainer, data.termin);
			
			data.database.sql.commitTransaction();
			
		} catch (e) {
			
			data.database.sql.rollbackTransaction();
			throw e;
		}
	}
};
