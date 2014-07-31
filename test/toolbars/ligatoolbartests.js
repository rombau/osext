TestCase("LigaToolbarTests").prototype = {

	setUp : function() {

		this.toolbar = new OSext.LigaToolbar(new OSext.WrappedDocument(document));

		this.data = new OSext.Data();
	},
	
	testToolbar : function() {

		/*:DOC += <div><table id="kader1"/><table/></div>*/
		
		this.toolbar.show(this.data);

		assertNotNull(document.getElementById("osext-extended"));
		assertFalse(document.getElementById("osext-extended").checked);		
	},
		
	testHandleZatAuswahl : function() {

		/*:DOC += <div><table id="kader1"/><table/></div>*/

		this.toolbar.show(this.data);

		document.getElementById("osext-extended").checked = true;
		this.toolbar.handleSelections(this.data);

		assertTrue(this.data.ansicht.liga.extended); 
	}
}
