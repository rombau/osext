/**
 * Klasse für eine Seite in der Verarbeitungswarteschlange.
 * @constructor
 */
OSext.RequestQueueSite = function (uri, params, post, status) {
	
	this.uri = uri;
	this.params = params;
	this.post = post;
	this.status = status;
};


/**
 * Klasse für eine Verarbeitungswarteschlange von {@code HTMLDocument}en.
 * @constructor
 */
OSext.RequestQueue = function (wrappeddoc, sitehandler, postcallback, postdatafactory, initial, iframe) {
	
	/**
	 * Referenz auf das {@code OSext.WrappedDocument}, von dem die RequestQueue initiert wurde.
	 * Wird für das postProcessing benötigt.
	 */
	this.postProcessingDocument = wrappeddoc;
	
	/**
	 * Referenz auf das SiteHandler-Objekt, von dem die RequestQueue initiert wurde.
	 * Wird für das postProcessing benötigt.
	 */
	this.postProcessingSitehandler = sitehandler;
	
	/**
	 * Callback für das postProcessing. Diese Methode des {@code postProcessingSitehandler} wird aufgerufen, 
	 * wenn das Ende der Verarbeitungswarteschlange erreicht wurde.
	 */
	this.postProcessingCallback = postcallback;
	
	/**
	 * Liste mit den Seiten der Queue.
	 */
	this.sitequeue = [];

	/**
	 * Initiale Anzahl der Seiten der Queue.
	 */
	this.sitecount = 0;
	
	/**	
	 * Referenz auf aktuelle Seite der Queue.
	 */
	this.current = null;

	/** 
	 * Referenz auf den IFrame, in dem die Seiten geladen werden sollen.
	 */
	this.iframe = null;
	if (iframe && iframe.webNavigation) {
		this.iframe = iframe;
	} else {
		this.iframe = document.getElementById("osext-requestframe");
		if (this.iframe) {
			// Initialisierung der Navigationskomponente des IFrame
			this.iframe.webNavigation.allowAuth = true;
			this.iframe.webNavigation.allowImages = false;
			this.iframe.webNavigation.allowJavascript = false;
			this.iframe.webNavigation.allowMetaRedirects = false;
			this.iframe.webNavigation.allowPlugins = false;
			this.iframe.webNavigation.allowSubframes = false;
		}
	}
	
	/**
	 * Factory, die eine {@code getPostData}-Methode zur Verfügung stellt,
	 * welche die Post-Parameter aufbereitet
	 */
	this.postdatafactory = postdatafactory;
	
	/**
	 * Kennzeichen, ob es sich um die Initialisierungqueue handelt
	 */
	this.initial = initial;
};

OSext.RequestQueue.prototype = {

	/**
	 * Fügt eine zu ladende Seite der Requestqueue hinzu
	 * @param file Dateiname ohne Extension
	 * @param params Key(named)-Value-Array
	 * @param dynamic true, wenn es sich um eine dynamische Seite (php) handelt
	 * @param post Key(named)-Value-Array für Parameter per POST-Request
	 * @param status Infotext für Notification
	 */
	addSite : function (file, params, dynamic, post, status) {
		
		var uri = this.postProcessingDocument.path + file + "." + (dynamic ? "php" : "html");
		
		this.sitequeue.push(new OSext.RequestQueueSite(uri, params, post, status));
		this.sitecount++;
	},
	
	/**
	 * Lädt die nächste Seite der Requestqueue
	 * @param data Anwendungsdaten
	 */
	loadNext : function (data, notifier) {
	
		var p, postdata = null,
			msg, header = null;
			
		if (this.sitequeue.length > 0) {
			
			this.current = this.sitequeue.shift();

			if (notifier) {
				p = Math.round(((this.sitecount - this.sitequeue.length) / this.sitecount) * 100);
				msg = this.current.status;
				if (p == 100 && this.initial) {
					msg = " ";
					header = "Datensicherung";
				}
				notifier.updatePanel(p, msg, header, this);
			}
			if (this.current.post) {
				postdata = this.postdatafactory.getPostData(this.serializeParams(this.current.post));
			} 
			if (this.current.params) {
				this.current.uri += ("?" + this.serializeParams(this.current.params));
			}
			
			if (this.iframe) {
				OSext.Log.info(["Lade:", this.current.uri]);
				this.iframe.webNavigation.loadURI(
					this.current.uri,
					Components.interfaces.nsIWebNavigation, null, 
					postdata, null);
			}
			return true;
			
		} else if (this.postProcessingCallback) {
			
			this.postProcessingCallback.call(
				this.postProcessingSitehandler, 
				this.postProcessingDocument.doc, data, notifier);
		}
		return false;
	},
	
	/**
	 * Serialisiert die Parameter in einen Querystring
	 * @param params  Key(named)-Value-Array
	 * @returns Serialisierter Querystring
	 */
	serializeParams : function (params) {
		
		var p, out = "";
		
		for (p in params) {
			if (true) {
				if (out !== "") {
					out += "&";
				}
				out += p;
				out += "=";
				out += params[p];
			}
		}
		return out;
	}

};
