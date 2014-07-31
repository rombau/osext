/**
 * Wrapper-Klasse für ein {@code HTMLDocument}, 
 * welches dem Konstruktor übergeben werden muss. Aus der Dokument-Location 
 * werden Pfad, Dateiname und Dateierweiterung extrahiert. Über den Dateinamen
 * kann der entsprechende SiteHandler ermittelt werden.
 * @constructor
 * @throws 
 * {@link OSext.IllegalArgumentError} wenn kein {@code HTMLDocument} übergeben wurde.
 */
OSext.WrappedDocument = function (doc) {

	var lastIndex,
		paramarray,
		p;

	this.location = null;

	if (doc && doc.nodeName == "#document") {
		
		this.location = (doc.testLocation || doc.location.href);
		
		lastIndex = this.location.lastIndexOf("/");

		this.path = this.location.substring(0, lastIndex + 1);
		this.file = this.location.substring(lastIndex + 1).split(".")[0];
		this.extension = this.location.substring(lastIndex + 1).split(".")[1];

		this.doc = doc;
		
		try {
			this.navigation = doc.defaultView.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
	        	.getInterface(Components.interfaces.nsIWebNavigation);
		} catch (e) {}

		this.parameters = [];
		if (this.extension && this.extension.indexOf("?") != -1) {
			paramarray = this.extension.split("?")[1].split("&");
			for (p = 0; p < paramarray.length; p++) {
				this.parameters[paramarray[p].split("=")[0]] = paramarray[p].split("=")[1];
			}
		}

	} else {
		
		throw new OSext.IllegalArgumentError("Ungültiges Dokument übergeben.");
	}		
};

