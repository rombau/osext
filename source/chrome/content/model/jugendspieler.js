/**
 * Klasse für Jugendspieler
 * @constructor
 */
OSext.Jugendspieler = function () {

	OSext.Spieler.call(this);
	
	this.talent = null;

	/**
	 * Der wievielte Spieler des Jahrgangs.
	 */
	this.nr = null;
	
	/**
	 * Aufwertungen am letzten Zat.
	 */
	this.aufwertungen = 0;

	/** 
	 * Felder für Bilanz
	 */
	this.foerderung = null;
	this.kaderzats = null;
	this.mwzuwachs = null;
	this.gesamtaufwertungen = null;

};

OSext.Jugendspieler.prototype = new OSext.Spieler(); 
OSext.Jugendspieler.prototype.contructor = OSext.Jugendspieler; 

/**
 * Liefert den Jugendspieler mit dem angegebenem Alter. 
 * Anhand der bisherigen Aufwertungen werden die Skills hoch- bzw. zurückgerechnet.
 * @param {OSext.Termin} termin Anzahl der bisherigen Zats als Jugendspieler
 * @param {Number} alter für die Prognose (19 = max.)
 * @return Jugendspieler (oder this)
 */
OSext.Jugendspieler.prototype.getSpieler = function (termin, alter, saisonpause) {
	
	var s, spieler = new OSext.Jugendspieler(), change,
		
		aktuellesalter = this.alter - (saisonpause ? 1 : 0),  
	
		jugendzats = (function () {
			
			if (aktuellesalter < OSext.MIN_JUGEND_ALTER) {
				return 0; // neuer Jugendspieler 
			}
			
			return (aktuellesalter - OSext.MIN_JUGEND_ALTER) * OSext.ZATS_PRO_SAISON + termin.zat;
			
		})(), 
			
		prognosezats = (function () {
		
			var saison = termin.saison + (alter - aktuellesalter),
				wunschtermin = new OSext.Termin(saison, 1);

			if (alter > OSext.MAX_JUGEND_ALTER) {
				wunschtermin.subtractZats(2);
			}
			
			return wunschtermin.getZats() - termin.getZats();

		})();
	
	spieler.id = this.id;
	spieler.pos = this.pos;
	spieler.land = this.land; 
	spieler.uefa = this.uefa; 
	spieler.talent = this.talent;
	spieler.nr = this.nr;
	spieler.aufwertungen = this.aufwertungen;
	
	spieler.alter = alter > OSext.MAX_JUGEND_ALTER ? OSext.MAX_JUGEND_ALTER : alter;

	spieler.gesamtaufwertungen = this.gesamtaufwertungen;
	for (s = 0; s < this.skills.length; s ++) {
		if (!OSext.isUnveraenderlicherSkill(s)) {
			change = jugendzats ? this.skills[s] * prognosezats / jugendzats : 0;
			spieler.skills[s] = OSext.limitTo99(this.skills[s] + Math.floor(change));
			spieler.gesamtaufwertungen += change;
		} else {
			spieler.skills[s] = this.skills[s];
		}
	}

	spieler.mw = spieler.getMarktwert();
	
	spieler.gesamtaufwertungen = Math.floor(spieler.gesamtaufwertungen);
	spieler.foerderung = this.foerderung + Math.floor(jugendzats ? prognosezats / jugendzats : 0);
	spieler.kaderzats = this.kaderzats + prognosezats;
	spieler.mwzuwachs = this.mwzuwachs + (spieler.mw - this.mw);

	return spieler;
};

/**
 * Ermittelt die bestmögliche Position des Jugendspielers.
 * Diese wird zwischengespeichert.
 * @returns Position
 */
OSext.Jugendspieler.prototype.getPos = function () {
	
	var posNew, optiNew, p, optiTop = 0;
	
	if (!this.pos) {
		for (p in OSext.POS) {
			if (OSext.POS.hasOwnProperty(p)) {
				if (OSext.POS[p] != OSext.POS.TOR) {
					optiNew = this.getOpti(OSext.POS[p]);
					if (optiNew > optiTop) {
						optiTop = optiNew;
						posNew = OSext.POS[p];
					}
				}
			}
		}
		if (!posNew) {
			// neu generierter Jugi immer ABW
			this.pos = OSext.POS.ABW;
			this.opti = 0;
		} else {
			this.pos = posNew;
			this.opti = Number(optiTop.toFixed(2));
		}
	}
	
	return this.pos;
};

/**
 * Liefert den Marktwertzuwachs pro Zat des Spielers. 
 * Der Wert wird für die Ausgabe formatiert.
 * @return Marktwertzuwachs pro Zat
 */		
OSext.Jugendspieler.prototype.getMarktwertbilanz = function () {
	var ret = 0;
	if (this.kaderzats && this.kaderzats > 0) {
		ret = OSext.fmtTausend(Math.round((this.mwzuwachs - (this.foerderung || 0) * this.kaderzats) / this.kaderzats)); 
	} 
	return ret;
};

/**
 * Liefert ein Objekt mit Informationen zur Marktwertentwicklung des Spielers. 
 * @return Key/Value-Objekt
 */		
OSext.Jugendspieler.prototype.getMarktwertbilanzTooltip = function () {
	
	return {
		"Zats": (this.kaderzats || 0),
		"MW-Zuwachs": OSext.fmtTausend(Math.round(this.mwzuwachs)),
		"Jugendförderung": OSext.fmtTausend(-Math.round((this.foerderung || 0) * (this.kaderzats || 0)))
	};
};

/**
 * Liefert die durchschnittliche Aufertungsanzahl pro Zat
 * Der Wert wird für die Ausgabe formatiert.
 * @return durchschnittliche Aufertungsanzahl
 */		
OSext.Jugendspieler.prototype.getAufwertungsbilanz = function () {
	var ret = 0;
	if (this.kaderzats && this.kaderzats > 0) {
		ret = (this.gesamtaufwertungen / this.kaderzats); 
	} 
	return ret.toFixed(3);
};

/**
 * Liefert ein Objekt mit Informationen zu den bisherigen Aufertungen
 * @return Key/Value-Objekt
 */		
OSext.Jugendspieler.prototype.getAufwertungsbilanzTooltip = function () {

	return {
		"Gesamtaufwertungen": (this.gesamtaufwertungen || 0),
		"Jahresschnitt": (this.kaderzats && this.kaderzats > 0) ? Math.round(this.gesamtaufwertungen / this.kaderzats * OSext.ZATS_PRO_SAISON) : "0"
	};
};


