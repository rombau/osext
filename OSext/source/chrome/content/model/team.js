/**
 * Klasse für ein Team
 * @constructor
 */
OSext.Team = function (id, name) {
	
	this.id = id || 0;
	this.name = name || null;
	
	this.platzierung = null;

	/**
	 * Liste mit den aktuellen {@link OSext.Kaderspieler}n.
	 */
	this.spieler = [];
	
	/**
	 * Liste mit den aktuellen {@link OSext.Jugendspieler}n.
	 */
	this.jugend = [];
	
	/**
	 * Liste mit den aktuellen {@link OSext.Trainer}n.
	 * Die Nummer des Trainers entspricht dem Index.
	 */
	this.trainer = [];

};

OSext.Team.prototype = {
	
	/**
	 * Liefert eine neue Liste mit den Kaderspielern sortiert nach Opti.
	 * 
	 * @param {Array} spielerliste Liste mit Spielern die sortiert werden soll
	 * @returns {Array} Neue Liste mit Spielern sortiert nach Opti
	 */
	getOptiSortedSpieler : function (spielerliste) {
		
		var s, sortedlist = [];

		spielerliste = spielerliste || this.spieler;
		
		for (s = 0; s < spielerliste.length; s++) {
			sortedlist[s] = spielerliste[s]; 
		}
		
		sortedlist.sort(function (a, b) {
			return (b.opti - a.opti);
		});
		
		return sortedlist;
	},
		
	/**
	 * Liefert eine Liste der elf opti-besten Kaderspielern.
	 * Dabei wird eine sinnvolle Formation zusammengestellt. 
	 * 
	 * @param {Array} spielerliste Liste mit zur Verfügung stehenden Spielern
	 * @returns {Array} Top Elf als Liste von Kaderspielern
	 */
	getTopElf : function (spielerliste) {

		var s, sortedlist = this.getOptiSortedSpieler(spielerliste), 
			spieler, tor = 0, abw = 0, mit = 0, stu = 0, gesamt = 0,
			topelf = [];

		for (s = 0; gesamt < 11 && s < sortedlist.length; s++) {
			spieler = sortedlist[s];
			if (spieler.status != OSext.STATUS.VERLIEHEN && !spieler.verletzung) {
				switch (spieler.pos) {
				case OSext.POS.TOR:
					if (tor === 0) {
						tor++;
					}
					break;
				case OSext.POS.ABW: 
					if (abw < 3 || (abw < 4 && mit <= 4 && stu <= 2)) {
						abw++;
					}
					break;
				case OSext.POS.DMI:
				case OSext.POS.MIT:
				case OSext.POS.OMI:
					if (mit < 4 || (mit < 5 && abw <= 3 && stu <= 2)) {
						mit++;
					}
					break;
				case OSext.POS.STU: 
					if (stu < 2 || (stu < 3 && abw <= 3 && mit <= 4)) {
						stu++;
					}
					break;
				}
				if (gesamt !== (tor + abw + mit + stu)) {
					topelf.push(spieler);
					gesamt++;
				}
			}
		}
	
		return topelf;
	},
	
	/**
	 * Liefert die Formation der übergebenen Spieler. 
	 * Wurden mehr als elf Spieler übergeben, werden zuvor die elf opti-besten Spieler
	 * ermittelt. 
	 * 
	 * @param {Array} spielerliste Liste mit Spielern
	 * @return {String} Formation (z.B. {@code "3-5-2"}) 
	 */
	getFormation : function (spielerliste) {

		var abw, mit, stu;

		spielerliste = spielerliste || this.spieler;
		
		if (spielerliste.length > 11) {
			spielerliste = this.getTopElf(spielerliste);
		}

		abw = spielerliste.filter(function (s) {
			return s.pos == OSext.POS.ABW;
		}).length;
		
		mit = spielerliste.filter(function (s) {
			return s.pos == OSext.POS.DMI || s.pos == OSext.POS.MIT || s.pos == OSext.POS.OMI;
		}).length;
		
		stu = spielerliste.filter(function (s) {
			return s.pos == OSext.POS.STU;
		}).length;
		
		return abw + "-" + mit + "-" + stu;
		
	},
	
	/**
	 * Liefert den Durchschnittsskill der übergebenen Spieler.
	 * 
	 * @param {Array} spielerliste Liste mit Spielern
	 * @returns {Number} Durchschnittsskill
	 */
	getSkillschnitt : function (spielerliste) {
		
		var s, summe = 0;
		
		if (!spielerliste || spielerliste.length === 0) {
			return 0;
		}
		
		for (s = 0; s < spielerliste.length; s++) {
			summe += spielerliste[s].skillschnitt;
		}
		
		return Number((summe / spielerliste.length).toFixed(2));
	},

	/**
	 * Liefert den Durchschnitt der PS der übergebenen Spieler.
	 * 
	 * @param {Array} spielerliste Liste mit Spielern
	 * @returns {Number} Durchschnitt-PS
	 */
	getPrimaerskillschnitt : function (spielerliste) {

		var s, summe = 0;
		
		if (!spielerliste || spielerliste.length === 0) {
			return 0;
		}
		
		for (s = 0; s < spielerliste.length; s++) {
			summe += (spielerliste[s].getSummePrimaerSkills() / 4);
		}

		return Number((summe / spielerliste.length).toFixed(2));
	},
	
	/**
	 * Liefert den Durchschnitt der NS der übergebenen Spieler.
	 * 
	 * @param {Array} spielerliste Liste mit Spielern
	 * @returns {Number} Durchschnitt-NS
	 */
	getNebenskillschnitt : function (spielerliste) {

		var s, summe = 0;
		
		if (!spielerliste || spielerliste.length === 0) {
			return 0;
		}
		
		for (s = 0; s < spielerliste.length; s++) {
			summe += (spielerliste[s].getSummeNebenSkills() / (17 - 4 - 4));
		}
		
		return Number((summe / spielerliste.length).toFixed(2));
	},
	
	/**
	 * Liefert den Durchschnitt der US der übergebenen Spieler.
	 * 
	 * @param {Array} spielerliste Liste mit Spielern
	 * @returns {Number} Durchschnitt-US
	 */
	getUnveraenderlichenskillschnitt : function (spielerliste) {

		var s, summe = 0;
		
		if (!spielerliste || spielerliste.length === 0) {
			return 0;
		}
		
		for (s = 0; s < spielerliste.length; s++) {
			summe += (spielerliste[s].getSummeUnveraenderlicheSkills() / 4);
		}
		
		return Number((summe / spielerliste.length).toFixed(2));
	},
	
	/**
	 * Liefert den Durchschnittsopti der übergebenen Spieler.
	 * 
	 * @param {Array} spielerliste Liste mit Spielern
	 * @returns {Number} Durchschnittsopit
	 */
	getOptischnitt : function (spielerliste) {

		var s, summe = 0;
		
		if (!spielerliste || spielerliste.length === 0) {
			return 0;
		}
		
		for (s = 0; s < spielerliste.length; s++) {
			summe += spielerliste[s].opti;
		}
		
		return Number((summe / spielerliste.length).toFixed(2));
	},
	
	/**
	 * Liefert die Summe der Gehälter der Kaderspieler.
	 * 
	 * @returns {Number}
	 */
	getSpielergehaelter : function () {

		var s, summe = 0;
		
		for (s = 0; s < this.spieler.length; s++) {
			summe += (this.spieler[s].gehalt || 0);
		}
		
		return summe;
	},

	/**
	 * Liefert die Summe der Leihgebühren der verliehenen und geliehenen Kaderspieler.
	 * 
	 * @returns {Number}
	 */
	getLeihgebuehren : function () {

		var s, summe = 0;

		for (s = 0; s < this.spieler.length; s++) {
			if (this.spieler[s].leihdaten) {
				if (this.spieler[s].leihdaten.von.id == this.id) {
					summe += (this.spieler[s].leihdaten.gebuehr || 0);
				} else {
					summe -= (this.spieler[s].leihdaten.gebuehr || 0);
				}
			}
		}
		
		return summe;
	},

	/**
	 * Liefert die Summe der Blitzerlöse der Kaderspieler, die 
	 * zum angegebenen Zat geblitzt werden sollen.
	 * 
	 * @returns {Number}
	 */
	getBlitzerloese : function (zat) {

		var s, summe = 0;
		
		for (s = 0; s < this.spieler.length; s++) {
			if (this.spieler[s].blitzzat == zat) {
				summe += (this.spieler[s].getBlitzwert() || 0);
			}
		}
		return summe;
	},

	/**
	 * Liefert die Summe der Gehälter der eingestellten Trainer.
	 * 
	 * @returns {Number}
	 */
	getTrainergehaelter : function () {
		
		var t, summe = 0;
		
		for (t = 1; t < this.trainer.length; t++) {
			summe += (this.trainer[t].gehalt || 0);
		}
		
		return summe;
	},
	
	/**
	 * Liefert die A-Team-Info für die Toolbar.
	 * 
	 * @param {Array} spielerliste
	 * @returns {String} HTML-Text
	 */
	getTeamInfoHTML : function (spielerliste) {

		var topelf = this.getTopElf(spielerliste);
		
		return "A-Team (" + 
			this.getFormation(topelf) + 
			"): " + 
			this.getSkillschnitt(topelf).toFixed(2) + 
			" / <span class=\"ps\">" + 
			this.getOptischnitt(topelf).toFixed(2) + 
			"</span>";	
	},
	
	/**
	 * Liefert die Anzahl der aktiven Jugendspieler (Alter >= 13) zum Zat
	 * 
	 * @param {OSext.Termin} termin
	 */
	getAnzahlJugendspieler : function (termin) {
		
		var j, anzahl = 0;
		
		for (j = 0; j < this.jugend.length; j++) {
			if (this.jugend[j].alter >= 13 || this.jugend[j].geburtstag <= termin.zat) {
				anzahl++;
			}
		}
		
		return anzahl;
	}
};
