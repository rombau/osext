TestCase("ShowteamStatsTests").prototype = {

	setUp : function() {

		this.site = new OSext.Sites.ShowteamStats(new OSext.WrappedDocument(document));

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
			assertEquals("Mannschaft/Statistik -> Überschrift wurde geändert!", e.message);
		}
	},

	testSiteChangeNoTable : function() {

		/*:DOC += <table><tr><td><table><tr><td><b>FC Cork - 2. Liga A<a href="">Irland</a></b></td></tr></table></td></tr></table>*/		
		
		try {
			assertFalse(this.site.check());
			fail();
		} catch (e) {
			assertInstanceOf(OSext.SiteChangeError, e);
			assertEquals("Mannschaft/Statistik -> Tabelle wurde nicht gefunden!", e.message);
		}
	},
	
	testSiteChangeTableColumnCount1 : function() {

		/*:DOC += <table><tr><td><table><tr><td><b>FC Cork - 2. Liga A<a href="">Irland</a></b></td></tr></table></td></tr></table>*/		
		/*:DOC += <table>
					<tr><td></td><td colspan=3></td><td colspan=4 align=middle>Spiele</td><td colspan=4 align=middle>Tore</td><td colspan=4 align=middle>Vorlagen</td><td colspan=4 align=middle>Score</td><td colspan=4 align=middle>Gelb</td><td colspan=4 align=middle>Rot</td></tr>
					<tr><td>Name</td><td colspan=2 align=middle>Land</td><td>U</td><td>LI</td><td>LP</td><td>IP</td><td>FS</td><td>LI</td><td>LP</td><td>IP</td><td>FS</td><td>LI</td><td>LP</td><td>IP</td><td>FS</td><td>LI</td><td>LP</td><td>IP</td><td>FS</td><td>LI</td><td>LP</td><td>IP</td><td>FS</td><td>LI</td><td>LP</td><td>IP</td><td>FS</td></tr>
					<tr align=right><td class="TOR" align=left><a href="javascript:spielerinfo(26109)">Philip Croly</a></td><td><!-- Flagge --></td><td class="TOR">IRL</td><td class="STU"></td><td class="TOR">22</td><td class="TOR">0</td><td class="TOR">0</td><td class="TOR">2</td><td class="TOR">0</td><td class="TOR">0</td><td class="TOR">0</td><td class="TOR">0</td><td class="TOR">0</td><td class="TOR">0</td><td class="TOR">0</td><td class="TOR">0</td><td class="TOR">0</td><td class="TOR">0</td><td class="TOR">0</td><td class="TOR">0</td><td class="TOR">1</td><td class="TOR">0</td><td class="TOR">0</td><td class="TOR">0</td><td class="TOR">1</td><td class="TOR">0</td><td class="TOR">0</td><td class="TOR">0</td></tr>
					<tr><td>Name</td><td colspan=2 align=middle>Land</td><td>U</td><td>LI</td><td>LP</td><td>IP</td><td>FS</td><td>LI</td><td>LP</td><td>IP</td><td>FS</td><td>LI</td><td>LP</td><td>IP</td><td>FS</td><td>LI</td><td>LP</td><td>IP</td><td>FS</td><td>LI</td><td>LP</td><td>IP</td><td>FS</td><td>LI</td><td>LP</td><td>IP</td><td>FS</td></tr>
					<tr><td></td><td colspan=3></td><td colspan=4 align=middle>Spiele</td><td colspan=4 align=middle>Tore</td><td colspan=4 align=middle>Vorlagen</td><td colspan=4 align=middle>Score</td><td colspan=4 align=middle>Gelb</td><td colspan=4 align=middle>Rot</td></tr>
				  </table>*/
		
		try {
			assertFalse(this.site.check());
			fail();
		} catch (e) {
			assertInstanceOf(OSext.SiteChangeError, e);
			assertEquals("Mannschaft/Statistik -> Tabelle wurde geändert!", e.message);
		}
	},

	testSiteChangeTableColumnCount2 : function() {

		/*:DOC += <table><tr><td><table><tr><td><b>FC Cork - 2. Liga A<a href="">Irland</a></b></td></tr></table></td></tr></table>*/		
		/*:DOC += <table>
					<tr><td colspan=3></td><td colspan=4 align=middle>Spiele</td><td colspan=4 align=middle>Tore</td><td colspan=4 align=middle>Vorlagen</td><td colspan=4 align=middle>Score</td><td colspan=4 align=middle>Gelb</td><td colspan=4 align=middle>Rot</td></tr>
					<tr><td colspan=2 align=middle>Land</td><td>U</td><td>LI</td><td>LP</td><td>IP</td><td>FS</td><td>LI</td><td>LP</td><td>IP</td><td>FS</td><td>LI</td><td>LP</td><td>IP</td><td>FS</td><td>LI</td><td>LP</td><td>IP</td><td>FS</td><td>LI</td><td>LP</td><td>IP</td><td>FS</td><td>LI</td><td>LP</td><td>IP</td><td>FS</td></tr>
					<tr align=right><td><!-- Flagge --></td><td class="TOR">IRL</td><td class="STU"></td><td class="TOR">22</td><td class="TOR">0</td><td class="TOR">0</td><td class="TOR">2</td><td class="TOR">0</td><td class="TOR">0</td><td class="TOR">0</td><td class="TOR">0</td><td class="TOR">0</td><td class="TOR">0</td><td class="TOR">0</td><td class="TOR">0</td><td class="TOR">0</td><td class="TOR">0</td><td class="TOR">0</td><td class="TOR">0</td><td class="TOR">1</td><td class="TOR">0</td><td class="TOR">0</td><td class="TOR">0</td><td class="TOR">1</td><td class="TOR">0</td><td class="TOR">0</td><td class="TOR">0</td></tr>
					<tr><td colspan=2 align=middle>Land</td><td>U</td><td>LI</td><td>LP</td><td>IP</td><td>FS</td><td>LI</td><td>LP</td><td>IP</td><td>FS</td><td>LI</td><td>LP</td><td>IP</td><td>FS</td><td>LI</td><td>LP</td><td>IP</td><td>FS</td><td>LI</td><td>LP</td><td>IP</td><td>FS</td><td>LI</td><td>LP</td><td>IP</td><td>FS</td></tr>
					<tr><td colspan=3></td><td colspan=4 align=middle>Spiele</td><td colspan=4 align=middle>Tore</td><td colspan=4 align=middle>Vorlagen</td><td colspan=4 align=middle>Score</td><td colspan=4 align=middle>Gelb</td><td colspan=4 align=middle>Rot</td></tr>
				  </table>*/
		
		try {
			assertFalse(this.site.check());
			fail();
		} catch (e) {
			assertInstanceOf(OSext.SiteChangeError, e);
			assertEquals("Mannschaft/Statistik -> Tabelle wurde geändert!", e.message);
		}
	},

	testSiteChangeTableColumnName : function() {

		/*:DOC += <table><tr><td><table><tr><td><b>FC Cork - 2. Liga A<a href="">Irland</a></b></td></tr></table></td></tr></table>*/		
		/*:DOC += <table>
					<tr><td colspan=4></td><td colspan=4 align=middle>Spiele</td><td colspan=4 align=middle>Tore</td><td colspan=4 align=middle>Vorlagen</td><td colspan=4 align=middle>Score</td><td colspan=4 align=middle>Gelb</td><td colspan=4 align=middle>Rot</td></tr>
					<tr><td>XXXXX</td><td colspan=2 align=middle>Land</td><td>U</td><td>LI</td><td>LP</td><td>IP</td><td>FS</td><td>LI</td><td>LP</td><td>IP</td><td>FS</td><td>LI</td><td>LP</td><td>IP</td><td>FS</td><td>LI</td><td>LP</td><td>IP</td><td>FS</td><td>LI</td><td>LP</td><td>IP</td><td>FS</td><td>LI</td><td>LP</td><td>IP</td><td>FS</td></tr>
					<tr align=right><td class="TOR" align=left><a href="javascript:spielerinfo(26109)">Philip Croly</a></td><td><!-- Flagge --></td><td class="TOR">IRL</td><td class="STU"></td><td class="TOR">22</td><td class="TOR">0</td><td class="TOR">0</td><td class="TOR">2</td><td class="TOR">0</td><td class="TOR">0</td><td class="TOR">0</td><td class="TOR">0</td><td class="TOR">0</td><td class="TOR">0</td><td class="TOR">0</td><td class="TOR">0</td><td class="TOR">0</td><td class="TOR">0</td><td class="TOR">0</td><td class="TOR">0</td><td class="TOR">1</td><td class="TOR">0</td><td class="TOR">0</td><td class="TOR">0</td><td class="TOR">1</td><td class="TOR">0</td><td class="TOR">0</td><td class="TOR">0</td></tr>
					<tr><td>Name</td><td colspan=2 align=middle>Land</td><td>U</td><td>LI</td><td>LP</td><td>IP</td><td>FS</td><td>LI</td><td>LP</td><td>IP</td><td>FS</td><td>LI</td><td>LP</td><td>IP</td><td>FS</td><td>LI</td><td>LP</td><td>IP</td><td>FS</td><td>LI</td><td>LP</td><td>IP</td><td>FS</td><td>LI</td><td>LP</td><td>IP</td><td>FS</td></tr>
					<tr><td colspan=4></td><td colspan=4 align=middle>Spiele</td><td colspan=4 align=middle>Tore</td><td colspan=4 align=middle>Vorlagen</td><td colspan=4 align=middle>Score</td><td colspan=4 align=middle>Gelb</td><td colspan=4 align=middle>Rot</td></tr>
				  </table>*/
		
		try {
			assertFalse(this.site.check());
			fail();
		} catch (e) {
			assertInstanceOf(OSext.SiteChangeError, e);
			assertEquals("Mannschaft/Statistik -> Tabellenspalten wurden geändert!", e.message);
		}
	},

	testDemoTeam : function() {

		/*:DOC += <table><tr><td><table><tr><td><b>DemoTeam - <a href="">Landesforum</a></b></td></tr></table></td></tr></table>*/		
		/*:DOC += <table>
					<tr><td colspan=4></td><td colspan=4 align=middle>Spiele</td><td colspan=4 align=middle>Tore</td><td colspan=4 align=middle>Vorlagen</td><td colspan=4 align=middle>Score</td><td colspan=4 align=middle>Gelb</td><td colspan=4 align=middle>Rot</td></tr>
					<tr><td>Name</td><td colspan=2 align=middle>Land</td><td>U</td><td>LI</td><td>LP</td><td>IP</td><td>FS</td><td>LI</td><td>LP</td><td>IP</td><td>FS</td><td>LI</td><td>LP</td><td>IP</td><td>FS</td><td>LI</td><td>LP</td><td>IP</td><td>FS</td><td>LI</td><td>LP</td><td>IP</td><td>FS</td><td>LI</td><td>LP</td><td>IP</td><td>FS</td></tr>
					<tr align=right><td class="TOR" align=left><a href="javascript:spielerinfo(26109)">Philip Croly</a></td><td><!-- Flagge --></td><td class="TOR">IRL</td><td class="STU"></td><td class="TOR">22</td><td class="TOR">0</td><td class="TOR">0</td><td class="TOR">2</td><td class="TOR">0</td><td class="TOR">0</td><td class="TOR">0</td><td class="TOR">0</td><td class="TOR">0</td><td class="TOR">0</td><td class="TOR">0</td><td class="TOR">0</td><td class="TOR">0</td><td class="TOR">0</td><td class="TOR">0</td><td class="TOR">0</td><td class="TOR">1</td><td class="TOR">0</td><td class="TOR">0</td><td class="TOR">0</td><td class="TOR">1</td><td class="TOR">0</td><td class="TOR">0</td><td class="TOR">0</td></tr>
					<tr><td>Name</td><td colspan=2 align=middle>Land</td><td>U</td><td>LI</td><td>LP</td><td>IP</td><td>FS</td><td>LI</td><td>LP</td><td>IP</td><td>FS</td><td>LI</td><td>LP</td><td>IP</td><td>FS</td><td>LI</td><td>LP</td><td>IP</td><td>FS</td><td>LI</td><td>LP</td><td>IP</td><td>FS</td><td>LI</td><td>LP</td><td>IP</td><td>FS</td></tr>
					<tr><td colspan=4></td><td colspan=4 align=middle>Spiele</td><td colspan=4 align=middle>Tore</td><td colspan=4 align=middle>Vorlagen</td><td colspan=4 align=middle>Score</td><td colspan=4 align=middle>Gelb</td><td colspan=4 align=middle>Rot</td></tr>
				  </table>*/
		
		try {
			assertFalse(this.site.check());
			fail();
		} catch (e) {
			assertInstanceOf(OSext.AuthenticationError, e);
		}
	},
			
	testExtend : function() {
		
		/*:DOC += <table><tr><td><table><tr><td><b>FC Cork - 2. Liga A<a href="">Irland</a></b></td></tr></table></td></tr></table>*/		
		/*:DOC += <table>
					<tr><td colspan=4></td><td colspan=4 align=middle>Spiele</td><td colspan=4 align=middle>Tore</td><td colspan=4 align=middle>Vorlagen</td><td colspan=4 align=middle>Score</td><td colspan=4 align=middle>Gelb</td><td colspan=4 align=middle>Rot</td></tr>
					<tr><td>Name</td><td colspan=2 align=middle>Land</td><td>U</td><td>LI</td><td>LP</td><td>IP</td><td>FS</td><td>LI</td><td>LP</td><td>IP</td><td>FS</td><td>LI</td><td>LP</td><td>IP</td><td>FS</td><td>LI</td><td>LP</td><td>IP</td><td>FS</td><td>LI</td><td>LP</td><td>IP</td><td>FS</td><td>LI</td><td>LP</td><td>IP</td><td>FS</td></tr>
					<tr align=right><td class="TOR" align=left><a href="javascript:spielerinfo(26109)">Philip Croly</a></td><td><!-- Flagge --></td><td class="TOR">IRL</td><td class="STU"></td><td class="TOR">22</td><td class="TOR">0</td><td class="TOR">0</td><td class="TOR">2</td><td class="TOR">0</td><td class="TOR">0</td><td class="TOR">0</td><td class="TOR">0</td><td class="TOR">0</td><td class="TOR">0</td><td class="TOR">0</td><td class="TOR">0</td><td class="TOR">0</td><td class="TOR">0</td><td class="TOR">0</td><td class="TOR">0</td><td class="TOR">1</td><td class="TOR">0</td><td class="TOR">0</td><td class="TOR">0</td><td class="TOR">1</td><td class="TOR">0</td><td class="TOR">0</td><td class="TOR">0</td></tr>
					<tr><td>Name</td><td colspan=2 align=middle>Land</td><td>U</td><td>LI</td><td>LP</td><td>IP</td><td>FS</td><td>LI</td><td>LP</td><td>IP</td><td>FS</td><td>LI</td><td>LP</td><td>IP</td><td>FS</td><td>LI</td><td>LP</td><td>IP</td><td>FS</td><td>LI</td><td>LP</td><td>IP</td><td>FS</td><td>LI</td><td>LP</td><td>IP</td><td>FS</td></tr>
					<tr><td colspan=4></td><td colspan=4 align=middle>Spiele</td><td colspan=4 align=middle>Tore</td><td colspan=4 align=middle>Vorlagen</td><td colspan=4 align=middle>Score</td><td colspan=4 align=middle>Gelb</td><td colspan=4 align=middle>Rot</td></tr>
				  </table>*/

		this.data.team.spieler[0] = new OSext.Kaderspieler();
		this.data.team.spieler[0].id = 26109;
		this.data.team.spieler[0].opti = 78.96;
		this.data.team.spieler[0].skillschnitt = 52.71;
		this.data.team.spieler[0].status = OSext.STATUS.AKTIV;
		this.data.team.spieler[0].land = "IRL";

		this.site.extend(this.data);
		
		var table = document.getElementById("team");
		assertNotNull(table);
		assertEquals(3,table.rows.length);
		assertEquals(29,table.rows[0].cells.length);
		
		assertMatch(/\s+.Skillschn./,table.rows[0].cells[27].textContent);
		assertMatch(/\s+Opt\.Skill/,table.rows[0].cells[28].textContent);

		assertMatch(/<img src="images\/flaggen\/IRL\.gif">.+/,table.rows[1].cells[1].innerHTML);

		assertEquals("center",table.rows[0].cells[3].align);
		assertEquals("center",table.rows[0].cells[4].align);
		assertEquals("center",table.rows[0].cells[5].align);
		assertEquals("center",table.rows[0].cells[6].align);

		assertMatch(/<a onclick="ts_resortTable\(this\)\;return false\;" class="sortheader" href="\#">.+/,table.rows[0].cells[0].innerHTML);
		assertMatch(/<a onclick="ts_resortTable\(this\)\;return false\;" class="sortheader" href="\#">.+/,table.rows[0].cells[28].innerHTML);
		
	}	
}
