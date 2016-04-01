
TestCase("TeamTests").prototype = {
	
	setUp : function() {
	
		this.team = new OSext.Team(19,"FC Cork");

		for (var i = 0; i < 21; i++) {

			var spieler = new OSext.Kaderspieler();
			spieler.id = i;
			spieler.pos = ["LEI","TOR","ABW","DMI","MIT","OMI","STU"][i%7];
			spieler.status = OSext.STATUS.AKTIV;
			spieler.opti = 70+i;
			spieler.skillschnitt = 40+i;
	
			this.team.spieler[i] = spieler;
		}
	},

	testAnzahlJugendspieler : function () {
		
		var spieler1 = new OSext.Jugendspieler(),
			spieler2 = new OSext.Jugendspieler();
		
		spieler1.alter = 14;
		spieler1.geburtstag = 72;
		spieler2.alter = 12;
		spieler2.geburtstag = 12;
		
		this.team.jugend.push(spieler1);
		this.team.jugend.push(spieler2);
		
		assertEquals(1,this.team.getAnzahlJugendspieler(new OSext.Termin(10, 3)));
		assertEquals(2,this.team.getAnzahlJugendspieler(new OSext.Termin(10, 13)));
		assertEquals(1,this.team.getAnzahlJugendspieler(new OSext.Termin(11, 1)));
	},

	testGetOptiSortedSpieler : function () {
		
		var sortedlist = this.team.getOptiSortedSpieler();
		
		assertEquals(90,sortedlist[0].opti);
		assertEquals(70,sortedlist[sortedlist.length-1].opti);
	},

	testGetOptiSortedSpielerNew : function () {
		
		var sortedlist = this.team.getOptiSortedSpieler([{opti:50},{opti:10},{opti:60}]);
		
		assertEquals(60,sortedlist[0].opti);
		assertEquals(50,sortedlist[1].opti);
		assertEquals(10,sortedlist[2].opti);
	},

	testGetTopElf : function () {
		
		var topelf = this.team.getTopElf();
		
		assertEquals(11,topelf.length);
		assertEquals("STU",topelf[0].pos);
		assertEquals(90,topelf[0].opti);
		assertEquals("ABW",topelf[10].pos);
		assertEquals(72,topelf[10].opti);
	},

	testGetTopElfVerliehen : function () {

		this.team.spieler[20].status = OSext.STATUS.VERLIEHEN;

		var topelf = this.team.getTopElf();
		
		assertEquals("OMI",topelf[0].pos);
		assertEquals(89,topelf[0].opti);
	},

	testGetTopElfVerletzt : function () {
		
		this.team.spieler[20].verletzung = "5";
		
		var topelf = this.team.getTopElf();
		
		assertEquals("OMI",topelf[0].pos);
		assertEquals(89,topelf[0].opti);
	},

	testGetFormation : function () {
		
		var topelf = this.team.getTopElf();
		
		assertEquals("3-5-2",this.team.getFormation(topelf));
	},

	testGetFormationOfMoreThanEleven : function () {
				
		assertEquals("3-5-2",this.team.getFormation(this.team.spieler));
	},

	testGetSkillschnitt : function () {
		
		var topelf = this.team.getTopElf();
		
		assertEquals(53.82,this.team.getSkillschnitt(topelf));
	},

	testGetOptischnitt : function () {
		
		var topelf = this.team.getTopElf();
		
		assertEquals(83.82,this.team.getOptischnitt(topelf));
	},
	
	testSpielergehaelter : function () {

		this.team.spieler[3].gehalt = 1000;
		this.team.spieler[4].gehalt = 1000;

		assertEquals(2000,this.team.getSpielergehaelter());
	},

	testTrainergehaelter : function () {
		
		this.team.trainer[1] = new OSext.Trainer();
		this.team.trainer[1].gehalt = 1000;
		this.team.trainer[2] = new OSext.Trainer();
		this.team.trainer[2].gehalt = 1000;
		
		assertEquals(2000,this.team.getTrainergehaelter());
	},

	testLeihgebuehren : function () {
		
		this.team.spieler[3].leihdaten = 
			{gebuehr: 2000, dauer: 2, von: { id: 19, name: "FC Cork"}, an: { id: 17, name: "FC Bleiburg"} };
		this.team.spieler[4].leihdaten = 
			{gebuehr: 1000, dauer: 34, von: { id: 17, name: "FC Bleiburg"}, an: { id: 19, name: "FC Cork"} }
		
		assertEquals(1000,this.team.getLeihgebuehren());
	},

	testBlitzerloese : function () {

		this.team.spieler[3].blitzzat = 41;
		this.team.spieler[3].blitzwert = 1000;
		this.team.spieler[4].blitzzat = 47;
		this.team.spieler[4].blitzwert = 1000;
		
		assertEquals(1000,this.team.getBlitzerloese(41));
	},

	testGetTeamInfo : function () {
		
		assertMatch(/A-Team\s\(3-5-2\):\s53\.82\s\/\s.+83\.82.+/, this.team.getTeamInfoHTML());
	}
}



