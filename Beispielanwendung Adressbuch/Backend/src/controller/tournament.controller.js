"use strict"

import TournamentService from "../service/tournament.service.js";
import {wrapHandler} from "../utils.js";
import RestifyError from "restify-errors";

/**
 * HTTP-Controller-Klasse für Turniereinträge. Diese Klasse registriert
 * alle notwendigen URL-Handler beim Webserver für einen einfachen REST-
 * Webservice zum Lesen und Schreiben von Turnieren.
 */
export default class TournamentController {
    /**
     * Konstruktor. Hier werden die URL-Handler registrert.
     *
     * @param {Object} server Restify Serverinstanz
     * @param {String} prefix Gemeinsamer Prefix aller URLs
     */
    constructor(server, prefix) {
        this._service = new TournamentService();
        this._prefix = prefix;

        // Collection: Turniere
        server.get(prefix, wrapHandler(this, this.search));
        server.post(prefix, wrapHandler(this, this.create));

        // Entity: Turnier
        server.get(prefix + "/:id", wrapHandler(this, this.read));
        server.put(prefix + "/:id", wrapHandler(this, this.update));
        server.patch(prefix + "/:id", wrapHandler(this, this.update));
        server.del(prefix + "/:id", wrapHandler(this, this.delete));
    }

    /**
     * Hilfsmethode zum Einfügen von HATEOAS-Links in einen Datensatz.
     * Dem Datensatz wird ein Attribut `_links` gemäß der OpenAPI-Spezifikation
     * hinzugefügt, damit ein Client erkennen kann, wie er die Entität lesen,
     * ändern oder löschen kann.
     *
     * @param {Object} entity Zu verändernder Datensatz.
     */
    _insertHateoasLinks(entity) {
        let url = `${this._prefix}/${entity._id}`;

        entity._links = {
            read:   {url: url, method: "GET"},
            update: {url: url, method: "PUT"},
            patch:  {url: url, method: "PATCH"},
            delete: {url: url, method: "DELETE"},
        }
    }

    /**
     * GET /tournament
     * Turniere suchen
     */
    async search(req, res, next) {
        let result = await this._service.search(req.query);
        result.forEach(entity => this._insertHateoasLinks(entity));
        res.sendResult(result);
        return next();
    }

    /**
     * POST /tournament
     * Neues Turnier anlegen
     */
    async create(req, res, next) {
        let result = await this._service.create(req.body);
        this._insertHateoasLinks(result);

        res.status(201);
        res.header("Location", `${this._prefix}/${result._id}`);
        res.sendResult(result);

        return next();
    }

    /**
     * GET /tournament/:id
     * Turnier auslesen
     */
    async read(req, res, next) {
        let result = await this._service.read(req.params.id);

        if (result) {
            this._insertHateoasLinks(result);
            res.sendResult(result);
        } else {
            throw new RestifyError.NotFoundError("Turnier nicht gefunden");
        }

        return next();
    }

    /**
     * PUT /tournament/:id
     * PATCH /tournament/:id
     * Turnier ändern
     */
    async update(req, res, next) {
        let result = await this._service.update(req.params.id, req.body);

        if (result) {
            this._insertHateoasLinks(result);
            res.sendResult(result);
        } else {
            throw new RestifyError.NotFoundError("Turnier nicht gefunden");
        }

        return next();
    }

    /**
     * DELETE /tournament/:id
     * Turnier löschen
     */
    async delete(req, res, next) {
        await this._service.delete(req.params.id)
        res.status(204);
        res.sendResult({});
        return next();
    }
}