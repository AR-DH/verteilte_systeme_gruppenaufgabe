"use strict";

/**
 * Hilfsfunktion zur Vereinfachung der HTTP-Handler-Methoden in Anlehnung an
 * Vgl. https://stackoverflow.com/a/48109157
 *
 * Stellt sicher, dass der Parameter `this` in den Methoden tatsächlich auf
 * das Controller-Objekt zeigt, sowie dass Ausnahmen sauber an das Restify.
 * Framework weitergereicht werden, egal ob es sich bei der Handler-Methode
 * um eine synchrone oder asynchrone Methode handelt. Im Endeffekt müssen
 * somit Ausnahmen in den Handler-Methoden nicht mehr abgefangen werden,
 * sondern werden immer anständig als Fehler an den Client gemeldet.
 *
 * @param {Function} func Asynchrone Handler-Funktion
 * @return {Function} Synchrone Handler-Funktion mit Callback-Mechanismus
 */
export function wrapHandler(that, func) {
    func = func.bind(that);

    return (req, res, next) => {
        try {
            return func(req, res, next)?.catch((ex) => {
                return next(ex);
            });
        } catch (ex) {
            return next(ex);
        }
    };
};
