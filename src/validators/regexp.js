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
        updateObject = utils.object.update;

    // **********************************************************************************
    // CLASS DEFINITION
    // **********************************************************************************

    /**
     * [RegExpValidator description]
     * @extends {AbstractValidator}
     *
     * @constructor
     * @param {RegExp} regexp [description]
     * @param {Object.<String, *>} [options] [description]
     */
    ns.RegExpValidator = defineClass({

        constructor: function RegExpValidator(regexp, options) {
            this.superClass(updateObject(validatorDefaults, options));
            this.regexp = regexp;
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
                return this.regexp.test(value);
            },

            /**
             * [code description]
             * @override
             *
             * @type {String}
             */
            code: "invalid"

        }

    });

    // **********************************************************************************
    // PRIVATE MEMBERS
    // **********************************************************************************

    var validatorDefaults = {
        message: "This field must be a valid value."
    };

})(plugin.validators, plugin.utils);
