
TestCase("DataTests").prototype = {
	
	setUp : function () {
	
		var spieler, i;
		
		this.data = new OSext.Data();
		
		for (i = 0; i < 10; i++) {
			spieler = new OSext.Kaderspieler();
			spieler.id = i;
			this.data.team.spieler[i] = spieler;
		}
		
		this.data.setAktuellenSpieltag(new OSext.Spieltag(3,45));

	},
	
	testAktuellenTermin : function () {

		assertEquals(3,this.data.termin.saison);
		assertEquals(45,this.data.termin.zat);

		assertEquals(3,this.data.spieltag.termin.saison);
		assertEquals(45,this.data.spieltag.termin.zat);
		
		assertEquals(3,this.data.saisonplan[1].termin.saison);
		assertEquals(45,this.data.saisonplan[45].termin.zat);

		assertEquals(3,this.data.ansicht.team.termin.saison);
		assertEquals(45,this.data.ansicht.team.termin.zat);
	},
	
	testGetAktuellesTeam : function () {
		
		var spieler = this.data.getTeam(new OSext.Termin(3,45)).spieler[6];
		assertEquals(6, spieler.id);
	},
	
	testGetTeam : function () {
		
		this.data.team = new OSext.Team(19,"FC Cork");
		
		assertEquals("FC Cork", this.data.getTeam(new OSext.Termin(3,53)).name);
	},
	
	testGetTeamStyleAktuell : function () {

		assertEquals(OSext.STYLE.CURRENT,this.data.ansicht.team.getStyle());
	},
	
	testGetTeamStyleHistory : function () {

		this.data.ansicht.team.termin.zat = 1;
		
		assertEquals(OSext.STYLE.HIST,this.data.ansicht.team.getStyle());
	},

	testGetTeamStyleFuture : function () {

		this.data.ansicht.team.termin.zat = 72;
		
		assertEquals(OSext.STYLE.FUTURE,this.data.ansicht.team.getStyle());
	},

	testGetAktuellenSpieltag : function () {

		this.data.saisonplan[33].ort = "Cork";
		
		assertEquals("Cork", this.data.getSpieltag(new OSext.Termin(3,33)).ort);
	},

	testGetSpieltagUngueltigeSaison : function () {

		assertNull(this.data.getSpieltag(new OSext.Termin(1,34)));
	},
	
	testGetSpieltagKeinTermin : function () {

		assertNull(this.data.getSpieltag(new OSext.Team()));
	},
	
	testIsSaisonplanNotValid : function () {

		assertFalse(this.data.isSaisonplanValid());
	},
	
	testIsSaisonplanValid : function () {

		this.data.saisonplan[2].spielart = OSext.SPIELART.LIGA;

		assertTrue(this.data.isSaisonplanValid());
	},

	testIsNotLaufendeSaison : function () {

		assertFalse(this.data.isLaufendeSaison());
	},
	
	testIsLaufendeSaison : function () {

		this.data.saisonplan[55].gespielt = true;

		assertTrue(this.data.isLaufendeSaison());
	},

	testGetUnknownExternalTeam : function () {
		
		this.data.externalteams[0] = new OSext.Team(11, "Extern11");
		
		var team = this.data.getExternalTeam(2);
		
		assertEquals(2,this.data.externalteams.length);
		assertEquals(11,this.data.externalteams[0].id);
		assertEquals(2,this.data.externalteams[1].id);
		assertNotNull(team);
		assertInstanceOf(OSext.Team, team);
		assertEquals(2,team.id);
	},

	testGetKnownExternalTeam : function () {

		this.data.externalteams[0] = new OSext.Team(11, "Extern11");
		this.data.externalteams[1] = new OSext.Team(3, "Extern3");
		this.data.externalteams[2] = new OSext.Team(7, "Extern7");

		var team = this.data.getExternalTeam(3);
		
		assertEquals(3,this.data.externalteams.length);
		assertNotNull(team);
		assertInstanceOf(OSext.Team, team);
		assertEquals(3,team.id);
	},

	testFirstExternalTeam : function () {
		
		var team = this.data.getExternalTeam(11);
		
		assertEquals(1,this.data.externalteams.length);
		assertEquals(11,this.data.externalteams[0].id);
		assertNotNull(team);
		assertInstanceOf(OSext.Team, team);
		assertEquals(11,team.id);
	}

	
}



