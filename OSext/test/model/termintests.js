
TestCase("TerminTests").prototype = {
	
	testGetZats : function () {
		
		var termin = new OSext.Termin(3,45);
		
		assertEquals(3*72+45,termin.getZats());
	},
	
	testAdd : function () {

		var termin = new OSext.Termin(3,45);
		
		assertEquals(3,termin.addZats(10).saison);
		assertEquals(65,termin.addZats(10).zat);
		assertEquals(4,termin.addZats(10).saison);
		assertEquals(13,termin.addZats(10).zat);
	},
	
	testSubtract : function () {
	
		var termin = new OSext.Termin(3,45);
		
		assertEquals(3,termin.subtractZats(10).saison);
		assertEquals(25,termin.subtractZats(10).zat);
		assertEquals(2,termin.subtractZats(30).saison);
		assertEquals(57,termin.subtractZats(10).zat);
	}

}



