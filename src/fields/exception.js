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


(function (ns, utils, user) {

    "use strict";

    // **********************************************************************************
    // CLASS DEFINITION
    // **********************************************************************************

    /**
     * [ValidationError description]
     * @extends {Error}
     *
     * @constructor
     * @param {String} message [description]
     * @param {Object.<String, *>} [namedArgs] [description]
     */
    ns.ValidationError = utils.define({

        constructor: function ValidationError(message, namedArgs) {
            this.element = document.createElement(user.get('errorTag'));
            this.element.className = user.get('errorClass');

            this.message = utils.format(message, namedArgs);
            this.element.textContent = this.message;
        },

        inherit: Error,

        members: {

            /**
             * [get description]
             *
             * @returns {HTMLElement} [description]
             */
            get: function get() {
                return this.element;
            },

            /**
             * [name description]
             * @override
             *
             * @type {String}
             */
            name: 'ValidationError'

        }

    });

})(plugin.fields, plugin.utils, plugin.settings);
