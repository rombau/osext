/**
 * Klasse für ein Stadion
 * @constructor
 */
OSext.Stadion = function () {

	this.steher = null;
	this.sitzer = null;
	this.uesteher = null;
	this.uesitzer = null;
	this.rasenheizung = null;
	this.anzeigetafel = null;
	
};

OSext.Stadion.prototype = {
	
	/**
	 * Liefert das Fassungsvermögen des Stadions.
	 * 
	 * @return {Number} Anzahl der Gesamtplätze
	 */
	getGesamtplaetze : function () {
		
		return this.steher + this.uesteher + this.sitzer + this.uesitzer;
	},
		
	/**
	 * Liefert die Stadioneinnahmen bei angegebenem Eintrittspreis und Auslastung.
	 * 
	 * @return {Number} Einnahmen 
	 */		
	getEinnahmen : function (eintritt, auslastung) {
		
		return this.getGesamtplaetze() * auslastung / 100 * eintritt +
			this.uesteher * auslastung / 100 * OSext.AUFSCHLAG.USTEHER +
			this.sitzer * auslastung / 100 * OSext.AUFSCHLAG.SITZER +
			this.uesitzer * auslastung / 100 * OSext.AUFSCHLAG.USITZER;
	},
	
	/**
	 * Liefert die Stadionkosten bei der angegebenen Auslastung.
	 * 
	 * @return {Number} Kosten
	 */		
	getKosten : function (auslastung) {
		
		return this.getGesamtplaetze() * auslastung / 100 * 
			(this.rasenheizung ? 
					OSext.STADIONKOSTEN.MIT_RASENHEIZUNG : OSext.STADIONKOSTEN.OHNE_RASENHEIZUNG);
	}

};

