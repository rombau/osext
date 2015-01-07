/**
 * Klasse für Kaderspieler
 * @constructor
 */
OSext.Kaderspieler = function () {

	OSext.Spieler.call(this);
	
	this.name = null;
	this.herkunft = null;
	this.blitzzat = 0;
	
	this.aufstellung = null;
	this.moral = null; 
	this.fitness = null;
	this.verletzung = null;
	this.status = null;
	this.tstatus = null; 
	this.tsperre = null;
	this.vertrag = null; 
	this.gehalt = null; 
	
	/**
	 * Blitzwert; dieser wird einmalig ermittelt
	 */
	this.blitzwert = null;

	/**
	 * Leihdaten z.B. {gebuehr: 243221, dauer: 34, von: { id: 17, name: "FC Bleiburg"}, an: { id: 19, name: "FC Cork"} }
	 */
	this.leihdaten = null;

	/**
	 * Liste der Sperren z.B. [{art: OSext.SPIELART.LIGA, dauer: 1},...]
	 */
	this.sperren = null;
	
	/**
	 * Trainingseinstellungen des Spielers für den vergangenen und den nächsten Zat
	 */
	this.training = {
		aktuell: new OSext.Training(this), 
		plan: new OSext.Training(this)
	};

	/**
	 * Anzahl der FUQ- und ERF-Aufwertungen in den vergangenen 72 Zats.
	 */
	this.fuqprosaison = 0;
	this.erfprosaison = 0;
	
	/** 
	 * Marktwert-Bilanz
	 */
	this.kaderzats = null;
	this.mwzuwachs = null;
	this.trainingskosten = null;
	this.gehaelter = null;

	/** 
	 * Trainingsbilanz
	 */
	this.trainingszats = null;
	this.sollaufwertungen = null;
	this.sollaufwertungenproz = null;
	this.istaufwertungen = null;
	this.istaufwertungenproz = null;

};

OSext.Kaderspieler.prototype = new OSext.Spieler(); 
OSext.Kaderspieler.prototype.contructor = OSext.Kaderspieler; 

/**
 * Liefert den Kaderspieler zum Ende der übergebenen Spieltage. 
 * 
 * @param {Array} spieltage Liste mit den zukünftigen Spieltagen für die Prognose
 * @param {OSext.Preferences} prefs Einstellungen
 * 
 * @return neuer Kaderspieler (oder this)
 */
