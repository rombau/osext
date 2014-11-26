OSext.TestDocument = function (filename, location) {
	
	this.filename = filename;
	if (this.filename.indexOf("/") < 0) {
		this.filename = "/test/test/fixtures/" + this.filename;
	}

	this.dom = null;
	this.location = location;
};

OSext.TestDocument.prototype = {

	load : function(callbacks) {

		var onStatusReceived = callbacks.add(function(status) {
			assertEquals(200, status);
		});

		var onBodyReceived = callbacks.add(this.setDocument.bind(this));

		var xhr = new XMLHttpRequest();
		xhr.open("GET", this.filename);
		xhr.onreadystatechange = (function() {
			if (xhr.readyState == 2) { // headers and status received
				onStatusReceived(xhr.status);
			} else if (xhr.readyState == 4) { // full body received
				onBodyReceived.call(this, xhr.responseXML);
			}
		}).bind(this);

		xhr.responseType = "document";
		xhr.send(null);
	},
	
	setDocument : function(dom) {
		this.dom = dom;
		this.dom.testLocation = this.location;
	},
	
	getDocument : function() {
		if (this.dom) {
			this.dom.testLocation = this.location;
		}
		return this.dom;
	}
}


