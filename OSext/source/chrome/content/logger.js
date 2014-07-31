/**
 * Logger-Klasse für Firebug.
 * @constructor
 */
OSext.Logger = function (preferences) {	
	
	this.LEVEL = {
		DEBUG : 4,
		INFO : 3,
		WARN : 2,
		ERROR : 1
	};
	
	this.loglevel = preferences ? preferences.getLogLevel() : 0;
};

OSext.Logger.prototype = {
		
	getConsole : function () {
		var fbug = window.Firebug || null;
		if (fbug !== null && fbug.Console) {
			return fbug.Console;
		}
		return { logFormatted : function () {} };
	},
	
	log : function (object, classname) {
		var caller = Components.stack.caller.caller || {};
		if (!(object instanceof Array)) {
			object = [object];
		}
		this.getConsole().logFormatted(object, null, classname, true, {
			href : caller.filename, 
			line : caller.lineNumber
		});
	},
	
	debug : function (object) {
		if (this.loglevel == this.LEVEL.DEBUG) {
			this.log(object, "debug");
		}
	},

	info : function (object) {
		if (this.loglevel >= this.LEVEL.INFO) {
			this.log(object, "info");
		}
	},

	warn : function (object) {
		if (this.loglevel >= this.LEVEL.WARN) {
			this.log(object, "warn");
		}
	},

	error : function (object) {
		if (this.loglevel >= this.LEVEL.ERROR) {
			this.log(object, "error");
		}
	}
};

OSext.Log = new OSext.Logger(OSext.Prefs);