OSext.Kaderspieler.prototype.getSpieler = function (spieltage, prefs) {
	
	var s, spieler = new OSext.Kaderspieler(), 
		genesung = spieltage.length * (prefs.isPhysio() ? 2 : 1),
		
		summen = (function () {
			var summen = {};
			summen.abrechnungen = 0;
			for (s = 0; s < spieltage.length; s++) {
				summen[spieltage[s].spielart] = summen[spieltage[s].spielart] || 0;
				summen[spieltage[s].spielart]++;
				if (spieltage[s].termin.zat % OSext.ZATS_PRO_MONAT === 0) {
					summen.abrechnungen++;
				}
			}
			return summen;
		})();
	
	spieler.id = this.id;
	spieler.pos = this.pos;
	spieler.land = this.land; 
	spieler.uefa = this.uefa; 
	spieler.name = this.name;
	spieler.herkunft = this.herkunft;
	spieler.blitzzat = this.blitzzat;
	
	spieler.aufstellung = "";
	spieler.moral = ""; 
	spieler.fitness = "";
	
	spieler.alter = this.alter;
	if (spieltage[spieltage.length - 1].termin.saison >= spieltage[0].termin.saison) {
		spieler.alter += (spieltage[spieltage.length - 1].termin.saison - spieltage[0].termin.saison);
	}
	
	spieler.status = this.status;
	if (spieler.blitzzat && spieltage[spieltage.length - 1].termin.getZats() > spieler.blitzzat) {
		spieler.status = OSext.STATUS.INAKTIV;
	}

	spieler.leihdaten = JSON.parse(JSON.stringify(this.leihdaten));
	spieler.tstatus = this.tstatus; 
	if (spieler.leihdaten) {
		spieler.leihdaten.dauer -= spieltage.length;
		if (spieler.leihdaten.dauer <= 0) {
			spieler.leihdaten = null;
			spieler.tstatus = null;
			if (spieler.status == OSext.STATUS.VERLIEHEN) {
				spieler.status = OSext.STATUS.AKTIV;
			} else {
				spieler.status = OSext.STATUS.INAKTIV;
			}
		}
	}

	spieler.tsperre = this.tsperre;
	if (spieler.tsperre) {
		if (spieler.tsperre < spieltage.length) {
			spieler.tsperre = 0;
		} else {
			spieler.tsperre -= spieltage.length;
		}		
		if (spieler.tsperre == 0) {
			spieler.tsperre = null;
		}
	}
	
	spieler.verletzung = this.verletzung;
	if (spieler.verletzung) {
		if (spieler.verletzung < genesung) {
			spieler.verletzung = null;
		} else {
			spieler.verletzung -= genesung;
		}		
	}

	if (this.sperren) {
		spieler.sperren = this.getForcastedSperren(summen);
	}
	
	if (!prefs.getMonateNeuVertrag() || summen.abrechnungen < this.vertrag) {
		spieler.vertrag = this.vertrag - summen.abrechnungen;
	} else {
		spieler.vertrag = prefs.getMonateNeuVertrag() - (summen.abrechnungen - this.vertrag);
	}
	spieler.vertrag = spieler.vertrag > 0 ? spieler.vertrag : 0;
	
	spieler.gehalt = this.status == OSext.STATUS.AKTIV ? this.gehalt : 0; 

	if (this.status == OSext.STATUS.AKTIV &&
		   ((this.training.plan.skillidx >= 0 && this.training.plan.wahrscheinlichkeit) || 
			(this.training.aktuell.skillidx >= 0 && this.training.aktuell.wahrscheinlichkeit))) {
		spieler.skills = this.getForcastedSkills(spieler.pos, Math.max(0, spieltage.length - Math.round((this.verletzung || 0) / (prefs.isPhysio() ? 2 : 1))), prefs);
		summen.trainingszats = spieltage.length;
		summen.trainingsaufwertungen = OSext.getListSum(spieler.skills) - OSext.getListSum(this.skills);
	} else {
		for (s = 0; s < this.skills.length; s++) {
			spieler.skills[s] = this.skills[s];
		}					
		summen.trainingszats = 0;
		summen.trainingsaufwertungen = 0;
	}
	
	spieler.skills[OSext.SKILL.FUQ] = OSext.limitTo99(this.skills[OSext.SKILL.FUQ] + Math.floor(this.fuqprosaison * spieltage.length / OSext.ZATS_PRO_SAISON));
	spieler.skills[OSext.SKILL.ERF] = OSext.limitTo99(this.skills[OSext.SKILL.ERF] + Math.floor(this.erfprosaison * spieltage.length / OSext.ZATS_PRO_SAISON));

	if (spieler.alter > this.alter && 
		((spieler.pos == OSext.POS.TOR && spieler.alter > 34) || 
		 (spieler.pos != OSext.POS.TOR && spieler.alter > 32))) {
		this.forecastAbwertung(spieler, prefs);
	}

	spieler.mw = spieler.getMarktwert();
	spieler.blitzwert = spieler.getBlitzwert();

	// FIXME Gehälter und Trainingskosten von verliehenen Spielern 
	
	if (spieler.status == OSext.STATUS.INAKTIV) {
		spieler.gehalt = 0;
		spieler.skillschnitt = 0;
		spieler.opti = 0;
	} else {
		spieler.kaderzats = (this.kaderzats + spieltage.length) || 0;
		spieler.mwzuwachs = this.mwzuwachs + (spieler.mw - this.mw);
		spieler.trainingskosten = this.trainingskosten + (this.kaderzats ? this.trainingskosten * (spieltage.length / this.kaderzats) : 0);
		
		if (!prefs.getMonateNeuVertrag() || summen.abrechnungen < this.vertrag) {
			spieler.gehaelter = this.gehaelter + (summen.abrechnungen * spieler.gehalt);
		} else {
			spieler.gehaelter = this.gehaelter + ((this.vertrag - 1) * spieler.gehalt) + 
				((summen.abrechnungen - this.vertrag + 1) * this["gehalt" + prefs.getMonateNeuVertrag()]);
			spieler.gehalt = this["gehalt" + prefs.getMonateNeuVertrag()];
		}
		
		spieler.trainingszats = (this.trainingszats + summen.trainingszats) || 0;
		spieler.sollaufwertungen = (this.sollaufwertungen + summen.trainingsaufwertungen) || 0;
		spieler.sollaufwertungenproz = spieler.trainingszats ? (spieler.sollaufwertungen / spieler.trainingszats * 100) : this.sollaufwertungenproz;
		spieler.istaufwertungen = (this.istaufwertungen + summen.trainingsaufwertungen) || 0;
		spieler.istaufwertungenproz = spieler.trainingszats ? (spieler.istaufwertungen / spieler.trainingszats * 100) : this.istaufwertungenproz;
		
	}
	
	return spieler;
};

