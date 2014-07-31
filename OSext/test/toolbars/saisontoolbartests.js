TestCase("SaisonToolbarTests").prototype = {

	setUp : function() {

		this.toolbar = new OSext.SaisonToolbar(new OSext.WrappedDocument(document));

		this.data = new OSext.Data();
		this.data.setAktuellenSpieltag(new OSext.Spieltag(3, 45));
		
		this.data.ligagroesse = 10;
		
		this.data.ansicht.saison.platzierung = 2;
		this.data.ansicht.saison.auslastung = 100;
		this.data.ansicht.saison.eintritt = 36;
	},
	
	testToolbar : function() {

		/*:DOC += <table/>*/
		/*:DOC += <table/>*/
		/*:DOC += <table/>*/
		
		this.toolbar.show(this.data);

		assertEquals("2",document.getElementById("osext-platz").value);
		assertEquals("100",document.getElementById("osext-auslastung").value);
		assertEquals("36",document.getElementById("osext-eintritt").value);
	},
		
	testHandlePlatzierung : function() {

		/*:DOC += <table/>*/
		/*:DOC += <table/>*/
		/*:DOC += <table/>*/

		this.toolbar.show(this.data);

		this.data.ansicht.saison.cache = this.data.saisonplan;
		document.getElementById("osext-platz").value = 1;
		document.getElementById("osext-auslastung").value = 95;
		document.getElementById("osext-eintritt").value = 37;

		this.toolbar.handleSelections(this.data);

		assertEquals(1,this.data.ansicht.saison.platzierung); 
		assertEquals(95,this.data.ansicht.saison.auslastung); 
		assertEquals(37,this.data.ansicht.saison.eintritt); 
		assertNull(this.data.ansicht.saison.cache);
	}
}
