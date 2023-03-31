"use strict";

/**
 * Basisklasse für eine Unterseite der App. Für jede Seite muss eine von dieser
 * Klasse erbende Klasse angelegt werden, damit sie angezeigt werden kann.
 *
 * Die Darstellung auf dem Bildschirm erfolgt durch die Methode _showPage()
 * der zentralen App-Klasse. Sie ruft dementsprechend die Methoden des
 * Page-Objekts auf, um die Inhalte zu ermitteln.
 */
export default class Page {
    /**
     * Konstruktor. Muss von den erbenden Klassen immer aufgerufen werden, um
     * das App-Objekt zu übergeben. Die erbenden Klassen sollten daher am
     * besten auch einen Konstruktor besitzen, dem das App-Objekt übergeben
     * wird.
     *
     * Der Parameter für den HTML-String sollte hingegen von der erbenden
     * Klasse versorgt werden, wobei das HTML-Template in der Regel (da wir
     * hier einen Bundler nutzen) aus einer separaten HTML-Datei importiert
     * werden sollte.
     *
     * @param {App} app - Zentralles App-Objekt
     * @param {string} htmlString - Inhalt des HTML-Templates
     */
    constructor(app, htmlString) {
        this._app = app;

        this._htmlString = htmlString;
        this._title = "???";
        this._cssString = null;
        this._mainElement = null;
    }

    /**
     * Initialisierung der neuen Seite bei ihrem ersten Aufruf. Diese Methode
     * muss von den erbenden Klassen überschrieben werden, um anhand der
     * HTML/CSS-Inhalte folgende Objektattribute mit Werten zu versehen:
     *
     *   ┌─────────────────────┬───────────────┬───────────────────────────────────────────────┐
     *   │  ATTRIBUT           │  TYP          │  INHALT                                       │
     *   ├─────────────────────┼───────────────┼───────────────────────────────────────────────┤
     *   │  this._title        │  String       │  Titel der Seite                              │
     *   │  this._cssString    │  String       |  CSS-Anweisungen der Seite                    │
     *   |  this._mainElement  │  DOM Element  │  HTML-Element für den Hauptbereich oder null  │
     *   └─────────────────────┴───────────────┴───────────────────────────────────────────────┘
     *
     * Die geerbte Methode muss in der redefinierten Methode aufgerufen und
     * `this._title` mit dem Anzeigetitel der Seite versorgt werden. Bei Bedarf
     * kann dann das HTML-Element in `this._mainElement` verändert werden, um
     * den sichtbaren Inhalt zu beeinflussen oder Event Handler zu registrieren.
     */
    async init() {
        let dummyElement = document.createElement("div");
        dummyElement.innerHTML = this._htmlString;

        this._cssString = dummyElement.querySelector("style")?.innerHTML;
        this._mainElement = dummyElement.querySelector("main");
        this._mainElement.remove();
    }

    /**
     * @returns {string} Titel der Seite
     */
    get title() {
        return this._title;
    }

    /**
     * @returns {string} Inhalt des CSS-Stylehseets
     */
    get css() {
        return this._cssString;
    }

    /**
     * @returns {DOMElement} HTML-Element für den Hauptbereich oder null
     */
    get mainElement() {
        return this._mainElement;
    }
}
