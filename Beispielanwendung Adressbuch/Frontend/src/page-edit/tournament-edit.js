"use strict";

import Page from "../page.js";
import HtmlTemplate from "./tournament-edit.html";

/**
 * Klasse PageEdit: Stellt die Seite zum Anlegen oder Bearbeiten eines Turniers
 * zur Verfügung.
 */
export default class TournamentEdit extends Page {
    /**
     * Konstruktor.
     *
     * @param {App} app Instanz der App-Klasse
     * @param {Integer} editId ID des bearbeiteten Datensatzes
     */
    constructor(app, editId) {
        super(app, HtmlTemplate);

        // Bearbeiteter Datensatz
        this._editId = editId;

        this._dataset = {
            tournament_name: "",
            tournament_court: "",
            date: "",
        };

        // Eingabefelder
        this._tournamentNameInput = null;
        this._tournamentCourtInput  = null;
        this._dateInput     = null;
    }

    /**
     * HTML-Inhalt und anzuzeigende Daten laden.
     *
     * HINWEIS: Durch die geerbte init()-Methode wird `this._mainElement` mit
     * dem <main>-Element aus der nachgeladenen HTML-Datei versorgt. Dieses
     * Element wird dann auch von der App-Klasse verwendet, um die Seite
     * anzuzeigen. Hier muss daher einfach mit dem üblichen DOM-Methoden
     * `this._mainElement` nachbearbeitet werden, um die angezeigten Inhalte
     * zu beeinflussen.
     *
     * HINWEIS: In dieser Version der App wird mit dem üblichen DOM-Methoden
     * gearbeitet, um den finalen HTML-Code der Seite zu generieren. In größeren
     * Apps würde man ggf. eine Template Engine wie z.B. Nunjucks integrieren
     * und den JavaScript-Code dadurch deutlich vereinfachen.
     */
    async init() {
        // HTML-Inhalt nachladen
        await super.init();

        // Bearbeiteten Datensatz laden
        if (this._editId) {
            this._url = `/tournament/${this._editId}`;
            this._dataset = await this._app.backend.fetch("GET", this._url);
            this._title = `${this._dataset.tournament_name}`;
        } else {
            this._url = `/tournament`;
            this._title = "Turnier hinzufügen";
        }

        // Platzhalter im HTML-Code ersetzen
        let html = this._mainElement.innerHTML;
        html = html.replace("$TOURNAMENT_NAME$", this._dataset.tournament_name);
        html = html.replace("$TOURNAMENT_COURT$", this._dataset.tournament_court);
        html = html.replace("$DATE$", this._dataset.date);
        this._mainElement.innerHTML = html;

        // Event Listener registrieren
        let saveButton = this._mainElement.querySelector(".action.save");
        saveButton.addEventListener("click", () => this._saveAndExit());

        // Eingabefelder zur späteren Verwendung merken
        this._tournamentNameInput = this._mainElement.querySelector("input.tournament_name");
        this._tournamentCourtInput     = this._mainElement.querySelector("input.tournament_court");
        this._dateInput     = this._mainElement.querySelector("input.date");
    }

    /**
     * Speichert den aktuell bearbeiteten Datensatz und kehrt dann wieder
     * in die Listenübersicht zurück.
     */
    async _saveAndExit() {
        // Eingegebene Werte prüfen
        this._dataset._id        = this._editId;
        this._dataset.tournament_name = this._tournamentNameInput.value.trim();
        this._dataset.tournament_court      = this._tournamentCourtInput.value.trim();
        this._dataset.date      = this._dateInput.value.trim();

        if (!this._dataset.tournament_name) {
            alert("Geben Sie erst eine Turnierbezeichnung ein.");
            return;
        }

        // Datensatz speichern
        try {
            if (this._editId) {
                await this._app.backend.fetch("PUT", this._url, {body: this._dataset});
            } else {
                await this._app.backend.fetch("POST", this._url, {body: this._dataset});
            }
        } catch (ex) {
            this._app.showException(ex);
            return;
        }

        // Zurück zur Übersicht
        location.hash = "#/";
    }
};