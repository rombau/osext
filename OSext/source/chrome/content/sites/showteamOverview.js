/**
 * Klasse für die Mannschaft-Übersichtsseite
 * @constructor
 */
OSext.Sites.ShowteamOverview = function (wrappeddoc) {
	
	this.classname = "OSext.Sites.ShowteamOverview";
	
	this.columns = ["#", "Nr.", "Name", "Alter", "Pos", "Auf", "", "Land", "U", "MOR", "FIT", 
	               "Skillschnitt", "Opt.Skill", "S", "Sperre", "Verl.", "T", "TS"];
	
	this.ids = { 
		team : "team"
	};
	
	this.wrappeddoc = wrappeddoc;
	
	this.toolbar = new OSext.TeamToolbar(wrappeddoc);
};

OSext.Sites.ShowteamOverview.prototype = {
	
	/**
	 * Prüft die Seite auf Änderungen und Anmeldungsinformationen.
	 * @throws 
	 * {@link OSext.SiteChangeError} oder {@link OSext.AuthenticationError}
	 */
	check : function (params) {

		var bolds = this.wrappeddoc.doc.getElementsByTagName("b"),
			table = this.wrappeddoc.doc.getElementById(this.ids.team),
			c;
		
		if (params && params.c) {
			return false;
		}
		
		if (!bolds || bolds.length === 0 || 
				bolds[0].firstChild.textContent.search(/.+\s-\s/) == -1 || 
				bolds[0].lastElementChild.tagName.toUpperCase() != "A") {
			throw new OSext.SiteChangeError("Mannschaft/Übersicht -> Überschrift wurde geändert!");
		}
		
		if (!table || !table.rows || table.rows.length < 2 || 
				table.rows[0].cells.length != this.columns.length) {
			throw new OSext.SiteChangeError("Mannschaft/Übersicht -> Tabelle wurde geändert!");
		} else {
			for (c = 0; c < this.columns.length - 1; c++) {
				if (table.rows[0].cells[c].textContent != this.columns[c]) {
					throw new OSext.SiteChangeError("Mannschaft/Übersicht -> Tabellenspalten wurden geändert!");
				}
			}
		}

		if (bolds[0].firstChild.textContent.search(/DemoTeam\s-\s/) != -1) {
			throw new OSext.AuthenticationError("Demoteam.");
		}
		return true;
	},
	
	/**
	 * Extrahiert die allgemeinen Spielerdaten
	 */
	extract : function (data, params) {

		var table = this.wrappeddoc.doc.getElementById(this.ids.team),
			r, row, spieler, s, sperre, art;
			
		for (r = 1; r < table.rows.length - 1; r++) {

			row = table.rows[r];
			spieler = data.team.spieler[r - 1];

			if (!spieler) {
				spieler = new OSext.Kaderspieler();
			}

			spieler.nr = row.cells[this.columns.indexOf("#")].textContent;
			spieler.id = OSext.getLinkId(row.cells[this.columns.indexOf("Name")].firstChild.href);
			spieler.name = row.cells[this.columns.indexOf("Name")].textContent;
			spieler.alter = +row.cells[this.columns.indexOf("Alter")].textContent;
			spieler.pos = row.cells[this.columns.indexOf("Pos")].textContent;
			if (spieler.pos == OSext.POS.LEI) {
				spieler.status = OSext.STATUS.VERLIEHEN;
			} else {
				spieler.status = OSext.STATUS.AKTIV;
			}
			spieler.aufstellung = row.cells[this.columns.indexOf("Auf")].textContent;
			spieler.land = row.cells[this.columns.indexOf("Land")].textContent;
			spieler.uefa = row.cells[this.columns.indexOf("U")].textContent;
			spieler.moral = +row.cells[this.columns.indexOf("MOR")].textContent;
			spieler.fitness = +row.cells[this.columns.indexOf("FIT")].textContent;
			spieler.skillschnitt = parseFloat(row.cells[this.columns.indexOf("Skillschnitt")].textContent);
			spieler.opti = parseFloat(row.cells[this.columns.indexOf("Opt.Skill")].textContent);
			
			spieler.setSperren(row.cells[this.columns.indexOf("Sperre")].textContent);
						
			spieler.verletzung = row.cells[this.columns.indexOf("Verl.")].textContent;
			spieler.tsperre = row.cells[this.columns.indexOf("TS")].textContent;
			if (spieler.tsperre.charAt(0) == "L") {
				spieler.tstatus = "L";
				spieler.tsperre = spieler.tsperre.substr(1);
				if (spieler.pos == OSext.POS.LEI) {
					spieler.herkunft = OSext.HERKUNFT.KAUF;
				} else {
					spieler.herkunft = OSext.HERKUNFT.LEIHE;
				}
			} else {
				spieler.tstatus = row.cells[this.columns.indexOf("T")].textContent;
				spieler.herkunft = OSext.HERKUNFT.KAUF;
			}
						
			spieler.verletzung = (spieler.verletzung == "0") ? null : +spieler.verletzung;
			spieler.tstatus = (spieler.tstatus == "N") ? null : spieler.tstatus;
			spieler.tsperre = (spieler.tsperre == "0") ? null : +spieler.tsperre;

			data.team.spieler[r - 1] = spieler;
		}
		data.team.termin = data.termin;
		
	},

	/**
	 * Erweitert die allgemeinen Spielerdaten.
	 */
	extend : function (data, params) {

		var table = this.wrappeddoc.doc.getElementById(this.ids.team),
			tableClone = table.cloneNode(true),
			r, row, spieler, baseCell,
			spielerliste,
			cellMarktwertbilanz,
			cellTrainingsbilanz,
			cellP, cellN, cellU;
		
		this.toolbar.show(data);
	
		spielerliste = data.ansicht.team.getSpieler();

		for (r = 0; r < tableClone.rows.length; r++) {

			row = tableClone.rows[r];
			baseCell = row.cells[this.columns.indexOf("#")];
			
			cellMarktwertbilanz = new OSext.WrappedElement(baseCell, true);
			cellTrainingsbilanz = new OSext.WrappedElement(baseCell, true);
			cellP = new OSext.WrappedElement(baseCell, true);
			cellN = new OSext.WrappedElement(baseCell, true);
			cellU = new OSext.WrappedElement(baseCell, true);
			
			if (r === 0 || r == (tableClone.rows.length - 1)) {

				row.cells[this.columns.indexOf("Auf")].innerHTML = "&nbsp;&nbsp;Auf";
				row.cells[this.columns.indexOf("MOR")].textContent = "Mor";
				row.cells[this.columns.indexOf("FIT")].textContent = " Fit";
                row.cells[this.columns.indexOf("Skillschnitt")].textContent = "Skillschn.";
				row.cells[this.columns.indexOf("Sperre")].textContent = "Sp.";

				cellMarktwertbilanz.setHtml("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Bilanz");
				cellTrainingsbilanz.setHtml("&nbsp;Training");
				cellP.setHtml("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&Oslash;P");
				cellN.setHtml("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&Oslash;N");
				cellU.setHtml("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&Oslash;U");

			} else {

				row.cells[this.columns.indexOf("Opt.Skill")].setAttribute(OSext.STYLE.PS, "true");
				
				spieler = OSext.getListElement(spielerliste, "id",
						OSext.getLinkId(row.cells[this.columns.indexOf("Name")].firstChild.href));

				if (spieler && spieler.id) {
					
					cellMarktwertbilanz.setText(spieler.getMarktwertbilanz());
					cellMarktwertbilanz.setTooltip(spieler.getMarktwertbilanzTooltip());

					cellTrainingsbilanz.setText(spieler.getTrainingsbilanz());
					cellTrainingsbilanz.setTooltip(spieler.getTrainingsbilanzTooltip());

					cellP.setText(Number(spieler.getSummePrimaerSkills() / 4).toFixed(2));
					cellN.setText(Number(spieler.getSummeNebenSkills() / (17 - 4 - 4)).toFixed(2));
					cellU.setText(Number(spieler.getSummeUnveraenderlicheSkills() / 4).toFixed(2));
				}
			}

			row.appendChild(cellMarktwertbilanz.element);
			row.appendChild(cellTrainingsbilanz.element);
			row.appendChild(cellP.element);			
			row.appendChild(cellN.element);			
			row.appendChild(cellU.element);			
		}
		
		table.parentNode.replaceChild(tableClone, table);
	},
	
	/**
	 * Aktualisiert die Daten der Spielerseite mit jenen der Auswahl
	 */
	update : function (data, parameters) {

		var table = this.wrappeddoc.doc.getElementById(this.ids.team),
			tableClone = table.cloneNode(true),
			r, row, spieler, c,
			spielerliste,
			cellMarktwertbilanz,
			cellTrainingsbilanz,
			cellP, cellN, cellU;

		this.toolbar.handleSelections(data);

		spielerliste = data.ansicht.team.getSpieler();
		
		this.toolbar.setInfo(data.team.getTeamInfoHTML(spielerliste));

		for (r = 1; r < tableClone.rows.length - 1; r++) {
			row = tableClone.rows[r];

			spieler = OSext.getListElement(spielerliste, "id",
					OSext.getLinkId(row.cells[2].firstChild.href));

			if (spieler) {
				for (c = 0; c < row.cells.length; c++) {
					if (c != this.columns.indexOf("#")) {
						row.cells[c].className = (spieler.status == OSext.STATUS.VERLIEHEN ? OSext.POS.LEI : spieler.pos);
					}
				}
			}
			
			if (spieler && spieler.status && spieler.status > OSext.STATUS.INAKTIV) {

				row.cells[this.columns.indexOf("Alter")].innerHTML = spieler.alter;
				row.cells[this.columns.indexOf("Pos")].innerHTML = (spieler.status == OSext.STATUS.VERLIEHEN ? OSext.POS.LEI : spieler.pos);				
				row.cells[this.columns.indexOf("Auf")].innerHTML = spieler.aufstellung;
				row.cells[this.columns.indexOf("MOR")].innerHTML = spieler.moral;
				row.cells[this.columns.indexOf("FIT")].innerHTML = spieler.fitness;
				row.cells[this.columns.indexOf("Skillschnitt")].innerHTML = spieler.skillschnitt.toFixed(2);
				row.cells[this.columns.indexOf("Opt.Skill")].innerHTML = spieler.opti.toFixed(2);
				row.cells[this.columns.indexOf("S")].innerHTML = spieler.getSonderskillsHTML();
				
				row.cells[this.columns.indexOf("Sperre")].innerHTML = spieler.getSperrenHTML();
				
				row.cells[this.columns.indexOf("Verl.")].innerHTML = spieler.verletzung;
				if (spieler.tstatus != "L") {
					row.cells[this.columns.indexOf("T")].innerHTML = spieler.tstatus;
					row.cells[this.columns.indexOf("TS")].innerHTML = spieler.tsperre || "";
				} else {
					row.cells[this.columns.indexOf("T")].innerHTML = "";
					row.cells[this.columns.indexOf("TS")].innerHTML = spieler.getLeihInfoHTML();
				}

				cellMarktwertbilanz = new OSext.WrappedElement(row.cells[this.columns.length]);
				cellTrainingsbilanz = new OSext.WrappedElement(row.cells[this.columns.length + 1]);
				cellP = new OSext.WrappedElement(row.cells[this.columns.length + 2]);
				cellN = new OSext.WrappedElement(row.cells[this.columns.length + 3]);
				cellU = new OSext.WrappedElement(row.cells[this.columns.length + 4]);

				cellMarktwertbilanz.setText(spieler.getMarktwertbilanz());
				cellMarktwertbilanz.setTooltip(spieler.getMarktwertbilanzTooltip());

				cellTrainingsbilanz.setText(spieler.getTrainingsbilanz());
				cellTrainingsbilanz.setTooltip(spieler.getTrainingsbilanzTooltip());

				cellP.setText(Number(spieler.getSummePrimaerSkills() / 4).toFixed(2));
				cellN.setText(Number(spieler.getSummeNebenSkills() / (17 - 4 - 4)).toFixed(2));
				cellU.setText(Number(spieler.getSummeUnveraenderlicheSkills() / 4).toFixed(2));

				row.cells[this.columns.indexOf("Alter")].setAttribute(OSext.STYLE.UPDATED, data.ansicht.team.getStyle());
				row.cells[this.columns.indexOf("Auf")].setAttribute(OSext.STYLE.UPDATED, data.ansicht.team.getStyle());
				for (c = this.columns.indexOf("MOR"); c <= row.cells.length - 1; c++) {
					row.cells[c].setAttribute(OSext.STYLE.UPDATED, data.ansicht.team.getStyle());
				}
				
			} else {
				
				row.cells[this.columns.indexOf("Alter")].textContent = "";
				row.cells[this.columns.indexOf("Pos")].innerHTML = "";
				row.cells[this.columns.indexOf("Auf")].textContent = "";
				row.cells[this.columns.indexOf("MOR")].textContent = "";
				row.cells[this.columns.indexOf("FIT")].textContent = "";
				row.cells[this.columns.indexOf("Skillschnitt")].textContent = "";
				row.cells[this.columns.indexOf("Opt.Skill")].textContent = "";
				row.cells[this.columns.indexOf("S")].textContent = "";
				row.cells[this.columns.indexOf("Sperre")].textContent = "";
				row.cells[this.columns.indexOf("Verl.")].textContent = "";
				row.cells[this.columns.indexOf("T")].textContent = "";
				row.cells[this.columns.indexOf("TS")].textContent = "";
				
				for (c = this.columns.length; c < row.cells.length; c++) {
					row.cells[c].textContent = "";
				}
			}
		}
		
		table.parentNode.replaceChild(tableClone, table);
	}
	
};
