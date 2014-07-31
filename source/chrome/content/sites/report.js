/**
 * Klasse für den Spielbericht
 * @constructor
 */
OSext.Sites.Report = function (wrappeddoc) {
	
	this.classname = "OSext.Sites.Report";
	
	this.columns = ["Spielername", "Note", "ZK", "ZK-%", "Sch.+sse", "aufs Tor", "Tore", "Vorlagen", "", "Sch.+sse", "aufs Tor", "Tore", "Vorlagen", "ZK", "ZK-%", "Note", "Spielername"];

	this.wrappeddoc = wrappeddoc;
};

OSext.Sites.Report.prototype = {
	
	/**
	 * Prüft die Seite.
	 * @throws {@link OSext.SiteChangeError}
	 */
	check : function () {

		var tables = this.wrappeddoc.doc.getElementsByTagName("table"),
			bolds = this.wrappeddoc.doc.getElementsByTagName("b"),
			c;
		
		if (!tables || tables.length < 5) {
			throw new OSext.SiteChangeError("Report -> Tabellenanzahl wurde geändert!");
		}

		if (!bolds || bolds.length < 2 || bolds[1].textContent.search(/.*Datum : \d\d.\d\d.\d\d\d\d/) == -1) {
			throw new OSext.SiteChangeError("Report -> Datum fehlt!");
		}

		if (tables[0].rows.length < 36 || 
				tables[0].rows[1].cells.length < 2 || tables[0].rows[1].cells[1].textContent != "1" ||
				tables[0].rows[19].cells.length < 5 || tables[0].rows[19].cells[4].textContent != "A") {
			throw new OSext.SiteChangeError("Report -> Tabelle (Aufstellung) wurde geändert!");
		}

		if (tables[1].rows.length < 7 || 
				tables[1].rows[3].cells.length < 1 || tables[1].rows[3].cells[0].textContent != "Spielweise") {
			throw new OSext.SiteChangeError("Report -> Tabelle (Starteinstellungen) wurde geändert!");
		}

		if (tables[3].rows.length < 11 || 
				tables[3].rows[6].cells.length < 1 || tables[3].rows[6].cells[0].textContent != "Ballbesitz") {
			throw new OSext.SiteChangeError("Report -> Tabelle (Spielstatistiken) wurde geändert!");
		}

		if (tables[4].rows.length < 12 || tables[4].rows[0].cells.length < 17) {
			throw new OSext.SiteChangeError("Report -> Tabelle (Spielerstatistiken) wurde geändert!");
		} else {
			for (c = 0; c < this.columns.length - 1; c++) {
				if (tables[4].rows[0].cells[c].textContent.search(this.columns[c]) == -1) {
					throw new OSext.SiteChangeError("Report -> Tabellenspalten (Spielerstatistiken) wurden geändert!");
				}
			}
		}
		return true;
	},

	/**
	 * Extrahiert die Spielberichtdaten,
	 * sofern die Daten noch nicht geladen wurden.
	 * 
	 * Da es sich um eine Seite handelt, welche auch ohne Anmeldung 
	 * verarbeitet wird, müssen alle Zugriffe auf {@code data} abgesichert werden.
	 */
	extract : function (data, params) {

		var tables = this.wrappeddoc.doc.getElementsByTagName("table"),
			bolds = this.wrappeddoc.doc.getElementsByTagName("b"),
			r, row, spieler,
			text, arr, rein = "", raus = "", idx;

		if (data && data.spieltag) {
					
			text = bolds[1].textContent.trim();
			data.spieltag.datum = text.substr(8, 10);

			idx = text.indexOf("Zuschaueranzahl: ");
			if (idx >= 0 && data.spieltag.ort == OSext.SPIELORT.HEIM) {
				data.spieltag.zuseher = +text.split("Zuschaueranzahl: ")[1].split(" (")[0];			
			}
			
			for (r = 19; r < tables[0].rows.length; r++) {
				row = tables[0].rows[r];
							
				spieler = OSext.getListElement(data.team.spieler, "name", row.cells[2].textContent) ||
						OSext.getListElement(data.team.spieler, "name", row.cells[6].textContent);
				if (spieler) {
					if (row.cells[0].textContent.charCodeAt(0) <= 84) {
						spieler.training.aktuell.faktor = 1.35;
					} else {
						spieler.training.aktuell.faktor = 1.1;
					}
				}
			}

			for (r = 0; r < tables[2].rows.length; r++) {
				row = tables[2].rows[r];				
				text = row.cells[1].textContent;
				if (text.indexOf("wechselt:") >= 0) {
					arr = text.split(": ")[1].split(" kommt f");
					rein = arr[0];
					arr = arr[1].split(" ");
					raus = arr[1] + " " + arr[2]; // Vor und Nachname
				} else if (text.indexOf("verletzt ausgewechselt") >= 0) {
					arr = text.split(" ");
					raus = arr[0] + " " + arr[1]; // Vor und Nachname
					rein = arr[9] + " " + arr[10]; // Vor und Nachname
				}
				if (rein !== "" && raus !== "") {
					spieler = OSext.getListElement(data.team.spieler, "name", rein);
					if (spieler) {
						spieler.training.aktuell.faktor = 1.25;
					}
					spieler = OSext.getListElement(data.team.spieler, "name", raus);
					if (spieler) {
						spieler.training.aktuell.faktor = 1.25;
					}
				}
			}
		}		
	},
	
	/**
	 * Erweitert die Spielberichtdaten.
	 */
	extend : function (data, params) {

		// FEATURE Statistik für Spielabschnitte im Report
		
		// FEATURE Summe Zweikaempfe, Torschuesse und Tore

	}			
};
