/**
 * Klasse für alle Anwendungsdaten
 * 
 * @constructor
 */
OSext.Data = function () {

	/**
	 * Liste mit den {@link OSext.Spieltag}en der aktuellen Saison.
	 * 
	 * Spieltag 0 ist für den letzten Zat der Vorsaison reserviert. Damit gilt für die aktuelle
	 * Saison eine direkte Index-Zat-Zuordnung. Spieltage weiterer Folgesaisonen werden bei Bedarf
	 * angehängt.
	 */
	this.saisonplan = this.createSaisonplan();

	/**
	 * Referenz auf aktuellen {@link OSext.Spieltag}.
	 */
	this.spieltag = null;

	/**
	 * Referenz auf aktuellen {@link OSext.Termin}.
	 */
	this.termin = null;

	/**
	 * Saisonpausenstatus; entspricht dem Zat 0 (nach Zat 72 und Saisonwechsel, aber vor Zat 1)
	 */
	this.saisonpause = false;

	/**
	 * Vor Zat 1 muss der letzte Bericht aus der Vorsaison geholt werden.
	 */
	this.vorsaison = false;

	/**
	 * Aktuelles {@link OSext.Team}. Eine Referenz wird im Saisonplan zum aktuellen Termin
	 * abgelegt.
	 */
	this.team = new OSext.Team();

	/**
	 * UI-Einstellungen ({@link OSext.Ansicht}). Enthält u.a. Termin-Auswahl und
	 * {@link OSext.Termin} für die Teamansicht.
	 */
	this.ansicht = new OSext.Ansicht(this);

	/**
	 * Erster gespeicherter {@link OSext.Termin} aus der Datenbank.
	 */
	this.mintermin = new OSext.Termin();

	/**
	 * Aktuelles {@link OSext.Stadion}. Eine Referenz wird im Saisonplan zum aktuellen Termin
	 * abgelegt.
	 */
	this.stadion = new OSext.Stadion();

	/**
	 * Zugehörige Liga (1, 2 oder 3)
	 */
	this.liga = null;

	/**
	 * Größe der zugehörigen Liga (10, 18 oder 20)
	 */
	this.ligagroesse = null;

	/**
	 * Aktueller Kontostand
	 */
	this.kontostand = null;

	/**
	 * Aktuelle Jugendförderung pro Jugendspieler
	 */
	this.jugendfoerderung = null;

	/**
	 * Aktuelle Eintrittspreise
	 */
	this.eintritt = {
		liga : 0,
		pokal : 0,
		international : 0
	};

	/**
	 * Referenz auf die Datenbankzugriffsschicht.
	 * Wird nur mit getDatabase() initialisiert.
	 */
	this.database = null;

	/**
	 * Initialisierungsstatus
	 */
	this.initialized = false;

	/**
	 * Liste der externen Teams.
	 */
	this.externalteams = [];

};

