/**
 * Klasse für den Kontoauszug
 * @constructor
 */
OSext.Sites.Ka = function (wrappeddoc) {
	
	this.classname = "OSext.Sites.Ka";
	
	this.columns = ["Datum", "Eingang", "Ausgang", "Buchungstext", "Kontostand nach Buchung"];

	this.wrappeddoc = wrappeddoc;
};

OSext.Sites.Ka.prototype = {
	
	/**
	 * Prüft die Seite auf Änderungen
	 * @throws {@link OSext.SiteChangeError}
	 */
	check : function () {

		var divs = this.wrappeddoc.doc.getElementsByTagName("div"),
			bolds = this.wrappeddoc.doc.getElementsByTagName("b"),
			table = this.wrappeddoc.doc.getElementsByTagName("table")[0],
			c;
	
		if (divs && divs.length > 0 && divs[0].lastChild.textContent.search("Diese Seite ist ohne Team nicht verf.+gbar!") != -1) {
			throw new OSext.AuthenticationError("Demoteam");
		}

		if (!bolds || bolds.length < 1 || bolds[0].textContent.search(/.+Kontostand : .+\d Euro/) == -1) {
			throw new OSext.SiteChangeError("Kontoauszug -> Überschrift wurde entfernt!");
		}
		
		if (!table || !table.rows || table.rows.length < 1) {
			throw new OSext.SiteChangeError("Kontoauszug -> Tabelle wurde entfernt!");
		}

		if (table.rows[0].cells.length != this.columns.length) {
			throw new OSext.SiteChangeError("Kontoauszug -> Tabelle wurde geändert!");
		} else {
			for (c = 0; c < this.columns.length - 1; c++) {
				if (table.rows[0].cells[c].textContent != this.columns[c]) {
					throw new OSext.SiteChangeError("Kontoauszug -> Tabellenspalten wurden geändert!");
				}
			}
		}
		return true;
	},

	/**
	 * Extrahiert Saldo der vergangenen Zats.
	 */
	extract : function (data, params) {

		var divs = this.wrappeddoc.doc.getElementsByTagName("div"),
			title = this.wrappeddoc.doc.getElementsByTagName("b")[0].textContent,
			table = this.wrappeddoc.doc.getElementsByTagName("table")[0],
			r, row, text, zat;
		
		data.kontostand = +title.split(" : ")[1].split(" ")[0].replace(/\./g, "");
		data.spieltag.saldo = data.kontostand;
		
		for (r = 1; r < table.rows.length; r++) {
			row = table.rows[r];
			text = row.cells[3].textContent; 
			if (text.indexOf(" ZAT") >= 0) {
				data.spieltag.saldo = +row.cells[4].textContent.replace(/\./g, "");
				data.spieltag.datum = row.cells[0].textContent;
				return null;
			}
		}
	}
};