OSext.WrappedDocument.prototype = {

	/**
	 * Liefert das Verabeitungsobjekt für das aktuelle {@code HTMLDocument}.
	 * Reports werden gesondert behandelt.
	 * @return Verabeitungsobjekt
	 */
	getSiteHandler : function () {
		
		if (!this.sitehandler) {
			if (this.file) { 
				if (this.path.search(/.+rep.saison.+/) != -1 &&
						this.file.search(/\d+-\d+/) != -1) {
					this.sitehandler = new OSext.Sites.Report(this);
					OSext.Log.debug([this.file.split("-")[0], "-", this.file.split("-")[1], " => ", this.sitehandler.classname]);
				} else {
					this.sitehandler = this.createSiteHandlerByName(this.file);
					OSext.Log.debug([this.file, " => ", this.sitehandler.classname]);
				}
			} else {
				this.sitehandler = {};
			}
		}
		return this.sitehandler;
	},

	/**
	 * Erzeugt das Verabeitungsobjekt für das aktuelle {@code HTMLDocument}
	 * anhand des übergebenen Klassennamen (=Dateiname).
	 * @return Verabeitungsobjekt aus dem Namensraum {@code OSext}
	 */	
	createSiteHandlerByName : function (classname) {

		var namearray,
			Functionconstructor,
			classnameNS,
			i;
		
		if (!classname) {
			throw new OSext.IllegalArgumentError("Keine Seite angegeben.");
		}

		namearray = classname.split(".");
		Functionconstructor = (window || this);
		if (!namearray || namearray.length == 1) {
			classname = classname[0].toUpperCase() + classname.substring(1);
			classnameNS = "OSext.Sites." + classname;
			namearray = classnameNS.split(".");
		}
		try {
			for (i = 0; i < namearray.length; i++) {
				Functionconstructor = Functionconstructor[namearray[i]];
			}
		} catch (e) {
			Functionconstructor = undefined;
		}

		if (typeof Functionconstructor != "function") {
			// Kein Handler gefunden (z.B. Forum-Urls)
			return {};
		}
		// this (=WrappedDocument) wird dem Konstruktor übergeben
		return new Functionconstructor(this);
	},
	
	// FEATURE Steuerübersicht erweitert um Bilanzwerte -> Steuern & Bilanz
	// menue.php erweitern um den Link zu ändern
	// steuer.php erweitern um Summen aus der Datenbank für die aktuelle Saison und die Vorsaison
	/*
	 * SELECT Saison, 
	 * SUM(Stadioneinnahmen) AS Stadioneinnahmen, SUM(Stadionkosten) AS Stadionkosten, SUM(Tvgelder) AS Tvgelder, SUM(Fanartikel) AS Fanartikel, SUM(Spielergehaelter) AS Spieler, SUM(Trainergehaelter) AS Trainer, SUM(Jugend) AS Jugend, SUM(Physio) AS Physio, SUM(Leihen) AS Leihen, SUM(Siegpraemie) AS Siegpraemie,
 	 * SUM(Stadioneinnahmen)+SUM(Stadionkosten)+SUM(Tvgelder)+SUM(Fanartikel)+SUM(Spielergehaelter)+SUM(Trainergehaelter)+SUM(Jugend)+SUM(Physio)+SUM(Leihen)+SUM(Siegpraemie) AS Bilanz
	 * FROM Spieltage GROUP BY Saison
	 */
	
	// FEATURE Spielerseite erweitern (schnelle Berechnung Skill, Opti, MW bei Skilländerung)
	// Skilländerung per "verstecktem" Input und/oder "-"/"+"-Link neben dem Balken
	
	/**
	 * Verarbeitet das aktuelle {@code HTMLDocument}.
	 * @param data Referenz auf die Anwendungsdaten
	 * @param inqueue true, wenn innerhalb einer Verabeitungswarteschlange
	 * @return Verabeitungswarteschlange für weitere Dokumente (oder {@code null})
	 */
	process : function (data, inqueue) {
		
		var ok = true, newqueue = null; 

		this.removeTopThema();
		
		this.checkCalculationRunning();
		
		if (typeof this.getSiteHandler().check == "function") {
			ok = this.getSiteHandler().check(this.parameters);
		}

		if (ok) {
			if ((!data.initialized || this.getSiteHandler().alwaysExtract) && 
					typeof this.getSiteHandler().extract == "function") {
				newqueue = this.getSiteHandler().extract(data, this.parameters);
			}
	
			if (!inqueue && !newqueue &&
					typeof this.getSiteHandler().extend == "function") {
				newqueue = this.getSiteHandler().extend(data, this.parameters);
			}
	
			if (data.initialized && this.getSiteHandler().alwaysExtract && 
					typeof this.getSiteHandler().save == "function") {
				this.getSiteHandler().save(data, this.parameters);
			}
		}
		
		return newqueue;
	},

	/**
	 * Verarbeitet Änderungen bzw. Events am aktuellen {@code HTMLDocument}.
	 * @param data Referenz auf die Anwendungsdaten
	 */
	update : function (data) {

		if (typeof this.getSiteHandler().update == "function") {
			this.getSiteHandler().update(data, this.parameters);
		}
		
	},

	/**
	 * Prüft, ob das aktuelle {@code HTMLDocument} eine OS-Seite ist.
	 * Lokale Seiten (für einen eventuellen Testbetrieb) sind immer gültig.
	 * Zudem wird ein 
	 * @param hostname Url-Prefix, der getestet werden soll
	 * @param notifier Benachrichtigungsklasse für Icon
	 * @return true, wenn der Hostname der Seite dem in den Preferences (default=os.ongapo.com) entspricht (oder {@code false})
	 */
	isOnlineSoccerSite : function (hostname, notifier) {

		if (hostname.lastIndexOf("/") != -1) {
			hostname = hostname.substring(0, hostname.lastIndexOf("/"));
		}
		if (this.path && ((hostname && this.path.indexOf(hostname) != -1) || this.path.split(":")[0] == "file")) {
			return true;
		}
		if (notifier) {
			notifier.hideIcon();
		}
		return false;
	},

	/**
	 * Prüft, ob gerade eine Auswertung läuft
	 * @throws 
	 * {@link OSext.OfflineError}
	 */
	checkCalculationRunning : function () {

		var divs = this.doc.getElementsByTagName("div");
		
		if (divs.length > 0 && divs[0].firstChild) {
			if (divs[0].firstChild.textContent
				.search(/F.+r\sdie\sDauer\svon\sZAT\s.+\ssind\sdie\sSeiten\svon\sOS\s2\.0\sgesperrt!/) != -1) {
				throw new OSext.OfflineError("Es läuft derzeit eine Auswertung.");
			}
		}
	},
	
	/**
	 * Entfernt die Werbung auf der Seite
	 */
	removeTopThema : function () {

		var topthema = this.doc.getElementById("TopThema");
		
		if (topthema) {
			topthema.innerHTML = "";
		}
	},

	
	/**
	 * Erzeugt eine horizontale Linie als letztes Kind-Element.
	 * @param parent Eltern-Element
	 */
	addLine : function (parent) {

		parent.appendChild(this.doc.createElement("hr"));
	},

	/**
	 * Erzeugt einen Text als letztes Kind-Element.
	 * @param parent Eltern-Element
	 * @param text Text bzw. Html
	 * @param bold {@code true} wenn der Text fett sein soll
	 * @param id Id des neuen Text-Elements
	 */
	addText : function (parent, text, bold, id, valign) {

		var span = this.doc.createElement("span");
		
		if (bold) {
			span.style.fontWeight = "bold";
		}
		if (valign) {
			span.style.fontWeight = valign;
		}
		
		if (id) {
			span.id = id;
		}
		
		span.innerHTML = text;
		
		parent.appendChild(span);
	},

	/**
	 * Erzeugt eine Auswahlliste als letztes Kind-Element.
	 * @param parent Eltern-Element
	 * @param id Id des Selects
	 * @param options Named Array mit den Werten
	 * @param value Default-Auswahl
	 * @param disabled wenn {@code true} ist die Auswahl gesperrt
	 */
	addSelect : function (parent, id, options, value, disabled) {
		
		var select = this.doc.createElement("select"),
			option, opt;
				
		for (opt = 0; opt < options.length; opt++) {
			option = this.doc.createElement("option");
			option.text = options[opt].text;
			option.value = options[opt].value;
			select.appendChild(option);
		}
		
		select.id = id;
		select.value = value;
		select.disabled = disabled;
		select.addEventListener("change", OSext.EventHandler.updateDocument, false);
		
		parent.appendChild(select);
	},
	
	/**
	 * Erzeugt eine Auswahlbox als letztes Kind-Element.
	 * @param parent Eltern-Element
	 * @param id Id der Auswahlbox
	 * @param title Titel der Auswahlbox
	 * @param checked {@code true}, wenn die Box angehakt sein soll
	 */
	addCheckbox : function (parent, id, title, checked) {
		
		var checkbox = this.doc.createElement("input");
		
		checkbox.type = "checkbox";
		checkbox.id = id;
		checkbox.style.verticalAlign = "middle";
		
		if (checked) {
			checkbox.checked = "checked";
		}
		
		checkbox.addEventListener("change", OSext.EventHandler.updateDocument, false);
		
		parent.appendChild(checkbox);

		this.addText(parent, "&nbsp;" + title, false, null, "middle");
	}

};
