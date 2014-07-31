/**
 * Klasse für die Sqlite-Abstraktion.
 * @constructor
 */
OSext.Sqlite = function (preferences) {
	
	this.preferences = preferences || new OSext.Preferences();
	
	this.connection = null;
};

OSext.Sqlite.prototype = {

	openConnection : function () {

		var file,
		    storage = Components.classes["@mozilla.org/storage/service;1"]
				.getService(Components.interfaces.mozIStorageService);
		
		file = OSext.getFileFromPath(this.preferences.getDBPath());
		if (!file) {
			file = OSext.getNewFile("os.sqlite", "In welchem Ordner sollen Deine OS-Daten gespeichert werden?");
			if (!file) {
				throw new OSext.Error("Es wurde keine Datenbank ausgewählt.");
			}
		}
		
		try {
			this.connection = storage.openDatabase(file);
		} catch (e) {
			throw new OSext.Error("Die Datenbank konnte nicht geöffnet.\n\n" + e);
		}
		
		if (this.connection) {
			this.preferences.setDBPath(file.path);
			this.updateSchema();
			return true;
		} else {
			return false;
		}
	},

	closeConnection : function () {

		this.connection = null;
	},

	updateSchema : function () {

		OSext.Log.info("Datebank wird aktualisiert ...");
		try {
			this.connection.executeSimpleSQL(OSext.getFileContent("chrome://osext/content/resource/os.sql"));
	        for (var attr in this) {
	        	if (attr.length > 12 && attr.substr(0, 12) == "updateSchema" && typeof this[attr] == "function") {
	        		OSext.Log.info(attr);
        			this[attr]();
	        	}
	        }
		} catch (e) {
			throw new OSext.Error("Die Datenbank konnte nicht aktualisiert werden!\n\n" + e);
		}
	},
	
	updateSchema_0_8_0 : function () {
		
		try {
			this.connection.executeSimpleSQL("ALTER TABLE Spieler ADD COLUMN BlitzKz INTEGER NOT NULL DEFAULT 0;");
		} catch (e) {
			OSext.Log.warn(e);
		}
	},

	updateSchema_0_8_4 : function () {

		try {
			this.connection.executeSimpleSQL("ALTER TABLE Spieltage ADD COLUMN Siegpraemie INTEGER;");
		} catch (e) {
			OSext.Log.warn(e);
		}
	},

	updateSchema_1_0_0 : function () {
		
		try {
			this.connection.executeSimpleSQL("DROP TABLE SaisonZat;");
			this.connection.executeSimpleSQL("DROP TABLE Spielerauswertungen;");
		} catch (e) {
			OSext.Log.warn(e);
		}
	},
	
	updateSchema_1_2_2 : function () {
		
		// Trainings bei verletzten Spielern löschen
		try {
			this.connection.executeSimpleSQL("DELETE FROM Spielertraining " +
					"WHERE (Id * 10000 + Saison * 72 + Zat) IN " +
					"( SELECT ST.Id * 10000 + ST.Saison * 72 + ST.Zat " +
					"  FROM Spielertraining ST, Spielerwerte SW " +
					"  WHERE ST.Id = SW.Id " +
					"    AND SW.Verletzung IS NOT NULL " +
					"    AND (ST.Saison * 72 + ST.Zat) = (SW.Saison * 72 + SW.Zat + 1) );");
		} catch (e) {
			OSext.Log.warn(e);
		}
	},

	updateSchema_1_3_0 : function () {
		
		var result, r;
		
		// Rekonstruktion der Spielerwerte (4/72)
		try {
			this.beginTransaction();
			result = this.executeSql("SELECT S.Id AS SpielerID, SW.* " + 
					"FROM Spieler S LEFT OUTER JOIN Spielerwerte SW ON S.Id = SW.Id AND SW.Saison = 5 AND SW.Zat = 1");
			if (result && result.length > 0) {
				for (r = 0; r < result.length; r++) {
					if (result[r].Id) {
						this.executeSql(
							"REPLACE INTO Spielerwerte VALUES " +
							"(:id, :saison, :zat, :alter, :auf, :moral, :fit, " +
							" :ss, :opti, :sonderskills, :sp, :verl, " +
							" :status, :tstatus, :tsperre, " +
							" :vertrag, :gehalt, :marktwert, " +
							" :sch, :bak, :kob, :zwk, :dec, :ges, :fuq, :erf, :agg, " +
							" :pas, :aus, :ueb, :wid, :sel, :dis, :zuv, :ein );",
							[ result[r].Id, 4, 72, result[r].Alter, result[r].Aufstellung, result[r].Moral, result[r].Fitness, 
							  result[r].Skillschnitt, result[r].Opti, result[r].Sonderskills, result[r].Sperre, result[r].Verletzung, 
							  result[r].Status, result[r].TStatus, result[r].TSperre && result[r].TSperre > 0 ? result[r].TSperre + 1 : null, 
							  result[r].Vertrag, result[r].Gehalt, result[r].Marktwert,
							  result[r].SCH, result[r].BAK, result[r].KOB, result[r].ZWK, result[r].DEC, result[r].GES, result[r].FUQ, result[r].ERF, result[r].AGG, 
							  result[r].PAS, result[r].AUS, result[r].UEB, result[r].WID, result[r].SEL, result[r].DIS, result[r].ZUV, result[r].EIN ]);
					} else {
						this.connection.executeSimpleSQL("DELETE FROM Spielerwerte " +
								"WHERE Id = " + result[r].SpielerID + " AND Saison = 4 AND Zat = 72;");
					}
				}
			}
			this.commitTransaction();
		} catch (e) {
			this.rollbackTransaction();
			OSext.Log.warn(e);
		}
	},

	updateSchema_1_3_6 : function () {
		
		// Trainings bei verletzten Spielern löschen
		try {
			this.connection.executeSimpleSQL("DELETE FROM Spielertraining WHERE Id = 0;");
			this.connection.executeSimpleSQL("DELETE FROM Spielerwerte WHERE Id = 0;");
			this.connection.executeSimpleSQL("DELETE FROM Spieler WHERE Id = 0;");
		} catch (e) {
			OSext.Log.warn(e);
		}
	},
	
	beginTransaction : function () {
		
		if (this.connection || this.openConnection()) {
			this.connection.executeSimpleSQL("BEGIN;");
		}
	},

	commitTransaction : function () {

		if (this.connection || this.openConnection()) {
			this.connection.executeSimpleSQL("COMMIT;");
		}
	},

	rollbackTransaction : function () {

		if (this.connection || this.openConnection()) {
			this.connection.executeSimpleSQL("ROLLBACK;");
		}
	},

	/**
	 * Führt ein parameterisierbares SQL-Statement aus und gibt ein ResultSet zurück.
	 * <p>
	 * Die Parameter im Statement werden mit {@code :<Parametername>} angegeben. Die
	 * übergebenen Werte aus {@code paramlist} werden in der Reihenfolge der Parameter
	 * im Statement zugeordnet.
	 * <p>
	 * Das Ergebnis ist eine Liste von Row-Objekten. Jedes dieser Objekte enthält 
	 * ein Attribut pro Spalte, in dem der Spaltenwert abgelegt ist. 
	 * 
	 * @param {String} sql Statement mit (optionalen) Platzhaltern
	 * @param {Array} paramlist Liste mit Parameterwerten
	 * @return Liste mit Row-Objekten
	 */
	executeSql : function (sql, paramlist) {

		var sqltext = sql, result = [], statement, p, pname, row, col, colname;

		if (this.connection || this.openConnection()) {

			statement = this.connection.createStatement(sql);

			if (paramlist) {
				for (p = 0; p < paramlist.length; p++) {
					pname = statement.getParameterName(p);
					sqltext = sqltext.replace(pname, JSON.stringify(paramlist[p]));
					if (pname.substr(0, 1) == ":") {
						pname = pname.substr(1);
					}
					statement.params[pname] = paramlist[p];
				}
			}
			OSext.Log.debug(["Query [", statement.state, "]: ", sqltext]);
			try {
				while (statement.step()) {
					row = {};
					for (col = 0; col < statement.columnCount; col++) {
						colname = statement.getColumnName(col);
						row[colname] = statement.row[colname];
					} 
					result[result.length] = row;
				}
			} catch (e) {
				throw new OSext.Error("Fehler beim Datenbankzugriff." +
					"\n\nAnweisung: " + sqltext + "\n\nFehler: " + this.connection.lastErrorString);
			}	
			finally {
				if (result && result.length > 0) {
					OSext.Log.debug(JSON.stringify(result));
				}
				statement.reset();
			}
		}
		return result;
	}
	
};