/**
 * Liefert die prognostizierten (reduzierten) Sperren.
 * 
 * @param summen Anzahl Spieltage der unterschiedlichen Arten
 * @returns Liste mit Sperren oder {@code null}
 */
OSext.Kaderspieler.prototype.getForcastedSperren = function (summen) {

	var s, sperren = JSON.parse(JSON.stringify(this.sperren)),
		gesamt = 0;
	
	for (s = 0; s < sperren.length; s++) {
		switch (sperren[s].art) {
		case OSext.SPIELART.LIGA:
			sperren[s].dauer -= summen[OSext.SPIELART.LIGA] || 0;
			break;
		case OSext.SPIELART.POKAL:
			sperren[s].dauer -= summen[OSext.SPIELART.POKAL] || 0;
			break;
		case OSext.SPIELART.INT:
			sperren[s].dauer -= (summen[OSext.SPIELART.OSEQ] || 0 + 
								 summen[OSext.SPIELART.OSE] || 0 + 
								 summen[OSext.SPIELART.OSCQ] || 0 + 
								 summen[OSext.SPIELART.OSC] || 0);
			break;
		}
		if (sperren[s].dauer <= 0) {
			sperren[s].dauer = 0;
			sperren.splice(s--, 1);
		} else {
			gesamt += sperren[s].dauer;
		}
	}

	if (gesamt === 0) {
		return null;
	}
	
	return sperren;
};

// TODO Hohe Aufwertungswahrscheinlichkeit sollte bei langer Vorschau etwas sinken

/**
 * Liefert die prognostizierten Skills anhand der Trainingseinstellungen.
 * 
 * @param {Number} spieltage
 * @param {OSext.Preferences} prefs
 * @returns Liste der Skills
 */
