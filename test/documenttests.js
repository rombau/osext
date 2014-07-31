TestCase("DocumentTests").prototype = {

	setUp : function() {
		
		this.data = new OSext.Data();
	},

	testWrapNoDocument : function() {

		try {
			var d = new OSext.WrappedDocument();
			fail();
		} catch (e) {
			assertInstanceOf(OSext.IllegalArgumentError, e);
			assertUndefined(d);
		}
	},

	testWrapDocument : function() {

		document.testLocation = "http://os.ongapo.com/file.html";

		var d = new OSext.WrappedDocument(document);

		assertNotNull(d);
		assertNotNull(d.doc);
		assertEquals("http://os.ongapo.com/", d.path);
		assertEquals("file", d.file);
		assertEquals("html", d.extension);
	},

	testWrapWelcomeDocument : function() {

		document.testLocation = "http://os.ongapo.com/";

		var d = new OSext.WrappedDocument(document);

		assertNotNull(d);
		assertNotNull(d.doc);
		assertEquals("http://os.ongapo.com/", d.path);
	},

	testWrapReportDocument : function() {

		document.testLocation = "http://os.ongapo.com/rep/saison/4/33/19-17.html";

		var d = new OSext.WrappedDocument(document);

		assertNotNull(d);
		assertNotNull(d.doc);
		assertEquals("http://os.ongapo.com/rep/saison/4/33/", d.path);
		assertEquals("19-17", d.file);
		assertEquals("html", d.extension);
	},

	testWrapDocumentWithParameters : function() {

		document.testLocation = "http://os.ongapo.com/showteam.php?s=2&test=true";

		var d = new OSext.WrappedDocument(document);

		assertArray(d.parameters);
		assertEquals("2",d.parameters["s"]);
		assertEquals("true",d.parameters["test"]);
	},
	
	testWrapDocumentWithParametersLocal : function() {

		document.testLocation = "file://my/test/showteam.php?s=2&test=true.html";

		var d = new OSext.WrappedDocument(document);

		assertArray(d.parameters);
		assertEquals("2",d.parameters["s"]);
		assertEquals("true",d.parameters["test"]);
	},

	testIsOnlineSoccer : function() {

		document.testLocation = "http://os.ongapo.com/haupt.php";

		var d = new OSext.WrappedDocument(document);

		assertTrue(d.isOnlineSoccerSite("http://os.ongapo.com"));
		assertTrue(d.isOnlineSoccerSite("os.ongapo.com"));
		assertFalse(d.isOnlineSoccerSite(""));
	},

	testIsOnlineSoccerLocal : function() {

		document.testLocation = "file://my/test/haupt.php.html";

		var d = new OSext.WrappedDocument(document);

		assertTrue(d.isOnlineSoccerSite("http://os.ongapo.com"));
		assertTrue(d.isOnlineSoccerSite("os.ongapo.com"));
		assertTrue(d.isOnlineSoccerSite(""));
	},

	testCreateSiteHandler : function() {

		document.testLocation = "file://my/test/haupt.php.html";

		var d = new OSext.WrappedDocument(document);

		var siteobj = d.createSiteHandlerByName(d.file.split(".")[0]);

		assertNotNull(siteobj);
		assertInstanceOf(OSext.Sites.Haupt, siteobj)
	},

	testCreateSiteHandlerWithNamespace : function() {

		var siteobj = OSext.WrappedDocument.prototype
				.createSiteHandlerByName("OSext.Sites.Haupt");

		assertNotNull(siteobj);
		assertInstanceOf(OSext.Sites.Haupt, siteobj);
	},

	testCreateUnknownSiteHandler : function() {

		document.testLocation = "file://my/test/xxxx.php.html";

		var d = new OSext.WrappedDocument(document);

		var siteobj = d.createSiteHandlerByName(d.file.split(".")[0]);

		assertNotNull(siteobj);
		assertInstanceOf(Object, siteobj);
		assertUndefined(siteobj.extract);
	},
	

	testGetSiteHandler : function() {

		document.testLocation = "file://my/test/haupt.php";

		var d = new OSext.WrappedDocument(document);

		var siteobj = d.getSiteHandler();

		assertNotNull(siteobj);
		assertInstanceOf(OSext.Sites.Haupt, siteobj);
	},

	testGetReportSiteHandler : function() {

		document.testLocation = "http://os.ongapo.com/rep/saison/4/33/19-17.html";

		var d = new OSext.WrappedDocument(document);

		var siteobj = d.getSiteHandler();

		assertNotNull(siteobj);
		assertInstanceOf(OSext.Sites.Report, siteobj);
	},
	
	testIsCalculationRunning : function() {
		
		/*:DOC += <div>F_r die Dauer von ZAT __ sind die Seiten von OS 2.0 gesperrt!<br>
		  	<a href="">Zum Forum</a><br>
			<a href="">Zum Chat</a></div>*/
		document.testLocation = "file://my/test/haupt.php.html";
		
		var d = new OSext.WrappedDocument(document);
		
		try {
			d.checkCalculationRunning();
			fail();
		} catch (e) {
			assertInstanceOf(OSext.OfflineError, e);
		}
		
	},
	
	testNoCalculationRunning : function() {
		
		/*:DOC += <div/>*/
		document.testLocation = "file://my/test/haupt.php.html";
		
		var d = new OSext.WrappedDocument(document);

		d.checkCalculationRunning();
	
	},
	
	testRemoveTopThema : function() {

		/*:DOC += <div>
		 			<p class="noprint" id="TopThema"><a href="http://os.ongapo.com/shop/prestashop"><img src="images/banner/stift.gif" /></a></p>
		 		  </div> */
		
		document.testLocation = "file://my/test/haupt.php.html";
		var d = new OSext.WrappedDocument(document);

		d.removeTopThema();

		assertFalse(d.doc.getElementById("TopThema").hasChildNodes());
	}
}
