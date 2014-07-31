/**
 * Klasse für einen Spieltag
 * Der enthaltene {@link OSext.Termin} kann mit Saison und Zat 
 * initialisiert werden.
 * @constructor
 */
OSext.Spieltag = function (saison, zat) {
	
	/**
	 * Der {@link OSext.Termin} des Spieltags wird über den Konstruktor 
	 * mit Saison und Zat initialisiert.
	 */
	this.termin = new OSext.Termin(saison, zat);

	/**
	 * {@ OSext.Team}zustand nach dem Spieltag.
	 */
	this.team = null;

	/**
	 * {@link OSext.Team}zustand des Gegners nach dem Spieltag.
	 */
	this.gegner = null;

	/**
	 * {@link OSext.Stadion} nach dem Spieltag. 
	 * Wird für die Berechnung des Stadionennahmen herangezogen.
	 */
	this.stadion = null;
	
	this.datum = null;
	this.spielart = null;
	this.ort = null;
	this.zuseher = null;
	this.eintritt = null;
	this.stadioneinnahmen = null;
	this.stadionkosten = null;
	this.siegpraemie = null;

	// Keine Punkt und Torprämie ab Saison 5 
	this.punktpraemie = null;
	this.torpraemie = null;
	
	this.tvgelder = null;
	this.fanartikel = null;
	this.grundpraemie = null;
	this.spielergehaelter = null;
	this.trainergehaelter = null;
	this.jugend = null;
	this.physio = null;
	this.summe = null;
	this.leihen = null;

	this.saldo = 0;

	this.fssanteil = null;
	this.pokal = false;
	this.international = false;
	
	this.runde = null;
	
	this.gespielt = false;
	
};

