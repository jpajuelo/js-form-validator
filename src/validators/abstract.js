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
     * [AbstractValidator description]
     *
     * @constructor
     * @param {Object.<String, *>} [options] [description]
     */
    ns.AbstractValidator = defineClass({

        constructor: function AbstractValidator(options) {
            options = updateObject(validatorDefaults, options);
            this.message = options.message;
        },

        members: {

            /**
             * [checkout description]
             *
             * @param {Boolean|Number|String} value [description]
             * @returns {Boolean} [description]
             */
            checkout: function checkout(value) {
                return true;
            },

            /**
             * [code description]
             *
             * @type {String}
             */
            code: "not_provided",

            /**
             * [trigger description]
             *
             * @param {Boolean|Number|String} value [description]
             * @returns {AbstractValidator} The instance on which the member is called.
             */
            trigger: function trigger(value) {

                if (!this.checkout(value)) {
                    throw new ns.ValidationError(this.message);
                }

                return this;
            }

        }

    });

    // **********************************************************************************
    // PRIVATE MEMBERS
    // **********************************************************************************

    var validatorDefaults = {
        message: "The error was not specified."
    };

})(plugin.validators, plugin.utils);
