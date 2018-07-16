/**
 * Klasse für die Jugend-Skillseite
 * @constructor
 */
OSext.Sites.JugendSkills = function (wrappeddoc) {
	
	this.classname = "OSext.Sites.JugendSkills";

	this.columns = ["Land", "U", "Alter", "SCH", "BAK", "KOB", "ZWK", "DEC", "GES", "FUQ", "ERF", "AGG", "PAS", "AUS", "UEB", "WID", "SEL", "DIS", "ZUV", "EIN"];
	this.newcols = ["Alter", "Pos", "Land", "", "", "U", "SCH", "BAK", "KOB", "ZWK", "DEC", "GES", "FUQ", "ERF", "AGG", "PAS", "AUS", "UEB", "WID", "SEL", "DIS", "ZUV", "EIN", "Skillschn.", "Opt.Skill"];
	
	this.wrappeddoc = wrappeddoc;
	
	this.toolbar = new OSext.JugendToolbar(wrappeddoc);
};

OSext.Sites.JugendSkills.prototype = {

	/**
	 * Prüft die Seite auf Änderungen und Anmeldungsinformationen.
	 * @throws 
	 * {@link OSext.SiteChangeError} oder {@link OSext.AuthenticationError}
	 */
	check : function (params) {

		var divs = this.wrappeddoc.doc.getElementsByTagName("div"),
			tables = this.wrappeddoc.doc.getElementsByTagName("table"), c;
	
		if (divs && divs.length > 0 && divs[0].lastChild.textContent.search("Diese Seite ist ohne Team nicht verf.+gbar!") != -1) {
			throw new OSext.AuthenticationError("Demoteam");
		}
				
		if (!tables[1] || !tables[1].rows || tables[1].rows.length < 2 || 
				tables[1].rows[0].cells.length != this.columns.length) {
			throw new OSext.SiteChangeError("Jugend/Einzelskills -> Tabelle wurde geändert!");
		} else {
			for (c = 0; c < this.columns.length - 1; c++) {
				if (tables[1].rows[0].cells[c].textContent != this.columns[c]) {
					throw new OSext.SiteChangeError("Jugend/Einzelskills -> Tabellenspalten wurden geändert!");
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
			r, row, i = 0, spieler, s;
		
		for (r = 1; r < table.rows.length; r++) {
	
			row = table.rows[r];

			if (row.textContent.indexOf("Jahrgang") == -1) {
				
				spieler = data.team.jugend[i];
		
				if (!spieler) {
					spieler = new OSext.Jugendspieler();
				}
	
				for (s in OSext.SKILL) {
					if (OSext.SKILL.hasOwnProperty(s)) {
						spieler.skills[OSext.SKILL[s]] = +row.cells[this.columns.indexOf(s) + 2].textContent;
					}
				}
				
				data.team.jugend[i] = spieler;
				
				i++;
			}
		}

	},

	/**
	 * Erweitert die allgemeinen Jugendspielerdaten.
	 */
	extend : function (data, params) {

		var table = this.wrappeddoc.doc.getElementsByTagName("table")[1],
			tableClone = table.cloneNode(true),
			r, row, c, i = 0, spieler, baseCell,
			jugendliste,
			alter = 0, s,
			cellAlter, cellPos, cellSkillschnitt, cellOpti;
		
		this.toolbar.show(data);
		
		jugendliste = data.team.jugend;
		
		for (r = 0; r < table.rows.length; r++) {

			row = tableClone.rows[r];
			
			if (row.textContent.indexOf("Jahrgang") == -1) {
				
				baseCell = row.cells[this.columns.indexOf("Alter") + (r === 0 ? 0 : 2)];
				
				cellAlter = new OSext.WrappedElement(baseCell, true);
				cellPos = new OSext.WrappedElement(baseCell, true);
				cellSkillschnitt = new OSext.WrappedElement(baseCell, true);
				cellOpti = new OSext.WrappedElement(baseCell, true);
	
				if (r === 0) {
	
					cellPos.setText("Pos");
					cellSkillschnitt.setHtml("&nbsp;Skillschn.");
					cellOpti.setHtml("&nbsp;Opt.Skill");
					
					row.cells[this.columns.indexOf("SCH")].innerHTML = "&nbsp;&nbsp;SCH";
				
				} else {
	
					spieler = jugendliste[i++];
	
					// Formatierung anhand Position
					for (c = 0; c < row.cells.length; c++) {
						if (!row.cells[c].innerHTML || row.cells[c].innerHTML.length === 0) {
							row.cells[c].innerHTML = ".";						
							row.cells[c].className = "BAK";
						}
						if (!row.cells[c].className || row.cells[c].className.length === 0) {
							row.cells[c].className = spieler.getPos();
						}
					}
	
					// Formatierung der Primärskills
					for (s in OSext.SKILL) {
						if (OSext.SKILL.hasOwnProperty(s)) {
							if (OSext.isPrimaerSkill(spieler.getPos(), OSext.SKILL[s])) {
								row.cells[this.columns.indexOf(s) + 2].setAttribute(OSext.STYLE.PS, "true");
							} else {
								row.cells[this.columns.indexOf(s) + 2].setAttribute(OSext.STYLE.PS, "false");
							}
						}
					}
	
					cellPos.setText(spieler.getPos());
					cellSkillschnitt.setText(spieler.getSkillschnitt() ? spieler.getSkillschnitt().toFixed(2) : "0.00");
	
					cellOpti.setText(spieler.getOpti() ? spieler.getOpti().toFixed(2) : "0.00");
					cellOpti.setAttribute(OSext.STYLE.PS, "true");
				}
	
				row.insertBefore(cellAlter.element, row.cells[this.columns.indexOf("Land")]);
				row.insertBefore(cellPos.element, row.cells[this.columns.indexOf("Land") + 1]);
				
				row.appendChild(cellSkillschnitt.element);
				row.appendChild(cellOpti.element);
				
				row.removeChild(baseCell); // alte Alter-Zelle	
				
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
				
				for (c = 0; c < row.cells.length; c++) {
					row.cells[c].style.opacity = 1;
				}
			} else {
					
				row.cells[0].removeChild(row.cells[0].lastChild);
				row.cells[0].removeChild(row.cells[0].lastChild);
				row.cells[0].style.fontSize = "smaller";
				row.cells[0].colSpan = row.cells[0].colSpan + 3;
				row.className = OSext.STYLE.JUGEND;
			}
		}
		table.parentNode.replaceChild(tableClone, table);
	},
	
	/**
	 * Aktualisiert die Daten der Jugendspielerdaten mit jenen der Auswahl
	 */
	update : function (data, parameters) {

		var table = this.wrappeddoc.doc.getElementsByTagName("table")[1],
			tableClone = table.cloneNode(true),
			r, row, c, i = 0, spieler, baseCell,
			jugendliste,
			alter = 0, s,
			cellAlter, cellPos, cellSkillschnitt, cellOpti;
	
		this.toolbar.handleSelections(data);
		
		jugendliste = data.ansicht.jugend.getSpieler();
		
		for (r = 1; r < tableClone.rows.length; r++) {
			
			row = tableClone.rows[r];
			
			if (row.textContent.indexOf("Jahrgang") == -1) {
				
				spieler = jugendliste[i++];
		
				for (c = 0; c < row.cells.length; c++) {
					if (c != this.newcols.indexOf("U")) {
						if (row.cells[c].className != OSext.POS.TOR && row.cells[c].className != "BAK") {
							row.cells[c].className = spieler.getPos();
						}
					}
				}
		
				row.cells[this.newcols.indexOf("Alter")].innerHTML = spieler.alter;
				row.cells[this.newcols.indexOf("Pos")].innerHTML = spieler.getPos();				
				row.cells[this.newcols.indexOf("Skillschn.")].innerHTML = spieler.getSkillschnitt() ? spieler.getSkillschnitt().toFixed(2) : "0.00";				
				row.cells[this.newcols.indexOf("Opt.Skill")].innerHTML = spieler.getOpti() ? spieler.getOpti().toFixed(2) : "0.00";				
	
				for (s in OSext.SKILL) {
					if (OSext.SKILL.hasOwnProperty(s)) {
						row.cells[this.newcols.indexOf(s)].textContent = spieler.skills[OSext.SKILL[s]];
						row.cells[this.newcols.indexOf(s)].setAttribute(OSext.STYLE.UPDATED, data.ansicht.jugend.getStyle());
						if (OSext.isPrimaerSkill(spieler.pos, OSext.SKILL[s])) {
							row.cells[this.newcols.indexOf(s)].setAttribute(OSext.STYLE.PS, "true");
						} else {
							row.cells[this.newcols.indexOf(s)].setAttribute(OSext.STYLE.PS, "false");
						}
					}
				}
	
				row.cells[this.newcols.indexOf("Alter")].setAttribute(OSext.STYLE.UPDATED, data.ansicht.jugend.getStyle());
				row.cells[this.newcols.indexOf("Pos")].setAttribute(OSext.STYLE.UPDATED, data.ansicht.jugend.getStyle());
				row.cells[this.newcols.indexOf("Skillschn.")].setAttribute(OSext.STYLE.UPDATED, data.ansicht.jugend.getStyle());
				row.cells[this.newcols.indexOf("Opt.Skill")].setAttribute(OSext.STYLE.UPDATED, data.ansicht.jugend.getStyle());
				
			}
		}
		table.parentNode.replaceChild(tableClone, table);
	}
	
};
