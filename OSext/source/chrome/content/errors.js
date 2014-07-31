/**
 * Wird geworfen, wenn die Seite geändert wurde.
 * @constructor
 */
OSext.SiteChangeError = function (message) {	
	this.message = message;
};

/**
 * Wird geworfen, wenn keine Anmeldeinformationen zur Verfügung stehen 
 * bzw. die Session abgelaufen ist.
 * @constructor
 */
OSext.AuthenticationError = function (message) {	
	this.message = message;
};

/**
 * Wird geworfen, wenn die OS-Seiten offline sind.
 * @constructor
 */
OSext.OfflineError = function (message) {	
	this.message = message;
};

/**
 * Wird geworfen, wenn ein ungültiges Argument übergeben wurde.
 * @constructor
 */
OSext.IllegalArgumentError = function (message) {	
	this.message = message;
};

/**
 * Wird geworfen, wenn ein beliebiger Fehler aufgetreten ist.
 * Z.B. eine XPCOM-Komponente nicht initialisiert, oder 
 * ein Service nicht aufgerufen werden konnte.
 * @constructor
 */
OSext.Error = function (message) {	
	this.message = message;
};
