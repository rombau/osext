/**
 * Klasse für Benachrichtigungen aller Art.
 * @constructor
 */
OSext.Notifier = function () {
	
	/** 
	 * Referenz auf das Anwendungsicon.
	 */
	this.icon = document.getElementById("osext-icon");

	/** 
	 * Referenzen auf Kontextmenüeinträge.
	 */
	this.menuActivate = document.getElementById("osext-menu-activate");
	this.menuRefresh = document.getElementById("osext-menu-refresh");

	/** 
	 * Referenzen auf das Fortschritt-Panel.
	 */
	this.panel = document.getElementById("osext-progress-panel"); 
	this.panelHeader = document.getElementById("osext-progress-panel-header"); 
	this.panelStatus = document.getElementById("osext-progress-panel-status"); 
	this.panelProgress = document.getElementById("osext-progress");
	
	/**
	 * Referenz auf die aktuelle {@link OSext.RequestQueue}
	 */
	this.requestqueue = null;
};

OSext.Notifier.prototype = {
	
	/**
	 * Zeigt einen Fehlerdialog an.
	 * @param msg Fehlernachricht
	 */
	showError : function (msg) {

		// FEATURE Eigenen XUL-Fehlerdialog; eventuell Error-Notification im oberen Bereich des Browsers
		alert(msg);
	},
	
	/**
	 * Zeigt das Icon in der Url-Bar.
	 * @param on Gibt an, ob die Erweiterung aktiv ist.
	 */
	showIcon : function (on) {
		if (this.icon) {
			this.icon.collapsed = false;
			this.icon.setAttribute("status", on ? "on" : "off");
		}
		if (this.menuRefresh) {
			this.menuRefresh.setAttribute("disabled", on ? "false" : "true");
		}
		if (this.menuActivate) {
			this.menuActivate.label = "OSext " + (on ? "deaktivieren" : "aktivieren");
		}
	},

	/**
	 * Entfernt das Icon aus der Url-Bar.
	 */
	hideIcon : function () {
		if (this.icon) {
			this.icon.collapsed = true;
		}
	},
	
	/**
	 * Öffnet das Fortschritt-Panel.
	 */
	showPanel : function (requestqueue, header) {
		if (this.panel && this.panel.hidden) {
			this.requestqueue = requestqueue;
			this.panel.hidden = false;
			this.panel.openPopup(this.icon, "bottomcenter topright");
		}
		if (this.panelHeader && header) {
			this.panelHeader.value = header;
		}
	},

	/**
	 * Aktualisiert das Fortschritt-Panel.
	 */
	updatePanel : function (percent, msg, header, requestqueue) {
		if (this.panel) {
			if (this.panel.hidden) {
				this.showPanel(requestqueue, header);
			}
			if (this.panelStatus && msg) {
				this.panelStatus.value = msg;
			}
			if (this.panelProgress && this.requestqueue == requestqueue) {
				this.panelProgress.value = percent;
			}
			if (this.panelHeader && header) {
				this.panelHeader.value = header;
			}
		}
	},

	/**
	 * Schließt das Fortschritt-Panel.
	 */
	hidePanel : function () {
		if (this.panel) {
			this.requestqueue = null;
			this.panel.hidden = true;
			this.panel.hidePopup();
		}
	}
};

