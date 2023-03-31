"use strict"

import DatabaseFactory from "../database.js";
import {ObjectId} from "mongodb";

/**
 * Geschäftslogik zur Verwaltung von Adressen. Diese Klasse implementiert die
 * eigentliche Anwendungslogik losgelöst vom technischen Übertragungsweg.
 * Die Adressen werden der Einfachheit halber in einer MongoDB abgelegt.
 */
export default class AddressService {
    /**
     * Konstruktor.
     */
    constructor() {
        this._addresses = DatabaseFactory.database.collection("addresses");
    }

    /**
     * Adressen suchen. Unterstützt wird lediglich eine ganz einfache Suche,
     * bei der einzelne Felder auf exakte Übereinstimmung geprüft werden.
     * Zwar unterstützt MongoDB prinzipiell beliebig komplexe Suchanfragen.
     * Um das Beispiel klein zu halten, wird dies hier aber nicht unterstützt.
     *
     * @param {Object} query Optionale Suchparameter
     * @return {Promise} Liste der gefundenen Adressen
     */
    async search(query) {
        let cursor = this._addresses.find(query, {
            sort: {
                first_name: 1,
                last_name: 1,
            }
        });

        return cursor.toArray();
    }

    /**
     * Speichern einer neuen Adresse.
     *
     * @param {Object} address Zu speichernde Adressdaten
     * @return {Promise} Gespeicherte Adressdaten
     */
    async create(address) {
        address = address || {};

        let newAddress = {
            first_name: address.first_name || "",
            last_name:  address.last_name  || "",
            phone:      address.phone      || "",
            email:      address.email      || "",
        };

        let result = await this._addresses.insertOne(newAddress);
        return await this._addresses.findOne({_id: result.insertedId});
    }

    /**
     * Auslesen einer vorhandenen Adresse anhand ihrer ID.
     *
     * @param {String} id ID der gesuchten Adresse
     * @return {Promise} Gefundene Adressdaten
     */
    async read(id) {
        let result = await this._addresses.findOne({_id: new ObjectId(id)});
        return result;
    }

    /**
     * Aktualisierung einer Adresse, durch Überschreiben einzelner Felder
     * oder des gesamten Adressobjekts (ohne die ID).
     *
     * @param {String} id ID der gesuchten Adresse
     * @param {[type]} address Zu speichernde Adressdaten
     * @return {Promise} Gespeicherte Adressdaten oder undefined
     */
    async update(id, address) {
        let oldAddress = await this._addresses.findOne({_id: new ObjectId(id)});
        if (!oldAddress) return;

        let updateDoc = {
            $set: {},
        }

        if (address.first_name) updateDoc.$set.first_name = address.first_name;
        if (address.last_name)  updateDoc.$set.last_name  = address.last_name;
        if (address.phone)      updateDoc.$set.phone      = address.phone;
        if (address.email)      updateDoc.$set.email      = address.email;

        await this._addresses.updateOne({_id: new ObjectId(id)}, updateDoc);
        return this._addresses.findOne({_id: new ObjectId(id)});
    }

    /**
     * Löschen einer Adresse anhand ihrer ID.
     *
     * @param {String} id ID der gesuchten Adresse
     * @return {Promise} Anzahl der gelöschten Datensätze
     */
    async delete(id) {
        let result = await this._addresses.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount;
    }
}
