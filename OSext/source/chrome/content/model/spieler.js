/**
 * Basisklasse für Kader- und Jugendspieler
 * @constructor
 */
OSext.Spieler = function () {

	this.id = null;
	this.pos = null;
	this.land = null; 
	this.uefa = null; 
	
	this.alter = null; 
	this.opti = null;
	this.skillschnitt = null;
	this.sonderskills = null;
	this.mw = null;

	/**
	 * Array mit Einzelskills des Spielers
	 * Die Reihenfolge der Skills entspricht der der UI-Spalten (0=SCH, 1=BAK, etc.)
	 */
	this.skills = [];

	/**
	 * Cache für Skillsummen
	 */
	this.skillsummen = {};

};

OSext.Spieler.prototype = {
	
	/**
	 * Liefert die Summe der Skills anhand der angegebenen Summierungsstrategie.
	 * @param strategie Funtion welche prüft, ob der Skill addiert wird.
	 * @param pos Position des Spielers (oder this.pos)
	 * @return Summe der Skills anhand der {@link strategie}
	 */
	getSummeByStrategie : function (strategie, pos) {
		var sum = 0, 
			i;
		for (i = this.skills.length - 1; i >= 0; i--) {
			if (strategie.call(OSext, pos || this.pos, i)) { 
				sum += this.skills[i];
			}
		}
		return sum;		
	},

	/**
	 * Liefert die Summe der Primärskills des Spielers. 
	 * Die ermittelte Summe wird zwischengespeichert.
	 * @param pos Position für die Summierung (oder this.pos)
	 * @return Primärskillsumme
	 */
	getSummePrimaerSkills : function (pos) {
		if (!this.skillsummen.primaerskills || pos) {
			var ps = this.getSummeByStrategie(OSext.isPrimaerSkill, pos);
			if (pos) {
				return ps;
			}
			this.skillsummen.primaerskills = ps;
		}
		return this.skillsummen.primaerskills;
	},

	/**
	 * Liefert die Summe der Nebenkills des Spielers. 
	 * Die ermittelte Summe wird zwischengespeichert.
	 * @param pos Position für die Summierung (oder this.pos)
	 * @return Nebenskillsumme
	 */
	getSummeNebenSkills : function (pos) {
		if (!this.skillsummen.nebenskills || pos) {
			var ns = this.getSummeByStrategie(OSext.isNebenSkill, pos);
			if (pos) {
				return ns;
			}
			this.skillsummen.nebenskills = ns;
		}
		return this.skillsummen.nebenskills;
	},

	/**
	 * Liefert die Summe der unveränderlichen Skills des Spielers. 
	 * Die ermittelte Summe wird zwischengespeichert.
	 * @return Summe der unveränderlichen Skills
	 */
	getSummeUnveraenderlicheSkills : function () {
		if (!this.skillsummen.unveraenderlicheskills) {
			this.skillsummen.unveraenderlicheskills = 
				this.skills[OSext.SKILL.WID] + 
				this.skills[OSext.SKILL.SEL] + 
				this.skills[OSext.SKILL.DIS] + 
				this.skills[OSext.SKILL.EIN];
			if (!this.skillsummen.unveraenderlicheskills) {
				this.skillsummen.unveraenderlicheskills = 0;
			}
		}
		return this.skillsummen.unveraenderlicheskills;		
	},

	/**
	 * Liefert die Summe aller Skills des Spielers. 
	 * Die ermittelte Summe wird zwischengespeichert.
	 * @return Summe aller Skills
	 */
	getSummeAlleSkills : function () {
		if (!this.alleskills) {
			this.alleskills = 0;
			for (var i = this.skills.length - 1; i >= 0; i--) {
				this.alleskills += this.skills[i];
			}
		}
		return this.alleskills;		
	},

	/**
	 * Liefert den Skillschnitt des Spielers, und speichert 
	 * diesen in this.skillschnitt
	 * @return Skillsschnitt
	 */
	getSkillschnitt : function () {
		if (!this.skillschnitt) {
			this.skillschnitt = this.getSummeAlleSkills() / this.skills.length;
		}
		return Number(this.skillschnitt.toFixed(2));
	},

	/**
	 * Liefert den Opti des Spielers für die angegene Position 
	 * (oder this.pos). Handelt es sich um die Stammposition, oder
	 * ist {@code pos} nicht angegeben, wird this.opti (ermittelt und) zurückgegeben.
	 * @param pos Position für Berechnung
	 * @return Opti
	 */
	getOpti : function (pos) {
		var opti = this.opti;
		if (pos != this.pos || !this.opti) {
			if (!pos) {
				pos = this.pos;
			}
			opti = (this.getSummeAlleSkills() + (this.getSummePrimaerSkills(pos) * 4)) / 27;
			if (!this.opti) {
				this.opti = opti;
			}
		}
		return Number(opti.toFixed(2));
	},

	/**
	 * Liefert ein Array mit den Sonderskills des Spieler. Jedes Element
	 * enthält die Kurz- und Langform des Sonderskills.
	 * 
	 * E = Elfmeterkiller (Nur Torwarte) - REF, SPL, FAN 
	 * L = Libero (Nur ABW und DMI) - DECg, UEB, ZWK 
	 * S = Spielmacher (Nur Feldspieler) - UEB, PAS, BAK 
	 * F = Freistoss-Spezialist (Nur Feldspieler) - SCH, UEB, BAK 
	 * T = Torinstinkt (Nur Feldspieler) - SCH, KOB, GES 
	 * G = Flankengott (Nur Feldspieler) - PAS, GES, BAK 
	 * K = Kapitän (Feldspieler und Torwarte) - FUQ, ERF, EIN 
	 * P = Pferdelunge (Nur Feldspieler) - AUS, GES, ZUV 
	 *  
 	 * Der Wert wird in this.sonderskills gespeichert.
	 * @return Sonderskills
	 */
	getSonderskills : function () {

		var grenze = 75;
		if (!this.sonderskills) {
			this.sonderskills = [];
			if (this.pos == OSext.POS.TOR && 
			    this.skills[OSext.SKILL.KOB] >= grenze && 
			    this.skills[OSext.SKILL.DEC] >= grenze && 
			    this.skills[OSext.SKILL.GES] >= grenze) { 
				this.sonderskills.push({kurz: "E", lang: "Elfmetertöter"});
			}
			if ((this.pos == OSext.POS.DMI || this.pos == OSext.POS.ABW) && 
			    this.skills[OSext.SKILL.DEC] >= grenze && 
			    this.skills[OSext.SKILL.UEB] >= grenze && 
			    this.skills[OSext.SKILL.ZWK] >= grenze) {
				this.sonderskills.push({kurz: "L", lang: "Libero"});
			}
			if (this.pos != OSext.POS.TOR && 
			    this.skills[OSext.SKILL.UEB] >= grenze && 
			    this.skills[OSext.SKILL.PAS] >= grenze && 
			    this.skills[OSext.SKILL.BAK] >= grenze) { 
				this.sonderskills.push({kurz: "S", lang: "Spielmacher"});
			}
			if (this.pos != OSext.POS.TOR && 
			    this.skills[OSext.SKILL.SCH] >= grenze && 
			    this.skills[OSext.SKILL.UEB] >= grenze && 
			    this.skills[OSext.SKILL.BAK] >= grenze) { 
				this.sonderskills.push({kurz: "F", lang: "Freistoßspezialist"});
			}
			if (this.pos != OSext.POS.TOR && 
			    this.skills[OSext.SKILL.SCH] >= grenze && 
			    this.skills[OSext.SKILL.KOB] >= grenze && 
			    this.skills[OSext.SKILL.GES] >= grenze) { 
				this.sonderskills.push({kurz: "T", lang: "Torinstinkt"});
			}
			if (this.pos != OSext.POS.TOR && 
			    this.skills[OSext.SKILL.BAK] >= grenze && 
			    this.skills[OSext.SKILL.PAS] >= grenze && 
			    this.skills[OSext.SKILL.GES] >= grenze) { 
				this.sonderskills.push({kurz: "G", lang: "Flankengott"});
			}
			if (this.skills[OSext.SKILL.FUQ] >= grenze && 
				this.skills[OSext.SKILL.ERF] >= grenze && 
				this.skills[OSext.SKILL.EIN] >= grenze) { 
				this.sonderskills.push({kurz: "K", lang: "Kapitän"});
			}
			if (this.pos != OSext.POS.TOR && 
			    this.skills[OSext.SKILL.AUS] >= grenze && 
			    this.skills[OSext.SKILL.GES] >= grenze && 
			    this.skills[OSext.SKILL.ZUV] >= grenze) { 
				this.sonderskills.push({kurz: "P", lang: "Pferdelunge"});
			}
		}
		return this.sonderskills;
	},
	
	/**
	 * Liefert die Sonderskills in ihrer Kurzform als Text.
	 */
	getSonderskillsText : function () {
		
		var sonder = this.getSonderskills(),
			ss, ret = "";
		
		for (ss = 0; ss < sonder.length; ss++) {
			ret += sonder[ss].kurz;
		}
		return ret; 
	},
	
	/**
	 * Liefert die Sonderskills mit den zugehörigen Infotexten in {@code <abbr>}-Tags.
	 */
	getSonderskillsHTML : function () {
		
		var sonder = this.getSonderskills(),
			ss, ret = "";
		
		for (ss = 0; ss < sonder.length; ss++) {
			ret = ret + 
				"<abbr title=\"" + sonder[ss].lang + "\">" + sonder[ss].kurz + "</abbr>";
		}
		
		return ret;
	},
	
	/**
	 * Liefert den Marktwert anhand des Skillschnitts,
	 * Optis, Alters und der Sonderskills des Spieler.
	 * @return Marktwert
	 */
	getMarktwert : function (pos) {
		var marktwert = this.mw;
		if ((pos && pos != this.pos) || !this.mw) {
			if (!pos) {
				pos = this.pos;
			}
			marktwert = (Math.pow(1 + this.getSkillschnitt() / 100, 10)) * 
				(Math.pow(1 + this.getOpti(pos) / 100, 10)) * 
				(Math.pow(1 + (100 - this.alter) / 100, 10)) * 
				(Math.pow(1.025, this.getSonderskills().length)) * 2;
			marktwert = Math.round(marktwert);
			if (!this.mw) {
				this.mw = marktwert;
			}
		}
		return marktwert;
	}
	

};
