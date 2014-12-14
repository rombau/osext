
TestCase("ReportTests").prototype = {

	setUp : function() {
		
		this.site = new OSext.Sites.Report(new OSext.WrappedDocument(document));
		
		this.data = new OSext.Data();
		this.data.setAktuellenSpieltag(new OSext.Spieltag(3, 45));

	},

	assertSiteChangeException : function (msg, e) {

		assertInstanceOf(OSext.SiteChangeError, e);
		assertEquals(msg, e.message);
	},
	
	testSiteChangeTableCount : function() {
	
		/*:DOC += <div>
				<b/><b>Datum : 08.11.2011 ...</b>
				<table/><table/><table/><table/>
			</div>*/
		
		try {
			this.site.check();
			fail();
		} catch (e) {
			this.assertSiteChangeException("Report -> Tabellenanzahl wurde geändert!",e);
		}
	},
	
	testSiteChangeDateMissing : function() {

		/*:DOC += <div>
				<b/><b>Stadion : Stadion von ...</b>
				<table/><table/><table/><table/><table/>
			</div>*/

		try {
			this.site.check();
			fail();
		} catch (e) {
			this.assertSiteChangeException("Report -> Datum fehlt!",e);
		}
	},
	
	testSiteChangeAufstellungTableRowCount : function() {

		/*:DOC += <div>
				<b/><b>Datum : 08.11.2011 ...</b>
				<table>
					<tr/>
				</table>
				<table/><table/><table/><table/>
			</div>*/
		
		try {
			assertFalse(this.site.check());
			fail();
		} catch (e) {
			this.assertSiteChangeException("Report -> Tabelle (Aufstellung) wurde geändert!",e);
		}
	
	},

	testSiteChangeAufstellungRaster : function() {

		/*:DOC += <div>
				<b/><b>Datum : 08.11.2011 ...</b>
				<table>
					<tr/>
					<tr><td></td><td>XYZ</td></tr>
					<tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/>
					<tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/>
				</table>
				<table/><table/><table/><table/>
			</div>*/

		try {
			assertFalse(this.site.check());
			fail();
		} catch (e) {
			this.assertSiteChangeException("Report -> Tabelle (Aufstellung) wurde geändert!",e);
		}
	},

	testSiteChangeAufstellungSpieler : function() {

		/*:DOC += <div>
				<b/><b>Datum : 08.11.2011 ...</b>
				<table>
					<tr/><tr><td></td><td>1</td></tr>
					<tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/>
					<tr><td></td><td></td><td></td><td></td><td>XYZ</td></tr>
					<tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/>
				</table>
				<table/><table/><table/><table/>
			</div>*/
	
		try {
			assertFalse(this.site.check());
			fail();
		} catch (e) {
			this.assertSiteChangeException("Report -> Tabelle (Aufstellung) wurde geändert!",e);
		}
	},

	testSiteChangeStarteinstellungenRowCount : function() {

		/*:DOC += <div>
				<b/><b>Datum : 08.11.2011 ...</b>
				<table>
					<tr/><tr><td></td><td>1</td></tr>
					<tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/>
					<tr><td></td><td></td><td></td><td></td><td>A</td></tr>
					<tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/>
				</table>
				<table>
					<tr/>
				</table>
				<table/><table/><table/>
			</div>*/

		try {
			assertFalse(this.site.check());
			fail();
		} catch (e) {
			this.assertSiteChangeException("Report -> Tabelle (Starteinstellungen) wurde geändert!",e);
		}
	},
	
	testSiteChangeStarteinstellungenSpielweise : function() {

		/*:DOC += <div>
				<b/><b>Datum : 08.11.2011 ...</b>
				<table>
					<tr/><tr><td></td><td>1</td></tr>
					<tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/>
					<tr><td></td><td></td><td></td><td></td><td>A</td></tr>
					<tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/>
				</table>
				<table>
					<tr/><tr/><tr/><tr><td>Spielwiese</td></tr><tr/><tr/><tr/>
				</table>
				<table/><table/><table/>
			</div>*/

		try {
			assertFalse(this.site.check());
			fail();
		} catch (e) {
			this.assertSiteChangeException("Report -> Tabelle (Starteinstellungen) wurde geändert!",e);
		}

	},
	
	testSiteChangeSpielStatistikenRowCount : function() {

		/*:DOC += <div>
				<b/><b>Datum : 08.11.2011 ...</b>
				<table>
					<tr/><tr><td></td><td>1</td></tr>
					<tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/>
					<tr><td></td><td></td><td></td><td></td><td>A</td></tr>
					<tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/>
				</table>
				<table>
					<tr/><tr/><tr/><tr><td>Spielweise</td></tr><tr/><tr/><tr/>
				</table>
				<table/>
				<table>
					<tr/>
				</table>
				<table/>
			</div>*/

		try {
			assertFalse(this.site.check());
			fail();
		} catch (e) {
			this.assertSiteChangeException("Report -> Tabelle (Spielstatistiken) wurde geändert!",e);
		}
	},
	
	testSiteChangeSpielStatistikenBallbesitz : function() {

		/*:DOC += <div>
				<b/><b>Datum : 08.11.2011 ...</b>
				<table>
					<tr/><tr><td></td><td>1</td></tr>
					<tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/>
					<tr><td></td><td></td><td></td><td></td><td>A</td></tr>
					<tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/>
				</table>
				<table>
					<tr/><tr/><tr/><tr><td>Spielweise</td></tr><tr/><tr/><tr/>
				</table>
				<table/>
				<table>
					<tr/><tr/><tr/><tr/><tr/><tr/><tr><td>Ballsitz</td></tr><tr/><tr/><tr/><tr/>
				</table>
				<table/>
			</div>*/

		try {
			assertFalse(this.site.check());
			fail();
		} catch (e) {
			this.assertSiteChangeException("Report -> Tabelle (Spielstatistiken) wurde geändert!",e);
		}
	},
	
	testSiteChangeSpielerStatistikenRowCount : function() {

		/*:DOC += <div>
				<b/><b>Datum : 08.11.2011 ...</b>
				<table>
					<tr/><tr><td></td><td>1</td></tr>
					<tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/>
					<tr><td></td><td></td><td></td><td></td><td>A</td></tr>
					<tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/>
				</table>
				<table>
					<tr/><tr/><tr/><tr><td>Spielweise</td></tr><tr/><tr/><tr/>
				</table>
				<table/>
				<table>
					<tr/><tr/><tr/><tr/><tr/><tr/><tr><td>Ballbesitz</td></tr><tr/><tr/><tr/><tr/>
				</table>
				<table>
					<tr/>
				</table>
			</div>*/

		try {
			assertFalse(this.site.check());
			fail();
		} catch (e) {
			this.assertSiteChangeException("Report -> Tabelle (Spielerstatistiken) wurde geändert!",e);
		}
	},
	
	testSiteChangeSpielerStatistikenColumnCount : function() {

		/*:DOC += <div>
				<b/><b>Datum : 08.11.2011 ...</b>
				<table>
					<tr/><tr><td></td><td>1</td></tr>
					<tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/>
					<tr><td></td><td></td><td></td><td></td><td>A</td></tr>
					<tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/>
				</table>
				<table>
					<tr/><tr/><tr/><tr><td>Spielweise</td></tr><tr/><tr/><tr/>
				</table>
				<table/>
				<table>
					<tr/><tr/><tr/><tr/><tr/><tr/><tr><td>Ballbesitz</td></tr><tr/><tr/><tr/><tr/>
				</table>
				<table>
					<tr><td></td></tr>
					<tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/>
				</table>
			</div>*/

		try {
			assertFalse(this.site.check());
			fail();
		} catch (e) {
			this.assertSiteChangeException("Report -> Tabelle (Spielerstatistiken) wurde geändert!",e);
		}
	},
	
	testSiteChangeSpielerStatistikenColumns : function() {

		/*:DOC += <div>
				<b/><b>Datum : 08.11.2011 ...</b>
				<table>
					<tr/><tr><td></td><td>1</td></tr>
					<tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/>
					<tr><td></td><td></td><td></td><td></td><td>A</td></tr>
					<tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/>
				</table>
				<table>
					<tr/><tr/><tr/><tr><td>Spielweise</td></tr><tr/><tr/><tr/>
				</table>
				<table/>
				<table>
					<tr/><tr/><tr/><tr/><tr/><tr/><tr><td>Ballbesitz</td></tr><tr/><tr/><tr/><tr/>
				</table>
				<table>
					<tr><td>XYZ</td><td>Note</td><td>ZK</td><td>ZK-%</td><td>Schüsse</td><td>aufs Tor</td><td>Tore</td><td>Vorlagen</td><td></td><td>Schüsse</td><td>aufs Tor</td><td>Tore</td><td>Vorlagen</td><td>ZK</td><td>ZK-%</td><td>Note</td><td>Spielername</td></tr>
					<tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/>
				</table>
			</div>*/

		try {
			assertFalse(this.site.check());
			fail();
		} catch (e) {
			this.assertSiteChangeException("Report -> Tabellenspalten (Spielerstatistiken) wurden geändert!",e);
		}
	}
}

