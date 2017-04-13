/**
 * Das Namespace-Objekt für die Anwendung beinhaltet globale Konstanten
 * und Funktionen.
 */
function OSextCommons() {

	this.Sites = {};
}

OSextCommons.prototype = {
	
	/**
	 * Zats pro Saison.
	 */
	ZATS_PRO_SAISON : 72,
	
	/**
	 * Zats pro Monat.
	 */
	ZATS_PRO_MONAT : 6,
	
	/**
	 * Einnahmen aus einem Friendly.
	 */
	FSS_GESAMT_BETRAG : 500000,

	/**
	 * Liste mit den Fernsehgeldern.
	 */
	TVGELDER : [747752, 733704, 720244, 707350, 695000, 692993, 663630, 637050, 613000, 591250, 589746, 578133, 567248, 557050, 547500, 543350, 539362, 535531, 531853, 528322],

	/**
	 * Liste mit den Fanartikel-Prämien.
	 */
	FANARTIKEL : [654163, 643715, 633716, 624150, 615000, 612468, 590425, 570500, 552500, 536250, 520310, 512627, 505450, 498750, 492500, 490000, 487613, 485334, 483162, 481092],
	
	/**
	 * Liste mit den Prämien-Faktoren abhängig von der Liga.
	 */
	PRAEMIENFAKTOR : [1, 0.85, 0.72],
	
	/**
	 * Eintritt-Aufschlag für Sitzer und Überdachung. 
	 */
	AUFSCHLAG : {
		USTEHER : 6,
		SITZER : 4,
		USITZER : 10
	},

	/**
	 * Stadionkosten pro Platz.
	 */
	STADIONKOSTEN : {
		OHNE_RASENHEIZUNG : 5,
		MIT_RASENHEIZUNG : 4
	},

	/**
	 * Maximales und minimales Alter von Jugendspielern.
	 */
	MAX_JUGEND_ALTER : 18,
	MIN_JUGEND_ALTER : 13,
	
	/**
	 * Minimale Jugendförderung.
	 */
	MIN_JUGEND_FOERDERUNG : 500,
	
	/**
	 * Positionen von Spielern.
	 */
	POS : {
		LEI : "LEI",
		TOR : "TOR",
		ABW : "ABW",
		DMI : "DMI",
		MIT : "MIT",
		OMI : "OMI",
		STU : "STU"
	},

	/**
	 * Status von Spielern.
	 */
	STATUS : {
		INAKTIV : 0,
		AKTIV : 1,
		VERLIEHEN : 2
	},
	
	/**
	 * Herkunft von Kaderspielern.
	 */
	HERKUNFT : {
		KAUF : 0,
		JUGEND : 1,
		LEIHE : 2
	},
	
	/**
	 * Skills nach Index in der Einzelwerte-Ansicht.
	 */
	SKILL : {
		SCH : 0,
		BAK : 1,
		KOB : 2,
		ZWK : 3,
		DEC : 4,
		GES : 5,
		FUQ : 6,
		ERF : 7,
		AGG : 8,
		PAS : 9,
		AUS : 10,
		UEB : 11,
		WID : 12,
		SEL : 13,
		DIS : 14,
		ZUV : 15,
		EIN : 16
	},

	/**
	 * Stilattribute für HTML-Elemente.
	 * Diese können mit Stylish referenziert werden.
	 */
	STYLE : {
		PS : "primary",
		UPDATED : "time",
		HIST : "hist",
		TIME : "time",
		CURRENT : "current",
		FUTURE : "future",
		MONAT : "abrechnung",
		JUGEND : "jahrgang1",
		ART : "art",
		STAT : "statistik"
	},

	/**
	 * Spielart
	 */
	SPIELART : {
		RESERVIERT : "reserviert",
		SPIELFREI : "spielfrei",
		BLIND : "Blind Friendly gesucht!",
		FSS : "Friendly",
		LIGA : "Liga",
		POKAL : "LP",
		OSC : "OSC",
		OSCQ : "OSCQ",
		OSE : "OSE",
		OSEQ : "OSEQ",
		INT : "INT"
	},

	/**
	 * Spielort
	 */
	SPIELORT : {
		HEIM : "Heim",
		AUSWAERTS : "Ausw"
	},

	/**
	 * Auswahlmöglichkeiten für Spieleransicht
	 */
	AUSWAHL : {
		AKTUELL : 0,
		START : 1,
		ENDE : 2,
		FREI : 3,
		START2 : 4
	},

	/**
	 * Auswahlmöglichkeiten für Bilanzeinschränkung
	 */
	BILANZ : {
		ALLES : 0,
		LETZTES_JAHR : 1,
		AKTUELLES_JAHR : 2
	},

	/**
	 * Liefert die Summe aller numerischen Elemente.
	 * @param {Array} liste Array mit beiliebien Elementen
	 * @returns {Number} Summe
	 */
	getListSum : function (liste) {
		for (var s = 0, sum = 0; s < liste.length; sum += liste[s++]) {}
		return sum;
	},
	
	/**
	 * Liefert das erste Element mit einem definierten Attributwert  
	 * @param liste Array mit beiliebien Elementen
	 * @param attribut Attribut des Elements
	 * @param wert Wert des Element-Attributs
	 */
	getListElement : function (liste, attribut, wert) {
		if (!liste) {
			OSext.Log.warn("liste is undefined.");
		} else {
			for (var s = 0; s < liste.length; s++) {
				if (liste[s][attribut] && liste[s][attribut] == wert) {
					return liste[s];
				}
			}
		}
		return null;
	},

	/**
	 * Liefert einen auf 99 begrenzten Wert.
	 * @param value
	 * @returns
	 */
	limitTo99 : function (value) {
		if (value > 99) {
			return 99;
		}
		if (value < 0) {
			return 0;
		}
		return value;
	},
	
	/**
	 * Liefert {@code true} wenn der Skill (lt. Index) für die Position ein Primärskill ist.
	 * @param pos Position eines Spielers
	 * @param i Index des Skills
	 */
	isPrimaerSkill : function (pos, i) {
		switch (pos) {
		case OSext.POS.TOR: 
			if (i == OSext.SKILL.KOB || 
				i == OSext.SKILL.ZWK || 
				i == OSext.SKILL.DEC || 
				i == OSext.SKILL.GES) {
				return true;
			}
			break;
		case OSext.POS.ABW: 
			if (i == OSext.SKILL.KOB || 
				i == OSext.SKILL.ZWK || 
				i == OSext.SKILL.DEC || 
				i == OSext.SKILL.ZUV) {
				return true;
			}
			break;
		case OSext.POS.DMI: 
			if (i == OSext.SKILL.BAK || 
				i == OSext.SKILL.DEC || 
				i == OSext.SKILL.PAS || 
				i == OSext.SKILL.UEB) {
				return true;
			}
			break;
		case OSext.POS.MIT: 
			if (i == OSext.SKILL.BAK || 
				i == OSext.SKILL.ZWK || 
				i == OSext.SKILL.PAS || 
				i == OSext.SKILL.UEB) {
				return true;
			}
			break;
		case OSext.POS.OMI: 
			if (i == OSext.SKILL.BAK || 
				i == OSext.SKILL.GES || 
				i == OSext.SKILL.PAS || 
				i == OSext.SKILL.UEB) {
				return true;
			}
			break;
		case OSext.POS.STU: 
			if (i == OSext.SKILL.SCH || 
				i == OSext.SKILL.KOB || 
				i == OSext.SKILL.ZWK || 
				i == OSext.SKILL.GES) {
				return true;
			}
			break;
		}
		return false;
	},

	/**
	 * Liefert {@code true} wenn der Skill (lt. Index) für die Position ein Nebenskill ist.
	 * @param pos Position eines Spielers
	 * @param i Index des Skills
	 */
	isNebenSkill : function (pos, i) {
		return !OSext.isPrimaerSkill(pos, i) && !OSext.isUnveraenderlicherSkill(i);
	},
	
	/**
	 * Liefert {@code true} wenn der Skill (lt. Index) ein unveränderlicher Skill ist.
	 * @param i Index des Skills
	 */
	isUnveraenderlicherSkill : function (i) {
		return (i == OSext.SKILL.WID || 
				i == OSext.SKILL.SEL || 
				i == OSext.SKILL.DIS || 
				i == OSext.SKILL.EIN);
	},

	/**
	 * Liefert {@code true} wenn der Skill (lt. Index) ein trainierbarer Skill ist.
	 * @param i Index des Skills
	 */
	isTrainingSkill : function (i) {
		return (i == OSext.SKILL.SCH || 
				i == OSext.SKILL.BAK ||
				i == OSext.SKILL.KOB ||
				i == OSext.SKILL.ZWK ||
				i == OSext.SKILL.DEC ||
				i == OSext.SKILL.GES ||
				i == OSext.SKILL.AGG ||
				i == OSext.SKILL.PAS ||
				i == OSext.SKILL.AUS ||
				i == OSext.SKILL.UEB ||
				i == OSext.SKILL.ZUV);
	},

	/**
	 * Gibt eine mit Tausenderpunkten formatierte Ganzzahl als {@code String} zurück. 
	 * @param param zu formatierende Zahl
	 */
	fmtTausend : function (param) {
		var number = Number(param),
			neg, mod, output, i;
		
		if (isNaN(number)) {
			return "";
		}
		neg = (number < 0);
		if (neg) {
			number = -number;
		}
		number = '' + number;
		if (number.length > 3) {
			mod = number.length % 3;
			output = (mod > 0 ? (number.substring(0, mod)) : '');
			for (i = 0 ; i < Math.floor(number.length / 3); i++) {
				if ((mod === 0) && (i === 0)) {
					output += number.substring(mod + 3 * i, mod + 3 * i + 3);
				} else {
					output += '.' + number.substring(mod + 3 * i, mod + 3 * i + 3);
				}
			}
			if (neg) {
				output = "-" + output;
			}
		} else {
			output = ((neg) ? "-" : "") + number;
		}
		return output;
	},
	
	/**
	 * Liefert von einer Javascript-Referenz die Id in den Klammern
	 * @param href
	 * @returns
	 */
	getLinkId : function (href) {
		if (href) { 
			if (href.search(/javascript:.+(\d+)/) != -1) {
				return Number(href.split("(")[1].split(")")[0]);
			}
			else if (href.search(/sp\.php.+s=(\d+)/) != -1) {
				return Number(href.split("s=")[1].split("&")[0]);
			}
			else if (href.search(/st\.php.+c=(\d+)/) != -1) {
				return Number(href.split("c=")[1].split("&")[0]);
			}
		}
		return Number(0);
	},
	
	/**
	 * Liefert einen {@code nsIMIMEInputStream} für die Verwendung bei POST-Requests.
	 * @param dataString Daten des POST-Request (Parameter)
	 */
	getPostData : function (dataString) {
		
		// POST method requests must wrap the encoded text in a MIME stream
		var stringStream = Components.classes["@mozilla.org/io/string-input-stream;1"]
				.createInstance(Components.interfaces.nsIStringInputStream),
		    mimeStream = Components.classes["@mozilla.org/network/mime-input-stream;1"]
		    	.createInstance(Components.interfaces.nsIMIMEInputStream);
		
		if ("data" in stringStream) { 
			// Gecko 1.9 or newer
			stringStream.data = dataString;
		} else {
			// 1.8 or older
			stringStream.setData(dataString, dataString.length);
		}
		
		mimeStream.addHeader("Content-Type", "application/x-www-form-urlencoded");
		mimeStream.addContentLength = true;
		mimeStream.setData(stringStream);
	
		// mimeStream is ready to be used as PostData argument in webNavigation.loadURI()
		return mimeStream;
	},
	
	/**
	 * Liefert einen Handle auf eine bestehende Datei. 
	 * Sofern diese nicht existiert wird null zurückgegeben.
	 * 
	 * @param filepath Pfad der Datei
	 * @returns nsILocalFile
	 */
	getFileFromPath : function (filepath) {

		var file = Components.classes["@mozilla.org/file/local;1"]
		    	.createInstance(Components.interfaces.nsILocalFile);

		if (filepath) {
			try {
				file.initWithPath(filepath);
				if (file.exists()) {
					return file;
				}
			} catch (e) {}
		}
		return null;
	},
	
	/**
	 * Öffnet einen Datei-Auswahl-Dialog und liefert den Handle auf eine neue Datei 
	 * im ausgewählten Verzeichnis.
	 * 
	 * @param filename Der Name der neuen Datei
	 * @param title Der Titel des Datei-Auswahl-Dialogs
	 * @returns nsILocalFile
	 */
	getNewFile : function (filename, title) {
		
		var nsIFilePicker = Components.interfaces.nsIFilePicker,
			filepicker = Components.classes["@mozilla.org/filepicker;1"]
				.createInstance(nsIFilePicker),
			file = Components.classes["@mozilla.org/file/local;1"]
				.createInstance(Components.interfaces.nsILocalFile),
		    retcode, fsplit = filename.split("."), nr = 1;
		
		filepicker.init(window, title, nsIFilePicker.modeGetFolder);
		retcode = filepicker.show();
		if (retcode == nsIFilePicker.returnOK || retcode == nsIFilePicker.returnReplace) {
			if (filepicker.file) {
				do {
					file.initWithPath(filepicker.file.path);
					file.append(fsplit[0] + (nr++) + "." + fsplit[fsplit.length - 1]);
					if (nr > 9) {
						return null;
					}
				} while (file.exists());
				return file;
			}
		}
		return null; 
	},

	/**
	 * Liefert den Inhalt einer Datei, welche über einen URI angegeben wird.
	 * 
	 * @param uri URI auf die Datei
	 * @return den Dateiinhalt
	 */
	getFileContent : function (uri) {
		
	    var ioService = Components.classes["@mozilla.org/network/io-service;1"].
	    		createInstance(Components.interfaces.nsIIOService),
	    	scriptableStream = Components.classes["@mozilla.org/scriptableinputstream;1"].
	    		createInstance(Components.interfaces.nsIScriptableInputStream),
	    	channel, input, text;
	
	    channel = ioService.newChannel2(uri, null, null, null, null, null, null, null);
	    input = channel.open(); 
	    scriptableStream.init(input);
	
	    text = scriptableStream.read(input.available());
	    scriptableStream.close();
	    input.close();
	    return text;
	}	
};

var OSext = new OSextCommons();
