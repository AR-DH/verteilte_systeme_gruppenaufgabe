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
        this.database = this.client.db("adressbook");

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

        if (await addresses.estimatedDocumentCount() === 0) {
            profiles.insertMany([
                {
                    first_name: "Anthony",
                    last_name: "Rudtke",
                    phone: "+49 711 564412",
                    email: "anthony.rudtke@alf.com",
                },
                {
                    first_name: "Angela",
                    last_name: "Merkel",
                    phone: "+49 721 554194",
                    email: "angela@merkel.com",
                },
                {
                    first_name: "Kai",
                    last_name: "Simon",
                    phone: "+49 721 553181",
                    email: "kai.fabian@simon.com",
                },
                {
                    first_name: "Chenyu",
                    last_name: "Qiu",
                    phone: "+49 721 572287",
                    email: "chenyu@qiu.com",
                },
                {
                    first_name: "Elwood",
                    last_name: "Blues",
                    phone: "+49 721 957338",
                    email: "elwood@blues-brothers.com",
                },
            ]);
        }
        if (await bookings.estimatedDocumentCount() === 0) {
            bookings.insertMany([
                {
                    court: "Halle 1",
                    equipment: "5x Bälle, 30x Hütchen",
                    time: "17:00-20:00, 01.01.2023",
                    name_coach: "Pierre Hollandaise",
                    member: "Kai Simon, Anthony Rudtke, Chenyu Qiu, Peter Altmaier",
                },
                {
                    court: "Feld Walldorf Mitte",
                    equipment: "4x Bälle, 20x Hütchen",
                    time: "19:00-21:00, 03.01.2023",
                    name_coach: "Pierre Hollandaise",
                    member: "Dietmar Hopp, Anton Schlecker, Markus Lanz, Christian Lindner",
                },
                {
                    court: "Feld Walldorf Mitte",
                    equipment: "2x Bälle",
                    time: "17:00-19:00, 01.01.2023",
                    name_coach: "Lukas Podolski",
                    member: "Manuel Brecht",
                },
                {
                    court: "Halle 2",
                    equipment: "3x Bälle, 15x Hütchen",
                    time: "17:00-20:00, 01.01.2023",
                    name_coach: "Lukas Podolski",
                    member: "Kai Gustav, Benjamin Carlsen, Luis Kayed",
                },
            ]);
        }
        if (await tournaments.estimatedDocumentCount() === 0) {
            tournaments.insertMany([
                {
                    tournament_name: "Karlsruhe-Open",
                    tournament_court: "8-hole",
                    date: "02.04.2023",
                },
                {
                    tournament_name: "SAP-Open",
                    tournament_court: "16-hole",
                    date: "09.04.2023",
                },
                {
                    tournament_name: "Baden-Open",
                    tournament_court: "8-hole",
                    date: "10.04.2023",
                },
                {
                    tournament_name: "Deutsche Meisterschaft",
                    tournament_court: "16-hole",
                    date: "16.04.2023",
                },
                {
                    tournament_name: "Kids-Cup",
                    tournament_court: "4-hole",
                    date: "23.04.2023",
                },
                
            ]);
        }
    }
}

export default new DatabaseFactory();
