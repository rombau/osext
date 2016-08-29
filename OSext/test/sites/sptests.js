TestCase("SpielerprofilTests").prototype = {

	setUp : function() {

		this.site = new OSext.Sites.Sp(new OSext.WrappedDocument(document));

		this.data = new OSext.Data();

		this.data.team.spieler[0] = new OSext.Kaderspieler();
		this.data.team.spieler[0].id = 26109;
	},

	testSiteChangeNoADiv : function() {

		/*:DOC += <div><div/></div>*/

		try {
			assertFalse(this.site.check());
			fail();
		} catch (e) {
			assertInstanceOf(OSext.SiteChangeError, e);
			assertEquals("Spielerprofil -> Register Spielerdaten fehlt!", e.message);
		}
	},
					
	testExtract : function() {

		/*:DOC += <div id="a">
					<table>
					  <tr>
			    		<td>Nationalität :</td><td>Panama</td><td></td>
						<td>Geburtstag :</td><td>ZAT 12</td><td></td>
						<td>Vertragslaufzeit :</td><td>11</td>
					  </tr>
		 		    </table>
		 		  </div>*/
		
		
		this.site.extract(this.data, {s: 26109});
		
		assertEquals(12,this.data.team.spieler[0].geburtstag);		
	}
}
