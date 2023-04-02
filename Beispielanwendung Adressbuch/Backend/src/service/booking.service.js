"use strict"

import DatabaseFactory from "../database.js";
import {ObjectId} from "mongodb";

/**
 * Geschäftslogik zur Verwaltung von Buchungen. Diese Klasse implementiert die
 * eigentliche Anwendungslogik losgelöst vom technischen Übertragungsweg.
 * Die Buchungseinsträge werden der Einfachheit halber in einer MongoDB abgelegt.
 */
export default class BookingService {
    /**
     * Konstruktor.
     */
    constructor() {
        this._booking = DatabaseFactory.database.collection("bookings");
    }

    /**
     * Buchungen suchen. Unterstützt wird lediglich eine ganz einfache Suche,
     * bei der einzelne Felder auf exakte Übereinstimmung geprüft werden.
     * Zwar unterstützt MongoDB prinzipiell beliebig komplexe Suchanfragen.
     * Um das Beispiel klein zu halten, wird dies hier aber nicht unterstützt.
     *
     * @param {Object} query Optionale Suchparameter
     * @return {Promise} Liste der gefundenen Buchungen
     */
    async search(query) {
        let cursor = this._booking.find(query, {
            sort: {
                court: 1,
                equipment: 1,
                time: 1,
                name_coach: 1,
                member: 1
            }
        });

        return cursor.toArray();
    }

    /**
     * Speichern einer neuen Buchung.
     *
     * @param {Object} booking Zu speichernde Buchungsdaten
     * @return {Promise} Gespeicherte Buchungsdaten
     */
    async create(booking) {
        booking = booking || {};

        let newBooking = {
            court: booking.court || "",
            equipment:  booking.equipment  || "",
            time:      booking.time      || "",
            name_coach:      booking.name_coach      || "",
            member: booking.member || ""
        };

        let result = await this._booking.insertOne(newBooking);
        return await this._booking.findOne({_id: result.insertedId});
    }

    /**
     * Auslesen einer vorhandenen Buchungen anhand ihrer ID.
     *
     * @param {String} id ID der gesuchten Buchung
     * @return {Promise} Gefundene Buchungsdaten
     */
    async read(id) {
        let result = await this._booking.findOne({_id: new ObjectId(id)});
        return result;
    }

    /**
     * Aktualisierung einer Buchung, durch Überschreiben einzelner Felder
     * oder des gesamten Buchungsobjekts (ohne die ID).
     *
     * @param {String} id ID der gesuchten Buchung
     * @param {[type]} booking Zu speichernde Buchungsdaten
     * @return {Promise} Gespeicherte Buchungsdaten oder undefined
     */
    async update(id, booking) {
        let oldBooking = await this._booking.findOne({_id: new ObjectId(id)});
        if (!oldBooking) return;

        let updateDoc = {
            $set: {},
        }

        if (booking.court) updateDoc.$set.court = booking.court;
        if (booking.equipment)  updateDoc.$set.equipment  = booking.equipment;
        if (booking.time)      updateDoc.$set.time      = booking.time;
        if (booking.name_coach)      updateDoc.$set.name_coach      = booking.name_coach;
        if (booking.member)      updateDoc.$set.member     = booking.member;

        await this._booking.updateOne({_id: new ObjectId(id)}, updateDoc);
        return this._booking.findOne({_id: new ObjectId(id)});
    }

    /**
     * Löschen einer Buchung anhand ihrer ID.
     *
     * @param {String} id ID der gesuchten Buchungen
     * @return {Promise} Anzahl der gelöschten Datensätze
     */
    async delete(id) {
        let result = await this._booking.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount;
    }
}
