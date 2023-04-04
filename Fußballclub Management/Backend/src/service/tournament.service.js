"use strict"

import DatabaseFactory from "../database.js";
import {ObjectId} from "mongodb";

/**
 * Geschäftslogik zur Verwaltung von Turniereinträgen. Diese Klasse implementiert die
 * eigentliche Anwendungslogik losgelöst vom technischen Übertragungsweg.
 * Die Turniereinträge werden der Einfachheit halber in einer MongoDB abgelegt.
 */
export default class TournamentService {
    /**
     * Konstruktor.
     */
    constructor() {
        this._tournaments = DatabaseFactory.database.collection("tournaments");
    }

    /**
     * Turniere suchen. Unterstützt wird lediglich eine ganz einfache Suche,
     * bei der einzelne Felder auf exakte Übereinstimmung geprüft werden.
     * Zwar unterstützt MongoDB prinzipiell beliebig komplexe Suchanfragen.
     * Um das Beispiel klein zu halten, wird dies hier aber nicht unterstützt.
     *
     * @param {Object} query Optionale Suchparameter
     * @return {Promise} Liste der gefundenen Turniere
     */
    async search(query) {
        let cursor = this._tournaments.find(query, {
            sort: {
                tournament_name: 1,
            }
        });

        return cursor.toArray();
    }

    /**
     * Speichern eines neuen Turniereintrags.
     *
     * @param {Object} tournament Zu speichernde Turnierdaten
     * @return {Promise} Gespeicherte Turnierdaten
     */
    async create(tournament) {
        tournament = tournament || {};

        let newTournament = {
            tournament_name: tournament.tournament_name || "",
            tournament_court: tournament.tournament_court || "",
            date: tournament.date || "",
        };

        let result = await this._tournaments.insertOne(newTournament);
        return await this._tournaments.findOne({_id: result.insertedId});
    }

    /**
     * Auslesen eines vorhandenen Turniers anhand ihrer ID.
     *
     * @param {String} id ID des gesuchten Turniers
     * @return {Promise} Gefundene Turnierdaten
     */
    async read(id) {
        let result = await this._tournaments.findOne({_id: new ObjectId(id)});
        return result;
    }

    /**
     * Aktualisierung eines Turniers, durch Überschreiben einzelner Felder
     * oder des gesamten Turnierobjekts (ohne die ID).
     *
     * @param {String} id ID des gesuchten Turniers
     * @param {[type]} tournament Zu speichernde Turnierdaten
     * @return {Promise} Gespeicherte Turnierdaten oder undefined
     */
    async update(id, tournament) {
        let oldTournament = await this._tournaments.findOne({_id: new ObjectId(id)});
        if (!oldTournament) return;

        let updateDoc = {
            $set: {},
        }

        if (tournament.tournament_name) updateDoc.$set.tournament_name   = tournament.tournament_name;
        if (tournament.tournament_court) updateDoc.$set.tournament_court = tournament.tournament_court;
        if (tournament.date)      updateDoc.$set.date                    = tournament.date;

        await this._tournaments.updateOne({_id: new ObjectId(id)}, updateDoc);
        return this._tournaments.findOne({_id: new ObjectId(id)});
    }

    /**
     * Löschen eines Turniereintrags anhand ihrer ID.
     *
     * @param {String} id ID des gesuchten Turniers
     * @return {Promise} Anzahl der gelöschten Datensätze
     */
    async delete(id) {
        let result = await this._tournaments.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount;
    }
}