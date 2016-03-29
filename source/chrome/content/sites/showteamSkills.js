/**
 * Klasse für die Mannschaft-Skillseite
 * @constructor
 */
OSext.Sites.ShowteamSkills = function (wrappeddoc) {
	
	this.classname = "OSext.Sites.ShowteamSkills";
	
	this.columns = ["#", "Name", "Land", "U", "SCH", "BAK", "KOB", "ZWK", "DEC", "GES", "FUQ", "ERF", "AGG", "PAS", "AUS", "UEB", "WID", "SEL", "DIS", "ZUV", "EIN"];
	
	this.ids = { 
		team : "team"
	};
	
	this.wrappeddoc = wrappeddoc;
	
	this.toolbar = new OSext.TeamToolbar(wrappeddoc);
};

OSext.Sites.ShowteamSkills.prototype = {

	/**
	 * Prüft die Seite auf Änderungen und Anmeldungsinformationen.
	 * @throws 
	 * {@link OSext.SiteChangeError} oder {@link OSext.AuthenticationError}
	 */
	check : function (params) {

		var h1s = this.wrappeddoc.doc.getElementsByTagName("h1"),
			bolds = this.wrappeddoc.doc.getElementsByTagName("b"),
			table = this.wrappeddoc.doc.getElementById(this.ids.team),
			c;
		
		if (h1s && h1s.length > 0 &&
				h1s[0].textContent.search(/Dieses Team existiert nicht mehr!/) != -1) {
			return false;
		}
		
		if (!bolds || bolds.length === 0 || 
				bolds[0].firstChild.textContent.search(/.+\s-\s/) == -1 || 
				bolds[0].lastElementChild.tagName.toUpperCase() != "A") {
			throw new OSext.SiteChangeError("Mannschaft/Einzelskills -> Überschrift wurde geändert!");
		}
		
		if (!table || !table.rows || table.rows.length < 2 || 
				table.rows[0].cells.length != this.columns.length) {
			throw new OSext.SiteChangeError("Mannschaft/Einzelskills -> Tabelle wurde geändert!");
		} else {
			for (c = 0; c < this.columns.length - 1; c++) {
				if (table.rows[0].cells[c].textContent != this.columns[c]) {
					throw new OSext.SiteChangeError("Mannschaft/Einzelskills -> Tabellenspalten wurden geändert!");
				}
			}
		}

		if (bolds[0].firstChild.textContent.search(/DemoTeam\s-\s/) != -1) {
			throw new OSext.AuthenticationError("Demoteam.");
		}
		
		return true;
	},

	/**
	 * Extrahiert die Einzelskills der Spieler
	 */
	extract : function (data, params) {

		var table = this.wrappeddoc.doc.getElementById(this.ids.team),
			r, row, team, spieler, s;
		
		if (params && params.c) {
			team = data.getExternalTeam(params.c);
		} else {
			team = data.team;
		}

		for (r = 1; r < table.rows.length - 1; r++) {

			row = table.rows[r];
			spieler = team.spieler[r - 1];

			if (!spieler) {
				spieler = new OSext.Kaderspieler();
				spieler.id = OSext.getLinkId(row.cells[this.columns.indexOf("Name")].firstChild.href);
				spieler.name = row.cells[this.columns.indexOf("Name")].textContent;
				spieler.land = row.cells[this.columns.indexOf("Land")].textContent;
				spieler.pos = row.cells[this.columns.indexOf("#")].className;
			}
			
			for (s in OSext.SKILL) {
				if (OSext.SKILL.hasOwnProperty(s)) {
					spieler.skills[OSext.SKILL[s]] = +row.cells[this.columns.indexOf(s)].textContent;
				}
			}

			if (params && params.c && data.termin.zat) {
				spieler.getMarktwert(null, data.termin.zat);
			} else {
				spieler.getSonderskills();
			}
			
			team.spieler[r - 1] = spieler;
		}		
	},
	
	/**
	 * Erweitert die Einzelskills.
	 */
	extend : function (data, params) {

		var table = this.wrappeddoc.doc.getElementById(this.ids.team),
			tableClone = table.cloneNode(true),
			r, row, spieler, baseCell,
			spielerliste,
			cellAlter, cellSkillschnitt, cellOpti;

		if (params && params.c) {
			return false;
		}
		
		this.toolbar.show(data);

		spielerliste = data.ansicht.team.getSpieler();

		for (r = 0; r < tableClone.rows.length; r++) {

			row = tableClone.rows[r];
			baseCell = row.cells[this.columns.indexOf("#")];

			cellAlter = new OSext.WrappedElement(baseCell, true);
			cellSkillschnitt = new OSext.WrappedElement(baseCell, true);
			cellOpti = new OSext.WrappedElement(baseCell, true);

			if (r === 0 || r == (tableClone.rows.length - 1)) {

				cellAlter.setHtml("Alter");
				cellSkillschnitt.setHtml("&nbsp;&nbsp;Skillschn.");
				cellOpti.setHtml("&nbsp;&nbsp;Opt.Skill");
				
			} else {

				cellOpti.setAttribute(OSext.STYLE.PS, "true");

				row.cells[this.columns.indexOf("Land")].innerHTML = 
					"<img src=\"images/flaggen/" + row.cells[this.columns.indexOf("Land")].textContent + ".gif\"\/> " +
					row.cells[this.columns.indexOf("Land")].innerHTML;

				spieler = OSext.getListElement(spielerliste, "id",
						OSext.getLinkId(row.cells[this.columns.indexOf("Name")].firstChild.href));

				if (spieler && spieler.id) {
				
					if (spieler.skillschnitt) {
						cellAlter.setText(spieler.alter);
						cellSkillschnitt.setText(spieler.skillschnitt.toFixed(2));
						cellOpti.setText(spieler.opti.toFixed(2));
					}
				}
			}

			row.insertBefore(cellAlter.element, row.cells[this.columns.indexOf("Land")]);
			row.appendChild(cellSkillschnitt.element);
			row.appendChild(cellOpti.element);
		}
		
		table.parentNode.replaceChild(tableClone, table);		
	},	
	
	/**
	 * Aktualisiert die Daten der Spielerseite mit jenen der Auswahl
	 */
	update : function (data, parameters) {

		var table = this.wrappeddoc.doc.getElementById(this.ids.team),
			tableClone = table.cloneNode(true),
			r, row, spieler, c, s,
			spielerliste,
			cellAlter, cellSkillschnitt, cellOpti;

		if (parameters && parameters.c) {
			return false;
		}

		this.toolbar.handleSelections(data);

		spielerliste = data.ansicht.team.getSpieler();
		
		this.toolbar.setInfo(data.team.getTeamInfoHTML(spielerliste));

		for (r = 1; r < tableClone.rows.length - 1; r++) {
			row = tableClone.rows[r];

			spieler = OSext.getListElement(spielerliste, "id",
					OSext.getLinkId(row.cells[this.columns.indexOf("Name")].firstChild.href));

			cellAlter = new OSext.WrappedElement(row.cells[this.columns.indexOf("Land")]);
			cellSkillschnitt = new OSext.WrappedElement(row.cells[row.cells.length - 2]);
			cellOpti = new OSext.WrappedElement(row.cells[row.cells.length - 1]);

			if (spieler && spieler.status && spieler.status > OSext.STATUS.INAKTIV) {

				for (c = 0; c < row.cells.length; c++) {
					if (c != this.columns.indexOf("#")) {
						row.cells[c].className = (spieler.status == OSext.STATUS.VERLIEHEN ? OSext.POS.LEI : spieler.pos);
					}
				}
				
				for (s in OSext.SKILL) {
					if (OSext.SKILL.hasOwnProperty(s)) {
						row.cells[this.columns.indexOf(s) + 1].textContent = spieler.skills[OSext.SKILL[s]]; // +1 wegen Alterspalte
					}
				}

				cellAlter.setText(spieler.alter);
				cellSkillschnitt.setText(spieler.skillschnitt.toFixed(2));
				cellOpti.setText(spieler.opti.toFixed(2));

				cellAlter.setAttribute(OSext.STYLE.UPDATED, data.ansicht.team.getStyle());
				for (c = this.columns.indexOf("SCH") + 1; c <= row.cells.length - 1; c++) {
					row.cells[c].setAttribute(OSext.STYLE.UPDATED, data.ansicht.team.getStyle());
				}

			} else {

				for (c = this.columns.indexOf("SCH") + 1; c <= row.cells.length - 1; c++) {
					row.cells[c].textContent = "";
				}

				cellAlter.setText("");
			}
		}

		table.parentNode.replaceChild(tableClone, table);
	}	
};
