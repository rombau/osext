/**
 * Klasse für die Mannschaft-Vertragsseite
 * @constructor
 */
OSext.Sites.ShowteamContracts = function (wrappeddoc) {

	this.classname = "OSext.Sites.ShowteamContracts";
	
	this.columns = ["#", "Nr.", "Name", "Alter", "Pos", "", "Land", "U", "Skillschnitt", "Opt.Skill", 
	                "Vertrag", "Monatsgehalt", "Spielerwert", "TS"];
		
	this.ids = { 
		team : "team",
		blitz : "osext-blitz"
	};
	
	this.wrappeddoc = wrappeddoc;
	
	this.toolbar = new OSext.TeamToolbar(wrappeddoc);
};

OSext.Sites.ShowteamContracts.prototype = {

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
			throw new OSext.SiteChangeError("Mannschaft/Verträge -> Überschrift wurde geändert!");
		}
		
		if (!table || !table.rows || table.rows.length < 2 || 
				table.rows[0].cells.length != this.columns.length) {
			throw new OSext.SiteChangeError("Mannschaft/Verträge -> Tabelle wurde geändert!");
		} else {
			for (c = 0; c < this.columns.length - 1; c++) {
				if (table.rows[0].cells[c].textContent != this.columns[c]) {
					throw new OSext.SiteChangeError("Mannschaft/Verträge -> Tabellenspalten wurden geändert!");
				}
			}
		}

		if (bolds[0].firstChild.textContent.search(/DemoTeam\s-\s/) != -1) {
			throw new OSext.AuthenticationError("Demoteam.");
		}
		return true;
	},

	/**
	 * Extrahiert die Vertragsdaten der Spieler 
	 */
	extract : function (data, params) {

		var table = this.wrappeddoc.doc.getElementById(this.ids.team),
			r, row, spieler, vertragneu, mwneu, 
			queue = new OSext.RequestQueue(this.wrappeddoc, this, null, OSext);
		
		// XXX Datenbankzugriff
		data.initKaderspielerGeburtstage(spieler);

		for (r = 1; r < table.rows.length - 1; r++) {
	
			row = table.rows[r];
			spieler = data.team.spieler[r - 1];

			if (!spieler) {
				spieler = new OSext.Kaderspieler();
			}

			spieler.id = OSext.getLinkId(row.cells[this.columns.indexOf("Name")].firstChild.href);
			spieler.vertrag = +row.cells[this.columns.indexOf("Vertrag")].textContent;
			spieler.gehalt = +row.cells[this.columns.indexOf("Monatsgehalt")].textContent.replace(/\./g, "");
			spieler.mw = +row.cells[this.columns.indexOf("Spielerwert")].textContent.replace(/\./g, "");	

			// Initialisierung für verliehenen Spieler
			spieler.gehalt24 = spieler.gehalt;
			spieler.gehalt36 = spieler.gehalt;
			spieler.gehalt48 = spieler.gehalt;
			spieler.gehalt60 = spieler.gehalt;

			// Wenn der Geburtstag noch nie gespeichert wurde (gebaktuell=0),
			// wird dieser über die Spielerseite geholt
			if (!spieler.gebaktuell) {
				queue.addSite("sp", {s: spieler.id}, true, false, "Geburtstag(e)");
			}
			
			data.team.spieler[r - 1] = spieler;
		}
		
		if (queue.sitecount) {
			return queue;
		}
	},

	/**
	 * Erzeugt und liefert eine Auswahlliste für Blitz-Zats als Vorlage
	 */
	createBlitzAuswahl : function (data) {
		
		var options = [{text: "-", value: 0}], z, i = 0, termin, newBZ;
		
		for (z = (data.saisonpause ? 1 : data.termin.zat + 1); z < data.saisonplan.length; z++) {
			termin = new OSext.Termin(data.saisonplan[z].termin.saison, data.saisonplan[z].termin.zat);
			if ((termin.zat + 1) % OSext.ZATS_PRO_MONAT === 0) {
				options[++i] = {text: termin.saison + " / " + termin.zat, value: termin.getZats()};
			}
		}
		this.wrappeddoc.addSelect(this.wrappeddoc.doc.body, this.ids.blitz, options, 
			0, false);

		newBZ = this.wrappeddoc.doc.getElementById(this.ids.blitz);
		newBZ.setAttribute("style", "font-size:55%");
		return newBZ;
	},

	/**
	 * Verarbeitet die Blitz-Zat-Auswahl eines Spielers.
	 * Der Blitz-Zat wird in der Datenbank und dem aktuellen Modell gespeichert.
	 */
	handleBlitzAuswahl : function (evt) {
		
		var spielerid = evt.originalTarget.spielerid,
			blitzzat = +evt.originalTarget.value,
			data = evt.originalTarget.data,
			spieler, s;

		if (spielerid) {
			spieler = OSext.getListElement(data.team.spieler, "id", spielerid);
			if (spieler && spieler instanceof OSext.Kaderspieler) {
				spieler.blitzzat = blitzzat;
				if (data) {
					data.database.saveKaderspielerBlitzZat(spieler);
					
					data.clearAllCaches();
					
					if (evt.originalTarget.update && evt.originalTarget.thisarg) {
						evt.originalTarget.update.call(evt.originalTarget.thisarg, data);
					}
				}
			}
		}
	},

	
	/**
	 * Setzt die Parameter für das Handling nach Blitzzatauswahl.
	 */
	setBlitzAuswahlParams : function (auswahl, spieler, data) {
	
		if (spieler && spieler.id) { 
			if (spieler.blitzzat) {
				auswahl.value = spieler.blitzzat;
			}
			auswahl.spielerid = spieler.id;
			auswahl.data = data;
			auswahl.update = this.update;
			auswahl.thisarg = this;
			auswahl.addEventListener("change", this.handleBlitzAuswahl, false);
		} else {
			auswahl.textContent = "";
		}
	},
	
	/**
	 * Erweitert die Vertragsdaten.
	 */
	extend : function (data, params) {

		var table = this.wrappeddoc.doc.getElementById(this.ids.team),
			tableClone = table.cloneNode(true),
			r, row, spieler, baseCell,
			spielerliste,
			cellGeburtstag, cellMWF, cellBlitzZat, baseBZ, newBZ,
			cellBlitzWert, blitz;
		
		this.toolbar.show(data);

		spielerliste = data.ansicht.team.getSpieler();
		
		baseBZ = this.createBlitzAuswahl(data);
		
		for (r = 0; r < tableClone.rows.length; r++) {

			row = tableClone.rows[r];
			baseCell = row.cells[this.columns.indexOf("#")];
			
			cellGeburtstag = new OSext.WrappedElement(baseCell, true);
			cellMWF = new OSext.WrappedElement(baseCell, true);
			cellBlitzZat = new OSext.WrappedElement(baseCell, true);
			cellBlitzWert = new OSext.WrappedElement(baseCell, true);

			if (r === 0 || r == (tableClone.rows.length - 1)) {

				row.cells[this.columns.indexOf("Skillschnitt")].textContent = "Skillschn.";
				row.cells[this.columns.indexOf("Monatsgehalt")].textContent = "Gehalt";

				cellGeburtstag.setText("Geb.");
				cellMWF.setHtml("&nbsp;&nbsp;TF");
				cellBlitzWert.setHtml("&nbsp;&nbsp;Blitzwert");
				cellBlitzZat.setHtml("&nbsp;&nbsp;Blitz-Zat");
				
			} else {

				row.cells[this.columns.indexOf("Opt.Skill")].setAttribute(OSext.STYLE.PS, "true");

				spieler = OSext.getListElement(spielerliste, "id",
						OSext.getLinkId(row.cells[this.columns.indexOf("Name")].firstChild.href));

				if (spieler && spieler.id) {
					
					cellGeburtstag.setText(spieler.geburtstag || "?");
					cellMWF.setText((spieler.mwfaktor * 100).toFixed(1) + "%");
					
					blitz = spieler.getBlitzwert();
					if (blitz > 0) {
						cellBlitzWert.setText(OSext.fmtTausend(blitz));
						cellBlitzWert.setAttribute(OSext.STYLE.TIME, OSext.STYLE.CURRENT);
					} else if (blitz < 0) {
						cellBlitzWert.setText(OSext.fmtTausend(-blitz));
						cellBlitzWert.setAttribute(OSext.STYLE.TIME, OSext.STYLE.FUTURE);
					} else {
						cellBlitzWert.setText("0");
						cellBlitzWert.setAttribute(OSext.STYLE.TIME, OSext.STYLE.FUTURE);						
					}

					cellBlitzZat.setText("");
					if (baseBZ) {
						newBZ = new OSext.WrappedElement(baseBZ, true);
						this.setBlitzAuswahlParams(newBZ.element, spieler, data);
						cellBlitzZat.appendChild(newBZ);						
					}					
				}
			}

			row.insertBefore(cellGeburtstag.element, row.cells[this.columns.indexOf("Pos")]);
			row.appendChild(cellMWF.element);
			row.appendChild(cellBlitzWert.element);
			row.appendChild(cellBlitzZat.element);
		}

		table.parentNode.replaceChild(tableClone, table);
		baseBZ.parentNode.removeChild(baseBZ);
	},	

	/**
	 * Aktualisiert die Daten der Spielerseite mit jenen der Auswahl
	 */
	update : function (data, parameters) {

		var table = this.wrappeddoc.doc.getElementById(this.ids.team),
			tableClone = table.cloneNode(true),
			r, row, spieler, c,
			spielerliste,
			cellBlitzWert, blitz;

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
				row.cells[this.columns.indexOf("Pos")+1].innerHTML = (spieler.status == OSext.STATUS.VERLIEHEN ? OSext.POS.LEI : spieler.pos);				
				row.cells[this.columns.indexOf("Skillschnitt")+1].innerHTML = spieler.skillschnitt.toFixed(2);
				row.cells[this.columns.indexOf("Opt.Skill")+1].innerHTML = spieler.opti.toFixed(2);
				row.cells[this.columns.indexOf("Vertrag")+1].innerHTML = spieler.vertrag;
				row.cells[this.columns.indexOf("Monatsgehalt")+1].innerHTML = OSext.fmtTausend(spieler.gehalt);
				row.cells[this.columns.indexOf("Spielerwert")+1].innerHTML = OSext.fmtTausend(spieler.mw);
				row.cells[this.columns.indexOf("TS")+1].innerHTML = spieler.tsperre;
				row.cells[this.columns.indexOf("TS")+2].innerHTML = (spieler.mwfaktor * 100).toFixed(1) + "%";
				
				
				cellBlitzWert = new OSext.WrappedElement(row.cells[this.columns.length + 2]);

				blitz = spieler.getBlitzwert();
				if (blitz > 0) {
					cellBlitzWert.setText(OSext.fmtTausend(blitz));
					cellBlitzWert.setAttribute(OSext.STYLE.TIME, OSext.STYLE.CURRENT);
				} else if (blitz < 0) {
					cellBlitzWert.setText(OSext.fmtTausend(-blitz));
					cellBlitzWert.setAttribute(OSext.STYLE.TIME, OSext.STYLE.FUTURE);
				} else {
					cellBlitzWert.setText("0");			
					cellBlitzWert.setAttribute(OSext.STYLE.TIME, OSext.STYLE.FUTURE);
				}

				row.cells[this.columns.indexOf("Alter")].setAttribute(OSext.STYLE.UPDATED, data.ansicht.team.getStyle());
				for (c = this.columns.indexOf("Skillschnitt")+1; c <= row.cells.length - 1; c++) {
					row.cells[c].setAttribute(OSext.STYLE.UPDATED, data.ansicht.team.getStyle());
				}
				
			} else {
				
				row.cells[this.columns.indexOf("Alter")].textContent = "";
				row.cells[this.columns.indexOf("Pos")+1].innerHTML = "";
				row.cells[this.columns.indexOf("Skillschnitt")+1].textContent = "";
				row.cells[this.columns.indexOf("Opt.Skill")+1].textContent = "";
				row.cells[this.columns.indexOf("Vertrag")+1].textContent = "";
				row.cells[this.columns.indexOf("Monatsgehalt")+1].textContent = "";
				row.cells[this.columns.indexOf("Spielerwert")+1].textContent = "";
				row.cells[this.columns.indexOf("TS")+1].textContent = "";
				row.cells[this.columns.indexOf("TS")+2].textContent = "";

				row.cells[this.columns.length+2].textContent = "";	
			}
			
			this.setBlitzAuswahlParams(row.cells[this.columns.length + 3].firstChild, spieler, data);
		}
				
		table.parentNode.replaceChild(tableClone, table);
	}
};
