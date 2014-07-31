
TestCase("ZugabgabeZusatzTests").prototype = {

	setUp : function() {
		
		this.site = new OSext.Sites.Zuzu(new OSext.WrappedDocument(document));
		
		this.data = new OSext.Data();
	},
	
	testSiteChangeNoLigaEintritt : function() {

		/*:DOC += <div>
					<tr>
						<td><input type="text" size="2" value="54" name="pokal"></td>
						<td><input type="text" size="2" value="60" name="int"></td>
					</tr>
				  </div>*/
		
		try {
			assertFalse(this.site.check());
			fail();
		} catch (e) {
			assertInstanceOf(OSext.SiteChangeError, e);
			assertEquals("Zugabgabe/Zusatz -> Ligaeintritt wurde entfernt!", e.message);
		}
	},

	testSiteChangeNoPokalEintritt : function() {

		/*:DOC += <div>
					<tr>
						<td><input type="text" size="2" value="37" name="liga"></td>
						<td><input type="text" size="2" value="60" name="int"></td>
					</tr>
				  </div>*/
		
		try {
			assertFalse(this.site.check());
			fail();
		} catch (e) {
			assertInstanceOf(OSext.SiteChangeError, e);
			assertEquals("Zugabgabe/Zusatz -> Pokaleintritt wurde entfernt!", e.message);
		}
	},

	testSiteChangeNoIntEintritt : function() {

		/*:DOC += <div>
					<tr>
						<td><input type="text" size="2" value="37" name="liga"></td>
						<td><input type="text" size="2" value="54" name="pokal"></td>
					</tr>
				  </div>*/
		
		try {
			assertFalse(this.site.check());
			fail();
		} catch (e) {
			assertInstanceOf(OSext.SiteChangeError, e);
			assertEquals("Zugabgabe/Zusatz -> Internationaleintritt wurde entfernt!", e.message);
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
					<tr>
						<td><input type="text" size="2" value="37" name="liga"></td>
						<td><input type="text" size="2" value="54" name="pokal"></td>
						<td><input type="text" size="2" value="60" name="int"></td>
					</tr>
				  </div>*/
		
		this.data.setAktuellenSpieltag(new OSext.Spieltag(3, 45));
		this.data.spieltag.spielart = OSext.SPIELART.LIGA;
		this.data.spieltag.ort = OSext.SPIELORT.HEIM;

		this.site.extract(this.data);		

		assertEquals(37,this.data.eintritt.liga);
		assertEquals(54,this.data.eintritt.pokal);
		assertEquals(60,this.data.eintritt.international);
		assertEquals(37,this.data.spieltag.eintritt);		
	}

}



