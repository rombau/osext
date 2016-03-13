
TestCase("KaderspielerTests").prototype = {
	
	setUp : function() {

		this.spieler = new OSext.Kaderspieler();
		
		this.spieler.alter = 23;
		this.spieler.pos = OSext.POS.ABW;
		this.spieler.skills = [34,36,70,76,75,40,0,12,31,30,45,41,20,23,87,66,50];
		
		this.spieler.mw = 40000000;
		this.spieler.gehalt = 100000;
		this.spieler.vertrag = 10;
		
		this.spieler.status = OSext.STATUS.AKTIV;
		this.spieler.tsperre = 0;
		this.spieler.sonderskills = null;

		this.prognosespieltage = this.generateSpieltage();
		
		this.prefsMock = {
			getMaxPrimaerskill : function() { return 80; },
			getMaxNebenskill : function() { return 60; },
			getAlterTrainingslimit : function() { return 25; },
			isPhysio : function () { return true; },
			getAbwertungspiele : function () { return 36; },
			getMonateNeuVertrag : function () { return 24; }
		};
	},
	
	generateSpieltage : function () {
		
		var spieltage = [];
		
		spieltage[0] = this.createSpieltag(4, 70, OSext.SPIELART.FSS);
		spieltage[1] = this.createSpieltag(4, 71, OSext.SPIELART.FSS);
		spieltage[2] = this.createSpieltag(4, 72, OSext.SPIELART.FSS);
		spieltage[3] = this.createSpieltag(5, 1, OSext.SPIELART.FSS);
		spieltage[4] = this.createSpieltag(5, 2, OSext.SPIELART.LIGA);
		spieltage[5] = this.createSpieltag(5, 3, OSext.SPIELART.FSS);
		spieltage[6] = this.createSpieltag(5, 4, OSext.SPIELART.LIGA);
		spieltage[7] = this.createSpieltag(5, 5, OSext.SPIELART.OSEQ);
		spieltage[8] = this.createSpieltag(5, 6, OSext.SPIELART.LIGA);
		spieltage[9] = this.createSpieltag(5, 7, OSext.SPIELART.POKAL);
		spieltage[10] = this.createSpieltag(5, 8, OSext.SPIELART.LIGA);
		
		return spieltage;		
	},
	
	createSpieltag : function (saison, zat, art) {
		
		var st = new OSext.Spieltag(saison, zat);
		st.spielart = art;
		return st;
	},

	testSkillPrognoseInaktiv : function () {
		
		this.spieler.status = OSext.STATUS.INAKTIV;
		
		var s = this.spieler.getSpieler(this.prognosespieltage, this.prefsMock);
		
		assertEquals(this.spieler.skills, s.skills);
	},

	testSkillPrognoseVerliehen : function () {

		this.spieler.status = OSext.STATUS.VERLIEHEN;
		
		var s = this.spieler.getSpieler(this.prognosespieltage, this.prefsMock);
		
		assertEquals(this.spieler.skills, s.skills);
	},

	testSkillPrognoseVerletzt : function () {
		
		this.spieler.alter = 25;
		this.spieler.skills = [34,36,70,76,75,40,0,12,31,30,45,41,20,23,87,66,50];
		this.spieler.training.aktuell.skillidx = OSext.SKILL.ZWK;
		this.spieler.training.aktuell.wahrscheinlichkeit = 80;
		this.spieler.training.plan.skillidx = OSext.SKILL.ZWK;
		this.spieler.training.plan.wahrscheinlichkeit = 80;
		this.spieler.verletzung = 30;
		
		var s = this.spieler.getSpieler(this.prognosespieltage, this.prefsMock);
		
		assertEquals([34,36,70,76,75,40,0,12,31,30,45,41,20,23,87,66,50], s.skills);
	},
	
	testSkillPrognosePSPS : function () {
		
		this.spieler.alter = 25;
		this.spieler.skills = [34,36,70,76,75,40,0,12,31,30,45,41,20,23,87,66,50];
		this.spieler.training.aktuell.skillidx = OSext.SKILL.ZWK;
		this.spieler.training.aktuell.wahrscheinlichkeit = 20;
		this.spieler.training.plan.skillidx = OSext.SKILL.ZWK;
		this.spieler.training.plan.wahrscheinlichkeit = 20;
		
		var s = this.spieler.getSpieler(this.prognosespieltage, this.prefsMock);
		
		assertEquals([34,36,70,78,75,40,0,12,31,30,45,41,20,23,87,66,50], s.skills);
	},
	
	testSkillPrognosePSNS : function () {
		
		this.spieler.alter = 25;
		this.spieler.skills = [34,36,70,76,75,40,0,12,31,30,45,41,20,23,87,66,50];
		this.spieler.training.aktuell.skillidx = OSext.SKILL.ZWK;
		this.spieler.training.aktuell.wahrscheinlichkeit = 20;
		this.spieler.training.plan.skillidx = OSext.SKILL.GES;
		this.spieler.training.plan.wahrscheinlichkeit = 55;
		
		var s = this.spieler.getSpieler(this.prognosespieltage, this.prefsMock);
		
		assertEquals([34,36,70,77,75,43,0,12,31,30,45,41,20,23,87,66,50], s.skills);
	},

	testSkillPrognosePSPSLimit : function () {
		
		this.spieler.alter = 25;
		this.spieler.skills = [34,36,70,76,75,40,0,12,31,30,45,41,20,23,87,66,50];
		this.spieler.training.aktuell.skillidx = OSext.SKILL.ZWK;
		this.spieler.training.aktuell.wahrscheinlichkeit = 60;
		this.spieler.training.plan.skillidx = OSext.SKILL.ZWK;
		this.spieler.training.plan.wahrscheinlichkeit = 60;
		
		var s = this.spieler.getSpieler(this.prognosespieltage, this.prefsMock);
		
		assertEquals([34,36,70,80,78,40,0,12,31,30,45,41,20,23,87,66,50], s.skills);
	},

	testSkillPrognosePSPSLimitMulti : function () {
		
		this.spieler.alter = 25;
		this.spieler.skills = [34,36,79,79,79,40,0,12,31,30,45,41,20,23,87,66,50];
		this.spieler.training.aktuell.skillidx = OSext.SKILL.ZWK;
		this.spieler.training.aktuell.wahrscheinlichkeit = 60;
		this.spieler.training.plan.skillidx = OSext.SKILL.ZWK;
		this.spieler.training.plan.wahrscheinlichkeit = 60;

		var s = this.spieler.getSpieler(this.prognosespieltage, this.prefsMock);
		
		assertEquals([34,36,80,80,80,40,0,12,31,30,45,41,20,23,87,71,50], s.skills);
	},

	testSkillPrognosePSPSLimitUeberschreitung : function () {

		this.spieler.alter = 25;
		this.spieler.skills = [34,36,79,82,79,40,0,12,31,30,45,41,20,23,87,66,50];
		this.spieler.training.aktuell.skillidx = OSext.SKILL.ZWK;
		this.spieler.training.aktuell.wahrscheinlichkeit = 60;
		this.spieler.training.plan.skillidx = OSext.SKILL.DEC;
		this.spieler.training.plan.wahrscheinlichkeit = 60;
		
		var s = this.spieler.getSpieler(this.prognosespieltage, this.prefsMock);
		
		assertEquals([34,36,80,85,80,40,0,12,31,30,45,41,20,23,87,68,50], s.skills);
	},

	testSkillPrognosePSPSLimitUeberschreitungMulti : function () {

		this.spieler.alter = 25;
		this.spieler.skills = [34,36,83,82,79,40,0,12,31,30,45,41,20,23,87,81,50];
		this.spieler.training.aktuell.skillidx = OSext.SKILL.DEC;
		this.spieler.training.aktuell.wahrscheinlichkeit = 60;
		this.spieler.training.plan.skillidx = OSext.SKILL.DEC;
		this.spieler.training.plan.wahrscheinlichkeit = 60;
		
		var s = this.spieler.getSpieler(this.prognosespieltage, this.prefsMock);
		
		assertEquals([34,36,83,82,80,40,0,12,31,30,55,41,20,23,87,81,50], s.skills);
	},

	testSkillPrognoseNSNS : function () {
		
		this.spieler.alter = 25;
		this.spieler.skills = [34,36,70,76,75,40,0,12,31,30,45,41,20,23,87,66,50];
		this.spieler.training.aktuell.skillidx = OSext.SKILL.GES;
		this.spieler.training.aktuell.wahrscheinlichkeit = 50;
		this.spieler.training.plan.skillidx = OSext.SKILL.GES;
		this.spieler.training.plan.wahrscheinlichkeit = 50;
		
		var s = this.spieler.getSpieler(this.prognosespieltage, this.prefsMock);
		
		assertEquals([34,36,70,76,75,45,0,12,31,30,45,41,20,23,87,66,50], s.skills);
	},

	testSkillPrognoseNSLimitUeberschreitungMulti : function () {

		this.spieler.alter = 25;
		this.spieler.skills = [34,36,83,82,79,59,0,12,31,30,58,50,20,23,87,81,50];
		this.spieler.training.aktuell.skillidx = OSext.SKILL.GES;
		this.spieler.training.aktuell.wahrscheinlichkeit = 50;
		this.spieler.training.plan.skillidx = OSext.SKILL.GES;
		this.spieler.training.plan.wahrscheinlichkeit = 50;
		
		var s = this.spieler.getSpieler(this.prognosespieltage, this.prefsMock);
		
		assertEquals([34,36,83,82,79,60,0,12,31,30,60,52,20,23,87,81,50], s.skills);
	},

	testSkillPrognosePSLimitUeberschreitungMulti23 : function () {

		this.spieler.alter = 23;
		this.spieler.skills = [34,36,83,82,79,59,0,12,31,30,58,50,20,23,87,81,50];
		this.spieler.training.aktuell.skillidx = OSext.SKILL.DEC;
		this.spieler.training.aktuell.wahrscheinlichkeit = 99;
		this.spieler.training.plan.skillidx = OSext.SKILL.GES;
		this.spieler.training.plan.wahrscheinlichkeit = 99;
		
		var s = this.spieler.getSpieler(this.prognosespieltage, this.prefsMock);
		
		assertEquals([34,36,83,82,82,62,0,12,31,30,62,51,20,23,87,81,50], s.skills);
	},
	
	testSkillPrognoseCunnigham : function () {

		this.spieler.alter = 25;
		this.spieler.skills = [30,31,78,78,78,44,0,23,40,48,43,63,7,73,27,78,50];
		this.spieler.training.aktuell.skillidx = OSext.SKILL.PAS;
		this.spieler.training.aktuell.wahrscheinlichkeit = 99;
		this.spieler.training.plan.skillidx = OSext.SKILL.GES;
		this.spieler.training.plan.wahrscheinlichkeit = 99;
		
		var s = this.spieler.getSpieler(this.prognosespieltage, this.prefsMock);
		
		assertEquals([30,31,78,78,78,50,0,23,40,53,43,63,7,73,27,78,50], s.skills);
	},

	testSkillPrognoseGragg : function () {

		this.spieler.alter = 25;
		this.spieler.skills = [38,40,77,78,78,55,0,25,27,36,43,51,39,8,37,77,35];
		this.spieler.training.aktuell.skillidx = OSext.SKILL.PAS;
		this.spieler.training.aktuell.wahrscheinlichkeit = 99;
		this.spieler.training.plan.skillidx = OSext.SKILL.UEB;
		this.spieler.training.plan.wahrscheinlichkeit = 99;
		
		var s = this.spieler.getSpieler(this.prognosespieltage, this.prefsMock);
		
		assertEquals([38,40,77,78,78,55,0,25,27,41,43,57,39,8,37,77,35], s.skills);
	},

	testAlterPrognoseMitSaisonwechsel : function () {

		var s = this.spieler.getSpieler(this.prognosespieltage, this.prefsMock);
		
		assertEquals(24, s.alter);
	},

	testAlterPrognoseOhneSaisonwechsel : function () {

		this.prognosespieltage.splice(1, this.prognosespieltage.length - 1);
		
		var s = this.spieler.getSpieler(this.prognosespieltage, this.prefsMock);
		
		assertEquals(23, s.alter);
	},

	testStatusPrognoseBlitz : function () {

		this.spieler.blitzzat = (4 * 71);
		
		var s = this.spieler.getSpieler(this.prognosespieltage, this.prefsMock);
		
		assertEquals(OSext.STATUS.INAKTIV, s.status);
	},

	testLeihPrognoseNewObject : function () {

		this.spieler.status = OSext.STATUS.VERLIEHEN;
		this.spieler.tstatus = "L";
		this.spieler.tsperre = 34;
		this.spieler.leihdaten = {dauer: 34};

		var s = this.spieler.getSpieler(this.prognosespieltage, this.prefsMock);

		assertNotSame(s.leihdaten, this.spieler.leihdaten);
		assertEquals(34, this.spieler.leihdaten.dauer);
		assertEquals(23, s.leihdaten.dauer);
	},
	
	testLeihPrognoseVerliehen : function () {

		this.spieler.status = OSext.STATUS.VERLIEHEN;
		this.spieler.tstatus = "L";
		this.spieler.tsperre = 34;
		this.spieler.leihdaten = {dauer: 34};
		
		var s = this.spieler.getSpieler(this.prognosespieltage, this.prefsMock);
		
		assertEquals(OSext.STATUS.VERLIEHEN, s.status);
		assertEquals(23, s.leihdaten.dauer);
		assertEquals("L", s.tstatus);
		assertEquals(23, s.tsperre);
	},

	testLeihPrognoseVerliehenMitRueckkehr : function () {

		this.spieler.status = OSext.STATUS.VERLIEHEN;
		this.spieler.tstatus = "L";
		this.spieler.tsperre = 4;
		this.spieler.leihdaten = {dauer: 4};
		
		var s = this.spieler.getSpieler(this.prognosespieltage, this.prefsMock);
		
		assertEquals(OSext.STATUS.AKTIV, s.status);
		assertNull(s.leihdaten);
		assertNull(s.tstatus);
		assertNull(s.tsperre);
	},

	testLeihPrognoseGeliehen : function () {

		this.spieler.herkunft = OSext.HERKUNFT.LEIHE;
		this.spieler.tstatus = "L";
		this.spieler.tsperre = 34;
		this.spieler.leihdaten = {dauer: 34};
		
		var s = this.spieler.getSpieler(this.prognosespieltage, this.prefsMock);
		
		assertEquals(OSext.HERKUNFT.LEIHE, s.herkunft);
		assertEquals(23, s.leihdaten.dauer);
		assertEquals("L", s.tstatus);
		assertEquals(23, s.tsperre);
	},

	testLeihPrognoseGeliehenMitRueckkehr : function () {

		this.spieler.herkunft = OSext.HERKUNFT.LEIHE;
		this.spieler.tstatus = "L";
		this.spieler.tsperre = 4;
		this.spieler.leihdaten = {dauer: 4};
		
		var s = this.spieler.getSpieler(this.prognosespieltage, this.prefsMock);
		
		assertEquals(OSext.STATUS.INAKTIV, s.status);
		assertNull(s.leihdaten);
		assertNull(s.tstatus);
		assertNull(s.tsperre);
	},

	testTransfersperrePrognose : function () {

		this.spieler.tsperre = 34;
		
		var s = this.spieler.getSpieler(this.prognosespieltage, this.prefsMock);
		
		assertEquals(23, s.tsperre);
	},
	
	testTransfersperrePrognoseAblauf : function () {

		this.spieler.tsperre = 4;
		
		var s = this.spieler.getSpieler(this.prognosespieltage, this.prefsMock);
		
		assertNull(s.tsperre);
	},
	
	testVerletzungPrognose : function () {

		this.spieler.verletzung = 34;
		
		var s = this.spieler.getSpieler(this.prognosespieltage, this.prefsMock);
		
		assertEquals(12, s.verletzung);
	},
	
	testVerletzungPrognoseOhnePhysio : function () {

		this.spieler.verletzung = 34;
		this.prefsMock.isPhysio = function () { return false; };

		var s = this.spieler.getSpieler(this.prognosespieltage, this.prefsMock);
		
		assertEquals(23, s.verletzung);
	},
	
	testVerletzungPrognoseAblauf : function () {

		this.spieler.verletzung = 4;
		
		var s = this.spieler.getSpieler(this.prognosespieltage, this.prefsMock);
		
		assertNull(s.verletzung);
	},
	
	testSperrenPrognoseNewObject : function () {

		this.spieler.sperren = [{art: OSext.SPIELART.LIGA, dauer: 5}];
		
		var s = this.spieler.getSpieler(this.prognosespieltage, this.prefsMock);
		
		assertNotSame(s.sperren, this.spieler.sperren);
		assertEquals(1, s.sperren[0].dauer);
		assertEquals(5, this.spieler.sperren[0].dauer);
	},

	testSperrenPrognoseLiga : function () {

		this.spieler.sperren = [{art: OSext.SPIELART.LIGA, dauer: 5}];
		
		var s = this.spieler.getSpieler(this.prognosespieltage, this.prefsMock);
		
		assertEquals(1, s.sperren[0].dauer);
	},

	testSperrenPrognoseLigaMitAblauf : function () {

		this.spieler.sperren = [{art: OSext.SPIELART.LIGA, dauer: 3}];
		
		var s = this.spieler.getSpieler(this.prognosespieltage, this.prefsMock);
		
		assertNull(s.sperren);
	},

	testSperrenPrognosePokal : function () {

		this.spieler.sperren = [{art: OSext.SPIELART.POKAL, dauer: 5}];
		
		var s = this.spieler.getSpieler(this.prognosespieltage, this.prefsMock);
		
		assertEquals(4, s.sperren[0].dauer);
	},

	testSperrenPrognosePokalMitAblauf : function () {

		this.spieler.sperren = [{art: OSext.SPIELART.POKAL, dauer: 1}];
		
		var s = this.spieler.getSpieler(this.prognosespieltage, this.prefsMock);
		
		assertNull(s.sperren);
	},
	
	testSperrenPrognoseInternational : function () {

		this.spieler.sperren = [{art: OSext.SPIELART.INT, dauer: 5}];
		
		var s = this.spieler.getSpieler(this.prognosespieltage, this.prefsMock);
		
		assertEquals(4, s.sperren[0].dauer);
	},

	testSperrenPrognoseInternationalMitAblauf : function () {

		this.spieler.sperren = [{art: OSext.SPIELART.INT, dauer: 1}];
		
		var s = this.spieler.getSpieler(this.prognosespieltage, this.prefsMock);
		
		assertNull(s.sperren);
	},

	testSperrenPrognoseLigaUndInternationalMitAblauf : function () {

		this.spieler.sperren = [{art: OSext.SPIELART.LIGA, dauer: 5},
		                        {art: OSext.SPIELART.INT, dauer: 1}];
		
		var s = this.spieler.getSpieler(this.prognosespieltage, this.prefsMock);

		assertEquals(1, s.sperren.length);
		assertEquals(OSext.SPIELART.LIGA, s.sperren[0].art);
		assertEquals(1, s.sperren[0].dauer);
	},

	testSperrenPrognoseLigaMitAblaufUndInternational : function () {

		this.spieler.sperren = [{art: OSext.SPIELART.LIGA, dauer: 3},
		                        {art: OSext.SPIELART.INT, dauer: 2}];
		
		var s = this.spieler.getSpieler(this.prognosespieltage, this.prefsMock);

		assertEquals(1, s.sperren.length);
		assertEquals(OSext.SPIELART.INT, s.sperren[0].art);
		assertEquals(1, s.sperren[0].dauer);
	},

	testSperrenPrognoseMultiMitAblauf : function () {

		this.spieler.sperren = [{art: OSext.SPIELART.LIGA, dauer: 3},
		                        {art: OSext.SPIELART.POKAL, dauer: 1},
		                        {art: OSext.SPIELART.INT, dauer: 1}];
		
		var s = this.spieler.getSpieler(this.prognosespieltage, this.prefsMock);

		assertNull(s.sperren);
	},

	testVertragPrognose : function () {

		this.spieler.vertrag = 12; 
			
		var s = this.spieler.getSpieler(this.prognosespieltage, this.prefsMock);

		assertEquals(10, s.vertrag);
	},

	testVertragPrognoseMitAblauf : function () {

		this.spieler.vertrag = 1;
		this.spieler.gehalt24 = 200000;
			
		var s = this.spieler.getSpieler(this.prognosespieltage, this.prefsMock);

		assertEquals(23, s.vertrag);
		assertEquals(200000, s.gehalt);
	},

	testFuqPrognose : function () {

		this.spieler.fuqprosaison = 15;
		this.spieler.skills[OSext.SKILL.FUQ] = 23;
			
		var s = this.spieler.getSpieler(this.prognosespieltage, this.prefsMock);

		assertEquals(25, s.skills[OSext.SKILL.FUQ]);
	},

	testKeineAbwertung : function () {
		
		var s = this.spieler.getSpieler(this.prognosespieltage, this.prefsMock);
		
		assertEquals([34,36,70,76,75,40,0,12,31,30,45,41,20,23,87,66,50], s.skills);
	},

	testAbwertungFeldspieler : function () {

		this.spieler.alter = 32;
		
		var s = this.spieler.getSpieler(this.prognosespieltage, this.prefsMock);
		
		assertEquals(703, OSext.getListSum(s.skills));
	},

	testDoppelAbwertungFeldspieler : function () {

		assertEquals(736, OSext.getListSum(this.spieler.skills));
		
		this.spieler.alter = 32;
		this.spieler.geburtstag = 6;
		this.prognosespieltage[11] = this.createSpieltag(6, 6, OSext.SPIELART.LIGA);
		this.prognosespieltage[12] = this.createSpieltag(6, 8, OSext.SPIELART.LIGA);
		
		var s = this.spieler.getSpieler(this.prognosespieltage, this.prefsMock);
		
		assertEquals(653, OSext.getListSum(s.skills));
	},

	testAbwertungTor : function () {

		this.spieler.alter = 34;
		this.spieler.skills = [56,68,77,79,76,77,0,35,50,54,46,57,1,76,29,59,88];

		var s = this.spieler.getSpieler(this.prognosespieltage, this.prefsMock);
		
		assertEquals(861, OSext.getListSum(s.skills));
	},
	
	testInheritance : function() {

		assertEquals(287,this.spieler.getSummePrimaerSkills());		
		
		var s = new OSext.Kaderspieler();
		assertNull(s.pos);
		assertEquals(0, s.skills.length);
		assertEquals(0, s.getSummePrimaerSkills());		
	},

	testBlitzwertAktivPositiv : function() {

		assertEquals(5280000,this.spieler.getBlitzwert());		
	},

	testBlitzwertGrenzen : function() {
		
		this.spieler.alter = 32;

		assertEquals(9600000,this.spieler.getBlitzwert());

		this.spieler.blitzwert = null;
		this.spieler.alter = 33;

		assertEquals(29000000,this.spieler.getBlitzwert());
	},
	
	testBlitzwertAktivNegativ : function() {

		this.spieler.vertrag = 60;
		this.spieler.mw = 1000000;

		assertEquals(0,this.spieler.getBlitzwert());		
	},

	testBlitzwertVerliehen : function() {
		
		this.spieler.status = OSext.STATUS.VERLIEHEN;

		assertEquals(-5280000,this.spieler.getBlitzwert());		
	},

	testBlitzwertTransfersperre : function() {
		
		this.spieler.tsperre = 10;

		assertEquals(-5280000,this.spieler.getBlitzwert());		
	},
	
	testMarkwertzuwachsProZat : function() {

		this.spieler.kaderzats = 30;
		this.spieler.mwzuwachs = 1200000;
		this.spieler.trainingskosten = 30000;
		this.spieler.gehaelter = 400000;

		assertEquals("25.667",this.spieler.getMarktwertbilanz());
	},
	
	testKeineSperre : function() {
		
		this.spieler.setSperren("0");
		
		assertNull(this.spieler.sperren);
	},
	
	testEinzelSperre : function() {
		
		this.spieler.setSperren("1L");
		
		assertEquals(1,this.spieler.sperren.length);
		assertEquals(OSext.SPIELART.LIGA,this.spieler.sperren[0].art);
		assertEquals(1,this.spieler.sperren[0].dauer);
	},
	
	testMultiSperre : function() {

		this.spieler.setSperren("1L 2P 3I");
		
		assertEquals(3,this.spieler.sperren.length);
		assertEquals(OSext.SPIELART.LIGA,this.spieler.sperren[0].art);
		assertEquals(1,this.spieler.sperren[0].dauer);
		assertEquals(OSext.SPIELART.POKAL,this.spieler.sperren[1].art);
		assertEquals(2,this.spieler.sperren[1].dauer);
		assertEquals(OSext.SPIELART.INT,this.spieler.sperren[2].art);
		assertEquals(3,this.spieler.sperren[2].dauer);
	},
	
	testSperrenHTML : function() {
		
		this.spieler.sperren = [
			{ art: OSext.SPIELART.LIGA, dauer: 3 },
			{ art: OSext.SPIELART.POKAL, dauer: 2 },
			{ art: OSext.SPIELART.INT, dauer: 1 },
		];

		assertEquals("<abbr title=\"3 Ligaspiele\">3L</abbr> <abbr title=\"2 Pokalspiele\">2P</abbr> <abbr title=\"1 Internationale Spiele\">1I</abbr>",
			this.spieler.getSperrenHTML());
	},
	
	testSperrenText : function() {
		
		this.spieler.sperren = [
			{ art: OSext.SPIELART.LIGA, dauer: 3 },
			{ art: OSext.SPIELART.POKAL, dauer: 2 },
			{ art: OSext.SPIELART.INT, dauer: 1 },
		];

		assertEquals("3L 2P 1I", this.spieler.getSperrenText());
	},
	
	testLeihdatenHTML : function() {

		this.spieler.leihdaten = {
			gebuehr: 243221, 
			dauer: 34, 
			von: { id: 17, name: "FC Bleiburg"}, 
			an: { id: 19, name: "FC Cork"}
		};
		
		assertEquals("<abbr title=\"Leihgabe von FC Bleiburg an FC Cork für 34 ZATs\">L34</abbr>",
			this.spieler.getLeihInfoHTML());
	}
	
}



