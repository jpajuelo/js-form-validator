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

    var defineClass  = utils.inheritance.defineClass,
        updateObject = utils.object.update,
        formatString = utils.string.format;

    // **********************************************************************************
    // CLASS DEFINITION
    // **********************************************************************************

    /**
     * [URISchemeValidator description]
     * @extends {AbstractValidator}
     *
     * @constructor
     * @param {String[]} schemes [description]
     * @param {Object.<String, *>} [options] [description]
     */
    ns.URISchemeValidator = defineClass({

        constructor: function URISchemeValidator(schemes, options) {
            this.superClass(updateObject(validatorDefaults, options));

            this.schemes = schemes;
            this.message = formatString(this.message, {
                schemes: schemes.join(" | ")
            });
        },

        inherit: ns.AbstractValidator,

        members: {

            /**
             * [checkout description]
             * @override
             *
             * @param {String} value [description]
             * @returns {Boolean} [description]
             */
            checkout: function checkout(value) {
                return this.schemes.indexOf(value.split("://")[0]) !== -1;
            },

            /**
             * [code description]
             * @override
             *
             * @type {String}
             */
            code: "invalid_scheme"

        }

    });

    // **********************************************************************************
    // PRIVATE MEMBERS
    // **********************************************************************************

    var validatorDefaults = {
        message: "The URI scheme must be (%(schemes)s)."
    };

})(plugin.validators, plugin.utils);
