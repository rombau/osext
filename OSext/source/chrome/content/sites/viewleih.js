/**
 * Klasse für die Leihübersicht
 * @constructor
 */
OSext.Sites.Viewleih = function (wrappeddoc) {
	
	this.classname = "OSext.Sites.Viewleih";
	
	this.columns = ["Name", "Alter", "Land", "U", "Skillschnitt", "Opt. Skill", "Leihdauer", "Gehalt", "Leihgeb.+hr", "Leihclub"];

	this.wrappeddoc = wrappeddoc;
};

OSext.Sites.Viewleih.prototype = {
	
	/**
	 * Prüft die Seite auf Änderungen und Anmeldungsinformationen.
	 * @throws 
	 * {@link OSext.SiteChangeError} oder {@link OSext.AuthenticationError}
	 */
	check : function () {

		var divs = this.wrappeddoc.doc.getElementsByTagName("div"),
			tables = this.wrappeddoc.doc.getElementsByTagName("table"), t, c;
		
		if (divs && divs.length > 0 && divs[0].lastChild.textContent.search("Diese Seite ist ohne Team nicht verf.+gbar!") != -1) {
			throw new OSext.AuthenticationError("Demoteam");
		}

		for (t = 1; t <= 2; t++) {
			if (!tables[t] || !tables[t].rows || tables[t].rows.length < 1 || 
					tables[t].rows[0].cells.length != this.columns.length) {
				throw new OSext.SiteChangeError("Leihspieler/Übersicht -> Tabelle wurde geändert!");
			} else {
				for (c = 0; c < this.columns.length - 1; c++) {
					if (tables[t].rows[0].cells[c].textContent.search(this.columns[c]) == -1) {
						throw new OSext.SiteChangeError("Leihspieler/Übersicht -> Tabellenspalten wurden geändert!");
					}
				}
			}
		}
		return true;
	},

	/**
	 * Extrahiert die Leihspielerdaten; u.a. die Position bei verliehenen Spielern, 
	 * sofern die Daten noch nicht geladen wurden.
	 */
	extract : function (data, params) {

		var tables = this.wrappeddoc.doc.getElementsByTagName("table"),
			t, r, row, spieler, von, an, leihclub;
		
		for (t = 1; t <= 2; t++) {
			
			for (r = 1; r < tables[t].rows.length; r++) {
				
				row = tables[t].rows[r];
				
				spieler = OSext.getListElement(data.team.spieler, "id",
						OSext.getLinkId(row.cells[this.columns.indexOf("Name")].firstChild.href));
				
				if (spieler) {

					leihclub = new OSext.Team(OSext.getLinkId(row.cells[this.columns.indexOf("Leihclub")].firstChild.href),
							row.cells[this.columns.indexOf("Leihclub")].textContent);
					self = new OSext.Team(data.team.id, data.team.name);
					
					von = (t == 1) ? self : leihclub;
					an = (t == 1) ? leihclub : self;
					
					spieler.pos = row.cells[0].className;
					spieler.leihdaten = {
						gebuehr : +row.cells[this.columns.indexOf("Leihgeb.+hr")].textContent.replace(/\./g, ""),
						dauer : +row.cells[this.columns.indexOf("Leihdauer")].textContent,
						von : von, 
						an : an
					};
				}
			}
		}		
	}			
};
