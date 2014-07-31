TestCase("TeamToolbarTests").prototype = {

	setUp : function() {

		this.toolbar = new OSext.TeamToolbar(new OSext.WrappedDocument(document));

		this.data = new OSext.Data();
		this.data.setAktuellenSpieltag(new OSext.Spieltag(3, 45));

		this.data.mintermin.saison = 1;
		this.data.mintermin.zat = 1;

	},
	
	testToolbar : function() {

		/*:DOC += <table id="team" />*/
		
		this.toolbar.show(this.data);

		assertEquals("0",document.getElementById("osext-auswahl").value);
		assertEquals("3",document.getElementById("osext-saison").value);
		assertEquals("45",document.getElementById("osext-zat").value);
		assertEquals("A-Team (0-0-0): 0.00 / 0.00",document.getElementById("osext-teaminfo").textContent);
	},
		
	testHandleZatAuswahl : function() {

		/*:DOC += <table id="team" />*/

		this.toolbar.show(this.data);

		this.data.ansicht.team.cache = this.data.team;
		document.getElementById("osext-auswahl").value = OSext.AUSWAHL.START2;

		this.toolbar.handleSelections(this.data);

		assertEquals("4",document.getElementById("osext-saison").value);
		assertEquals("1",document.getElementById("osext-zat").value);	

		assertEquals(OSext.AUSWAHL.START2,this.data.ansicht.team.auswahl); 
		assertEquals(4,this.data.ansicht.team.termin.saison); 
		assertEquals(1,this.data.ansicht.team.termin.zat); 
		assertNull(this.data.ansicht.team.cache);
	}
}