OSext.Kaderspieler.prototype.getForcastedSkills = function (pos, spieltage, prefs) {
	
	var skills = [], s,
		sortedskills = [], ss = 0,
		skillidx, wahrscheinlichkeit,

		altersabzug = this.alter - prefs.getAlterTrainingslimit(),
		
		pslimit = prefs.getMaxPrimaerskill() - altersabzug, 
		nslimit = prefs.getMaxNebenskill() - altersabzug,
				
		sortSkills = function (skill1, skill2) {
			if (skill1.ps && !skill2.ps) {
				return -1;
			} else if (!skill1.ps && skill2.ps) {
				return 1;
			} else {
				return (skill2.value - skill1.value);
			}
		},
	
		getNextSortedSkill = function (idx) {
			for (s = 0; s < sortedskills.length; s++) {
				if (sortedskills[s].idx == idx) {
					if (sortedskills[0].ps && !sortedskills[s].ps) {
						for (ss = 0; ss < s; ss++) {
							if (sortedskills[ss] && sortedskills[ss].ps) {
								sortedskills.splice(ss--, 1);
							}
						}
					}
					sortedskills.splice(s, 1);
					break;
				}
			}
			sortedskills.sort(sortSkills);
			return sortedskills[0];
		},
	
		forecastSkill = function (skillidx, wahrscheinlichkeit, tage) {
	
			var aufwertungen = Math.round(tage * wahrscheinlichkeit / 100), 
				limit = OSext.isPrimaerSkill(pos, skillidx) ? pslimit : nslimit, 
				value = skills[skillidx], rest, nextskill;

			if (skills[skillidx] <= limit) {
				if ((skills[skillidx] + aufwertungen) <= limit) {
					skills[skillidx] += aufwertungen;
				} else {
					rest = aufwertungen - (limit - skills[skillidx]);
					skills[skillidx] = limit;
					if (rest) {
						nextskill = { idx: skillidx };
						do {
							nextskill = getNextSortedSkill(nextskill.idx);
						} while (nextskill && nextskill.value > (nextskill.ps ? pslimit : nslimit));
						if (nextskill) {
							forecastSkill(nextskill.idx, 
									OSext.limitTo99(wahrscheinlichkeit * (value / nextskill.value)), 
									Math.floor(rest / (wahrscheinlichkeit / 100)));
						}
					}
				}
			} else {
				skills[skillidx] += aufwertungen;
				skills[skillidx] = OSext.limitTo99(skills[skillidx]);
			}
		};
		
	for (s = 0; s < this.skills.length; s++) {
		skills[s] = this.skills[s];
		if (OSext.isTrainingSkill(s)) {
			sortedskills[ss++] = {
				idx : s,
				value : this.skills[s],
				ps : OSext.isPrimaerSkill(pos, s)
			};
		}
	}					
	sortedskills.sort(sortSkills);
	
	if (this.training.plan.skillidx >= 0 && this.training.plan.wahrscheinlichkeit) {
	
		OSext.Log.debug(["forecastSkill " + this.name, skills, this.training.plan.skillidx, "/", 
		     	this.training.plan.wahrscheinlichkeit, "/", Math.floor(spieltage / 2) + (spieltage % 2)]);
		forecastSkill(this.training.plan.skillidx, 
				this.training.plan.wahrscheinlichkeit, Math.floor(spieltage / 2) + (spieltage % 2));
		
		skillidx = this.training.aktuell.skillidx >= 0 ? this.training.aktuell.skillidx : this.training.plan.skillidx;
		wahrscheinlichkeit = this.training.aktuell.wahrscheinlichkeit || this.training.plan.wahrscheinlichkeit;
		
		if (skillidx == this.training.plan.skillidx) {
			wahrscheinlichkeit = this.training.aktuell.wahrscheinlichkeit * (this.skills[skillidx] / skills[skillidx]);
			wahrscheinlichkeit = OSext.limitTo99(wahrscheinlichkeit);
		}
	
		OSext.Log.debug(["forecastSkill " + this.name, skills, skillidx, "/",
		     	wahrscheinlichkeit, "/", Math.floor(spieltage / 2) + (spieltage % 2)]);
		forecastSkill(skillidx, wahrscheinlichkeit, Math.floor(spieltage / 2));
	}

	return skills;
};

/**
 * Berechnet die prognostizierten Skills nach einer Abwertung.
 * 
 * @param {OSext.Kaderspieler} spieler
 * @param {OSext.Preferences} prefs
 */
