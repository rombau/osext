/**
 * Klasse für einen Termin
 * Kann mit Saison und Zat initialisiert werden.
 * @constructor
 */
OSext.Termin = function (saison, zat) {
	
	this.saison = saison;
	this.zat = zat;
	
};

OSext.Termin.prototype = {

	/**
	 * Liefert die Summe der Zats seit Saison 1 Zat 1 (z.B. für Vergleiche).
	 * @return Summe der Zats seit Beginn (oder 0)
	 */
	getZats : function () {
		if (this.saison && this.zat) {
			return this.saison * OSext.ZATS_PRO_SAISON + this.zat;
		}
		return 0;
	},
	
	/**
	 * Addiert Zats zum Termin unter Berücksichtigung der Saisonlänge. 
	 */
	addZats : function (zats) {
		this.zat += zats;
		if (this.zat > OSext.ZATS_PRO_SAISON) {
			this.saison += 1;
			this.zat -= OSext.ZATS_PRO_SAISON;
		}
		return this;
	},

	/**
	 * Subtrahiert Zats zum Termin unter Berücksichtigung der Saisonlänge. 
	 */
	subtractZats : function (zats) {
		this.zat -= zats;
		if (this.zat < 1) {
			this.saison -= 1;
			this.zat = OSext.ZATS_PRO_SAISON + this.zat;
		}
		return this;
	}
	
};