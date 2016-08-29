/**
 * Klasse für die Spielerprofilseite
 * @constructor
 */
OSext.Sites.Sp = function (wrappeddoc) {
	
	this.classname = "OSext.Sites.Sp";
	
	this.wrappeddoc = wrappeddoc;
};

OSext.Sites.Sp.prototype = {
	
	/**
	 * Prüft die Seite auf Änderungen und Anmeldungsinformationen.
	 * @throws 
	 * {@link OSext.SiteChangeError}
	 */
	check : function () {

		var div = this.wrappeddoc.doc.getElementById("a");

		if (!div) {
			throw new OSext.SiteChangeError("Spielerprofil -> Register Spielerdaten fehlt!");
		}
		
		return true;
	},
	
	/**
	 * Extrahiert das Geburtsdatum des Spielers
	 */
	extract : function (data, params) {

		var div = this.wrappeddoc.doc.getElementById("a"),
			matches = div.textContent.match(/.+Geburtstag\s+:ZAT\s+(\d+)\s+Vertragslaufzeit/)
			spieler = OSext.getListElement(data.team.spieler, "id", params.s);

		if (spieler) {
			spieler.geburtstag = +matches[1];
			spieler.gebaktuell = 1;
		}		
	}	
};
