
TestCase("OverlayTests").prototype = {
	
	setUp : function() {
		
		OSext.EventHandler.requestqueues = [];
		
		this.wrappeddoc = {
			isOnlineSoccerSite: function() { return true; },
			process: function(data) { 
				if (data.queueCount) {
					data.result+="+";
					return {
						count: data.queueCount,
						index: 0,
						loadNext: function(data) { 
							data.queueCount = null;								
							if (this.index < this.count) {
								this.index++; 
								data.result+=this.index;
								return true;
							}
							data.result+=".";
							return false;
						},
						current: { uri: "X" }
					};
				} else {
					return null;
				}
			},
			location: "X"
		};
		
		this.preferencesMock = {
			getHostname : function() { return "os.ongapo.com"; },
			isActive : function() { return true; }
		};
		
		this.errorViewerMock = { 
			showError: function (msg) { fail(msg); },
			showPanel: function () {},
			hidePanel: function () {}
		};
		
		this.dataMock = {
			queueCount: null,
			result: ""
		};
	},

	testEventHandler : function() {
		
		assertNotNull(OSext.EventHandler);
		assertNotNull(OSext.AppData);
		assertNotNull(OSext.AppData.team);
		assertFalse(OSext.AppData.initialized);
	},
	
	testEmptyQueue : function() {

		assertEquals(0, OSext.EventHandler.requestqueues.length);

		OSext.EventHandler.processDocument(this.wrappeddoc, 
				this.dataMock, this.preferencesMock, this.errorViewerMock);
		assertEquals(0, OSext.EventHandler.requestqueues.length);
	},
	
	testSimpleQueue : function() {
		
		this.dataMock.queueCount = 2;
		
		OSext.EventHandler.processDocument(this.wrappeddoc, 
				this.dataMock, this.preferencesMock, this.errorViewerMock);
		assertEquals(1, OSext.EventHandler.requestqueues[0].index);
		OSext.EventHandler.processDocument(this.wrappeddoc, 
				this.dataMock, this.preferencesMock, this.errorViewerMock);		
		assertEquals(2, OSext.EventHandler.requestqueues[0].index);
		OSext.EventHandler.processDocument(this.wrappeddoc, 
				this.dataMock, this.preferencesMock, this.errorViewerMock);
		assertEquals(0, OSext.EventHandler.requestqueues.length);
		assertEquals("+12.", this.dataMock.result);
		
	},
	
	testMultiQueue : function() {
		
		this.dataMock.queueCount = 4;
		
		OSext.EventHandler.processDocument(this.wrappeddoc, 
				this.dataMock, this.preferencesMock, this.errorViewerMock);
		assertEquals(1, OSext.EventHandler.requestqueues[0].index);
		OSext.EventHandler.processDocument(this.wrappeddoc, 
				this.dataMock, this.preferencesMock, this.errorViewerMock);
		assertEquals(2, OSext.EventHandler.requestqueues[0].index);
		
		this.dataMock.queueCount = 2;
		
		OSext.EventHandler.processDocument(this.wrappeddoc, 
				this.dataMock, this.preferencesMock, this.errorViewerMock);
		assertEquals(1, OSext.EventHandler.requestqueues[1].index);
		OSext.EventHandler.processDocument(this.wrappeddoc, 
				this.dataMock, this.preferencesMock, this.errorViewerMock);
		assertEquals(2, OSext.EventHandler.requestqueues[1].index);
		OSext.EventHandler.processDocument(this.wrappeddoc, 
				this.dataMock, this.preferencesMock, this.errorViewerMock);
		
		// die nächste Seite (3) der vorhergehenden Queue muss automatisch geladen werden!
		
		OSext.EventHandler.processDocument(this.wrappeddoc, 
				this.dataMock, this.preferencesMock, this.errorViewerMock);		
		assertEquals(4, OSext.EventHandler.requestqueues[0].index);
		OSext.EventHandler.processDocument(this.wrappeddoc, 
				this.dataMock, this.preferencesMock, this.errorViewerMock);
		
		assertEquals("+12+12.34.",this.dataMock.result);

	}

}