OSext.Kaderspieler.prototype.forecastAbwertung = function (spieler, prefs) {

	var abwertungsjahre = spieler.alter - (spieler.pos == OSext.POS.TOR ? 35 : 33),
		skillgewichtung = [1, 0.5, 1, 1, 1, 2, 0, 0, 2, 0.5, 1, 0, 2, 1, 0, 1, 1],
		abwertungenproskill = ([17, 34, 51, 68, 85][abwertungsjahre]	+ 34 - (prefs.getAbwertungspiele() - 18)) / 15,
		i, rest = 0;
	
	for (i = 0; i < skillgewichtung.length; i++) {
		spieler.skills[i] -= Math.round(abwertungenproskill * skillgewichtung[i]);
		rest += ((abwertungenproskill * skillgewichtung[i]) - 
				Math.round(abwertungenproskill * skillgewichtung[i]));
	}	
	
	rest = Math.round(rest);
	while (rest > 0) {
		i = Math.round((17 * Math.random()));
		if (skillgewichtung[i] > 0) {
			spieler.skills[i]--;
			rest--;
		}
	}
};

/**
 * Liefert den Blitzwert des Spielers. Bei verliehenen Spielern oder mit
 * Transfersperre, wird der errechnete Wert negativ zurückgegeben; sonst
 * ein Wert >= 0.
 * Der Wert wird zwischengespeichert.
 * 
 * @return Blitzwert
 */
OSext.Kaderspieler.prototype.getBlitzwert = function () {
	
	var normal, gedeckelt;
	
	if (!this.blitzwert) {
		
		normal = Math.round(this.mw * 0.75) - (this.vertrag * this.gehalt); 
		gedeckelt = (this.alter - 12) * 640000 * 0.75;
		
		this.blitzwert = normal;
		if ((this.pos == OSext.POS.TOR && this.alter < 35) || this.alter < 33) {
			if (normal > gedeckelt) {
				this.blitzwert = gedeckelt;
			}
		}
		
		if (this.blitzwert > 0) {
			if (this.tsperre > 0 || this.status != OSext.STATUS.AKTIV) {
				this.blitzwert = -this.blitzwert;
			}
		} else {
			this.blitzwert = 0;
		}
	}
	return this.blitzwert; 
};

/**
 * Liefert den Marktwertzuwachs pro Zat des Spielers. 
 * Der Wert wird für die Ausgabe formatiert.
 * @return Marktwertzuwachs pro Zat
 */		
OSext.Kaderspieler.prototype.getMarktwertbilanz = function () {
	var ret = 0;
	if (this.kaderzats && this.kaderzats > 0) {
		ret = OSext.fmtTausend(Math.round((this.mwzuwachs - (this.trainingskosten || 0) - (this.gehaelter || 0)) / this.kaderzats)); 
	} 
	return ret;
};

/**
 * Liefert ein Objekt mit Informationen zur Marktwertentwicklung des Spielers. 
 * @return Key/Value-Objekt
 */		
OSext.Kaderspieler.prototype.getMarktwertbilanzTooltip = function () {
	return {
		"Zats": (this.kaderzats || 0),
		"MW-Zuwachs": OSext.fmtTausend(Math.round(this.mwzuwachs)),
		"Trainingskosten": OSext.fmtTausend(-Math.round(this.trainingskosten)),
		"Gehälter": OSext.fmtTausend(-Math.round(this.gehaelter))
	};
};

/**
 * Liefert die durchschnittliche Trainingswahrscheinlichkeit (Ist/Soll) 
 * pro Traininigszat des Spielers. 
 * Der Wert wird für die Ausgabe formatiert.
 * @return Trainingswahrscheinlichkeit
 */		
OSext.Kaderspieler.prototype.getTrainingsbilanz = function () {
	var ret = 0;
	if (this.trainingszats && this.trainingszats > 0) {
		if (this.sollaufwertungenproz > 0) {
			ret = (Math.round(this.istaufwertungenproz / this.sollaufwertungenproz * 100) || 0) + "%";
		} else {
			ret = "100%";
		}
	} else {
		ret += "%";
	}
	return ret;
};

/**
 * Liefert ein Objekt mit Informationen zur Trainingswahrscheinlichkeit des Spielers. 
 * @return Key/Value-Objekt
 */		
