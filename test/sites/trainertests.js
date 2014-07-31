TestCase("TrainerTests").prototype = {

	setUp : function() {

		this.site = new OSext.Sites.Trainer(new OSext.WrappedDocument(document));

		this.data = new OSext.Data();
		this.data.setAktuellenSpieltag(new OSext.Spieltag(3, 45));

	},

	testSiteChangeTitel : function() {

		/*:DOC += <b>Seitenaenderung</b>*/
		
		try {
			assertFalse(this.site.check());
			fail();
		} catch (e) {
			assertInstanceOf(OSext.SiteChangeError, e);
			assertEquals("Trainer -> Überschrift wurde geändert!", e.message);
		}
	},

	testSiteChangeNoTable : function() {

		/*:DOC += <b> Übersicht des Trainerstabes </b>*/
		
		try {
			assertFalse(this.site.check());
			fail();
		} catch (e) {
			assertInstanceOf(OSext.SiteChangeError, e);
			assertEquals("Trainer -> Tabelle wurde geändert!", e.message);
		}
	},
	
	testSiteChangeTableColumnCount : function() {

		/*:DOC += <b> Übersicht des Trainerstabes </b>*/
		/*:DOC += <table><tr><td>#</td></tr><tr><td>#</td></tr></table>*/
		
		try {
			assertFalse(this.site.check());
			fail();
		} catch (e) {
			assertInstanceOf(OSext.SiteChangeError, e);
			assertEquals("Trainer -> Tabelle wurde geändert!", e.message);
		}
	},

	testSiteChangeTableColumnName : function() {

		/*:DOC += <b> Übersicht des Trainerstabes </b>*/
		/*:DOC += <table><tr><td>XYZ</td><td>Skill</td><td>Gehalt</td><td>Vertrag</td><td>Aktion</td></tr>
		 		         <tr><td>XYZ</td><td>Skill</td><td>Gehalt</td><td>Vertrag</td><td>Aktion</td></tr>
		 		  </table>*/
		
		try {
			assertFalse(this.site.check());
			fail();
		} catch (e) {
			assertInstanceOf(OSext.SiteChangeError, e);
			assertEquals("Trainer -> Tabellenspalten wurden geändert!", e.message);
		}
	},

	testDemoTeam : function() {

		/*:DOC += <div>Diese Seite ist ohne Team nicht verf&uuml;gbar!</div>*/
		
		try {
			assertFalse(this.site.check());
			fail();
		} catch (e) {
			assertInstanceOf(OSext.AuthenticationError, e);
		}
	},

	testSaisonpause : function() {

		/*:DOC += <div>Diese Funktion ist erst ZAT 1 wieder verf&uuml;gbar</div>*/
		
		assertFalse(this.site.check());
	},

	testExtract : function() {

		/*:DOC += <b> Übersicht des Trainerstabes </b>*/
		/*:DOC += <table><tr><td>#</td><td>Skill</td><td>Gehalt</td><td>Vertrag</td><td>Aktion</td></tr>
				         <tr><td>1</td><td>Trainer 09</td><td>113.432</td><td>28</td><td>....</td></tr>
				  </table>*/
		
		this.site.extract(this.data);
		
		assertUndefined(this.data.team.trainer[0]);
		assertNotNull(this.data.team.trainer[1]);
		assertEquals(60,this.data.team.trainer[1].skill);
		assertEquals(113432,this.data.team.trainer[1].gehalt);
		assertEquals(28,this.data.team.trainer[1].vertrag);
	}	
}
