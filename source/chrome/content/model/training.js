/**
 * Klasse für die Trainingsdaten eines Spielers
 * @constructor
 */
OSext.Training = function (spieler) {

	this.spieler = spieler;

	/** 
	 * Referenz auf aktuellen {@link OSext.Trainer}.
	 */
	this.trainer = null;
	this.trainernr = null;

	/** 
	 * Trainingswerte
	 */
	this.skillidx = null;
	this.wahrscheinlichkeit = null;
	this.faktor = 1; 
	this.aufwertung = null;
	
};