OSext.Data.prototype = {

	/**
	 * Gibt die Referenz auf die Datenbankzugriffschicht zurück. 
	 * Falls es noch keine gibt, wird eine neues Objekt erzeugt.
	 */
	getDatabase : function () {
		if (!this.database) {
			var prefs = new OSext.Preferences(),
				teamId = '' + this.team.id,
				dbpathObject = {};
			this.database = new OSext.Database({
				getDBPath : function () {
					var dbpath = prefs.getBranch().getCharPref("dbpath");
					if (dbpath.substr(0,1) == "{") {
						dbpathObject = JSON.parse(dbpath);
						return dbpathObject[teamId];
					}
					return dbpath;
				},
				setDBPath : function (path) {
					dbpathObject[teamId] = path;
					prefs.getBranch().setCharPref("dbpath", JSON.stringify(dbpathObject));
				}
			});
		}
		return this.database;
	},

	/**
	 * Initialisiert den aktuellen Zat von der Hauptseite; zu diesem Zeitpunkt ist noch keine Saison
	 * bekannt.
	 * 
	 * Vor Zat 1 ist Saisonpause (der aktuelle interne Zat ist 72 der Vorsaison).
	 * 
	 * @param zat
	 */
	setAktuellenZat : function (zat, saisonpause) {
		this.termin = new OSext.Termin(null, zat);
		if (saisonpause) {
			this.saisonpause = true;
		}
	},

	/**
	 * Gibt {@code true} zurück, wenn der Saisonplan zumindest einen verplanten Spieltag enthält.
	 * 
	 * @returns {Boolean}
	 */
	isSaisonplanValid : function () {

		var s, spielart;

		for (s = 1; s < this.saisonplan.length; s++) {
			spielart = this.saisonplan[s].spielart;
			if (spielart !== null && spielart != OSext.SPIELART.SPIELFREI) {
				return true;
			}
		}
		return false;
	},

	/**
	 * Gibt {@code true} zurück, wenn die Saison bereits läuft bzw. zumindest ein Spieltag gespielt
	 * wurde.
	 * 
	 * @returns {Boolean}
	 */
	isLaufendeSaison : function () {

		var s;

		for (s = 1; s < this.saisonplan.length; s++) {
			if (this.saisonplan[s].gespielt) {
				return true;
			}
		}
		return false;
	},

	/**
	 * Setzt die Aktuelle Saison und initialisiert den Saisonplan.
	 * 
	 * @param {Number} saison Die aktuelle Saison
	 */
	setAktuelleSaison : function (saison) {

		OSext.Log.info(["Aktuelle Saison:",saison]);

		for (var s = 1; s < this.saisonplan.length; s++) {
			if (s <= OSext.ZATS_PRO_SAISON) {
				this.saisonplan[s].termin.saison = saison;
			} else {
				this.saisonplan[s].termin.saison = saison + 1;
			}
		}
	},

	/**
	 * Setzt den aktuellen Spieltag.
	 * <p>
	 * Zusätzlich werden die Referenzen termin, und im aktuellen Spieltag die Referenzen team und
	 * stadion gesetzt.
	 * 
	 * @param {OSext.Spieltag} spieltag Der aktuell Spieltag
	 */
	setAktuellenSpieltag : function (spieltag) {

		if (spieltag instanceof OSext.Spieltag) {

			OSext.Log.info(["Aktueller Spieltag:",spieltag.termin.saison,"/",spieltag.termin.zat]);

			if (!this.saisonplan[1].termin.saison && spieltag.termin.saison) {
				this.setAktuelleSaison(spieltag.termin.saison);
			}

			this.spieltag = spieltag;

			this.termin = this.spieltag.termin;

			this.spieltag.team = this.team;
			this.spieltag.stadion = this.stadion;

			if (!this.ansicht.team.termin.saison) {
				this.ansicht.team.termin.saison = spieltag.termin.saison;
			}
			if (!this.ansicht.team.termin.zat) {
				this.ansicht.team.termin.zat = spieltag.termin.zat;
			}
		}
	},

	/**
	 * Liefert den Spieltag zum {@link OSext.Termin}. Liegt der Termin in der Vorsaison, oder nach
	 * der Folgesaison, wird {@code null} zurückgegeben.
	 * 
	 * @param {OSext.Termin} termin
	 * @return Spieltag (oder null)
	 */
	getSpieltag : function (termin) {

		var index = this.getSpieltagIndex(termin);

		if (index != -1) {
			return this.saisonplan[index];
		}
		return null;
	},

	/**
	 * Liefert den Spieltag-Index zum {@link OSext.Termin}. Liegt der Termin in der Vorsaison, oder
	 * nach der Folgesaison, wird {@code -1} zurückgegeben.
	 * 
	 * @param {OSext.Termin} termin
	 * @return Index (oder -1)
	 */
	getSpieltagIndex : function (termin) {

		if (termin instanceof OSext.Termin && termin.saison >= this.termin.saison && termin.saison <= this.termin.saison + (this.saisonpause ? 2 : 1)) {
			return (this.saisonpause ? 0 : this.termin.zat) + (termin.getZats() - this.termin.getZats());
		}
		OSext.Log.warn(["Spieltag-Index zu",termin,"nicht gefunden"]);
		return -1;
	},

	/**
	 * Erstellt den Saisonplan für die aktuelle und die Folgesaison.
	 */
	createSaisonplan : function () {

		if (!this.saisonplan) {
			this.saisonplan = [];
		}

		for (var s = 1; s <= OSext.ZATS_PRO_SAISON * 2; s++) {
			if (!this.saisonplan[s]) {
				if (s <= OSext.ZATS_PRO_SAISON) {
					this.saisonplan[s] = new OSext.Spieltag(null, s);
				} else {
					this.saisonplan[s] = new OSext.Spieltag(null, s - OSext.ZATS_PRO_SAISON);
				}
			}
		}

		return this.saisonplan;
	},

	/**
	 * Liefert den Saisonplan mit einer Saldoprognose anhand der Teamdaten und der Parameter in
	 * {@code this.ansicht}.
	 * 
	 * @return den aktualisierten {@code this.saisonplan}
	 */
	getSaisonplan : function () {

		var s, spieltag, saldo = this.kontostand;

		for (s = 1; s < this.saisonplan.length; s++) {

			spieltag = this.saisonplan[s];

			if (!spieltag.datum && spieltag.termin.getZats() > this.termin.getZats()) {

				// Stadioneinnahmen
				spieltag.calculateStadioneinnahmen(this.ansicht, this.eintritt);

				// Prämien
				if ((spieltag.gegner && spieltag.gegner.id && spieltag.spielart == OSext.SPIELART.LIGA && spieltag.ort == OSext.SPIELORT.HEIM) || spieltag.termin.zat == OSext.ZATS_PRO_SAISON) {
					spieltag.calculatePraemien(this.ansicht.saison.platzierung, this.liga, this.ligagroesse);
				}

				// Jugendförderung
				spieltag.jugend = -this.jugendfoerderung * this.team.getAnzahlJugendspieler(spieltag.termin);

				// Gehälter und Leihgebühren
				if (spieltag.termin.zat % OSext.ZATS_PRO_MONAT === 0) {
					spieltag.spielergehaelter = -this.getTeam(spieltag.termin).getSpielergehaelter();
					spieltag.trainergehaelter = -this.team.getTrainergehaelter();
					spieltag.leihen = this.getTeam(spieltag.termin).getLeihgebuehren();
				}

				// Blitzerlöse
				if ((spieltag.termin.zat + 1) % OSext.ZATS_PRO_MONAT === 0) {
					spieltag.blitz = this.getTeam(spieltag.termin).getBlitzerloese(spieltag.termin.getZats());
				}

				// Saldo
				spieltag.summe = spieltag.getSumme();
				saldo += spieltag.getSumme();
				spieltag.saldo = saldo;
			}
		}

		return this.saisonplan;
	},

	/**
	 * Liefert den Teamzustand zum {@link OSext.Termin}.
	 * 
	 * @param {OSext.Termin} termin
	 * @return {OSext.Team} oder aktuelles {@link this.team}
	 */
	getTeam : function (termin) {

		var spieltag, team = this.team, s, von, bis;

		if (termin instanceof OSext.Termin) {
			if (termin.getZats() != this.termin.getZats()) {
				spieltag = this.getSpieltag(termin);
				if (spieltag && spieltag.team) {
					team = spieltag.team;
				} else {
					team = new OSext.Team(this.team.id, this.team.name);
					if (spieltag) {
						spieltag.team = team;
					}
				}
				if (team.spieler.length === 0) {
					if (termin.getZats() < this.termin.getZats()) {
						team.spieler = this.getDatabase().getKaderspielerListe(termin);
					} else {
						von = this.getSpieltagIndex(this.termin) + 1;
						bis = this.getSpieltagIndex(termin) + 1;
						OSext.Log.debug(["Spielerprognose von",von,"bis",(bis - 1)]);
						if (von && bis) {
							for (s = this.team.spieler.length - 1; s >= 0; s--) {
								team.spieler[s] = this.team.spieler[s].getSpieler(this.saisonplan.slice(von, bis), OSext.Prefs);
							}
						} else {
							OSext.Log.warn("Ungültiger Prognosezeitraum");
						}
					}
				}
			}
		}
		return team;
	},

	/**
	 * Initialisiert das Model (v.a. Spieler) mit Daten aus der Datenbank, und speichert die aktuell
	 * extrahierten Werte.
	 */
	initAndSave : function () {

		// Gespielte Spieltage dieser Saison initialisieren
		var s, spieltage = this.getDatabase().getSpieltage(this.saisonplan[1].termin.saison);

		for (s = 0; s < spieltage.length; s++) {
			this.saisonplan[spieltage[s].termin.zat] = spieltage[s];
		}

		// Anischten einstellen
		this.ansicht.team.termin.saison = this.termin.saison;
		this.ansicht.team.termin.zat = this.termin.zat;
		this.ansicht.saison.platzierung = this.team.platzierung;
		this.ansicht.saison.eintritt = this.eintritt.liga;

		// Jugend-IDs ermitteln
		this.getDatabase().initJugendspielerIDs(this.team.jugend);

		// Einstellung der Kaderspieler ermitteln
		this.getDatabase().initKaderspielerZusatzwerte(this.team.spieler, this.termin);

		// Speichern
		try {

			this.getDatabase().sql.beginTransaction();

			this.getDatabase().saveTrainer(this.team.trainer, this.termin);
			this.getDatabase().saveKaderspieler(this.team.spieler, this.termin);
			this.getDatabase().saveJugendspieler(this.team.jugend, this.jugendfoerderung, this.termin);
			this.getDatabase().saveSpieltag(this.spieltag);
			this.getDatabase().saveStadion(this.stadion, this.termin);

			this.getDatabase().sql.commitTransaction();

		} catch (e) {

			this.getDatabase().sql.rollbackTransaction();
			throw e;
		}

		// Summen initialisieren (nach dem Speichern!)
		this.initSpielersummen();

		// Runden (Liga, Pokal, etc.) initialisieren
		this.initRunden();

		this.initialized = true;
	},

	initRunden : function () {

		var s, spieltag, rd, int = true, pokalrunden = ["1. Runde","2. Runde","3. Runde","Achtelfinale","Viertelfinale","Halbfinale","Finale"], pokalzats = [3,15,27,39,51,63,69];

		for (s = 1, rd = 1; s <= OSext.ZATS_PRO_SAISON; s++) {
			spieltag = this.saisonplan[s];
			if (spieltag.spielart == OSext.SPIELART.LIGA) {
				if (spieltag.termin.zat < 70) {
					spieltag.runde = rd + ". Spieltag";
				} else {
					rd = 0;
					spieltag.runde = "Relegation";
				}
				rd++;
			} else if (spieltag.spielart == OSext.SPIELART.POKAL) {
				spieltag.runde = pokalrunden[pokalzats.indexOf(spieltag.termin.zat)];
			} else if (spieltag.spielart == OSext.SPIELART.OSC || spieltag.spielart == OSext.SPIELART.OSCQ || spieltag.spielart == OSext.SPIELART.OSE || spieltag.spielart == OSext.SPIELART.OSEQ) {
				if (int || spieltag.ort == OSext.SPIELORT.AUSWAERTS) {
					spieltag.international = true;
					if (spieltag.ort == OSext.SPIELORT.HEIM) {
						int = false;
					}
				}
			}
		}
	},

	initSpielersummen : function () {

		var bilanzauswahl = OSext.Prefs.getBilanzauswahl(), vorsaison = new OSext.Termin(this.termin.saison, this.termin.zat).subtractZats(OSext.ZATS_PRO_SAISON), saisonstart = new OSext.Termin(
			this.termin.saison, 1), s, spieler, mwreal, mwcalc;

		if (bilanzauswahl == OSext.BILANZ.LETZTES_JAHR) {
			this.getDatabase().initKaderspielerSummen(this.team.spieler, vorsaison);
			this.getDatabase().initJugendspielerSummen(this.team.jugend);
		} else if (bilanzauswahl == OSext.BILANZ.AKTUELLES_JAHR) {
			this.getDatabase().initKaderspielerSummen(this.team.spieler, saisonstart);
			this.getDatabase().initJugendspielerSummen(this.team.jugend);
		} else {
			this.getDatabase().initKaderspielerSummen(this.team.spieler);
			this.getDatabase().initJugendspielerSummen(this.team.jugend);
		}

		for (s = 0; s < this.team.spieler.length; s++) {
			spieler = this.team.spieler[s];
			mwreal = spieler.mw;
			spieler.mw = null;
			mwcalc = spieler.getMarktwert(null, this.termin.zat);
			spieler.mwfaktor = mwreal / mwcalc;
			spieler.mw = mwreal;
		}
	},

	initKaderspielerGeburtstage : function () {
		this.getDatabase().initKaderspielerGeburtstage(this.team.spieler);
	},
	
	clearAllCaches : function () {

		var s;

		this.ansicht.saison.cache = null;
		this.ansicht.team.cache = null;
		for (s = 1; s < this.saisonplan.length; s++) {
			if (!this.saisonplan[s].datum) {
				this.saisonplan[s].team = null;
			}
		}
	},

	/**
	 * Liefert ein {@code OSext.Team} mit der angegebenen Id aus einer Liste von externen Teams.
	 * Falls das Team noch nicht existiert, wird ein neues Team erstellt und in der Liste
	 * gespeichert.
	 * 
	 * @param {Number} id
	 */
	getExternalTeam : function (id) {

		var t, newteam;

		for (t = 0; t < this.externalteams.length; t++) {
			if (this.externalteams[t].id == id) {
				return this.externalteams[t];
			}
		}

		newteam = new OSext.Team(id, "Unknown");
		this.externalteams.push(newteam);
		return newteam;
	}
};
