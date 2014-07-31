/**
 * Klasse für die Mannschaft-Saisonplanseite
 * 
 * @constructor
 */
OSext.Sites.ShowteamSaison = function (wrappeddoc) {
	
	this.classname = "OSext.Sites.ShowteamSaison";
	
	this.columns = ["ZAT", "Spielart", "Gegner", "Ergebnis", "Bericht"];
			
	this.wrappeddoc = wrappeddoc;
		
	this.toolbar = new OSext.SaisonToolbar(wrappeddoc);
};

OSext.Sites.ShowteamSaison.prototype = {

	/**
	 * Prüft die Seite auf Änderungen und Anmeldungsinformationen.
	 * 
	 * @throws {@link OSext.SiteChangeError}
	 *             oder {@link OSext.AuthenticationError}
	 */
	check : function (params) {

		var bolds = this.wrappeddoc.doc.getElementsByTagName("b"),
			saisons = this.wrappeddoc.doc.getElementsByName("saison"),
			tables = this.wrappeddoc.doc.getElementsByTagName("table"),	table,
			c;
		
		if (params && params.c) {
			return false;
		}

		if (!bolds || bolds.length === 0 || 
				bolds[0].firstChild.textContent.search(/.+\s-\s/) == -1 || 
				bolds[0].lastElementChild.tagName.toUpperCase() != "A") {
			throw new OSext.SiteChangeError("Mannschaft/Saisonplan -> Überschrift wurde geändert!");
		}
		
		if (!saisons || saisons.length === 0 || !saisons[0].value) {
			throw new OSext.SiteChangeError("Mannschaft/Saisonplan -> Saisonauswahl wurde nicht gefunden!");
		} 
		
		if (!tables || tables.length < 3) {
			throw new OSext.SiteChangeError("Mannschaft/Saisonplan -> Tabelle wurde nicht gefunden!");
		} else {
			table = tables[2];
		}
		
		if (!tables[0] || !tables[0].rows || tables[0].rows.length < 2 || 
				tables[0].rows[1].cells.length < 2 || 
				tables[0].rows[1].cells[1].lastElementChild.href.search(/javascript:tabellenplatz(\d*)/) == -1) {
			throw new OSext.SiteChangeError("Mannschaft/Saisonplan -> Tabellenplatz wurde nicht gefunden!");
		}
		
		if (!table || !table.rows || table.rows.length < 1 || 
				table.rows[0].cells.length != this.columns.length) {
			throw new OSext.SiteChangeError("Mannschaft/Saisonplan -> Tabelle wurde geändert!");
		} else {
			for (c = 0; c < this.columns.length - 1; c++) {
				if (table.rows[0].cells[c].textContent != this.columns[c]) {
					throw new OSext.SiteChangeError("Mannschaft/Saisonplan -> Tabellespalten wurden geändert!");
				}
			}
		}

		if (bolds[0].firstChild.textContent.search(/DemoTeam\s-\s/) != -1) {
			throw new OSext.AuthenticationError("Demoteam.");
		}
		return true;
	},
	
	/**
	 * Extrahiert den Saisonplan
	 * 
	 * @param {OSext.Data} data Anwendungsdaten
	 */
	extract : function (data, params) {

		var saisonselect = this.wrappeddoc.doc.getElementsByName("saison")[0],
			saison = +saisonselect.value,
			table0 = this.wrappeddoc.doc.getElementsByTagName("table")[0],
			table1 = this.wrappeddoc.doc.getElementsByTagName("table")[2],
			r, row, spieltag, valid = false,
			report, queue;
		
		// eigene Team-Id aus Tabellenplatz-Link
		data.team.id = OSext.getLinkId(table0.rows[1].cells[1].lastElementChild.href);
		
		// normale Verabeitung
		if (!data.vorsaison) {
			
			this.extractSaisonplan(table1, data, saison);
			
			// vor Zat 1 wird der Saisonplan der Vorsaison (bzw. der letzte Zat) benötigt
			// aber nur, wenn schon der _neue_ Saisonplan extrahiert wurde
			if (data.saisonpause && !data.isLaufendeSaison()) {
				
				queue = new OSext.RequestQueue(this.wrappeddoc, this, null, OSext);
				queue.addSite("showteam", {s: 6}, true, {saison: saison - 1}, "Spielplan");
				queue.addSite("zar", null, true, {saison: saison - 1, zat : OSext.ZATS_PRO_SAISON}, "Bericht");

				data.vorsaison = true;
				return queue;
			}

			data.setAktuelleSaison(saison);
			data.setAktuellenSpieltag(data.saisonplan[data.termin.zat]);

		// Vorherige Saison (wenn Saisonpause)
		} else {

			if (data.isSaisonplanValid()) {
				
				// letzten Spieltag der Vorsaison extrahieren 
				row = table1.rows[table1.rows.length - 1];
				spieltag = new OSext.Spieltag(saison, OSext.ZATS_PRO_SAISON);
				
				this.extractSpieltag(data.team, row, spieltag);
				
				data.saisonplan[0] = spieltag;

				data.setAktuelleSaison(saison + 1);
				data.setAktuellenSpieltag(spieltag);

			} else {
				
				// Kompletten Saisonplan der Vorsaison lesen
				this.extractSaisonplan(table1, data, saison);

				data.setAktuelleSaison(saison);
				data.setAktuellenSpieltag(data.saisonplan[OSext.ZATS_PRO_SAISON]);
			}
		}

		// Spiel- und eventuell Abrechnungsbericht des letzten Spieltags laden
		queue = new OSext.RequestQueue(this.wrappeddoc, this, null, OSext);
		report = data.spieltag.getReport();
		if (report) {
			queue.addSite(report, null, false, null, "Spielbericht");
		}
		
		if (!data.vorsaison) {
			queue.addSite("zar", null, true, null, "Bericht");
		} else {
			data.vorsaison = false;
		}
		
		return queue;
	},

	/**
	 * Extrahiert den Saisonplan aus der Tabelle.
	 * 
	 * @param table
	 * @param data
	 * @param saison
	 */
	extractSaisonplan : function (table, data, saison) {

		var r, row, spieltag;
		
		for (r = 1; r < table.rows.length; r++) {
			row = table.rows[r];
			spieltag = new OSext.Spieltag(saison, r);

			this.extractSpieltag(data.team, row, spieltag);
			
			data.saisonplan[r] = spieltag;

			// Übernahme der Parameter für die Prognose der Folgesaison
			data.saisonplan[r + OSext.ZATS_PRO_SAISON].spielart = spieltag.spielart;
			data.saisonplan[r + OSext.ZATS_PRO_SAISON].ort = spieltag.ort;
			data.saisonplan[r + OSext.ZATS_PRO_SAISON].gegner = spieltag.gegner;
			if (spieltag.fssanteil) {
				data.saisonplan[r + OSext.ZATS_PRO_SAISON].fssanteil = 50;
			}
		}
	},
	
	/**
	 * Extrahiert einen Spieltag (Art, Ort, etc.)
	 */
	extractSpieltag : function (team, row, spieltag) {

		var spiel = row.cells[this.columns.indexOf("Spielart")].textContent,
			info = row.cells[this.columns.length].textContent;
		
		if (!spieltag.team) {
			spieltag.team = new OSext.Team(team.id, team.name);
		}
		
		spieltag.spielart = spiel.split(" : ")[0];
		if (spieltag.spielart != OSext.SPIELART.RESERVIERT && 
				spieltag.spielart != OSext.SPIELART.SPIELFREI &&
				spieltag.spielart != OSext.SPIELART.BLIND) {
			spieltag.ort = spiel.split(" : ")[1].substr(0, 4);
			spieltag.gegner = new OSext.Team();
			spieltag.gegner.name = row.cells[this.columns.indexOf("Gegner")].textContent;
			spieltag.gegner.id = OSext.getLinkId(row.cells[this.columns.indexOf("Gegner")].firstChild.href);
		}
		if (spieltag.spielart == OSext.SPIELART.FSS) {
			if (info && info.indexOf("/") != -1) {
				spieltag.fssanteil = +info.split("/")[0];
			} else {			
				spieltag.fssanteil = 50;
			}
		}
		if (row.cells[this.columns.indexOf("Ergebnis")].textContent.indexOf(":") != -1) {
			spieltag.gespielt = true;
		}
	},
	
	/**
	 * Erweitert den Saisonplan.
	 */
	extend : function (data, params) {
	
		var saison = +this.wrappeddoc.doc.getElementsByName("saison")[0].value,
			table = this.wrappeddoc.doc.getElementsByTagName("table")[2],
			tableClone = table.cloneNode(true),
			scrolldiv = this.wrappeddoc.doc.createElement("div"),
			scrollelement, tableoffset,
			r, row, s, spieltag, baseCell, vks,
			saisonplan, rundentext,
			cellSpielart, cellInfo, cellVorberichte, cellKommentare, cellSaldo;
		
		// Saldoprognose nur fuer aktuelle Saison
		if (saison == data.saisonplan[1].termin.saison) {

			this.toolbar.show(data);

			scrolldiv.style.overflow = "auto";
			scrolldiv.style.width = "100%";
			scrolldiv.style.height = (this.wrappeddoc.doc.defaultView.innerHeight - table.offsetTop - table.parentNode.offsetTop - 5) + "px";
			scrolldiv.appendChild(tableClone);
			
			saisonplan = data.ansicht.saison.getSaisonplan();

			for (r = 0; r < tableClone.rows.length; r++) {
				
				row = tableClone.rows[r];
				baseCell = row.cells[this.columns.indexOf("ZAT")];

				if (r === 0) {

					cellInfo = new OSext.WrappedElement(baseCell, true);
					cellInfo.setText(" ");
					row.appendChild(cellInfo.element);

					cellVorberichte = new OSext.WrappedElement(baseCell, true);
					cellVorberichte.setHtml("&nbsp;&nbsp;&nbsp;&nbsp;Vo.");
					row.appendChild(cellVorberichte.element);

					cellKommentare = new OSext.WrappedElement(baseCell, true);
					cellKommentare.setText("Ko.");
					row.appendChild(cellKommentare.element);

				} else {
					
					if (r == (data.saisonpause ? 1 : data.termin.zat)) {
						scrollelement = row.cells[this.columns.indexOf("ZAT")];
					}
					
					if (row.cells[5].textContent.match(/F.+Tu.*nier:.+/)) {
						cellInfo = new OSext.WrappedElement(row.cells[5]);
						cellInfo.setHtml("<abbr title=\"FSS-Turnier\">" + 
								row.cells[5].textContent
									.replace(/F.+Tu.*nier: /, "")
									.replace(/\s\(.+%.+\)/, "") + "</abbr>");
					}
					
					cellVorberichte = new OSext.WrappedElement(row.cells[6]);
					cellVorberichte.element.align = "right";
					
					cellKommentare = new OSext.WrappedElement(cellVorberichte.element, true);

					if (cellVorberichte.element.firstChild) {
						vks = cellVorberichte.element.firstChild.textContent.split(" ");
	
						cellVorberichte.element.firstChild.textContent = vks[0] + "x";
						if (vks.length > 2) {
							cellKommentare.element.firstChild.textContent = vks[3] + "x";
						} else {
							cellKommentare.element.removeChild(cellKommentare.element.firstChild);
						}
					}
					row.appendChild(cellKommentare.element);
					
					if (r % OSext.ZATS_PRO_MONAT === 0) {
						row.className = OSext.STYLE.MONAT;
					}
				}

				// Für jede Saison im Saisonplan eine Saldospalte
				for (s = saisonplan[saisonplan.length - 1].termin.saison; s >= data.saisonplan[1].termin.saison; s--) {
					
					cellSaldo = new OSext.WrappedElement(baseCell, true);

					if (r === 0) {

						cellSaldo.setText(" Saldo Saison " + s);

					} else {

						spieltag = saisonplan[r + ((s - data.saisonplan[1].termin.saison) * OSext.ZATS_PRO_SAISON)];

						// Runde bei Liga, Pokal, etc.
						if (spieltag.runde) {
							cellSpielart = new OSext.WrappedElement(row.cells[this.columns.indexOf("Spielart")]);
							rundentext = cellSpielart.element.textContent.replace(" : ", " (" + spieltag.runde + ") : ");
							cellSpielart.setText(rundentext);
						}

						cellSaldo.setHtml(spieltag.saldo ? OSext.fmtTausend(spieltag.saldo) : "");
						// Jugendbetrag initialisert bzw. prognostiziert?
						if (spieltag.jugend) {
							cellSaldo.setTooltip(spieltag.getSaldoStatus());
						}
						if ((spieltag.termin.getZats() > data.termin.getZats()) || data.saisonpause) {
							cellSaldo.setAttribute(OSext.STYLE.TIME, OSext.STYLE.FUTURE);
						} else {
							this.addLinkToZatReport(cellSaldo, spieltag);
						}
					}

					row.insertBefore(cellSaldo.element, row.cells[6]);
				}
			}
			
			table.parentNode.replaceChild(scrolldiv, table);
			
			if (scrollelement) {
				scrolldiv.scrollTop = scrollelement.offsetTop;
			}
		}
	},
	
	/**
	 * Aktualisiert die den Saldo anhand der Toolbar-Auswahl
	 */
	update : function (data, parameters) {

		var saison = +this.wrappeddoc.doc.getElementsByName("saison")[0].value,
			table = this.wrappeddoc.doc.getElementsByTagName("table")[2],
			tableClone = table.cloneNode(true),
			r, row, s, spieltag, saisonplan,
			cellSaldo;

		// Saldoprognose nur fuer aktuelle Saison
		if (saison == data.saisonplan[1].termin.saison) {

			this.toolbar.handleSelections(data);
			
			saisonplan = data.ansicht.saison.getSaisonplan();
			
			for (r = 1; r < tableClone.rows.length; r++) {
				
				row = tableClone.rows[r];

				// Für jede Saison im Saisonplan eine Saldospalte
				for (s = data.saisonplan[1].termin.saison; s <= saisonplan[saisonplan.length - 1].termin.saison; s++) {

					spieltag = saisonplan[r + ((s - data.saisonplan[1].termin.saison) * OSext.ZATS_PRO_SAISON)];
					
					cellSaldo = new OSext.WrappedElement(row.cells[6 + (s - data.saisonplan[1].termin.saison)]);
					cellSaldo.setHtml(spieltag.saldo ? OSext.fmtTausend(spieltag.saldo) : "");
					
					// Jugendbetrag initialisert bzw. prognostiziert?
					if (spieltag.jugend) {
						cellSaldo.setTooltip(spieltag.getSaldoStatus());
					}
					if ((spieltag.termin.getZats() > data.termin.getZats()) || data.saisonpause) {
						cellSaldo.setAttribute(OSext.STYLE.TIME, OSext.STYLE.FUTURE);
					}
				}
			}
			table.parentNode.replaceChild(tableClone, table);
		}
	},
	
	addLinkToZatReport : function (cellElement, spieltag) {

		var location = this.wrappeddoc.doc.location,
			uri = location.protocol + "//" + location.host + "/zar.php",
			navigation = this.wrappeddoc.navigation,
			postDataFactory = OSext || { getPostData : function () {} };
		
		if (navigation) {
			
			cellElement.element.style.cursor = "pointer";
			cellElement.element.addEventListener("click", function () {
				
				OSext.timeout = null;  
				document.getElementById("osext-tooltip").hidePopup();
				
				OSext.Log.debug(["Lade (addLinkToZatReport):", uri]);
				
				navigation.loadURI(uri,
						Components.interfaces.nsIWebNavigation, null, 
						postDataFactory.getPostData("zat=" + spieltag.termin.zat + "&saison=" + spieltag.termin.saison), null);
			}, false);
		}
		
	}
};
