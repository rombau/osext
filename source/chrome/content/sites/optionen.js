/**
 * Klasse für die Optionen
 * @constructor
 */
OSext.Sites.Optionen = function (wrappeddoc) {
	
	this.classname = "OSext.Sites.Optionen";
	
	this.wrappeddoc = wrappeddoc;
	
	this.alwaysExtract = true;
};

OSext.Sites.Optionen.prototype = {
	
	/**
	 * Prüft die Seite auf Änderungen
	 * @throws {@link OSext.SiteChangeError}
	 */
	check : function () {

		var divs = this.wrappeddoc.doc.getElementsByTagName("div"),
			jugendsel = this.wrappeddoc.doc.getElementsByName("jugendFoerderung")[0];
	
		if (divs && divs.length > 0 && divs[0].textContent.search(/.+Als Gast gesperrt! Falls du dein Passwort ge.+ndert hast musst du dich neu einloggen.+/) != -1) {
			throw new OSext.AuthenticationError("Demoteam");
		}

		if (!jugendsel) {
			throw new OSext.SiteChangeError("Optionen -> Jugendförderungsauswahl wurde entfernt!");
		}
		return true;
	},

	/**
	 * Extrahiert Jugendförderung
	 */
	extract : function (data, params) {

		var jugendsel = this.wrappeddoc.doc.getElementsByName("jugendFoerderung")[0];
			
		data.jugendfoerderung = +jugendsel.value;
		
		// Cache leeren
		data.ansicht.saison.cache = null;
	}
};
