TestCase("VertraegeTests").prototype = {

	setUp : function() {

		this.site = new OSext.Sites.Vt(new OSext.WrappedDocument(document));

		this.data = new OSext.Data();
	},

	testSiteChangeNoTable : function() {

		/*:DOC += <div><div/></div>*/

		try {
			assertFalse(this.site.check());
			fail();
		} catch (e) {
			assertInstanceOf(OSext.SiteChangeError, e);
			assertEquals("Verträge verlängern -> Tabelle wurde geändert!", e.message);
		}
	},
	
	testSiteChangeTableColumnCount : function() {

		/*:DOC += <div>
					<table>
					  <tr><td>Alter</td></tr>
					  <tr><td>18</td></tr>
		 		  	</table>
		 		  </div>*/
		
		try {
			assertFalse(this.site.check());
			fail();
		} catch (e) {
			assertInstanceOf(OSext.SiteChangeError, e);
			assertEquals("Verträge verlängern -> Tabelle wurde geändert!", e.message);
		}
	},

	testSiteChangeTableColumnName : function() {

		/*:DOC += <div>
					<table>
					  <tr><td>XYZ</td><td>Alter</td><td>Land</td><td>Gehalt</td><td>Laufzeit</td><td>Skillschnitt</td><td>Opt. Skill</td><td>24</td><td>Monate</td><td>36</td><td>Monate</td><td>48</td><td>Monate</td><td>60</td><td>Monate</td></tr>
					  <tr><td><a href="javascript:spielerinfo(26109)">Philip Croly</a></td><td>34</td><td>IRL&nbsp;</td><td>67.936</td><td>3</td><td>56.00</td><td>81.04</td><td><input type="radio"></td><td>76.661</td><td><input type="radio"></td><td>70.469</td><td><input type="radio"></td><td>64.778</td><td><input type="radio"></td><td>59.547</td></tr>
		 		    </table>
		 		  </div>*/
		
		try {
			assertFalse(this.site.check());
			fail();
		} catch (e) {
			assertInstanceOf(OSext.SiteChangeError, e);
			assertEquals("Verträge verlängern -> Tabellenspalten wurden geändert!", e.message);
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

		/*:DOC += <div>
					<table/>
					<table>
					  <tr><td>Name</td><td>Alter</td><td>Land</td><td>Gehalt</td><td>Laufzeit</td><td>Skillschnitt</td><td>Opt. Skill</td><td>24</td><td>Monate</td><td>36</td><td>Monate</td><td>48</td><td>Monate</td><td>60</td><td>Monate</td></tr>
					  <tr><td><a href="javascript:spielerinfo(26109)">Philip Croly</a></td><td>34</td><td>IRL&nbsp;</td><td>67.936</td><td>3</td><td>56.00</td><td>81.04</td><td><input type="radio"></td><td>76.661</td><td><input type="radio"></td><td>70.469</td><td><input type="radio"></td><td>64.778</td><td><input type="radio"></td><td>59.547</td></tr>
		 		    </table>
		 		  </div>*/
		
		this.data.team.spieler[0] = new OSext.Kaderspieler();
		this.data.team.spieler[0].id = 26109;
		
		this.site.extract(this.data);
		
		assertEquals(76661,this.data.team.spieler[0].gehalt24);		
		assertEquals(70469,this.data.team.spieler[0].gehalt36);		
		assertEquals(64778,this.data.team.spieler[0].gehalt48);		
		assertEquals(59547,this.data.team.spieler[0].gehalt60);		
	}
}
