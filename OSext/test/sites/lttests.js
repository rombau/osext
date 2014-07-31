
TestCase("LigatabelleTests").prototype = {

	setUp : function() {
		
		this.site = new OSext.Sites.Lt(new OSext.WrappedDocument(document));
		
		this.data = new OSext.Data();
		this.data.team = new OSext.Team(19, "FC Cork");

	},
	
	testSiteChangeNoLigaSelect : function() {

		/*:DOC += <div>
		 		  <input type="submit" name="stataktion" value="Statistik ausgeben">
				  <table id="kader1"><tr><td></td></tr></table>
				  </div>*/
		
		try {
			assertFalse(this.site.check());
			fail();
		} catch (e) {
			assertInstanceOf(OSext.SiteChangeError, e);
			assertEquals("Ligatabelle -> Ligaauswahl wurde entfernt!", e.message);
		}
	},

	testSiteChangeNoTable : function() {

		/*:DOC += <div>
				  <select name="ligaauswahl" size="1"><option value="0">---Ligaauswahl---</option><option value="1">1. Liga</option><option selected="" value="2">2. Liga A</option><option value="3">2. Liga B</option><option value="4">3. Liga A</option><option value="5">3. Liga B</option><option value="6">3. Liga C</option><option value="7">3. Liga D</option></select>
				  <input type="submit" name="stataktion" value="Statistik ausgeben"> 
				  </div>*/
		
		try {
			assertFalse(this.site.check());
			fail();
		} catch (e) {
			assertInstanceOf(OSext.SiteChangeError, e);
			assertEquals("Ligatabelle -> Tabelle wurde entfernt!", e.message);
		}
	},

	testSiteChangeNoButton : function() {

		/*:DOC += <div>
				  <select name="ligaauswahl" size="1"><option value="0">---Ligaauswahl---</option><option value="1">1. Liga</option><option selected="" value="2">2. Liga A</option><option value="3">2. Liga B</option><option value="4">3. Liga A</option><option value="5">3. Liga B</option><option value="6">3. Liga C</option><option value="7">3. Liga D</option></select>
				  </div>*/
		
		try {
			assertFalse(this.site.check());
			fail();
		} catch (e) {
			assertInstanceOf(OSext.SiteChangeError, e);
			assertEquals("Ligatabelle -> Button wurde entfernt!", e.message);
		}
	},

	testSiteChangeTableColumnCount : function() {

		/*:DOC += <div>
		 		  <select name="ligaauswahl" size="1"><option value="0">---Ligaauswahl---</option><option value="1">1. Liga</option><option selected="" value="2">2. Liga A</option><option value="3">2. Liga B</option><option value="4">3. Liga A</option><option value="5">3. Liga B</option><option value="6">3. Liga C</option><option value="7">3. Liga D</option></select>
		 		  <input type="submit" name="stataktion" value="Statistik ausgeben">
		 		  <table id="kader1"><tr><td></td></tr><tr><td></td></tr></table>
				  </div>*/
		
		try {
			assertFalse(this.site.check());
			fail();
		} catch (e) {
			assertInstanceOf(OSext.SiteChangeError, e);
			assertEquals("Ligatabelle -> Tabelle wurde geändert!", e.message);
		}
	},

	testSiteChangeTableColumnName : function() {

		/*:DOC += <div>
		 		  <select name="ligaauswahl" size="1"><option value="0">---Ligaauswahl---</option><option value="1">1. Liga</option><option selected="" value="2">2. Liga A</option><option value="3">2. Liga B</option><option value="4">3. Liga A</option><option value="5">3. Liga B</option><option value="6">3. Liga C</option><option value="7">3. Liga D</option></select>
		 		  <input type="submit" name="stataktion" value="Statistik ausgeben">
		 		  <table id="kader1">
					<tr><td>Pos</td><td>changed</td><td>Club</td><td>Spiele</td><td>Si.</td><td>Un.</td><td>Ni.</td><td>Tore+</td><td>Tore-</td><td>Tore +/-</td><td>Punkte</td></tr>
					<tr><td>1</td><td></td><td>FC Cork</td><td>Spiele</td><td>Si.</td><td>Un.</td><td>Ni.</td><td>Tore+</td><td>Tore-</td><td>Tore +/-</td><td>Punkte</td></tr>
				  </table>
				  </div>*/
		
		try {
			assertFalse(this.site.check());
			fail();
		} catch (e) {
			assertInstanceOf(OSext.SiteChangeError, e);
			assertEquals("Ligatabelle -> Tabellenspalten wurden geändert!", e.message);
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
		 		  <select name="ligaauswahl" size="1"><option value="0">---Ligaauswahl---</option><option value="1">1. Liga</option><option selected="" value="2">2. Liga A</option><option value="3">2. Liga B</option><option value="4">3. Liga A</option><option value="5">3. Liga B</option><option value="6">3. Liga C</option><option value="7">3. Liga D</option></select>
		 		  <input type="submit" name="stataktion" value="Statistik ausgeben">
		 		  <table id="kader1">
					<tr><td>#</td><td></td><td>Club</td><td>Spiele</td><td>Si.</td><td>Un.</td><td>Ni.</td><td>Tore+</td><td>Tore-</td><td>Tore +/-</td><td>Punkte</td></tr>
					<tr><td>1</td><td></td><td><a href="javascript:teaminfo(19)">FC Cork</a></td><td>Spiele</td><td>Si.</td><td>Un.</td><td>Ni.</td><td>Tore+</td><td>Tore-</td><td>Tore +/-</td><td>Punkte</td></tr>
					<tr><td>2</td><td></td><td><a href="javascript:teaminfo(1)">AFC</a></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
					<tr><td>3</td><td></td><td><a href="javascript:teaminfo(2)">Tralee</a></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
				  </table>
				  </div>*/
		
		this.site.extract(this.data);		

		assertEquals(2,this.data.liga);
		assertEquals(3,this.data.ligagroesse);
		assertEquals(1,this.data.team.platzierung);
	},

	testExtendToolbarOnly : function() {

		/*:DOC += <div>
				  <select name="ligaauswahl" size="1"><option value="0">---Ligaauswahl---</option><option value="1">1. Liga</option><option selected="" value="2">2. Liga A</option><option value="3">2. Liga B</option><option value="4">3. Liga A</option><option value="5">3. Liga B</option><option value="6">3. Liga C</option><option value="7">3. Liga D</option></select>
				  <input type="submit" name="stataktion" value="Statistik ausgeben">
				  <table id="kader1">
					<tr><td>#</td><td></td><td>Club</td><td>Spiele</td><td>Si.</td><td>Un.</td><td>Ni.</td><td>Tore+</td><td>Tore-</td><td>Tore +/-</td><td>Punkte</td></tr>
					<tr><td>1</td><td></td><td><a href="javascript:teaminfo(19)">FC Cork</a></td><td>Spiele</td><td>Si.</td><td>Un.</td><td>Ni.</td><td>Tore+</td><td>Tore-</td><td>Tore +/-</td><td>Punkte</td></tr>
					<tr><td>2</td><td></td><td><a href="javascript:teaminfo(1)">AFC</a></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
					<tr><td>3</td><td></td><td><a href="javascript:teaminfo(2)">Tralee</a></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
				  </table>
				  </div>*/

		
		this.site.extract(this.data);
		var queue = this.site.extend(this.data);

		assertNotNull(document.getElementById("osext-extended"));
		assertFalse(document.getElementById("osext-extended").checked);		
		assertNull(queue);

	},

	testExtend : function() {

		/*:DOC += <div>
				  <select name="ligaauswahl" size="1"><option value="0">---Ligaauswahl---</option><option value="1">1. Liga</option><option selected="" value="2">2. Liga A</option><option value="3">2. Liga B</option><option value="4">3. Liga A</option><option value="5">3. Liga B</option><option value="6">3. Liga C</option><option value="7">3. Liga D</option></select>
				  <input type="submit" name="stataktion" value="Statistik ausgeben">
				  <table id="kader1">
					<tr><td>#</td><td></td><td>Club</td><td>Spiele</td><td>Si.</td><td>Un.</td><td>Ni.</td><td>Tore+</td><td>Tore-</td><td>Tore +/-</td><td>Punkte</td></tr>
					<tr><td>1</td><td></td><td><a href="javascript:teaminfo(19)">FC Cork</a></td><td>Spiele</td><td>Si.</td><td>Un.</td><td>Ni.</td><td>Tore+</td><td>Tore-</td><td>Tore +/-</td><td>Punkte</td></tr>
					<tr><td>2</td><td></td><td><a href="javascript:teaminfo(1)">AFC</a></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
					<tr><td>3</td><td></td><td><a href="javascript:teaminfo(2)">Tralee</a></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
				  </table>
				  </div>*/

		
		this.site.extract(this.data);
		this.data.ansicht.liga.extended = true;
		
		var queue = this.site.extend(this.data);

		assertNotNull(queue);
		assertEquals(2,queue.sitequeue.length);
		assertEquals(1,queue.sitequeue[0].params.c);
		assertEquals(2,queue.sitequeue[1].params.c);
	},

	testUpdate : function() {
		
		/*:DOC += <div>
				  <select name="ligaauswahl" size="1"><option value="0">---Ligaauswahl---</option><option value="1">1. Liga</option><option selected="" value="2">2. Liga A</option><option value="3">2. Liga B</option><option value="4">3. Liga A</option><option value="5">3. Liga B</option><option value="6">3. Liga C</option><option value="7">3. Liga D</option></select>
				  <input type="submit" name="stataktion" value="Statistik ausgeben">
				  <table id="kader1">
					<tr><td>#</td><td></td><td>Club</td><td>Spiele</td><td>Si.</td><td>Un.</td><td>Ni.</td><td>Tore+</td><td>Tore-</td><td>Tore +/-</td><td>Punkte</td></tr>
					<tr><td>1</td><td></td><td><a href="javascript:teaminfo(19)">FC Cork</a></td><td>Spiele</td><td>Si.</td><td>Un.</td><td>Ni.</td><td>Tore+</td><td>Tore-</td><td>Tore +/-</td><td>Punkte</td></tr>
					<tr><td>2</td><td></td><td><a href="javascript:teaminfo(1)">AFC</a></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
					<tr><td>3</td><td></td><td><a href="javascript:teaminfo(2)">Tralee</a></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
				  </table>
				  </div>*/
		
		var refreshrequested = false;
		this.site.extract(this.data);
		this.site.extend(this.data);
		document.getElementsByName("stataktion")[0].addEventListener("click", function () { refreshrequested = true; }, false);
		document.getElementById("osext-extended").checked = "checked";

		this.site.update(this.data);

		assertTrue(this.data.ansicht.liga.extended);
		assertTrue(refreshrequested);
	},	

	testPostProcessing : function() {

		/*:DOC += <div>
				  <select name="ligaauswahl" size="1"><option value="0">---Ligaauswahl---</option><option value="1">1. Liga</option><option selected="" value="2">2. Liga A</option><option value="3">2. Liga B</option><option value="4">3. Liga A</option><option value="5">3. Liga B</option><option value="6">3. Liga C</option><option value="7">3. Liga D</option></select>
				  <input type="submit" name="stataktion" value="Statistik ausgeben">
				  <table id="kader1">
					<tr><td>#</td><td></td><td>Club</td><td>Spiele</td><td>Si.</td><td>Un.</td><td>Ni.</td><td>Tore+</td><td>Tore-</td><td>Tore +/-</td><td>Punkte</td></tr>
					<tr><td>2</td><td></td><td><a href="javascript:teaminfo(1)">AFC</a></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
					<tr><td>3</td><td></td><td><a href="javascript:teaminfo(2)">Tralee</a></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
				  </table>
				  </div>*/

		this.data.externalteams[0] = new OSext.Team(1, "AFC");
		for (var i = 0; i < 21; i++) {

			var spieler = new OSext.Kaderspieler();
			spieler.id = i;
			spieler.pos = ["LEI","TOR","ABW","DMI","MIT","OMI","STU"][i%7];
			spieler.skills = [34+i,36+i,70+i,76+i,75+i,40+i,0+i,12+i,31+i,30+i,45+i,41+i,20+i,23+i,87+i,66+i,50+i];
			spieler.getMarktwert();
			this.data.externalteams[0].spieler[i] = spieler;
		}
		this.data.externalteams[1] = new OSext.Team(2, "Tralee");
		this.data.externalteams[1].spieler = this.data.externalteams[0].spieler;
		
		this.site.postProcessing(this.site.wrappeddoc, this.data);

		var rows = document.getElementById("kader1").rows;

		assertEquals(3,rows.length);
		assertEquals(17,rows[0].cells.length);
		
		assertMatch(/\s+Formation/,rows[0].cells[11].textContent);
		assertMatch(/\s+Skillschn./,rows[0].cells[12].textContent);
		assertMatch(/\s+Opt.Skill/,rows[0].cells[13].textContent);
		assertMatch(/\s+.P/,rows[0].cells[14].textContent);
		assertMatch(/\s+.N/,rows[0].cells[15].textContent);
		assertMatch(/\s+.U/,rows[0].cells[16].textContent);

		assertEquals("3-4-3",rows[1].cells[11].textContent);
		assertEquals("56.57",rows[1].cells[12].textContent);
		assertEquals("76.84",rows[1].cells[13].textContent);
		assertEquals("69.57",rows[1].cells[14].textContent);
		assertEquals("50.03",rows[1].cells[15].textContent);
		assertEquals("58.27",rows[1].cells[16].textContent);
	}
}



