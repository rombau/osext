/**
 * Klasse für den ZAT-Bericht
 * @constructor
 */
OSext.Sites.Zar = function (wrappeddoc) {
	
	this.classname = "OSext.Sites.Zar";
	
	this.wrappeddoc = wrappeddoc;
};

OSext.Sites.Zar.prototype = {
	
	/**
	 * Prüft die Seite auf Änderungen
	 * @throws {@link OSext.SiteChangeError}
	 */
	check : function () {

		var divs = this.wrappeddoc.doc.getElementsByTagName("div"),
			tables = this.wrappeddoc.doc.getElementsByTagName("table"),
			last = tables.length - 1;
	
		if (divs && divs.length > 0 && divs[0].lastChild.textContent.search("Diese Seite ist ohne Team nicht verf.+gbar!") != -1) {
			throw new OSext.AuthenticationError("Demoteam");
		}
	
		if (!tables || tables.length < 2) {
			OSext.Log.warn("Zat-Report -> Tabellenanzahl wurde geändert!");
			return false;
		}
		
		if (!tables[0] || !tables[0].rows || tables[0].rows.length < 1 || 
				tables[0].rows[0].cells.length < 2) {
			throw new OSext.SiteChangeError("Zat-Report -> Tabellenspalten (Einnahmen/Ausgaben) wurde geändert!");
		} 

		if (!tables[last] || !tables[last].rows || tables[last].rows.length < 1 || 
				tables[last].rows[0].cells.length < 2) {
			throw new OSext.SiteChangeError("Zat-Report -> Tabellenspalten (Trainingserfolge) wurde geändert!");
		} else {
			if (tables[last].rows[0].cells[0].innerHTML.search(/<a.+>/) == -1) {
				throw new OSext.SiteChangeError("Zat-Report -> Tabellenspalte (Trainingserfolge) wurde geändert!");
			}
		}
		return true;
	},

	/**
	 * Extrahiert die Berichtdaten (Einnahmen/Ausgaben und Aufwertungen),
	 * sofern die Daten noch nicht geladen wurden.
	 */
	extract : function (data, params) {

		var tables = this.wrappeddoc.doc.getElementsByTagName("table"),
			buchungen = tables[0],
			aufwertungen = tables[tables.length - 1],
			r, row, spieler, txt, betrag;
			
		for (r = 0; r < aufwertungen.rows.length; r++) {
			
			row = aufwertungen.rows[r];
			
			if (row.cells[1].textContent.search(/Erfahrung/) == -1) {
				
				spieler = OSext.getListElement(data.team.spieler, "id",
						OSext.getLinkId(row.cells[0].firstChild.href));
	
				if (spieler && !spieler.training.aktuell.aufwertung) {
					spieler.training.aktuell.aufwertung = (row.cells[1].textContent.indexOf("erfolgreich") != -1);
				}
			}
		}	
	 		
		for (r = 0; r < buchungen.rows.length; r++) {
			
			row = buchungen.rows[r];

			if (row.cells[0].textContent.length > 1) {
				betrag = +row.cells[1].textContent.split(" Eur")[0].replace(/\./g, "");
			}
			
			txt = row.cells[0].textContent; 
			if (txt.search(/Zuschauereinnahmen/) != -1) {
				data.spieltag.stadioneinnahmen = betrag;
			} else if (txt.search(/Stadionkosten/) != -1) {
				data.spieltag.stadionkosten = betrag; 
			} else if (txt.search(/Siegpr.+mie/) != -1) {
				data.spieltag.siegpraemie = betrag; 
			} else if (txt.search(/Punktpr.+mie/) != -1) {
				data.spieltag.punktpraemie = betrag; 
			} else if (txt.search(/Torpr.+mie/) != -1) {
				data.spieltag.torpraemie = betrag; 
			} else if (txt.search(/Fernsehgelder/) != -1) {
				data.spieltag.tvgelder = betrag; 
			} else if (txt.search(/Fanartikel/) != -1) {
				data.spieltag.fanartikel = betrag; 
			} else if (txt.search(/Werbevertrag/) != -1) {
				data.spieltag.grundpraemie = betrag; 
			} else if (txt.search(/Geh.+lter/) != -1) {
				data.spieltag.spielergehaelter = betrag; 
			} else if (txt.search(/Trainer/) != -1) {
				data.spieltag.trainergehaelter = betrag; 
			} else if (txt.search(/Jugendf.+rderung/) != -1)  {
				data.spieltag.jugend = betrag; 
			} else if (txt.search(/Physiotherapeut/) != -1) {
				data.spieltag.physio += betrag; 
			} else if (txt.search(/Leihgeb.+hr.+/) != -1)  {
				data.spieltag.leihen += betrag; 
			} else if (txt.search(/Gesamtsumme/) != -1) {
				data.spieltag.summe = betrag; 
			}
		}
	},
	
	/**
	 * Erweitert die Aufwertungen.
	 */
	extend : function (data, params) {

		var tables = this.wrappeddoc.doc.getElementsByTagName("table"),
			table = tables[tables.length - 1],
			tableClone = table.cloneNode(true),
			r, row, spieler, baseCell, wert;
		
		for (r = 0; r < tableClone.rows.length; r++) {

			row = tableClone.rows[r];
			
			if (row.cells[1].textContent.search(/Erfahrung/) == -1) {

				spieler = OSext.getListElement(data.team.spieler, "id",
						OSext.getLinkId(row.cells[0].firstChild.href));
		
				if (spieler && spieler.training && spieler.training.aktuell && spieler.training.aktuell.trainer
						&& spieler.training.aktuell.wahrscheinlichkeit && spieler.training.aktuell.faktor) {
					wert = OSext.limitTo99(spieler.training.aktuell.wahrscheinlichkeit * spieler.training.aktuell.faktor);
					row.cells[1].textContent += " bei ";
					row.cells[1].textContent += Number(wert).toFixed(2);
					row.cells[1].textContent += "%";
				}
			}
		}
		
		table.parentNode.replaceChild(tableClone, table);
	}
};
