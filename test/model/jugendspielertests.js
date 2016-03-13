
TestCase("JugendspielerTests").prototype = {
	
	setUp : function() {

		this.spieler = new OSext.Jugendspieler();
		
		this.spieler.alter = 17;
		this.spieler.skills = [34,36,70,76,75,40,0,12,31,30,45,41,20,23,87,66,50];
		
	},

	testGetPosition : function () {
		
		assertEquals("ABW",this.spieler.getPos());
	},

	testGetPositionTor : function () {
		
		this.spieler.pos = "TOR";
		assertEquals("TOR",this.spieler.getPos());
	},
	
	testMarkwertzuwachsProZat : function() {

		this.spieler.foerderung = 10000;
		this.spieler.kaderzats = 25;
		this.spieler.mwzuwachs = 500000;

		assertEquals("10.000",this.spieler.getMarktwertbilanz());
	},

	testAufwertungProZat : function() {

		this.spieler.kaderzats = 30;
		this.spieler.gesamtaufwertungen = 34;

		assertEquals("1.133",this.spieler.getAufwertungsbilanz());
	},

	testSkillPrognose16 : function() {

		var s = this.spieler.getSpieler(new OSext.Termin(3, 35), 16);
		
		assertEquals(16,s.alter);
		assertEquals([22,24,46,50,50,26,0,8,20,20,30,27,20,23,87,44,50],s.skills);
	},

	testSkillPrognose18 : function() {

		var s = this.spieler.getSpieler(new OSext.Termin(3, 35), 18);
		
		assertEquals(18,s.alter);
		assertEquals([37,40,78,84,83,44,0,13,34,33,50,45,20,23,87,73,50],s.skills);
	},

	testSkillPrognose19 : function() {

		var s = this.spieler.getSpieler(new OSext.Termin(3, 35), 19);
		
		assertEquals(18,s.alter);
		assertEquals([45,48,93,99,99,53,0,16,41,40,60,54,20,23,87,88,50],s.skills);
	},
	
	testSkillPrognose19_GeburtstagVorZat : function() {

		this.spieler.geburtstag = 30; // Alter = 17
		
		var s = this.spieler.getSpieler(new OSext.Termin(3, 35), 19);
		
		assertEquals(18,s.alter);
		assertEquals([50,52,99,99,99,58,0,17,45,44,66,60,20,23,87,97,50],s.skills);
	},
	
	testSkillPrognose19_GeburtstagNachZat : function() {

		this.spieler.geburtstag = 54; // Alter = 17
		
		var s = this.spieler.getSpieler(new OSext.Termin(3, 35), 19);
		
		assertEquals(18,s.alter);
		assertEquals([42,45,88,96,94,50,0,15,39,37,56,51,20,23,87,83,50],s.skills);
	}
	
}



