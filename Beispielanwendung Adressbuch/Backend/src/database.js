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
        this.database = this.client.db("golfclubbook");

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
                    first_name: "Salih",
                    last_name: "Kut",
                    phone: "+49 711 564412",
                    email: "salih.kut@abc.com",
                },
                {
                    first_name: "Mirac",
                    last_name: "Asal",
                    phone: "+49 721 554194",
                    email: "mirac@asal.com",
                },
                {
                    first_name: "Luca",
                    last_name: "D'Oria",
                    phone: "+49 721 553181",
                    email: "luca@doria.com",
                },
                {
                    first_name: "Dietmar",
                    last_name: "Hopp",
                    phone: "+49 721 572287",
                    email: "hopp@sap.com",
                },
                {
                    first_name: "Warren",
                    last_name: "Buffet",
                    phone: "+49 721 957338",
                    email: "buffet@berkshire.com",
                },
            ]);
        }
        if (await bookings.estimatedDocumentCount() === 0) {
            bookings.insertMany([
                {
                    court: "8-hole",
                    equipment: "3x Golfschläger, 15x Golfbälle",
                    time: "17:00-20:00, 01.01.2023",
                    name_coach: "Tiger Woods",
                    member: "Mirac Asal",
                },
                {
                    court: "16-hole",
                    equipment: "1x Golfschläger, 30x Golfbälle",
                    time: "19:00-21:00, 03.01.2023",
                    name_coach: "Tiger Woods",
                    member: "Salih Kut",
                },
                {
                    court: "8-hole",
                    equipment: "1x Golfkart, 15x Golfbälle",
                    time: "17:00-19:00, 01.01.2023",
                    name_coach: "Kevin James",
                    member: "Luca D'Oria",
                },
                {
                    court: "Schlagplatz",
                    equipment: "3x Golfschläger, 30x Golfbälle",
                    time: "17:00-20:00, 01.01.2023",
                    name_coach: "Tiger Woods",
                    member: "Dietmar Hopp",
                },
                {
                    court: "8-hole",
                    equipment: "1x Golfschläger, 10x Golfbälle, 1x Golftasche",
                    time: "14:00-17:00, 04.01.2023",
                    name_coach: "Markus Maier",
                    member: "Warren Buffet",
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
