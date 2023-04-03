"use strict"

import { MongoClient } from "mongodb";

/**
 * Singleton-Klasse zum Zugriff auf das MongoDB-Datenbankobjekt, ohne dieses
 * ständig als Methodenparameter durchreichen zu müssen. Stattdessen kann
 * einfach das Singleton-Objekt dieser Klasse importiert und das Attribut
 * `mongodb` oder `database` ausgelesen werden.
 */
class DatabaseFactory {
    /**
     * Ersatz für den Konstruktor, damit aus dem Hauptprogramm heraus die
     * Verbindungs-URL der MongoDB übergeben werden kann. Hier wird dann
     * auch gleich die Verbindung hergestellt.
     *
     * @param {String} connectionUrl URL-String mit den Verbindungsdaten
     */
    async init(connectionUrl) {
        // Datenbankverbindung herstellen
        this.client = new MongoClient(connectionUrl);
        await this.client.connect();
        this.database = this.client.db("soccerclubbook");

        await this._createDemoData();
        
    }

    /**
     * Hilfsmethode zum Anlegen von Demodaten. Würde man so in einer
     * Produktivanwendung natürlich nicht machen, aber so sehen wir
     * wenigstens gleich ein paar Daten.
     */
    async _createDemoData() {
        let profiles = this.database.collection("profiles");
        let bookings = this.database.collection("bookings");
        let tournaments = this.database.collection("tournaments");

        if (await profiles.estimatedDocumentCount() === 0) {
            profiles.insertMany([
                {
                    first_name: "Ralph",
                    last_name: "Radermacher",
                    phone: "+49 711 564412",
                    email: "ralph.radermacher@sap.com",
                },
                {
                    first_name: "Yannik",
                    last_name: "Jakob",
                    phone: "+49 721 554194",
                    email: "yannik@jakob.com",
                },
                {
                    first_name: "Rolf-Dieter",
                    last_name: "Härter",
                    phone: "+49 721 553181",
                    email: "itil-weiterbildung@gmail.com",
                },
                {
                    first_name: "Dietmar",
                    last_name: "Hopp",
                    phone: "+49 721 572287",
                    email: "hopp@sap.com",
                },
                {
                    first_name: "Anthony",
                    last_name: "Rudtke",
                    phone: "+49 721 957338",
                    email: "anthony@abc.com",
                },
            ]);
        }
        if (await bookings.estimatedDocumentCount() === 0) {
            bookings.insertMany([
                {
                    court: "Halle 1 Kirrlach",
                    equipment: "5x Bälle, 20x Hütchen",
                    time: "17:00-20:00, 01.01.2023",
                    name_coach: "Lukas Podolski",
                    member: "Anthony Rudtke, Kai Simon, Chenyu Qiu, Philipp Pohl",
                },
                {
                    court: "Feld Kirrlach Mitte",
                    equipment: "3x Bälle, 15x Hütchen",
                    time: "19:00-21:00, 03.01.2023",
                    name_coach: "Sebastian Rudy",
                    member: "Kai Simon, Yannick Rennings",
                },
                {
                    court: "Feld Kirrlach-St.Leon-Rot",
                    equipment: "2x Bälle, 15x Hütchen",
                    time: "17:00-19:00, 01.01.2023",
                    name_coach: "Michael Trauth-Finck",
                    member: "Kai Simon",
                },
                {
                    court: "Feld Kirrlach Mitte",
                    equipment: "5x Bälle, 20x Hütchen",
                    time: "17:00-20:00, 01.01.2023",
                    name_coach: "Pierre Hollandaise",
                    member: "Kai Simon, Luca D'Oria, Ulrich Bach",
                },
                {
                    court: "Halle 2 Kirrlach",
                    equipment: "4x Bälle, 15x Hütchen",
                    time: "14:00-17:00, 04.01.2023",
                    name_coach: "Marvin Schmid",
                    member: "Warren Buffet, Dietmar Hopp, Elon Musk",
                },
                
            ]);
        }
        if (await tournaments.estimatedDocumentCount() === 0) {
            tournaments.insertMany([
                {
                    tournament_name: "Karlsruhe-Cup",
                    tournament_court: "KSC Arena",
                    date: "02.04.2023",
                },
                {
                    tournament_name: "SAP-Cup",
                    tournament_court: "SAP Arena",
                    date: "09.04.2023",
                },
                {
                    tournament_name: "Baden-Open",
                    tournament_court: "Feld Kirrlach Mitte",
                    date: "10.04.2023",
                },
                {
                    tournament_name: "Deutsche Meisterschaft",
                    tournament_court: "Alianz Arena",
                    date: "16.04.2023",
                },
                {
                    tournament_name: "Kids-Cup",
                    tournament_court: "Halle 1 Kirrlach",
                    date: "23.04.2023",
                },
                
            ]);
        }
    }
}

export default new DatabaseFactory();
