
TestCase("StadionTests").prototype = {
	
	setUp : function () {
		
		this.stadion = new OSext.Stadion();
		
		this.stadion.steher = 5700;
		this.stadion.sitzer = 2900;
		this.stadion.uesteher = 10700;
		this.stadion.uesitzer = 15300;
		this.stadion.rasenheizung = false;
	},
	
	testGetPlaetze : function () {
		
		assertEquals(34600, this.stadion.getGesamtplaetze());
	},
	
	testGetEinnahmen : function () {

		assertEquals(1433550, this.stadion.getEinnahmen(37, 95));
		assertEquals(1153180, this.stadion.getEinnahmen(41, 70));
	},
	
	testGetKosten : function () {
	
		assertEquals(164350, this.stadion.getKosten(95));
		assertEquals(121100, this.stadion.getKosten(70));
	}

}



