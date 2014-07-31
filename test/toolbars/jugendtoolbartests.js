TestCase("JugendToolbarTests").prototype = {

	setUp : function() {

		this.toolbar = new OSext.JugendToolbar(new OSext.WrappedDocument(document));

		this.data = new OSext.Data();

		this.data.liga = 2;
		this.data.ligagroesse = 10;

	},
	
	testToolbar : function() {

		/*:DOC += <div><table/><table/></div>*/
		
		this.toolbar.show(this.data);

		assertEquals("0",document.getElementById("osext-auswahl").value);
		assertEquals(4,document.getElementById("osext-auswahl").options.length);
		
		assertEquals("0",document.getElementById("osext-auswahl").options[0].value);
		assertEquals("17",document.getElementById("osext-auswahl").options[1].value);
		assertEquals("18",document.getElementById("osext-auswahl").options[2].value);
		assertEquals("19",document.getElementById("osext-auswahl").options[3].value);
		
		assertEquals("Aktuell",document.getElementById("osext-auswahl").options[0].text);
		assertEquals("17 Jahre",document.getElementById("osext-auswahl").options[1].text);
		assertEquals("18 Jahre",document.getElementById("osext-auswahl").options[2].text);
		assertEquals("Maximal",document.getElementById("osext-auswahl").options[3].text);
		
	},
		
	testHandleZatAuswahl : function() {

		/*:DOC += <div><table/><table/></div>*/

		this.toolbar.show(this.data);

		this.data.ansicht.jugend.cache = this.data.team.jugend;
		document.getElementById("osext-auswahl").value = 19;

		this.toolbar.handleSelections(this.data);

		assertEquals(19,this.data.ansicht.jugend.auswahl); 
		assertNull(this.data.ansicht.jugend.cache);
	}
}