OSext.Spieltag.prototype = {
	
	/**
	 * Berechnet Stadioneinnhamen und -ausgaben.
	 * 
	 * @param {OSext.Ansicht} saisonansicht
	 * @param {Object} eintritte in der Form {@code {liga:36,pokal:42,international:59}}
	 */
	calculateStadioneinnahmen : function (ansicht, eintritte) {
		
		if (!this.stadion) {
			return;
		}
		
		if (this.gegner && this.gegner.id && this.spielart == OSext.SPIELART.LIGA) {
			if (this.ort == OSext.SPIELORT.HEIM) {
				this.eintritt = ansicht.saison.eintritt;
				this.stadioneinnahmen = this.stadion.getEinnahmen(this.eintritt, ansicht.saison.auslastung);
				this.stadionkosten = -this.stadion.getKosten(ansicht.saison.auslastung);
				return;
			}
		}
		else if (this.gegner && this.gegner.id && this.spielart == OSext.SPIELART.POKAL) {
			this.eintritt = eintritte.pokal;
			this.stadioneinnahmen = Math.round(this.stadion.getEinnahmen(this.eintritt, ansicht.saison.auslastung) / 2);
			this.stadionkosten = -Math.round(this.stadion.getKosten(ansicht.saison.auslastung) / 2);
			return;
		}			
		else if (this.international && 
				(this.spielart == OSext.SPIELART.OSC || this.spielart == OSext.SPIELART.OSCQ || 
				  this.spielart == OSext.SPIELART.OSE || this.spielart == OSext.SPIELART.OSEQ)) {
			if (this.ort == OSext.SPIELORT.HEIM) {
				this.eintritt = eintritte.international;
				this.stadioneinnahmen = this.stadion.getEinnahmen(this.eintritt, ansicht.saison.auslastung);
				this.stadionkosten = -this.stadion.getKosten(ansicht.saison.auslastung);
				return;
			}
		}
		else if (this.spielart == OSext.SPIELART.FSS) {
			this.stadioneinnahmen = OSext.FSS_GESAMT_BETRAG * this.fssanteil / 100;
			return;
		}
		else {
			this.stadioneinnahmen = OSext.FSS_GESAMT_BETRAG / 2;
		}
	},

	/**
	 * Berechnet die Prämien.
	 * 
	 * @param {Number} platzierung
	 * @param {Number} liga
	 * @param {Number} ligagroesse
	 */
	calculatePraemien : function (platzierung, liga, ligagroesse) {
		
		if ((this.spielart == OSext.SPIELART.LIGA && this.ort == OSext.SPIELORT.HEIM) || 
				this.termin.zat == OSext.ZATS_PRO_SAISON) {
			
			if (ligagroesse == 10) {
				platzierung = platzierung * 2 - 1;
			}
			
			this.tvgelder = Math.round(OSext.TVGELDER[platzierung - 1] * OSext.PRAEMIENFAKTOR[liga - 1]); 
			this.fanartikel = Math.round(OSext.FANARTIKEL[platzierung - 1] * OSext.PRAEMIENFAKTOR[liga - 1]);
			
			if (this.termin.zat == OSext.ZATS_PRO_SAISON) {
				this.tvgelder *= 2; 
				this.fanartikel *= 2;
			}
		}
	},

	/**
	 * Liefert die Summe aller Einnahmen und -ausgaben des Spieltags.
	 * 
	 * @return {Number}
	 */
	getSumme : function () {

		return (this.stadioneinnahmen || 0) +
			(this.stadionkosten || 0) +
			(this.punktpraemie || 0) +
			(this.torpraemie || 0) +
			(this.siegpraemie || 0) +
			(this.tvgelder || 0) +
			(this.fanartikel || 0) +
			(this.grundpraemie || 0) +
			(this.spielergehaelter || 0) +
			(this.trainergehaelter || 0) +
			(this.jugend || 0) +
			(this.physio || 0) +
			(this.leihen || 0) +
			(this.blitz || 0);
	},
	
	/**
	 * Liefert die Report-Adresse zum Spieltag auf Basis von {@code termin}, {@code team} und {@code gegner}.
	 * 
	 * @return Report-Adresse als String
	 */		
	getReport : function () {
		
		var heimId, auswId;
		
		if (!this.team || !this.team.id || 
			!this.gegner || !this.gegner.id || 
			!this.termin.saison || !this.termin.zat) {
			return "";
		}
		
		if (this.ort == OSext.SPIELORT.HEIM) {
			heimId = this.team.id;
			auswId = this.gegner.id;
		} else if (this.ort == OSext.SPIELORT.AUSWAERTS) {
			heimId = this.gegner.id;
			auswId = this.team.id;
		} else {
			return "";
		}
		
		return "rep/saison/" + this.termin.saison + "/" + this.termin.zat + "/" + heimId + "-" + auswId;		
	},
	
	/**
	 * Liefert den Statustext zum Saldo.
	 */
	getSaldoStatus : function () {
		
		var key, val, info = {}, 
			summendifferenz = (this.summe - this.getSumme()) || 0;
		
		if (summendifferenz > 0) {
			if (this.spielart == OSext.SPIELART.POKAL) {
				this.pokalpraemie = 100000 * Math.floor(summendifferenz / 100000);
			} 
		}

		if (this.zuseher) {
			info.Zuschauer = OSext.fmtTausend(this.zuseher || 0);
		}
		if (this.eintritt) {
			info.Eintritt = OSext.fmtTausend(this.eintritt || 0);
		}
		if (this.stadioneinnahmen) {
			key = (this.stadioneinnahmen && this.stadionkosten ? "Stadion" : "Friendly"); 
			info[key] = OSext.fmtTausend((this.stadioneinnahmen || 0) + (this.stadionkosten || 0));
		}
		if (this.grundpraemie || this.punktpraemie || this.torpraemie) {
			info["Alte Prämien"] = OSext.fmtTausend(
					(this.punktpraemie || 0) + (this.torpraemie || 0) + (this.grundpraemie || 0));
		}
		if (this.pokalpraemie) {
			info["Pokalprämie"] = OSext.fmtTausend(this.pokalpraemie || 0);
		}
		if (this.siegpraemie) {
			info["Siegprämie"] = OSext.fmtTausend(this.siegpraemie || 0);
		}
		if (this.tvgelder) {
			info.Fernsehgelder = OSext.fmtTausend(this.tvgelder || 0);
		}
		if (this.fanartikel) {
			info.Fanartikel = OSext.fmtTausend(this.fanartikel || 0);
		}
		if (this.spielergehaelter) {
			info.Spieler = OSext.fmtTausend(this.spielergehaelter || 0);
		}
		if (this.trainergehaelter) {
			info.Trainer = OSext.fmtTausend(this.trainergehaelter || 0);
		}
		if (this.leihen) {
			info.Leihen = OSext.fmtTausend(this.leihen || 0);
		}
		if (this.jugend) {
			info.Jugend = OSext.fmtTausend(this.jugend || 0);
		}
		if (this.blitz) {
			info.Blitz = OSext.fmtTausend(this.blitz || 0);
		}
		if (this.physio) {
			info.Physio = OSext.fmtTausend(this.physio || 0);
		}
		return info;		
	}
};
