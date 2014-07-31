
TestCase("ZarTests").prototype = {

	setUp : function() {
		
		this.site = new OSext.Sites.Zar(new OSext.WrappedDocument(document));
		
		this.data = new OSext.Data();
		this.data.setAktuellenSpieltag(new OSext.Spieltag(3, 45));

	},
	
	testSiteChangeTableCount : function() {

		/*:DOC += <table><tr><td>Einnahmen und Ausgaben</td></tr></table>*/

		assertFalse(this.site.check());

	},

	testSiteChangeEinAusTableColumnCount : function() {

		/*:DOC += <table><tr><td>Gesamtsumme</td></tr></table>*/
		/*:DOC += <table><tr><td><a href="javascript:spielerinfo(62939)">Joe Casey</a></td><td>Aggressivität erfolglos</td></tr></table>*/

		try {
			assertFalse(this.site.check());
			fail();
		} catch (e) {
			assertInstanceOf(OSext.SiteChangeError, e);
			assertEquals("Zat-Report -> Tabellenspalten (Einnahmen/Ausgaben) wurde geändert!", e.message);
		}

	},

	testSiteChangeTrainingTableColumnCount : function() {

		/*:DOC += <table><tr><td>Gesamtsumme</td><td>10.000 Euro</td></tr></table>*/
		/*:DOC += <table><tr><td>Aggressivität erfolglos</td></tr></table>*/

		try {
			assertFalse(this.site.check());
			fail();
		} catch (e) {
			assertInstanceOf(OSext.SiteChangeError, e);
			assertEquals("Zat-Report -> Tabellenspalten (Trainingserfolge) wurde geändert!", e.message);
		}

	},

	testSiteChangeTrainingTableNoLink : function() {

		/*:DOC += <table><tr><td>Gesamtsumme</td><td>10.000 Euro</td></tr></table>*/
		/*:DOC += <table><tr><td>Joe Casey</td><td>Aggressivität erfolglos</td></tr></table>*/

		try {
			assertFalse(this.site.check());
			fail();
		} catch (e) {
			assertInstanceOf(OSext.SiteChangeError, e);
			assertEquals("Zat-Report -> Tabellenspalte (Trainingserfolge) wurde geändert!", e.message);
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

		/*:DOC += <table>	
					<tr><td>Zuschauereinnahmen</td><td>871.225 Euro</td></tr>
					<tr><td>Stadionkosten</td><td>-100.000 Euro</td></tr>
					<tr><td>Geh�lter</td><td>-3.025.429 Euro</td></tr>
					<tr><td>Trainer</td><td>-486.931 Euro</td></tr>
					<tr><td>Werbevertrag</td><td>297.500 Euro</td></tr>
					<tr><td>Leihgeb�hr Martin Collins</td><td>275.195 Euro</td></tr>
					<tr><td>Leihgeb�hr XYZ</td><td>-175.195 Euro</td></tr>
					<tr><td>Jugendf�rderung</td><td>-200.000 Euro</td></tr>
					<tr><td>Siegpr�mie</td><td>200.000 Euro</td></tr>
					<tr><td>Punktpr�mie</td><td>84.150 Euro</td></tr>
					<tr><td>Torpr�mie</td><td>153.000 Euro</td></tr>
					<tr><td>Fernsehgelder</td><td>465.589 Euro</td></tr>
					<tr><td>Fanartikel</td><td>386.039 Euro</td></tr>
					<tr><td>Physiotherapeut</td><td>-10.000 Euro</td></tr>
					<tr><td>&nbsp;</td></tr>
					<tr><td>Gesamtsumme</td><td>-1.279.662 Euro</td></tr>
				  </table>*/
		/*:DOC += <table>
					<tr><td><a href="javascript:spielerinfo(26109)">Philip Croly</a></td><td>Absto� erfolgreich</td></tr>
					<tr><td><a href="javascript:spielerinfo(29963)">Stephen Thornton</a></td><td>Zweikampf erfolglos</td></tr>
				  </table>*/

		this.data.team.spieler[0] = new OSext.Kaderspieler();
		this.data.team.spieler[0].id = 26109;
		this.data.team.spieler[1] = new OSext.Kaderspieler();
		this.data.team.spieler[1].id = 29963;

		this.site.extract(this.data);		

		assertEquals(871225,this.data.spieltag.stadioneinnahmen);
		assertEquals(-100000,this.data.spieltag.stadionkosten);
		assertEquals(-3025429,this.data.spieltag.spielergehaelter);
		assertEquals(-486931,this.data.spieltag.trainergehaelter);
		assertEquals(297500,this.data.spieltag.grundpraemie);
		assertEquals(100000,this.data.spieltag.leihen);
		assertEquals(-200000,this.data.spieltag.jugend);
		assertEquals(200000,this.data.spieltag.siegpraemie);
		assertEquals(84150,this.data.spieltag.punktpraemie);
		assertEquals(153000,this.data.spieltag.torpraemie);
		assertEquals(465589,this.data.spieltag.tvgelder);
		assertEquals(386039,this.data.spieltag.fanartikel);
		assertEquals(-10000,this.data.spieltag.physio);
		assertEquals(-1279662,this.data.spieltag.summe);
		
		assertTrue(this.data.team.spieler[0].training.aktuell.aufwertung);
		assertFalse(this.data.team.spieler[1].training.aktuell.aufwertung);

	}
}



