/**
 * Klasse für eine allgemeine Mannschaftsseite.
 * Abgeleitet von {@code OSext.Sites.Showteam}
 * 
 * @constructor
 */
OSext.Sites.St = function (wrappeddoc) {

	OSext.Sites.Showteam.call(this, wrappeddoc);
	
	this.alwaysExtract = true;
};

OSext.Sites.St.prototype = new OSext.Sites.Showteam(); 
OSext.Sites.St.prototype.contructor = OSext.Sites.St; 
