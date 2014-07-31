/**
 * Toolbar für die Mannschaftsseiten
 * @constructor
 */
OSext.TeamToolbar = function (wrappeddoc) {
	
	this.ids = { 
		team : "team", 
		auswahl : "osext-auswahl", 
		saison : "osext-saison", 
		zat : "osext-zat",
		teaminfo : "osext-teaminfo"
	};
	
	this.wrappeddoc = wrappeddoc;
};

OSext.TeamToolbar.prototype = {
	
	/**
	 * Erweitert die Spielerseiten um eine Toolbar 
	 */
	show : function (data) {

		var table = this.wrappeddoc.doc.getElementById(this.ids.team),
			toolbar = this.wrappeddoc.doc.createElement("div"),
			options = [], s, z;
		
		this.wrappeddoc.addLine(toolbar);
		
		this.wrappeddoc.addText(toolbar, "Historie / Prognose: ", true);
		
		options = [{text: "Aktuell", value: OSext.AUSWAHL.AKTUELL},
				   {text: "Saisonstart", value: OSext.AUSWAHL.START},
				   {text: "Saisonende", value: OSext.AUSWAHL.ENDE},
				   {text: "Start Saison " + (data.termin.saison + 1), value: OSext.AUSWAHL.START2},
				   {text: "Auswahl", value: OSext.AUSWAHL.FREI}];
		this.wrappeddoc.addSelect(toolbar, this.ids.auswahl, options, 
				data.ansicht.team.auswahl, false);

		this.wrappeddoc.addText(toolbar, " Saison: ", false);

		options = [];
		for (s = data.mintermin.saison || 1; s <= (data.termin.saison + 1); s++) {
			options[s - 1] = {text: s, value: s};
		}
		this.wrappeddoc.addSelect(toolbar, this.ids.saison, options, 
			data.ansicht.team.termin.saison, 
			(data.ansicht.team.auswahl == OSext.AUSWAHL.AKTUELL));
		
		this.wrappeddoc.addText(toolbar, " Zat: ", false);

		options = [];
		for (z = 1; z <= OSext.ZATS_PRO_SAISON; z++) {
			options[z - 1] = {text: z, value: z};
		}
		this.wrappeddoc.addSelect(toolbar, this.ids.zat, options, 
				data.ansicht.team.termin.zat, 
				(data.ansicht.team.auswahl != OSext.AUSWAHL.FREI && 
						data.ansicht.team.auswahl != OSext.AUSWAHL.START2));

		this.wrappeddoc.addText(toolbar, "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;", false);
		this.wrappeddoc.addText(toolbar, data.team.getTeamInfoHTML(), false, this.ids.teaminfo);
		
		this.wrappeddoc.addLine(toolbar);
		
		table.parentNode.insertBefore(toolbar, table);	
		
		this.handleSelections(data, true);
	},

	/**
	 * Steuert die Auswahlboxen und liefert ein {@code OSext.Team} auf Basis der aktuellen Auswahl
	 * @return Teamzustand zum Termin
	 */
	handleSelections : function (data, force) {
		
		var auswahl = this.wrappeddoc.doc.getElementById(this.ids.auswahl),
			saison = this.wrappeddoc.doc.getElementById(this.ids.saison),
			zat = this.wrappeddoc.doc.getElementById(this.ids.zat);
		
		if (data.ansicht.team.auswahl != (+auswahl.value) || 
				data.ansicht.team.termin.saison != (+saison.value) || 
				data.ansicht.team.termin.zat != (+zat.value)) {
			data.ansicht.team.cache = null;
		}
		
		if (force || data.ansicht.team.auswahl != (+auswahl.value)) {
			data.ansicht.team.auswahl = (+auswahl.value);
			if (data.ansicht.team.auswahl == OSext.AUSWAHL.AKTUELL) {
				data.ansicht.team.termin.saison = data.termin.saison;
				data.ansicht.team.termin.zat = data.termin.zat;
				saison.disabled = true; 
				zat.disabled = true; 
			} else if (data.ansicht.team.auswahl == OSext.AUSWAHL.START2) {
				data.ansicht.team.termin.zat = 1;
				data.ansicht.team.termin.saison = (data.termin.saison + 1);
				saison.disabled = true; 
				zat.disabled = true; 
			} else if (data.ansicht.team.auswahl == OSext.AUSWAHL.START) {
				data.ansicht.team.termin.zat = 1;
				saison.disabled = false; 
				zat.disabled = true; 
			} else if (data.ansicht.team.auswahl == OSext.AUSWAHL.ENDE) {
				data.ansicht.team.termin.zat = OSext.ZATS_PRO_SAISON;
				saison.disabled = false; 
				zat.disabled = true; 
			} else if (data.ansicht.team.auswahl == OSext.AUSWAHL.FREI) {
				saison.disabled = false; 
				zat.disabled = false; 
			}
			saison.value = data.ansicht.team.termin.saison;
			zat.value = data.ansicht.team.termin.zat;
		} else if (data.ansicht.team.termin.saison != (+saison.value)) {
			data.ansicht.team.termin.saison = (+saison.value);
		} else if (data.ansicht.team.termin.zat != (+zat.value)) {
			data.ansicht.team.termin.zat = (+zat.value);
		}		
	},

	setInfo : function (teaminfo) {
		
		var info = this.wrappeddoc.doc.getElementById(this.ids.teaminfo);
		
		info.innerHTML = teaminfo;
	}
};
