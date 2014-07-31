TestCase("ShowteamOverviewTests").prototype = {

	setUp : function() {

		this.site = new OSext.Sites.ShowteamOverview(new OSext.WrappedDocument(document));

		this.data = new OSext.Data();
		this.data.setAktuellenSpieltag(new OSext.Spieltag(3, 45));

		this.data.mintermin.saison = 1;
		this.data.mintermin.zat = 1;

	},

	testSiteChangeTitel : function() {

		/*:DOC += <b>Seitenaenderung</b>*/
		
		try {
			assertFalse(this.site.check());
			fail();
		} catch (e) {
			assertInstanceOf(OSext.SiteChangeError, e);
			assertEquals("Mannschaft/Übersicht -> Überschrift wurde geändert!", e.message);
		}
	},

	testSiteChangeNoTable : function() {

		/*:DOC += <b>FC Cork - 2. Liga A<a href="">Irland</a></b>*/
		
		try {
			assertFalse(this.site.check());
			fail();
		} catch (e) {
			assertInstanceOf(OSext.SiteChangeError, e);
			assertEquals("Mannschaft/Übersicht -> Tabelle wurde geändert!", e.message);
		}
	},
	
	testSiteChangeNoTableFooter : function() {
		
		/*:DOC += <b>FC Cork - 2. Liga A<a href="">Irland</a></b>*/
		/*:DOC += <table id="team"><tr><td>#</td><td>Nr.</td><td>Name</td><td>Alter</td><td>Pos</td><td>Auf</td><td></td><td colspan="2">Land</td><td>U</td><td>MOR</td><td>FIT</td><td>Skillschnitt</td><td>Opt.Skill</td><td>S</td><td>Sperre</td><td>Verl.</td><td>T</td><td>TS</td></tr></table>*/
		
		try {
			assertFalse(this.site.check());
			fail();
		} catch (e) {
			assertInstanceOf(OSext.SiteChangeError, e);
			assertEquals("Mannschaft/Übersicht -> Tabelle wurde geändert!", e.message);
		}
	},

	testSiteChangeTableColumnCount : function() {

		/*:DOC += <b>FC Cork - 2. Liga A<a href="">Irland</a></b>*/
		/*:DOC += <table id="team"><tr><td>#</td></tr>
		 						   <tr><td>#</td></tr></table>*/
		
		try {
			assertFalse(this.site.check());
			fail();
		} catch (e) {
			assertInstanceOf(OSext.SiteChangeError, e);
			assertEquals("Mannschaft/Übersicht -> Tabelle wurde geändert!", e.message);
		}
	},

	testSiteChangeTableColumnName : function() {

		/*:DOC += <b>FC Cork - 2. Liga A<a href="">Irland</a></b>*/
		/*:DOC += <table id="team"><tr><td>???</td><td>Nr.</td><td>Name</td><td>Alter</td><td>Pos</td><td>Auf</td><td></td><td colspan="2">Land</td><td>U</td><td>MOR</td><td>FIT</td><td>Skillschnitt</td><td>Opt.Skill</td><td>S</td><td>Sperre</td><td>Verl.</td><td>T</td><td>TS</td></tr>
		 						   <tr><td>???</td><td>Nr.</td><td>Name</td><td>Alter</td><td>Pos</td><td>Auf</td><td></td><td colspan="2">Land</td><td>U</td><td>MOR</td><td>FIT</td><td>Skillschnitt</td><td>Opt.Skill</td><td>S</td><td>Sperre</td><td>Verl.</td><td>T</td><td>TS</td></tr></table>*/
		
		try {
			assertFalse(this.site.check());
			fail();
		} catch (e) {
			assertInstanceOf(OSext.SiteChangeError, e);
			assertEquals("Mannschaft/Übersicht -> Tabellenspalten wurden geändert!", e.message);
		}
	},

	testDemoTeam : function() {

		/*:DOC += <b>DemoTeam - <a href="">Landesforum</a></b>*/
		/*:DOC += <table id="team"><tr><td>#</td><td>Nr.</td><td>Name</td><td>Alter</td><td>Pos</td><td>Auf</td><td></td><td colspan="2">Land</td><td>U</td><td>MOR</td><td>FIT</td><td>Skillschnitt</td><td>Opt.Skill</td><td>S</td><td>Sperre</td><td>Verl.</td><td>T</td><td>TS</td></tr>
		 						   <tr><td>#</td><td>Nr.</td><td>Name</td><td>Alter</td><td>Pos</td><td>Auf</td><td></td><td colspan="2">Land</td><td>U</td><td>MOR</td><td>FIT</td><td>Skillschnitt</td><td>Opt.Skill</td><td>S</td><td>Sperre</td><td>Verl.</td><td>T</td><td>TS</td></tr></table>*/
		
		try {
			assertFalse(this.site.check());
			fail();
		} catch (e) {
			assertInstanceOf(OSext.AuthenticationError, e);
		}
	},
		
	testExtract : function() {

		/*:DOC += <table id="team">
		 	<tr><td>#</td><td>Nr.</td><td>Name</td><td>Alter</td><td>Pos</td><td>Auf</td><td></td><td colspan="2">Land</td><td>U</td><td>MOR</td><td>FIT</td><td>Skillschnitt</td><td>Opt.Skill</td><td>S</td><td>Sperre</td><td>Verl.</td><td>T</td><td>TS</td></tr>
		 	<tr><td>1</td><td>1</td><td><a href="javascript:spielerinfo(26109)">Philip Croly</a></td><td>31</td><td>TOR</td><td colspan="2">TOR</td><td><img /></td><td>IRL</td><td></td><td>99</td><td>72</td><td>52.71</td><td>78.96</td><td>E</td><td><abbr title="1 Ligaspiele">1L</abbr></td><td>0</td><td>N</td><td>0</td></tr>
		 	<tr><td>#</td><td>Nr.</td><td>Name</td><td>Alter</td><td>Pos</td><td>Auf</td><td></td><td colspan="2">Land</td><td>U</td><td>MOR</td><td>FIT</td><td>Skillschnitt</td><td>Opt.Skill</td><td>S</td><td>Sperre</td><td>Verl.</td><td>T</td><td>TS</td></tr>
		 	</table>*/
		
		this.site.extract(this.data);
		
		assertEquals(1,this.data.team.spieler.length);
		assertEquals(26109,this.data.team.spieler[0].id);
		assertEquals("TOR",this.data.team.spieler[0].pos);
		assertEquals("Philip Croly",this.data.team.spieler[0].name);
		assertEquals("IRL",this.data.team.spieler[0].land);
		assertEquals("",this.data.team.spieler[0].uefa);
		assertEquals(52.71,this.data.team.spieler[0].skillschnitt);
		assertEquals(78.96,this.data.team.spieler[0].opti);
		assertNull(this.data.team.spieler[0].verletzung);
		assertEquals(1,this.data.team.spieler[0].status);
		assertNull(this.data.team.spieler[0].tstatus);
		assertNull(this.data.team.spieler[0].tsperre);
		assertNotNull(this.data.team.spieler[0].sperren)
		assertEquals(OSext.SPIELART.LIGA,this.data.team.spieler[0].sperren[0].art);
		assertEquals(1,this.data.team.spieler[0].sperren[0].dauer);
	},
	
	testExtend : function() {
		
		/*:DOC += <table id="team">
	 		<tr><td>#</td><td>Nr.</td><td>Name</td><td>Alter</td><td>Pos</td><td>Auf</td><td></td><td colspan="2">Land</td><td>U</td><td>MOR</td><td>FIT</td><td>Skillschnitt</td><td>Opt.Skill</td><td>S</td><td>Sperre</td><td>Verl.</td><td>T</td><td>TS</td></tr>
		 	<tr><td>1</td><td>1</td><td><a href="javascript:spielerinfo(26109)">Philip Croly</a></td><td>31</td><td>TOR</td><td colspan="2">TOR</td><td><img /></td><td>IRL</td><td></td><td>99</td><td>72</td><td>52.71</td><td>78.96</td><td>E</td><td><abbr title="1 Ligaspiele">1L</abbr></td><td>0</td><td>N</td><td>0</td></tr>
		 	<tr><td>#</td><td>Nr.</td><td>Name</td><td>Alter</td><td>Pos</td><td>Auf</td><td></td><td colspan="2">Land</td><td>U</td><td>MOR</td><td>FIT</td><td>Skillschnitt</td><td>Opt.Skill</td><td>S</td><td>Sperre</td><td>Verl.</td><td>T</td><td>TS</td></tr>
		 	</table>*/

		this.site.extend(this.data);
		
		var rows = document.getElementById("team").rows;
		assertEquals(3,rows.length);
		assertEquals(23,rows[0].cells.length);
		
		assertMatch(/\s+Bilanz/,rows[0].cells[18].textContent);
		assertMatch(/\s+Training/,rows[0].cells[19].textContent);
		assertMatch(/\s+.P/,rows[0].cells[20].textContent);
		assertMatch(/\s+.N/,rows[0].cells[21].textContent);
		assertMatch(/\s+.U/,rows[0].cells[22].textContent);
	},
	
	testUpdate : function() {
		
		/*:DOC += <b>FC Cork - 2. Liga A<a href="">Irland</a></b>*/
		/*:DOC += <table id="team">
	 		<tr><td>#</td><td>Nr.</td><td>Name</td><td>Alter</td><td>Pos</td><td>Auf</td><td></td><td colspan="2">Land</td><td>U</td><td>MOR</td><td>FIT</td><td>Skillschnitt</td><td>Opt.Skill</td><td>S</td><td>Sperre</td><td>Verl.</td><td>T</td><td>TS</td></tr>
		 	<tr><td>1</td><td>1</td><td><a href="javascript:spielerinfo(26109)">Philip Croly</a></td><td>31</td><td>TOR</td><td colspan="2">TOR</td><td><img /></td><td>IRL</td><td></td><td>99</td><td>72</td><td>52.71</td><td>78.96</td><td>E</td><td><abbr title="1 Ligaspiele">1L</abbr></td><td>0</td><td>N</td><td>0</td></tr>
	 		<tr><td>#</td><td>Nr.</td><td>Name</td><td>Alter</td><td>Pos</td><td>Auf</td><td></td><td colspan="2">Land</td><td>U</td><td>MOR</td><td>FIT</td><td>Skillschnitt</td><td>Opt.Skill</td><td>S</td><td>Sperre</td><td>Verl.</td><td>T</td><td>TS</td></tr>
	 		</table>*/
		
		this.site.extract(this.data);
		this.site.extend(this.data);

		this.site.update(this.data);

		assertEquals("78.96",document.getElementById("team").rows[1].cells[12].textContent);
	},	
	
	testUpdateNoData : function() {
		
		/*:DOC += <b>FC Cork - 2. Liga A<a href="">Irland</a></b>*/
		/*:DOC += <table id="team">
		 	<tr><td>#</td><td>Nr.</td><td>Name</td><td>Alter</td><td>Pos</td><td>Auf</td><td></td><td colspan="2">Land</td><td>U</td><td>MOR</td><td>FIT</td><td>Skillschnitt</td><td>Opt.Skill</td><td>S</td><td>Sperre</td><td>Verl.</td><td>T</td><td>TS</td></tr>
		 	<tr><td>1</td><td>1</td><td><a href="javascript:spielerinfo(26109)">Philip Croly</a></td><td>31</td><td>TOR</td><td colspan="2">TOR</td><td><img /></td><td>IRL</td><td></td><td>99</td><td>72</td><td>52.71</td><td>78.96</td><td>E</td><td><abbr title="1 Ligaspiele">1L</abbr></td><td>0</td><td>N</td><td>0</td></tr>
		 	<tr><td>#</td><td>Nr.</td><td>Name</td><td>Alter</td><td>Pos</td><td>Auf</td><td></td><td colspan="2">Land</td><td>U</td><td>MOR</td><td>FIT</td><td>Skillschnitt</td><td>Opt.Skill</td><td>S</td><td>Sperre</td><td>Verl.</td><td>T</td><td>TS</td></tr>
		 	</table>*/
		
		this.site.extract(this.data);
		this.site.extend(this.data);
		this.data.team.spieler[0].id = 666;
		this.site.update(this.data);

		assertEquals("Philip Croly",document.getElementById("team").rows[1].cells[2].textContent);
		assertEquals("",document.getElementById("team").rows[1].cells[12].textContent);
	}
}
