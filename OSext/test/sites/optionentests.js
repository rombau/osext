
TestCase("OptionenTests").prototype = {

	setUp : function() {
		
		this.site = new OSext.Sites.Optionen(new OSext.WrappedDocument(document));
		
		this.data = new OSext.Data();

	},
	
	testSiteChangeNoJugendFoerderungSelect : function() {

		/*:DOC += <div>nixda</div>*/
		
		try {
			assertFalse(this.site.check());
			fail();
		} catch (e) {
			assertInstanceOf(OSext.SiteChangeError, e);
			assertEquals("Optionen -> Jugendförderungsauswahl wurde entfernt!", e.message);
		}
	},

	testDemoTeam : function() {

		/*:DOC += <div>
					<b>Als Gast gesperrt! Falls du dein Passwort geändert hast musst du dich neu einloggen.</b>
				  </div>*/
		
		try {
			assertFalse(this.site.check());
			fail();
		} catch (e) {
			assertInstanceOf(OSext.AuthenticationError, e);
		}
	},
		
	testExtract : function() {

		/*:DOC += <div>
					<select name="jugendFoerderung">
						<option value="500">  500</option>
						<option value="1000"> 1000</option>
						<option value="1500"> 1500</option>
						<option value="2000"> 2000</option>
						<option value="2500"> 2500</option>
						<option value="3000"> 3000</option>
						<option value="3500"> 3500</option>
						<option value="4000"> 4000</option>
						<option value="4500"> 4500</option>
						<option value="5000"> 5000</option>
						<option value="5500"> 5500</option>
						<option value="6000"> 6000</option>
						<option value="6500"> 6500</option>
						<option value="7000"> 7000</option>
						<option selected="" value="7500"> 7500</option>
						<option value="8000"> 8000</option>
						<option value="8500"> 8500</option>
						<option value="9000"> 9000</option>
						<option value="9500"> 9500</option>
						<option value="10000">10000</option>
					</select>
					</div>*/
		
		this.site.extract(this.data);		

		assertEquals(7500,this.data.jugendfoerderung);
	}

}



