/**
 *  Copyright 2015 Jaime Pajuelo
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */


"use strict";


/**
 * @namespace
 */
fmval.settings.defaults = {

    /**
     * @type {String}
     */
    controlClass: "form-control",

    /**
     * @type {String}
     */
    controlId: "id_%(name)s",

    /**
     * @type {String}
     */
    errorClass: "control-error",

    /**
     * @type {String}
     */
    labelClass: "control-label"

};


/**
 * @namespace
 */
fmval.settings.locals = {};


/**
 * @param {String} name
 * @returns {String|Number}
 */
fmval.getOption = function getOption(name) {
    if (!(name in fmval.settings.defaults)) {
        throw new TypeError(fmval.utils.formatString("The option '%(name)s' is not found.", {
            'name': name
        }));
    }

    return (name in fmval.settings.locals) ? fmval.settings.locals[name] : fmval.settings.defaults[name];
};


/**
 * @param {Object.<String, *>} options
 */
fmval.updateSettings = function updateSettings(options) {
    fmval.settings.locals = fmval.utils.updateObject(fmval.settings.defaults, options);
};


fmval.cleanCache = function cleanCache() {
    fmval.settings.locals = {};
};
