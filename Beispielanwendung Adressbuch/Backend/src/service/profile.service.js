"use strict"

import DatabaseFactory from "../database.js";
import {ObjectId} from "mongodb";

/**
 * Geschäftslogik zur Verwaltung von Profileinträgen. Diese Klasse implementiert die
 * eigentliche Anwendungslogik losgelöst vom technischen Übertragungsweg.
 * Die Adressen werden der Einfachheit halber in einer MongoDB abgelegt.
 */
export default class AddressService {
    /**
     * Konstruktor.
     */
    constructor() {
        this._profil = DatabaseFactory.database.collection("profiles");
    }

    /**
     * Profile suchen. Unterstützt wird lediglich eine ganz einfache Suche,
     * bei der einzelne Felder auf exakte Übereinstimmung geprüft werden.
     * Zwar unterstützt MongoDB prinzipiell beliebig komplexe Suchanfragen.
     * Um das Beispiel klein zu halten, wird dies hier aber nicht unterstützt.
     *
     * @param {Object} query Optionale Suchparameter
     * @return {Promise} Liste der gefundenen Adressen
     */
    async search(query) {
        let cursor = this._profil.find(query, {
            sort: {
                first_name: 1,
                last_name: 1,
            
            }
        });

        return cursor.toArray();
    }

    /**
     * Speichern eines neuen Profileintrags.
     *
     * @param {Object} profil Zu speichernde Profildaten
     * @return {Promise} Gespeicherte Profildaten
     */
    async create(profil) {
        profil = profil || {};

        let newProfil = {
            first_name: profil.first_name || "",
            last_name:  profil.last_name || "",
            phone:      profil.phone      || "",
            email:      profil.email      || "",
        };

        let result = await this._profil.insertOne(newProfil);
        return await this._profil.findOne({_id: result.insertedId});
    }

    /**
     * Auslesen eines vorhandenen Profils anhand der ID.
     *
     * @param {String} id ID der gesuchten Adresse
     * @return {Promise} Gefundene Adressdaten
     */
    async read(id) {
        let result = await this._profil.findOne({_id: new ObjectId(id)});
        return result;
    }

    /**
     * Aktualisierung eines Profils, durch Überschreiben einzelner Felder
     * oder des gesamten Profilobjekts (ohne die ID).
     *
     * @param {String} id ID der gesuchten Profils
     * @param {[type]} profil Zu speichernde Profildaten
     * @return {Promise} Gespeicherte Profildaten oder undefined
     */
    async update(id, profil) {
        let oldProfil = await this._profil.findOne({_id: new ObjectId(id)});
        if (!oldProfil) return;

        let updateDoc = {
            $set: {},
        }

        if (profil.first_name) updateDoc.$set.first_name    = profil.first_name;
        if (profil.last_name)  updateDoc.$set.last_name     = profil.last_name;
        if (profil.phone)      updateDoc.$set.phone         = profil.phone;
        if (profil.email)      updateDoc.$set.email         = profil.email;

        await this._profil.updateOne({_id: new ObjectId(id)}, updateDoc);
        return this._profil.findOne({_id: new ObjectId(id)});
    }

    /**
     * Löschen eines Profils anhand ihrer ID.
     *
     * @param {String} id ID des gesuchten Profils
     * @return {Promise} Anzahl der gelöschten Datensätze
     */
    async delete(id) {
        let result = await this._profil.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount;
    }
}
