
TestCase("RequestQueueTests").prototype = {
	
	setUp : function() {
	
		this.wrappeddoc = {
			path: "http://os.ongapo.com/"
		};
		
		this.sitehandlerMock = {
			postProcessing : function(doc,data) { this.doc = doc; },
			doc : null
		}
		
		this.postdatafactoryMock = {
				getPostData : function() { return {}; }	
		};

		this.iframeMock = { 
				webNavigation : { 
					loadURI : function(uri,nsi,null1,postdata,null2) {
						this.uri = uri;
						this.postdata = postdata;
					},
					uri : null,
					postdata : null
				} 
		};

		this.queue = new OSext.RequestQueue(
				this.wrappeddoc,
				this.sitehandlerMock,
				this.sitehandlerMock.postProcessing,
				this.postdatafactoryMock,
				false,
				this.iframeMock);
	},
	
	testAddSites : function() {

		this.queue.addSite("xyz", {s:6}, true, false);
		this.queue.addSite("abc", null, false, false);
		
		assertEquals(2,this.queue.sitequeue.length);
		
		assertEquals("http://os.ongapo.com/xyz.php",this.queue.sitequeue[0].uri);
		assertEquals(6,this.queue.sitequeue[0].params.s);
		assertEquals(false,this.queue.sitequeue[0].post);

		assertEquals("http://os.ongapo.com/abc.html",this.queue.sitequeue[1].uri);
		assertNull(this.queue.sitequeue[1].params);
		assertEquals(false,this.queue.sitequeue[1].post);
	},
	
	testLoadNextGet : function() {

		this.queue.addSite("xyz", {s1:6,s2:7}, true, false);
		this.queue.loadNext();
		
		assertEquals(0,this.queue.sitequeue.length);
		assertEquals("http://os.ongapo.com/xyz.php?s1=6&s2=7", this.queue.current.uri);
		assertEquals("http://os.ongapo.com/xyz.php?s1=6&s2=7", this.iframeMock.webNavigation.uri);
		assertNull(this.iframeMock.webNavigation.postdata);
	},
	
	testLoadNextPost : function() {

		this.queue.addSite("xyz", null, true, {s1:6,s2:7});
		this.queue.addSite("abc", null, false, false);
		this.queue.loadNext();
		
		assertEquals(1,this.queue.sitequeue.length);
		assertEquals("http://os.ongapo.com/xyz.php", this.queue.current.uri);
		assertEquals("http://os.ongapo.com/xyz.php", this.iframeMock.webNavigation.uri);
		assertNotNull(this.iframeMock.webNavigation.postdata);
		
	},
	
	testPostProcessing : function() {

		this.queue.addSite("xyz", {s1:6,s2:7}, true, false);
		this.queue.loadNext();
		this.queue.loadNext();
		
		assertNotNull(this.sitehandlerMock.doc);
	}
}



