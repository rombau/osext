/**
 * Klasse für die Ligatabelle
 * @constructor
 */
OSext.Sites.Lt = function (wrappeddoc) {
	
	this.classname = "OSext.Sites.Lt";
	
	this.columns = ["#", "", "Club", "Spiele", "Si.", "Un.", "Ni.", "Tore+", "Tore-", "Tore +/-", "Punkte"];

	this.wrappeddoc = wrappeddoc;
	
	this.toolbar = new OSext.LigaToolbar(wrappeddoc);
};

OSext.Sites.Lt.prototype = {
	
	/**
	 * Prüft die Seite auf Änderungen
	 * @throws {@link OSext.SiteChangeError}
	 */
	check : function () {

		var divs = this.wrappeddoc.doc.getElementsByTagName("div"),
			ligasel = this.wrappeddoc.doc.getElementsByName("ligaauswahl")[0],
			buttons = this.wrappeddoc.doc.getElementsByTagName("input"),
			table = this.wrappeddoc.doc.getElementById("kader1"),
			c;
	
		if (divs && divs.length > 0 && divs[0].lastChild.textContent.search("Diese Seite ist ohne Team nicht verf.+gbar!") != -1) {
			throw new OSext.AuthenticationError("Demoteam");
		}

		if (!ligasel) {
			throw new OSext.SiteChangeError("Ligatabelle -> Ligaauswahl wurde entfernt!");
		}

		if (!buttons || buttons.length < 1 || buttons[0].type != "submit") {
			throw new OSext.SiteChangeError("Ligatabelle -> Button wurde entfernt!");
		}

		if (!table || !table.rows || table.rows.length < 2) {
			throw new OSext.SiteChangeError("Ligatabelle -> Tabelle wurde entfernt!");
		}

		if (table.rows[0].cells.length != this.columns.length) {
			throw new OSext.SiteChangeError("Ligatabelle -> Tabelle wurde geändert!");
		} else {
			for (c = 0; c < this.columns.length - 1; c++) {
				if (table.rows[0].cells[c].textContent != this.columns[c]) {
					throw new OSext.SiteChangeError("Ligatabelle -> Tabellenspalten wurden geändert!");
				}
			}
		}
		return true;
	},

	/**
	 * Extrahiert Platzierung und Ligagröße.
	 */
	extract : function (data, params) {

		var ligasel = this.wrappeddoc.doc.getElementsByName("ligaauswahl")[0],
			table = this.wrappeddoc.doc.getElementById("kader1"),
			r, link;
			
		if (ligasel.value == "1") {
			data.liga = 1;
		} else if (ligasel.value == "2" || ligasel.value == "3") {
			data.liga = 2;
		} else {
			data.liga = 3;
		}

		data.ligagroesse = table.rows.length - 1;
		for (r = 1; r < table.rows.length; r++) {
			link = table.rows[r].cells[2].firstChild;
			if (link.textContent.indexOf(data.team.name) >= 0) { 
				data.team.id = OSext.getLinkId(link.href);
				data.team.platzierung = r;
				return;
			}
		}
	},
	
	extend : function (data, params) {

		var table = this.wrappeddoc.doc.getElementById("kader1"),
			r, link, id, queue = null;

		this.toolbar.show(data);
				
		if (data.ansicht.liga.extended) {
			queue = new OSext.RequestQueue(this.wrappeddoc, this, this.postProcessing, OSext, false);
	
			for (r = 1; r < table.rows.length; r++) {
				link = table.rows[r].cells[2].firstChild;
				id = OSext.getLinkId(link.href);
				if (id != data.team.id && data.getExternalTeam(id).spieler.length === 0) {
					queue.addSite("st", {s: 2, c: id}, true, null, link.textContent.split(" [")[0]);
				}
			}
		}

		if (queue && queue.sitequeue.length === 0) {
			this.postProcessing(this.wrappeddoc, data);
			return null;
		}
		return queue;
	},
	
	/**
	 * Aktualisiert die Ansichteinstelleungen der Ligatabelle anhand der Auswahl
	 */
	update : function (data, parameters) {

		var button = this.wrappeddoc.doc.getElementsByName("stataktion")[0];
		
		this.toolbar.handleSelections(data);
		
		button.click();
	},
	
	/**
	 * Callback-Handler, welcher nach dem Abarbeiten der 
	 * in diesem Objekt initialisierten {@link OSext.RequestQueue} aufgerufen wird.
	 */
	postProcessing : function (doc, data, notifier) {

		var table = this.wrappeddoc.doc.getElementById("kader1"),
			tableClone = table.cloneNode(true),
			row, r, link, id, team, topelf, 
			baseCell, cellFormation, cellSkillschnitt, cellOpti, cellP, cellN, cellU;
		
		for (r = 0; r < tableClone.rows.length; r++) {
			
			row = tableClone.rows[r];
			
			link = row.cells[2].firstChild;
			id = OSext.getLinkId(link.href);
			if (id != data.team.id) {
				team = data.getExternalTeam(id);
			} else {
				team = data.team;
			}		
			
			baseCell = row.cells[this.columns.indexOf("Spiele")];

			cellFormation = new OSext.WrappedElement(baseCell, true);
			cellSkillschnitt = new OSext.WrappedElement(baseCell, true);
			cellOpti = new OSext.WrappedElement(baseCell, true);
			cellP = new OSext.WrappedElement(baseCell, true);
			cellN = new OSext.WrappedElement(baseCell, true);
			cellU = new OSext.WrappedElement(baseCell, true);

			if (r === 0) {

				cellFormation.setHtml(this.getSortLink("&nbsp;&nbsp;&nbsp;Formation"));
				cellSkillschnitt.setHtml(this.getSortLink("&nbsp;&nbsp;Skillschn."));
				cellOpti.setHtml(this.getSortLink("&nbsp;&nbsp;Opt.Skill"));
				cellP.setHtml(this.getSortLink("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&Oslash;P"));
				cellN.setHtml(this.getSortLink("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&Oslash;N"));
				cellU.setHtml(this.getSortLink("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&Oslash;U"));
				
			} else {

				topelf = team.getTopElf(team.spieler);
				
				cellFormation.setText(team.getFormation(topelf));
				
				cellSkillschnitt.setText(team.getSkillschnitt(topelf).toFixed(2));
				cellOpti.setText(team.getOptischnitt(topelf).toFixed(2));

				cellP.setText(team.getPrimaerskillschnitt(topelf).toFixed(2));
				cellN.setText(team.getNebenskillschnitt(topelf).toFixed(2));
				cellU.setText(team.getUnveraenderlichenskillschnitt(topelf).toFixed(2));
			}

			row.appendChild(cellFormation.element);
			row.appendChild(cellSkillschnitt.element);
			row.appendChild(cellOpti.element);
			row.appendChild(cellP.element);			
			row.appendChild(cellN.element);			
			row.appendChild(cellU.element);			
		}
		
		table.parentNode.replaceChild(tableClone, table);		
	},
	
	getSortLink : function (text) {
		return "<a onclick=\"ts_resortTable(this);return false;\" class=\"sortheader\" href=\"#\">" + 
			text + "<span span=\"\" <=\"\" class=\"sortarrow\"></span></a>";
	}

};
