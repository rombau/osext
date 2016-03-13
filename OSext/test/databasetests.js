TestCase("DatabaseTests").prototype = {

	setUp : function() {
		
		this.sqliteMock = {
			setReturn : function(arr) {
				this.executeSql = function(sql,params) {
					return arr;
				}
			},
			setMultiReturn : function(mutliarr) {
				this.executecount = 0;
				this.executeSql = function(sql,params) {
					return mutliarr[this.executecount++];
				}
			},
			
		};
		
		this.database = new OSext.Database(null, this.sqliteMock);
		
	},
	
	testIsNotEmpty : function() {
		
		assertTrue(this.database.isNotEmpty([1]));
		assertFalse(this.database.isNotEmpty([]));
	},
	
	testGetMinTermin : function() {

		this.sqliteMock.setReturn([{Saison:1,Zat:1}]);
		
		var mintermin = this.database.getMinTermin();
		
		assertInstanceOf(OSext.Termin, mintermin);
		assertEquals(1, mintermin.saison);
		assertEquals(1, mintermin.zat);
	},

	testGetMinTerminNotFound : function() {

		this.sqliteMock.setReturn([]);
		
		var mintermin = this.database.getMinTermin();
		
		assertNull(mintermin);
	},
	
	testGetMaxTermin : function() {

		this.sqliteMock.setReturn([{Saison:1,Zat:1}]);
		
		var maxtermin = this.database.getMinTermin();
		
		assertInstanceOf(OSext.Termin, maxtermin);
		assertEquals(1, maxtermin.saison);
		assertEquals(1, maxtermin.zat);
	},

	testGetMaxTerminNotFound : function() {

		this.sqliteMock.setReturn([]);
		
		var maxtermin = this.database.getMinTermin();
		
		assertNull(maxtermin);
	},

	testGetSpieltage : function() {

		this.sqliteMock.setReturn([{"Saison":2,"Zat":6,"Datum":"24.11.2009","Spielart":"Friendly","ort":"Ausw","Gegner":"Real Alicante","Gegnerid":0,"Zuseher":null,
			"Eintritt":null,"Stadioneinnahmen":250000,"Stadionkosten":0,"Punktpraemie":0,"Torpraemie":0,"Tvgelder":0,"Fanartikel":0,"Grundpraemie":290400,
			"Spielergehaelter":-2148452,"Trainergehaelter":-467122,"Jugend":-200000,"Physio":-10000,"Summe":-1903533,"Saldo":6651756,"Leihen":371641,"Siegpraemie":200000}]);

		var result = this.database.getSpieltage(2);

		assertNotNull(result);
		assertInstanceOf(Array, result);
		assertEquals(1, result.length);
		assertInstanceOf(OSext.Spieltag, result[0]);
		assertInstanceOf(OSext.Termin, result[0].termin);
		assertEquals(2, result[0].termin.saison);
		assertEquals(6, result[0].termin.zat);
		assertNull(result[0].team);
		assertInstanceOf(OSext.Team, result[0].gegner);
		assertEquals(0, result[0].gegner.id);
		assertEquals("Real Alicante", result[0].gegner.name);
		assertNull(result[0].stadion);
		assertEquals("24.11.2009", result[0].datum);
		assertEquals("Friendly", result[0].spielart);
		assertEquals("Ausw", result[0].ort);
		assertNull(result[0].zuseher);
		assertNull(result[0].eintritt);
		assertEquals(250000, result[0].stadioneinnahmen);
		assertEquals(0, result[0].stadionkosten);
		assertEquals(200000, result[0].siegpraemie);
		assertEquals(0, result[0].punktpraemie);
		assertEquals(0, result[0].torpraemie);
		assertEquals(0, result[0].tvgelder);
		assertEquals(0, result[0].fanartikel);
		assertEquals(290400, result[0].grundpraemie);
		assertEquals(-2148452, result[0].spielergehaelter);
		assertEquals(-467122, result[0].trainergehaelter);
		assertEquals(-200000, result[0].jugend);
		assertEquals(-10000, result[0].physio);
		assertEquals(-1903533, result[0].summe);
		assertEquals(6651756, result[0].saldo);
		assertEquals(371641, result[0].leihen);
	},

	testGetSpieltageNotFound : function() {

		this.sqliteMock.setReturn([]);

		var result = this.database.getSpieltage(2);
		
		assertNotNull(result);
		assertInstanceOf(Array, result);
		assertEquals(0, result.length);
	},
	
	testGetKaderspieler : function() {

		this.sqliteMock.setMultiReturn([[{"Id":55287,"Position":"DMI","Name":"Thomas Mooney","Land":"IRL","Uefa":"","Herkunft":0,"BlitzKz":0,
				"Saison":4,"Zat":4,"Alter":21,"Aufstellung":"DMI","Moral":99,"Fitness":43,"Skillschnitt":58,"Opti":83.04,"Sonderskills":"LS",
				"Sperre":"1L","Verletzung":2,"Status":1,"TStatus":"L","TSperre":23,"Vertrag":47,"Gehalt":371181,"Marktwert":29038132,
				"SCH":31,"BAK":76,"KOB":52,"ZWK":75,"DEC":78,"GES":48,"FUQ":44,"ERF":22,"AGG":36,"PAS":80,"AUS":50,"UEB":80,"WID":83,"SEL":67,"DIS":77,"ZUV":39,"EIN":48,
				"Skill":15,"Wert":38,"Trainer":2,"TSkill":99,"TPreis":3781,"Wahrscheinlichkeit":99,"Faktor":1,"Aufwertung":1}],
			[{"Id":55287,"Herkunft":0,"BlitzKz":0,"MinZat":141,"MaxZat":292,"Gehaltsschnitt":371684,
				"Aufwertungen":79,"Trainingszats":149,"Trainingskosten":580685,"Wahrscheinlichkeit":57.77997986577183}],
			[{"Marktwert":9871131},{"Marktwert":29038132},{"Marktwert":29038132}]]);
		
		var result = this.database.getKaderspielerListe(new OSext.Termin(4, 4));

		assertNotNull(result);
		assertInstanceOf(Array, result);
		assertEquals(1, result.length);
		assertInstanceOf(OSext.Kaderspieler, result[0]);
		assertInstanceOf(OSext.Training, result[0].training.aktuell);
		assertEquals(55287, result[0].id);
		assertEquals("Thomas Mooney", result[0].name);
		assertEquals("DMI", result[0].pos);
		assertEquals("IRL", result[0].land);
		assertNull(result[0].uefa);
		assertEquals(21, result[0].alter);
		assertEquals(83.04, result[0].opti);
		assertEquals(58, result[0].skillschnitt);
		assertEquals("[{\"kurz\":\"L\",\"lang\":\"Libero\"},{\"kurz\":\"S\",\"lang\":\"Spielmacher\"}]", JSON.stringify(result[0].sonderskills));
		assertEquals(29038132, result[0].mw);
		assertEquals("[31,76,52,75,78,48,44,22,36,80,50,80,83,67,77,39,48]", JSON.stringify(result[0].skills));
		assertEquals(0, result[0].herkunft);
		assertEquals(0, result[0].blitzzat);
		assertEquals("DMI", result[0].aufstellung);
		assertEquals(99, result[0].moral);
		assertEquals(43, result[0].fitness);
		assertEquals(2, result[0].verletzung);
		assertEquals(1, result[0].status);
		assertEquals("L", result[0].tstatus);
		assertEquals(23, result[0].tsperre);
		assertEquals(47, result[0].vertrag);
		assertEquals(371181, result[0].gehalt);
		assertEquals("[{\"art\":\"Liga\",\"dauer\":\"1\"}]", JSON.stringify(result[0].sperren));
		assertEquals(result[0].id, result[0].training.aktuell.spieler.id);
		assertInstanceOf(OSext.Trainer, result[0].training.aktuell.trainer);
		assertEquals(99, result[0].training.aktuell.trainer.skill);
		assertEquals(2, result[0].training.aktuell.trainernr);
		assertEquals(15, result[0].training.aktuell.skillidx);
		assertEquals(99, result[0].training.aktuell.wahrscheinlichkeit);
		assertEquals(1, result[0].training.aktuell.faktor);
		assertEquals(1, result[0].training.aktuell.aufwertung);
		
		assertEquals(151, result[0].kaderzats);
		assertEquals(19167001, result[0].mwzuwachs);
		assertEquals(580685, result[0].trainingskosten);
		assertEquals(9354047, result[0].gehaelter);
		assertEquals(149, result[0].trainingszats);
		assertEquals(86, result[0].sollaufwertungen);
		assertEquals(57.77997986577183, result[0].sollaufwertungenproz);
		assertEquals(79, result[0].istaufwertungen);
		assertEquals(53.02, result[0].istaufwertungenproz);
	},

	testGetKaderspielerNotFound : function() {

		this.sqliteMock.setReturn([]);

		var result = this.database.getKaderspielerListe(new OSext.Termin(0, 0));
		
		assertNotNull(result);
		assertInstanceOf(Array, result);
		assertEquals(0, result.length);
	},

	testGetJugendspieler : function() {

		this.sqliteMock.setMultiReturn([[{"Id":-16,"Position":"ABW","Name":"normal","Land":"IRL","Uefa":"","Herkunft":1,"BlitzKz":0,
				"Saison":4,"Zat":4,"Alter":18,"Aufstellung":null,"Moral":99,"Fitness":99,"Skillschnitt":38.94,"Opti":55.04,"Sonderskills":"",
				"Sperre":null,"Verletzung":null,"Status":3,"TStatus":null,"TSperre":null,"Vertrag":0,"Gehalt":10000,"Marktwert":1715569,
				"SCH":24,"BAK":27,"KOB":46,"ZWK":55,"DEC":55,"GES":23,"FUQ":0,"ERF":0,"AGG":25,"PAS":32,"AUS":38,"UEB":27,"WID":63,"SEL":87,"DIS":91,"ZUV":53,"EIN":20}],		                                
			[{"Id":-16,"Zats":220,"Marktwertzuwachs":1211593,"Gehaltsschnitt":10000,"Aufwertungen":248}]]);
		
		var result = this.database.getJugendspielerListe(new OSext.Termin(4, 4));

		assertNotNull(result);
		assertInstanceOf(Array, result);
		assertEquals(1, result.length);
		assertInstanceOf(OSext.Jugendspieler, result[0]);
		assertEquals(-16, result[0].id);
		assertEquals("normal", result[0].talent);
		assertEquals(3, result[0].nr);
		assertEquals("ABW", result[0].pos);
		assertEquals("IRL", result[0].land);
		assertNull(result[0].uefa);
		assertEquals(18, result[0].alter);
		assertEquals(55.04, result[0].opti);
		assertEquals(38.94, result[0].skillschnitt);
		assertEquals("[]", JSON.stringify(result[0].sonderskills));
		assertEquals(1715569, result[0].mw);
		assertEquals("[24,27,46,55,55,23,0,0,25,32,38,27,63,87,91,53,20]", JSON.stringify(result[0].skills));
		
		assertEquals(10000, result[0].foerderung);
		assertEquals(220, result[0].kaderzats);
		assertEquals(1211593, result[0].mwzuwachs);
		assertEquals(248, result[0].gesamtaufwertungen);		
	},

	testGetJugendspielerNotFound : function() {

		this.sqliteMock.setReturn([]);

		var result = this.database.getJugendspielerListe(new OSext.Termin(0, 0));
		
		assertNotNull(result);
		assertInstanceOf(Array, result);
		assertEquals(0, result.length);
	},

	testInitNewJugendspielerId : function() {
		
		this.sqliteMock.setReturn([]);

		var spielerliste = [{skills:[]}];
		this.database.initJugendspielerIDs(spielerliste);
		
		assertEquals(-1, spielerliste[0].id);
	},	
	
	testInitExistingJugendspielerId : function() {
		
		this.sqliteMock.setReturn([{"Id": -2}]);
		
		var spielerliste = [{skills:[]}];
		this.database.initJugendspielerIDs(spielerliste);
		
		assertEquals(-2, spielerliste[0].id);
	},

	testGetWahrscheinlichkeit : function() {

		this.sqliteMock.setReturn([{Wahrscheinlichkeit:42.53}]);
		
		var wahrscheinlichkeit = this.database.getWahrscheinlichkeit(99, 22, 61);
		
		assertEquals(42.53, wahrscheinlichkeit);
	},

	testGetWahrscheinlichkeitNotFound : function() {

		this.sqliteMock.setReturn([]);
		
		var wahrscheinlichkeit = this.database.getWahrscheinlichkeit(99, 22, 1);
		
		assertNull(wahrscheinlichkeit);
	}

}




