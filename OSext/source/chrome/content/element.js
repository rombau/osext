/**
 * Wrapper-Klasse für ein {@code HTMLElement}, 
 * welches dem Konstruktor übergeben werden muss, und optional geklont werden kann.
 * 
 * @constructor
 * 
 * @throws
 * {@link OSext.IllegalArgumentError} wenn kein {@code HTMLElement} übergeben wurde.
 */
OSext.WrappedElement = function (element, clone) {

	if (!element || (clone && !element.cloneNode)) {
		throw new OSext.IllegalArgumentError("Ungültiges Element übergeben.");
	}
	
	/** 
	 * Zugrundeliegendes HTMLElement
	 */
	this.element = clone ? element.cloneNode(true) : element;
	
	/**
	 * Timeout-ID des Element-Tooltips
	 */
	this.timeout = null;
};

OSext.WrappedElement.prototype = {
	
	/**
	 * Setzt den Text-Inhalt des Elements
	 */
	setText : function (text) {
		
		this.element.innerHTML = text;
	},
	
	/**
	 * Setzt den HTML-Inhalt des Elements
	 */
	setHtml : function (html) {
		
		this.element.innerHTML = html;
	},
	
	/**
	 * Setzt einen komplexen Tooltip (JSON) und initialisiert
	 * die entsprechenden Mouse-Handler
	 * 
	 * @param data JSON-Object (Named-Array)
	 */
	setTooltip : function (data) {
	
		var node = this.element;
		
		node.innerHTML = "<abbr title=\"\">" + node.innerHTML + "</abbr>";
		
		if (node.firstChild) {
			node = node.firstChild;
		}
		
		node.osexttooltip = JSON.stringify(data);
	
		node.addEventListener("mouseover", this.showTip, false);
		node.addEventListener("mouseout", this.hideTip, false);
	},
	
	/**
	 * Zeigt einen Hinweis auf Basis der Daten (JSON) im Element-Attribut
	 * {@code osexttooltip} an.
	 */
	showTip : function (event, timeoutFactory) {

		var element = event.originalTarget,
			data, info,
			tooltip = document.getElementById("osext-tooltip"),
			tooltiprows = document.getElementById("osext-tooltip-rows"),
			newrow, clonerow = tooltiprows.firstChild.cloneNode(true);

		timeoutFactory = timeoutFactory || window;
		
		if (element.osexttooltip) {
			
			OSext.timeout = timeoutFactory.setTimeout(function () {  

				if (OSext.timeout == element.timeout) {

					while (tooltiprows.childNodes.length > 0) {
						tooltiprows.removeChild(tooltiprows.lastChild);
					}

					data = JSON.parse(element.osexttooltip);
					for (info in data) {
						if (data.hasOwnProperty(info)) {
							newrow = clonerow.cloneNode(true);
							newrow.firstChild.setAttribute("value", info + (info.substring(info.length - 1) != ":" ? ":" : ""));
							newrow.lastChild.setAttribute("value", data[info]);
							tooltiprows.appendChild(newrow);
						}
					}
					
					if (tooltiprows.childNodes.length > 0) {
						tooltip.openPopupAtScreen(event.screenX, event.screenY);
					} else {
						tooltiprows.appendChild(clonerow);
					}
					
					OSext.timeout = null;  
				}
				
				timeoutFactory.clearTimeout(element.timeout);
				element.timeout = null;
				
			}, 500);

			element.timeout = OSext.timeout;
		}
	},
	
	/**
	 * Schließt den Tooltip.
	 */
	hideTip : function (event) {
		
		var element = event.originalTarget,
			tooltip = document.getElementById("osext-tooltip");
		
		if (OSext.timeout == element.timeout) {
			OSext.timeout = null;  
		}
		
		tooltip.hidePopup();
	},
	
	/**
	 * Fügt ein Element als Kindknoten ein.
	 * @param child
	 */
	appendChild : function (child) {
		if (child) {
			if (child instanceof OSext.WrappedElement) {
				this.element.appendChild(child.element);
			} else {
				this.element.appendChild(child);
			}
		}
	},
	
	/**
	 * Fügt ein Attribut hinzu.
	 * @param attr
	 * @param value
	 */
	setAttribute : function (attr, value) {
		
		this.element.setAttribute(attr, value);
	}
};