TestCase("ShowteamContractsTests").prototype = {

	setUp : function() {

		this.site = new OSext.Sites.ShowteamContracts(new OSext.WrappedDocument(document));

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
			assertEquals("Mannschaft/Verträge -> Überschrift wurde geändert!", e.message);
		}
	},

	testSiteChangeNoTable : function() {

		/*:DOC += <b>FC Cork - 2. Liga A<a href="">Irland</a></b>*/
		
		try {
			assertFalse(this.site.check());
			fail();
		} catch (e) {
			assertInstanceOf(OSext.SiteChangeError, e);
			assertEquals("Mannschaft/Verträge -> Tabelle wurde geändert!", e.message);
		}
	},
	
	testSiteChangeNoTableFooter : function() {
		
		/*:DOC += <b>FC Cork - 2. Liga A<a href="">Irland</a></b>*/
		/*:DOC += <table id="team"><tr><td>#</td><td>Nr.</td><td>Name</td><td>Alter</td><td>Pos</td><td></td><td colspan="2" align="center">Land</td><td>U</td><td>Skillschnitt</td><td>Opt.Skill</td><td>Vertrag</td><td>Monatsgehalt</td><td>Spielerwert</td><td>TS</td></tr></table>*/
		
		try {
			assertFalse(this.site.check());
			fail();
		} catch (e) {
			assertInstanceOf(OSext.SiteChangeError, e);
			assertEquals("Mannschaft/Verträge -> Tabelle wurde geändert!", e.message);
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
			assertEquals("Mannschaft/Verträge -> Tabelle wurde geändert!", e.message);
		}
	},

	testSiteChangeTableColumnName : function() {

		/*:DOC += <b>FC Cork - 2. Liga A<a href="">Irland</a></b>*/
		/*:DOC += <table id="team"><tr><td>???</td><td>Nr.</td><td>Name</td><td>Alter</td><td>Pos</td><td></td><td colspan="2" align="center">Land</td><td>U</td><td>Skillschnitt</td><td>Opt.Skill</td><td>Vertrag</td><td>Monatsgehalt</td><td>Spielerwert</td><td>TS</td></tr>
		 						   <tr><td>???</td><td>Nr.</td><td>Name</td><td>Alter</td><td>Pos</td><td></td><td colspan="2" align="center">Land</td><td>U</td><td>Skillschnitt</td><td>Opt.Skill</td><td>Vertrag</td><td>Monatsgehalt</td><td>Spielerwert</td><td>TS</td></tr></table>*/
		
		try {
			assertFalse(this.site.check());
			fail();
		} catch (e) {
			assertInstanceOf(OSext.SiteChangeError, e);
			assertEquals("Mannschaft/Verträge -> Tabellenspalten wurden geändert!", e.message);
		}
	},

	testDemoTeam : function() {

		/*:DOC += <b>DemoTeam - <a href="">Landesforum</a></b>*/
		/*:DOC += <table id="team"><tr><td>#</td><td>Nr.</td><td>Name</td><td>Alter</td><td>Pos</td><td></td><td colspan="2" align="center">Land</td><td>U</td><td>Skillschnitt</td><td>Opt.Skill</td><td>Vertrag</td><td>Monatsgehalt</td><td>Spielerwert</td><td>TS</td></tr>
		 						   <tr><td>#</td><td>Nr.</td><td>Name</td><td>Alter</td><td>Pos</td><td></td><td colspan="2" align="center">Land</td><td>U</td><td>Skillschnitt</td><td>Opt.Skill</td><td>Vertrag</td><td>Monatsgehalt</td><td>Spielerwert</td><td>TS</td></tr></table>*/
		
		try {
			assertFalse(this.site.check());
			fail();
		} catch (e) {
			assertInstanceOf(OSext.AuthenticationError, e);
		}
	},
		
	testExtract : function() {

		/*:DOC += <table id="team">
		<tr><td>#</td><td>Nr.</td><td>Name</td><td>Alter</td><td>Pos</td><td></td><td colspan="2" align="center">Land</td><td>U</td><td>Skillschnitt</td><td>Opt.Skill</td><td>Vertrag</td><td>Monatsgehalt</td><td>Spielerwert</td><td>TS</td></tr>
		<tr><td>1</td><td>1</td><td><a href="javascript:spielerinfo(26109)">Philip Croly</a></td><td>32</td><td colspan="2">TOR</td><td><img /></td><td><abbr title="Irland">IRL</abbr></td><td></td><td>53.76</td><td>79.63</td><td>21</td><td>84.396</td><td>9.488.401</td><td>0</td></tr>
		<tr><td>#</td><td>Nr.</td><td>Name</td><td>Alter</td><td>Pos</td><td></td><td colspan="2" align="center">Land</td><td>U</td><td>Skillschnitt</td><td>Opt.Skill</td><td>Vertrag</td><td>Monatsgehalt</td><td>Spielerwert</td><td>TS</td></tr>
		</table>*/
		
		this.site.extract(this.data);
		
		assertEquals(1,this.data.team.spieler.length);
		assertEquals(21,this.data.team.spieler[0].vertrag);
		assertEquals(84396,this.data.team.spieler[0].gehalt);
		assertEquals(9488401,this.data.team.spieler[0].mw);
	},
	
	testExtend : function() {
		
		/*:DOC += <table id="team">
		<tr><td>#</td><td>Nr.</td><td>Name</td><td>Alter</td><td>Pos</td><td></td><td colspan="2" align="center">Land</td><td>U</td><td>Skillschnitt</td><td>Opt.Skill</td><td>Vertrag</td><td>Monatsgehalt</td><td>Spielerwert</td><td>TS</td></tr>
		<tr><td>1</td><td>1</td><td><a href="javascript:spielerinfo(26109)">Philip Croly</a></td><td>32</td><td colspan="2">TOR</td><td><img /></td><td><abbr title="Irland">IRL</abbr></td><td></td><td>53.76</td><td>79.63</td><td>21</td><td>84.396</td><td>9.488.401</td><td>0</td></tr>
		<tr><td>#</td><td>Nr.</td><td>Name</td><td>Alter</td><td>Pos</td><td></td><td colspan="2" align="center">Land</td><td>U</td><td>Skillschnitt</td><td>Opt.Skill</td><td>Vertrag</td><td>Monatsgehalt</td><td>Spielerwert</td><td>TS</td></tr>
		</table>*/

		this.site.extract(this.data);
		this.site.extend(this.data);
		var rows = document.getElementById("team").rows;
		assertEquals(3,rows.length);
		assertEquals(17,rows[0].cells.length);
		
		assertMatch(/\s+.TF/,rows[0].cells[14].textContent);
		assertMatch(/\s+.Blitzwert/,rows[0].cells[15].textContent);
		assertMatch(/\s+.Blitz-Zat/,rows[0].cells[16].textContent);
		assertEquals("-3 / 473 / 533 / 593 / 653 / 714 / 54 / 114 / 174 / 234 / 294 / 354 / 414 / 474 / 534 / 594 / 654 / 71",rows[1].cells[16].textContent);
	},
	
	testUpdate : function() {
		
		/*:DOC += <table id="team">
		<tr><td>#</td><td>Nr.</td><td>Name</td><td>Alter</td><td>Pos</td><td></td><td colspan="2" align="center">Land</td><td>U</td><td>Skillschnitt</td><td>Opt.Skill</td><td>Vertrag</td><td>Monatsgehalt</td><td>Spielerwert</td><td>TS</td></tr>
		<tr><td>1</td><td>1</td><td><a href="javascript:spielerinfo(26109)">Philip Croly</a></td><td>32</td><td colspan="2">TOR</td><td><img /></td><td><abbr title="Irland">IRL</abbr></td><td></td><td>53.76</td><td>79.63</td><td>21</td><td>84.396</td><td>9.488.401</td><td>0</td></tr>
		<tr><td>#</td><td>Nr.</td><td>Name</td><td>Alter</td><td>Pos</td><td></td><td colspan="2" align="center">Land</td><td>U</td><td>Skillschnitt</td><td>Opt.Skill</td><td>Vertrag</td><td>Monatsgehalt</td><td>Spielerwert</td><td>TS</td></tr>
		</table>*/
		
		this.site.extract(this.data);
		
		this.data.team.spieler[0].status = OSext.STATUS.AKTIV;
		this.data.team.spieler[0].skillschnitt = 53.76;
		this.data.team.spieler[0].opti = 79.63;
		
		this.site.extend(this.data);
		
		this.site.update(this.data);

		assertEquals("84.396",document.getElementById("team").rows[1].cells[11].textContent);
	}	
}
