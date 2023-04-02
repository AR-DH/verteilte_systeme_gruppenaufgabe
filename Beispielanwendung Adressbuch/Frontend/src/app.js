"use strict";

import Backend from "./backend.js";
import Router from "./router.js";
import "./app.css";

/**
 * Hauptklasse App: Steuert die gesamte Anwendung
 *
 * Diese Klasse erzeugt den Single Page Router zur Navigation innerhalb
 * der Anwendung und ein Datenbankobjekt zur Verwaltung der Liste.
 * Darüber hinaus beinhaltet sie verschiedene vom Single Page Router
 * aufgerufene Methoden, zum Umschalten der aktiven Seite.
 */
class App {
    /**
     * Konstruktor.
     */
    constructor() {
        // Datenbank-Klasse zur Verwaltung der Datensätze
        this.backend = new Backend();

        // Single Page Router zur Steuerung der sichtbaren Inhalte
        this.router = new Router([
            {
                url: "^/tournaments",
                show: () => this._gotoTournamentList()
            },
            {
                url: "^/profiles",
                show: () => this._gotoProfileList()
            },
            {
                url: "^/booking",
                show: () => this._gotoBookingList()
            },{
                url: "^/edit-tournament/(.*)$",
                show: matches => this._gotoTournamentEdit(matches[1]),
            },
            
            {
                url: "^/edit-profile/(.*)$",
                show: matches => this._gotoProfileEdit(matches[1]),
            },
            {
                url: "^/edit-booking/(.*)$",
                show: matches => this._gotoBookingEdit(matches[1]),
            },{
                url: ".*",
                show: () => this._gotoTournamentList()
            },
        ]);

        // Fenstertitel merken, um später den Name der aktuellen Seite anzuhängen
        this._documentTitle = document.title;

        // Von dieser Klasse benötigte HTML-Elemente
        this._pageCssElement = document.querySelector("#page-css");
        this._bodyElement = document.querySelector("body");
        this._menuElement = document.querySelector("#app-menu");
    }

    /**
     * Initialisierung der Anwendung beim Start. Im Gegensatz zum Konstruktor
     * der Klasse kann diese Methode mit der vereinfachten async/await-Syntax
     * auf die Fertigstellung von Hintergrundaktivitäten warten, ohne dabei
     * mit den zugrunde liegenden Promise-Objekten direkt hantieren zu müssen.
     */
    async init() {
        try {
            await this.backend.init();
            this.router.start();
        } catch (ex) {
            this.showException(ex);
        }
    }

    /**
     * Übersichtsseite anzeigen. Wird vom Single Page Router aufgerufen.
     */
    async _gotoProfileList() {
        try {
            // Dynamischer Import, vgl. https://javascript.info/modules-dynamic-imports
            let {default: ProfileList} = await import("./page-list/profile-list.js");

            let page = new ProfileList(this);
            await page.init();
            this._showPage(page, "profile-list");
        } catch (ex) {
            this.showException(ex);
    }
}
    async _gotoBookingList() {
        try {
            // Dynamischer Import, vgl. https://javascript.info/modules-dynamic-imports
            let {default: BookingList} = await import("./page-list/booking-list.js");

            let page = new BookingList(this);
            await page.init();
            this._showPage(page, "booking-list");
        } catch (ex) {
            this.showException(ex);
    }
}
async _gotoTournamentList() {
    try {
        // Dynamischer Import, vgl. https://javascript.info/modules-dynamic-imports
        let {default: TournamentList} = await import("./page-list/tournament-list.js");

        let page = new TournamentList(this);
        await page.init();
        this._showPage(page, "tournament-list");
    } catch (ex) {
        this.showException(ex);
}
}


    /**
     * Seite zum Anlegen einer neuen Entität anzeigen.  Wird vom Single Page
     * Router aufgerufen.
     */

    /**
     * Seite zum Bearbeiten einer Entität anzeigen.  Wird vom Single Page
     * Router aufgerufen.
     *
     * @param {Number} id ID der zu bearbeitenden Entität
     */
    async _gotoProfileEdit(id) {
        try {
            // Dynamischer Import, vgl. https://javascript.info/modules-dynamic-imports
            let {default: ProfileEdit} = await import("./page-edit/profile-edit.js");

            let page = new ProfileEdit(this, id);
            await page.init();
            this._showPage(page, "editProfile");
        } catch (ex) {
            this.showException(ex);
        }
    }
    async _gotoBookingEdit(id) {
        try {
            // Dynamischer Import, vgl. https://javascript.info/modules-dynamic-imports
            let {default: BookingEdit} = await import("./page-edit/booking-edit.js");

            let page = new BookingEdit(this, id);
            await page.init();
            this._showPage(page, "editBooking");
        } catch (ex) {
            this.showException(ex);
        }
    }
    async _gotoTournamentEdit(id) {
        try {
            // Dynamischer Import, vgl. https://javascript.info/modules-dynamic-imports
            let {default: TournamentEdit} = await import("./page-edit/tournament-edit.js");

            let page = new TournamentEdit(this, id);
            await page.init();
            this._showPage(page, "editTournament");
        } catch (ex) {
            this.showException(ex);
        }
    }

    /**
     * Interne Methode zum Umschalten der sichtbaren Seite.
     *
     * @param  {Page} page Objekt der anzuzeigenden Seiten
     * @param  {String} name Name zur Hervorhebung der Seite im Menü
     */
    _showPage(page, name) {
        // Fenstertitel aktualisieren
        document.title = `${this._documentTitle} – ${page.title}`;

        // Stylesheet der Seite einfügen
        this._pageCssElement.innerHTML = page.css;

        // Aktuelle Seite im Kopfbereich hervorheben
        this._menuElement.querySelectorAll("li").forEach(li => li.classList.remove("active"));
        this._menuElement.querySelectorAll(`li[data-page-name="${name}"]`).forEach(li => li.classList.add("active"));

        // Sichtbaren Hauptinhalt austauschen
        this._bodyElement.querySelector("main")?.remove();
        this._bodyElement.appendChild(page.mainElement);
    }

    /**
     * Hilfsmethode zur Anzeige eines Ausnahmefehlers. Der Fehler wird in der
     * Konsole protokolliert und als Popupmeldung angezeigt.
     *
     * @param {Object} ex Abgefangene Ausnahme
     */
    showException(ex) {
        console.error(ex);

        if (ex.message) {
            alert(ex.message)
        } else {
            alert(ex.toString());
        }
    }
}

/**
 * Anwendung starten
 */
window.addEventListener("load", async () => {
    let app = new App();
    await app.init();
});