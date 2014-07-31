/**
 * Toolbar für die Saisonübersicht
 * @constructor
 */
OSext.SaisonToolbar = function (wrappeddoc) {
	
	this.ids = { 
		platz : "osext-platz", 
		auslastung : "osext-auslastung", 
		eintritt : "osext-eintritt"
	};
	
	this.wrappeddoc = wrappeddoc;
};

OSext.SaisonToolbar.prototype = {
	
	/**
	 * Erweitert die Saisonübersicht um eine Toolbar 
	 */
	show : function (data) {

		var table = this.wrappeddoc.doc.getElementsByTagName("table")[2],
			toolbar = this.wrappeddoc.doc.createElement("div"),
			options = [], p, a, i, e, v,
			folgesaison = data.termin.saison + (data.saisonpause ? 2 : 1);
		
		this.wrappeddoc.addLine(toolbar);
		
		this.wrappeddoc.addText(toolbar, "Prognose: ", true);
		
		this.wrappeddoc.addText(toolbar, " Platzierung: ", false);
		
		options = [];
		for (p = 1; p <= data.ligagroesse; p++) {
			options[p - 1] = {text: p, value: p};
		}
		this.wrappeddoc.addSelect(toolbar, this.ids.platz, options, 
				data.ansicht.saison.platzierung, false);

		this.wrappeddoc.addText(toolbar, " Stadionauslastung: ", false);
		
		options = [];
		for (a = 100, i = 0; a >= 80; a -= 5, i++) {
			options[i] = {text: a + "%", value: a};
		}
		this.wrappeddoc.addSelect(toolbar, this.ids.auslastung, options, 
				data.ansicht.saison.auslastung, false);

		this.wrappeddoc.addText(toolbar, " Liga-Eintritt: ", false);
		
		options = [];
		for (e = 1; e <= 100; e++) {
			options[e - 1] = {text: e, value: e};
		}
		this.wrappeddoc.addSelect(toolbar, this.ids.eintritt, options, 
				data.ansicht.saison.eintritt, false);
	
		this.wrappeddoc.addLine(toolbar);
				
		table.parentNode.insertBefore(toolbar, table);		
	},

	/**
	 * Übernimmt die Werte der Auswahlboxen.
	 */
	handleSelections : function (data) {
		
		var platzierung = this.wrappeddoc.doc.getElementById(this.ids.platz),
			auslastung = this.wrappeddoc.doc.getElementById(this.ids.auslastung),
			eintritt = this.wrappeddoc.doc.getElementById(this.ids.eintritt);
			
		if (data.ansicht.saison.platzierung != platzierung.value || 
				data.ansicht.saison.auslastung != auslastung.value || 
				data.ansicht.saison.eintritt != eintritt.value) {
			data.ansicht.saison.cache = null;
		}

		if (data.ansicht.saison.platzierung != platzierung.value) {
			data.ansicht.saison.platzierung = platzierung.value;
		}
		if (data.ansicht.saison.auslastung != auslastung.value) {
			data.ansicht.saison.auslastung = auslastung.value;
		}
		if (data.ansicht.saison.eintritt != eintritt.value) {
			data.ansicht.saison.eintritt = eintritt.value;
		}
	}
};
