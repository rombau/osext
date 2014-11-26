TestCase("HauptTests").prototype = {

	setUp : function() {

		this.site = new OSext.Sites.Haupt(new OSext.WrappedDocument(document));

		this.data = new OSext.Data();
	},

	testSiteChange : function() {

		/*:DOC += <b>Seitenaenderung</b>*/

		try {
			assertFalse(this.site.check());
			fail();
		} catch (e) {
			assertInstanceOf(OSext.SiteChangeError, e);
			assertEquals("Managerbüro -> Überschrift wurde nicht gefunden!", e.message);
		}
	},

	testSiteChangeNoZat : function() {

		/*:DOC += <b>Willkommen im Managerb_ro von FC Cork</b>*/

		try {
			assertFalse(this.site.check());
			fail();
		} catch (e) {
			assertInstanceOf(OSext.SiteChangeError, e);
			assertEquals("Managerbüro -> Termin wurde nicht gefunden!", e.message);
		}
	},

	testDemoTeam : function() {

		/*:DOC += <b>Willkommen im Managerb_ro von DemoTeam</b>*/
		/*:DOC += <b>Der n_chste ZAT ist ZAT 45 und liegt auf ...</b>*/

		try {
			assertFalse(this.site.check());
			fail();
		} catch (e) {
			assertInstanceOf(OSext.AuthenticationError, e);
		}
	},
	
	testInitialRequestQueue : function() {
		
		/*:DOC += <b>Willkommen im Managerb_ro von FC Cork</b>*/
		/*:DOC += <b>Der n_chste ZAT ist ZAT 45 und liegt auf ...</b>*/
		
		var queue = this.site.extract(this.data);
		
		assertNotNull(queue);
		assertEquals(15, queue.sitequeue.length);
	},

	testTeamName : function() {

		/*:DOC += <b>Willkommen im Managerb_ro von FC Cork</b>*/
		/*:DOC += <b>Der n_chste ZAT ist ZAT 45 und liegt auf ...</b>*/

		this.site.extract(this.data);
		assertEquals("FC Cork", this.data.team.name);

	},

	testTeamNameMitInfos : function() {

		/*:DOC += <b>INFO</b>*/
		/*:DOC += <b>Willkommen im Managerb_ro von FC Cork</b>*/
		/*:DOC += <b>INFO</b>*/
		/*:DOC += <b>Der n_chste ZAT ist ZAT 45 und liegt auf ...</b>*/

		this.site.extract(this.data);
		assertEquals("FC Cork", this.data.team.name);

	},

	testLegalZat : function() {

		/*:DOC += <b>Willkommen im Managerb_ro von FC Cork</b>*/
		/*:DOC += <b>Der n_chste ZAT ist ZAT 45 und liegt auf ...</b>*/

		this.site.extract(this.data);
		assertEquals(null, this.data.termin.saison);
		assertEquals(44, this.data.termin.zat);
		assertFalse(this.data.saisonpause);

	},
	
	testSaisonende : function() {

		/*:DOC += <b>Willkommen im Managerb_ro von FC Cork</b>*/
		/*:DOC += <b>Der n_chste ZAT ist ZAT 73 und liegt auf ...</b>*/

		this.site.extract(this.data);
		assertEquals(null, this.data.termin.saison);
		assertEquals(OSext.ZATS_PRO_SAISON, this.data.termin.zat);
		assertTrue(this.data.saisonpause);

	},

	testSaisonpause : function() {

		/*:DOC += <b>Willkommen im Managerb_ro von FC Cork</b>*/
		/*:DOC += <b>Der n_chste ZAT ist ZAT 1 und liegt auf ...</b>*/

		this.site.extract(this.data);
		assertEquals(null, this.data.termin.saison);
		assertEquals(OSext.ZATS_PRO_SAISON, this.data.termin.zat);
		assertTrue(this.data.saisonpause);

	}


}
