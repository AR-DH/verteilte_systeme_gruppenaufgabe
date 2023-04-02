"use strict";

import Page from "../page.js";
import HtmlTemplate from "./booking-edit.html";

/**
 * Klasse PageEdit: Stellt die Seite zum Anlegen oder Bearbeiten einer Buchung
 * zur Verfügung.
 */
export default class BookingEdit extends Page {
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
            court: "",
            equipment: "",
            time: "",
            name_coach: "",
            member: "",
        };

        // Eingabefelder
        this._courtInput = null;
        this._equipmentInput  = null;
        this._timeInput     = null;
        this._name_coachInput     = null;
        this._memberInput     = null;
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
            this._url = `/booking/${this._editId}`;
            this._dataset = await this._app.backend.fetch("GET", this._url);
            this._title = `${this._dataset.court} ${this._dataset.equipment}`;
        } else {
            this._url = `/booking`;
            this._title = "Buchung hinzufügen";
        }

        // Platzhalter im HTML-Code ersetzen
        let html = this._mainElement.innerHTML;
        html = html.replace("$COURT$", this._dataset.court);
        html = html.replace("$EQUIPMENT$", this._dataset.equipment);
        html = html.replace("$TIME$", this._dataset.time);
        html = html.replace("$NAME_COACH$", this._dataset.name_coach);
        html = html.replace("$MEMBER$", this._dataset.member);
        this._mainElement.innerHTML = html;

        // Event Listener registrieren
        let saveButton = this._mainElement.querySelector(".action.save");
        saveButton.addEventListener("click", () => this._saveAndExit());

        // Eingabefelder zur späteren Verwendung merken
        this._courtInput = this._mainElement.querySelector("input.court");
        this._equipmentInput  = this._mainElement.querySelector("input.equipment");
        this._timeInput     = this._mainElement.querySelector("input.time");
        this._name_coachInput     = this._mainElement.querySelector("input.name_coach");
        this._memberInput     = this._mainElement.querySelector("input.member");
    }

    /**
     * Speichert den aktuell bearbeiteten Datensatz und kehrt dann wieder
     * in die Listenübersicht zurück.
     */
    async _saveAndExit() {
        // Eingegebene Werte prüfen
        this._dataset._id        = this._editId;
        this._dataset.court = this._courtInput.value.trim();
        this._dataset.equipment  = this._equipmentInput.value.trim();
        this._dataset.time     = this._timeInput.value.trim();
        this._dataset.name_coach      = this._name_coachInput.value.trim();
        this._dataset.member      = this._memberInput.value.trim();

        if (!this._dataset.court) {
            alert("Geben Sie erst einen Platz ein.");
            return;
        }

        if (!this._dataset.equipment) {
            alert("Geben Sie die Ausstattung ein.");
            return;
        }
        if (!this._dataset.time) {
            alert("Geben Sie Buchungszeitraum ein.");
            return;
        }
        if (!this._dataset.name_coach) {
            alert("Geben Sie den Trainernamen ein.");
            return;
        }
        if (!this._dataset.member) {
            alert("Geben Sie den Mitgliedsnamen ein.");
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
