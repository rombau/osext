TestCase("ShowteamSkillsTests").prototype = {

	setUp : function() {

		this.site = new OSext.Sites.ShowteamSkills(new OSext.WrappedDocument(document));

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
			assertEquals("Mannschaft/Einzelskills -> Überschrift wurde geändert!", e.message);
		}
	},

	testSiteChangeNoTable : function() {

		/*:DOC += <b>FC Cork - 2. Liga A<a href="">Irland</a></b>*/
		
		try {
			assertFalse(this.site.check());
			fail();
		} catch (e) {
			assertInstanceOf(OSext.SiteChangeError, e);
			assertEquals("Mannschaft/Einzelskills -> Tabelle wurde geändert!", e.message);
		}
	},
	
	testSiteChangeNoTableFooter : function() {
		
		/*:DOC += <b>FC Cork - 2. Liga A<a href="">Irland</a></b>*/
		/*:DOC += <table id="team"><tr><td>#</td><td>Name</td><td>Land</td><td>U</td><td>SCH</td><td>BAK</td><td>KOB</td><td>ZWK</td><td>DEC</td><td>GES</td><td>FUQ</td><td>ERF</td><td>AGG</td><td>PAS</td><td>AUS</td><td>UEB</td><td>WID</td><td>SEL</td><td>DIS</td><td>ZUV</td><td>EIN</td></tr></table>*/
		
		try {
			assertFalse(this.site.check());
			fail();
		} catch (e) {
			assertInstanceOf(OSext.SiteChangeError, e);
			assertEquals("Mannschaft/Einzelskills -> Tabelle wurde geändert!", e.message);
		}
	},

	testSiteChangeTableColumnCount : function() {

		/*:DOC += <b>FC Cork - 2. Liga A<a href="">Irland</a></b>*/
		/*:DOC += <table id="team"><tr><td>#</td></tr>
		 						   <tr><td>#</td></tr></table>*/
		
		try {
			assertFalse(this.site.check());
			fail();
		} catch (e) {
			assertInstanceOf(OSext.SiteChangeError, e);
			assertEquals("Mannschaft/Einzelskills -> Tabelle wurde geändert!", e.message);
		}
	},

	testSiteChangeTableColumnName : function() {

		/*:DOC += <b>FC Cork - 2. Liga A<a href="">Irland</a></b>*/
		/*:DOC += <table id="team"><tr><td>???</td><td>Name</td><td>Land</td><td>U</td><td>SCH</td><td>BAK</td><td>KOB</td><td>ZWK</td><td>DEC</td><td>GES</td><td>FUQ</td><td>ERF</td><td>AGG</td><td>PAS</td><td>AUS</td><td>UEB</td><td>WID</td><td>SEL</td><td>DIS</td><td>ZUV</td><td>EIN</td></tr>
		 						   <tr><td>???</td><td>Name</td><td>Land</td><td>U</td><td>SCH</td><td>BAK</td><td>KOB</td><td>ZWK</td><td>DEC</td><td>GES</td><td>FUQ</td><td>ERF</td><td>AGG</td><td>PAS</td><td>AUS</td><td>UEB</td><td>WID</td><td>SEL</td><td>DIS</td><td>ZUV</td><td>EIN</td></tr></table>*/
		
		try {
			assertFalse(this.site.check());
			fail();
		} catch (e) {
			assertInstanceOf(OSext.SiteChangeError, e);
			assertEquals("Mannschaft/Einzelskills -> Tabellenspalten wurden geändert!", e.message);
		}
	},

	testDemoTeam : function() {

		/*:DOC += <b>DemoTeam - <a href="">Landesforum</a></b>*/
		/*:DOC += <table id="team"><tr><td>#</td><td>Name</td><td>Land</td><td>U</td><td>SCH</td><td>BAK</td><td>KOB</td><td>ZWK</td><td>DEC</td><td>GES</td><td>FUQ</td><td>ERF</td><td>AGG</td><td>PAS</td><td>AUS</td><td>UEB</td><td>WID</td><td>SEL</td><td>DIS</td><td>ZUV</td><td>EIN</td></tr>
		   						   <tr><td>#</td><td>Name</td><td>Land</td><td>U</td><td>SCH</td><td>BAK</td><td>KOB</td><td>ZWK</td><td>DEC</td><td>GES</td><td>FUQ</td><td>ERF</td><td>AGG</td><td>PAS</td><td>AUS</td><td>UEB</td><td>WID</td><td>SEL</td><td>DIS</td><td>ZUV</td><td>EIN</td></tr></table>*/
		
		try {
			assertFalse(this.site.check());
			fail();
		} catch (e) {
			assertInstanceOf(OSext.AuthenticationError, e);
		}
	},
		
	testExtract : function() {

		/*:DOC += <table id="team"><tr><td>#</td><td>Name</td><td>Land</td><td>U</td><td>SCH</td><td>BAK</td><td>KOB</td><td>ZWK</td><td>DEC</td><td>GES</td><td>FUQ</td><td>ERF</td><td>AGG</td><td>PAS</td><td>AUS</td><td>UEB</td><td>WID</td><td>SEL</td><td>DIS</td><td>ZUV</td><td>EIN</td></tr>
		   						   <tr><td>1</td><td><a href="javascript:spielerinfo(26109)">Philip Croly</a></td><td><abbr title="Irland">IRL</abbr></td><td></td><td>52</td><td>68</td><td>77</td><td>79</td><td>76</td><td>77</td><td>0</td><td>26</td><td>50</td><td>53</td><td>46</td><td>57</td><td>1</td><td>76</td><td>29</td><td>59</td><td>88</td></tr>
		   						   <tr><td>#</td><td>Name</td><td>Land</td><td>U</td><td>SCH</td><td>BAK</td><td>KOB</td><td>ZWK</td><td>DEC</td><td>GES</td><td>FUQ</td><td>ERF</td><td>AGG</td><td>PAS</td><td>AUS</td><td>UEB</td><td>WID</td><td>SEL</td><td>DIS</td><td>ZUV</td><td>EIN</td></tr></table>*/
		
		this.site.extract(this.data);
		
		assertEquals(1,this.data.team.spieler.length);
		assertEquals(52,this.data.team.spieler[0].skills[0]);
		assertEquals(68,this.data.team.spieler[0].skills[1]);
		assertEquals(77,this.data.team.spieler[0].skills[2]);
		assertEquals(79,this.data.team.spieler[0].skills[3]);
		assertEquals(76,this.data.team.spieler[0].skills[4]);
		assertEquals(77,this.data.team.spieler[0].skills[5]);
		assertEquals(0,this.data.team.spieler[0].skills[6]);
		assertEquals(26,this.data.team.spieler[0].skills[7]);
		assertEquals(50,this.data.team.spieler[0].skills[8]);
		assertEquals(53,this.data.team.spieler[0].skills[9]);
		assertEquals(46,this.data.team.spieler[0].skills[10]);
		assertEquals(57,this.data.team.spieler[0].skills[11]);
		assertEquals(1,this.data.team.spieler[0].skills[12]);
		assertEquals(76,this.data.team.spieler[0].skills[13]);
		assertEquals(29,this.data.team.spieler[0].skills[14]);
		assertEquals(59,this.data.team.spieler[0].skills[15]);
		assertEquals(88,this.data.team.spieler[0].skills[16]);

	},

	testExtractExternalTeam : function() {

		/*:DOC += <table id="team"><tr><td>#</td><td>Name</td><td>Land</td><td>U</td><td>SCH</td><td>BAK</td><td>KOB</td><td>ZWK</td><td>DEC</td><td>GES</td><td>FUQ</td><td>ERF</td><td>AGG</td><td>PAS</td><td>AUS</td><td>UEB</td><td>WID</td><td>SEL</td><td>DIS</td><td>ZUV</td><td>EIN</td></tr>
		   						   <tr><td class="TOR">1</td><td><a href="javascript:spielerinfo(26109)">Philip Croly</a></td><td><abbr title="Irland">IRL</abbr></td><td></td><td>52</td><td>68</td><td>77</td><td>79</td><td>76</td><td>77</td><td>0</td><td>26</td><td>50</td><td>53</td><td>46</td><td>57</td><td>1</td><td>76</td><td>29</td><td>59</td><td>88</td></tr>
		   						   <tr><td>#</td><td>Name</td><td>Land</td><td>U</td><td>SCH</td><td>BAK</td><td>KOB</td><td>ZWK</td><td>DEC</td><td>GES</td><td>FUQ</td><td>ERF</td><td>AGG</td><td>PAS</td><td>AUS</td><td>UEB</td><td>WID</td><td>SEL</td><td>DIS</td><td>ZUV</td><td>EIN</td></tr></table>*/
		
		this.site.extract(this.data,{c:1});
		
		assertEquals(0,this.data.team.spieler.length);
		assertEquals(1,this.data.externalteams.length);
		assertEquals(1,this.data.externalteams[0].id);
		assertEquals(1,this.data.externalteams[0].spieler.length);
		assertEquals(26109,this.data.externalteams[0].spieler[0].id);
		assertEquals("Philip Croly",this.data.externalteams[0].spieler[0].name);
		assertEquals("IRL",this.data.externalteams[0].spieler[0].land);
		assertEquals(OSext.POS.TOR,this.data.externalteams[0].spieler[0].pos);
		assertEquals(52,this.data.externalteams[0].spieler[0].skills[0]);
		assertEquals(68,this.data.externalteams[0].spieler[0].skills[1]);
		assertEquals(77,this.data.externalteams[0].spieler[0].skills[2]);
		assertEquals(79,this.data.externalteams[0].spieler[0].skills[3]);
		assertEquals(76,this.data.externalteams[0].spieler[0].skills[4]);
		assertEquals(77,this.data.externalteams[0].spieler[0].skills[5]);
		assertEquals(0,this.data.externalteams[0].spieler[0].skills[6]);
		assertEquals(26,this.data.externalteams[0].spieler[0].skills[7]);
		assertEquals(50,this.data.externalteams[0].spieler[0].skills[8]);
		assertEquals(53,this.data.externalteams[0].spieler[0].skills[9]);
		assertEquals(46,this.data.externalteams[0].spieler[0].skills[10]);
		assertEquals(57,this.data.externalteams[0].spieler[0].skills[11]);
		assertEquals(1,this.data.externalteams[0].spieler[0].skills[12]);
		assertEquals(76,this.data.externalteams[0].spieler[0].skills[13]);
		assertEquals(29,this.data.externalteams[0].spieler[0].skills[14]);
		assertEquals(59,this.data.externalteams[0].spieler[0].skills[15]);
		assertEquals(88,this.data.externalteams[0].spieler[0].skills[16]);

	},

	testExtend : function() {
		
		/*:DOC += <table id="team"><tr><td>#</td><td>Name</td><td>Land</td><td>U</td><td>SCH</td><td>BAK</td><td>KOB</td><td>ZWK</td><td>DEC</td><td>GES</td><td>FUQ</td><td>ERF</td><td>AGG</td><td>PAS</td><td>AUS</td><td>UEB</td><td>WID</td><td>SEL</td><td>DIS</td><td>ZUV</td><td>EIN</td></tr>
								   <tr><td>1</td><td><a href="javascript:spielerinfo(26109)">Philip Croly</a></td><td><abbr title="Irland">IRL</abbr></td><td></td><td>52</td><td>68</td><td>77</td><td>79</td><td>76</td><td>77</td><td>0</td><td>26</td><td>50</td><td>53</td><td>46</td><td>57</td><td>1</td><td>76</td><td>29</td><td>59</td><td>88</td></tr>
								   <tr><td>#</td><td>Name</td><td>Land</td><td>U</td><td>SCH</td><td>BAK</td><td>KOB</td><td>ZWK</td><td>DEC</td><td>GES</td><td>FUQ</td><td>ERF</td><td>AGG</td><td>PAS</td><td>AUS</td><td>UEB</td><td>WID</td><td>SEL</td><td>DIS</td><td>ZUV</td><td>EIN</td></tr></table>*/

		this.data.team.spieler[0] = new OSext.Kaderspieler();
		this.data.team.spieler[0].id = 26109;
		this.data.team.spieler[0].opti = 78.96;
		this.data.team.spieler[0].skillschnitt = 52.71;
		this.data.team.spieler[0].status = OSext.STATUS.AKTIV;
		this.data.team.spieler[0].land = "IRL";
		this.data.team.spieler[0].alter = 31;

		this.site.extend(this.data);
		
		var rows = document.getElementById("team").rows;
		assertEquals(3,rows.length);
		assertEquals(24,rows[0].cells.length);
		
		assertMatch(/Alter/,rows[0].cells[2].textContent);
		assertMatch(/\s+.Skillschn./,rows[0].cells[22].textContent);
		assertMatch(/\s+Opt\.Skill/,rows[0].cells[23].textContent);

		assertMatch(/<img src="images\/flaggen\/IRL\.gif">.+/,rows[1].cells[3].innerHTML);
	},
	
	testUpdate : function() {
		
		/*:DOC += <table id="team"><tr><td>#</td><td>Name</td><td>Land</td><td>U</td><td>SCH</td><td>BAK</td><td>KOB</td><td>ZWK</td><td>DEC</td><td>GES</td><td>FUQ</td><td>ERF</td><td>AGG</td><td>PAS</td><td>AUS</td><td>UEB</td><td>WID</td><td>SEL</td><td>DIS</td><td>ZUV</td><td>EIN</td></tr>
								   <tr><td>1</td><td><a href="javascript:spielerinfo(26109)">Philip Croly</a></td><td><abbr title="Irland">IRL</abbr></td><td></td><td>52</td><td>68</td><td>77</td><td>79</td><td>76</td><td>77</td><td>0</td><td>26</td><td>50</td><td>53</td><td>46</td><td>57</td><td>1</td><td>76</td><td>29</td><td>59</td><td>88</td></tr>
								   <tr><td>#</td><td>Name</td><td>Land</td><td>U</td><td>SCH</td><td>BAK</td><td>KOB</td><td>ZWK</td><td>DEC</td><td>GES</td><td>FUQ</td><td>ERF</td><td>AGG</td><td>PAS</td><td>AUS</td><td>UEB</td><td>WID</td><td>SEL</td><td>DIS</td><td>ZUV</td><td>EIN</td></tr></table>*/
		
		this.data.team.spieler[0] = new OSext.Kaderspieler();
		this.data.team.spieler[0].id = 26109;
		this.data.team.spieler[0].opti = 78.96;
		this.data.team.spieler[0].skillschnitt = 52.71;
		this.data.team.spieler[0].status = OSext.STATUS.AKTIV;
		this.data.team.spieler[0].alter = 31;
		
		this.site.extract(this.data);
		this.site.extend(this.data);

		this.site.update(this.data);

		assertEquals("31",document.getElementById("team").rows[1].cells[2].textContent);
		assertEquals("52.71",document.getElementById("team").rows[1].cells[22].textContent);
		assertEquals("78.96",document.getElementById("team").rows[1].cells[23].textContent);
	},	
	
	testUpdateNoData : function() {
		
		/*:DOC += <table id="team"><tr><td>#</td><td>Name</td><td>Land</td><td>U</td><td>SCH</td><td>BAK</td><td>KOB</td><td>ZWK</td><td>DEC</td><td>GES</td><td>FUQ</td><td>ERF</td><td>AGG</td><td>PAS</td><td>AUS</td><td>UEB</td><td>WID</td><td>SEL</td><td>DIS</td><td>ZUV</td><td>EIN</td></tr>
								   <tr><td>1</td><td><a href="javascript:spielerinfo(26109)">Philip Croly</a></td><td><abbr title="Irland">IRL</abbr></td><td></td><td>52</td><td>68</td><td>77</td><td>79</td><td>76</td><td>77</td><td>0</td><td>26</td><td>50</td><td>53</td><td>46</td><td>57</td><td>1</td><td>76</td><td>29</td><td>59</td><td>88</td></tr>
								   <tr><td>#</td><td>Name</td><td>Land</td><td>U</td><td>SCH</td><td>BAK</td><td>KOB</td><td>ZWK</td><td>DEC</td><td>GES</td><td>FUQ</td><td>ERF</td><td>AGG</td><td>PAS</td><td>AUS</td><td>UEB</td><td>WID</td><td>SEL</td><td>DIS</td><td>ZUV</td><td>EIN</td></tr></table>*/

		this.site.extract(this.data);
		this.site.extend(this.data);
		this.site.update(this.data);

		assertEquals("Philip Croly",document.getElementById("team").rows[1].cells[1].textContent);
		assertEquals("",document.getElementById("team").rows[1].cells[12].textContent);
	},	
	
	testNewTeamId : function() {
		
		/*:DOC += <div><h1>Dieses Team existiert nicht mehr!</h1>Es wurde ersetzt durch	<a href="st.php?c=1747">Tornado Lavadina</a>.</div>*/
		
		try {
			assertFalse(this.site.check());
		} catch (e) {
			fail();
		}
	}
}
