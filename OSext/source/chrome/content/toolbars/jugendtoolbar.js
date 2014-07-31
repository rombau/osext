/**
 * Toolbar für die Jugendseiten
 * @constructor
 */
OSext.JugendToolbar = function (wrappeddoc) {
	
	this.ids = { 
		auswahl : "osext-auswahl"
	};
	
	this.wrappeddoc = wrappeddoc;
};

OSext.JugendToolbar.prototype = {
	
	/**
	 * Erweitert die Jugendspielerseiten um eine Toolbar 
	 */
	show : function (data) {

		var table = this.wrappeddoc.doc.getElementsByTagName("table")[1],
			toolbar = this.wrappeddoc.doc.createElement("div"),
			options = [], alter;
		
		this.wrappeddoc.addLine(toolbar);
		
		this.wrappeddoc.addText(toolbar, "Prognose: ", true);
		
		options = [{text: "Aktuell", value: OSext.AUSWAHL.AKTUELL}];
		
		for (alter = (OSext.MAX_JUGEND_ALTER + 1 - data.liga); alter <= 18; alter++) {
			options.push({text: alter + " Jahre", value: alter});
		}
		
		options.push({text: "Maximal", value: OSext.MAX_JUGEND_ALTER + 1});
			
		this.wrappeddoc.addSelect(toolbar, this.ids.auswahl, options, 
				data.ansicht.jugend.auswahl, false);

		this.wrappeddoc.addLine(toolbar);
		
		table.parentNode.insertBefore(toolbar, table);		
	},

	/**
	 * Übernimmt die Auswahl in die Ansichteinstellungen
	 */
	handleSelections : function (data) {
		
		var auswahl = this.wrappeddoc.doc.getElementById(this.ids.auswahl);
		
		if (data.ansicht.jugend.auswahl != auswahl.value) {
			data.ansicht.jugend.auswahl = auswahl.value;
			data.ansicht.jugend.cache = null;
		}
	}
};
