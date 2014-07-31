
TestCase("KontoauszugTests").prototype = {

	setUp : function() {
		
		this.site = new OSext.Sites.Ka(new OSext.WrappedDocument(document));
		
		this.data = new OSext.Data();

	},
	
	testSiteChangeNoTitle : function() {

		/*:DOC += <div>
				  <table id="kader1">
					<tr><td>Datum</td><td>Eingang</td><td>Ausgang</td><td>Buchungstext</td><td>Kontostand nach Buchung</td></tr>
					<tr><td>10.12.2011</td><td>1.100.000</td><td></td><td>Abrechnung ZAT 50</td><td>2.686.241</td></tr>
					<tr><td>21.11.2011</td><td>123.456</td><td></td><td>Transfer mit AS Foggia</td><td>1.586.241</td></tr>
				  </table>
				  </div>*/
		
		try {
			assertFalse(this.site.check());
			fail();
		} catch (e) {
			assertInstanceOf(OSext.SiteChangeError, e);
			assertEquals("Kontoauszug -> Überschrift wurde entfernt!", e.message);
		}
	},

	testSiteChangeNoTable : function() {

		/*:DOC += <div>
				  <b><font color="000000">FC Cork - Kontoauszug - Kontostand : 2.686.241 Euro</font></b>
				  </div>*/
		
		try {
			assertFalse(this.site.check());
			fail();
		} catch (e) {
			assertInstanceOf(OSext.SiteChangeError, e);
			assertEquals("Kontoauszug -> Tabelle wurde entfernt!", e.message);
		}
	},

	testSiteChangeTableColumnCount : function() {

		/*:DOC += <div>
				  <b><font color="000000">FC Cork - Kontoauszug - Kontostand : 2.686.241 Euro</font></b>
				  <table id="kader1">
					<tr><td>Eingang</td><td>Ausgang</td><td>Buchungstext</td><td>Kontostand nach Buchung</td></tr>
					<tr><td>1.100.000</td><td></td><td>Abrechnung ZAT 50</td><td>2.686.241</td></tr>
					<tr><td>123.456</td><td></td><td>Transfer mit AS Foggia</td><td>1.586.241</td></tr>
				  </table>
				  </div>*/
		
		try {
			assertFalse(this.site.check());
			fail();
		} catch (e) {
			assertInstanceOf(OSext.SiteChangeError, e);
			assertEquals("Kontoauszug -> Tabelle wurde geändert!", e.message);
		}
	},

	testSiteChangeTableColumnName : function() {

		/*:DOC += <div>
				  <b><font color="000000">FC Cork - Kontoauszug - Kontostand : 2.686.241 Euro</font></b>
				  <table id="kader1">
					<tr><td>Datum</td><td>Ein</td><td>Aus</td><td>Buchungstext</td><td>Kontostand nach Buchung</td></tr>
					<tr><td>10.12.2011</td><td>1.100.000</td><td></td><td>Abrechnung ZAT 50</td><td>2.686.241</td></tr>
					<tr><td>21.11.2011</td><td>123.456</td><td></td><td>Transfer mit AS Foggia</td><td>1.586.241</td></tr>
				  </table>
				  </div>*/
		
		try {
			assertFalse(this.site.check());
			fail();
		} catch (e) {
			assertInstanceOf(OSext.SiteChangeError, e);
			assertEquals("Kontoauszug -> Tabellenspalten wurden geändert!", e.message);
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
				  <b><font color="000000">FC Cork - Kontoauszug - Kontostand : 2.686.241 Euro</font></b>
				  <table id="kader1">
					<tr><td>Datum</td><td>Eingang</td><td>Ausgang</td><td>Buchungstext</td><td>Kontostand nach Buchung</td></tr>
					<tr><td>11.12.2011</td><td>1.100.000</td><td></td><td>Transfer mit AS Foggia</td><td>2.686.241</td></tr>
					<tr><td>10.12.2011</td><td>666.666</td><td></td><td>Abrechnung ZAT 50</td><td>1.586.241</td></tr>
				  </table>
				  </div>*/
		
		this.data.spieltag = new OSext.Spieltag(3, 33);
		
		this.site.extract(this.data);		

		assertEquals(2686241, this.data.kontostand);
		assertEquals("10.12.2011", this.data.spieltag.datum);
		assertEquals(1586241, this.data.spieltag.saldo);
	},
	
	testExtractNoLines : function() {

		/*:DOC += <div>
				  <b><font color="000000">FC Cork - Kontoauszug - Kontostand : 2.686.241 Euro</font></b>
				  <table id="kader1">
					<tr><td>Datum</td><td>Eingang</td><td>Ausgang</td><td>Buchungstext</td><td>Kontostand nach Buchung</td></tr>
				  </table>
				  </div>*/
		
		this.data.spieltag = new OSext.Spieltag(3, 33);
		
		this.site.extract(this.data);

		assertEquals(2686241, this.data.kontostand);
		assertEquals(2686241, this.data.spieltag.saldo);

	}
}



