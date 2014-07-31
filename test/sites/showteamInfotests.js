TestCase("ShowteamInfoTests").prototype = {

	setUp : function() {

		this.site = new OSext.Sites.ShowteamInfo(new OSext.WrappedDocument(document));

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
			assertEquals("Mannschaft/Info -> Überschrift wurde geändert!", e.message);
		}
	},

	testSiteChangeNoTable : function() {

		/*:DOC += <b>FC Cork - 2. Liga A<a href="">Irland</a></b>*/
		
		try {
			assertFalse(this.site.check());
			fail();
		} catch (e) {
			assertInstanceOf(OSext.SiteChangeError, e);
			assertEquals("Mannschaft/Info -> Tabelle wurde nicht gefunden!", e.message);
		}
	},

	testSiteChangeTableDimensions : function() {
		
		/*:DOC += <table><tr><td><table><tr><td><b>FC Cork - 2. Liga A<a href="">Irland</a></b></td></tr></table></td></tr></table>*/		
		/*:DOC += <table cellpadding="5" border="0"><tr><td>Teamname : FC Bleiburg</td></tr></table>*/
		
		try {			
			assertFalse(this.site.check());
			fail();
		} catch (e) {
			assertInstanceOf(OSext.SiteChangeError, e);
			assertEquals("Mannschaft/Info -> Tabelle wurde geändert!", e.message);
		}
	},

	testSiteChangeNoTeamName : function() {
		
		/*:DOC += <table><tr><td><table><tr><td><b>FC Cork - 2. Liga A<a href="">Irland</a></b></td></tr></table></td></tr></table>*/		
		/*:DOC += <table cellpadding="5" border="0"><tr><td>Stadiongrösse : </td><td align="right">20.000</td><td>Stadionname : </td><td align="right">Stadion von FC Bleiburg</td></tr><tr><td>Sitzplätze : </td><td align="right">20.000</td><td>davon überdacht: </td><td align="right">20.000</td></tr><tr><td>Stehplätze : </td><td align="right">0</td><td>davon überdacht: </td><td align="right">0</td></tr><tr><td>Anzeigetafel : </td><td align="right">keine</td><td>Rasenheizung : </td><td align="right">Nein</td></tr><tr><td>Summe Marktwert : </td><td align="right">178.681.552</td><td>Schnitt Marktwert: </td><td align="right">5.956.052</td></tr><tr><td>Summe Gehalt : </td><td align="right">2.738.470</td><td>Schnitt Gehalt: </td><td align="right">91.282</td></tr></table>*/
		
		try {			
			assertFalse(this.site.check());
			fail();
		} catch (e) {
			assertInstanceOf(OSext.SiteChangeError, e);
			assertEquals("Mannschaft/Info -> Tabelle wurde geändert!", e.message);
		}
	},

	testSiteChangeTableAusbau : function() {
		
		/*:DOC += <table><tr><td><table><tr><td><b>FC Cork - 2. Liga A<a href="">Irland</a></b></td></tr></table></td></tr></table>*/		
		/*:DOC += <table cellpadding="5" border="0"><tr><td>Teamname : </td><td>FC Bleiburg</td></tr><tr><td>Stadiongrösse : </td><td align="right">20.000</td><td>Stadionname : </td><td align="right">Stadion von FC Bleiburg</td></tr><tr><td>Sitzplätze : </td><td align="right">10.000</td><td>davon überdacht: </td><td align="right">5.000</td></tr><tr><td>Stehplätze : </td><td align="right">10.000</td><td>davon überdacht: </td><td align="right">5.000</td></tr><tr><td>Anzeigetafel : </td><td align="right">keine</td><td>Rasenheizung : </td><td align="right">Nein</td></tr><tr><td>Summe Marktwert : </td><td align="right">178.681.552</td><td>Schnitt Marktwert: </td><td align="right">5.956.052</td></tr><tr><td>Summe Gehalt : </td><td align="right">2.738.470</td><td>Schnitt Gehalt: </td><td align="right">91.282</td></tr></table>*/
		/*:DOC += <table><tr><td>In 19 Zats ist der Ausbau fertig!</td></tr></table>*/
		
		try {			
			assertFalse(this.site.check());
			fail();
		} catch (e) {
			assertInstanceOf(OSext.SiteChangeError, e);
			assertEquals("Mannschaft/Info -> Tabelle für Ausbauten wurde geändert!", e.message);
		}
	},

	testDemoTeam : function() {

		/*:DOC += <table><tr><td><table><tr><td><b>DemoTeam - <a href="">Landesforum</a></b></td></tr></table></td></tr></table>*/		
		/*:DOC += <table cellpadding="5" border="0"><tr><td>Teamname : </td><td>FC Bleiburg</td></tr><tr><td>Stadiongrösse : </td><td align="right">20.000</td><td>Stadionname : </td><td align="right">Stadion von FC Bleiburg</td></tr><tr><td>Sitzplätze : </td><td align="right">20.000</td><td>davon überdacht: </td><td align="right">20.000</td></tr><tr><td>Stehplätze : </td><td align="right">0</td><td>davon überdacht: </td><td align="right">0</td></tr><tr><td>Anzeigetafel : </td><td align="right">keine</td><td>Rasenheizung : </td><td align="right">Nein</td></tr><tr><td>Summe Marktwert : </td><td align="right">178.681.552</td><td>Schnitt Marktwert: </td><td align="right">5.956.052</td></tr><tr><td>Summe Gehalt : </td><td align="right">2.738.470</td><td>Schnitt Gehalt: </td><td align="right">91.282</td></tr></table>*/
		
		try {
			assertFalse(this.site.check());
			fail();
		} catch (e) {
			assertInstanceOf(OSext.AuthenticationError, e);
		}
	},
		
	testExtract : function() {

		/*:DOC += <table><tr><td><table><tr><td><b>FC Cork - 2. Liga A<a href="">Irland</a></b></td></tr></table></td></tr></table>*/		
		/*:DOC += <table cellpadding="5" border="0"><tr><td>Teamname : </td><td>FC Bleiburg</td></tr><tr><td>Stadiongrösse : </td><td align="right">20.000</td><td>Stadionname : </td><td align="right">Stadion von FC Bleiburg</td></tr><tr><td>Sitzplätze : </td><td align="right">10.000</td><td>davon überdacht: </td><td align="right">5.000</td></tr><tr><td>Stehplätze : </td><td align="right">10.000</td><td>davon überdacht: </td><td align="right">5.000</td></tr><tr><td>Anzeigetafel : </td><td align="right">keine</td><td>Rasenheizung : </td><td align="right">Nein</td></tr><tr><td>Summe Marktwert : </td><td align="right">178.681.552</td><td>Schnitt Marktwert: </td><td align="right">5.956.052</td></tr><tr><td>Summe Gehalt : </td><td align="right">2.738.470</td><td>Schnitt Gehalt: </td><td align="right">91.282</td></tr></table>*/
		
		this.site.extract(this.data);
		
		assertEquals(5000,this.data.stadion.sitzer);
		assertEquals(5000,this.data.stadion.uesitzer);
		assertEquals(5000,this.data.stadion.steher);
		assertEquals(5000,this.data.stadion.uesteher);
		assertEquals("keine",this.data.stadion.anzeigetafel);
		assertFalse(this.data.stadion.rasenheizung);
		assertEquals(this.data.stadion, this.data.saisonplan[100].stadion);
	},
	
	testExtractAusbau : function() {

		/*:DOC += <table><tr><td><table><tr><td><b>FC Cork - 2. Liga A<a href="">Irland</a></b></td></tr></table></td></tr></table>*/		
		/*:DOC += <table cellpadding="5" border="0"><tr><td>Teamname : </td><td>FC Bleiburg</td></tr><tr><td>Stadiongrösse : </td><td align="right">20.000</td><td>Stadionname : </td><td align="right">Stadion von FC Bleiburg</td></tr><tr><td>Sitzplätze : </td><td align="right">10.000</td><td>davon überdacht: </td><td align="right">5.000</td></tr><tr><td>Stehplätze : </td><td align="right">10.000</td><td>davon überdacht: </td><td align="right">5.000</td></tr><tr><td>Anzeigetafel : </td><td align="right">keine</td><td>Rasenheizung : </td><td align="right">Nein</td></tr><tr><td>Summe Marktwert : </td><td align="right">178.681.552</td><td>Schnitt Marktwert: </td><td align="right">5.956.052</td></tr><tr><td>Summe Gehalt : </td><td align="right">2.738.470</td><td>Schnitt Gehalt: </td><td align="right">91.282</td></tr></table>*/
		/*:DOC += <table><tr><td><b>Das Stadion wird noch 11 ZAT(s) ausgebaut.</b></td></tr><tr><td>&nbsp;</td></tr><tr><td><b>10.000 überdachte Sitzplätze werden gebaut.</b></td></tr><tr><td><b>5.000 Sitzplätze werden überdacht.</b></td></tr><tr><td><b>1.000 Stehplätze werden zu Sitzplätzen umgebaut.</b></td></tr><tr><td><b>Eine Anzeigetafel "Multimediawürfel" wird gebaut</b></td></tr><tr><td><b>Eine Rasenheizung wird gebaut</b></td></tr></table>*/
		
		this.site.extract(this.data);

		var stadionreduziert = this.data.saisonplan[46].stadion;

		assertNotNull(stadionreduziert);
		assertEquals(3750,stadionreduziert.sitzer);
		assertEquals(3750,stadionreduziert.uesitzer);
		assertEquals(3750,stadionreduziert.steher);
		assertEquals(3750,stadionreduziert.uesteher);
		assertEquals("keine",stadionreduziert.anzeigetafel);
		assertFalse(stadionreduziert.rasenheizung);

		var stadionneu = this.data.saisonplan[56].stadion;
		
		assertNotNull(stadionneu);
		assertEquals(1000,stadionneu.sitzer);
		assertEquals(20000,stadionneu.uesitzer);
		assertEquals(4000,stadionneu.steher);
		assertEquals(5000,stadionneu.uesteher);
		assertEquals("Multimediawürfel",stadionneu.anzeigetafel);
		assertTrue(stadionneu.rasenheizung);
	},
	
	testAusbauUeberSaison : function() {

		/*:DOC += <table><tr><td><table><tr><td><b>FC Cork - 2. Liga A<a href="">Irland</a></b></td></tr></table></td></tr></table>*/		
		/*:DOC += <table cellpadding="5" border="0"><tr><td>Teamname : </td><td>FC Bleiburg</td></tr><tr><td>Stadiongrösse : </td><td align="right">20.000</td><td>Stadionname : </td><td align="right">Stadion von FC Bleiburg</td></tr><tr><td>Sitzplätze : </td><td align="right">10.000</td><td>davon überdacht: </td><td align="right">5.000</td></tr><tr><td>Stehplätze : </td><td align="right">10.000</td><td>davon überdacht: </td><td align="right">5.000</td></tr><tr><td>Anzeigetafel : </td><td align="right">keine</td><td>Rasenheizung : </td><td align="right">Nein</td></tr><tr><td>Summe Marktwert : </td><td align="right">178.681.552</td><td>Schnitt Marktwert: </td><td align="right">5.956.052</td></tr><tr><td>Summe Gehalt : </td><td align="right">2.738.470</td><td>Schnitt Gehalt: </td><td align="right">91.282</td></tr></table>*/
		/*:DOC += <table><tr><td><b>Das Stadion wird noch 60 ZAT(s) ausgebaut.</b></td></tr><tr><td>&nbsp;</td></tr><tr><td><b>10.000 überdachte Sitzplätze werden gebaut.</b></td></tr><tr><td><b>5.000 Sitzplätze werden überdacht.</b></td></tr><tr><td><b>1.000 Stehplätze werden zu Sitzplätzen umgebaut.</b></td></tr><tr><td><b>Eine Anzeigetafel "Multimediawürfel" wird gebaut</b></td></tr><tr><td><b>Eine Rasenheizung wird gebaut</b></td></tr></table>*/
		
		this.site.extract(this.data);
		
		var stadionneu = this.data.saisonplan[130].stadion;
		
		assertNotNull(stadionneu);
		assertEquals(1000,stadionneu.sitzer);
		assertEquals(20000,stadionneu.uesitzer);
		assertEquals(4000,stadionneu.steher);
		assertEquals(5000,stadionneu.uesteher);
		assertEquals("Multimediawürfel",stadionneu.anzeigetafel);
		assertTrue(stadionneu.rasenheizung);
	}

}
