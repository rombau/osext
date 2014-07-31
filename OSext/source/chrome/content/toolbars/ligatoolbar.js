/**
 * Toolbar für die Jugendseiten
 * @constructor
 */
OSext.LigaToolbar = function (wrappeddoc) {
	
	this.ids = { 
		extended : "osext-extended"
	};
	
	this.wrappeddoc = wrappeddoc;
};

OSext.LigaToolbar.prototype = {
	
	/**
	 * Erweitert die Liagtabelle um eine Toolbar 
	 */
	show : function (data) {

		var table = this.wrappeddoc.doc.getElementById("kader1"),
			toolbar = this.wrappeddoc.doc.createElement("div");
		
		this.wrappeddoc.addLine(toolbar);
		
		this.wrappeddoc.addCheckbox(toolbar, this.ids.extended, 
				 "Top-Elf-Werte anzeigen", data.ansicht.liga.extended);
		
		this.wrappeddoc.addLine(toolbar);
		
		table.parentNode.insertBefore(toolbar, table);		
	},

	/**
	 * Übernimmt die Auswahl in die Ansichteinstellungen
	 */
	handleSelections : function (data) {
		
		var checkbox = this.wrappeddoc.doc.getElementById(this.ids.extended);
		
		data.ansicht.liga.extended = checkbox.checked;
	}
};
