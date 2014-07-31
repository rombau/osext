
TestCase("ViewleihTests").prototype = {

	setUp : function() {
		
		this.site = new OSext.Sites.Viewleih(new OSext.WrappedDocument(document));
		
		this.data = new OSext.Data();
		this.data.setAktuellenSpieltag(new OSext.Spieltag(3, 45));

		this.data.mintermin.saison = 1;
		this.data.mintermin.zat = 1;
		
		this.data.team.spieler[0] = new OSext.Kaderspieler();
		this.data.team.spieler[0].id = 507;

		this.data.team.spieler[1] = new OSext.Kaderspieler();
		this.data.team.spieler[1].id = 4711;

	},
		
	testSiteChangeTableColumnCount : function() {

		/*:DOC += <table><tr><td>
			 		<table>
			 			<tr><td>Name</td></tr>
					</table>
				  </td></tr><tr><td>
			 		<table>
			 			<tr><td>Name</td></tr>
					</table>
				  </td></tr></table>*/
		
		try {
			assertFalse(this.site.check());
			fail();
		} catch (e) {
			assertInstanceOf(OSext.SiteChangeError, e);
			assertEquals("Leihspieler/Übersicht -> Tabelle wurde geändert!", e.message);
		}
	},

	testSiteChangeTableColumnName : function() {

		/*:DOC += <table><tr><td>
			 		<table>
			 			<tr><td>???</td><td>Alter</td><td>Land</td><td>U</td><td>Skillschnitt</td><td>Opt. Skill</td><td>Leihdauer</td><td>Gehalt</td><td>Leihgeb&uuml;hr</td><td>Leihclub</td></tr>
					</table>
				  </td></tr><tr><td>
			 		<table>
			 			<tr><td>???</td><td>Alter</td><td>Land</td><td>U</td><td>Skillschnitt</td><td>Opt. Skill</td><td>Leihdauer</td><td>Gehalt</td><td>Leihgeb&uuml;hr</td><td>Leihclub</td></tr>
					</table>
				  </td></tr></table>*/
		
		try {
			assertFalse(this.site.check());
			fail();
		} catch (e) {
			assertInstanceOf(OSext.SiteChangeError, e);
			assertEquals("Leihspieler/Übersicht -> Tabellenspalten wurden geändert!", e.message);
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

		/*:DOC += <table><tr><td>
			 		<table>
			 			<tr><td>Name</td><td>Alter</td><td>Land</td><td>U</td><td>Skillschnitt</td><td>Opt. Skill</td><td>Leihdauer</td><td>Gehalt</td><td>Leihgeb&uuml;hr</td><td>Leihclub</td></tr>
			 		    <tr><td class="ABW"><a href="javascript:spielerinfo(507)">Martin Collins</a></td><td class="ABW">31</td><td class="ABW">IRL</td><td class="STU"></td><td class="ABW">54.47</td><td class="ABW">79.48</td><td class="ABW">9</td><td class="ABW">82.687</td><td class="ABW">275.195</td><td class="ABW"><a href="javascript:teaminfo(1054)">Hanse BBC Berlin</a></td></tr>
					</table>
				  </td></tr><tr><td>
			 		<table>
			 			<tr><td>Name</td><td>Alter</td><td>Land</td><td>U</td><td>Skillschnitt</td><td>Opt. Skill</td><td>Leihdauer</td><td>Gehalt</td><td>Leihgeb&uuml;hr</td><td>Leihclub</td></tr>
			 		    <tr><td class="ABW"><a href="javascript:spielerinfo(4711)">Maxi</a></td><td class="ABW">31</td><td class="ABW">IRL</td><td class="STU"></td><td class="ABW">54.47</td><td class="ABW">79.48</td><td class="ABW">9</td><td class="ABW">82.687</td><td class="ABW">311.935</td><td class="ABW"><a href="javascript:teaminfo(17)">FC Bleiburg</a></td></tr>
					</table>
				  </td></tr></table>*/
		
		this.data.team.id = 19;
		this.data.team.name = "FC Cork";
		
		this.data.team.spieler[0] = new OSext.Kaderspieler();
		this.data.team.spieler[0].id = 507;

		this.data.team.spieler[1] = new OSext.Kaderspieler();
		this.data.team.spieler[1].id = 4711;

		this.site.extract(this.data);		

		assertEquals("ABW", this.data.team.spieler[0].pos);
		assertNotNull(this.data.team.spieler[0].leihdaten);
		assertEquals(275195, this.data.team.spieler[0].leihdaten.gebuehr);
		assertEquals(9, this.data.team.spieler[0].leihdaten.dauer);
		assertNotNull(this.data.team.spieler[0].leihdaten.an);
		assertEquals(1054, this.data.team.spieler[0].leihdaten.an.id);
		assertEquals("Hanse BBC Berlin", this.data.team.spieler[0].leihdaten.an.name);
		assertNotNull(this.data.team.spieler[0].leihdaten.von);
		assertNotSame(this.data.team.spieler[0].leihdaten.von, this.data.team);
		assertEquals(19, this.data.team.spieler[0].leihdaten.von.id);
		assertEquals("FC Cork", this.data.team.spieler[0].leihdaten.von.name);

		assertEquals("ABW", this.data.team.spieler[1].pos);
		assertNotNull(this.data.team.spieler[1].leihdaten.von);
		assertEquals(17, this.data.team.spieler[1].leihdaten.von.id);
		assertEquals("FC Bleiburg", this.data.team.spieler[1].leihdaten.von.name);
	}

}



