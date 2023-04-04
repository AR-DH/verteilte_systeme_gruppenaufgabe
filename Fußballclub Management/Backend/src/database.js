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
        this.database = this.client.db("fußballclubbook");

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
                    first_name: "Laura",
                    last_name: "Müller",
                    phone: "+49 711 564412",
                    email: "laura.mueller@abc.com",
                },
                {
                    first_name: "Jasmin",
                    last_name: "Meier",
                    phone: "+49 721 554194",
                    email: "jasmin@meier.com",
                },
                {
                    first_name: "Luca",
                    last_name: "Hollandaise",
                    phone: "+49 721 553181",
                    email: "luca@hollandaise.com",
                },
                {
                    first_name: "Dietmar",
                    last_name: "Hopp",
                    phone: "+49 721 572287",
                    email: "hopp@sap.com",
                },
                {
                    first_name: "Rolf-Dieter",
                    last_name: "Härter",
                    phone: "+49 721 957338",
                    email: "itil-weiterbildung@gmail.com",
                },
            ]);
        }
        if (await bookings.estimatedDocumentCount() === 0) {
            bookings.insertMany([
                {
                    court: "Feld Kirrlach",
                    equipment: "5x Fußbälle",
                    time: "17:00-20:00, 01.01.2023",
                    name_coach: "Bastian Schweinsteiger",
                    member: "Mirac Asal",
                },
                {
                    court: "Halle 1 Kirrlach Mitte",
                    equipment: "4x Fußbälle",
                    time: "19:00-21:00, 03.01.2023",
                    name_coach: "Sebastian Rudy",
                    member: "Kai Simon, Luca Hollandaise, Kai Heneka",
                },
                {
                    court: "Feld Kirrlach",
                    equipment: "3x Fußbälle",
                    time: "17:00-19:00, 01.01.2023",
                    name_coach: "Sebastian Rudy",
                    member: "Manuel Müller",
                },
                {
                    court: "Halle 2 Kirrlach Mitte",
                    equipment: "5x Fußbälle",
                    time: "17:00-20:00, 01.01.2023",
                    name_coach: "Michael Klose",
                    member: "Dietmar Hopp, Bill Gates, Elon Musk",
                },
                {
                    court: "Dietmar-Hopp-Halle St.Leon-Rot",
                    equipment: "3x Bälle, 20x Hütchen",
                    time: "14:00-17:00, 04.01.2023",
                    name_coach: "Markus Maier",
                    member: "Markus Söder, Christian Lindner, Angela Merkel",
                },
                
            ]);
        }
        if (await tournaments.estimatedDocumentCount() === 0) {
            tournaments.insertMany([
                {
                    tournament_name: "Kreisliga",
                    tournament_court: "Naturrasen-Platz",
                    date: "02.04.2023",
                },
                {
                    tournament_name: "C-Junioren Spieltag 13",
                    tournament_court: "Kunstrasen-Platz",
                    date: "09.04.2023",
                },
                {
                    tournament_name: "Württemberg-Cup",
                    tournament_court: "Naturrasen-Platz",
                    date: "10.04.2023",
                },
                {
                    tournament_name: "Deutsche Meisterschaft",
                    tournament_court: "Naturrasen-Platz",
                    date: "16.04.2023",
                },
                {
                    tournament_name: "Kids-Cup",
                    tournament_court: "Aschenplatz",
                    date: "23.04.2023",
                },
                
            ]);
        }
    }
}

export default new DatabaseFactory();
