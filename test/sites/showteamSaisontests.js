TestCase("ShowteamSaisonTests").prototype = {

	setUp : function() {

		this.site = new OSext.Sites.ShowteamSaison(new OSext.WrappedDocument(document));

		this.data = new OSext.Data();
		this.data.setAktuellenZat(45);

		this.data.spieltag = this.data.saisonplan[45];
		this.data.spieltag.gegner = new OSext.Team(17, "FC Bleiburg");
	},

	testSiteChangeTitel : function() {

		/*:DOC += <b>Seitenaenderung</b>*/
		
		try {
			assertFalse(this.site.check());
			fail();
		} catch (e) {
			assertInstanceOf(OSext.SiteChangeError, e);
			assertEquals("Mannschaft/Saisonplan -> Überschrift wurde geändert!", e.message);
		}
	},


	testSiteChangeNoPlace : function() {

		/*:DOC += <table><tr><td><table><tr><td><b>FC Cork - 2. Liga A<a href="">Irland</a></b></td></tr></table></td></tr></table>*/		
		/*:DOC += <select name="saison"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option selected="" value="4">4</option></select>*/
		/*:DOC += <table></table>*/		
		
		try {
			assertFalse(this.site.check());
			fail();
		} catch (e) {
			assertInstanceOf(OSext.SiteChangeError, e);
			assertEquals("Mannschaft/Saisonplan -> Tabellenplatz wurde nicht gefunden!", e.message);
		}
	},
	
	testSiteChangeNoSaisonSelect : function() {

		/*:DOC += <table><tr><td><table><tr><td><b>FC Cork - 2. Liga A<a href="">Irland</a></b></td></tr></table></td></tr></table>*/		
		
		try {
			assertFalse(this.site.check());
			fail();
		} catch (e) {
			assertInstanceOf(OSext.SiteChangeError, e);
			assertEquals("Mannschaft/Saisonplan -> Saisonauswahl wurde nicht gefunden!", e.message);
		}
	},

	testSiteChangeNoTable : function() {

		/*:DOC += <table><tr><td><table><tr><td><b>FC Cork - 2. Liga A<a href="">Irland</a></b></td></tr></table></td></tr></table>*/		
		/*:DOC += <select name="saison"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option selected="" value="4">4</option></select>*/
		
		try {
			assertFalse(this.site.check());
			fail();
		} catch (e) {
			assertInstanceOf(OSext.SiteChangeError, e);
			assertEquals("Mannschaft/Saisonplan -> Tabelle wurde nicht gefunden!", e.message);
		}
	},

	testSiteChangeTableColumnCount : function() {

		/*:DOC += <table><tr><td><table><tr><td><b>FC Cork - 2. Liga A<a href="">Irland</a></b></td></tr></table></td></tr><tr><td></td><td><br><a href="javascript:tabellenplatz(19)">Tabellenpl�tze</a></td></tr></table>*/		
		/*:DOC += <select name="saison"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option selected="" value="4">4</option></select>*/
		/*:DOC += <table><tr><td>#</td></tr>
		 						   <tr><td>#</td></tr></table>*/
		
		try {
			assertFalse(this.site.check());
			fail();
		} catch (e) {
			assertInstanceOf(OSext.SiteChangeError, e);
			assertEquals("Mannschaft/Saisonplan -> Tabelle wurde geändert!", e.message);
		}
	},

	testSiteChangeTableColumnName : function() {

		/*:DOC += <table><tr><td><table><tr><td><b>FC Cork - 2. Liga A<a href="">Irland</a></b></td></tr></table></td></tr><tr><td></td><td><br><a href="javascript:tabellenplatz(19)">Tabellenpl�tze</a></td></tr></table>*/		
		/*:DOC += <select name="saison"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option selected="" value="4">4</option></select>*/
		/*:DOC += <table><tr><td>#</td><td>Spielart</td><td>Gegner</td><td>Ergebnis</td><td>Bericht</td></tr></table>*/
		
		try {
			assertFalse(this.site.check());
			fail();
		} catch (e) {
			assertInstanceOf(OSext.SiteChangeError, e);
			assertEquals("Mannschaft/Saisonplan -> Tabellespalten wurden geändert!", e.message);
		}
	},

	testDemoTeam : function() {

		/*:DOC += <table><tr><td><table><tr><td><b>DemoTeam - <a href="">Landesforum</a></b></td></tr></table></td></tr><tr><td></td><td><br><a href="javascript:tabellenplatz(19)">Tabellenpl�tze</a></td></tr></table>*/		
		/*:DOC += <select name="saison"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option selected="" value="4">4</option></select>*/
		/*:DOC += <table>
		    <tr><td>ZAT</td><td>Spielart</td><td>Gegner</td><td>Ergebnis</td><td>Bericht</td></tr>
			<tr><td align=right class="OMI">1</td><td class="OMI">Friendly : Ausw&auml;rts</td><td><a href="javascript:teaminfo(1062)">1. FC Burghausen</a></td><td align=middle>1 : 0</td><td><a href="javascript:os_bericht(1062,19,1,4)">Klick</a></td><td></td><td class="noprint"><a href="javascript:kommentar(475873)">0 Vorbericht(e) &amp; 0 Kommentar(e)</a></td></tr>
		 	</table>*/
		
		try {
			assertFalse(this.site.check());
			fail();
		} catch (e) {
			assertInstanceOf(OSext.AuthenticationError, e);
		}
	},

	testExtractSaison : function() {

		/*:DOC += <select name="saison"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option selected="" value="4">4</option></select>*/
		/*:DOC += <table><tr><td><table><tr><td><b>FC Cork - 2. Liga A<a href="">Irland</a></b></td></tr></table></td></tr><tr><td></td><td><br><a href="javascript:tabellenplatz(19)">Tabellenpl�tze</a></td></tr></table>*/		
		/*:DOC += <table>
		    <tr><td>ZAT</td><td>Spielart</td><td>Gegner</td><td>Ergebnis</td><td>Bericht</td></tr>
		 	</table>*/
		
		this.site.extract(this.data);

		assertEquals(4,this.data.termin.saison);
	},

	testExtractSpieltagZatUndTeamId : function() {

		/*:DOC += <select name="saison"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option selected="" value="4">4</option></select>*/
		/*:DOC += <table><tr><td><table><tr><td><b>FC Cork - 2. Liga A<a href="">Irland</a></b></td></tr></table></td></tr><tr><td></td><td><br><a href="javascript:tabellenplatz(19)">Tabellenpl�tze</a></td></tr></table>*/		
		/*:DOC += <table>
		    <tr><td>ZAT</td><td>Spielart</td><td>Gegner</td><td>Ergebnis</td><td>Bericht</td></tr>
			<tr><td align=right class="OMI">31</td><td class="OMI">Friendly : Heim</td><td><a href="javascript:teaminfo(699)">Tadten</a></td><td align=middle></td><td></td><td>70/30</td><td class="noprint"><a href="javascript:kommentar(495651)">0 Vorbericht(e)</a></td></tr>
		 	</table>*/
		
		this.site.extract(this.data);
		
		assertEquals(1,this.data.saisonplan[1].termin.zat);
		assertEquals(19,this.data.saisonplan[1].team.id);
	},

	testExtractFriendlyAusw : function() {

		/*:DOC += <select name="saison"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option selected="" value="4">4</option></select>*/
		/*:DOC += <table><tr><td><table><tr><td><b>FC Cork - 2. Liga A<a href="">Irland</a></b></td></tr></table></td></tr><tr><td></td><td><br><a href="javascript:tabellenplatz(19)">Tabellenpl�tze</a></td></tr></table>*/		
		/*:DOC += <table>
		    <tr><td>ZAT</td><td>Spielart</td><td>Gegner</td><td>Ergebnis</td><td>Bericht</td></tr>
			<tr><td align=right class="OMI">1</td><td class="OMI">Friendly : Ausw&auml;rts</td><td><a href="javascript:teaminfo(1062)">1. FC Burghausen</a></td><td align=middle>1 : 0</td><td><a href="javascript:os_bericht(1062,19,1,4)">Klick</a></td><td></td><td class="noprint"><a href="javascript:kommentar(475873)">0 Vorbericht(e) &amp; 0 Kommentar(e)</a></td></tr>
		 	</table>*/
		
		this.site.extract(this.data);
		
		assertEquals(OSext.SPIELART.FSS,this.data.saisonplan[1].spielart);
		assertEquals(OSext.SPIELORT.AUSWAERTS,this.data.saisonplan[1].ort);
		assertEquals(1062,this.data.saisonplan[1].gegner.id);
		assertEquals(50,this.data.saisonplan[1].fssanteil);
	},

	testExtractFriendlyHeimAnteil : function() {

		/*:DOC += <select name="saison"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option selected="" value="4">4</option></select>*/
		/*:DOC += <table><tr><td><table><tr><td><b>FC Cork - 2. Liga A<a href="">Irland</a></b></td></tr></table></td></tr><tr><td></td><td><br><a href="javascript:tabellenplatz(19)">Tabellenpl�tze</a></td></tr></table>*/		
		/*:DOC += <table>
		    <tr><td>ZAT</td><td>Spielart</td><td>Gegner</td><td>Ergebnis</td><td>Bericht</td></tr>
			<tr><td align=right class="OMI">31</td><td class="OMI">Friendly : Heim</td><td><a href="javascript:teaminfo(699)">Tadten</a></td><td align=middle></td><td></td><td>70/30</td><td class="noprint"><a href="javascript:kommentar(495651)">0 Vorbericht(e)</a></td></tr>
		 	</table>*/
		
		this.site.extract(this.data);
		
		assertEquals(OSext.SPIELART.FSS,this.data.saisonplan[1].spielart);
		assertEquals(OSext.SPIELORT.HEIM,this.data.saisonplan[1].ort);
		assertEquals(699,this.data.saisonplan[1].gegner.id);
		assertEquals(70,this.data.saisonplan[1].fssanteil);
	},

	testExtractLigaAuswaerts : function() {

		/*:DOC += <select name="saison"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option selected="" value="4">4</option></select>*/
		/*:DOC += <table><tr><td><table><tr><td><b>FC Cork - 2. Liga A<a href="">Irland</a></b></td></tr></table></td></tr><tr><td></td><td><br><a href="javascript:tabellenplatz(19)">Tabellenpl�tze</a></td></tr></table>*/		
		/*:DOC += <table>
		    <tr><td>ZAT</td><td>Spielart</td><td>Gegner</td><td>Ergebnis</td><td>Bericht</td></tr>
			<tr><td align=right class="TOR">2</td><td class="TOR">Liga : Ausw&auml;rts</td><td><a href="javascript:teaminfo(1126)">Coachford Villa</a></td><td align=middle>1 : 0</td><td><a href="javascript:os_bericht(1126,19,2,4)">Klick</a></td><td></td><td class="noprint"><a href="javascript:kommentar(411876)">0 Vorbericht(e) &amp; 0 Kommentar(e)</a></td></tr>
		 	</table>*/
		
		this.site.extract(this.data);
		
		assertEquals(OSext.SPIELART.LIGA,this.data.saisonplan[1].spielart);
		assertEquals(OSext.SPIELORT.AUSWAERTS,this.data.saisonplan[1].ort);
		assertEquals(1126,this.data.saisonplan[1].gegner.id);
		assertNull(this.data.saisonplan[1].fssanteil);
	},

	testExtractPokalHeim : function() {

		/*:DOC += <select name="saison"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option selected="" value="4">4</option></select>*/
		/*:DOC += <table><tr><td><table><tr><td><b>FC Cork - 2. Liga A<a href="">Irland</a></b></td></tr></table></td></tr><tr><td></td><td><br><a href="javascript:tabellenplatz(19)">Tabellenpl�tze</a></td></tr></table>*/		
		/*:DOC += <table>
		    <tr><td>ZAT</td><td>Spielart</td><td>Gegner</td><td>Ergebnis</td><td>Bericht</td></tr>
			<tr><td align=right class="MIT">27</td><td class="MIT">LP : Heim</td><td><a href="javascript:teaminfo(280)">Rathkeale Boys</a></td><td align=middle>5 : 0</td><td><a href="javascript:os_bericht(19,280,27,4)">Klick</a></td><td></td><td class="noprint"><a href="javascript:kommentar(493200)">0 Vorbericht(e) &amp; 0 Kommentar(e)</a></td></tr>
		 	</table>*/
		
		this.site.extract(this.data);
		
		assertEquals(OSext.SPIELART.POKAL,this.data.saisonplan[1].spielart);
		assertEquals(OSext.SPIELORT.HEIM,this.data.saisonplan[1].ort);
		assertEquals(280,this.data.saisonplan[1].gegner.id);
		assertNull(this.data.saisonplan[1].fssanteil);
	},

	testExtractVorsaisonWithValidSaisonplan : function() {

		/*:DOC += <select name="saison"><option value="1">1</option><option value="2">2</option><option selected="" value="3">3</option><option value="4">4</option></select>*/
		/*:DOC += <table><tr><td><table><tr><td><b>FC Cork - 2. Liga A<a href="">Irland</a></b></td></tr></table></td></tr><tr><td></td><td><br><a href="javascript:tabellenplatz(19)">Tabellenpl�tze</a></td></tr></table>*/		
		/*:DOC += <table>
		    <tr><td>ZAT</td><td>Spielart</td><td>Gegner</td><td>Ergebnis</td><td>Bericht</td></tr>
			<tr><td align=right class="OMI">1</td><td class="OMI">Friendly : Ausw&auml;rts</td><td><a href="javascript:teaminfo(1062)">1. FC Burghausen</a></td><td align=middle>1 : 0</td><td><a href="javascript:os_bericht(1062,19,1,4)">Klick</a></td><td></td><td class="noprint"><a href="javascript:kommentar(475873)">0 Vorbericht(e) &amp; 0 Kommentar(e)</a></td></tr>
			<tr><td align=right class="TOR">2</td><td class="TOR">Liga : Ausw&auml;rts</td><td><a href="javascript:teaminfo(1126)">Coachford Villa</a></td><td align=middle>1 : 0</td><td><a href="javascript:os_bericht(1126,19,2,4)">Klick</a></td><td></td><td class="noprint"><a href="javascript:kommentar(411876)">0 Vorbericht(e) &amp; 0 Kommentar(e)</a></td></tr>
			<tr><td align=right class="OMI">3</td><td class="OMI">Friendly : Ausw&auml;rts</td><td><a href="javascript:teaminfo(1374)">Sport Domagnano</a></td><td align=middle>3 : 0</td><td><a href="javascript:os_bericht(1374,19,3,4)">Klick</a></td><td></td><td class="noprint"><a href="javascript:kommentar(475862)">0 Vorbericht(e) &amp; 0 Kommentar(e)</a></td></tr>
			<tr><td align=right class="TOR">4</td><td class="TOR">Liga : Heim</td><td><a href="javascript:teaminfo(1157)">RC Shelbourne</a></td><td align=middle>3 : 0</td><td><a href="javascript:os_bericht(19,1157,4,4)">Klick</a></td><td></td><td class="noprint"><a href="javascript:kommentar(411881)">0 Vorbericht(e) &amp; 0 Kommentar(e)</a></td></tr>
			<tr><td align=right class="OMI">5</td><td class="OMI">Friendly : Ausw&auml;rts</td><td><a href="javascript:teaminfo(173)">FV Br�gge</a></td><td align=middle>2 : 1</td><td><a href="javascript:os_bericht(173,19,5,4)">Klick</a></td><td></td><td class="noprint"><a href="javascript:kommentar(475870)">0 Vorbericht(e) &amp; 0 Kommentar(e)</a></td></tr>
			<tr><td align=right class="TOR">6</td><td class="TOR">Liga : Ausw&auml;rts</td><td><a href="javascript:teaminfo(1152)">Moyle Park City</a></td><td align=middle>2 : 0</td><td><a href="javascript:os_bericht(1152,19,6,4)">Klick</a></td><td></td><td class="noprint"><a href="javascript:kommentar(411886)">0 Vorbericht(e) &amp; 0 Kommentar(e)</a></td></tr>
			<tr><td align=right class="OMI">7</td><td class="OMI">Friendly : Heim</td><td><a href="javascript:teaminfo(26)">Ceuta</a></td><td align=middle>0 : 0</td><td><a href="javascript:os_bericht(19,26,7,4)">Klick</a></td><td></td><td class="noprint"><a href="javascript:kommentar(475904)">0 Vorbericht(e) &amp; 0 Kommentar(e)</a></td></tr>
			<tr><td align=right class="TOR">8</td><td class="TOR">Liga : Heim</td><td><a href="javascript:teaminfo(669)">FC Youghal United</a></td><td align=middle>2 : 0</td><td><a href="javascript:os_bericht(19,669,8,4)">Klick</a></td><td></td><td class="noprint"><a href="javascript:kommentar(411891)">0 Vorbericht(e) &amp; 0 Kommentar(e)</a></td></tr>
			<tr><td align=right class="TOR">9</td><td class="TOR">Liga : Ausw&auml;rts</td><td><a href="javascript:teaminfo(911)">AFC Tralee United</a></td><td align=middle>7 : 0</td><td><a href="javascript:os_bericht(911,19,9,4)">Klick</a></td><td></td><td class="noprint"><a href="javascript:kommentar(411896)">0 Vorbericht(e) &amp; 0 Kommentar(e)</a></td></tr>
			<tr><td align=right class="TOR">10</td><td class="TOR">Liga : Heim</td><td><a href="javascript:teaminfo(352)">Tralee City</a></td><td align=middle>2 : 1</td><td><a href="javascript:os_bericht(19,352,10,4)">Klick</a></td><td></td><td class="noprint"><a href="javascript:kommentar(411901)">0 Vorbericht(e) &amp; 0 Kommentar(e)</a></td></tr>
			<tr><td align=right class="OMI">11</td><td class="OMI">Friendly : Heim</td><td><a href="javascript:teaminfo(12)">FC Guimaraes</a></td><td align=middle>1 : 0</td><td><a href="javascript:os_bericht(19,12,11,4)">Klick</a></td><td></td><td class="noprint"><a href="javascript:kommentar(475905)">0 Vorbericht(e) &amp; 0 Kommentar(e)</a></td></tr>
			<tr><td align=right class="TOR">12</td><td class="TOR">Liga : Ausw&auml;rts</td><td><a href="javascript:teaminfo(1129)">Teelin United</a></td><td align=middle>1 : 0</td><td><a href="javascript:os_bericht(1129,19,12,4)">Klick</a></td><td></td><td class="noprint"><a href="javascript:kommentar(411906)">0 Vorbericht(e) &amp; 0 Kommentar(e)</a></td></tr>
			<tr><td align=right class="OMI">13</td><td class="OMI">Friendly : Heim</td><td><a href="javascript:teaminfo(873)">KB Klaksvik</a></td><td align=middle>0 : 2</td><td><a href="javascript:os_bericht(19,873,13,4)">Klick</a></td><td></td><td class="noprint"><a href="javascript:kommentar(475906)">0 Vorbericht(e) &amp; 0 Kommentar(e)</a></td></tr>
			<tr><td align=right class="TOR">14</td><td class="TOR">Liga : Heim</td><td><a href="javascript:teaminfo(708)">Cork College</a></td><td align=middle>3 : 0</td><td><a href="javascript:os_bericht(19,708,14,4)">Klick</a></td><td></td><td class="noprint"><a href="javascript:kommentar(411911)">0 Vorbericht(e) &amp; 0 Kommentar(e)</a></td></tr>
			<tr><td align=right class="OMI">15</td><td class="OMI">Friendly : Ausw&auml;rts</td><td><a href="javascript:teaminfo(1531)">FC Penrhiwceiber Rovers</a></td><td align=middle>6 : 0</td><td><a href="javascript:os_bericht(1531,19,15,4)">Klick</a></td><td></td><td class="noprint"><a href="javascript:kommentar(489470)">0 Vorbericht(e) &amp; 0 Kommentar(e)</a></td></tr>
			<tr><td align=right class="TOR">16</td><td class="TOR">Liga : Ausw&auml;rts</td><td><a href="javascript:teaminfo(1139)">United Hibernians</a></td><td align=middle>3 : 0</td><td><a href="javascript:os_bericht(1139,19,16,4)">Klick</a></td><td></td><td class="noprint"><a href="javascript:kommentar(411916)">0 Vorbericht(e) &amp; 0 Kommentar(e)</a></td></tr>
			<tr><td align=right class="OMI">17</td><td class="OMI">Friendly : Heim</td><td><a href="javascript:teaminfo(1182)">Calcio Pesaro</a></td><td align=middle>1 : 0</td><td><a href="javascript:os_bericht(19,1182,17,4)">Klick</a></td><td></td><td class="noprint"><a href="javascript:kommentar(475907)">0 Vorbericht(e) &amp; 0 Kommentar(e)</a></td></tr>
			<tr><td align=right class="TOR">18</td><td class="TOR">Liga : Heim</td><td><a href="javascript:teaminfo(1126)">Coachford Villa</a></td><td align=middle>1 : 0</td><td><a href="javascript:os_bericht(19,1126,18,4)">Klick</a></td><td></td><td class="noprint"><a href="javascript:kommentar(411921)">0 Vorbericht(e) &amp; 0 Kommentar(e)</a></td></tr>
			<tr><td align=right class="OMI">19</td><td class="OMI">Friendly : Heim</td><td><a href="javascript:teaminfo(342)">AF Tel-Aviv</a></td><td align=middle>3 : 0</td><td><a href="javascript:os_bericht(19,342,19,4)">Klick</a></td><td></td><td class="noprint"><a href="javascript:kommentar(475908)">0 Vorbericht(e) &amp; 0 Kommentar(e)</a></td></tr>
			<tr><td align=right class="TOR">20</td><td class="TOR">Liga : Ausw&auml;rts</td><td><a href="javascript:teaminfo(1157)">RC Shelbourne</a></td><td align=middle>2 : 0</td><td><a href="javascript:os_bericht(1157,19,20,4)">Klick</a></td><td></td><td class="noprint"><a href="javascript:kommentar(411926)">0 Vorbericht(e) &amp; 0 Kommentar(e)</a></td></tr>
			<tr><td align=right class="OMI">21</td><td class="OMI">Friendly : Ausw&auml;rts</td><td><a href="javascript:teaminfo(1115)">FC Gori</a></td><td align=middle>1 : 1</td><td><a href="javascript:os_bericht(1115,19,21,4)">Klick</a></td><td></td><td class="noprint"><a href="javascript:kommentar(475642)">0 Vorbericht(e) &amp; 0 Kommentar(e)</a></td></tr>
			<tr><td align=right class="TOR">22</td><td class="TOR">Liga : Heim</td><td><a href="javascript:teaminfo(1152)">Moyle Park City</a></td><td align=middle>1 : 2</td><td><a href="javascript:os_bericht(19,1152,22,4)">Klick</a></td><td></td><td class="noprint"><a href="javascript:kommentar(411931)">0 Vorbericht(e) &amp; 0 Kommentar(e)</a></td></tr>
			<tr><td align=right class="OMI">23</td><td class="OMI">Friendly : Heim</td><td><a href="javascript:teaminfo(1007)">Eintracht Zehlendorf</a></td><td align=middle>2 : 0</td><td><a href="javascript:os_bericht(19,1007,23,4)">Klick</a></td><td></td><td class="noprint"><a href="javascript:kommentar(475909)">0 Vorbericht(e) &amp; 0 Kommentar(e)</a></td></tr>
			<tr><td align=right class="TOR">24</td><td class="TOR">Liga : Ausw&auml;rts</td><td><a href="javascript:teaminfo(669)">FC Youghal United</a></td><td align=middle>2 : 2</td><td><a href="javascript:os_bericht(669,19,24,4)">Klick</a></td><td></td><td class="noprint"><a href="javascript:kommentar(411936)">0 Vorbericht(e) &amp; 0 Kommentar(e)</a></td></tr>
			<tr><td align=right class="OMI">25</td><td class="OMI">Friendly : Heim</td><td><a href="javascript:teaminfo(1336)">Astra Bukarest</a></td><td align=middle>6 : 0</td><td><a href="javascript:os_bericht(19,1336,25,4)">Klick</a></td><td></td><td class="noprint"><a href="javascript:kommentar(475910)">0 Vorbericht(e) &amp; 0 Kommentar(e)</a></td></tr>
			<tr><td align=right class="TOR">26</td><td class="TOR">Liga : Heim</td><td><a href="javascript:teaminfo(911)">AFC Tralee United</a></td><td align=middle>2 : 1</td><td><a href="javascript:os_bericht(19,911,26,4)">Klick</a></td><td></td><td class="noprint"><a href="javascript:kommentar(411941)">0 Vorbericht(e) &amp; 0 Kommentar(e)</a></td></tr>
			<tr><td align=right class="MIT">27</td><td class="MIT">LP : Heim</td><td><a href="javascript:teaminfo(280)">Rathkeale Boys</a></td><td align=middle>5 : 0</td><td><a href="javascript:os_bericht(19,280,27,4)">Klick</a></td><td></td><td class="noprint"><a href="javascript:kommentar(493200)">0 Vorbericht(e) &amp; 0 Kommentar(e)</a></td></tr>
			<tr><td align=right class="TOR">28</td><td class="TOR">Liga : Ausw&auml;rts</td><td><a href="javascript:teaminfo(352)">Tralee City</a></td><td align=middle>1 : 3</td><td><a href="javascript:os_bericht(352,19,28,4)">Klick</a></td><td></td><td class="noprint"><a href="javascript:kommentar(411946)">0 Vorbericht(e) &amp; 0 Kommentar(e)</a></td></tr>
			<tr><td align=right class="OMI">29</td><td class="OMI">Friendly : Heim</td><td><a href="javascript:teaminfo(213)">EA Louhans-Cuiseaux</a></td><td align=middle></td><td></td><td>50/50</td><td class="noprint"><a href="javascript:kommentar(495633)">0 Vorbericht(e)</a></td></tr>
			<tr><td align=right class="TOR">30</td><td class="TOR">Liga : Heim</td><td><a href="javascript:teaminfo(1129)">Teelin United</a></td><td align=middle></td><td><a href="javascript:spielpreview(19,1129,2)">Vorschau</a></td><td></td><td class="noprint"><a href="javascript:kommentar(411951)">0 Vorbericht(e)</a></td></tr>
			<tr><td align=right class="OMI">31</td><td class="OMI">Friendly : Ausw&auml;rts</td><td><a href="javascript:teaminfo(699)">Tadten</a></td><td align=middle></td><td></td><td>50/50</td><td class="noprint"><a href="javascript:kommentar(495651)">0 Vorbericht(e)</a></td></tr>
			<tr><td align=right class="TOR">32</td><td class="TOR">Liga : Ausw&auml;rts</td><td><a href="javascript:teaminfo(708)">Cork College</a></td><td align=middle></td><td><a href="javascript:spielpreview(708,19,2)">Vorschau</a></td><td></td><td class="noprint"><a href="javascript:kommentar(411956)">0 Vorbericht(e)</a></td></tr>
			<tr><td align=right class="OMI">33</td><td class="OMI">Friendly : Ausw&auml;rts</td><td><a href="javascript:teaminfo(1490)">Konya Futbol Kul�b�</a></td><td align=middle></td><td></td><td>50/50</td><td class="noprint"><a href="javascript:kommentar(476272)">0 Vorbericht(e)</a></td></tr>
			<tr><td align=right class="TOR">34</td><td class="TOR">Liga : Heim</td><td><a href="javascript:teaminfo(1139)">United Hibernians</a></td><td align=middle></td><td><a href="javascript:spielpreview(19,1139,2)">Vorschau</a></td><td></td><td class="noprint"><a href="javascript:kommentar(411961)">0 Vorbericht(e)</a></td></tr>
			<tr><td align=right class="OMI">35</td><td class="OMI">Friendly : Heim</td><td><a href="javascript:teaminfo(1282)">Sportklub Nenzing 09</a></td><td align=middle></td><td></td><td>50/50</td><td class="noprint"><a href="javascript:kommentar(495666)">0 Vorbericht(e)</a></td></tr>
			<tr><td align=right class="TOR">36</td><td class="TOR">Liga : Ausw&auml;rts</td><td><a href="javascript:teaminfo(1126)">Coachford Villa</a></td><td align=middle></td><td><a href="javascript:spielpreview(1126,19,2)">Vorschau</a></td><td></td><td class="noprint"><a href="javascript:kommentar(411966)">0 Vorbericht(e)</a></td></tr>
			<tr><td align=right class="">37</td><td class="">reserviert</td><td><a href="javascript:teaminfo(0)"></a></td><td align=middle></td><td></td><td>FSS-Tunier: 7. Bodensee-Cup (50% - fairplay!!!)</td><td class="noprint"></td></tr>
			<tr><td align=right class="TOR">38</td><td class="TOR">Liga : Heim</td><td><a href="javascript:teaminfo(1157)">RC Shelbourne</a></td><td align=middle></td><td><a href="javascript:spielpreview(19,1157,2)">Vorschau</a></td><td></td><td class="noprint"><a href="javascript:kommentar(411971)">0 Vorbericht(e)</a></td></tr>
			<tr><td align=right class="MIT">39</td><td class="MIT">LP : Heim</td><td><a href="javascript:teaminfo(1157)">RC Shelbourne</a></td><td align=middle></td><td><a href="javascript:spielpreview(19,1157,3)">Vorschau</a></td><td></td><td class="noprint"><a href="javascript:kommentar(497561)">0 Vorbericht(e)</a></td></tr>
			<tr><td align=right class="TOR">40</td><td class="TOR">Liga : Ausw&auml;rts</td><td><a href="javascript:teaminfo(1152)">Moyle Park City</a></td><td align=middle></td><td><a href="javascript:spielpreview(1152,19,2)">Vorschau</a></td><td></td><td class="noprint"><a href="javascript:kommentar(411976)">0 Vorbericht(e)</a></td></tr>
			<tr><td align=right class="">41</td><td class="">reserviert</td><td><a href="javascript:teaminfo(0)"></a></td><td align=middle></td><td></td><td>FSS-Tunier: 7. Bodensee-Cup (50% - fairplay!!!)</td><td class="noprint"></td></tr>
			<tr><td align=right class="TOR">42</td><td class="TOR">Liga : Heim</td><td><a href="javascript:teaminfo(669)">FC Youghal United</a></td><td align=middle></td><td><a href="javascript:spielpreview(19,669,2)">Vorschau</a></td><td></td><td class="noprint"><a href="javascript:kommentar(411981)">0 Vorbericht(e)</a></td></tr>
			<tr><td align=right class="">43</td><td class="">reserviert</td><td><a href="javascript:teaminfo(0)"></a></td><td align=middle></td><td></td><td>FSS-Tunier: 7. Bodensee-Cup (50% - fairplay!!!)</td><td class="noprint"></td></tr>
			<tr><td align=right class="TOR">44</td><td class="TOR">Liga : Ausw&auml;rts</td><td><a href="javascript:teaminfo(911)">AFC Tralee United</a></td><td align=middle></td><td><a href="javascript:spielpreview(911,19,2)">Vorschau</a></td><td></td><td class="noprint"><a href="javascript:kommentar(411986)">0 Vorbericht(e)</a></td></tr>
			<tr><td align=right class="">45</td><td class="">reserviert</td><td><a href="javascript:teaminfo(0)"></a></td><td align=middle></td><td></td><td>FSS-Tunier: 7. Bodensee-Cup (50% - fairplay!!!)</td><td class="noprint"></td></tr>
			<tr><td align=right class="TOR">46</td><td class="TOR">Liga : Heim</td><td><a href="javascript:teaminfo(352)">Tralee City</a></td><td align=middle></td><td><a href="javascript:spielpreview(19,352,2)">Vorschau</a></td><td></td><td class="noprint"><a href="javascript:kommentar(411991)">0 Vorbericht(e)</a></td></tr>
			<tr><td align=right class="">47</td><td class="">reserviert</td><td><a href="javascript:teaminfo(0)"></a></td><td align=middle></td><td></td><td>FSS-Tunier: 7. OS-Mitropacup (50%, fairplay!!)</td><td class="noprint"></td></tr>
			<tr><td align=right class="TOR">48</td><td class="TOR">Liga : Ausw&auml;rts</td><td><a href="javascript:teaminfo(1129)">Teelin United</a></td><td align=middle></td><td><a href="javascript:spielpreview(1129,19,2)">Vorschau</a></td><td></td><td class="noprint"><a href="javascript:kommentar(411996)">0 Vorbericht(e)</a></td></tr>
			<tr><td align=right class="">49</td><td class="">reserviert</td><td><a href="javascript:teaminfo(0)"></a></td><td align=middle></td><td></td><td>FSS-Tunier: 7. OS-Mitropacup (50%, fairplay!!)</td><td class="noprint"></td></tr>
			<tr><td align=right class="TOR">50</td><td class="TOR">Liga : Heim</td><td><a href="javascript:teaminfo(708)">Cork College</a></td><td align=middle></td><td><a href="javascript:spielpreview(19,708,2)">Vorschau</a></td><td></td><td class="noprint"><a href="javascript:kommentar(412001)">0 Vorbericht(e)</a></td></tr>
			<tr><td align=right class="MIT">51</td><td class="MIT">LP : Heim</td><td><a href="javascript:teaminfo(0)"></a></td><td align=middle></td><td><a href="javascript:spielpreview(19,0,3)">Vorschau</a></td><td></td><td class="noprint"><a href="javascript:kommentar(457260)">0 Vorbericht(e)</a></td></tr>
			<tr><td align=right class="TOR">52</td><td class="TOR">Liga : Ausw&auml;rts</td><td><a href="javascript:teaminfo(1139)">United Hibernians</a></td><td align=middle></td><td><a href="javascript:spielpreview(1139,19,2)">Vorschau</a></td><td></td><td class="noprint"><a href="javascript:kommentar(412006)">0 Vorbericht(e)</a></td></tr>
			<tr><td align=right class="">53</td><td class="">reserviert</td><td><a href="javascript:teaminfo(0)"></a></td><td align=middle></td><td></td><td>FSS-Tunier: 7. OS-Mitropacup (50%, fairplay!!)</td><td class="noprint"></td></tr>
			<tr><td align=right class="TOR">54</td><td class="TOR">Liga : Heim</td><td><a href="javascript:teaminfo(1126)">Coachford Villa</a></td><td align=middle></td><td><a href="javascript:spielpreview(19,1126,2)">Vorschau</a></td><td></td><td class="noprint"><a href="javascript:kommentar(412011)">0 Vorbericht(e)</a></td></tr>
			<tr><td align=right class="">55</td><td class="">reserviert</td><td><a href="javascript:teaminfo(0)"></a></td><td align=middle></td><td></td><td>FSS-Tunier: 7. OS-Mitropacup (50%, fairplay!!)</td><td class="noprint"></td></tr>
			<tr><td align=right class="TOR">56</td><td class="TOR">Liga : Ausw&auml;rts</td><td><a href="javascript:teaminfo(1157)">RC Shelbourne</a></td><td align=middle></td><td><a href="javascript:spielpreview(1157,19,2)">Vorschau</a></td><td></td><td class="noprint"><a href="javascript:kommentar(412016)">0 Vorbericht(e)</a></td></tr>
			<tr><td align=right class="OMI">57</td><td class="OMI">Friendly : Ausw&auml;rts</td><td><a href="javascript:teaminfo(17)">FC Bleiburg</a></td><td align=middle></td><td></td><td>50/50</td><td class="noprint"><a href="javascript:kommentar(485338)">0 Vorbericht(e)</a></td></tr>
			<tr><td align=right class="TOR">58</td><td class="TOR">Liga : Heim</td><td><a href="javascript:teaminfo(1152)">Moyle Park City</a></td><td align=middle></td><td><a href="javascript:spielpreview(19,1152,2)">Vorschau</a></td><td></td><td class="noprint"><a href="javascript:kommentar(412021)">0 Vorbericht(e)</a></td></tr>
			<tr><td align=right class="">59</td><td class="">reserviert</td><td><a href="javascript:teaminfo(0)"></a></td><td align=middle></td><td></td><td>FSS-Tunier: 7. OS-Mitropacup (50%, fairplay!!)</td><td class="noprint"></td></tr>
			<tr><td align=right class="TOR">60</td><td class="TOR">Liga : Ausw&auml;rts</td><td><a href="javascript:teaminfo(669)">FC Youghal United</a></td><td align=middle></td><td><a href="javascript:spielpreview(669,19,2)">Vorschau</a></td><td></td><td class="noprint"><a href="javascript:kommentar(412026)">0 Vorbericht(e)</a></td></tr>
			<tr><td align=right class="">61</td><td class="">reserviert</td><td><a href="javascript:teaminfo(0)"></a></td><td align=middle></td><td></td><td>FSS-Tunier: 7. OS-Mitropacup (50%, fairplay!!)</td><td class="noprint"></td></tr>
			<tr><td align=right class="TOR">62</td><td class="TOR">Liga : Heim</td><td><a href="javascript:teaminfo(911)">AFC Tralee United</a></td><td align=middle></td><td><a href="javascript:spielpreview(19,911,2)">Vorschau</a></td><td></td><td class="noprint"><a href="javascript:kommentar(412031)">0 Vorbericht(e)</a></td></tr>
			<tr><td align=right class="MIT">63</td><td class="MIT">LP : Heim</td><td><a href="javascript:teaminfo(0)"></a></td><td align=middle></td><td><a href="javascript:spielpreview(19,0,3)">Vorschau</a></td><td></td><td class="noprint"><a href="javascript:kommentar(457261)">0 Vorbericht(e)</a></td></tr>
			<tr><td align=right class="TOR">64</td><td class="TOR">Liga : Ausw&auml;rts</td><td><a href="javascript:teaminfo(352)">Tralee City</a></td><td align=middle></td><td><a href="javascript:spielpreview(352,19,2)">Vorschau</a></td><td></td><td class="noprint"><a href="javascript:kommentar(412036)">0 Vorbericht(e)</a></td></tr>
			<tr><td align=right class="TOR">65</td><td class="TOR">Liga : Heim</td><td><a href="javascript:teaminfo(1129)">Teelin United</a></td><td align=middle></td><td><a href="javascript:spielpreview(19,1129,2)">Vorschau</a></td><td></td><td class="noprint"><a href="javascript:kommentar(412041)">0 Vorbericht(e)</a></td></tr>
			<tr><td align=right class="TOR">66</td><td class="TOR">Liga : Ausw&auml;rts</td><td><a href="javascript:teaminfo(708)">Cork College</a></td><td align=middle></td><td><a href="javascript:spielpreview(708,19,2)">Vorschau</a></td><td></td><td class="noprint"><a href="javascript:kommentar(412046)">0 Vorbericht(e)</a></td></tr>
			<tr><td align=right class="">67</td><td class="">reserviert</td><td><a href="javascript:teaminfo(0)"></a></td><td align=middle></td><td></td><td>FSS-Tunier: 7. OS-Mitropacup (50%, fairplay!!)</td><td class="noprint"></td></tr>
			<tr><td align=right class="TOR">68</td><td class="TOR">Liga : Heim</td><td><a href="javascript:teaminfo(1139)">United Hibernians</a></td><td align=middle></td><td><a href="javascript:spielpreview(19,1139,2)">Vorschau</a></td><td></td><td class="noprint"><a href="javascript:kommentar(412051)">0 Vorbericht(e)</a></td></tr>
			<tr><td align=right class="MIT">69</td><td class="MIT">LP : Heim</td><td><a href="javascript:teaminfo(0)"></a></td><td align=middle></td><td><a href="javascript:spielpreview(19,0,3)">Vorschau</a></td><td></td><td class="noprint"><a href="javascript:kommentar(457262)">0 Vorbericht(e)</a></td></tr>
			<tr><td align=right class="TOR">70</td><td class="TOR">Liga : Heim</td><td><a href="javascript:teaminfo(0)"></a></td><td align=middle></td><td><a href="javascript:spielpreview(19,0,2)">Vorschau</a></td><td></td><td class="noprint"><a href="javascript:kommentar(455004)">0 Vorbericht(e)</a></td></tr>
			<tr><td align=right class="">71</td><td class="">spielfrei</td><td><a href="javascript:teaminfo(0)"></a></td><td align=middle></td><td></td><td></td><td class="noprint"></td></tr>
			<tr><td align=right class="TOR">72</td><td class="TOR">Liga : Heim</td><td><a href="javascript:teaminfo(45)"></a></td><td align=middle></td><td><a href="javascript:spielpreview(19,0,2)">Vorschau</a></td><td></td><td class="noprint"><a href="javascript:kommentar(455005)">0 Vorbericht(e)</a></td></tr>
		 	</table>*/
		
		this.data.saisonpause = true;
		this.data.vorsaison = true;
		this.data.saisonplan[1].spielart = OSext.SPIELART.LIGA;
		
		var queue = this.site.extract(this.data);		

		assertEquals(3,this.data.termin.saison);
		assertEquals(1,queue.sitequeue.length);
		assertMatch(/.+rep\/saison\/3\/72\/19-45.html/,queue.sitequeue[0].uri);
		assertFalse(this.data.vorsaison);
		
		assertEquals(OSext.SPIELART.LIGA,this.data.saisonplan[0].spielart);
		assertEquals(OSext.SPIELORT.HEIM,this.data.saisonplan[0].ort);
		assertEquals(45,this.data.saisonplan[0].gegner.id);
		assertEquals(19,this.data.saisonplan[0].team.id);
	},
	
	testExtractVorsaisonWithoutValidSaisonplan : function() {

		/*:DOC += <select name="saison"><option value="1">1</option><option value="2">2</option><option selected="" value="3">3</option><option value="4">4</option></select>*/
		/*:DOC += <table><tr><td><table><tr><td><b>FC Cork - 2. Liga A<a href="">Irland</a></b></td></tr></table></td></tr><tr><td></td><td><br><a href="javascript:tabellenplatz(19)">Tabellenpl�tze</a></td></tr></table>*/		
		/*:DOC += <table>
		    <tr><td>ZAT</td><td>Spielart</td><td>Gegner</td><td>Ergebnis</td><td>Bericht</td></tr>
			<tr><td align=right class="OMI">1</td><td class="OMI">Friendly : Ausw&auml;rts</td><td><a href="javascript:teaminfo(1062)">1. FC Burghausen</a></td><td align=middle>1 : 0</td><td><a href="javascript:os_bericht(1062,19,1,4)">Klick</a></td><td></td><td class="noprint"><a href="javascript:kommentar(475873)">0 Vorbericht(e) &amp; 0 Kommentar(e)</a></td></tr>
			<tr><td align=right class="TOR">2</td><td class="TOR">Liga : Ausw&auml;rts</td><td><a href="javascript:teaminfo(1126)">Coachford Villa</a></td><td align=middle>1 : 0</td><td><a href="javascript:os_bericht(1126,19,2,4)">Klick</a></td><td></td><td class="noprint"><a href="javascript:kommentar(411876)">0 Vorbericht(e) &amp; 0 Kommentar(e)</a></td></tr>
			<tr><td align=right class="OMI">3</td><td class="OMI">Friendly : Ausw&auml;rts</td><td><a href="javascript:teaminfo(1374)">Sport Domagnano</a></td><td align=middle>3 : 0</td><td><a href="javascript:os_bericht(1374,19,3,4)">Klick</a></td><td></td><td class="noprint"><a href="javascript:kommentar(475862)">0 Vorbericht(e) &amp; 0 Kommentar(e)</a></td></tr>
			<tr><td align=right class="TOR">4</td><td class="TOR">Liga : Heim</td><td><a href="javascript:teaminfo(1157)">RC Shelbourne</a></td><td align=middle>3 : 0</td><td><a href="javascript:os_bericht(19,1157,4,4)">Klick</a></td><td></td><td class="noprint"><a href="javascript:kommentar(411881)">0 Vorbericht(e) &amp; 0 Kommentar(e)</a></td></tr>
			<tr><td align=right class="OMI">5</td><td class="OMI">Friendly : Ausw&auml;rts</td><td><a href="javascript:teaminfo(173)">FV Br�gge</a></td><td align=middle>2 : 1</td><td><a href="javascript:os_bericht(173,19,5,4)">Klick</a></td><td></td><td class="noprint"><a href="javascript:kommentar(475870)">0 Vorbericht(e) &amp; 0 Kommentar(e)</a></td></tr>
			<tr><td align=right class="TOR">6</td><td class="TOR">Liga : Ausw&auml;rts</td><td><a href="javascript:teaminfo(1152)">Moyle Park City</a></td><td align=middle>2 : 0</td><td><a href="javascript:os_bericht(1152,19,6,4)">Klick</a></td><td></td><td class="noprint"><a href="javascript:kommentar(411886)">0 Vorbericht(e) &amp; 0 Kommentar(e)</a></td></tr>
			<tr><td align=right class="OMI">7</td><td class="OMI">Friendly : Heim</td><td><a href="javascript:teaminfo(26)">Ceuta</a></td><td align=middle>0 : 0</td><td><a href="javascript:os_bericht(19,26,7,4)">Klick</a></td><td></td><td class="noprint"><a href="javascript:kommentar(475904)">0 Vorbericht(e) &amp; 0 Kommentar(e)</a></td></tr>
			<tr><td align=right class="TOR">8</td><td class="TOR">Liga : Heim</td><td><a href="javascript:teaminfo(669)">FC Youghal United</a></td><td align=middle>2 : 0</td><td><a href="javascript:os_bericht(19,669,8,4)">Klick</a></td><td></td><td class="noprint"><a href="javascript:kommentar(411891)">0 Vorbericht(e) &amp; 0 Kommentar(e)</a></td></tr>
			<tr><td align=right class="TOR">9</td><td class="TOR">Liga : Ausw&auml;rts</td><td><a href="javascript:teaminfo(911)">AFC Tralee United</a></td><td align=middle>7 : 0</td><td><a href="javascript:os_bericht(911,19,9,4)">Klick</a></td><td></td><td class="noprint"><a href="javascript:kommentar(411896)">0 Vorbericht(e) &amp; 0 Kommentar(e)</a></td></tr>
			<tr><td align=right class="TOR">10</td><td class="TOR">Liga : Heim</td><td><a href="javascript:teaminfo(352)">Tralee City</a></td><td align=middle>2 : 1</td><td><a href="javascript:os_bericht(19,352,10,4)">Klick</a></td><td></td><td class="noprint"><a href="javascript:kommentar(411901)">0 Vorbericht(e) &amp; 0 Kommentar(e)</a></td></tr>
			<tr><td align=right class="OMI">11</td><td class="OMI">Friendly : Heim</td><td><a href="javascript:teaminfo(12)">FC Guimaraes</a></td><td align=middle>1 : 0</td><td><a href="javascript:os_bericht(19,12,11,4)">Klick</a></td><td></td><td class="noprint"><a href="javascript:kommentar(475905)">0 Vorbericht(e) &amp; 0 Kommentar(e)</a></td></tr>
			<tr><td align=right class="TOR">12</td><td class="TOR">Liga : Ausw&auml;rts</td><td><a href="javascript:teaminfo(1129)">Teelin United</a></td><td align=middle>1 : 0</td><td><a href="javascript:os_bericht(1129,19,12,4)">Klick</a></td><td></td><td class="noprint"><a href="javascript:kommentar(411906)">0 Vorbericht(e) &amp; 0 Kommentar(e)</a></td></tr>
			<tr><td align=right class="OMI">13</td><td class="OMI">Friendly : Heim</td><td><a href="javascript:teaminfo(873)">KB Klaksvik</a></td><td align=middle>0 : 2</td><td><a href="javascript:os_bericht(19,873,13,4)">Klick</a></td><td></td><td class="noprint"><a href="javascript:kommentar(475906)">0 Vorbericht(e) &amp; 0 Kommentar(e)</a></td></tr>
			<tr><td align=right class="TOR">14</td><td class="TOR">Liga : Heim</td><td><a href="javascript:teaminfo(708)">Cork College</a></td><td align=middle>3 : 0</td><td><a href="javascript:os_bericht(19,708,14,4)">Klick</a></td><td></td><td class="noprint"><a href="javascript:kommentar(411911)">0 Vorbericht(e) &amp; 0 Kommentar(e)</a></td></tr>
			<tr><td align=right class="OMI">15</td><td class="OMI">Friendly : Ausw&auml;rts</td><td><a href="javascript:teaminfo(1531)">FC Penrhiwceiber Rovers</a></td><td align=middle>6 : 0</td><td><a href="javascript:os_bericht(1531,19,15,4)">Klick</a></td><td></td><td class="noprint"><a href="javascript:kommentar(489470)">0 Vorbericht(e) &amp; 0 Kommentar(e)</a></td></tr>
			<tr><td align=right class="TOR">16</td><td class="TOR">Liga : Ausw&auml;rts</td><td><a href="javascript:teaminfo(1139)">United Hibernians</a></td><td align=middle>3 : 0</td><td><a href="javascript:os_bericht(1139,19,16,4)">Klick</a></td><td></td><td class="noprint"><a href="javascript:kommentar(411916)">0 Vorbericht(e) &amp; 0 Kommentar(e)</a></td></tr>
			<tr><td align=right class="OMI">17</td><td class="OMI">Friendly : Heim</td><td><a href="javascript:teaminfo(1182)">Calcio Pesaro</a></td><td align=middle>1 : 0</td><td><a href="javascript:os_bericht(19,1182,17,4)">Klick</a></td><td></td><td class="noprint"><a href="javascript:kommentar(475907)">0 Vorbericht(e) &amp; 0 Kommentar(e)</a></td></tr>
			<tr><td align=right class="TOR">18</td><td class="TOR">Liga : Heim</td><td><a href="javascript:teaminfo(1126)">Coachford Villa</a></td><td align=middle>1 : 0</td><td><a href="javascript:os_bericht(19,1126,18,4)">Klick</a></td><td></td><td class="noprint"><a href="javascript:kommentar(411921)">0 Vorbericht(e) &amp; 0 Kommentar(e)</a></td></tr>
			<tr><td align=right class="OMI">19</td><td class="OMI">Friendly : Heim</td><td><a href="javascript:teaminfo(342)">AF Tel-Aviv</a></td><td align=middle>3 : 0</td><td><a href="javascript:os_bericht(19,342,19,4)">Klick</a></td><td></td><td class="noprint"><a href="javascript:kommentar(475908)">0 Vorbericht(e) &amp; 0 Kommentar(e)</a></td></tr>
			<tr><td align=right class="TOR">20</td><td class="TOR">Liga : Ausw&auml;rts</td><td><a href="javascript:teaminfo(1157)">RC Shelbourne</a></td><td align=middle>2 : 0</td><td><a href="javascript:os_bericht(1157,19,20,4)">Klick</a></td><td></td><td class="noprint"><a href="javascript:kommentar(411926)">0 Vorbericht(e) &amp; 0 Kommentar(e)</a></td></tr>
			<tr><td align=right class="OMI">21</td><td class="OMI">Friendly : Ausw&auml;rts</td><td><a href="javascript:teaminfo(1115)">FC Gori</a></td><td align=middle>1 : 1</td><td><a href="javascript:os_bericht(1115,19,21,4)">Klick</a></td><td></td><td class="noprint"><a href="javascript:kommentar(475642)">0 Vorbericht(e) &amp; 0 Kommentar(e)</a></td></tr>
			<tr><td align=right class="TOR">22</td><td class="TOR">Liga : Heim</td><td><a href="javascript:teaminfo(1152)">Moyle Park City</a></td><td align=middle>1 : 2</td><td><a href="javascript:os_bericht(19,1152,22,4)">Klick</a></td><td></td><td class="noprint"><a href="javascript:kommentar(411931)">0 Vorbericht(e) &amp; 0 Kommentar(e)</a></td></tr>
			<tr><td align=right class="OMI">23</td><td class="OMI">Friendly : Heim</td><td><a href="javascript:teaminfo(1007)">Eintracht Zehlendorf</a></td><td align=middle>2 : 0</td><td><a href="javascript:os_bericht(19,1007,23,4)">Klick</a></td><td></td><td class="noprint"><a href="javascript:kommentar(475909)">0 Vorbericht(e) &amp; 0 Kommentar(e)</a></td></tr>
			<tr><td align=right class="TOR">24</td><td class="TOR">Liga : Ausw&auml;rts</td><td><a href="javascript:teaminfo(669)">FC Youghal United</a></td><td align=middle>2 : 2</td><td><a href="javascript:os_bericht(669,19,24,4)">Klick</a></td><td></td><td class="noprint"><a href="javascript:kommentar(411936)">0 Vorbericht(e) &amp; 0 Kommentar(e)</a></td></tr>
			<tr><td align=right class="OMI">25</td><td class="OMI">Friendly : Heim</td><td><a href="javascript:teaminfo(1336)">Astra Bukarest</a></td><td align=middle>6 : 0</td><td><a href="javascript:os_bericht(19,1336,25,4)">Klick</a></td><td></td><td class="noprint"><a href="javascript:kommentar(475910)">0 Vorbericht(e) &amp; 0 Kommentar(e)</a></td></tr>
			<tr><td align=right class="TOR">26</td><td class="TOR">Liga : Heim</td><td><a href="javascript:teaminfo(911)">AFC Tralee United</a></td><td align=middle>2 : 1</td><td><a href="javascript:os_bericht(19,911,26,4)">Klick</a></td><td></td><td class="noprint"><a href="javascript:kommentar(411941)">0 Vorbericht(e) &amp; 0 Kommentar(e)</a></td></tr>
			<tr><td align=right class="MIT">27</td><td class="MIT">LP : Heim</td><td><a href="javascript:teaminfo(280)">Rathkeale Boys</a></td><td align=middle>5 : 0</td><td><a href="javascript:os_bericht(19,280,27,4)">Klick</a></td><td></td><td class="noprint"><a href="javascript:kommentar(493200)">0 Vorbericht(e) &amp; 0 Kommentar(e)</a></td></tr>
			<tr><td align=right class="TOR">28</td><td class="TOR">Liga : Ausw&auml;rts</td><td><a href="javascript:teaminfo(352)">Tralee City</a></td><td align=middle>1 : 3</td><td><a href="javascript:os_bericht(352,19,28,4)">Klick</a></td><td></td><td class="noprint"><a href="javascript:kommentar(411946)">0 Vorbericht(e) &amp; 0 Kommentar(e)</a></td></tr>
			<tr><td align=right class="OMI">29</td><td class="OMI">Friendly : Heim</td><td><a href="javascript:teaminfo(213)">EA Louhans-Cuiseaux</a></td><td align=middle></td><td></td><td>50/50</td><td class="noprint"><a href="javascript:kommentar(495633)">0 Vorbericht(e)</a></td></tr>
			<tr><td align=right class="TOR">30</td><td class="TOR">Liga : Heim</td><td><a href="javascript:teaminfo(1129)">Teelin United</a></td><td align=middle></td><td><a href="javascript:spielpreview(19,1129,2)">Vorschau</a></td><td></td><td class="noprint"><a href="javascript:kommentar(411951)">0 Vorbericht(e)</a></td></tr>
			<tr><td align=right class="OMI">31</td><td class="OMI">Friendly : Ausw&auml;rts</td><td><a href="javascript:teaminfo(699)">Tadten</a></td><td align=middle></td><td></td><td>50/50</td><td class="noprint"><a href="javascript:kommentar(495651)">0 Vorbericht(e)</a></td></tr>
			<tr><td align=right class="TOR">32</td><td class="TOR">Liga : Ausw&auml;rts</td><td><a href="javascript:teaminfo(708)">Cork College</a></td><td align=middle></td><td><a href="javascript:spielpreview(708,19,2)">Vorschau</a></td><td></td><td class="noprint"><a href="javascript:kommentar(411956)">0 Vorbericht(e)</a></td></tr>
			<tr><td align=right class="OMI">33</td><td class="OMI">Friendly : Ausw&auml;rts</td><td><a href="javascript:teaminfo(1490)">Konya Futbol Kul�b�</a></td><td align=middle></td><td></td><td>50/50</td><td class="noprint"><a href="javascript:kommentar(476272)">0 Vorbericht(e)</a></td></tr>
			<tr><td align=right class="TOR">34</td><td class="TOR">Liga : Heim</td><td><a href="javascript:teaminfo(1139)">United Hibernians</a></td><td align=middle></td><td><a href="javascript:spielpreview(19,1139,2)">Vorschau</a></td><td></td><td class="noprint"><a href="javascript:kommentar(411961)">0 Vorbericht(e)</a></td></tr>
			<tr><td align=right class="OMI">35</td><td class="OMI">Friendly : Heim</td><td><a href="javascript:teaminfo(1282)">Sportklub Nenzing 09</a></td><td align=middle></td><td></td><td>50/50</td><td class="noprint"><a href="javascript:kommentar(495666)">0 Vorbericht(e)</a></td></tr>
			<tr><td align=right class="TOR">36</td><td class="TOR">Liga : Ausw&auml;rts</td><td><a href="javascript:teaminfo(1126)">Coachford Villa</a></td><td align=middle></td><td><a href="javascript:spielpreview(1126,19,2)">Vorschau</a></td><td></td><td class="noprint"><a href="javascript:kommentar(411966)">0 Vorbericht(e)</a></td></tr>
			<tr><td align=right class="">37</td><td class="">reserviert</td><td><a href="javascript:teaminfo(0)"></a></td><td align=middle></td><td></td><td>FSS-Tunier: 7. Bodensee-Cup (50% - fairplay!!!)</td><td class="noprint"></td></tr>
			<tr><td align=right class="TOR">38</td><td class="TOR">Liga : Heim</td><td><a href="javascript:teaminfo(1157)">RC Shelbourne</a></td><td align=middle></td><td><a href="javascript:spielpreview(19,1157,2)">Vorschau</a></td><td></td><td class="noprint"><a href="javascript:kommentar(411971)">0 Vorbericht(e)</a></td></tr>
			<tr><td align=right class="MIT">39</td><td class="MIT">LP : Heim</td><td><a href="javascript:teaminfo(1157)">RC Shelbourne</a></td><td align=middle></td><td><a href="javascript:spielpreview(19,1157,3)">Vorschau</a></td><td></td><td class="noprint"><a href="javascript:kommentar(497561)">0 Vorbericht(e)</a></td></tr>
			<tr><td align=right class="TOR">40</td><td class="TOR">Liga : Ausw&auml;rts</td><td><a href="javascript:teaminfo(1152)">Moyle Park City</a></td><td align=middle></td><td><a href="javascript:spielpreview(1152,19,2)">Vorschau</a></td><td></td><td class="noprint"><a href="javascript:kommentar(411976)">0 Vorbericht(e)</a></td></tr>
			<tr><td align=right class="">41</td><td class="">reserviert</td><td><a href="javascript:teaminfo(0)"></a></td><td align=middle></td><td></td><td>FSS-Tunier: 7. Bodensee-Cup (50% - fairplay!!!)</td><td class="noprint"></td></tr>
			<tr><td align=right class="TOR">42</td><td class="TOR">Liga : Heim</td><td><a href="javascript:teaminfo(669)">FC Youghal United</a></td><td align=middle></td><td><a href="javascript:spielpreview(19,669,2)">Vorschau</a></td><td></td><td class="noprint"><a href="javascript:kommentar(411981)">0 Vorbericht(e)</a></td></tr>
			<tr><td align=right class="">43</td><td class="">reserviert</td><td><a href="javascript:teaminfo(0)"></a></td><td align=middle></td><td></td><td>FSS-Tunier: 7. Bodensee-Cup (50% - fairplay!!!)</td><td class="noprint"></td></tr>
			<tr><td align=right class="TOR">44</td><td class="TOR">Liga : Ausw&auml;rts</td><td><a href="javascript:teaminfo(911)">AFC Tralee United</a></td><td align=middle></td><td><a href="javascript:spielpreview(911,19,2)">Vorschau</a></td><td></td><td class="noprint"><a href="javascript:kommentar(411986)">0 Vorbericht(e)</a></td></tr>
			<tr><td align=right class="">45</td><td class="">reserviert</td><td><a href="javascript:teaminfo(0)"></a></td><td align=middle></td><td></td><td>FSS-Tunier: 7. Bodensee-Cup (50% - fairplay!!!)</td><td class="noprint"></td></tr>
			<tr><td align=right class="TOR">46</td><td class="TOR">Liga : Heim</td><td><a href="javascript:teaminfo(352)">Tralee City</a></td><td align=middle></td><td><a href="javascript:spielpreview(19,352,2)">Vorschau</a></td><td></td><td class="noprint"><a href="javascript:kommentar(411991)">0 Vorbericht(e)</a></td></tr>
			<tr><td align=right class="">47</td><td class="">reserviert</td><td><a href="javascript:teaminfo(0)"></a></td><td align=middle></td><td></td><td>FSS-Tunier: 7. OS-Mitropacup (50%, fairplay!!)</td><td class="noprint"></td></tr>
			<tr><td align=right class="TOR">48</td><td class="TOR">Liga : Ausw&auml;rts</td><td><a href="javascript:teaminfo(1129)">Teelin United</a></td><td align=middle></td><td><a href="javascript:spielpreview(1129,19,2)">Vorschau</a></td><td></td><td class="noprint"><a href="javascript:kommentar(411996)">0 Vorbericht(e)</a></td></tr>
			<tr><td align=right class="">49</td><td class="">reserviert</td><td><a href="javascript:teaminfo(0)"></a></td><td align=middle></td><td></td><td>FSS-Tunier: 7. OS-Mitropacup (50%, fairplay!!)</td><td class="noprint"></td></tr>
			<tr><td align=right class="TOR">50</td><td class="TOR">Liga : Heim</td><td><a href="javascript:teaminfo(708)">Cork College</a></td><td align=middle></td><td><a href="javascript:spielpreview(19,708,2)">Vorschau</a></td><td></td><td class="noprint"><a href="javascript:kommentar(412001)">0 Vorbericht(e)</a></td></tr>
			<tr><td align=right class="MIT">51</td><td class="MIT">LP : Heim</td><td><a href="javascript:teaminfo(0)"></a></td><td align=middle></td><td><a href="javascript:spielpreview(19,0,3)">Vorschau</a></td><td></td><td class="noprint"><a href="javascript:kommentar(457260)">0 Vorbericht(e)</a></td></tr>
			<tr><td align=right class="TOR">52</td><td class="TOR">Liga : Ausw&auml;rts</td><td><a href="javascript:teaminfo(1139)">United Hibernians</a></td><td align=middle></td><td><a href="javascript:spielpreview(1139,19,2)">Vorschau</a></td><td></td><td class="noprint"><a href="javascript:kommentar(412006)">0 Vorbericht(e)</a></td></tr>
			<tr><td align=right class="">53</td><td class="">reserviert</td><td><a href="javascript:teaminfo(0)"></a></td><td align=middle></td><td></td><td>FSS-Tunier: 7. OS-Mitropacup (50%, fairplay!!)</td><td class="noprint"></td></tr>
			<tr><td align=right class="TOR">54</td><td class="TOR">Liga : Heim</td><td><a href="javascript:teaminfo(1126)">Coachford Villa</a></td><td align=middle></td><td><a href="javascript:spielpreview(19,1126,2)">Vorschau</a></td><td></td><td class="noprint"><a href="javascript:kommentar(412011)">0 Vorbericht(e)</a></td></tr>
			<tr><td align=right class="">55</td><td class="">reserviert</td><td><a href="javascript:teaminfo(0)"></a></td><td align=middle></td><td></td><td>FSS-Tunier: 7. OS-Mitropacup (50%, fairplay!!)</td><td class="noprint"></td></tr>
			<tr><td align=right class="TOR">56</td><td class="TOR">Liga : Ausw&auml;rts</td><td><a href="javascript:teaminfo(1157)">RC Shelbourne</a></td><td align=middle></td><td><a href="javascript:spielpreview(1157,19,2)">Vorschau</a></td><td></td><td class="noprint"><a href="javascript:kommentar(412016)">0 Vorbericht(e)</a></td></tr>
			<tr><td align=right class="OMI">57</td><td class="OMI">Friendly : Ausw&auml;rts</td><td><a href="javascript:teaminfo(17)">FC Bleiburg</a></td><td align=middle></td><td></td><td>50/50</td><td class="noprint"><a href="javascript:kommentar(485338)">0 Vorbericht(e)</a></td></tr>
			<tr><td align=right class="TOR">58</td><td class="TOR">Liga : Heim</td><td><a href="javascript:teaminfo(1152)">Moyle Park City</a></td><td align=middle></td><td><a href="javascript:spielpreview(19,1152,2)">Vorschau</a></td><td></td><td class="noprint"><a href="javascript:kommentar(412021)">0 Vorbericht(e)</a></td></tr>
			<tr><td align=right class="">59</td><td class="">reserviert</td><td><a href="javascript:teaminfo(0)"></a></td><td align=middle></td><td></td><td>FSS-Tunier: 7. OS-Mitropacup (50%, fairplay!!)</td><td class="noprint"></td></tr>
			<tr><td align=right class="TOR">60</td><td class="TOR">Liga : Ausw&auml;rts</td><td><a href="javascript:teaminfo(669)">FC Youghal United</a></td><td align=middle></td><td><a href="javascript:spielpreview(669,19,2)">Vorschau</a></td><td></td><td class="noprint"><a href="javascript:kommentar(412026)">0 Vorbericht(e)</a></td></tr>
			<tr><td align=right class="">61</td><td class="">reserviert</td><td><a href="javascript:teaminfo(0)"></a></td><td align=middle></td><td></td><td>FSS-Tunier: 7. OS-Mitropacup (50%, fairplay!!)</td><td class="noprint"></td></tr>
			<tr><td align=right class="TOR">62</td><td class="TOR">Liga : Heim</td><td><a href="javascript:teaminfo(911)">AFC Tralee United</a></td><td align=middle></td><td><a href="javascript:spielpreview(19,911,2)">Vorschau</a></td><td></td><td class="noprint"><a href="javascript:kommentar(412031)">0 Vorbericht(e)</a></td></tr>
			<tr><td align=right class="MIT">63</td><td class="MIT">LP : Heim</td><td><a href="javascript:teaminfo(0)"></a></td><td align=middle></td><td><a href="javascript:spielpreview(19,0,3)">Vorschau</a></td><td></td><td class="noprint"><a href="javascript:kommentar(457261)">0 Vorbericht(e)</a></td></tr>
			<tr><td align=right class="TOR">64</td><td class="TOR">Liga : Ausw&auml;rts</td><td><a href="javascript:teaminfo(352)">Tralee City</a></td><td align=middle></td><td><a href="javascript:spielpreview(352,19,2)">Vorschau</a></td><td></td><td class="noprint"><a href="javascript:kommentar(412036)">0 Vorbericht(e)</a></td></tr>
			<tr><td align=right class="TOR">65</td><td class="TOR">Liga : Heim</td><td><a href="javascript:teaminfo(1129)">Teelin United</a></td><td align=middle></td><td><a href="javascript:spielpreview(19,1129,2)">Vorschau</a></td><td></td><td class="noprint"><a href="javascript:kommentar(412041)">0 Vorbericht(e)</a></td></tr>
			<tr><td align=right class="TOR">66</td><td class="TOR">Liga : Ausw&auml;rts</td><td><a href="javascript:teaminfo(708)">Cork College</a></td><td align=middle></td><td><a href="javascript:spielpreview(708,19,2)">Vorschau</a></td><td></td><td class="noprint"><a href="javascript:kommentar(412046)">0 Vorbericht(e)</a></td></tr>
			<tr><td align=right class="">67</td><td class="">reserviert</td><td><a href="javascript:teaminfo(0)"></a></td><td align=middle></td><td></td><td>FSS-Tunier: 7. OS-Mitropacup (50%, fairplay!!)</td><td class="noprint"></td></tr>
			<tr><td align=right class="TOR">68</td><td class="TOR">Liga : Heim</td><td><a href="javascript:teaminfo(1139)">United Hibernians</a></td><td align=middle></td><td><a href="javascript:spielpreview(19,1139,2)">Vorschau</a></td><td></td><td class="noprint"><a href="javascript:kommentar(412051)">0 Vorbericht(e)</a></td></tr>
			<tr><td align=right class="MIT">69</td><td class="MIT">LP : Heim</td><td><a href="javascript:teaminfo(0)"></a></td><td align=middle></td><td><a href="javascript:spielpreview(19,0,3)">Vorschau</a></td><td></td><td class="noprint"><a href="javascript:kommentar(457262)">0 Vorbericht(e)</a></td></tr>
			<tr><td align=right class="TOR">70</td><td class="TOR">Liga : Heim</td><td><a href="javascript:teaminfo(0)"></a></td><td align=middle></td><td><a href="javascript:spielpreview(19,0,2)">Vorschau</a></td><td></td><td class="noprint"><a href="javascript:kommentar(455004)">0 Vorbericht(e)</a></td></tr>
			<tr><td align=right class="">71</td><td class="">spielfrei</td><td><a href="javascript:teaminfo(0)"></a></td><td align=middle></td><td></td><td></td><td class="noprint"></td></tr>
			<tr><td align=right class="TOR">72</td><td class="TOR">Liga : Heim</td><td><a href="javascript:teaminfo(45)"></a></td><td align=middle></td><td><a href="javascript:spielpreview(19,0,2)">Vorschau</a></td><td></td><td class="noprint"><a href="javascript:kommentar(455005)">0 Vorbericht(e)</a></td></tr>
		 	</table>*/
		
		this.data.saisonpause = true;
		this.data.vorsaison = true;
		
		var queue = this.site.extract(this.data);		

		assertEquals(3,this.data.termin.saison);
		assertEquals(1,queue.sitequeue.length);
		assertMatch(/.+rep\/saison\/3\/72\/19-45.html/,queue.sitequeue[0].uri);
		assertFalse(this.data.vorsaison);
		assertUndefined(this.data.saisonplan[0]);
		assertTrue(this.data.saisonplan[1].gespielt);
		assertFalse(this.data.saisonplan[72].gespielt);
	},
	
	testExtractSaisonpauseOhneNeuemSaisonplan : function() {

		/*:DOC += <select name="saison"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option selected="" value="4">4</option></select>*/
		/*:DOC += <table><tr><td><table><tr><td><b>FC Cork - 2. Liga A<a href="">Irland</a></b></td></tr></table></td></tr><tr><td></td><td><br><a href="javascript:tabellenplatz(19)">Tabellenpl�tze</a></td></tr></table>*/		
		/*:DOC += <table>
		    <tr><td>ZAT</td><td>Spielart</td><td>Gegner</td><td>Ergebnis</td><td>Bericht</td></tr>
			<tr><td align=right class="OMI">13</td><td class="OMI">Friendly : Heim</td><td><a href="javascript:teaminfo(873)">KB Klaksvik</a></td><td align=middle>0 : 2</td><td><a href="javascript:os_bericht(19,873,13,4)">Klick</a></td><td></td><td class="noprint"><a href="javascript:kommentar(475906)">0 Vorbericht(e) &amp; 0 Kommentar(e)</a></td></tr>
		 	</table>*/
		
		this.data.saisonpause = true;
		this.data.saisonplan[1].gespielt = true;
		
		var queue = this.site.extract(this.data);		

		assertTrue(queue.sitequeue.length > 0);
		assertFalse(this.data.vorsaison);	
	},
		
	testExtractSaisonpause : function() {

		/*:DOC += <select name="saison"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option selected="" value="4">4</option></select>*/
		/*:DOC += <table><tr><td><table><tr><td><b>FC Cork - 2. Liga A<a href="">Irland</a></b></td></tr></table></td></tr><tr><td></td><td><br><a href="javascript:tabellenplatz(19)">Tabellenpl�tze</a></td></tr></table>*/		
		/*:DOC += <table>
		    <tr><td>ZAT</td><td>Spielart</td><td>Gegner</td><td>Ergebnis</td><td>Bericht</td></tr>
			<tr><td align=right class="OMI">57</td><td class="OMI">Friendly : Ausw&auml;rts</td><td><a href="javascript:teaminfo(17)">FC Bleiburg</a></td><td align=middle></td><td></td><td>50/50</td><td class="noprint"><a href="javascript:kommentar(485338)">0 Vorbericht(e)</a></td></tr>
		 	</table>*/
		
		this.data.saisonpause = true;
		
		var queue = this.site.extract(this.data);		

		assertEquals(2,queue.sitequeue.length);
		assertEquals(3,queue.sitequeue[0].post.saison);
		assertEquals(3,queue.sitequeue[1].post.saison);
		assertEquals(72,queue.sitequeue[1].post.zat);
		assertTrue(this.data.vorsaison);		
	},
	
	testExtend : function() {

		/*:DOC += <select name="saison"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option selected="" value="4">4</option></select>*/
		/*:DOC += <table><tr><td><table><tr><td><b>FC Cork - 2. Liga A<a href="">Irland</a></b></td></tr></table></td></tr><tr><td></td><td><br><a href="javascript:tabellenplatz(19)">Tabellenpl�tze</a></td></tr></table>*/		
		/*:DOC += <table>
		    <tr><td>ZAT</td><td>Spielart</td><td>Gegner</td><td>Ergebnis</td><td>Bericht</td></tr>
			<tr><td align=right class="OMI">1</td><td class="OMI">Friendly : Ausw&auml;rts</td><td><a href="javascript:teaminfo(1062)">1. FC Burghausen</a></td><td align=middle>1 : 0</td><td><a href="javascript:os_bericht(1062,19,1,4)">Klick</a></td><td></td><td class="noprint"><a href="javascript:kommentar(475873)">0 Vorbericht(e) &amp; 0 Kommentar(e)</a></td></tr>
		 	</table>*/

		this.site.extract(this.data);
		this.site.extend(this.data);
		
		var rows = document.getElementsByTagName("table")[2].rows;
		assertEquals(2,rows.length);
		assertEquals(10,rows[0].cells.length);
		assertEquals(" Saldo Saison 4",rows[0].cells[6].textContent);
		assertEquals(" Saldo Saison 5",rows[0].cells[7].textContent);
	},
	
	testExtendInvalidSaison : function() {

		/*:DOC += <select name="saison"><option value="1">1</option><option selected="" value="2">2</option><option value="3">3</option><option value="4">4</option></select>*/
		/*:DOC += <table><tr><td><table><tr><td><b>FC Cork - 2. Liga A<a href="">Irland</a></b></td></tr></table></td></tr><tr><td></td><td><br><a href="javascript:tabellenplatz(19)">Tabellenpl�tze</a></td></tr></table>*/		
		/*:DOC += <table>
		    <tr><td>ZAT</td><td>Spielart</td><td>Gegner</td><td>Ergebnis</td><td>Bericht</td></tr>
			<tr><td align=right class="OMI">1</td><td class="OMI">Friendly : Ausw&auml;rts</td><td><a href="javascript:teaminfo(1062)">1. FC Burghausen</a></td><td align=middle>1 : 0</td><td><a href="javascript:os_bericht(1062,19,1,4)">Klick</a></td><td></td><td class="noprint"><a href="javascript:kommentar(475873)">0 Vorbericht(e) &amp; 0 Kommentar(e)</a></td></tr>
		 	</table>*/

		this.site.extract(this.data);
		
		this.data.saisonplan[1].termin.saison = 4;
		
		this.site.extend(this.data);
		
		var rows = document.getElementsByTagName("table")[2].rows;
		assertEquals(2,rows.length);
		assertEquals(5,rows[0].cells.length);
	},
	
	testUpdate : function() {

		/*:DOC += <select name="saison"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option selected="" value="4">4</option></select>*/
		/*:DOC += <table><tr><td><table><tr><td><b>FC Cork - 2. Liga A<a href="">Irland</a></b></td></tr></table></td></tr><tr><td></td><td><br><a href="javascript:tabellenplatz(19)">Tabellenpl�tze</a></td></tr></table>*/		
		/*:DOC += <table>
		    <tr><td>ZAT</td><td>Spielart</td><td>Gegner</td><td>Ergebnis</td><td>Bericht</td></tr>
			<tr><td align=right class="OMI">1</td><td class="OMI">Friendly : Ausw&auml;rts</td><td><a href="javascript:teaminfo(1062)">1. FC Burghausen</a></td><td align=middle>1 : 0</td><td><a href="javascript:os_bericht(1062,19,1,4)">Klick</a></td><td></td><td class="noprint"><a href="javascript:kommentar(475873)">0 Vorbericht(e) &amp; 0 Kommentar(e)</a></td></tr>
		 	</table>*/

		this.site.extract(this.data);
		this.site.extend(this.data);

		this.site.update(this.data);		
	}

}
