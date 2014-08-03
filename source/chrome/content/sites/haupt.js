/**
 * Klasse für die Hauptseite (Managerbüro)
 * @constructor
 */
OSext.Sites.Haupt = function (wrappeddoc) {
	this.classname = "OSext.Sites.Haupt";
	this.wrappeddoc = wrappeddoc;
};

OSext.Sites.Haupt.prototype = {
	
	/**
	 * Prüft die Seite auf Änderungen und Anmeldungsinformationen.
	 * @throws 
	 * {@link OSext.SiteChangeError} oder {@link OSext.AuthenticationError}
	 */
	check : function () {

		var bolds = this.wrappeddoc.doc.getElementsByTagName("b");
		
		if (!bolds || bolds.length < 1 || bolds[0].textContent.indexOf("Willkommen im Managerb") == -1) {
			throw new OSext.SiteChangeError("Managerbüro -> Überschrift wurde nicht gefunden!");
		}

		if (bolds[0].textContent.search(/Willkommen im Managerb.+ro von DemoTeam/) != -1) {
			throw new OSext.AuthenticationError("Demoteam.");
		}					

		if (!bolds || bolds.length < 2 || 
				bolds[1].textContent.search(/Der n.+chste ZAT ist ZAT .+ und liegt auf/) == -1) {
			throw new OSext.SiteChangeError("Managerbüro -> Termin wurde nicht gefunden!");
		}
		return true;
	},

	/**
	 * Extrahiert den Teamnamen und liefert eine {@link OSext.RequestQueue} 
	 * sofern die Daten noch nicht geladen wurden.
	 * 
	 * @param {OSext.Data} data Anwendungsdaten
	 */
	extract : function (data, params) {

		var queue, zat;
		
		if (!data.team.name) {
			data.team.name = this.wrappeddoc.doc.getElementsByTagName("b")[0].textContent.split(" von ")[1];
		}
		
		if (!data.initialized) {
			
			zat = +this.wrappeddoc.doc.getElementsByTagName("b")[1].textContent.split(" ")[5];

			if (zat <= 1 || zat > OSext.ZATS_PRO_SAISON) {
				data.setAktuellenZat(OSext.ZATS_PRO_SAISON, true);
			} else {
				data.setAktuellenZat(zat - 1);
			}
			
			queue = new OSext.RequestQueue(this.wrappeddoc, this, this.postProcessing, OSext, true);
			
			queue.addSite("showteam", null, true, false, "Spieler");
			queue.addSite("showteam", {s: 6}, true, false, "Spielplan");
			queue.addSite("showteam", {s: 1}, true, false, "Verträge");
			queue.addSite("vt", null, true, false, "Verträge");
			queue.addSite("showteam", {s: 2}, true, false, "Einzelwerte");
			queue.addSite("showteam", {s: 5}, true, false, "Stadion");
			queue.addSite("viewleih", null, true, false, "Leihinfos");
			queue.addSite("trainer", null, true, false, "Trainer");
			queue.addSite("training", null, true, false, "Training");
			queue.addSite("ju", {page: 1}, true, false, "Jugend");
			queue.addSite("ju", {page: 2}, true, false, "Jugendwerte");
			queue.addSite("ju", {page: 3}, true, false, "Jugendoptionen");
			queue.addSite("lt", null, true, false, "Tabelle");
			queue.addSite("ka", null, true, false, "Kontoauszug");
			queue.addSite("zuzu", null, true, false, "Eintritt");
			
			return queue;
		} 

		return null;
	},
	
	/**
	 * Callback-Handler, welcher nach dem Abarbeiten der 
	 * in diesem Objekt initialisierten {@link OSext.RequestQueue} aufgerufen wird.
	 */
	postProcessing : function (doc, data, notifier) {
		
		data.initAndSave();
	}
			
};
