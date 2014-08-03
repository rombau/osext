/**
 * Klasse für die JugendOptionen
 * @constructor
 */
OSext.Sites.JugendOptionen = function (wrappeddoc) {
	
	this.classname = "OSext.Sites.JugendOptionen";
	
	this.wrappeddoc = wrappeddoc;
	
	this.alwaysExtract = true;
};

OSext.Sites.JugendOptionen.prototype = {
	
	/**
	 * Prüft die Seite auf Änderungen
	 * @throws {@link OSext.SiteChangeError}
	 */
	check : function () {

		var divs = this.wrappeddoc.doc.getElementsByTagName("div"),
			jugendsel = this.wrappeddoc.doc.getElementsByName("foerderung")[0];
	
		if (divs && divs.length > 0 && divs[0].lastChild.textContent.search("Diese Seite ist ohne Team nicht verf.+gbar!") != -1) {
			throw new OSext.AuthenticationError("Demoteam");
		}

		if (!jugendsel) {
			throw new OSext.SiteChangeError("Jugend/Optionen -> Jugendförderungsauswahl wurde entfernt!");
		}
		return true;
	},

	/**
	 * Extrahiert Jugendförderung
	 */
	extract : function (data, params) {

		var jugendsel = this.wrappeddoc.doc.getElementsByName("foerderung")[0];
			
		data.jugendfoerderung = +jugendsel.value;
		
		// Cache leeren
		data.ansicht.saison.cache = null;
	}
};
