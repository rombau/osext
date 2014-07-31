/**
 * Klasse für die Mannschaftsseite.
 * Die Unterseiten werden auf den entsprechnden {@code sitehandler} weitergeleitet.
 * @constructor
 */
OSext.Sites.Showteam = function (wrappeddoc) {
	
	this.classname = "OSext.Sites.Showteam";
	this.wrappeddoc = wrappeddoc;
	this.sitehandler = [];

};

OSext.Sites.Showteam.prototype = {

	/**
	 * Erzeugt und chached den Handler der entsprechenden Unterseite auf Basis des Queryparameters.
	 */
	getSubSiteHandler : function (param) {

		if (!param) {
			param = 0;
		} else {
			param = +param;
		}

		if (!this.sitehandler[param]) {
			switch (param) {
			case 0:
				this.sitehandler[0] = new OSext.Sites.ShowteamOverview(this.wrappeddoc);
				break;
			case 1:
				this.sitehandler[1] = new OSext.Sites.ShowteamContracts(this.wrappeddoc);
				break;
			case 2:
				this.sitehandler[2] = new OSext.Sites.ShowteamSkills(this.wrappeddoc);
				break;
			case 3:
				this.sitehandler[3] = new OSext.Sites.ShowteamStats(this.wrappeddoc);
				break;
			case 4:
				this.sitehandler[4] = new OSext.Sites.ShowteamStats(this.wrappeddoc);
				break;
			case 5:
				this.sitehandler[5] = new OSext.Sites.ShowteamInfo(this.wrappeddoc);
				break;
			case 6:
				this.sitehandler[6] = new OSext.Sites.ShowteamSaison(this.wrappeddoc);
				break;
			default:
				return null;
			}
			OSext.Log.debug([" s:", param, " => ", this.sitehandler[param].classname]);
		}
		return this.sitehandler[param];
	},

	/**
	 * Prüft die Seite auf Änderungen und Anmeldungsinformationen.
	 * @throws 
	 * {@link OSext.SiteChangeError} oder {@link OSext.AuthenticationError}
	 */
	check : function (params) {

		var siteHandler = this.getSubSiteHandler(params.s);
		if (siteHandler && typeof siteHandler.check == "function") {
			return siteHandler.check(params);
		}
		return false;
	},

	/**
	 * Extrahiert die Mannschaftsdaten der entsprechenden Seite. 
	 */
	extract : function (data, params) {

		var siteHandler = this.getSubSiteHandler(params.s);
		if (siteHandler && typeof siteHandler.extract == "function") {
			return siteHandler.extract(data, params);
		}
		return false;
	},
	
	/**
	 * Erweitert die Mannschaftsdaten der entsprechenden Seite. 
	 */
	extend : function (data, params) {
		var siteHandler = this.getSubSiteHandler(params.s);
		if (siteHandler && typeof siteHandler.extend == "function") {
			siteHandler.extend(data, params);
		}
		if (data.ansicht.team.cache && data.ansicht.team.cache != data.team.spieler) {
			this.update(data, params);
		}
	},
	
	/**
	 * Aktualisiert die Mannschaftsdaten der entsprechenden Seite
	 * nach einer Parameteränderung durch eine Benutzereingabe. 
	 */
	update : function (data, params) {

		var siteHandler = this.getSubSiteHandler(params.s);
		if (siteHandler && typeof siteHandler.update == "function") {
			siteHandler.update(data, params);
		}
	}
};
