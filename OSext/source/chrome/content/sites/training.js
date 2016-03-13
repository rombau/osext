/**
 * Klasse für die Trainingsseite
 * @constructor
 */
OSext.Sites.Training = function (wrappeddoc) {
	
	this.classname = "OSext.Sites.Training";
	
	this.columns = ["", "Name", "Alter", "Opti", "Trainer", "trainierter Skill", "Skill", "Chance"];
	
	this.wrappeddoc = wrappeddoc;
	
	this.alwaysExtract = true;
};

OSext.Sites.Training.prototype = {

	/**
	 * Prüft die Seite auf Änderungen und Anmeldungsinformationen.
	 * @throws 
	 * {@link OSext.SiteChangeError} oder {@link OSext.AuthenticationError}
	 */
	check : function (params) {

		var divs = this.wrappeddoc.doc.getElementsByTagName("div"),
			tables = this.wrappeddoc.doc.getElementsByTagName("table"), c;

		if (divs && divs.length > 0) {
			if (divs[0].lastChild.textContent.search("Diese Seite ist ohne Team nicht verf.+gbar!") != -1) {
				throw new OSext.AuthenticationError("Demoteam");
			} else if (divs[0].lastChild.textContent.search("Diese Funktion ist erst ZAT 1 wieder verf.+gbar") != -1) {
				return false;
			}
		}

		if (!tables || tables.length < 3 ||
			!tables[2] || !tables[2].rows || tables[2].rows.length < 2 || 
				tables[2].rows[0].cells.length != this.columns.length) {
			throw new OSext.SiteChangeError("Training -> Tabelle wurde geändert!");
		} else {
			for (c = 0; c < this.columns.length - 1; c++) {
				if (tables[2].rows[0].cells[c].textContent != this.columns[c]) {
					throw new OSext.SiteChangeError("Training -> Tabellenspalten wurden geändert!");
				}
			}
		}
		return true;
	},

	/**
	 * Extrahiert die Trainingswerte
	 */
	extract : function (data, params) {
		
		var table = this.wrappeddoc.doc.getElementsByTagName("table")[2],
			r, row, spieler,
			verletzt, traineridx, trainingidx;
		
		for (r = 1; r < table.rows.length; r++) {

			row = table.rows[r];

			spieler = OSext.getListElement(data.team.spieler, "id",
					OSext.getLinkId(row.cells[this.columns.indexOf("Name")].firstChild.href));

			if (spieler) {
				
				verletzt = row.cells[this.columns.indexOf("")].textContent;
				traineridx = +row.cells[this.columns.indexOf("Trainer")].firstChild.selectedIndex;
				trainingidx = +row.cells[this.columns.indexOf("trainierter Skill")].firstChild.selectedIndex;
				
				if (verletzt === "" && traineridx > 0 && trainingidx > 0) {
				
					spieler.training.plan.trainer = data.team.trainer[traineridx];
					spieler.training.plan.trainernr = traineridx;
					spieler.training.plan.skillidx = this.getSkillIndex(trainingidx - 1);
					
					if (row.cells[this.columns.indexOf("Chance")].textContent.search(" %") != -1) {
						spieler.training.plan.wahrscheinlichkeit = 
							parseFloat(row.cells[this.columns.indexOf("Chance")].textContent);
					} else {
						spieler.training.plan.wahrscheinlichkeit = 0;
					}
					
				} 
				else {
					// damit ein zuvor eingestellter (und gespeicherter) Trainer wieder entfernt wird
					spieler.training.plan.trainer = null;
				}				
			}
		}
		
		data.clearAllCaches();
	},
	
	/**
	 * Erweiteert die Trainingsseite.
	 */
	extend : function (data, params) {
		
		var table = this.wrappeddoc.doc.getElementsByTagName("table")[2],
			tableClone = table.cloneNode(true),
			r, row, spieler, newSpieler, cellMwZuwachs,
			trainerselect, skillselect;
		
		tableClone.data = data;
		tableClone.wrappeddoc = this;
		
		for (r = 0; r < tableClone.rows.length; r++) {
	
			row = tableClone.rows[r];

			cellMwZuwachs = new OSext.WrappedElement(
					row.cells[this.columns.indexOf("Alter")], true);

			if (r === 0) {

				cellMwZuwachs.setHtml("&nbsp;&nbsp;MW-Zuwachs");
				
			} else {
	
				spieler = OSext.getListElement(data.team.spieler, "id",
						OSext.getLinkId(row.cells[this.columns.indexOf("Name")].firstChild.href));

				row.spieler = spieler;

				trainerselect = row.cells[this.columns.indexOf("Trainer")].firstChild;
				skillselect = row.cells[this.columns.indexOf("trainierter Skill")].firstChild;

				trainerselect.addEventListener("change", this.handleSelect, false);
				skillselect.addEventListener("change", this.handleSelect, false);

		
				if (spieler && spieler.training.plan.trainer) {
					
					newSpieler = new OSext.Spieler();
					newSpieler.pos = spieler.pos;
					newSpieler.alter = spieler.alter; 
					newSpieler.skills = JSON.parse(JSON.stringify(spieler.skills));

					newSpieler.skills[spieler.training.plan.skillidx]++;
					
					cellMwZuwachs.setText(OSext.fmtTausend(
							newSpieler.getMarktwert(null, data.termin.zat) - spieler.getMarktwert(null, data.termin.zat)));
					
				}
				else {
					cellMwZuwachs.setText("0");
				}
			}
			row.appendChild(cellMwZuwachs.element);
		}
		table.parentNode.replaceChild(tableClone, table);		
	},
	
	/**
	 * Aktualisierung der Trainingschance und des mögl. MW-Zuwaches ohne Reload
	 */
	handleSelect : function (event) {
		
		var select = event.originalTarget, cell = select.parentElement,
			row = cell.parentElement, table = row.parentElement.parentElement,
			spieler = row.spieler, data = table.data, wrappeddoc = table.wrappeddoc,
			newSpieler, wahrscheinlichkeit,
			verletzt = row.cells[0].textContent,
			traineridx = +row.cells[4].firstChild.selectedIndex,
			trainingidx = +row.cells[5].firstChild.selectedIndex,
			skillidx;
		
		if (verletzt === "" && traineridx > 0 && trainingidx > 0) {

			skillidx = wrappeddoc.getSkillIndex(trainingidx - 1);
			
			wahrscheinlichkeit = data.database.getWahrscheinlichkeit(data.team.trainer[traineridx].skill,
					spieler.alter, spieler.skills[skillidx]);

			row.cells[6].textContent = spieler.skills[skillidx];

			if (wahrscheinlichkeit) {
				row.cells[7].textContent = wahrscheinlichkeit.toFixed(2) + " %";
			} else {
				row.cells[7].textContent = "? %";
			}


			newSpieler = new OSext.Spieler();
			newSpieler.pos = spieler.pos;
			newSpieler.alter = spieler.alter; 
			newSpieler.skills = JSON.parse(JSON.stringify(spieler.skills));

			newSpieler.skills[skillidx]++;
			
			row.cells[row.cells.length - 1].textContent =
				OSext.fmtTausend(
					newSpieler.getMarktwert(null, data.termin.zat) - spieler.getMarktwert(null, data.termin.zat));

			row.cells[6].time = "future";
			row.cells[7].time = "future";
			row.cells[row.cells.length - 1].time = "future";
		}
	},
	
	/**
	 * Speichert die Trainingswerte, sofern die Initialisierung bereits abgeschlossen ist.
	 * @param {OSext.Data} data
	 */
	save : function (data, params) {
		
		OSext.Log.info("Trainingswerte speichern ...");
		
		try {

			data.database.sql.beginTransaction();
			
			data.database.saveTraining(data.team.spieler, data.termin);
			
			data.database.sql.commitTransaction();
			
		} catch (e) {
			
			data.database.sql.rollbackTransaction();
			throw e;
		}

	},
	
	/**
	 * Liefert den Skill-Index auf Basis der Trainingsauswahl.
	 * Nur trainierbare Skills stehen zur Auswahl.
	 * 
	 * @param selectedIndex
	 * @returns Skillindex
	 */
	getSkillIndex : function (selectedIndex) {
		
		if (selectedIndex >= OSext.SKILL.FUQ && selectedIndex <= OSext.SKILL.PAS) {
			return (selectedIndex + 2);
		} else if (selectedIndex == OSext.SKILL.AUS) {
			return OSext.SKILL.ZUV;
		} else {
			return selectedIndex;
		}
	}

};
