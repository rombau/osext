/**
 * Klasse für den Zugabgabe-Zusatz
 * @constructor
 */
OSext.Sites.Zuzu = function (wrappeddoc) {
	
	this.classname = "OSext.Sites.Zuzu";
	
	this.wrappeddoc = wrappeddoc;
};

OSext.Sites.Zuzu.prototype = {
	
	/**
	 * Prüft die Seite auf Änderungen
	 * @throws {@link OSext.SiteChangeError}
	 */
	check : function () {

		var divs = this.wrappeddoc.doc.getElementsByTagName("div"),
			ligainput = this.wrappeddoc.doc.getElementsByName("liga")[0],  
			pokalinput = this.wrappeddoc.doc.getElementsByName("pokal")[0],
			intinput = this.wrappeddoc.doc.getElementsByName("int")[0];
	
		if (divs && divs.length > 0 && divs[0].lastChild.textContent.search("Diese Seite ist ohne Team nicht verf.+gbar!") != -1) {
			throw new OSext.AuthenticationError("Demoteam");
		}

		if (!ligainput) {
			throw new OSext.SiteChangeError("Zugabgabe/Zusatz -> Ligaeintritt wurde entfernt!");
		}

		if (!pokalinput) {
			throw new OSext.SiteChangeError("Zugabgabe/Zusatz -> Pokaleintritt wurde entfernt!");
		}

		if (!intinput) {
			throw new OSext.SiteChangeError("Zugabgabe/Zusatz -> Internationaleintritt wurde entfernt!");
		}
		return true;
	},

	/**
	 * Extrahiert die Eintrittspreise
	 */
	extract : function (data, params) {

		var ligainput = this.wrappeddoc.doc.getElementsByName("liga")[0],  
			pokalinput = this.wrappeddoc.doc.getElementsByName("pokal")[0],
			intinput = this.wrappeddoc.doc.getElementsByName("int")[0];
			
		data.eintritt.liga = +ligainput.value; 
		data.eintritt.pokal = +pokalinput.value; 
		data.eintritt.international = +intinput.value; 
		
		if (data.spieltag.spielart == OSext.SPIELART.LIGA && data.spieltag.ort == OSext.SPIELORT.HEIM) {
			data.spieltag.eintritt = data.eintritt.liga;
		} else if (data.spieltag.spielart == OSext.SPIELART.POKAL && data.spieltag.ort == OSext.SPIELORT.HEIM) {
			data.spieltag.eintritt = data.eintritt.pokal;
		} else if (data.spieltag.spielart == OSext.SPIELART.FSS) {
			// Kein Eintrittspreis
		} else if (data.spieltag.ort == OSext.SPIELORT.HEIM) {
			data.spieltag.eintritt = data.eintritt.international;
		}
	}
};
