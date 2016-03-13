TestCase("JugendOverviewTests").prototype = {

	setUp : function() {

		this.site = new OSext.Sites.JugendOverview(new OSext.WrappedDocument(document));

		this.data = new OSext.Data();
		this.data.setAktuellenSpieltag(new OSext.Spieltag(3, 45));

	},

	testSiteHochziehen : function() {
		
		/*:DOC += <b>Jugendspieler ins A-Team berufen</b>*/
		
		try {
			assertFalse(this.site.check());
		} catch (e) {
			fail();
		}
	},
	
	testSiteChangeNoTable : function() {

		/*:DOC += <div><table/></div>*/

		try {
			assertFalse(this.site.check());
			fail();
		} catch (e) {
			assertInstanceOf(OSext.SiteChangeError, e);
			assertEquals("Jugend/Übersicht -> Tabelle wurde geändert!", e.message);
		}
	},
	
	testSiteChangeTableColumnCount : function() {

		/*:DOC += <div>
					<table/>
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
			assertEquals("Jugend/Übersicht -> Tabelle wurde geändert!", e.message);
		}
	},

	testSiteChangeTableColumnName : function() {

		/*:DOC += <div>
					<table/>
					<table>
					  <tr><td>#</td><td>Geb.</td><td colspan="2">Land</td><td>U</td><td>Skillschnitt</td><td>Talent</td><td>Aktion</td><td>Aufwertung</td></tr>
					  <tr><td>18</td><td>42</td><td><img src="images/flaggen/IRL.gif"></td><td><abbr title="Irland">IRL</abbr></td><td></td><td>34.24</td><td>normal</td><td><input type="radio" value="11701" name="ziehmich"></td><td>+1 ZUV</td></tr>
		 		    </table>
		 		  </div>*/
		
		try {
			assertFalse(this.site.check());
			fail();
		} catch (e) {
			assertInstanceOf(OSext.SiteChangeError, e);
			assertEquals("Jugend/Übersicht -> Tabellenspalten wurden geändert!", e.message);
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
				
	testExtract : function() {

		/*:DOC += <div>
					<table/>
					<table>
					  <tr><td>Alter</td><td>Geb.</td><td colspan="2">Land</td><td>U</td><td>Skillschnitt</td><td>Talent</td><td>Aktion</td><td>Aufwertung</td></tr>
					  <tr><td>18</td><td>42</td><td><img src="images/flaggen/IRL.gif"></td><td><abbr title="Irland">IRL</abbr></td><td></td><td>34.24</td><td>normal</td><td><input type="radio" value="11701" name="ziehmich"></td><td>+1 ZUV</td></tr>
					  <tr><td colspan="75">Hochziehen</td></tr>
		 		    </table>
		 		  </div>*/
		
		this.site.extract(this.data);
		
		assertEquals(1,this.data.team.jugend.length);
		assertEquals(-1,this.data.team.jugend[0].id);
		assertEquals(18,this.data.team.jugend[0].alter);
		assertEquals(42,this.data.team.jugend[0].geburtstag);
		assertEquals(1,this.data.team.jugend[0].nr);
		assertEquals("IRL",this.data.team.jugend[0].land);
		assertEquals("",this.data.team.jugend[0].uefa);
		assertNull(this.data.team.jugend[0].pos);
		assertEquals("normal",this.data.team.jugend[0].talent);
		assertEquals(1,this.data.team.jugend[0].aufwertungen);
		
	},
	
	testExtend : function() {
		
		/*:DOC += <div>
					<table/>
					<table>
					  <tr><td>Alter</td><td>Geb.</td><td colspan="2">Land</td><td>U</td><td>Skillschnitt</td><td>Talent</td><td>Aktion</td><td>Aufwertung</td></tr>
					  <tr><td>18</td><td>42</td><td><img src="images/flaggen/IRL.gif"></td><td><abbr title="Irland">IRL</abbr></td><td></td><td>34.24</td><td>normal</td><td><input type="radio" value="11701" name="ziehmich"></td><td>+1 ZUV</td></tr>
					  <tr><td colspan="75">Hochziehen</td></tr>
				    </table>
				  </div>*/

		this.site.extract(this.data);
		this.site.extend(this.data);

		var rows = document.getElementsByTagName("table")[1].rows;
		assertEquals(16,rows[0].cells.length);
		
		assertEquals("Pos",rows[0].cells[2].textContent);
		assertMatch(/\s+Opt.Skill/,rows[0].cells[6].textContent);
		assertMatch(/\s+.Marktwert/,rows[0].cells[10].textContent);
		assertMatch(/\s+.Bilanz/,rows[0].cells[11].textContent);
		assertMatch(/\s+.Aufw./,rows[0].cells[12].textContent);
		assertMatch(/\s+.P/,rows[0].cells[13].textContent);
		assertMatch(/\s+.N/,rows[0].cells[14].textContent);
		assertMatch(/\s+.U/,rows[0].cells[15].textContent);
	},
	
	testUpdate : function() {
		
		/*:DOC += <div>
					<table/>
					<table>
					  <tr><td>Alter</td><td>Geb.</td><td colspan="2">Land</td><td>U</td><td>Skillschnitt</td><td>Talent</td><td>Aktion</td><td>Aufwertung</td></tr>
					  <tr><td>18</td><td>42</td><td><img src="images/flaggen/IRL.gif"></td><td><abbr title="Irland">IRL</abbr></td><td></td><td>34.24</td><td>normal</td><td><input type="radio" value="11701" name="ziehmich"></td><td>+1 ZUV</td></tr>
					  <tr><td colspan="75">Hochziehen</td></tr>
				    </table>
				  </div>*/
		
		this.site.extract(this.data);
		this.site.extend(this.data);

		this.data.ansicht.jugend.getSpieler = function() {
			updated = [];
			updated[0] = new OSext.Jugendspieler();
			updated[0].alter = 17;
			updated[0].pos = "ABW";
			updated[0].skills = [34,36,70,76,75,40,0,12,31,30,45,41,20,23,87,66,50];
			return updated;
		};
		
		this.site.update(this.data);

		var rows = document.getElementsByTagName("table")[1].rows;
		assertEquals("17",rows[1].cells[0].textContent);
		assertEquals("ABW",rows[1].cells[2].textContent);
		assertEquals("69.78",rows[1].cells[7].textContent);
	}
}
