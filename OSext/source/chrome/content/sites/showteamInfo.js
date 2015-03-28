/**
 * Klasse für die Mannschaft-Infoseite
 * 
 * @constructor
 */
OSext.Sites.ShowteamInfo = function (wrappeddoc) {
	
	this.classname = "OSext.Sites.ShowteamInfo";
	
	this.wrappeddoc = wrappeddoc;
};

OSext.Sites.ShowteamInfo.prototype = {
	
	/**
	 * Prüft die Seite auf Änderungen und Anmeldungsinformationen.
	 * 
	 * @throws {@link OSext.SiteChangeError}
	 * oder {@link OSext.AuthenticationError}
	 */
	check : function (params) {

		var bolds = this.wrappeddoc.doc.getElementsByTagName("b"),
			tables = this.wrappeddoc.doc.getElementsByTagName("table"),
			table;
		
		if (params && params.c) {
			return false;
		}

		if (!bolds || bolds.length === 0 || 
				bolds[0].firstChild.textContent.search(/.+\s-\s/) == -1 || 
				bolds[0].lastElementChild.tagName.toUpperCase() != "A") {
			throw new OSext.SiteChangeError("Mannschaft/Info -> Überschrift wurde geändert!");
		}
				
		if (!tables || tables.length < 3) {
			throw new OSext.SiteChangeError("Mannschaft/Info -> Tabelle wurde nicht gefunden!");
		} else {
			table = tables[2];
		}
		
		if (!table || !table.rows || table.rows.length < 7 || 
				table.rows[1].cells.length < 4 || table.rows[0].cells[0].textContent.search(/Teamname.+/) == -1) {
			throw new OSext.SiteChangeError("Mannschaft/Info -> Tabelle wurde geändert!");
		}

		if (tables.length > 3 && (tables[3].rows[0].cells[0].textContent.search(/Das Stadion wird noch \d+ ZAT.s. ausgebaut./) == -1)) {
			throw new OSext.SiteChangeError("Mannschaft/Info -> Tabelle für Ausbauten wurde geändert!");
		}

		if (bolds[0].firstChild.textContent.search(/DemoTeam\s-\s/) != -1) {
			throw new OSext.AuthenticationError("Demoteam.");
		}
		return true;
	},

	/**
	 * Extrahiert den Saisonplan
	 */
	extract : function (data, params) {

		var table = this.wrappeddoc.doc.getElementsByTagName("table")[2],	
			table2, z = data.saisonpause ? 0 : data.termin.zat, 
			ausbaudauer, ausbauende, stadionreduziert;
				
		data.stadion.uesitzer = +table.rows[2].cells[3].textContent.replace(/\./g, "");
		data.stadion.sitzer = +table.rows[2].cells[1].textContent.replace(/\./g, "") - data.stadion.uesitzer;
		data.stadion.uesteher = +table.rows[3].cells[3].textContent.replace(/\./g, "");
		data.stadion.steher = +table.rows[3].cells[1].textContent.replace(/\./g, "") - data.stadion.uesteher;
		data.stadion.anzeigetafel = table.rows[4].cells[1].textContent;
		data.stadion.rasenheizung = (table.rows[4].cells[3].textContent == "Ja");
				
		if (this.wrappeddoc.doc.getElementsByTagName("table").length > 3) {

			table2 = this.wrappeddoc.doc.getElementsByTagName("table")[3];
			
			ausbaudauer = +table2.rows[0].cells[0].textContent.split(" ")[4];
			ausbauende = z + ausbaudauer;

			stadionreduziert = new OSext.Stadion(); 
			stadionreduziert.steher = Math.round(data.stadion.steher * 0.75);
			stadionreduziert.sitzer = Math.round(data.stadion.sitzer * 0.75);
			stadionreduziert.uesteher = Math.round(data.stadion.uesteher * 0.75);
			stadionreduziert.uesitzer = Math.round(data.stadion.uesitzer * 0.75);
			stadionreduziert.anzeigetafel = data.stadion.anzeigetafel;
			stadionreduziert.rasenheizung = data.stadion.rasenheizung;
					
			// Reduziertes Stadion bis Ausbauende
			for (z++; z < ausbauende; z++) {
				data.saisonplan[z].stadion = stadionreduziert;
			}

			data.saisonplan[ausbauende].stadion = this.extractStadionNeu(data, table2, ausbauende);
			
			// Danach neues Stadion
			for (z = ausbauende + 1; z < data.saisonplan.length; z++) {
				data.saisonplan[z].stadion = data.saisonplan[ausbauende].stadion;
			}
		}
		else {
			
			for (z++; z < data.saisonplan.length; z++) {
				data.saisonplan[z].stadion = data.stadion;
			}
		}
	},
		
	extractStadionNeu : function (data, table2, ausbauende) {
		
		var stadionneu, r, txt, wert;
		
		stadionneu = new OSext.Stadion(); 
		
		stadionneu.steher = data.stadion.steher;
		stadionneu.sitzer = data.stadion.sitzer;
		stadionneu.uesteher = data.stadion.uesteher;
		stadionneu.uesitzer = data.stadion.uesitzer;
			
		for (r = 2; r < table2.rows.length; r++) {
			txt = table2.rows[r].cells[0].textContent; 					
			wert = +txt.split(" ")[0].replace(/\./g, "");
				
			if (txt.search(/Eine Anzeigetafel .+ wird gebaut/) != -1) {
				stadionneu.anzeigetafel = txt.split("\"")[1];
			}
			else if (txt.search(/Eine Rasenheizung wird gebaut/) != -1) {
				stadionneu.rasenheizung = true;
			}
			else if (txt.search(/.+ .+berdachte Stehpl.+tze werden zu Sitzpl.+tzen umgebaut/) != -1) {
				stadionneu.uesteher -= wert;
				stadionneu.uesitzer += wert;
			}
			else if (txt.search(/.+ Stehpl.+tze werden zu Sitzpl.+tzen umgebaut/) != -1) {
				stadionneu.steher -= wert;
				stadionneu.sitzer += wert;
			}
			else if (txt.search(/.+ .+berdachte Sitzpl.+tze werden gebaut/) != -1) {
				stadionneu.uesitzer += wert;
			}
			else if (txt.search(/.+ Sitzpl.+tze werden gebaut/) != -1) {
				stadionneu.sitzer += wert;
			}
			else if (txt.search(/.+ .+berdachte Stehpl.+tze werden gebaut/) != -1) {
				stadionneu.uesteher += wert;
			}
			else if (txt.search(/.+ Stehpl.+tze werden gebaut/) != -1) {
				stadionneu.steher += wert;
			}
			else if (txt.search(/.+ Sitzpl.+tze werden .+berdacht/) != -1) {
				stadionneu.uesitzer += wert;
				stadionneu.sitzer -= wert;
			}
			else if (txt.search(/.+ Stehpl.+tze werden .+berdacht/) != -1) {
				stadionneu.uesteher += wert;
				stadionneu.steher -= wert;
			}
		}
		
		return stadionneu;
	}
};