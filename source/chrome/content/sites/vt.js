/**
 * Klasse für die Vertragsverlängerungsseite
 * @constructor
 */
OSext.Sites.Vt = function (wrappeddoc) {
	
	this.classname = "OSext.Sites.Vt";
	
	this.columns = ["Name", "Alter", "Land", "Gehalt", "Laufzeit", "Skillschnitt", "Opt. Skill", "24", "Monate", "36", "Monate", "48", "Monate", "60", "Monate"];
	
	this.wrappeddoc = wrappeddoc;
};

OSext.Sites.Vt.prototype = {
	
	/**
	 * Prüft die Seite auf Änderungen und Anmeldungsinformationen.
	 * @throws 
	 * {@link OSext.SiteChangeError} oder {@link OSext.AuthenticationError}
	 */
	check : function () {

		var divs = this.wrappeddoc.doc.getElementsByTagName("div"),
			tables = this.wrappeddoc.doc.getElementsByTagName("table"),
			table, c;

		if (divs && divs.length > 0) {
			if (divs[0].lastChild.textContent.search("Diese Seite ist ohne Team nicht verf.+gbar!") != -1) {
				throw new OSext.AuthenticationError("Demoteam");
			} else if (divs[0].lastChild.textContent.search("Diese Funktion ist erst ZAT 1 wieder verf.+gbar") != -1) {
				return false;
			}
		}
		
		if (!tables) {
			throw new OSext.SiteChangeError("Verträge verlängern -> Tabelle wurde geändert!");
		} else {
			table = tables.length > 1 ? tables[1] : tables[0];
			if (!table || !table.rows || table.rows.length < 2 || 
					table.rows[0].cells.length != this.columns.length) {
				throw new OSext.SiteChangeError("Verträge verlängern -> Tabelle wurde geändert!");
			} else {
				for (c = 0; c < this.columns.length - 1; c++) {
					if (table.rows[0].cells[c].textContent != this.columns[c]) {
						throw new OSext.SiteChangeError("Verträge verlängern -> Tabellenspalten wurden geändert!");
					}
				}
			}
		}
		return true;
	},
	
	/**
	 * Extrahiert die Neuverragsdaten der Spieler
	 */
	extract : function (data, params) {

		var tables = this.wrappeddoc.doc.getElementsByTagName("table"),
			table = tables.length > 1 ? tables[1] : tables[0], 
			r, row, spieler;
		
		for (r = 1; r < table.rows.length; r++) {

			row = table.rows[r];

			spieler = OSext.getListElement(data.team.spieler, "id",
					OSext.getLinkId(row.cells[this.columns.indexOf("Name")].firstChild.href));

			if (spieler) {
				spieler.gehalt24 = +row.cells[this.columns.indexOf("24") + 1].textContent.replace(/\./g, "");
				spieler.gehalt36 = +row.cells[this.columns.indexOf("36") + 1].textContent.replace(/\./g, "");
				spieler.gehalt48 = +row.cells[this.columns.indexOf("48") + 1].textContent.replace(/\./g, "");
				spieler.gehalt60 = +row.cells[this.columns.indexOf("60") + 1].textContent.replace(/\./g, "");
			}
		}
	}	
};