FixtureTestCase("FixtureReportTests", "/test/test/fixtures/rep/saison/6/7/19-448.html", {
	
	setUp : function(htmldoc) {
		
		this.site = this.site || new OSext.Sites.Report(new OSext.WrappedDocument(htmldoc));
		
		this.data = this.data || new OSext.Data();
		this.data.setAktuellenSpieltag(new OSext.Spieltag(3, 45));
	},
	
	testSpieltagdatum : function(htmldoc) {
		
		this.site.extract(this.data);
		
		assertEquals("08.11.2011", this.data.spieltag.datum);
	},
	
	testTrainingFaktorGespielt : function(htmldoc) {

		this.data.team.spieler[0] = new OSext.Kaderspieler();
		this.data.team.spieler[0].name = "Rory Francis";

		this.site.extract(this.data);
		
		assertEquals(1.35, this.data.team.spieler[0].training.aktuell.faktor);
	},
	
	testTrainingFaktorEinwechslung : function(htmldoc) {

		this.data.team.spieler[0] = new OSext.Kaderspieler();
		this.data.team.spieler[0].name = "Ian Quigley";

		this.site.extract(this.data);
		
		assertEquals(1.25, this.data.team.spieler[0].training.aktuell.faktor);
	},

	testTrainingFaktorBank : function(htmldoc) {

		this.data.team.spieler[0] = new OSext.Kaderspieler();
		this.data.team.spieler[0].name = "Conrad Nash";

		this.site.extract(this.data);
		
		assertEquals(1.1, this.data.team.spieler[0].training.aktuell.faktor);
	}
});
