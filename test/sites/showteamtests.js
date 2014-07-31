
TestCase("ShowteamTests").prototype = {

	setUp : function() {
		
		this.site = new OSext.Sites.Showteam(null);
	},
	
	testSubSiteHandler : function() {

		assertInstanceOf(OSext.Sites.ShowteamOverview, this.site.getSubSiteHandler());
		assertInstanceOf(OSext.Sites.ShowteamOverview, this.site.getSubSiteHandler(0));
		assertInstanceOf(OSext.Sites.ShowteamContracts, this.site.getSubSiteHandler(1));
		assertInstanceOf(OSext.Sites.ShowteamSkills, this.site.getSubSiteHandler(2));
		assertInstanceOf(OSext.Sites.ShowteamStats, this.site.getSubSiteHandler(3));
		assertInstanceOf(OSext.Sites.ShowteamStats, this.site.getSubSiteHandler(4));
		assertInstanceOf(OSext.Sites.ShowteamInfo, this.site.getSubSiteHandler(5));
		assertInstanceOf(OSext.Sites.ShowteamSaison, this.site.getSubSiteHandler(6));
	},
	
	testSubSiteParameter : function() {
		
		this.site.getSubSiteHandler = function(param) { 
			return {
				check: function(params) {
					assertEquals(params.s, param);
				}
			};
		};
		this.site.check({s:2});
	},
	
	testInvalidSubSiteParameter : function() {
		
		try {
			this.site.check({xxx:2});
			fail();
		} catch (e) {}
	}
	
}



