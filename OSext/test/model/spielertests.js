
TestCase("SpielerTests").prototype = {
	
	setUp : function() {

		this.spieler = new OSext.Spieler();
		
		this.spieler.alter = 23;
		this.spieler.pos = OSext.POS.ABW;
		this.spieler.skills = [34,36,70,76,75,40,0,12,31,30,45,41,20,23,87,66,50];
		
		this.spieler.mw = 40000000;
		this.spieler.gehalt = 100000;
		this.spieler.vertrag = 10;
		
		this.spieler.status = OSext.STATUS.AKTIV;
		this.spieler.tsperre = 0;
		this.spieler.sonderskills = null;

	},

	testSkillsummen : function() {
		
		assertEquals(287,this.spieler.getSummePrimaerSkills());
		assertEquals(269,this.spieler.getSummeNebenSkills());
		assertEquals(180,this.spieler.getSummeUnveraenderlicheSkills());

		assertEquals(182,this.spieler.getSummePrimaerSkills(OSext.POS.DMI));
		assertEquals(374,this.spieler.getSummeNebenSkills(OSext.POS.DMI));		

		assertEquals(736,this.spieler.getSummeAlleSkills());

	},
	
	testSkillschnitt : function() {

		assertEquals(43.29,this.spieler.getSkillschnitt());		

	},
	
	testOpti : function() {

		assertEquals(69.78,this.spieler.getOpti());
		assertEquals(59.85,this.spieler.getOpti(OSext.POS.STU));
		
	},
	
	testSonderskillElferkiller : function() {
		
		this.spieler.pos = OSext.POS.TOR;
		this.spieler.skills = [34,36,77,76,75,75,0,12,31,30,45,41,20,23,87,66,50];
		
		assertEquals("E",this.spieler.getSonderskillsText());
				
		this.spieler.sonderskills = null;
		this.spieler.pos = OSext.POS.ABW;

		assertEquals("",this.spieler.getSonderskillsText());
		
	},

	testSonderskillLibero : function() {

		this.spieler.pos = OSext.POS.ABW;
		this.spieler.skills = [34,36,77,76,75,45,0,12,31,30,45,75,20,23,87,66,50];
		
		assertEquals("L",this.spieler.getSonderskillsText());
		
		this.spieler.sonderskills = null;
		this.spieler.pos = OSext.POS.DMI;
		
		assertEquals("L",this.spieler.getSonderskillsText());

		this.spieler.sonderskills = null;
		this.spieler.pos = OSext.POS.MIT;
		
		assertEquals("",this.spieler.getSonderskillsText());
	},

	testSonderskillSpielmacher : function() {

		this.spieler.pos = OSext.POS.DMI;
		this.spieler.skills = [34,80,55,52,72,45,0,12,31,76,45,75,20,23,87,66,50];
		
		assertEquals("S",this.spieler.getSonderskillsText());
		
		this.spieler.sonderskills = null;
		this.spieler.pos = OSext.POS.MIT;
		
		assertEquals("S",this.spieler.getSonderskillsText());

		this.spieler.sonderskills = null;
		this.spieler.pos = OSext.POS.TOR;
		
		assertEquals("",this.spieler.getSonderskillsText());
	},

	testSonderskillFlankengott : function() {

		this.spieler.pos = OSext.POS.MIT;
		this.spieler.skills = [34,80,55,52,72,78,0,12,31,76,45,74,20,23,87,66,50];
		
		assertEquals("G",this.spieler.getSonderskillsText());
		
		this.spieler.sonderskills = null;
		this.spieler.pos = OSext.POS.OMI;
		
		assertEquals("G",this.spieler.getSonderskillsText());

		this.spieler.sonderskills = null;
		this.spieler.pos = OSext.POS.TOR;
		
		assertEquals("",this.spieler.getSonderskillsText());
	},

	testSonderskillTorjaeger : function() {

		this.spieler.pos = OSext.POS.OMI;
		this.spieler.skills = [76,66,75,74,44,78,0,12,31,43,45,54,20,23,87,66,50];
		
		assertEquals("T",this.spieler.getSonderskillsText());
		
		this.spieler.sonderskills = null;
		this.spieler.pos = OSext.POS.STU;
		
		assertEquals("T",this.spieler.getSonderskillsText());

		this.spieler.sonderskills = null;
		this.spieler.pos = OSext.POS.TOR;
		
		assertEquals("",this.spieler.getSonderskillsText());
	},

	testSonderskills : function() {

		this.spieler.pos = OSext.POS.TOR;
		this.spieler.skills = [75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75];
		
		assertEquals("EK",this.spieler.getSonderskillsText());
		
		this.spieler.sonderskills = null;
		this.spieler.pos = OSext.POS.ABW;
		
		assertEquals("LSFTGKP",this.spieler.getSonderskillsText());

		this.spieler.sonderskills = null;
		this.spieler.pos = OSext.POS.MIT;
		
		assertEquals("SFTGKP",this.spieler.getSonderskillsText());
	},

	testMarkwertSteveStapleton : function() {

		this.spieler.mw = null;
		this.spieler.mwfaktor = 1.005087321;
		this.spieler.pos = OSext.POS.TOR;
		this.spieler.alter = 26;
		this.spieler.geburtstag = 24;
		this.spieler.skills = [58,80,85,85,85,85,0,70,33,60,50,66,28,34,3,80,30];

		assertEquals(16612825,Math.round(this.spieler.getMarktwert(null, 1)));
	},
	
	testMarkwertRomanOLeary : function() {

		this.spieler.mw = null;
		this.spieler.mwfaktor = 1.009674801;
		this.spieler.pos = OSext.POS.ABW;
		this.spieler.alter = 25;
		this.spieler.geburtstag = 66;
		this.spieler.skills = [43,80,84,85,85,80,0,74,50,80,57,76,42,2,60,84,4];

		assertEquals(24088571,Math.round(this.spieler.getMarktwert(null, 1)));
	}
	
}



