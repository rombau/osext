/**
 * Klasse für alle Ansichteinstellungen
 * @constructor
 */
OSext.Ansicht = function (data) {

	var dataref = data;
	
	/**
	 * Einstellungen der Teamansicht.
	 */
	this.team = {

		auswahl : OSext.AUSWAHL.AKTUELL,
		termin : new OSext.Termin(),
		cache : null,
		
		/**
		 * Liefert die Liste der Kaderspieler für den aktuell angezeigten Termin.
		 * @return Liste der Kaderspieler
		 */	
		getSpieler : function () {
			if (!this.cache) {
				this.cache = dataref.getTeam(this.termin).spieler;
			} else {
				OSext.Log.debug("Team aus dem Ansicht-Cache");
			}
			return this.cache;
		},
		
		/**
		 * Liefert die CSS-Klasse für den aktuell angezeigten Termin.
		 * @return CSS-Style-Klassenname
		 */	
		getStyle : function () {
			
			if (dataref.termin.getZats() == this.termin.getZats()) {
				return OSext.STYLE.CURRENT;
			} else if (dataref.termin.getZats() > this.termin.getZats()) {
				return OSext.STYLE.HIST;
			} else {
				return OSext.STYLE.FUTURE;
			}
		}
	};

	/**
	 * Einstellungen der Saisonansicht.
	 */
	this.saison = {
			
		platzierung : null,
		auslastung : 100,
		eintritt : null,
		cache : null,
		
		/**
		 * Liefert die Liste der Spieltage.
		 * @return Liste der Spieltage
		 */	
		getSaisonplan : function () {
			if (!this.cache) {
				this.cache = dataref.getSaisonplan();
			}
			return this.cache;
		}
	};

	/**
	 * Einstellungen der Jugendansicht.
	 */
	this.jugend = { 
			
		auswahl : OSext.AUSWAHL.AKTUELL,
		cache : null,
		
		/**
		 * Liefert die Liste der Jugendspieler für die aktuelle Prognoseauswahl.
		 * @return Liste der Jugendspieler
		 */	
		getSpieler : function () {
			var s, jugendzats, prognosezats;
			
			if (this.auswahl == OSext.AUSWAHL.AKTUELL) {
				this.cache = dataref.team.jugend;
			}
			else if (!this.cache) {
				if (dataref.team.jugend.length) {
					this.cache = [];
					for (s = dataref.team.jugend.length - 1; s >= 0; s--) {
						this.cache[s] = dataref.team.jugend[s].getSpieler(dataref.termin, this.auswahl, dataref.saisonpause);
					}
				}
			}
			return this.cache;
		},

		/**
		 * Liefert die CSS-Klasse für den aktuell angezeigten Termin.
		 * @return CSS-Style-Klassenname
		 */	
		getStyle : function () {
			
			if (this.auswahl == OSext.AUSWAHL.AKTUELL) {
				return OSext.STYLE.CURRENT;
			} else {
				return OSext.STYLE.FUTURE;
			}
		}	
	};
	
	/**
	 * Einstellungen der Liga(tabellen)ansicht.
	 */
	this.liga = {
			
		extended : false
	};

};
