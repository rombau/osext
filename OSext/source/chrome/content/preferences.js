/**
 * Klasse zum Lesen und Schreiben von Einstellungen.
 * @constructor
 */
OSext.Preferences = function () {
};

OSext.Preferences.prototype = {

	/**
	 * Liefert den Preferences-Branch für die Erweiterung
	 * @throws 
	 * {@link OSext.Error}
	 */
	getBranch : function () {
		
		var service;
		
		if (!this.branch) {
			service = Components.classes["@mozilla.org/preferences-service;1"]
				.getService(Components.interfaces.nsIPrefService);
			if (!service) {
				throw new OSext.Error("Preferences-Service nicht verfuegbar!");
			}
			this.branch = service.getBranch("extensions.osext.");
			if (!this.branch) {
				throw new OSext.Error("Einstellungen konnten nicht geladen werden!");
			}
		}
		return this.branch;
	},
	
	/**
	 * Liefert die aktuelle Versionsnummer.
	 */
	getCurrentVersion : function () {
		return this.getBranch().getCharPref("currentversion");
	},

	/**
	 * Speichert die aktuelle Versionsnummer.
	 * @param currentversion Versionsnummer
	 */
	setCurrentVersion : function (currentversion) {
		this.getBranch().setCharPref("currentversion", currentversion);
	},

	/**
	 * Liefert den Hostnamen für die Verarbeitung von Seiten.
	 * @param full true, damit das Protocol nicht weggeschnitten wird
	 */
	getHostname : function (full) {
		var uribase = this.getBranch().getCharPref("uribase");
		if (!full && uribase.indexOf("://") > -1) {
			uribase = uribase.substr(uribase.indexOf("://") + 3);
		}
		return uribase;
	},

	/**
	 * Prüft, ob die Erweiterung aktiv ist.
	 * @param notifier Benachrichtigungsklasse für Icon
	 */
	isActive : function (notifier) {
		if (this.getBranch().getBoolPref("active")) {
			if (notifier) {
				notifier.showIcon(true);
			}
			return true;
		}
		if (notifier) {
			notifier.showIcon(false);
		}
		return false;
	},

	/**
	 * Liefert den Log-Level für die Firebug Console.
	 */
	getLogLevel : function () {
		if (this.getBranch().getBoolPref("logging")) {
			return this.getBranch().getIntPref("loglevel");
		}
		return 0;
	},

	/**
	 * Aktiviert/Deaktiviert die Erweiterung
	 * @param notifier Benachrichtigungsklasse für Icon
	 */
	toggleActive : function (notifier) {
		var active = !this.getBranch().getBoolPref("active");
		
		this.getBranch().setBoolPref("active", active);
		if (notifier) {
			notifier.showIcon(active);
		}
	},
	
	/**
	 * Liefert den Pfad zur SQLite-Datenbank-Datei.
	 */
	getDBPath : function () {
		return this.getBranch().getCharPref("dbpath");
	},

	/**
	 * Speichert den Pfad zur SQLite-Datenbank-Datei.
	 * @param path Pfad zur SQLite-Datenbank-Datei
	 */
	setDBPath : function (path) {
		this.getBranch().setCharPref("dbpath", path);
	},
	
	/**
	 * Liefert die Grenze für die Primärskill-Prognose.
	 */
	getMaxPrimaerskill : function () { 
		return this.getBranch().getIntPref("pslimit"); 
	},

	/**
	 * Liefert die Grenze für die Nebenskill-Prognose.
	 */
	getMaxNebenskill : function () { 
		return this.getBranch().getIntPref("nslimit");
	},

	/**
	 * Liefert das Alter für die Trainingsgrenzen.
	 */
	getAlterTrainingslimit : function () { 
		return this.getBranch().getIntPref("limitalter");
	},

	/**
	 * Liefert die Anzahl der Spiele pro Saison von Abwertungsspielern.
	 */
	getAbwertungspiele : function () {
		var spiele = this.getBranch().getIntPref("abwertungspiele");
		if (spiele > 52) {
			return 52;
		}
		return spiele;
	},
	
	/**
	 * Prüft, ob ein Physio bei Verletzungen angewendet werden soll. 
	 */
	isPhysio : function () {
		return this.getBranch().getBoolPref("physio");
	},

	/**
	 * Gibt an, ob Alerts angezeigt werden sollen. 
	 */
	showAlerts : function () {
		return this.getBranch().getBoolPref("alerterrors");
	},

	/**
	 * Liefert die Einstellung der Bilanzauswahl
	 */
	getBilanzauswahl : function () {
		return this.getBranch().getIntPref("bilanz");
	},

	/**
	 * Liefert die Anzahl der Monate eines automatischen Neuvertrags.
	 */
	getMonateNeuVertrag : function () { 
		return this.getBranch().getIntPref("neuvertrag");
	},
	
	addChangeListener : function (callback) {
		this.callback = callback;
		this.branch = this.getBranch(); 
		this.branch.QueryInterface(Components.interfaces.nsIPrefBranch2);  
		this.branch.addObserver("", this, false);  
	},
	
	observe: function (subject, topic, data) {
		if (topic == "nsPref:changed") {  
			this.callback(data);   
		}
	}  
};

OSext.Prefs = new OSext.Preferences();
