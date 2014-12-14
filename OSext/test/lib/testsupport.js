function FixtureTestCase(id, fixture, tests) {
	
	var asyncTest = AsyncTestCase(id),
		htmldoc;

	for (testname in tests) {
		if (testname.startsWith("test")) {
			asyncTest.prototype[testname] = tests[testname].bind(tests, htmldoc);
		}
	}

	asyncTest.prototype.setUp = function(queue) {
		
		if (htmldoc && htmldoc.testLocation == fixture) {
			return;
		}

		queue.call("Load", function(callbacks) {

			jstestdriver.console.log("Load start " + Date.now());
				
			var onStatusReceived = callbacks.add(function(status) {
				jstestdriver.console.log("Load end " + Date.now());
				assertEquals(200, status);
			});

			var onBodyReceived = callbacks.add(function(responseXML) {
				htmldoc = responseXML;
				htmldoc.testLocation = fixture;
			});
			
			jstestdriver.console.log("GET " + fixture);
			var xhr = new XMLHttpRequest();
			xhr.open("GET", fixture);
			xhr.onreadystatechange = (function() {
				if (xhr.readyState == 2) { // headers and status received
					onStatusReceived(xhr.status);
				} else if (xhr.readyState == 4) { // full body received
					onBodyReceived(xhr.responseXML);
				}
			});

			xhr.responseType = "document";
			xhr.send(null);
		});
		
		queue.call("SetUp", function(callbacks) {
			if (typeof tests.setUp == 'function') {
				tests.setUp(htmldoc);
			}
		});
	}
	
	return asyncTest;
}
