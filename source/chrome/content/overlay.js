(function () {
	try {
		Components.utils.import("resource://gre/modules/AddonManager.jsm");
		AddonManager.getAddonByID("osext@greenmoon.at", function (addon) {
			if(addon.version != OSext.Prefs.getCurrentVersion()) {
				OSext.Prefs.setCurrentVersion(addon.version);
				OSext.Log.info("Show chrome://osext/content/resource/whatsnew.html ...");
				window.gBrowser.loadOneTab("chrome://osext/content/resource/whatsnew.html");
			}
		});
	}
	catch (e) {
		OSext.Log.error(e.message);
	}
})();

/**
 * Globales Objekt mit den Anwendungsdaten.
 */
OSext.AppData = new OSext.Data();

/**
 * Globaler Objekt für die Ereignisbehandlung
 */
OSext.EventHandler = {

	requestqueues : [],
	
	processDocument : function (wrappeddocument, data, preferences, notifier) {
		
		var	queue = null;
		
		try {
			if (wrappeddocument.isOnlineSoccerSite(preferences.getHostname(), notifier)) {				
				if (data && preferences.isActive(notifier)) {
					queue = wrappeddocument.process(data, this.getLastQueue());
					if (queue) {
						this.requestqueues.push(queue);
					}
					this.loadNextDocumentFromQueue(wrappeddocument.location, data, notifier);
				}
			}
		} catch (e) {
			OSext.Log.error(e.message);
			OSext.Log.debug(Components.stack);
			if (e instanceof OSext.AuthenticationError) {
				if (preferences.showAlerts()) {
					notifier.showError("Deine Session ist abgelaufen. Bitte melde Dich neu an.");
				}
			} else {
				if (preferences.showAlerts()) {
					if (e instanceof OSext.SiteChangeError) {
						notifier.showError("Eine OS-Seite wurde geändert:\n" + e.message + 
								"\n\nDies macht eine Aktualisierung von OSext erforderlich.");
					} else if (e instanceof OSext.OfflineError) {
						// Offline-Hinweis ist bereits am Schirm
					} else {
						notifier.showError("Ein Programmfehler ist aufgetreten:\n\n" + e.message + "\n\n" + e.stack);	
					}
				}
				OSext.AppData = null;
				this.requestqueues = [];
			}
		}
	},

	loadNextDocumentFromQueue : function (location, data, notifier) {

		var queue = this.getLastQueue();
		
		if (queue && queue.current && queue.current.uri != location) {
			// anderes Document wurde geladen;
			// das Queue-Dokument kommt noch ...
			queue = null;
		}
		
		if (queue) {
			notifier.showPanel(queue, "Initialisiere ...");
			if (!queue.loadNext(data, notifier)) {
				this.requestqueues.pop();
				queue = this.getLastQueue();
				if (queue) {
					this.loadNextDocumentFromQueue(queue.current.uri, data, notifier);
				}
			}
			if (this.requestqueues.length === 0) {
				notifier.hidePanel();
			}
		}
	},
	
	getLastQueue : function () {
		
		if (this.requestqueues.length) {
			return this.requestqueues[(this.requestqueues.length - 1)];
		}
		return null;
	},
	
	updateDocument : function (event, data) {
		
		var wrappeddocument = new OSext.WrappedDocument(event.originalTarget.ownerDocument);
		wrappeddocument.update(data || OSext.AppData);
	},
	
	activate : function (event) {
		
		OSext.Prefs.toggleActive(OSext.Notifications);
	},
	
	refreshData : function (event) {
		
		var queue = new OSext.RequestQueue(
				{path: OSext.Prefs.getHostname(true)}, null, null, OSext, true);
		
		OSext.AppData = new OSext.Data();
		
		queue.addSite("haupt", null, true, null, "Aktualisierung");
		queue.loadNext(OSext.AppData, null);
		
	},
	
	options : function (event) {
		
		window.openDialog("chrome://osext/content/preferences.xul", "Einstellungen", 
				"chrome,titlebar,toolbar,centerscreen,modal");
	}
};

OSext.Prefs.addChangeListener(function (prefname) {

	var refresh = false, doc, wrappeddocument;
	
	if (prefname == "logging" || prefname == "loglevel") {
		OSext.Log = new OSext.Logger(OSext.Prefs);
	}

	if (prefname == "pslimit" || prefname == "nslimit" || prefname == "limitalter" || 
		prefname == "abwertungspiele" || prefname == "physio" || prefname == "bilanz" || prefname == "neuvertrag") {
		OSext.AppData.clearAllCaches();
		refresh = true;
	}

	if (prefname == "bilanz") {
		OSext.AppData.initSpielersummen();
		refresh = true;
	}
	
	if (refresh) {
		doc = gBrowser.selectedBrowser.contentDocument;
		if (doc.body.lastElementChild && doc.body.lastElementChild.contentDocument) {
			doc = doc.body.lastElementChild.contentDocument
		}
		wrappeddocument = new OSext.WrappedDocument(doc);
		wrappeddocument.update(OSext.AppData);
	}
});

/**
 * Globaler Event Listener.
 * Nach dem Laden eines Dokuments wird {@code OSext.EventHandler.processDocument()} aufgerufen. 
 */
window.document.addEventListener("DOMContentLoaded", function (evt) {
	if (evt.originalTarget.nodeName == "#document") {
		OSext.Notifications = OSext.Notifications || new OSext.Notifier();
		OSext.EventHandler.processDocument(
			new OSext.WrappedDocument(evt.originalTarget), 
				OSext.AppData, 
				OSext.Prefs,
				OSext.Notifications);
	}
}, false);

gBrowser.tabContainer.addEventListener("TabSelect", function (evt) {
	var wrappeddocument = new OSext.WrappedDocument(gBrowser.selectedBrowser.contentDocument);
	if (wrappeddocument.isOnlineSoccerSite(OSext.Prefs.getHostname(), OSext.Notifications)) {
		OSext.Prefs.isActive(OSext.Notifications);
	}
}, false);  

