TestCase("CommonTests").prototype = {

	testNamspace : function() {
		
		assertNotNull(OSext);
	},
	
	testPrimaerSkill : function() {
		
		assertTrue(OSext.isPrimaerSkill(
				OSext.POS.ABW, OSext.SKILL.ZWK));
		assertFalse(OSext.isPrimaerSkill(
				OSext.POS.ABW, OSext.SKILL.SCH));
		assertFalse(OSext.isPrimaerSkill(
				OSext.POS.ABW, OSext.SKILL.DIS));
	},
	
	testNebenSkill : function() {
		
		assertTrue(OSext.isNebenSkill(
				OSext.POS.MIT, OSext.SKILL.SCH));
		assertFalse(OSext.isNebenSkill(
				OSext.POS.MIT, OSext.SKILL.ZWK));
		assertFalse(OSext.isNebenSkill(
				OSext.POS.MIT, OSext.SKILL.EIN));	
	},
	
	testUnveraenderlicherSkill : function() {
		
		assertTrue(OSext.isUnveraenderlicherSkill(
				OSext.SKILL.WID));
		assertTrue(OSext.isUnveraenderlicherSkill(
				OSext.SKILL.SEL));
		assertTrue(OSext.isUnveraenderlicherSkill(
				OSext.SKILL.DIS));
		assertTrue(OSext.isUnveraenderlicherSkill(
				OSext.SKILL.EIN));
		assertFalse(OSext.isUnveraenderlicherSkill(
				OSext.SKILL.PAS));
		assertFalse(OSext.isUnveraenderlicherSkill(
				OSext.SKILL.SCH));	
	},
	
	testGetListElement : function() {
		
		var liste = [{id:4711,name:"test"}];
		var element = OSext.getListElement(liste, "name", "test");
		
		assertNotNull(element);
		assertEquals(4711, element.id);
	},
	
	testGetUnknownListElement : function() {
		
		var liste = [{id:4711,name:"test"}];
		var element = OSext.getListElement(liste, "id", "unknown");

		assertNull(element);
	},
	
	testGetElementFromInvalidList : function() {
		
		var liste = [4711,"test"];
		var element = OSext.getListElement(liste, "name", "test");

		assertNull(element);
	},
		
	testFmtTausend : function() {
		
		assertEquals("4.711",OSext.fmtTausend(4711));
		assertEquals("4.711.666",OSext.fmtTausend(4711666));
		assertEquals("-4.711",OSext.fmtTausend(-4711));
		
		assertEquals("",OSext.fmtTausend("test"));
		
	},
	
	testGetLinkId : function() {

		assertEquals(4711,OSext.getLinkId("javascript:spielerinfo(4711)"));
		assertEquals(4711,OSext.getLinkId("sp.php?s=4711"));
		assertEquals(4711,OSext.getLinkId("sp.php?x=1&s=4711&y=2"));

		assertEquals(4711,OSext.getLinkId("javascript:teaminfo(4711)"));
		assertEquals(4711,OSext.getLinkId("st.php?c=4711"));
		assertEquals(4711,OSext.getLinkId("st.php?x=1&c=4711&y=2"));

		assertEquals(0,OSext.getLinkId(""));
		assertEquals(0,OSext.getLinkId(null));		
	}
	
}




