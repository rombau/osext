/**
 * Klasse für die Mannschaft-Statistikseite
 * @constructor
 */
OSext.Sites.ShowteamStats = function (wrappeddoc) {
	
	this.classname = "OSext.Sites.ShowteamStats";
	
	this.columns1 = ["", "Spiele", "Tore", "Vorlagen", "Score", "Gelb", "Rot"];
	this.columns2 = ["Name", "Land", "U", "LI", "LP", "IP", "FS", "LI", "LP", "IP", "FS", "LI", "LP", "IP", "FS", "LI", "LP", "IP", "FS", "LI", "LP", "IP", "FS", "LI", "LP", "IP", "FS"];
		
	this.wrappeddoc = wrappeddoc;
};

OSext.Sites.ShowteamStats.prototype = {

	/**
	 * Prüft die Seite auf Änderungen und Anmeldungsinformationen.
	 * @throws 
	 * {@link OSext.SiteChangeError} oder {@link OSext.AuthenticationError}
	 */
	check : function (params) {

		var bolds = this.wrappeddoc.doc.getElementsByTagName("b"),
			tables = this.wrappeddoc.doc.getElementsByTagName("table"), table,
			c;
		
		if (params && params.c) {
			return false;
		}

		if (!bolds || bolds.length === 0 || 
				bolds[0].firstChild.textContent.search(/.+\s-\s/) == -1 || 
				bolds[0].lastElementChild.tagName.toUpperCase() != "A") {
			throw new OSext.SiteChangeError("Mannschaft/Statistik -> Überschrift wurde geändert!");
		}
		
		if (!tables || tables.length < 3) {
			throw new OSext.SiteChangeError("Mannschaft/Statistik -> Tabelle wurde nicht gefunden!");
		} else {
			table = tables[2];
		}

		if (!table || !table.rows || table.rows.length < 3 || 
				table.rows[0].cells.length != this.columns1.length ||
				table.rows[1].cells.length != this.columns2.length) {
			throw new OSext.SiteChangeError("Mannschaft/Statistik -> Tabelle wurde geändert!");
		} else {
			for (c = 0; c < this.columns1.length - 1; c++) {
				if (table.rows[0].cells[c].textContent != this.columns1[c]) {
					throw new OSext.SiteChangeError("Mannschaft/Statistik -> Tabellenspalten wurden geändert!");
				}
			}
			for (c = 0; c < this.columns2.length - 1; c++) {
				if (table.rows[1].cells[c].textContent != this.columns2[c]) {
					throw new OSext.SiteChangeError("Mannschaft/Statistik -> Tabellenspalten wurden geändert!");
				}
			}
		}

		if (bolds[0].firstChild.textContent.search(/DemoTeam\s-\s/) != -1) {
			throw new OSext.AuthenticationError("Demoteam.");
		}
		return true;
	},
	
	/**
	 * Erweitert die Statistikseite.
	 */
	extend : function (data, params) {

		var table = this.wrappeddoc.doc.getElementsByTagName("table")[2],
			tableClone = table.cloneNode(true),
			r, row, spieler, baseCell, c,
			spielerliste,
			cellSkillschnitt, cellOpti;

		spielerliste = data.team.spieler; // immer die aktuellen Spieler; keine Toolbar

		for (r = 0; r < tableClone.rows.length; r++) {

			row = tableClone.rows[r];
			baseCell = row.cells[this.columns2.indexOf("LP")];

			cellSkillschnitt = new OSext.WrappedElement(baseCell, true);
			cellOpti = new OSext.WrappedElement(baseCell, true);

			if (r === 0 || r == (tableClone.rows.length - 1)) {
				// Zeile wird weier unten gelöscht
			}
			else if (r === 1 || r == (tableClone.rows.length - 2)) {

				row.cells[this.columns2.indexOf("Land")].colSpan = 1;
				
				cellSkillschnitt.setHtml("&nbsp;&nbsp;Skillschn.");
				cellOpti.setHtml("&nbsp;&nbsp;Opt.Skill");
				if (r === 1) {
					cellSkillschnitt.setHtml(this.getSortLink(cellSkillschnitt.element.innerHTML));
					cellOpti.setHtml(this.getSortLink(cellOpti.element.innerHTML));
				}
				
				for (c = 0; c < this.columns2.length; c++) {
					if (c > 2) {
						row.cells[c].align = "center";
					}
					if (r === 1) {
						row.cells[c].innerHTML = this.getSortLink(row.cells[c].textContent);  
					}
				}

				this.makeTitleDivRelativToCell(row.cells[3]);  // Spiele
				this.makeTitleDivRelativToCell(row.cells[7]);  // Tore
				this.makeTitleDivRelativToCell(row.cells[11]); // Vorlagen
				this.makeTitleDivRelativToCell(row.cells[15]); // Score
				this.makeTitleDivRelativToCell(row.cells[19]); // Gelb
				this.makeTitleDivRelativToCell(row.cells[23]); // Rot

				if (r == (tableClone.rows.length - 2)) {
					row.className = "sortbottom";
				}
				
			} else {
				
				cellOpti.setAttribute(OSext.STYLE.PS, "true");

				row.cells[this.columns2.indexOf("Land")].parentNode
				.removeChild(row.cells[this.columns2.indexOf("Land")]);
				
				row.cells[this.columns2.indexOf("Land")].innerHTML = 
					"<img src=\"images/flaggen/" + row.cells[this.columns2.indexOf("Land")].textContent + ".gif\"\/> " +
					row.cells[this.columns2.indexOf("Land")].innerHTML;

				spieler = OSext.getListElement(spielerliste, "id",
						OSext.getLinkId(row.cells[this.columns2.indexOf("Name")].firstChild.href));

				if (spieler && spieler.id) {
					
					cellSkillschnitt.setText(spieler.skillschnitt.toFixed(2));
					cellOpti.setText(spieler.opti.toFixed(2));
				}
			}

			row.appendChild(cellSkillschnitt.element);
			row.appendChild(cellOpti.element);

			// Styleinfo hinzufügen
			if (r > 0 && r < (tableClone.rows.length - 1)) {
				for (c = 3; c < this.columns2.length; c++) {
					tableClone.rows[r].cells[c].setAttribute(OSext.STYLE.ART, 
							this.columns2[c]);
					tableClone.rows[r].cells[c].setAttribute(OSext.STYLE.STAT, 
							this.columns1[Math.floor((c - 3) / 4) + 1]);
				}
			}
		}
	
		tableClone.rows[0].parentNode
			.removeChild(tableClone.rows[0]);
		tableClone.rows[tableClone.rows.length - 1].parentNode
			.removeChild(tableClone.rows[tableClone.rows.length - 1]);
		
		tableClone.id = "team";
		tableClone.style.marginTop = "25px";
		
		table.parentNode.replaceChild(tableClone, table);		
	},
	
	getSortLink : function (text) {
		return "<a onclick=\"ts_resortTable(this);return false;\" class=\"sortheader\" href=\"#\">" + 
			text + "<span span=\"\" <=\"\" class=\"sortarrow\"></span></a>";
	},
	
	makeTitleDivRelativToCell : function (cell) {

		var title = this.columns1[((cell.cellIndex - 3) / 4) + 1],
			offset = cell.parentNode.rowIndex == 1 ? -21 : 21;
		
		cell.innerHTML = "<div style=\"position:relative\">" + 
			"<div style=\"position:absolute; " + 
			"left:0px; top:" + offset + "px; width:90px; height:21px\">" +
			title + "</div></div>" + cell.innerHTML;
	}
	
};
