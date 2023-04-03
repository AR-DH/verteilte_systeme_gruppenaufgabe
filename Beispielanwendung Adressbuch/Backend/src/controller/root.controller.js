"use strict"

import {wrapHandler} from "../utils.js";
import path from "path";
import { readFile } from "fs/promises";

/**
 * Controller für die Wurzeladresse des Webservices. Ermöglicht in dieser
 * Fassung den Abruf der OpenAPI-Spezifikation unter `/?openapi` sowie den
 * Abruf einer HATEOAS-Übersucht unter `/`.
 */
export default class RootController {
    /**
     * Konstruktor. Hier werden die URL-Handler registrert.
     *
     * @param {Object} server Restify Serverinstanz
     * @param {String} prefix Gemeinsamer Prefix aller URLs
     * @param {String} openApiFile Pfad zur OpenAPI-Datei
     */
    constructor(server, prefix, openApiFile) {
        this._openApiFile = openApiFile;

        server.get(prefix, wrapHandler(this, this.index));
        server.get(prefix + "/openapi.yaml", wrapHandler(this, this.openApi));
    }

    /**
     * GET /:
     * Übersicht über die vorhandenen Collections liefern (HATEOAS-Prinzip,
     * so dass Clients die URL-Struktur des Webservices entdecken können).
     */
    async index(req, res, next) {
        res.sendResult([
            {
                _name: "profile",
                query: {url: "/profile", method: "GET", query_params: ["search", "first_name", "last_name", "phone", "email"]},
                create: {url: "/profile", method: "POST"},
            },
            {
                _name: "booking",
                query: {url: "/booking", method: "GET", query_params: ["search", "court", "equipment", "member", "name_coach", "time"]},
                create: {url: "/booking", method: "POST"},
            },
            {
                _name: "tournament",
                query: {url: "/tournament", method: "GET", query_params: ["search", "date", "tournament_court", "tournament_name"]},
                create: {url: "/tournament", method: "POST"},
            }
        ]);

        next();
    }

    /**
     * GET /openapi.yaml:
     * Abruf der OpenAPI-Spezifikation
     */
    async openApi(req, res, next) {
        if (req.query.openapi !== undefined) {
            let filecontent = await readFile(this._openApiFile);

            res.status(200);
            res.header("content-type", "application/openapi+yaml");
            res.sendRaw(filecontent);
        } else {
            res.send();
        }

        next();
    }
}
