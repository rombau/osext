/**
 * Klasse für die Jugendseite.
 * Die Unterseiten werden auf den entsprechnden {@code sitehandler} weitergeleitet.
 * @constructor
 */
OSext.Sites.Ju = function (wrappeddoc) {
	this.classname = "OSext.Sites.Ju";
	this.wrappeddoc = wrappeddoc;
	this.sitehandler = [];
};

OSext.Sites.Ju.prototype = {

	/**
	 * Erzeugt und chached den Handler der entsprechenden Unterseite auf Basis des Queryparameters.
	 */
	getSubSiteHandler : function (param) {

		if (!param) {
			param = 1;
		} else {
			param = +param;
		}

		if (!this.sitehandler[param]) {
			switch (param) {
			case 1:
				this.sitehandler[1] = new OSext.Sites.JugendOverview(this.wrappeddoc);
				break;
			case 2:
				this.sitehandler[2] = new OSext.Sites.JugendSkills(this.wrappeddoc);
				break;
			case 3:
				this.sitehandler[3] = new OSext.Sites.JugendOptionen(this.wrappeddoc);
				break;
			default:
				return null;
			}
			OSext.Log.debug([" page:", param, " => ", this.sitehandler[param].classname]);
		}
		return this.sitehandler[param];
	},

	/**
	 * Prüft die Seite auf Änderungen und Anmeldungsinformationen.
	 * @throws 
	 * {@link OSext.SiteChangeError} oder {@link OSext.AuthenticationError}
	 */
	check : function (params) {

		var siteHandler = this.getSubSiteHandler(params.page);
		if (siteHandler && typeof siteHandler.check == "function") {
			return siteHandler.check(params);
		}
		return false;
	},

	/**
	 * Extrahiert die Jugenddaten der entsprechenden Seite. 
	 */
	extract : function (data, params) {

		var siteHandler = this.getSubSiteHandler(params.page);
		if (siteHandler && typeof siteHandler.extract == "function") {
			return siteHandler.extract(data, params);
		}
		return false;
	},
	
	/**
	 * Erweitert die Jugenddaten der entsprechenden Seite. 
	 */
	extend : function (data, params) {
		var siteHandler = this.getSubSiteHandler(params.page);
		if (siteHandler && typeof siteHandler.extend == "function") {
			siteHandler.extend(data, params);
		}
		if (data.ansicht.jugend.cache && data.ansicht.jugend.cache != data.team.jugend) {
			this.update(data, params);
		}
	},
	
	/**
	 * Aktualisiert die Jugenddaten der entsprechenden Seite
	 * nach einer Parameteränderung durch eine Benutzereingabe. 
	 */
	update : function (data, params) {

		var siteHandler = this.getSubSiteHandler(params.page);
		if (siteHandler && typeof siteHandler.update == "function") {
			siteHandler.update(data, params);
		}
	}
};
