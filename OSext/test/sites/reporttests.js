
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
	},
	
	testExtract : function() {

		/*:DOC += <div>
				<h2><b style="color: rgb(255, 153, 0);">FC Cork - RSC Genk</b></h2>
				<div><b style="color: rgb(255, 153, 0);">
				Datum : 08.11.2011      Stadion : Stadion von FC Cork      Spielart : Friendly
				</b></div>
				<div><br><br><b>
				Hier zuerst die taktischen Aufstellungen beider Teams und das jeweilige Spieleraufgebot
				</b><br><br></div>
				<table border="0">
				<tbody>
				<tr><td colspan="2"></td>
				<td colspan="9" align="center"><b style="color: rgb(255, 0, 0);">FC Cork</b></td>
				<td colspan="3"></td>
				<td colspan="9" align="center"><b style="color: rgb(255, 0, 0);">RSC Genk</b></td>
				<td colspan="2"></td></tr>
				<tr align="center"><td></td>
				<td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td><td>11</td>
				<td></td>
				<td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td><td>11</td>
				</tr><tr><td>O</td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td>O</td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td>O</td></tr><tr><td>N</td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td>N</td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td>N</td></tr><tr><td>M</td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td bgcolor="#cc0033" width="4%" align="center"><b>A</b></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td bgcolor="#cc0033" width="4%" align="center"><b>B</b></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td>M</td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td bgcolor="#cc0033" width="4%" align="center"><b>A</b></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td bgcolor="#cc0033" width="4%" align="center"><b>B</b></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td>M</td></tr><tr><td>L</td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td>L</td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td>L</td></tr><tr><td>K</td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td>K</td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td>K</td></tr><tr><td>J</td><td width="4%" align="center"></td><td bgcolor="#3377ff" width="4%" align="center"><b>C</b></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td bgcolor="#3377ff" width="4%" align="center"><b>D</b></td><td width="4%" align="center"></td><td>J</td><td width="4%" align="center"></td><td bgcolor="#3377ff" width="4%" align="center"><b>C</b></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td bgcolor="#3377ff" width="4%" align="center"><b>D</b></td><td width="4%" align="center"></td><td>J</td></tr><tr><td>I</td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td>I</td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td>I</td></tr><tr><td>H</td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td>H</td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td bgcolor="#3377ff" width="4%" align="center"><b>E</b></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td>H</td></tr><tr><td>G</td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td bgcolor="#3377ff" width="4%" align="center"><b>E</b></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td bgcolor="#3377ff" width="4%" align="center"><b>F</b></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td>G</td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td>G</td></tr><tr><td>F</td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td>F</td><td width="4%" align="center"></td><td width="4%" align="center"></td><td bgcolor="#3377ff" width="4%" align="center"><b>F</b></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td bgcolor="#3377ff" width="4%" align="center"><b>G</b></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td>F</td></tr><tr><td>E</td><td width="4%" align="center"></td><td bgcolor="#009933" width="4%" align="center"><b>G</b></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td bgcolor="#009933" width="4%" align="center"><b>H</b></td><td width="4%" align="center"></td><td>E</td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td>E</td></tr><tr><td>D</td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td>D</td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td>D</td></tr><tr><td>C</td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td bgcolor="#009933" width="4%" align="center"><b>K</b></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td bgcolor="#009933" width="4%" align="center"><b>L</b></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td>C</td><td width="4%" align="center"></td><td width="4%" align="center"></td><td bgcolor="#009933" width="4%" align="center"><b>H</b></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td bgcolor="#009933" width="4%" align="center"><b>K</b></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td>C</td></tr><tr><td>B</td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td>B</td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td bgcolor="#009933" width="4%" align="center"><b>L</b></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td>B</td></tr><tr><td>A</td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td>A</td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td width="4%" align="center"></td><td>A</td></tr><tr><td colspan="6"></td><td bgcolor="#ffff00" align="center"><b style="color: rgb(0, 0, 0);">T</b></td><td colspan="5"></td><td></td>
				<td colspan="5"></td><td bgcolor="#ffff00" align="center"><b style="color: rgb(0, 0, 0);">T</b></td><td colspan="5"></td><td></td></tr>
				<tr><td>&nbsp;</td></tr><tr><td><b class="H">A</b></td><td></td><td colspan="7" align="left"><b class="H">Rory Francis</b></td><td colspan="3"></td><td><b class="G">A</b></td><td></td><td colspan="9" align="left"><b class="G">Sergei Razumau</b></td></tr><tr><td><b class="H">B</b></td><td></td><td colspan="7" align="left"><b class="H">Wes Robinson</b></td><td colspan="3"></td><td><b class="G">B</b></td><td></td><td colspan="9" align="left"><b class="G">Jan Huovinen</b></td></tr><tr><td><b class="H">C</b></td><td></td><td colspan="7" align="left"><b class="H">Gareth Lyons</b></td><td colspan="3"></td><td><b class="G">C</b></td><td></td><td colspan="9" align="left"><b class="G">Hubert Smidts</b></td></tr><tr><td><b class="H">D</b></td><td></td><td colspan="7" align="left"><b class="H">Joseph Russell</b></td><td colspan="3"></td><td><b class="G">D</b></td><td></td><td colspan="9" align="left"><b class="G">Hannad Harkouk</b></td></tr><tr><td><b class="H">E</b></td><td></td><td colspan="7" align="left"><b class="H">Daniel Crawford</b></td><td colspan="3"></td><td><b class="G">E</b></td><td></td><td colspan="9" align="left"><b class="G">Esat Ymeri</b></td></tr><tr><td><b class="H">F</b></td><td></td><td colspan="7" align="left"><b class="H">Gerard Paisley</b></td><td colspan="3"></td><td><b class="G">F</b></td><td></td><td colspan="9" align="left"><b class="G">Nicolas Vermaut</b></td></tr><tr><td><b class="H">G</b></td><td></td><td colspan="7" align="left"><b class="H">Willie Cragg</b></td><td colspan="3"></td><td><b class="G">G</b></td><td></td><td colspan="9" align="left"><b class="G">Ruud Lemmens</b></td></tr><tr><td><b class="H">H</b></td><td></td><td colspan="7" align="left"><b class="H">Declan ONeill</b></td><td colspan="3"></td><td><b class="G">H</b></td><td></td><td colspan="9" align="left"><b class="G">Mario Van den Wyngaert</b></td></tr><tr><td><b class="H">K</b></td><td></td><td colspan="7" align="left"><b class="H">Paul MacDonald</b></td><td colspan="3"></td><td><b class="G">K</b></td><td></td><td colspan="9" align="left"><b class="G">Raul Pires</b></td></tr><tr><td><b class="H">L</b></td><td></td><td colspan="7" align="left"><b class="H">Willo Cunningham</b></td><td colspan="3"></td><td><b class="G">L</b></td><td></td><td colspan="9" align="left"><b class="G">George Kallur</b></td></tr><tr><td><b class="H">T</b></td><td></td><td colspan="7" align="left"><b class="H">Steve Stapleton</b></td><td colspan="3"></td><td><b class="G">T</b></td><td></td><td colspan="9" align="left"><b class="G">Mihajlo Remac</b></td></tr><tr><td><b class="H">U</b></td><td></td><td colspan="7" align="left"><b class="H">Joe Casey</b></td><td colspan="3"></td><td><b class="G">U</b></td><td></td><td colspan="9" align="left"><b class="G">Daniel Callaerts</b></td></tr><tr><td><b class="H">V</b></td><td></td><td colspan="7" align="left"><b class="H">Ian Quigley</b></td><td colspan="3"></td><td><b class="G">V</b></td><td></td><td colspan="9" align="left"><b class="G">Daniel Broeckaert</b></td></tr><tr><td><b class="H">W</b></td><td></td><td colspan="7" align="left"><b class="H">Graham Millar</b></td><td colspan="3"></td><td><b class="G">W</b></td><td></td><td colspan="9" align="left"><b class="G">Filip Van Peer</b></td></tr><tr><td><b class="H">X</b></td><td></td><td colspan="7" align="left"><b class="H">Adrian White</b></td><td colspan="3"></td><td><b class="G">X</b></td><td></td><td colspan="9" align="left"><b class="G">Serge Van den Wyngaert</b></td></tr><tr><td><b class="H">Y</b></td><td></td><td colspan="7" align="left"><b class="H">Conrad Nash</b></td><td colspan="3"></td><td><b class="G">Y</b></td><td></td><td colspan="9" align="left"><b class="G">Nikiforos Vandalis</b></td></tr><tr><td><b class="H">Z</b></td><td></td><td colspan="7" align="left"><b class="H">Jonathan Croly</b></td><td colspan="3"></td><td><b class="G">Z</b></td><td></td><td colspan="9" align="left"><b class="G">Wim Hoeykens</b></td></tr></tbody></table>
				<div><br><b>Es folgen die Starteinstellungen :</b><br><br></div>
				<table border="0" cellpadding="2" cellspacing="2">
				<tbody><tr><td></td><td>Heimteam</td><td width="50"></td><td>Auswärtsteam</td></tr>
				<tr><td>Einsatz</td><td>50%</td>
				<td width="50"></td><td>50%</td></tr>
				<tr><td>Härte</td><td>Fairplay</td>
				<td width="50"></td><td>Fairplay</td></tr>
				<tr><td>Spielweise</td><td>Defensiv</td>
				<td width="50"></td><td>Brechstange</td></tr>
				<tr><td>Taktik - Sturm</td><td>Konter
				</td><td width="50"></td><td>Mittelstürmer</td></tr>
				<tr><td>Taktik - Mittelfeld</td><td>Flügelzange</td>
				<td width="50"></td><td>Flügelzange</td></tr>
				<tr><td>Taktik - Abwehr</td><td>Innenverteidigung</td>
				<td width="50"></td><td>Kontrolliert nach vorne</td></tr>
				</tbody>
				</table><div><br>
				<b>Es folgt der Spielbericht :</b><br><br></div>
				<table border="0" cellpadding="2" cellspacing="2">
				<tbody><tr><td valign="top" align="right">1.</td><td><b style="color: cyan;">Anpfiff</b></td></tr>
				<tr><td></td><td><b class="G">Mario Van den Wyngaert</b> mit langem Pass zu <b class="G">Ruud Lemmens</b></td></tr>
				<tr><td></td><td><b class="G">Ruud Lemmens</b> flankt den Ball vor das Tor</td></tr>
				<tr><td></td><td><b class="H">Willo Cunningham</b> köpft den Ball aus der Gefahrenzone</td></tr>
				<tr><td valign="top" align="right">2.</td><td><b class="G">Mario Van den Wyngaert</b> mit Kurzpass zu <b class="G">Ruud Lemmens</b></td></tr>
				<tr><td></td><td><b class="G">Ruud Lemmens</b> verpasst <b class="H">Gareth Lyons</b> einen Beinschuss</td></tr>
				<tr><td></td><td>Ein Schlenzer von <b class="G">Ruud Lemmens</b> Richtung linke Torseite - Der Keeper lenkt den Ball zur Ecke ab</td></tr>
				<tr><td></td><td><b>Ecke</b>: <b class="G">Ruud Lemmens</b> zieht den Ball vor das Tor</td></tr>
				<tr><td></td><td>Ein Flatterball von <b class="G">Nicolas Vermaut</b> Richtung rechte Torseite - Der Ball landet beim Keeper</td></tr>
				<tr><td valign="top" align="right">3.</td><td><b class="G">Mario Van den Wyngaert</b> per langem Pass zu <b class="G">Ruud Lemmens</b></td></tr>
				<tr><td></td><td><b class="G">Ruud Lemmens</b> verlädt <b class="H">Gareth Lyons</b> mit einer gelungenen Körpertäuschung</td></tr>
				<tr><td></td><td>Ein Schuss von <b class="G">Ruud Lemmens</b> Richtung rechte Torseite - Der Keeper lenkt den Ball zur Ecke ab</td></tr>
				<tr><td></td><td><b>Ecke</b>: <b class="G">Ruud Lemmens</b> zieht den Ball auf den zweiten Pfosten</td></tr>
				<tr><td></td><td><b class="G">Hubert Smidts</b> schiesst den Ball in die rechte Ecke - Der Keeper hat den Ball sicher</td></tr>
				<tr><td valign="top" align="right">4.</td><td><b class="G">Mario Van den Wyngaert</b> spielt den Ball kurz zu <b class="G">Nicolas Vermaut</b> weiter</td></tr>
				<tr><td></td><td>Foul von <b class="H">Joseph Russell</b> an <b class="G">Nicolas Vermaut</b> - FREISTOSS</td></tr>
				<tr><td></td><td><b class="G">Nicolas Vermaut</b> spielt mit einem kurzen Pass zu <b class="G">Esat Ymeri</b> weiter</td></tr>
				<tr><td></td><td><b class="G">Esat Ymeri</b> kann <b class="H">Daniel Crawford</b> mit einem gelungenem Dribbling überspielen</td></tr>
				<tr><td></td><td>Ein Schlenzer von <b class="G">Esat Ymeri</b> Richtung rechte Torseite - Der Ball geht am Tor vorbei</td></tr>
				<tr><td valign="top" align="right">5.</td><td><b class="H">Daniel Crawford</b> spielt mit einem kurzen Pass zu <b class="H">Wes Robinson</b> weiter</td></tr>
				<tr><td></td><td><b class="H">Wes Robinson</b> schiesst mit einem Aufsetzer aufs lange Eck - Ein Verteidiger grätscht dazwischen, Eckball</td></tr>
				<tr><td></td><td><b>Ecke</b>: <b class="H">Daniel Crawford</b> zieht den Ball vor das Tor</td></tr>
				<tr><td></td><td>Harter Schuss von <b class="H">Gerard Paisley</b> Richtung Tormitte - <b class="G">Mihajlo Remac</b> dreht den Ball zur Ecke</td></tr>
				<tr><td></td><td><b>Ecke</b>: <b class="H">Daniel Crawford</b> zieht den Ball auf den zweiten Pfosten</td></tr>
				<tr><td></td><td>Der Ball landet beim Keeper</td></tr>
				<tr><td valign="top" align="right">6.</td><td><b class="G">Raul Pires</b> spielt einen langen Ball zu <b class="G">Esat Ymeri</b></td></tr>
				<tr><td></td><td><b class="G">Esat Ymeri</b> schiesst den Ball in die linke Ecke - <b class="H">Steve Stapleton</b> kann den Ball nicht richtig festhalten, der Ball geht ins Toraus – Eckball</td></tr>
				<tr><td></td><td><b>Ecke</b>: <b class="G">Ruud Lemmens</b> zieht den Ball auf den zweiten Pfosten</td></tr>
				<tr><td></td><td><b class="G">Nicolas Vermaut</b> schiesst mit einem Aufsetzer aufs kurze Eck - Der Keeper hat den Ball sicher</td></tr>
				<tr><td valign="top" align="right">7.</td><td><b class="G">Raul Pires</b> spielt den Ball kurz zu <b class="G">Ruud Lemmens</b></td></tr>
				<tr><td></td><td>Harter Schuss von <b class="G">Ruud Lemmens</b> Richtung linke Torseite - Der Keeper lenkt den Ball zur Ecke ab</td></tr>
				<tr><td></td><td><b>Ecke</b>: <b class="G">Ruud Lemmens</b> zieht den Ball auf den ersten Pfosten</td></tr>
				<tr><td></td><td>Ein Schlenzer von <b class="G">Hubert Smidts</b> Richtung linke Torseite - Der Ball geht knapp am Tor vorbei</td></tr>
				<tr><td valign="top" align="right">8.</td><td><b class="H">Declan ONeill</b> passt den Ball direkt auf <b class="H">Willo Cunningham</b></td></tr>
				<tr><td></td><td>Harter Schuss von <b class="H">Willo Cunningham</b> Richtung linke Torseite - Ein Verteidiger grätscht dazwischen, Eckball</td></tr>
				<tr><td></td><td><b>Ecke</b>: <b class="H">Daniel Crawford</b> zieht den Ball vor das Tor</td></tr>
				<tr><td></td><td>Ein Flatterball von <b class="H">Gerard Paisley</b> Richtung rechte Torseite - Der Ball geht am Tor vorbei</td></tr>
				<tr><td valign="top" align="right">9.</td><td><b class="G">Nicolas Vermaut</b> lässt <b class="H">Joseph Russell</b> wie einen Schuljungen stehen</td></tr>
				<tr><td></td><td>Ein Schuss von <b class="G">Nicolas Vermaut</b> Richtung rechte Torseite - <b class="H">Steve Stapleton</b> kann den Ball nicht richtig festhalten, der Ball geht ins Toraus – Eckball</td></tr>
				<tr><td></td><td><b>Ecke</b>: <b class="G">Ruud Lemmens</b> zieht den Ball vor das Tor</td></tr>
				<tr><td></td><td>Strammer Rechtsschuß von <b class="G">Nicolas Vermaut</b> - <b class="H">Steve Stapleton</b> lenkt den Ball zur Ecke ab - Eckball</td></tr>
				<tr><td></td><td><b>Ecke</b>: <b class="G">Ruud Lemmens</b> zieht den Ball auf den zweiten Pfosten</td></tr>
				<tr><td></td><td>Ein Schuss von <b class="G">Esat Ymeri</b> Richtung Tormitte - <b class="H">Steve Stapleton</b> kann den Ball nicht richtig festhalten, der Ball geht zurück in das Spiel</td></tr>
				<tr><td valign="top" align="right">10.</td><td><b class="H">Willo Cunningham</b> spielt den Ball lang zu <b class="H">Daniel Crawford</b></td></tr>
				<tr><td></td><td><b class="H">Daniel Crawford</b> schiesst aufs Tor - <b class="G">Mihajlo Remac</b> dreht den Ball zur Ecke</td></tr>
				<tr><td></td><td><b>Ecke</b>: <b class="H">Daniel Crawford</b> zieht den Ball auf den zweiten Pfosten</td></tr>
				<tr><td></td><td>Der Ball landet beim Keeper</td></tr>
				<tr><td valign="top" align="right">11.</td><td><b class="G">Mario Van den Wyngaert</b> passt lang zu <b class="G">Ruud Lemmens</b></td></tr>
				<tr><td></td><td><b class="G">Ruud Lemmens</b> spielt den Ball lang zu <b class="G">Esat Ymeri</b> weiter</td></tr>
				<tr><td></td><td><b class="G">Esat Ymeri</b> kann <b class="H">Declan ONeill</b> nicht umspielen</td></tr>
				<tr><td valign="top" align="right">12.</td><td><b class="G">Raul Pires</b> spielt mit einem kurzen Pass zu <b class="G">Esat Ymeri</b> weiter</td></tr>
				<tr><td></td><td><b class="G">Esat Ymeri</b> per langem Pass zu <b class="G">Sergei Razumau</b></td></tr>
				<tr><td></td><td><b class="H">Paul MacDonald</b> erkämpft sich den Ball - Torchance vereitelt</td></tr>
				<tr><td valign="top" align="right">13.</td><td><b class="G">Raul Pires</b> spielt den Ball kurz zu <b class="G">Ruud Lemmens</b></td></tr>
				<tr><td></td><td><b class="G">Ruud Lemmens</b> spielt einen langen Ball zu <b class="G">Nicolas Vermaut</b></td></tr>
				<tr><td></td><td><b class="G">Nicolas Vermaut</b> spielt den Ball lang zu <b class="G">Esat Ymeri</b> weiter</td></tr>
				<tr><td></td><td><b class="G">Esat Ymeri</b> passt den Ball direkt auf <b class="G">Ruud Lemmens</b></td></tr>
				<tr><td></td><td><b class="G">Ruud Lemmens</b> spielt mit einem langen Pass zu <b class="G">Hubert Smidts</b> weiter</td></tr>
				<tr><td></td><td><b class="H">Declan ONeill</b> erkämpft sich den Ball - Torchance vereitelt</td></tr>
				<tr><td valign="top" align="right">14.</td><td><b class="G">George Kallur</b> mit langem Pass zu <b class="G">Ruud Lemmens</b></td></tr>
				<tr><td></td><td><b class="G">Ruud Lemmens</b> passt lang zu <b class="G">Nicolas Vermaut</b></td></tr>
				<tr><td></td><td><b class="G">Nicolas Vermaut</b> spielt den Ball kurz zu <b class="G">Hannad Harkouk</b> weiter</td></tr>
				<tr><td></td><td><b class="G">Hannad Harkouk</b> verstolpert den Ball bei einem versuchtem Dribbling</td></tr>
				<tr><td valign="top" align="right">15.</td><td><b class="G">Mario Van den Wyngaert</b> spielt den Ball kurz zu <b class="G">Nicolas Vermaut</b></td></tr>
				<tr><td></td><td><b class="G">Nicolas Vermaut</b> lässt <b class="H">Joseph Russell</b> wie einen Schuljungen stehen</td></tr>
				<tr><td></td><td><b class="G">Nicolas Vermaut</b> spielt den Ball lang zu <b class="G">Ruud Lemmens</b></td></tr>
				<tr><td></td><td><b class="G">Ruud Lemmens</b> mit Kurzpass zu <b class="G">Esat Ymeri</b></td></tr>
				<tr><td></td><td><b class="G">Esat Ymeri</b> kann <b class="H">Gerard Paisley</b> nicht mit einem Übersteiger versetzen</td></tr>
				<tr><td valign="top" align="right">16.</td><td><b class="H">Declan ONeill</b> mit Kurzpass zu <b class="H">Daniel Crawford</b></td></tr>
				<tr><td></td><td><b class="H">Daniel Crawford</b> kann <b class="G">Hannad Harkouk</b> mit einem gelungenem Dribbling überspielen</td></tr>
				<tr><td></td><td><b class="H">Daniel Crawford</b> mit langem Pass zu <b class="H">Joseph Russell</b></td></tr>
				<tr><td></td><td>Ein Flatterball von <b class="H">Joseph Russell</b> Richtung linke Torseite - Der Ball geht weit am Tor vorbei</td></tr>
				<tr><td valign="top" align="right">17.</td><td><b class="H">Willo Cunningham</b> mit Kurzpass zu <b class="H">Wes Robinson</b></td></tr>
				<tr><td></td><td><b style="color: orange;">Der Linienrichter hebt die Fahne - ABSEITS!</b></td></tr>
				<tr><td valign="top" align="right">18.</td><td><b class="H">Willie Cragg</b> spielt den Ball zu <b class="H">Paul MacDonald</b> weiter</td></tr>
				<tr><td></td><td><b class="H">Paul MacDonald</b> kann <b class="G">Jan Huovinen</b> nicht mit einem Übersteiger versetzen</td></tr>
				<tr><td valign="top" align="right">19.</td><td><b class="H">Declan ONeill</b> spielt den Ball lang zu <b class="H">Gerard Paisley</b> weiter</td></tr>
				<tr><td></td><td><b class="G">Hubert Smidts</b> erkämpft sich den Ball - Torchance vereitelt</td></tr>
				<tr><td valign="top" align="right">20.</td><td><b class="H">Declan ONeill</b> spielt den Ball lang zu <b class="H">Paul MacDonald</b></td></tr>
				<tr><td></td><td><b class="H">Paul MacDonald</b> spielt mit einem kurzen Pass zu <b class="H">Wes Robinson</b> weiter</td></tr>
				<tr><td></td><td><b class="H">Wes Robinson</b> verlädt <b class="G">George Kallur</b> mit einer gelungenen Körpertäuschung</td></tr>
				<tr><td></td><td><b class="H">Wes Robinson</b> legt sich den Ball auf den richtigen Fuss und zieht ab - <b class="G">Mihajlo Remac</b> lenkt den Ball zur Ecke ab - Eckball</td></tr>
				<tr><td></td><td><b>Ecke</b>: <b class="H">Daniel Crawford</b> zieht den Ball vor das Tor</td></tr>
				<tr><td></td><td>Der Ball landet beim Keeper</td></tr>
				<tr><td valign="top" align="right">21.</td><td><b class="H">Paul MacDonald</b> spielt den Ball lang zu <b class="H">Gerard Paisley</b></td></tr>
				<tr><td></td><td>Ein Schuss von <b class="H">Gerard Paisley</b> Richtung rechte Torseite - Torwart <b class="G">Mihajlo Remac</b> faustet den Ball weg</td></tr>
				<tr><td valign="top" align="right">22.</td><td><b class="H">Paul MacDonald</b> spielt den Ball kurz zu <b class="H">Gerard Paisley</b> weiter</td></tr>
				<tr><td></td><td><b class="H">Gerard Paisley</b> passt lang zu <b class="H">Daniel Crawford</b></td></tr>
				<tr><td></td><td><b class="H">Daniel Crawford</b> spielt einen kurzen Ball zu <b class="H">Gerard Paisley</b></td></tr>
				<tr><td></td><td><b class="H">Gerard Paisley</b> verlädt <b class="G">Hubert Smidts</b> mit einer gelungenen Körpertäuschung</td></tr>
				<tr><td></td><td>Harter Schuss von <b class="H">Gerard Paisley</b> Richtung rechte Torseite - Der Ball geht neben das Tor</td></tr>
				<tr><td valign="top" align="right">23.</td><td><b class="G">Raul Pires</b> spielt den Ball kurz zu <b class="G">Mario Van den Wyngaert</b> weiter</td></tr>
				<tr><td></td><td><b class="G">Mario Van den Wyngaert</b> spielt den Ball zu <b class="G">Nicolas Vermaut</b> weiter</td></tr>
				<tr><td></td><td><b class="G">Nicolas Vermaut</b> spielt den Ball lang zu <b class="G">Esat Ymeri</b> weiter - Der Ball geht an Freund und Feind vorbei ins Aus</td></tr>
				<tr><td valign="top" align="right">24.</td><td><b class="H">Willo Cunningham</b> spielt den Ball lang zu <b class="H">Paul MacDonald</b> weiter</td></tr>
				<tr><td></td><td><b class="H">Paul MacDonald</b> versucht einen Beinschuss, aber <b class="G">Jan Huovinen</b> hat aufgepasst.</td></tr>
				<tr><td valign="top" align="right">25.</td><td><b class="H">Declan ONeill</b> spielt mit einem kurzen Pass zu <b class="H">Paul MacDonald</b> weiter</td></tr>
				<tr><td></td><td><b class="H">Paul MacDonald</b> spielt einen langen Ball zu <b class="H">Gerard Paisley</b></td></tr>
				<tr><td></td><td><b class="H">Gerard Paisley</b> verstolpert den Ball bei einem versuchtem Dribbling</td></tr>
				<tr><td valign="top" align="right">26.</td><td><b class="G">Mario Van den Wyngaert</b> spielt den Ball zu <b class="G">Jan Huovinen</b> weiter</td></tr>
				<tr><td></td><td><b class="G">Jan Huovinen</b> mit langem Pass zu <b class="G">Sergei Razumau</b> - Verunglückt völlig und landet beim Gegner</td></tr>
				<tr><td valign="top" align="right">27.</td><td><b class="H">Willie Cragg</b> spielt mit einem langen Pass zu <b class="H">Rory Francis</b> weiter</td></tr>
				<tr><td></td><td><b class="H">Rory Francis</b> spielt den Ball kurz zu <b class="H">Joseph Russell</b> weiter</td></tr>
				<tr><td></td><td><b class="H">Joseph Russell</b> tankt sich gegen <b class="G">Ruud Lemmens</b> bullig durch</td></tr>
				<tr><td></td><td><b class="H">Joseph Russell</b> flankt den Ball hoch nach vorne</td></tr>
				<tr><td></td><td><b class="H">Wes Robinson</b> kommt zum Kopfball - Der Keeper hat den Ball sicher</td></tr>
				<tr><td valign="top" align="right">28.</td><td><b class="H">Paul MacDonald</b> spielt einen langen Ball zu <b class="H">Daniel Crawford</b></td></tr>
				<tr><td></td><td><b class="H">Daniel Crawford</b> versucht vergeblich eine Körpertäuschung bei <b class="G">Hannad Harkouk</b></td></tr>
				<tr><td valign="top" align="right">29.</td><td><b class="G">Raul Pires</b> spielt den Ball kurz zu <b class="G">Nicolas Vermaut</b></td></tr>
				<tr><td></td><td><b class="G">Nicolas Vermaut</b> verlädt <b class="H">Joseph Russell</b> mit einer gelungenen Körpertäuschung</td></tr>
				<tr><td></td><td><b class="G">Nicolas Vermaut</b> spielt einen langen Ball zu <b class="G">Hubert Smidts</b></td></tr>
				<tr><td></td><td><b class="G">Hubert Smidts</b> spielt mit einem kurzen Pass zu <b class="G">Sergei Razumau</b> weiter - <b class="G">Sergei Razumau</b> bekommt den Ball nicht unter Kontrolle</td></tr>
				<tr><td valign="top" align="right">30.</td><td><b class="G">Raul Pires</b> spielt einen langen Ball zu <b class="G">Esat Ymeri</b></td></tr>
				<tr><td></td><td><b class="H">Gerard Paisley</b> lässt <b class="G">Esat Ymeri</b> nicht vorbei</td></tr>
				<tr><td valign="top" align="right">31.</td><td><b class="G">George Kallur</b> spielt den Ball kurz zu <b class="G">Nicolas Vermaut</b></td></tr>
				<tr><td></td><td><b class="G">Nicolas Vermaut</b> verlädt <b class="H">Joseph Russell</b> mit einer gelungenen Körpertäuschung</td></tr>
				<tr><td></td><td><b class="G">Nicolas Vermaut</b> mit Kurzpass zu <b class="G">Esat Ymeri</b></td></tr>
				<tr><td></td><td>Strammer Linksschuß von <b class="G">Esat Ymeri</b> - <b class="H">Steve Stapleton</b> kann den Ball nicht richtig festhalten, der Ball geht zurück in das Spiel</td></tr>
				<tr><td valign="top" align="right">32.</td><td><b class="G">George Kallur</b> spielt den Ball zu <b class="G">Mario Van den Wyngaert</b> weiter</td></tr>
				<tr><td></td><td><b class="G">Mario Van den Wyngaert</b> mit langem Pass zu <b class="G">Esat Ymeri</b></td></tr>
				<tr><td></td><td><b class="G">Esat Ymeri</b> versetzt <b class="H">Daniel Crawford</b> mit einem Übersteiger</td></tr>
				<tr><td></td><td><b class="G">Esat Ymeri</b> spielt den Ball kurz zu <b class="G">Sergei Razumau</b> weiter</td></tr>
				<tr><td></td><td><b class="G">Sergei Razumau</b> schiesst aufs Tor - Der Ball landet beim Keeper</td></tr>
				<tr><td valign="top" align="right">33.</td><td><b class="G">George Kallur</b> spielt mit einem langen Pass zu <b class="G">Nicolas Vermaut</b> weiter</td></tr>
				<tr><td></td><td><b class="G">Nicolas Vermaut</b> spielt den Ball kurz zu <b class="G">Esat Ymeri</b> weiter</td></tr>
				<tr><td></td><td><b class="G">Esat Ymeri</b> spielt den Ball kurz zu <b class="G">Jan Huovinen</b> weiter</td></tr>
				<tr><td></td><td><b class="G">Jan Huovinen</b> spielt den Ball zu <b class="G">Sergei Razumau</b> weiter - Der Ball geht ins Aus</td></tr>
				<tr><td valign="top" align="right">34.</td><td><b class="G">George Kallur</b> per langem Pass zu <b class="G">Ruud Lemmens</b></td></tr>
				<tr><td></td><td><b class="G">Ruud Lemmens</b> kann <b class="H">Gareth Lyons</b> mit einem gelungenem Dribbling überspielen</td></tr>
				<tr><td></td><td><b class="G">Ruud Lemmens</b> spielt den Ball kurz zu <b class="G">Hannad Harkouk</b></td></tr>
				<tr><td></td><td><b class="H">Willie Cragg</b> lässt <b class="G">Hannad Harkouk</b> nicht vorbei</td></tr>
				<tr><td valign="top" align="right">35.</td><td><b class="H">Paul MacDonald</b> spielt einen kurzen Ball zu <b class="H">Gareth Lyons</b></td></tr>
				<tr><td></td><td><b class="H">Gareth Lyons</b> verstolpert den Ball bei einem versuchtem Dribbling</td></tr>
				<tr><td valign="top" align="right">36.</td><td><b class="H">Willo Cunningham</b> spielt den Ball kurz zu <b class="H">Joseph Russell</b> weiter</td></tr>
				<tr><td></td><td><b style="color: orange;">Der Linienrichter hebt die Fahne - ABSEITS!</b></td></tr>
				<tr><td valign="top" align="right">37.</td><td><b class="H">Declan ONeill</b> passt den Ball direkt auf <b class="H">Gareth Lyons</b></td></tr>
				<tr><td></td><td><b class="H">Gareth Lyons</b> spielt mit einem kurzen Pass zu <b class="H">Gerard Paisley</b> weiter</td></tr>
				<tr><td></td><td><b class="G">Esat Ymeri</b> erkämpft sich den Ball - Torchance vereitelt</td></tr>
				<tr><td valign="top" align="right">38.</td><td><b class="H">Willo Cunningham</b> spielt den Ball kurz zu <b class="H">Gerard Paisley</b> - <b class="H">Gerard Paisley</b> bekommt den Ball nicht unter Kontrolle</td></tr>
				<tr><td valign="top" align="right">39.</td><td><b class="H">Willo Cunningham</b> spielt den Ball lang zu <b class="H">Daniel Crawford</b></td></tr>
				<tr><td></td><td><b class="H">Daniel Crawford</b> per Kurzpass zu <b class="H">Gerard Paisley</b> - <b class="H">Gerard Paisley</b> bekommt den Ball nicht unter Kontrolle</td></tr>
				<tr><td valign="top" align="right">40.</td><td><b class="G">Raul Pires</b> spielt den Ball kurz zu <b class="G">Esat Ymeri</b> weiter</td></tr>
				<tr><td></td><td><b class="G">Esat Ymeri</b> versucht einen Beinschuss, aber <b class="H">Willie Cragg</b> hat aufgepasst.</td></tr>
				<tr><td valign="top" align="right">41.</td><td><b class="H">Paul MacDonald</b> per Kurzpass zu <b class="H">Gerard Paisley</b> - <b class="H">Gerard Paisley</b> bekommt den Ball nicht unter Kontrolle</td></tr>
				<tr><td valign="top" align="right">42.</td><td><b class="H">Willie Cragg</b> spielt den Ball lang zu <b class="H">Daniel Crawford</b> weiter</td></tr>
				<tr><td></td><td><b class="H">Daniel Crawford</b> spielt einen langen Ball zu <b class="H">Gerard Paisley</b></td></tr>
				<tr><td></td><td><b class="H">Gerard Paisley</b> passt den Ball direkt auf <b class="H">Declan ONeill</b></td></tr>
				<tr><td></td><td><b class="H">Declan ONeill</b> spielt den Ball kurz zu <b class="H">Wes Robinson</b> weiter</td></tr>
				<tr><td></td><td><b style="color: orange;">Der Linienrichter hebt die Fahne - ABSEITS!</b></td></tr>
				<tr><td valign="top" align="right">43.</td><td><b class="H">Paul MacDonald</b> spielt mit einem kurzen Pass zu <b class="H">Daniel Crawford</b> weiter</td></tr>
				<tr><td></td><td><b class="H">Daniel Crawford</b> per langem Pass zu <b class="H">Gerard Paisley</b></td></tr>
				<tr><td></td><td><b class="H">Gerard Paisley</b> versucht vergeblich eine Körpertäuschung bei <b class="G">Raul Pires</b></td></tr>
				<tr><td valign="top" align="right">44.</td><td><b class="G">Raul Pires</b> spielt den Ball lang zu <b class="G">Ruud Lemmens</b></td></tr>
				<tr><td></td><td><b class="G">Ruud Lemmens</b> tankt sich gegen <b class="H">Gareth Lyons</b> bullig durch</td></tr>
				<tr><td></td><td><b class="G">Ruud Lemmens</b> spielt den Ball lang zu <b class="G">Esat Ymeri</b></td></tr>
				<tr><td></td><td><b class="H">Gerard Paisley</b> lässt <b class="G">Esat Ymeri</b> nicht vorbei</td></tr>
				<tr><td valign="top" align="right">45.</td><td><b style="color: orange;">Auswärtsteam  wechselt: Serge Van den Wyngaert kommt für Raul Pires</b></td></tr>
				<tr><td></td><td><b style="color: orange;">Auswärtsteam  wechselt: Nikiforos Vandalis kommt für Hubert Smidts</b></td></tr>
				<tr><td></td><td><b class="G">Serge Van den Wyngaert</b> spielt den Ball kurz zu <b class="G">Nicolas Vermaut</b> weiter</td></tr>
				<tr><td></td><td><b class="G">Nicolas Vermaut</b> versucht vergeblich eine Körpertäuschung bei <b class="H">Daniel Crawford</b></td></tr>
				<tr><td></td><td><b style="color: cyan;">Halbzeit</b></td></tr>
				<tr><td valign="top" align="right">46.</td><td><b style="color: orange;">Heimteam  wechselt: Ian Quigley kommt für Willie Cragg</b></td></tr>
				<tr><td></td><td><b style="color: orange;">Heimteam  wechselt: Jonathan Croly kommt für Wes Robinson</b></td></tr>
				<tr><td></td><td><b style="color: orange;">Heimteam ändert die Sturmtaktik auf Mittelstürmer</b></td></tr>
				<tr><td></td><td><b class="H">Paul MacDonald</b> mit Kurzpass zu <b class="H">Daniel Crawford</b></td></tr>
				<tr><td></td><td><b class="H">Daniel Crawford</b> tankt sich gegen <b class="G">Hannad Harkouk</b> bullig durch</td></tr>
				<tr><td></td><td><b class="H">Daniel Crawford</b> spielt mit einem kurzen Pass zu <b class="H">Gerard Paisley</b> weiter</td></tr>
				<tr><td></td><td><b class="H">Gerard Paisley</b> spielt einen langen Ball zu <b class="H">Declan ONeill</b></td></tr>
				<tr><td></td><td><b class="H">Declan ONeill</b> spielt mit einem langen Pass zu <b class="H">Gerard Paisley</b> weiter</td></tr>
				<tr><td></td><td><b class="H">Gerard Paisley</b> versucht vergeblich den Ball über <b class="G">Nikiforos Vandalis</b> zu heben</td></tr>
				<tr><td valign="top" align="right">47.</td><td><b class="H">Ian Quigley</b> spielt mit einem kurzen Pass zu <b class="H">Rory Francis</b> weiter</td></tr>
				<tr><td></td><td><b class="G">Serge Van den Wyngaert</b> erkämpft sich den Ball - Torchance vereitelt</td></tr>
				<tr><td valign="top" align="right">48.</td><td><b class="H">Paul MacDonald</b> spielt mit einem kurzen Pass zu <b class="H">Declan ONeill</b> weiter</td></tr>
				<tr><td></td><td><b class="H">Declan ONeill</b> tankt sich gegen <b class="G">Nikiforos Vandalis</b> bullig durch</td></tr>
				<tr><td></td><td><b class="H">Declan ONeill</b> spielt mit einem kurzen Pass zu <b class="H">Jonathan Croly</b> weiter</td></tr>
				<tr><td></td><td><b class="H">Jonathan Croly</b> lässt <b class="G">Mario Van den Wyngaert</b> wie einen Schuljungen stehen</td></tr>
				<tr><td></td><td>Ein Flatterball von <b class="H">Jonathan Croly</b> Richtung linke Torseite - Der Ball geht an die Latte</td></tr>
				<tr><td></td><td><b style="color: yellow;">Mihajlo Remac kassiert die gelbe Karte für das Wegschiessen des Balles</b></td></tr>
				<tr><td valign="top" align="right">49.</td><td><b class="H">Ian Quigley</b> passt den Ball direkt auf <b class="H">Daniel Crawford</b></td></tr>
				<tr><td></td><td><b class="H">Daniel Crawford</b> schiesst mit viel Effet Richtung Kreuzecke - <b class="G">Mihajlo Remac</b> lenkt den Ball zur Ecke ab - Eckball</td></tr>
				<tr><td></td><td><b>Ecke</b>: <b class="H">Daniel Crawford</b> zieht den Ball auf den zweiten Pfosten</td></tr>
				<tr><td></td><td>Der Ball landet beim Keeper</td></tr>
				<tr><td valign="top" align="right">50.</td><td><b class="G">Mario Van den Wyngaert</b> spielt mit einem kurzen Pass zu <b class="G">Nicolas Vermaut</b> weiter</td></tr>
				<tr><td></td><td><b class="G">Nicolas Vermaut</b> verlädt <b class="H">Joseph Russell</b> mit einer gelungenen Körpertäuschung</td></tr>
				<tr><td></td><td><b class="G">Nicolas Vermaut</b> spielt einen kurzen Ball zu <b class="G">Esat Ymeri</b></td></tr>
				<tr><td></td><td><b class="H">Gerard Paisley</b> erkämpft sich den Ball - Torchance vereitelt</td></tr>
				<tr><td valign="top" align="right">51.</td><td><b class="H">Declan ONeill</b> spielt den Ball kurz zu <b class="H">Rory Francis</b> weiter</td></tr>
				<tr><td></td><td><b class="H">Rory Francis</b> kann <b class="G">George Kallur</b> nicht mit einem Übersteiger versetzen</td></tr>
				<tr><td valign="top" align="right">52.</td><td><b class="G">Serge Van den Wyngaert</b> spielt den Ball lang zu <b class="G">Nicolas Vermaut</b></td></tr>
				<tr><td></td><td>Harter Schuss von <b class="G">Nicolas Vermaut</b> Richtung Tormitte - Torwart <b class="H">Steve Stapleton</b> faustet den Ball weg</td></tr>
				<tr><td valign="top" align="right">53.</td><td><b class="G">Serge Van den Wyngaert</b> passt den Ball direkt auf <b class="G">Ruud Lemmens</b></td></tr>
				<tr><td></td><td><b class="G">Ruud Lemmens</b> verstolpert den Ball bei einem versuchtem Dribbling</td></tr>
				<tr><td valign="top" align="right">54.</td><td><b class="G">George Kallur</b> per Kurzpass zu <b class="G">Nicolas Vermaut</b></td></tr>
				<tr><td></td><td><b class="G">Nicolas Vermaut</b> mit Kurzpass zu <b class="G">Esat Ymeri</b></td></tr>
				<tr><td></td><td><b class="G">Esat Ymeri</b> spielt einen kurzen Ball zu <b class="G">Sergei Razumau</b></td></tr>
				<tr><td></td><td>Ein Schuss von <b class="G">Sergei Razumau</b> Richtung linke Torseite - <b class="H">Steve Stapleton</b> kann den Ball nicht richtig festhalten, der Ball geht ins Toraus – Eckball</td></tr>
				<tr><td></td><td><b>Ecke</b>: <b class="G">Ruud Lemmens</b> zieht den Ball vor das Tor</td></tr>
				<tr><td></td><td>Ein Schlenzer von <b class="G">Nicolas Vermaut</b> Richtung Tormitte - <b class="H">Steve Stapleton</b> kommt heraus und fängt den Ball sicher</td></tr>
				<tr><td valign="top" align="right">55.</td><td><b class="H">Paul MacDonald</b> mit langem Pass zu <b class="H">Jonathan Croly</b></td></tr>
				<tr><td></td><td>Strammer Linksschuß von <b class="H">Jonathan Croly</b> - <b class="G">Mihajlo Remac</b> kann den Ball locker festhalten</td></tr>
				<tr><td valign="top" align="right">56.</td><td><b class="G">Mario Van den Wyngaert</b> per langem Pass zu <b class="G">Ruud Lemmens</b></td></tr>
				<tr><td></td><td><b class="G">Ruud Lemmens</b> versucht vergeblich eine Körpertäuschung bei <b class="H">Gareth Lyons</b></td></tr>
				<tr><td valign="top" align="right">57.</td><td><b class="G">Serge Van den Wyngaert</b> spielt mit einem langen Pass zu <b class="G">Sergei Razumau</b> weiter</td></tr>
				<tr><td></td><td><b class="H">Paul MacDonald</b> erkämpft sich den Ball - Torchance vereitelt</td></tr>
				<tr><td valign="top" align="right">58.</td><td><b class="G">Serge Van den Wyngaert</b> spielt einen langen Ball zu <b class="G">Ruud Lemmens</b></td></tr>
				<tr><td></td><td><b class="G">Ruud Lemmens</b> kann <b class="H">Paul MacDonald</b> mit einem gelungenem Dribbling überspielen</td></tr>
				<tr><td></td><td><b class="G">Ruud Lemmens</b> spielt den Ball kurz zu <b class="G">Esat Ymeri</b></td></tr>
				<tr><td></td><td><b class="G">Esat Ymeri</b> lässt <b class="H">Daniel Crawford</b> wie einen Schuljungen stehen</td></tr>
				<tr><td></td><td><b class="G">Esat Ymeri</b> flankt den Ball hoch nach vorne</td></tr>
				<tr><td></td><td><b class="G">Sergei Razumau</b> nimmt den Ball Volley - Der Ball geht am Tor vorbei</td></tr>
				<tr><td valign="top" align="right">59.</td><td><b class="H">Gerard Paisley</b> verlädt <b class="G">Nikiforos Vandalis</b> mit einer gelungenen Körpertäuschung</td></tr>
				<tr><td></td><td><b class="H">Gerard Paisley</b> mit langem Pass zu <b class="H">Gareth Lyons</b></td></tr>
				<tr><td></td><td><b class="H">Gareth Lyons</b> per langem Pass zu <b class="H">Gerard Paisley</b></td></tr>
				<tr><td></td><td><b class="H">Gerard Paisley</b> verpasst <b class="G">Nikiforos Vandalis</b> einen Beinschuss</td></tr>
				<tr><td></td><td><b class="H">Gerard Paisley</b> spielt den Ball lang zu <b class="H">Gareth Lyons</b> weiter</td></tr>
				<tr><td></td><td><b class="H">Gareth Lyons</b> versucht vergeblich eine Körpertäuschung bei <b class="G">Esat Ymeri</b></td></tr>
				<tr><td valign="top" align="right">60.</td><td><b style="color: orange;">Heimteam  wechselt: Adrian White kommt für Daniel Crawford</b></td></tr>
				<tr><td></td><td><b class="H">Paul MacDonald</b> spielt mit einem kurzen Pass zu <b class="H">Willo Cunningham</b> weiter</td></tr>
				<tr><td></td><td><b class="H">Willo Cunningham</b> kann <b class="G">Sergei Razumau</b> nicht mit einem Übersteiger versetzen</td></tr>
				<tr><td valign="top" align="right">61.</td><td><b class="H">Declan ONeill</b> passt lang zu <b class="H">Willo Cunningham</b></td></tr>
				<tr><td></td><td><b class="H">Willo Cunningham</b> lässt <b class="G">Sergei Razumau</b> wie einen Schuljungen stehen</td></tr>
				<tr><td></td><td><b class="H">Willo Cunningham</b> mit Kurzpass zu <b class="H">Gerard Paisley</b> - <b class="H">Gerard Paisley</b> bekommt den Ball nicht unter Kontrolle</td></tr>
				<tr><td valign="top" align="right">62.</td><td><b class="H">Adrian White</b> verpasst <b class="G">Hannad Harkouk</b> einen Beinschuss</td></tr>
				<tr><td></td><td><b class="H">Adrian White</b> mit Kurzpass zu <b class="H">Declan ONeill</b></td></tr>
				<tr><td></td><td><b class="H">Declan ONeill</b> kann <b class="G">Nikiforos Vandalis</b> mit einem gelungenem Dribbling überspielen</td></tr>
				<tr><td></td><td><b class="H">Declan ONeill</b> spielt den Ball lang zu <b class="H">Adrian White</b></td></tr>
				<tr><td></td><td><b class="H">Adrian White</b> flankt in den Strafraum</td></tr>
				<tr><td></td><td><b class="G">Serge Van den Wyngaert</b> köpft den Ball aus der Gefahrenzone</td></tr>
				<tr><td valign="top" align="right">63.</td><td><b class="G">Mario Van den Wyngaert</b> passt den Ball direkt auf <b class="G">Nicolas Vermaut</b></td></tr>
				<tr><td></td><td><b class="G">Nicolas Vermaut</b> kann <b class="H">Joseph Russell</b> nicht überspielen</td></tr>
				<tr><td valign="top" align="right">64.</td><td><b class="H">Willo Cunningham</b> passt den Ball direkt auf <b class="H">Ian Quigley</b></td></tr>
				<tr><td></td><td>Strammer Linksschuß von <b class="H">Ian Quigley</b> - <b class="G">Mihajlo Remac</b> kommt heraus und lenkt den Ball zur Ecke ab</td></tr>
				<tr><td></td><td><b>Ecke</b>: <b class="H">Gerard Paisley</b> zieht den Ball auf den zweiten Pfosten</td></tr>
				<tr><td></td><td>Der Ball landet beim Keeper</td></tr>
				<tr><td valign="top" align="right">65.</td><td><b class="G">Esat Ymeri</b> spielt den Ball zu <b class="G">Nikiforos Vandalis</b> weiter</td></tr>
				<tr><td></td><td><b class="G">Nikiforos Vandalis</b> lässt <b class="H">Declan ONeill</b> wie einen Schuljungen stehen</td></tr>
				<tr><td></td><td><b class="G">Nikiforos Vandalis</b> spielt den Ball lang zu <b class="G">Jan Huovinen</b></td></tr>
				<tr><td></td><td><b class="G">Jan Huovinen</b> verpasst <b class="H">Willo Cunningham</b> einen Beinschuss</td></tr>
				<tr><td></td><td><b class="G">Jan Huovinen</b> schiesst den Ball in die rechte Ecke - <b class="H">Steve Stapleton</b> bleibt wie angewurzelt stehen, TOR</td></tr>
				<tr><td></td><td><b style="color: orange;">Neuer Spielstand: 0:1 (Jan Huovinen, Nikiforos Vandalis)</b></td></tr>
				<tr><td valign="top" align="right">66.</td><td><b class="G">Serge Van den Wyngaert</b> spielt mit einem langen Pass zu <b class="G">Esat Ymeri</b> weiter</td></tr>
				<tr><td></td><td><b class="G">Esat Ymeri</b> kann <b class="H">Adrian White</b> nicht überspielen</td></tr>
				<tr><td valign="top" align="right">67.</td><td><b class="H">Willo Cunningham</b> spielt den Ball kurz zu <b class="H">Rory Francis</b></td></tr>
				<tr><td></td><td><b class="G">Serge Van den Wyngaert</b> lässt <b class="H">Rory Francis</b> nicht vorbei</td></tr>
				<tr><td valign="top" align="right">68.</td><td><b class="G">Mario Van den Wyngaert</b> mit Kurzpass zu <b class="G">Serge Van den Wyngaert</b></td></tr>
				<tr><td></td><td><b class="G">Serge Van den Wyngaert</b> per Kurzpass zu <b class="G">Mario Van den Wyngaert</b></td></tr>
				<tr><td></td><td><b class="G">Mario Van den Wyngaert</b> versucht vergeblich den Ball über <b class="H">Gerard Paisley</b> zu heben</td></tr>
				<tr><td valign="top" align="right">69.</td><td><b class="H">Willo Cunningham</b> mit langem Pass zu <b class="H">Paul MacDonald</b></td></tr>
				<tr><td></td><td><b class="H">Paul MacDonald</b> tankt sich gegen <b class="G">Jan Huovinen</b> bullig durch</td></tr>
				<tr><td></td><td><b class="H">Paul MacDonald</b> mit langem Pass zu <b class="H">Willo Cunningham</b></td></tr>
				<tr><td></td><td><b class="H">Willo Cunningham</b> versucht vergeblich eine Körpertäuschung bei <b class="G">Sergei Razumau</b></td></tr>
				<tr><td valign="top" align="right">70.</td><td><b class="G">George Kallur</b> passt lang zu <b class="G">Nicolas Vermaut</b></td></tr>
				<tr><td></td><td><b class="G">Nicolas Vermaut</b> kann <b class="H">Gareth Lyons</b> mit einem gelungenem Dribbling überspielen</td></tr>
				<tr><td></td><td><b class="G">Nicolas Vermaut</b> flankt den Ball vor das Tor</td></tr>
				<tr><td></td><td><b class="G">Jan Huovinen</b> gewinnt das Kopfballduell und köpft den Ball aufs Tor - Der Ball geht an den Pfosten</td></tr>
				<tr><td valign="top" align="right">71.</td><td><b class="H">Paul MacDonald</b> spielt mit einem kurzen Pass zu <b class="H">Rory Francis</b> weiter</td></tr>
				<tr><td></td><td><b class="H">Rory Francis</b> kann <b class="G">Serge Van den Wyngaert</b> nicht mit einem Übersteiger versetzen</td></tr>
				<tr><td valign="top" align="right">72.</td><td><b class="H">Ian Quigley</b> spielt einen langen Ball zu <b class="H">Declan ONeill</b></td></tr>
				<tr><td></td><td><b class="H">Declan ONeill</b> spielt einen kurzen Ball zu <b class="H">Adrian White</b></td></tr>
				<tr><td></td><td><b class="H">Adrian White</b> mit langem Pass zu <b class="H">Rory Francis</b></td></tr>
				<tr><td></td><td><b class="G">Serge Van den Wyngaert</b> erkämpft sich den Ball - Torchance vereitelt</td></tr>
				<tr><td valign="top" align="right">73.</td><td><b class="H">Ian Quigley</b> passt lang zu <b class="H">Rory Francis</b></td></tr>
				<tr><td></td><td><b class="H">Rory Francis</b> spielt den Ball zu <b class="H">Gareth Lyons</b> weiter</td></tr>
				<tr><td></td><td><b class="H">Gareth Lyons</b> verstolpert den Ball bei einem versuchtem Dribbling</td></tr>
				<tr><td valign="top" align="right">74.</td><td><b class="H">Ian Quigley</b> spielt mit einem langen Pass zu <b class="H">Declan ONeill</b> weiter</td></tr>
				<tr><td></td><td><b class="H">Declan ONeill</b> spielt mit einem kurzen Pass zu <b class="H">Gerard Paisley</b> weiter</td></tr>
				<tr><td></td><td><b class="H">Gerard Paisley</b> passt lang zu <b class="H">Rory Francis</b></td></tr>
				<tr><td></td><td><b class="G">Serge Van den Wyngaert</b> lässt <b class="H">Rory Francis</b> nicht vorbei</td></tr>
				<tr><td valign="top" align="right">75.</td><td><b class="G">Mario Van den Wyngaert</b> spielt den Ball zu <b class="G">Ruud Lemmens</b> weiter</td></tr>
				<tr><td></td><td><b class="G">Ruud Lemmens</b> lässt <b class="H">Gareth Lyons</b> wie einen Schuljungen stehen</td></tr>
				<tr><td></td><td><b class="G">Ruud Lemmens</b> per langem Pass zu <b class="G">Nicolas Vermaut</b></td></tr>
				<tr><td></td><td><b class="G">Nicolas Vermaut</b> spielt einen langen Ball zu <b class="G">Nikiforos Vandalis</b></td></tr>
				<tr><td></td><td><b class="G">Nikiforos Vandalis</b> versucht vergeblich den Ball über <b class="H">Ian Quigley</b> zu heben</td></tr>
				<tr><td valign="top" align="right">76.</td><td><b class="G">Serge Van den Wyngaert</b> spielt mit einem kurzen Pass zu <b class="G">Ruud Lemmens</b> weiter</td></tr>
				<tr><td></td><td><b class="G">Ruud Lemmens</b> spielt den Ball kurz zu <b class="G">Nicolas Vermaut</b> weiter - Verunglückt völlig und landet beim Gegner</td></tr>
				<tr><td valign="top" align="right">77.</td><td><b class="H">Paul MacDonald</b> spielt den Ball kurz zu <b class="H">Gerard Paisley</b></td></tr>
				<tr><td></td><td>Foul von <b class="G">Nikiforos Vandalis</b> an <b class="H">Gerard Paisley</b> - FREISTOSS</td></tr>
				<tr><td></td><td><b>Freistoss</b>: <b class="H">Rory Francis</b> schiesst aufs Tor</td></tr>
				<tr><td></td><td>Der Ball geht an den Pfosten</td></tr>
				<tr><td valign="top" align="right">78.</td><td><b class="G">Serge Van den Wyngaert</b> passt den Ball direkt auf <b class="G">Ruud Lemmens</b></td></tr>
				<tr><td></td><td><b class="G">Ruud Lemmens</b> kann <b class="H">Gareth Lyons</b> nicht umspielen</td></tr>
				<tr><td valign="top" align="right">79.</td><td><b class="G">Serge Van den Wyngaert</b> spielt den Ball kurz zu <b class="G">Esat Ymeri</b> weiter</td></tr>
				<tr><td></td><td><b class="G">Esat Ymeri</b> spielt den Ball lang zu <b class="G">Jan Huovinen</b></td></tr>
				<tr><td></td><td><b style="color: orange;">Der Linienrichter hebt die Fahne - ABSEITS!</b></td></tr>
				<tr><td valign="top" align="right">80.</td><td><b class="G">Serge Van den Wyngaert</b> spielt den Ball lang zu <b class="G">Esat Ymeri</b></td></tr>
				<tr><td></td><td><b class="G">Esat Ymeri</b> spielt mit einem kurzen Pass zu <b class="G">Jan Huovinen</b> weiter</td></tr>
				<tr><td></td><td><b class="G">Jan Huovinen</b> kann <b class="H">Paul MacDonald</b> nicht umspielen</td></tr>
				<tr><td valign="top" align="right">81.</td><td><b class="H">Declan ONeill</b> passt lang zu <b class="H">Jonathan Croly</b></td></tr>
				<tr><td></td><td>Ein Flatterball von <b class="H">Jonathan Croly</b> Richtung linke Torseite - <b class="G">Mihajlo Remac</b> kann den Ball mit den Fingerspitzen abwehren</td></tr>
				<tr><td valign="top" align="right">82.</td><td><b class="H">Paul MacDonald</b> spielt mit einem kurzen Pass zu <b class="H">Willo Cunningham</b> weiter</td></tr>
				<tr><td></td><td><b class="G">Sergei Razumau</b> lässt <b class="H">Willo Cunningham</b> nicht vorbei</td></tr>
				<tr><td valign="top" align="right">83.</td><td><b class="H">Paul MacDonald</b> flankt in den Strafraum</td></tr>
				<tr><td></td><td><b class="H">Rory Francis</b> köpft mit einem Aufsetzer aufs lange Eck - <b class="G">Mihajlo Remac</b> lenkt den Ball zur Ecke ab - Eckball</td></tr>
				<tr><td></td><td><b>Ecke</b>: <b class="H">Gerard Paisley</b> zieht den Ball auf den zweiten Pfosten</td></tr>
				<tr><td></td><td><b class="H">Joseph Russell</b> köpft aufs Tor - <b class="G">Mihajlo Remac</b> kommt heraus, hat den Ball schlecht berechnet und kann ihn nicht festhalten, TOR</td></tr>
				<tr><td></td><td><b style="color: orange;">Neuer Spielstand: 1:1 (Joseph Russell, Gerard Paisley)</b></td></tr>
				<tr><td valign="top" align="right">84.</td><td><b class="G">Mario Van den Wyngaert</b> spielt mit einem kurzen Pass zu <b class="G">Serge Van den Wyngaert</b> weiter</td></tr>
				<tr><td></td><td>Ein Schuss von <b class="G">Serge Van den Wyngaert</b> Richtung linke Torseite - Der Ball geht neben das Tor</td></tr>
				<tr><td valign="top" align="right">85.</td><td><b class="H">Declan ONeill</b> mit Kurzpass zu <b class="H">Gareth Lyons</b></td></tr>
				<tr><td></td><td><b class="H">Gareth Lyons</b> spielt den Ball kurz zu <b class="H">Gerard Paisley</b></td></tr>
				<tr><td></td><td><b class="H">Gerard Paisley</b> kann <b class="G">Nikiforos Vandalis</b> nicht überspielen</td></tr>
				<tr><td valign="top" align="right">86.</td><td><b class="H">Ian Quigley</b> spielt den Ball lang zu <b class="H">Rory Francis</b> weiter</td></tr>
				<tr><td></td><td><b class="H">Rory Francis</b> tankt sich gegen <b class="G">Serge Van den Wyngaert</b> bullig durch</td></tr>
				<tr><td></td><td><b class="H">Rory Francis</b> spielt den Ball kurz zu <b class="H">Joseph Russell</b> weiter</td></tr>
				<tr><td></td><td><b class="H">Joseph Russell</b> spielt einen kurzen Ball zu <b class="H">Rory Francis</b></td></tr>
				<tr><td></td><td><b class="H">Rory Francis</b> tankt sich gegen <b class="G">Serge Van den Wyngaert</b> bullig durch</td></tr>
				<tr><td></td><td>Ein Flatterball von <b class="H">Rory Francis</b> Richtung linke Torseite - Der Ball geht knapp über das Tor</td></tr>
				<tr><td valign="top" align="right">87.</td><td><b class="G">Mario Van den Wyngaert</b> passt lang zu <b class="G">Nicolas Vermaut</b></td></tr>
				<tr><td></td><td><b class="G">Nicolas Vermaut</b> spielt den Ball kurz zu <b class="G">Nikiforos Vandalis</b> weiter</td></tr>
				<tr><td></td><td><b class="G">Nikiforos Vandalis</b> verstolpert den Ball bei einem versuchtem Dribbling</td></tr>
				<tr><td valign="top" align="right">88.</td><td><b class="H">Declan ONeill</b> spielt den Ball kurz zu <b class="H">Gerard Paisley</b></td></tr>
				<tr><td></td><td><b class="H">Gerard Paisley</b> spielt den Ball kurz zu <b class="H">Declan ONeill</b></td></tr>
				<tr><td></td><td><b class="H">Declan ONeill</b> spielt mit einem kurzen Pass zu <b class="H">Paul MacDonald</b> weiter</td></tr>
				<tr><td></td><td><b class="G">Jan Huovinen</b> erkämpft sich den Ball - Torchance vereitelt</td></tr>
				<tr><td valign="top" align="right">89.</td><td><b class="H">Ian Quigley</b> spielt mit einem kurzen Pass zu <b class="H">Gareth Lyons</b> weiter</td></tr>
				<tr><td></td><td><b class="H">Gareth Lyons</b> versucht einen Beinschuss, aber <b class="G">Ruud Lemmens</b> hat aufgepasst.</td></tr>
				<tr><td valign="top" align="right">90.</td><td><b class="G">George Kallur</b> spielt den Ball kurz zu <b class="G">Esat Ymeri</b></td></tr>
				<tr><td></td><td><b class="G">Esat Ymeri</b> spielt den Ball kurz zu <b class="G">Nicolas Vermaut</b> weiter</td></tr>
				<tr><td></td><td><b class="G">Nicolas Vermaut</b> spielt den Ball lang zu <b class="G">Esat Ymeri</b> weiter - landet hinter dem Tor</td></tr>
				<tr><td></td><td><b style="color: cyan;">Verlängerung</b></td></tr>
				<tr><td valign="top" align="right">91.</td><td><b class="H">Willo Cunningham</b> spielt den Ball lang zu <b class="H">Jonathan Croly</b></td></tr>
				<tr><td></td><td><b class="H">Jonathan Croly</b> kann <b class="G">Mario Van den Wyngaert</b> nicht mit einem Übersteiger versetzen</td></tr>
				<tr><td valign="top" align="right">92.</td><td><b class="H">Paul MacDonald</b> spielt mit einem langen Pass zu <b class="H">Gerard Paisley</b> weiter</td></tr>
				<tr><td></td><td><b class="H">Gerard Paisley</b> kann <b class="G">Nikiforos Vandalis</b> nicht mit einem Übersteiger versetzen</td></tr>
				<tr><td valign="top" align="right">93.</td><td><b class="G">Mario Van den Wyngaert</b> passt lang zu <b class="G">Nicolas Vermaut</b></td></tr>
				<tr><td></td><td><b class="G">Nicolas Vermaut</b> spielt den Ball zu <b class="G">Hannad Harkouk</b> weiter</td></tr>
				<tr><td></td><td><b class="G">Hannad Harkouk</b> versucht einen Beinschuss, aber <b class="H">Declan ONeill</b> hat aufgepasst.</td></tr>
				<tr><td valign="top" align="right">94.</td><td><b class="G">Serge Van den Wyngaert</b> passt lang zu <b class="G">Esat Ymeri</b></td></tr>
				<tr><td></td><td><b class="H">Adrian White</b> erkämpft sich den Ball - Torchance vereitelt</td></tr>
				<tr><td valign="top" align="right">95.</td><td><b class="G">Mario Van den Wyngaert</b> spielt den Ball zu <b class="G">Nicolas Vermaut</b> weiter</td></tr>
				<tr><td></td><td><b class="G">Nicolas Vermaut</b> versucht einen Beinschuss, aber <b class="H">Joseph Russell</b> hat aufgepasst.</td></tr>
				<tr><td valign="top" align="right">96.</td><td><b class="H">Ian Quigley</b> spielt mit einem langen Pass zu <b class="H">Willo Cunningham</b> weiter</td></tr>
				<tr><td></td><td><b class="H">Willo Cunningham</b> verlädt <b class="G">Sergei Razumau</b> mit einer gelungenen Körpertäuschung</td></tr>
				<tr><td></td><td>Foul von <b class="G">Sergei Razumau</b> an <b class="H">Willo Cunningham</b> - FREISTOSS</td></tr>
				<tr><td></td><td><b style="color: yellow;">Sergei Razumau kassiert dafür die gelbe Karte</b></td></tr>
				<tr><td></td><td><b class="H">Gerard Paisley</b> flankt den Ball hoch nach vorne</td></tr>
				<tr><td></td><td><b class="G">Serge Van den Wyngaert</b> köpft den Ball aus der Gefahrenzone</td></tr>
				<tr><td valign="top" align="right">97.</td><td><b class="H">Willo Cunningham</b> spielt den Ball kurz zu <b class="H">Rory Francis</b></td></tr>
				<tr><td></td><td><b class="G">Serge Van den Wyngaert</b> lässt <b class="H">Rory Francis</b> nicht vorbei</td></tr>
				<tr><td valign="top" align="right">98.</td><td><b class="G">George Kallur</b> per langem Pass zu <b class="G">Nicolas Vermaut</b></td></tr>
				<tr><td></td><td><b class="G">Nicolas Vermaut</b> verlädt <b class="H">Joseph Russell</b> mit einer gelungenen Körpertäuschung</td></tr>
				<tr><td></td><td>Ein Schlenzer von <b class="G">Nicolas Vermaut</b> Richtung Tormitte - Glanzparade von <b class="H">Steve Stapleton</b></td></tr>
				<tr><td valign="top" align="right">99.</td><td><b class="H">Willo Cunningham</b> tankt sich gegen <b class="G">Sergei Razumau</b> bullig durch</td></tr>
				<tr><td></td><td><b class="G">Sergei Razumau</b> stellt <b class="H">Willo Cunningham</b> ein Bein - FREISTOSS</td></tr>
				<tr><td></td><td><b class="H">Gerard Paisley</b> spielt den Ball lang zu <b class="H">Adrian White</b></td></tr>
				<tr><td></td><td><b class="H">Adrian White</b> verpasst <b class="G">Ruud Lemmens</b> einen Beinschuss</td></tr>
				<tr><td></td><td><b class="H">Adrian White</b> spielt den Ball kurz zu <b class="H">Jonathan Croly</b> weiter</td></tr>
				<tr><td></td><td><b class="H">Jonathan Croly</b> kann <b class="G">Mario Van den Wyngaert</b> nicht mit einem Übersteiger versetzen</td></tr>
				<tr><td valign="top" align="right">100.</td><td><b class="G">Serge Van den Wyngaert</b> spielt einen langen Ball zu <b class="G">Nicolas Vermaut</b></td></tr>
				<tr><td></td><td><b class="H">Joseph Russell</b> erkämpft sich den Ball - Torchance vereitelt</td></tr>
				<tr><td valign="top" align="right">101.</td><td><b class="H">Willo Cunningham</b> spielt den Ball kurz zu <b class="H">Ian Quigley</b></td></tr>
				<tr><td></td><td><b class="H">Ian Quigley</b> spielt den Ball lang zu <b class="H">Rory Francis</b></td></tr>
				<tr><td></td><td>Harter Schuss von <b class="H">Rory Francis</b> Richtung rechte Torseite - Der Ball geht über das Tor</td></tr>
				<tr><td valign="top" align="right">102.</td><td><b class="G">Serge Van den Wyngaert</b> mit Kurzpass zu <b class="G">Nicolas Vermaut</b></td></tr>
				<tr><td></td><td><b class="G">Nicolas Vermaut</b> versucht einen Beinschuss, aber <b class="H">Joseph Russell</b> hat aufgepasst.</td></tr>
				<tr><td valign="top" align="right">103.</td><td><b class="H">Willo Cunningham</b> passt lang zu <b class="H">Adrian White</b></td></tr>
				<tr><td></td><td><b class="H">Adrian White</b> mit langem Pass zu <b class="H">Joseph Russell</b></td></tr>
				<tr><td></td><td><b class="H">Joseph Russell</b> versucht vergeblich eine Körpertäuschung bei <b class="G">Nicolas Vermaut</b></td></tr>
				<tr><td valign="top" align="right">104.</td><td><b class="G">George Kallur</b> spielt den Ball kurz zu <b class="G">Serge Van den Wyngaert</b> weiter</td></tr>
				<tr><td></td><td><b class="G">Serge Van den Wyngaert</b> spielt mit einem langen Pass zu <b class="G">Nicolas Vermaut</b> weiter</td></tr>
				<tr><td></td><td><b class="G">Nicolas Vermaut</b> spielt mit einem kurzen Pass zu <b class="G">Ruud Lemmens</b> weiter</td></tr>
				<tr><td></td><td>Ein Schlenzer von <b class="G">Ruud Lemmens</b> Richtung rechte Torseite - Der Ball geht am Tor vorbei</td></tr>
				<tr><td valign="top" align="right">105.</td><td><b class="G">George Kallur</b> spielt einen langen Ball zu <b class="G">Mario Van den Wyngaert</b></td></tr>
				<tr><td></td><td><b class="G">Mario Van den Wyngaert</b> spielt mit einem kurzen Pass zu <b class="G">Nicolas Vermaut</b> weiter</td></tr>
				<tr><td></td><td><b class="G">Nicolas Vermaut</b> verpasst <b class="H">Joseph Russell</b> einen Beinschuss</td></tr>
				<tr><td></td><td><b class="G">Nicolas Vermaut</b> mit langem Pass zu <b class="G">Esat Ymeri</b></td></tr>
				<tr><td></td><td><b class="G">Esat Ymeri</b> kann <b class="H">Adrian White</b> nicht umspielen</td></tr>
				<tr><td valign="top" align="right">106.</td><td><b class="G">Serge Van den Wyngaert</b> mit langem Pass zu <b class="G">Ruud Lemmens</b></td></tr>
				<tr><td></td><td><b class="G">Ruud Lemmens</b> spielt mit einem langen Pass zu <b class="G">Nicolas Vermaut</b> weiter</td></tr>
				<tr><td></td><td><b class="G">Nicolas Vermaut</b> spielt den Ball kurz zu <b class="G">Jan Huovinen</b></td></tr>
				<tr><td></td><td><b class="G">Jan Huovinen</b> versucht vergeblich den Ball über <b class="H">Ian Quigley</b> zu heben</td></tr>
				<tr><td valign="top" align="right">107.</td><td><b class="H">Declan ONeill</b> spielt den Ball kurz zu <b class="H">Gerard Paisley</b></td></tr>
				<tr><td></td><td><b class="H">Gerard Paisley</b> kann <b class="G">Nikiforos Vandalis</b> nicht mit einem Übersteiger versetzen</td></tr>
				<tr><td valign="top" align="right">108.</td><td><b class="H">Gerard Paisley</b> flankt in den Strafraum</td></tr>
				<tr><td></td><td>Kopfball von <b class="H">Rory Francis</b> Richtung Tormitte - <b class="G">Mihajlo Remac</b> kommt heraus und lenkt den Ball zur Ecke ab</td></tr>
				<tr><td></td><td><b>Ecke</b>: <b class="H">Gerard Paisley</b> zieht den Ball auf den zweiten Pfosten</td></tr>
				<tr><td></td><td><b class="H">Joseph Russell</b> köpft aufs Tor - <b class="G">Mihajlo Remac</b> lenkt den Ball zur Ecke ab - Eckball</td></tr>
				<tr><td></td><td><b>Ecke</b>: <b class="H">Gerard Paisley</b> zieht den Ball vor das Tor</td></tr>
				<tr><td></td><td>Der Ball landet beim Keeper</td></tr>
				<tr><td valign="top" align="right">109.</td><td><b class="G">Serge Van den Wyngaert</b> spielt einen langen Ball zu <b class="G">Esat Ymeri</b></td></tr>
				<tr><td></td><td><b class="H">Adrian White</b> lässt <b class="G">Esat Ymeri</b> nicht vorbei</td></tr>
				<tr><td valign="top" align="right">110.</td><td><b class="G">Mario Van den Wyngaert</b> passt den Ball direkt auf <b class="G">Nicolas Vermaut</b></td></tr>
				<tr><td></td><td>Ein Schuss von <b class="G">Nicolas Vermaut</b> Richtung Tormitte - <b class="H">Steve Stapleton</b> kann den Ball nicht richtig festhalten, der Ball geht ins Toraus – Eckball</td></tr>
				<tr><td></td><td><b>Ecke</b>: <b class="G">Ruud Lemmens</b> zieht den Ball auf den zweiten Pfosten</td></tr>
				<tr><td></td><td><b class="G">Hannad Harkouk</b> schiesst den Ball in die linke Ecke - <b class="H">Steve Stapleton</b> dreht den Ball zur Ecke</td></tr>
				<tr><td></td><td><b>Ecke</b>: <b class="G">Ruud Lemmens</b> zieht den Ball vor das Tor</td></tr>
				<tr><td></td><td>Der Ball landet beim Keeper</td></tr>
				<tr><td valign="top" align="right">111.</td><td><b class="H">Declan ONeill</b> passt lang zu <b class="H">Paul MacDonald</b></td></tr>
				<tr><td></td><td>Harter Schuss von <b class="H">Paul MacDonald</b> Richtung Tormitte - Der Ball geht neben das Tor</td></tr>
				<tr><td valign="top" align="right">112.</td><td><b class="G">George Kallur</b> per Kurzpass zu <b class="G">Mario Van den Wyngaert</b></td></tr>
				<tr><td></td><td><b class="G">Mario Van den Wyngaert</b> tankt sich gegen <b class="H">Jonathan Croly</b> bullig durch</td></tr>
				<tr><td></td><td><b class="G">Mario Van den Wyngaert</b> spielt mit einem kurzen Pass zu <b class="G">Ruud Lemmens</b> weiter - Ein Gegner kann erfolgreich stören</td></tr>
				<tr><td valign="top" align="right">113.</td><td><b class="G">Serge Van den Wyngaert</b> spielt mit einem langen Pass zu <b class="G">Mario Van den Wyngaert</b> weiter</td></tr>
				<tr><td></td><td><b class="G">Mario Van den Wyngaert</b> per Kurzpass zu <b class="G">Ruud Lemmens</b></td></tr>
				<tr><td></td><td><b class="G">Ruud Lemmens</b> kann <b class="H">Gareth Lyons</b> mit einem gelungenem Dribbling überspielen</td></tr>
				<tr><td></td><td><b class="G">Ruud Lemmens</b> spielt mit einem kurzen Pass zu <b class="G">Esat Ymeri</b> weiter</td></tr>
				<tr><td></td><td><b class="H">Gerard Paisley</b> lässt <b class="G">Esat Ymeri</b> nicht vorbei</td></tr>
				<tr><td valign="top" align="right">114.</td><td><b class="H">Paul MacDonald</b> spielt einen langen Ball zu <b class="H">Gerard Paisley</b></td></tr>
				<tr><td></td><td><b class="H">Gerard Paisley</b> spielt den Ball kurz zu <b class="H">Adrian White</b></td></tr>
				<tr><td></td><td><b class="H">Adrian White</b> spielt mit einem langen Pass zu <b class="H">Declan ONeill</b> weiter</td></tr>
				<tr><td></td><td><b class="H">Declan ONeill</b> versucht vergeblich den Ball über <b class="G">Nikiforos Vandalis</b> zu heben</td></tr>
				<tr><td valign="top" align="right">115.</td><td><b class="G">Mario Van den Wyngaert</b> spielt den Ball lang zu <b class="G">Serge Van den Wyngaert</b> - Der Ball geht ins Aus</td></tr>
				<tr><td valign="top" align="right">116.</td><td><b class="G">Mario Van den Wyngaert</b> spielt mit einem langen Pass zu <b class="G">Serge Van den Wyngaert</b> weiter</td></tr>
				<tr><td></td><td><b class="G">Serge Van den Wyngaert</b> versetzt <b class="H">Rory Francis</b> mit einem Übersteiger</td></tr>
				<tr><td></td><td><b class="G">Serge Van den Wyngaert</b> passt lang zu <b class="G">Ruud Lemmens</b></td></tr>
				<tr><td></td><td><b class="G">Ruud Lemmens</b> mit Kurzpass zu <b class="G">Hannad Harkouk</b></td></tr>
				<tr><td></td><td><b class="H">Ian Quigley</b> erkämpft sich den Ball - Torchance vereitelt</td></tr>
				<tr><td valign="top" align="right">117.</td><td><b class="G">Mario Van den Wyngaert</b> spielt den Ball zu <b class="G">Nicolas Vermaut</b> weiter</td></tr>
				<tr><td></td><td><b class="G">Nicolas Vermaut</b> spielt mit einem kurzen Pass zu <b class="G">Esat Ymeri</b> weiter</td></tr>
				<tr><td></td><td><b class="G">Esat Ymeri</b> spielt den Ball lang zu <b class="G">Sergei Razumau</b></td></tr>
				<tr><td></td><td><b class="G">Sergei Razumau</b> kann <b class="H">Declan ONeill</b> mit einem gelungenem Dribbling überspielen</td></tr>
				<tr><td></td><td><b class="G">Sergei Razumau</b> legt sich den Ball auf den richtigen Fuss und zieht ab - Glanzparade von <b class="H">Steve Stapleton</b></td></tr>
				<tr><td valign="top" align="right">118.</td><td><b class="G">George Kallur</b> spielt mit einem kurzen Pass zu <b class="G">Esat Ymeri</b> weiter</td></tr>
				<tr><td></td><td><b class="H">Adrian White</b> lässt <b class="G">Esat Ymeri</b> nicht vorbei</td></tr>
				<tr><td valign="top" align="right">119.</td><td><b class="G">Serge Van den Wyngaert</b> spielt den Ball kurz zu <b class="G">Esat Ymeri</b></td></tr>
				<tr><td></td><td><b class="G">Esat Ymeri</b> verstolpert den Ball bei einem versuchtem Dribbling</td></tr>
				<tr><td valign="top" align="right">120.</td><td><b class="G">Ruud Lemmens</b> verlädt <b class="H">Gareth Lyons</b> mit einer gelungenen Körpertäuschung</td></tr>
				<tr><td></td><td><b class="G">Ruud Lemmens</b> spielt mit einem kurzen Pass zu <b class="G">Esat Ymeri</b> weiter</td></tr>
				<tr><td></td><td><b class="G">Esat Ymeri</b> spielt den Ball lang zu <b class="G">Sergei Razumau</b> weiter</td></tr>
				<tr><td></td><td>Harter Schuss von <b class="G">Sergei Razumau</b> Richtung rechte Torseite - <b class="H">Steve Stapleton</b> lenkt den Ball zur Ecke ab - Eckball</td></tr>
				<tr><td></td><td><b>Ecke</b>: <b class="G">Ruud Lemmens</b> zieht den Ball auf den ersten Pfosten</td></tr>
				<tr><td></td><td>Der Ball landet beim Keeper</td></tr>
				<tr><td></td><td><b style="color: cyan;">Elfmeterschiessen</b></td></tr>
				<tr><td></td><td><b class="H">Jonathan Croly</b> schiesst den Ball in die untere rechte Ecke</td></tr>
				<tr><td></td><td><b style="color: orange;">Neuer Spielstand: 2:1 (Jonathan Croly)</b></td></tr>
				<tr><td></td><td><b class="G">Jan Huovinen</b> schiesst den Ball halbhoch aufs linke Eck</td></tr>
				<tr><td></td><td><b style="color: orange;">Neuer Spielstand: 2:2 (Jan Huovinen)</b></td></tr>
				<tr><td></td><td><b class="H">Rory Francis</b> schiesst den Ball halbhoch aufs rechte Eck</td></tr>
				<tr><td></td><td><b style="color: orange;">Neuer Spielstand: 3:2 (Rory Francis)</b></td></tr>
				<tr><td></td><td><b class="G">Sergei Razumau</b> schiesst den Ball in den rechten Winkel</td></tr>
				<tr><td></td><td>Der Keeper hat den Ball sicher</td></tr>
				<tr><td></td><td><b class="H">Gareth Lyons</b> schiesst den Ball in die untere rechte Ecke</td></tr>
				<tr><td></td><td><b style="color: orange;">Neuer Spielstand: 4:2 (Gareth Lyons)</b></td></tr>
				<tr><td></td><td><b class="G">Esat Ymeri</b> schiesst den Ball in den rechten Winkel</td></tr>
				<tr><td></td><td><b style="color: orange;">Neuer Spielstand: 4:3 (Esat Ymeri)</b></td></tr>
				<tr><td></td><td><b class="H">Joseph Russell</b> schiesst den Ball in den linken Winkel</td></tr>
				<tr><td></td><td><b style="color: orange;">Neuer Spielstand: 5:3 (Joseph Russell)</b></td></tr>
				<tr><td></td><td><b class="G">Nikiforos Vandalis</b> schiesst den Ball halbhoch aufs rechte Eck</td></tr>
				<tr><td></td><td><b style="color: orange;">Neuer Spielstand: 5:4 (Nikiforos Vandalis)</b></td></tr>
				<tr><td></td><td><b class="H">Adrian White</b> schiesst den Ball in die untere rechte Ecke</td></tr>
				<tr><td></td><td><b style="color: orange;">Neuer Spielstand: 6:4 (Adrian White)</b></td></tr>
				<tr><td></td><td><b class="G">Hannad Harkouk</b> schiesst den Ball in den rechten Winkel</td></tr>
				<tr><td></td><td><b class="H">Steve Stapleton</b> kann den Ball halten</td></tr>
				</tbody></table><div><br><br><b>Es folgen die Spielstatistiken</b><br><br></div><table border="0" cellpadding="2" cellspacing="2"><tbody><tr><td></td><td>Heimteam</td><td width="50"></td><td>Auswärtsteam</td></tr><tr><td>Endstand</td><td align="right">6</td><td width="50"></td><td align="right">4</td></tr><tr><td>Abseits</td><td align="right">3</td><td width="50"></td><td align="right">1</td></tr><tr><td>Eckenverhältnis</td><td align="right">10</td><td width="50"></td><td align="right">10</td></tr><tr><td>Fouls</td><td align="right">1</td><td width="50"></td><td align="right">3</td></tr><tr><td>Elfmeter</td><td align="right">0</td><td width="50"></td><td align="right">0</td></tr><tr><td>Ballbesitz</td><td align="right">48%</td><td width="50"></td><td align="right">52%</td></tr><tr><td>Schnitt Skill</td><td align="right">44.8</td><td width="50"></td><td align="right">45.92</td></tr><tr><td>Schnitt Opt.Skill</td><td align="right">71.94</td><td width="50"></td><td align="right">73.86</td></tr><tr><td>Fitness</td><td align="right">Sehr hoch</td><td width="50"></td><td align="right">Sehr hoch</td></tr><tr><td>Moral</td><td align="right">Sehr hoch</td><td width="50"></td><td align="right">Sehr hoch</td></tr></tbody></table><div><br><br><b>Es folgen die Spielerstatistiken</b><br><br></div><table border="0" cellpadding="2" cellspacing="2"><tbody><tr><td>Spielername</td><td>Note</td><td>ZK</td><td>ZK-%</td><td>Schüsse</td><td>aufs Tor</td><td>Tore</td><td>Vorlagen</td><td width="20"></td><td>Schüsse</td><td>aufs Tor</td><td>Tore</td><td>Vorlagen</td><td>ZK</td><td>ZK-%</td><td>Note</td><td>Spielername</td></tr>
				<tr><td>Rory Francis</td><td></td><td>20</td><td>35</td><td>5</td><td>2</td><td>0</td><td>0</td><td width="20"></td><td class="TOR">5</td><td class="TOR">4</td><td class="TOR">0</td><td class="TOR">0</td><td class="TOR">15</td><td class="TOR">53.33</td><td></td><td class="TOR">Sergei Razumau</td></tr>
				<tr><td>Jonathan Croly</td><td></td><td>9</td><td>33.33</td><td>3</td><td>2</td><td>0</td><td>0</td><td width="20"></td><td>2</td><td>1</td><td>1</td><td>0</td><td>13</td><td>53.85</td><td></td><td>Jan Huovinen</td></tr>
				<tr><td>Gareth Lyons</td><td></td><td>27</td><td>22.22</td><td>0</td><td>0</td><td>0</td><td>0</td><td width="20"></td><td>0</td><td>0</td><td>0</td><td>1</td><td>19</td><td>31.58</td><td></td><td>Nikiforos Vandalis</td></tr>
				<tr><td>Joseph Russell</td><td></td><td>29</td><td>24.14</td><td>3</td><td>2</td><td>1</td><td>0</td><td width="20"></td><td>1</td><td>1</td><td>0</td><td>0</td><td>18</td><td>5.56</td><td></td><td>Hannad Harkouk</td></tr>
				<tr><td>Adrian White</td><td></td><td>13</td><td>76.92</td><td>0</td><td>0</td><td>0</td><td>0</td><td width="20"></td><td>4</td><td>3</td><td>0</td><td>0</td><td>30</td><td>53.33</td><td></td><td>Esat Ymeri</td></tr>
				<tr><td>Gerard Paisley</td><td></td><td>34</td><td>58.82</td><td>4</td><td>2</td><td>0</td><td>1</td><td width="20"></td><td>8</td><td>8</td><td>0</td><td>0</td><td>33</td><td>75.76</td><td></td><td>Nicolas Vermaut</td></tr>
				<tr><td>Ian Quigley</td><td></td><td>6</td><td>100</td><td>1</td><td>1</td><td>0</td><td>0</td><td width="20"></td><td>4</td><td>3</td><td>0</td><td>0</td><td>30</td><td>70</td><td></td><td>Ruud Lemmens</td></tr>
				<tr><td>Declan ONeill</td><td></td><td>16</td><td>56.25</td><td>0</td><td>0</td><td>0</td><td>0</td><td width="20"></td><td>0</td><td>0</td><td>0</td><td>0</td><td>16</td><td>56.25</td><td></td><td>Mario Van den Wyngaert</td></tr>
				<tr><td>Paul MacDonald</td><td></td><td>12</td><td>58.33</td><td>1</td><td>0</td><td>0</td><td>0</td><td width="20"></td><td>1</td><td>0</td><td>0</td><td>0</td><td>19</td><td>57.89</td><td></td><td>Serge Van den Wyngaert</td></tr>
				<tr><td>Willo Cunningham</td><td></td><td>12</td><td>41.67</td><td>1</td><td>1</td><td>0</td><td>0</td><td width="20"></td><td>0</td><td>0</td><td>0</td><td>0</td><td>2</td><td>50</td><td></td><td>George Kallur</td></tr>
				<tr><td>Steve Stapleton</td><td></td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td width="20"></td><td class="TOR">0</td><td class="TOR">0</td><td class="TOR">0</td><td class="TOR">0</td><td class="TOR">0</td><td class="TOR">0</td><td></td><td class="TOR">Mihajlo Remac</td></tr>
				<tr><td>Willie Cragg</td><td></td><td>5</td><td>60</td><td>0</td><td>0</td><td>0</td><td>0</td><td width="20"></td><td>0</td><td>0</td><td>0</td><td>0</td><td>2</td><td>100</td><td></td><td>Raul Pires</td></tr>
				<tr><td>Wes Robinson</td><td></td><td>6</td><td>50</td><td>3</td><td>3</td><td>0</td><td>0</td><td width="20"></td><td>2</td><td>1</td><td>0</td><td>0</td><td>8</td><td>37.5</td><td></td><td>Hubert Smidts</td></tr>
				<tr><td>Daniel Crawford</td><td></td><td>16</td><td>56.25</td><td>2</td><td>2</td><td>0</td><td>0</td><td width="20"></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr></tbody></table>
			</div>*/

		this.data.team.spieler[0] = new OSext.Kaderspieler();
		this.data.team.spieler[0].name = "Rory Francis";
		
		this.data.team.spieler[1] = new OSext.Kaderspieler();
		this.data.team.spieler[1].name = "Jonathan Croly";

		this.data.team.spieler[2] = new OSext.Kaderspieler();
		this.data.team.spieler[2].name = "Graham Millar";
		
		this.site.extract(this.data);
		
		assertEquals("08.11.2011", this.data.spieltag.datum);
		
		assertEquals(1.35, this.data.team.spieler[0].training.aktuell.faktor);
		assertEquals(1.25, this.data.team.spieler[1].training.aktuell.faktor);
		assertEquals(1.1, this.data.team.spieler[2].training.aktuell.faktor);
	}

}

/*
HtmlTestCase("HtmlReportTests", "/test/test/fixtures/report.html", "rep/saison/6/7/19-448.html").prototype = {
	
	setUp : function() {
		
		this.site = new OSext.Sites.Report(new OSext.WrappedDocument(this.htmldoc));
		
		this.data = new OSext.Data();
		this.data.setAktuellenSpieltag(new OSext.Spieltag(3, 45));
	},
	
	testExtractSpieltagDatum : function() {
				
		site.extract(data);
		
		assertEquals("08.11.2011", data.spieltag.datum);
	},
}

AsyncTestCase("AsyncReportTests").prototype = {
 	
	testExtractDatum : function(queue) {
			
		var report = new OSext.TestDocument("report.html", "rep/saison/6/7/19-448.html");
			
		queue.call("Load", report.load.bind(report));
		
		queue.call("Test", function() {
						
			var doc = report.getDocument.call(report),
				site = new OSext.Sites.Report(new OSext.WrappedDocument(doc)),
				data = new OSext.Data();
			
			data.setAktuellenSpieltag(new OSext.Spieltag(3, 45));
			
			site.extract(data);
			
			assertEquals("08.11.2011", data.spieltag.datum);
		});
	}
}

*/