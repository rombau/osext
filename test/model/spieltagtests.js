
TestCase("SpieltagTests").prototype = {

	setUp : function () {

		this.spieltag = new OSext.Spieltag(3,45);
		
		this.spieltag.stadion = new OSext.Stadion();
		this.spieltag.stadion.anzeigetafel = "Keine";
		this.spieltag.stadion.rasenheizung = false;
		this.spieltag.stadion.steher = 10000;
		this.spieltag.stadion.sitzer = 5000;
		this.spieltag.stadion.uesteher = 2000;
		this.spieltag.stadion.uesitzer = 3000;
		
		this.eintritte = {liga : 37, pokal : 42, international : 59};
		
		this.ansicht = new OSext.Ansicht(null);
		this.ansicht.saison.platzierung = 4;
		this.ansicht.saison.auslastung = 95;
		this.ansicht.saison.eintritt = 38;
	
	},
	
	testGetReport : function () {

		this.spieltag.team = new OSext.Team(19,"FC Cork");
		this.spieltag.gegner = new OSext.Team(1157,"RC Shelbourne");
		this.spieltag.ort = OSext.SPIELORT.HEIM;
		
		assertEquals("rep/saison/3/45/19-1157",this.spieltag.getReport());
	},

	testGetReportWithoutGegner : function () {

		this.spieltag.team = new OSext.Team(19,"FC Cork");
		
		assertEquals("",this.spieltag.getReport());
	},
	
	testGetSumme : function () {
		
		this.spieltag.stadioneinnahmen = 1;
		this.spieltag.stadionkosten = 1;
		this.spieltag.punktpraemie = 1;
		this.spieltag.torpraemie = 1;
		this.spieltag.siegpraemie = 1;
		this.spieltag.tvgelder = 1;
		this.spieltag.fanartikel = 1;
		this.spieltag.grundpraemie = 1;
		this.spieltag.spielergehaelter = 1;
		this.spieltag.trainergehaelter = 1;
		this.spieltag.jugend = 1;
		this.spieltag.physio = 1;
		this.spieltag.leihen = 1;
		this.spieltag.blitz = 1;

		assertEquals(14,this.spieltag.getSumme());
	},
	
	testCalculateLigaspiel : function () {
		
		this.spieltag.spielart = OSext.SPIELART.LIGA;
		this.spieltag.ort = OSext.SPIELORT.HEIM;
		this.spieltag.gegner = new OSext.Team(1157,"RC Shelbourne");
		
		this.spieltag.calculateStadioneinnahmen(this.ansicht, this.eintritte);
		
		assertEquals(780900,this.spieltag.stadioneinnahmen);
		assertEquals(-95000,this.spieltag.stadionkosten);
	},

	testCalculateLigaspielAuswaerts : function () {
		
		this.spieltag.spielart = OSext.SPIELART.LIGA;
		this.spieltag.ort = OSext.SPIELORT.AUSWAERTS;
		this.spieltag.gegner = new OSext.Team(1157,"RC Shelbourne");
		
		this.spieltag.calculateStadioneinnahmen(this.ansicht, this.eintritte);

		assertNull(this.spieltag.stadioneinnahmen);
		assertNull(this.spieltag.stadionkosten);
	},

	testCalculateLigaspielOhneStadion : function () {
		
		this.spieltag.spielart = OSext.SPIELART.LIGA;
		this.spieltag.ort = OSext.SPIELORT.HEIM;
		this.spieltag.gegner = new OSext.Team(1157,"RC Shelbourne");
		this.spieltag.stadion = null;
		
		this.spieltag.calculateStadioneinnahmen(this.ansicht, this.eintritte);
		
		assertNull(this.spieltag.stadioneinnahmen);
		assertNull(this.spieltag.stadionkosten);
	},

	testCalculateLigaspielOhneGegner : function () {

		this.spieltag.spielart = OSext.SPIELART.LIGA;
		this.spieltag.ort = OSext.SPIELORT.HEIM;

		this.spieltag.calculateStadioneinnahmen(this.ansicht, this.eintritte);

		assertEquals(250000,this.spieltag.stadioneinnahmen);
		assertNull(this.spieltag.stadionkosten);
	},
	
	testCalculatePokalspiel : function () {

		this.spieltag.spielart = OSext.SPIELART.POKAL;
		this.spieltag.gegner = new OSext.Team(1157,"RC Shelbourne");

		this.spieltag.calculateStadioneinnahmen(this.ansicht, this.eintritte);

		assertEquals(428450,this.spieltag.stadioneinnahmen);
		assertEquals(-47500,this.spieltag.stadionkosten);
	},

	testCalculatePokalspielOhneGegner : function () {

		this.spieltag.spielart = OSext.SPIELART.POKAL;

		this.spieltag.calculateStadioneinnahmen(this.ansicht, this.eintritte);

		assertEquals(250000,this.spieltag.stadioneinnahmen);
		assertNull(this.spieltag.stadionkosten);
	},
	
	testCalculateInternational : function () {

		this.spieltag.spielart = OSext.SPIELART.OSEQ;
		this.spieltag.ort = OSext.SPIELORT.HEIM;
		this.spieltag.international = true;

		this.spieltag.calculateStadioneinnahmen(this.ansicht, this.eintritte);

		assertEquals(1179900,this.spieltag.stadioneinnahmen);
		assertEquals(-95000,this.spieltag.stadionkosten);
	},

	testCalculateInternationalAuswaerts : function () {

		this.spieltag.spielart = OSext.SPIELART.OSEQ;
		this.spieltag.ort = OSext.SPIELORT.AUSWAERTS;
		this.spieltag.international = true;

		this.spieltag.calculateStadioneinnahmen(this.ansicht, this.eintritte);

		assertNull(this.spieltag.stadioneinnahmen);
		assertNull(this.spieltag.stadionkosten);
	},

	testCalculateFriendly : function () {

		this.spieltag.spielart = OSext.SPIELART.FSS;
		this.spieltag.fssanteil = 70;

		this.spieltag.calculateStadioneinnahmen(this.ansicht, this.eintritte);

		assertEquals(350000, this.spieltag.stadioneinnahmen);
		assertNull(this.spieltag.stadionkosten);
	},

	testCalculateReserviert : function () {
		
		this.spieltag.spielart = OSext.SPIELART.RESERVIERT;

		this.spieltag.calculateStadioneinnahmen(this.ansicht, this.eintritte);

		assertEquals(250000, this.spieltag.stadioneinnahmen);
		assertNull(this.spieltag.stadionkosten);
	},

	testCalculateSpielfrei : function () {
		
		this.spieltag.spielart = OSext.SPIELART.SPIELFREI;

		this.spieltag.calculateStadioneinnahmen(this.ansicht, this.eintritte);

		assertEquals(250000, this.spieltag.stadioneinnahmen);
		assertNull(this.spieltag.stadionkosten);
	},
	
	testCalculatePraemienErste3von10 : function () {

		this.spieltag.spielart = OSext.SPIELART.LIGA;
		this.spieltag.ort = OSext.SPIELORT.HEIM;

		this.spieltag.calculatePraemien(3, 1, 10);
		
		assertEquals(695000, this.spieltag.tvgelder);
		assertEquals(615000, this.spieltag.fanartikel);
	},

	testCalculatePraemienZweite11von18 : function () {

		this.spieltag.spielart = OSext.SPIELART.LIGA;
		this.spieltag.ort = OSext.SPIELORT.HEIM;

		this.spieltag.calculatePraemien(11, 2, 18);
		
		assertEquals(501284, this.spieltag.tvgelder);
		assertEquals(442264, this.spieltag.fanartikel);
	},

	testCalculatePraemienZweite11von18Saisonabschluss : function () {

		this.spieltag.termin.zat = OSext.ZATS_PRO_SAISON;
		this.spieltag.spielart = OSext.SPIELART.LIGA;
		this.spieltag.ort = OSext.SPIELORT.HEIM;

		this.spieltag.calculatePraemien(11, 2, 18);
		
		assertEquals(1002568, this.spieltag.tvgelder);
		assertEquals(884528, this.spieltag.fanartikel);
	},

	testCalculatePraemienAuswaerts : function () {
		
		this.spieltag.spielart = OSext.SPIELART.LIGA;
		this.spieltag.ort = OSext.SPIELORT.AUSWAERTS;
		
		this.spieltag.calculatePraemien(3, 1, 10);

		assertNull(this.spieltag.tvgelder);
		assertNull(this.spieltag.fanartikel);
	},
	
	testCalculatePraemienFriendly : function () {

		this.spieltag.spielart = OSext.SPIELART.FSS;
		this.spieltag.ort = OSext.SPIELORT.HEIM;

		this.spieltag.calculatePraemien(3, 1, 10);

		assertNull(this.spieltag.tvgelder);
		assertNull(this.spieltag.fanartikel);
	}

}



