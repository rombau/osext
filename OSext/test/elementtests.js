TestCase("ElementTests").prototype = {

	setUp : function() {

		this.win = {
			ids : [],
			setTimeout : function (delegate, millis) {
				delegate.call(this);
				this.ids[this.ids.length] = true;
				return this.ids.length;
			},
			clearTimeout : function (id) {
				this.ids[id] = false;
			},
		}
	},

	testWrapNoElement : function() {

		try {
			var element = new OSext.WrappedElement();
			fail();
		} catch (e) {
			assertInstanceOf(OSext.IllegalArgumentError, e);
			assertUndefined(element);
		}
	},

	testWrapElement : function() {

		/*:DOC += <div id="testelement">Test</div>*/
		var e = new OSext.WrappedElement(document.getElementById("testelement"));

		assertNotNull(e);
		assertNotNull(e.element);
	},
	
	testElementText : function() {

		/*:DOC += <div id="testelement">Test</div>*/
		var e = new OSext.WrappedElement(document.getElementById("testelement"));
		e.setText("Hugo");
		
		assertEquals("Hugo", e.element.textContent);
	},
	
	testElementHtml : function() {

		/*:DOC += <div id="testelement">Test</div>*/
		var e = new OSext.WrappedElement(document.getElementById("testelement"));
		e.setHtml("Hugo");
		
		assertEquals("Hugo", e.element.innerHTML);

	},
	
	testElementTooltip : function() {

		/*:DOC += <div id="testelement">Test</div>*/
		var e = new OSext.WrappedElement(document.getElementById("testelement"));
		e.setTooltip({"Titel1":"Wert1","Titel2":4711});
		
		assertEquals("{\"Titel1\":\"Wert1\",\"Titel2\":4711}",e.element.firstChild.osexttooltip);
	},
	
	testTooltip : function() {

		/*:DOC += <div id="testelement">Test</div>*/
		/*:DOC += <div id="osext-tooltip"><div id="osext-tooltip-rows"><div><div>xyz</div><div>abc</div></div></div></div>*/
		var e = new OSext.WrappedElement(document.getElementById("testelement")),
			rows = document.getElementById("osext-tooltip-rows"),
			tt = document.getElementById("osext-tooltip");
		
		tt.openPopupAtScreen = function() {};
		
		e.setTooltip({"Titel1":"Wert","Titel2":4711});
		e.showTip({originalTarget:e.element.firstChild}, this.win);
		
		assertEquals(2, rows.childNodes.length);
		assertEquals("Titel1:", rows.childNodes[0].firstChild.getAttribute("value"));
		assertEquals("Wert", rows.childNodes[0].lastChild.getAttribute("value"));
		assertEquals("Titel2:", rows.childNodes[1].firstChild.getAttribute("value"));
		assertEquals(4711, rows.childNodes[1].lastChild.getAttribute("value"));
	},
	
	testEmptyTooltip : function() {

		/*:DOC += <div id="testelement">Test</div>*/
		/*:DOC += <div id="osext-tooltip"><div id="osext-tooltip-rows"><div><div>xyz</div><div>abc</div></div></div></div>*/
		var e = new OSext.WrappedElement(document.getElementById("testelement")),
			rows = document.getElementById("osext-tooltip-rows"),
			tt = document.getElementById("osext-tooltip");
		
		tt.openPopupAtScreen = function() {};
		
		e.setTooltip({});
		e.showTip({originalTarget:e.element.firstChild});
		
		assertEquals(1, rows.childNodes.length); // eine Zeile muss übrig bleiben
		
	}


}