OSext.Kaderspieler.prototype.getTrainingsbilanzTooltip = function () {
	return {
		"Trainings": (this.trainingszats || 0),
		"Aufwertungen": (this.istaufwertungen || 0) + 
			" (=" + (!this.istaufwertungenproz ? "0,00" : this.istaufwertungenproz.toFixed(2)) + "%)",
		"Soll-Aufwertungen": (this.sollaufwertungen || 0) + 
			" (=" + (!this.sollaufwertungenproz ? "0,00" : this.sollaufwertungenproz.toFixed(2)) + "%)"
	};
};

/**
 * Setzt die Sperrinformationen
 * @param sperren Text aus der Spalte 
 */
OSext.Kaderspieler.prototype.setSperren = function (sperren) {

	var sperrlist, art, s;
	
	if (sperren && sperren.length > 1) {
		sperrlist = sperren.split(" ");
		this.sperren = [];
		for (s = 0; s < sperrlist.length; s++) {
			if (sperrlist[s].indexOf("L") != -1) {
				art = OSext.SPIELART.LIGA;
			}
			else if (sperrlist[s].indexOf("P") != -1) {
				art = OSext.SPIELART.POKAL;
			}
			else if (sperrlist[s].indexOf("I") != -1) {
				art = OSext.SPIELART.INT;
			}
			else {
				art = null;
			}
			if (art) {
				this.sperren.push({ art: art, dauer: sperrlist[s].substring(0, 1)});
			}
		}
	}

};

/**
 * Liefert einen HTML-String mit je einem {@code <abbr>}-Tag je Sperre des Spielers.
 * Verwendung bei Update der Mannschaftsseite. 
 */		
OSext.Kaderspieler.prototype.getSperrenHTML = function () {
	var s, sperre, 
		artkurz, artlang, 
		ret = "";
	
	if (this.sperren) {
		for (s = 0; s < this.sperren.length; s++) {
			sperre = this.sperren[s];
			switch (sperre.art) {
			case OSext.SPIELART.LIGA:
				artkurz = "L";
				artlang = "Ligaspiele";
				break;
			case OSext.SPIELART.POKAL:
				artkurz = "P";
				artlang = "Pokalspiele";
				break;
			case OSext.SPIELART.INT:
				artkurz = "I";
				artlang = "Internationale Spiele";
				break;
			}
			if (s > 0) {
				ret += " ";
			}
			ret += "<abbr title=\"" + sperre.dauer + " " + artlang + "\">";
			ret += sperre.dauer + artkurz + "</abbr>";
		}
	}		
	return ret;
};

/**
 * Liefert die Sperren in ihrer Kurzform als Text.
 */
OSext.Kaderspieler.prototype.getSperrenText = function () {
	
	var s, sperre, ret = "";

	if (this.sperren) {
		for (s = 0; s < this.sperren.length; s++) {
			sperre = this.sperren[s];

			if (s > 0) {
				ret += " ";
			}
			ret += sperre.dauer;
			switch (sperre.art) {
			case OSext.SPIELART.LIGA:
				ret += "L";
				break;
			case OSext.SPIELART.POKAL:
				ret += "P";
				break;
			case OSext.SPIELART.INT:
				ret += "I";
				break;
			}
		}
	}
	return ret; 
};

/**
 * Liefert einen HTML-String mit einem {@code <abbr>}-Tag mit den Leihdaten des Spielers.
 * Verwendung bei Update der Mannschaftsseite. 
 */		
OSext.Kaderspieler.prototype.getLeihInfoHTML = function () {
	if (this.leihdaten) {
		return "<abbr title=\"Leihgabe von " + this.leihdaten.von.name + 
					" an " + this.leihdaten.an.name + 
					" für " + this.leihdaten.dauer + " ZATs\">L" + this.leihdaten.dauer + "</abbr>";
	} else if (this.tstatus == "L" && this.tsperre) {
		return "L" + this.tsperre;
	}
	return "";
};

