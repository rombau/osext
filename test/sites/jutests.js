
TestCase("JuTests").prototype = {

	setUp : function() {
		
		this.site = new OSext.Sites.Ju(null);
	},
	
	testSubSiteHandler : function() {

		assertInstanceOf(OSext.Sites.JugendOverview, this.site.getSubSiteHandler());
		assertInstanceOf(OSext.Sites.JugendOverview, this.site.getSubSiteHandler(1));
		assertInstanceOf(OSext.Sites.JugendSkills, this.site.getSubSiteHandler(2));
		assertInstanceOf(OSext.Sites.JugendOptionen, this.site.getSubSiteHandler(3));
	},
	
	testSubSiteParameter : function() {
		
		this.site.getSubSiteHandler = function(param) { 
			return {
				check: function(params) {
					assertEquals(params.page, param);
				}
			};
		};
		this.site.check({page:2});
	},
	
	testInvalidSubSiteParameter : function() {
		
		try {
			this.site.check({xxx:2});
			fail();
		} catch (e) {}
	}
	
}



