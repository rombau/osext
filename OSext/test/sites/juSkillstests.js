TestCase("JugendSkillsTests").prototype = {

	setUp : function() {

		this.site = new OSext.Sites.JugendSkills(new OSext.WrappedDocument(document));

		this.data = new OSext.Data();
		this.data.setAktuellenSpieltag(new OSext.Spieltag(3, 45));

	},

	testSiteChangeNoTable : function() {

		/*:DOC += <div><table/></div>*/

		try {
			assertFalse(this.site.check());
			fail();
		} catch (e) {
			assertInstanceOf(OSext.SiteChangeError, e);
			assertEquals("Jugend/Einzelskills -> Tabelle wurde geändert!", e.message);
		}
	},
	
	testSiteChangeTableColumnCount : function() {

		/*:DOC += <div>
					<table/>
					<table>
		 			  <tr><td>U</td></tr>
		 			  <tr></td><td></tr>
		 		    </table>
		 		  </div>*/
		
		try {
			assertFalse(this.site.check());
			fail();
		} catch (e) {
			assertInstanceOf(OSext.SiteChangeError, e);
			assertEquals("Jugend/Einzelskills -> Tabelle wurde geändert!", e.message);
		}
	},

	testSiteChangeTableColumnName : function() {

		/*:DOC += <div>
					<table/>
					<table>
		 			  <tr><td colspan="2">#</td><td>U</td><td>Alter</td><td>SCH</td><td>BAK</td><td>KOB</td><td>ZWK</td><td>DEC</td><td>GES</td><td>FUQ</td><td>ERF</td><td>AGG</td><td>PAS</td><td>AUS</td><td>UEB</td><td>WID</td><td>SEL</td><td>DIS</td><td>ZUV</td><td>EIN</td></tr>
		 			  <tr><td><img src="images/flaggen/IRL.gif"></td><td><abbr title="Irland">IRL</abbr></td><td></td><td>18</td><td>65</td><td>26</td><td>64</td><td>56</td><td>19</td><td>79</td><td>0</td><td>0</td><td>35</td><td>28</td><td>30</td><td>29</td><td>26</td><td>40</td><td>26</td><td>31</td><td>28</td></tr>
		 		    </table>
		 		  </div>*/
		
		try {
			assertFalse(this.site.check());
			fail();
		} catch (e) {
			assertInstanceOf(OSext.SiteChangeError, e);
			assertEquals("Jugend/Einzelskills -> Tabellenspalten wurden geändert!", e.message);
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
					<table/>
					<table>
		 			  <tr><td colspan="2">Land</td><td>U</td><td>Alter</td><td>SCH</td><td>BAK</td><td>KOB</td><td>ZWK</td><td>DEC</td><td>GES</td><td>FUQ</td><td>ERF</td><td>AGG</td><td>PAS</td><td>AUS</td><td>UEB</td><td>WID</td><td>SEL</td><td>DIS</td><td>ZUV</td><td>EIN</td></tr>
		 			  <tr><td><img src="images/flaggen/IRL.gif"></td><td><abbr title="Irland">IRL</abbr></td><td></td><td>18</td><td>65</td><td>26</td><td>64</td><td>56</td><td>19</td><td>79</td><td>0</td><td>0</td><td>35</td><td>28</td><td>30</td><td>29</td><td>26</td><td>40</td><td>26</td><td>31</td><td>28</td></tr>
		 		    </table>
		 		  </div>*/
		
		this.site.extract(this.data);
		
		assertEquals(1,this.data.team.jugend.length);
		assertEquals(65,this.data.team.jugend[0].skills[0]);
		assertEquals(26,this.data.team.jugend[0].skills[1]);
		assertEquals(64,this.data.team.jugend[0].skills[2]);
		assertEquals(56,this.data.team.jugend[0].skills[3]);
		assertEquals(19,this.data.team.jugend[0].skills[4]);
		assertEquals(79,this.data.team.jugend[0].skills[5]);
		assertEquals(0,this.data.team.jugend[0].skills[6]);
		assertEquals(0,this.data.team.jugend[0].skills[7]);
		assertEquals(35,this.data.team.jugend[0].skills[8]);
		assertEquals(28,this.data.team.jugend[0].skills[9]);
		assertEquals(30,this.data.team.jugend[0].skills[10]);
		assertEquals(29,this.data.team.jugend[0].skills[11]);
		assertEquals(26,this.data.team.jugend[0].skills[12]);
		assertEquals(40,this.data.team.jugend[0].skills[13]);
		assertEquals(26,this.data.team.jugend[0].skills[14]);
		assertEquals(31,this.data.team.jugend[0].skills[15]);
		assertEquals(28,this.data.team.jugend[0].skills[16]);

	},
	
	testExtend : function() {
		
		/*:DOC += <div>
					<table/>
					<table>
					  <tr><td colspan="2">Land</td><td>U</td><td>Alter</td><td>SCH</td><td>BAK</td><td>KOB</td><td>ZWK</td><td>DEC</td><td>GES</td><td>FUQ</td><td>ERF</td><td>AGG</td><td>PAS</td><td>AUS</td><td>UEB</td><td>WID</td><td>SEL</td><td>DIS</td><td>ZUV</td><td>EIN</td></tr>
					  <tr><td><img src="images/flaggen/IRL.gif"></td><td><abbr title="Irland">IRL</abbr></td><td></td><td>18</td><td>65</td><td>26</td><td>64</td><td>56</td><td>19</td><td>79</td><td>0</td><td>0</td><td>35</td><td>28</td><td>30</td><td>29</td><td>26</td><td>40</td><td>26</td><td>31</td><td>28</td></tr>
				    </table>
				  </div>*/

		this.site.extract(this.data);
		this.site.extend(this.data);
		
		var rows = document.getElementsByTagName("table")[1].rows;
		assertEquals(2,rows.length);
		assertEquals(23,rows[0].cells.length);
		
		assertEquals("Alter",rows[0].cells[0].textContent);
		assertEquals("Pos",rows[0].cells[1].textContent);
		assertMatch(/\s+Skillschn./,rows[0].cells[21].textContent);
		assertMatch(/\s+Opt.Skill/,rows[0].cells[22].textContent);
	},
	
	testUpdate : function() {
		
		/*:DOC += <div>
					<table/>
					<table>
					  <tr><td colspan="2">Land</td><td>U</td><td>Alter</td><td>SCH</td><td>BAK</td><td>KOB</td><td>ZWK</td><td>DEC</td><td>GES</td><td>FUQ</td><td>ERF</td><td>AGG</td><td>PAS</td><td>AUS</td><td>UEB</td><td>WID</td><td>SEL</td><td>DIS</td><td>ZUV</td><td>EIN</td></tr>
					  <tr><td><img src="images/flaggen/IRL.gif"></td><td><abbr title="Irland">IRL</abbr></td><td></td><td>18</td><td>65</td><td>26</td><td>64</td><td>56</td><td>19</td><td>79</td><td>0</td><td>0</td><td>35</td><td>28</td><td>30</td><td>29</td><td>26</td><td>40</td><td>26</td><td>31</td><td>28</td></tr>
				    </table>
				  </div>*/
		
		this.site.extract(this.data);
		this.site.extend(this.data);

		this.data.ansicht.jugend.getSpieler = function() {
			updated = [];
			updated[0] = new OSext.Jugendspieler();
			updated[0].pos = "ABW";
			updated[0].skills = [34,36,70,76,75,40,0,12,31,30,45,41,20,23,87,66,50];
			updated[0].alter = 17;
			return updated;
		};
		
		this.site.update(this.data);

		var rows = document.getElementsByTagName("table")[1].rows;
		assertEquals("17",rows[1].cells[0].textContent);
		assertEquals("34",rows[1].cells[5].textContent);
		assertEquals("true",rows[1].cells[7].getAttribute("primary"));
		assertEquals("69.78",rows[1].cells[23].textContent);


	}
}
