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


(function (ns, utils) {

    "use strict";

    // ==================================================================================
    // PRIVATE MEMBERS
    // ==================================================================================

    var defaults = {
        controlClass:  "field-control",
        controlId:     "id_%(name)s",
        errorClass:    "field-error",
        errorTag:      "p",
        fieldClass:    "form-field",
        fieldTag:      "div",
        helpTextClass: "field-helptext",
        helpTextTag:   "p",
        labelClass:    "field-label",
        labelTag:      "label"
    };

    var user = {};

    // ==================================================================================
    // NAMESPACE DEFINITION
    // ==================================================================================

    /**
     * @namespace [description]
     */
    ns.settings = {

        /**
         * [clean description]
         */
        clean: function clean() {
            user = {};
        },

        /**
         * [get description]
         *
         * @param {String} name [description]
         * @returns {String} [description]
         */
        get: function get(name) {
            if (!(name in defaults)) {
                throw new TypeError("[error description]");
            }

            return name in user ? user[name] : defaults[name];
        },

        /**
         * [update description]
         *
         * @param {Object.<String, *>} options [description]
         */
        update: function update(options) {
            user = utils.update(defaults, options);
        }

    };

})(plugin, plugin.utils);
