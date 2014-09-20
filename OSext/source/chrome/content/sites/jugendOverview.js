/**
 * Klasse für die Jugend-Übersichtsseite
 * @constructor
 */
OSext.Sites.JugendOverview = function (wrappeddoc) {
	
	this.classname = "OSext.Sites.JugendOverview";
	
	this.columns = ["Alter", "Land", "U", "Skillschnitt", "Talent", "Aktion", "Aufwertung"];
	this.newcols = ["Alter", "Pos", "Land", "", "U", "Skillschn.", "Opt.Skill", "Talent", "Aktion", "Aufwertung",
	                "Marktwert", "MW.Zuwachs", "Aufwertungen", "P", "N", "US"];
	
	this.wrappeddoc = wrappeddoc;
	
	this.toolbar = new OSext.JugendToolbar(wrappeddoc);
};

OSext.Sites.JugendOverview.prototype = {
	
	/**
	 * Prüft die Seite auf Änderungen und Anmeldungsinformationen.
	 * @throws 
	 * {@link OSext.SiteChangeError} oder {@link OSext.AuthenticationError}
	 */
	check : function (params) {

		var bs = this.wrappeddoc.doc.getElementsByTagName("b"),
			divs = this.wrappeddoc.doc.getElementsByTagName("div"),
			tables = this.wrappeddoc.doc.getElementsByTagName("table"), c;
		
		if (bs && bs.length > 0 && bs[0].textContent.search("Jugendspieler ins A-Team berufen") != -1) {
			return false;
		}
		
		if (divs && divs.length > 0 && divs[0].lastChild.textContent.search("Diese Seite ist ohne Team nicht verf.+gbar!") != -1) {
			throw new OSext.AuthenticationError("Demoteam");
		}
				
		if (!tables[1] || !tables[1].rows || tables[1].rows.length < 2 || 
				tables[1].rows[0].cells.length != this.columns.length) {
			throw new OSext.SiteChangeError("Jugend/Übersicht -> Tabelle wurde geändert!");
		} else {
			for (c = 0; c < this.columns.length - 1; c++) {
				if (tables[1].rows[0].cells[c].textContent != this.columns[c]) {
					throw new OSext.SiteChangeError("Jugend/Übersicht -> Tabellenspalten wurden geändert!");
				}
			}
		}	
		return true;
	},
	
	/**
	 * Extrahiert die allgemeinen Jugendspielerdaten
	 */
	extract : function (data, params) {
		
		var table = this.wrappeddoc.doc.getElementsByTagName("table")[1],
			r, row, spieler, 
			alter = 0, nr = 1,
			aufwertungsliste, i;
		
		for (r = 1; r < table.rows.length - 1; r++) {

			row = table.rows[r];
			spieler = data.team.jugend[r - 1];

			if (!spieler) {
				spieler = new OSext.Jugendspieler();
			}

			spieler.alter = +row.cells[this.columns.indexOf("Alter")].textContent;

			// Nummer des Spielers im Jahrgang bestimmen
			if (spieler.alter != alter) {
				nr = 1;
				alter = spieler.alter;
			}
			spieler.nr = nr++;
			
			// Position eines Torhüters wird gespeichert und nicht mehr verändert
			if (row.cells[0].className && row.cells[0].className == OSext.POS.TOR) {
				spieler.pos = row.cells[0].className;
			}
			
			spieler.land = row.cells[this.columns.indexOf("Land") + 1].textContent;
			spieler.uefa = row.cells[this.columns.indexOf("U") + 1].textContent;
			spieler.skillschnitt = parseFloat(row.cells[this.columns.indexOf("Skillschnitt") + 1].textContent);
			spieler.talent = row.cells[this.columns.indexOf("Talent") + 1].textContent;
			
			aufwertungsliste = row.cells[this.columns.indexOf("Aufwertung") + 1].textContent.split("+");
			for (i = 1; i < aufwertungsliste.length; i++) {
				spieler.aufwertungen += Number(aufwertungsliste[i].charAt(0));
			}

			// Negative ID temporär festlegen
			spieler.id = -r;
			
			data.team.jugend[r - 1] = spieler;
		}
	},

	/**
	 * Erweitert die allgemeinen Jugendspielerdaten.
	 */
	extend : function (data, params) {

		var table = this.wrappeddoc.doc.getElementsByTagName("table")[1],
			tableClone = table.cloneNode(true),
			r, row, c, spieler, baseCell,
			jugendliste,
			alter = 0,
			cellPos, cellOpti, cellMarktwert,
			cellMarktwertbilanz, cellAufwertungsbilanz,
			cellP, cellN, cellU;
		
		this.toolbar.show(data);
		
		jugendliste = data.team.jugend;
		
		for (r = 0; r < table.rows.length - 1; r++) {
			
			row = tableClone.rows[r];
			baseCell = row.cells[this.columns.indexOf("Alter")];
			
			cellPos = new OSext.WrappedElement(baseCell, true);
			cellOpti = new OSext.WrappedElement(baseCell, true);
			cellMarktwert = new OSext.WrappedElement(baseCell, true);
			cellMarktwertbilanz = new OSext.WrappedElement(baseCell, true);
			cellAufwertungsbilanz = new OSext.WrappedElement(baseCell, true);
			cellP = new OSext.WrappedElement(baseCell, true);
			cellN = new OSext.WrappedElement(baseCell, true);
			cellU = new OSext.WrappedElement(baseCell, true);
			
			if (r === 0) {
				
                row.cells[this.columns.indexOf("Skillschnitt")].textContent = "Skillschn.";
				row.cells[this.columns.indexOf("Talent")].innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;Talent";

				cellPos.setText("Pos");
				cellOpti.setHtml("&nbsp;Opt.Skill");
				cellMarktwert.setHtml("&nbsp;&nbsp;Marktwert");
				cellMarktwertbilanz.setHtml("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Bilanz");
				cellAufwertungsbilanz.setHtml("&nbsp;&nbsp;&Oslash;Aufw.");
				cellP.setHtml("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&Oslash;P");
				cellN.setHtml("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&Oslash;N");
				cellU.setHtml("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&Oslash;U");

			} else {

				spieler = jugendliste[r - 1];
				
				// Formatierung pro Jahrgang
				if (alter != spieler.alter) {
					alter = spieler.alter;
					if (r > 1) {
						row.className = OSext.STYLE.JUGEND;
					}
				} 
			
				cellPos.setText(spieler.getPos());
				
				cellOpti.setText(Number(spieler.getOpti()).toFixed(2));
				cellOpti.setAttribute(OSext.STYLE.PS, "true");
				
				cellMarktwert.setText(OSext.fmtTausend(spieler.getMarktwert()));
								
				cellMarktwertbilanz.setText(spieler.getMarktwertbilanz());
				cellMarktwertbilanz.setTooltip(spieler.getMarktwertbilanzTooltip());

				cellAufwertungsbilanz.setText(spieler.getAufwertungsbilanz());
				cellAufwertungsbilanz.setTooltip(spieler.getAufwertungsbilanzTooltip());

				cellP.setText(Number(spieler.getSummePrimaerSkills() / 4).toFixed(2));
				cellN.setText(Number(spieler.getSummeNebenSkills() / (17 - 4 - 4)).toFixed(2));
				cellU.setText(Number(spieler.getSummeUnveraenderlicheSkills() / 4).toFixed(2));

			}
			
			row.insertBefore(cellPos.element, row.cells[this.columns.indexOf("Land")]);
			row.insertBefore(cellOpti.element, row.cells[this.columns.indexOf("Talent") + (r === 0 ? 1 : 2)]);
			
			row.appendChild(cellMarktwert.element);
			row.appendChild(cellMarktwertbilanz.element);
			row.appendChild(cellAufwertungsbilanz.element);
			row.appendChild(cellP.element);			
			row.appendChild(cellN.element);			
			row.appendChild(cellU.element);

			// Formatierung anhand Position
			if (r !== 0 && spieler) {
				for (c = 0; c < row.cells.length; c++) {
					if (!row.cells[c].innerHTML || row.cells[c].innerHTML.length === 0) {
						row.cells[c].innerHTML = ".";						
						row.cells[c].className = "BAK";
					}
					if (!row.cells[c].className || row.cells[c].className.length === 0) {
						row.cells[c].className = spieler.getPos();
					}
				}
			}
		}
		
		table.parentNode.replaceChild(tableClone, table);
	},
	
	/**
	 * Aktualisiert die Jugendspielerdaten anhand der Auswahl
	 */
	update : function (data, parameters) {

		var table = this.wrappeddoc.doc.getElementsByTagName("table")[1],
			tableClone = table.cloneNode(true),
			r, row, c, spieler, baseCell,
			jugendliste,
			alter = 0,
			cellPos, cellOpti, cellMarktwert,
			cellMarktwertbilanz, cellAufwertungsbilanz,
			cellP, cellN, cellU;

		this.toolbar.handleSelections(data);

		jugendliste = data.ansicht.jugend.getSpieler();
		
		for (r = 1; r < tableClone.rows.length - 1; r++) {
			
			row = tableClone.rows[r];
			spieler = jugendliste[r - 1];

			for (c = 0; c < row.cells.length; c++) {
				if (c != this.newcols.indexOf("U")) {
					if (row.cells[c].className != OSext.POS.TOR && row.cells[c].className != "BAK") {
						row.cells[c].className = spieler.getPos();
					}
				}
			}

			row.cells[this.newcols.indexOf("Alter")].innerHTML = spieler.alter;
			row.cells[this.newcols.indexOf("Pos")].innerHTML = spieler.getPos();				
			row.cells[this.newcols.indexOf("Opt.Skill")].innerHTML = spieler.getOpti() ? spieler.getOpti().toFixed(2) : "0.00";				
			row.cells[this.newcols.indexOf("Marktwert")].innerHTML = OSext.fmtTausend(spieler.getMarktwert());				

			cellMarktwertbilanz = new OSext.WrappedElement(row.cells[this.newcols.indexOf("MW.Zuwachs")]);
			cellAufwertungsbilanz = new OSext.WrappedElement(row.cells[this.newcols.indexOf("Aufwertungen")]);
			cellP = new OSext.WrappedElement(row.cells[this.newcols.indexOf("P")]);
			cellN = new OSext.WrappedElement(row.cells[this.newcols.indexOf("N")]);
			cellU = new OSext.WrappedElement(row.cells[this.newcols.indexOf("US")]);

			cellMarktwertbilanz.setText(spieler.getMarktwertbilanz());
			cellMarktwertbilanz.setTooltip(spieler.getMarktwertbilanzTooltip());

			cellAufwertungsbilanz.setText(spieler.getAufwertungsbilanz());
			cellAufwertungsbilanz.setTooltip(spieler.getAufwertungsbilanzTooltip());

			cellP.setText(Number(spieler.getSummePrimaerSkills() / 4).toFixed(2));
			cellN.setText(Number(spieler.getSummeNebenSkills() / (17 - 4 - 4)).toFixed(2));
			cellU.setText(Number(spieler.getSummeUnveraenderlicheSkills() / 4).toFixed(2));

			row.cells[this.newcols.indexOf("Alter")].setAttribute(OSext.STYLE.UPDATED, data.ansicht.jugend.getStyle());
			row.cells[this.newcols.indexOf("Pos")].setAttribute(OSext.STYLE.UPDATED, data.ansicht.jugend.getStyle());
			row.cells[this.newcols.indexOf("Skillschn.")].setAttribute(OSext.STYLE.UPDATED, data.ansicht.jugend.getStyle());
			row.cells[this.newcols.indexOf("Opt.Skill")].setAttribute(OSext.STYLE.UPDATED, data.ansicht.jugend.getStyle());
			row.cells[this.newcols.indexOf("Marktwert")].setAttribute(OSext.STYLE.UPDATED, data.ansicht.jugend.getStyle());
			for (c = this.newcols.indexOf("MW.Zuwachs"); c <= row.cells.length - 1; c++) {
				row.cells[c].setAttribute(OSext.STYLE.UPDATED, data.ansicht.jugend.getStyle());
			}
		}		
		table.parentNode.replaceChild(tableClone, table);
	}
	
};
