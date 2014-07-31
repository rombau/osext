TestCase("TrainingTests").prototype = {

	setUp : function() {

		this.site = new OSext.Sites.Training(new OSext.WrappedDocument(document));

		this.data = new OSext.Data();
		this.data.setAktuellenSpieltag(new OSext.Spieltag(3, 45));
		
		this.data.team.trainer[1] = new OSext.Trainer();
		this.data.team.trainer[1].skill = 99;
		this.data.team.trainer[5] = new OSext.Trainer();
		this.data.team.trainer[5].skill = 60;

		this.data.team.spieler[0] = new OSext.Kaderspieler();
		this.data.team.spieler[0].id = 26109;
		this.data.team.spieler[1] = new OSext.Kaderspieler();
		this.data.team.spieler[1].id = 41930;
	},

	testSiteChangeTableCount : function() {

		/*:DOC += <div><table></table><table></table></div>*/
		
		try {
			assertFalse(this.site.check());
			fail();
		} catch (e) {
			assertInstanceOf(OSext.SiteChangeError, e);
			assertEquals("Training -> Tabelle wurde geändert!", e.message);
		}
	},

	testSiteChangeTableColumnCount : function() {

		/*:DOC += <table></table>*/
		/*:DOC += <table></table>*/
		/*:DOC += <table><tr><td>#</td></tr><tr><td>#</td></tr>
		 		  		 <tr><td>#</td></tr><tr><td>#</td></tr></table>*/
		
		try {
			assertFalse(this.site.check());
			fail();
		} catch (e) {
			assertInstanceOf(OSext.SiteChangeError, e);
			assertEquals("Training -> Tabelle wurde geändert!", e.message);
		}
	},

	testSiteChangeTableColumnName : function() {

		/*:DOC += <table></table>*/
		/*:DOC += <table></table>*/
		/*:DOC += <table><tr><td></td><td>#</td><td>Alter</td><td>Opti</td><td>Trainer</td><td>trainierter Skill</td><td>Skill</td><td>Chance</td></tr>
		 				 <tr><td></td></tr></table>*/
		
		try {
			assertFalse(this.site.check());
			fail();
		} catch (e) {
			assertInstanceOf(OSext.SiteChangeError, e);
			assertEquals("Training -> Tabellenspalten wurden geändert!", e.message);
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

	testSaisonpause : function() {

		/*:DOC += <div>Diese Funktion ist erst ZAT 1 wieder verf&uuml;gbar</div>*/
		
		assertFalse(this.site.check());
	},

	testExtract : function() {

		/*:DOC += <table></table>*/
		/*:DOC += <table></table>*/
		/*:DOC += <table><tr><td></td><td>Name</td><td>Alter</td><td>Opti</td><td>Trainer</td><td>trainierter Skill</td><td>Skill</td><td>Chance</td></tr>
			 <tr><td></td>
				 <td><a href="javascript:spielerinfo(26109)">Philip Croly</a></td>
				 <td>32</td>
				 <td>79.89</td>
				 <td><select size="1"><option value="0">---</option><option value="1">T 1 99</option><option value="2">T 2 99</option><option value="3">T 3 99</option><option value="4">T 4 80</option><option selected="" value="5">T 5 60</option><option value="6">T 6 20</option></select></td>
				 <td><select size="1"><option value="0">---</option><option selected="" value="1">ABS</option><option value="2">STS</option><option value="3">FAN</option><option value="4">STB</option><option value="5">SPL</option><option value="6">REF</option><option value="7">AGG</option><option value="8">PAS</option><option value="9">AUS</option><option value="10">UEB</option><option value="11">ZUV</option></select></td>
				 <td>54</td>
				 <td>9.31 %</td>
			 </tr>
			 <tr><td></td>
				 <td><a href="javascript:spielerinfo(41930)">Steve Stapleton</a></td>
				 <td>21</td>
				 <td>75.44</td>
				 <td><select size="1"><option value="0">---</option><option selected="" value="1">T 1 99</option><option value="2">T 2 99</option><option value="3">T 3 99</option><option value="4">T 4 80</option><option value="5">T 5 60</option><option value="6">T 6 20</option></select></td>
				 <td><select size="1"><option value="0">---</option><option value="1">ABS</option><option value="2">STS</option><option value="3">FAN</option><option value="4">STB</option><option value="5">SPL</option><option value="6">REF</option><option value="7">AGG</option><option value="8">PAS</option><option value="9">AUS</option><option selected="" value="10">UEB</option><option value="11">ZUV</option></select></td>
				 <td>59</td>
				 <td>51.11 %</td>
			 </tr>
		 </table>*/
		
		this.site.extract(this.data);
		
		assertNotNull(this.data.team.spieler[0].training.plan.trainer);
		assertEquals(60, this.data.team.spieler[0].training.plan.trainer.skill);
		assertEquals(OSext.SKILL.SCH, this.data.team.spieler[0].training.plan.skillidx);
		assertEquals(9.31, this.data.team.spieler[0].training.plan.wahrscheinlichkeit);

		assertNotNull(this.data.team.spieler[1].training.plan.trainer);
		assertEquals(99, this.data.team.spieler[1].training.plan.trainer.skill);
		assertEquals(OSext.SKILL.UEB, this.data.team.spieler[1].training.plan.skillidx);
		assertEquals(51.11, this.data.team.spieler[1].training.plan.wahrscheinlichkeit);
},
	
	testExtractInsured : function() {

		/*:DOC += <table></table>*/
		/*:DOC += <table></table>*/
		/*:DOC += <table><tr><td></td><td>Name</td><td>Alter</td><td>Opti</td><td>Trainer</td><td>trainierter Skill</td><td>Skill</td><td>Chance</td></tr>
			 <tr><td>+verletzt+</td>
				 <td><a href="javascript:spielerinfo(26109)">Philip Croly</a></td>
				 <td>32</td>
				 <td>79.89</td>
				 <td><select size="1"><option value="0">---</option><option value="1">T 1 99</option><option value="2">T 2 99</option><option value="3">T 3 99</option><option value="4">T 4 80</option><option selected="" value="5">T 5 60</option><option value="6">T 6 20</option></select></td>
				 <td><select size="1"><option value="0">---</option><option selected="" value="1">ABS</option><option value="2">STS</option><option value="3">FAN</option><option value="4">STB</option><option value="5">SPL</option><option value="6">REF</option><option value="7">AGG</option><option value="8">PAS</option><option value="9">AUS</option><option value="10">UEB</option><option value="11">ZUV</option></select></td>
				 <td>54</td>
				 <td>9.31 %</td>
			 </tr>
		 </table>*/
		
		this.site.extract(this.data);
		
		assertNull(this.data.team.spieler[0].training.plan.trainer);
		assertNull(this.data.team.spieler[0].training.plan.skillidx);
		assertNull(this.data.team.spieler[0].training.plan.wahrscheinlichkeit);
	},

	testExtractNoTrainer : function() {

		/*:DOC += <table></table>*/
		/*:DOC += <table></table>*/
		/*:DOC += <table><tr><td></td><td>Name</td><td>Alter</td><td>Opti</td><td>Trainer</td><td>trainierter Skill</td><td>Skill</td><td>Chance</td></tr>
			 <tr><td></td>
				 <td><a href="javascript:spielerinfo(26109)">Philip Croly</a></td>
				 <td>32</td>
				 <td>79.89</td>
				 <td><select size="1"><option selected="" value="0">---</option><option value="1">T 1 99</option><option value="2">T 2 99</option><option value="3">T 3 99</option><option value="4">T 4 80</option><option value="5">T 5 60</option><option value="6">T 6 20</option></select></td>
				 <td><select size="1"><option value="0">---</option><option selected="" value="1">ABS</option><option value="2">STS</option><option value="3">FAN</option><option value="4">STB</option><option value="5">SPL</option><option value="6">REF</option><option value="7">AGG</option><option value="8">PAS</option><option value="9">AUS</option><option value="10">UEB</option><option value="11">ZUV</option></select></td>
				 <td>54</td>
				 <td>9.31 %</td>
			 </tr>
		 </table>*/
		
		this.site.extract(this.data);

		assertNull(this.data.team.spieler[0].training.plan.trainer);
		assertNull(this.data.team.spieler[0].training.plan.skillidx);
		assertNull(this.data.team.spieler[0].training.plan.wahrscheinlichkeit);
	},

	testExtractNoSkill : function() {

		/*:DOC += <table></table>*/
		/*:DOC += <table></table>*/
		/*:DOC += <table><tr><td></td><td>Name</td><td>Alter</td><td>Opti</td><td>Trainer</td><td>trainierter Skill</td><td>Skill</td><td>Chance</td></tr>
			 <tr><td></td>
				 <td><a href="javascript:spielerinfo(26109)">Philip Croly</a></td>
				 <td>32</td>
				 <td>79.89</td>
				 <td><select size="1"><option value="0">---</option><option value="1">T 1 99</option><option value="2">T 2 99</option><option value="3">T 3 99</option><option value="4">T 4 80</option><option selected="" value="5">T 5 60</option><option value="6">T 6 20</option></select></td>
				 <td><select size="1"><option selected="" value="0">---</option><option value="1">ABS</option><option value="2">STS</option><option value="3">FAN</option><option value="4">STB</option><option value="5">SPL</option><option value="6">REF</option><option value="7">AGG</option><option value="8">PAS</option><option value="9">AUS</option><option value="10">UEB</option><option value="11">ZUV</option></select></td>
				 <td>54</td>
				 <td>9.31 %</td>
			 </tr>
		 </table>*/
		
		this.site.extract(this.data);
		
		assertNull(this.data.team.spieler[0].training.plan.trainer);
		assertNull(this.data.team.spieler[0].training.plan.skillidx);
		assertNull(this.data.team.spieler[0].training.plan.wahrscheinlichkeit);
	},

	testExtractTooSmallSkill : function() {

		/*:DOC += <table></table>*/
		/*:DOC += <table></table>*/
		/*:DOC += <table><tr><td></td><td>Name</td><td>Alter</td><td>Opti</td><td>Trainer</td><td>trainierter Skill</td><td>Skill</td><td>Chance</td></tr>
			 <tr><td></td>
				 <td><a href="javascript:spielerinfo(26109)">Philip Croly</a></td>
				 <td>32</td>
				 <td>79.89</td>
				 <td><select size="1"><option value="0">---</option><option value="1">T 1 99</option><option value="2">T 2 99</option><option value="3">T 3 99</option><option value="4">T 4 80</option><option selected="" value="5">T 5 60</option><option value="6">T 6 20</option></select></td>
				 <td><select size="1"><option value="0">---</option><option selected="" value="1">ABS</option><option value="2">STS</option><option value="3">FAN</option><option value="4">STB</option><option value="5">SPL</option><option value="6">REF</option><option value="7">AGG</option><option value="8">PAS</option><option value="9">AUS</option><option value="10">UEB</option><option value="11">ZUV</option></select></td>
				 <td>64</td>
				 <td>Trainerskill zu niedrig!</td>
			 </tr>
		 </table>*/
		
		this.site.extract(this.data);
		
		assertNotNull(this.data.team.spieler[0].training.plan.trainer);
		assertEquals(60, this.data.team.spieler[0].training.plan.trainer.skill);
		assertEquals(OSext.SKILL.SCH, this.data.team.spieler[0].training.plan.skillidx);
		assertEquals(0, this.data.team.spieler[0].training.plan.wahrscheinlichkeit);
	}	

}
