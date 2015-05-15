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
     * [MinLengthValidator description]
     * @extends {AbstractValidator}
     *
     * @constructor
     * @param {Number} minlength [description]
     * @param {Object.<String, *>} [options] [description]
     */
    ns.MinLengthValidator = defineClass({

        constructor: function MinLengthValidator(minlength, options) {
            this.superClass(updateObject(validatorDefaults, options));

            this.minlength = minlength;
            this.message   = formatString(this.message, {
                minlength: minlength
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
                return value.length >= this.minlength;
            },

            /**
             * [code description]
             * @override
             *
             * @type {String}
             */
            code: "minlength"

        }

    });

    // **********************************************************************************
    // PRIVATE MEMBERS
    // **********************************************************************************

    var validatorDefaults = {
        message: "This field must contain at least %(minlength)s chars."
    };

})(plugin.validators, plugin.utils);
