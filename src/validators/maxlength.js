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
     * [MaxLengthValidator description]
     * @extends {AbstractValidator}
     *
     * @constructor
     * @param {Number} maxlength [description]
     * @param {Object.<String, *>} [options] [description]
     */
    ns.MaxLengthValidator = defineClass({

        constructor: function MaxLengthValidator(maxlength, options) {
            this.maxlength = maxlength;
            this.superClass(updateObject(defaults, options));
        },

        inherit: ns.AbstractValidator,

        members: {

            /**
             * [addMessage description]
             *
             * @param {String} message [description]
             * @returns {MaxLengthValidator} The instance on which the member is called.
             */
            addMessage: function addMessage(message) {
                this.message = formatString(message, {
                    maxlength: this.maxlength
                });

                return this;
            },

            /**
             * [checkout description]
             * @override
             *
             * @param {String} value [description]
             * @returns {Boolean} [description]
             */
            checkout: function checkout(value) {
                return value.length <= this.maxlength;
            },

            /**
             * [code description]
             * @override
             *
             * @type {String}
             */
            code: "maxlength"

        }

    });

    // **********************************************************************************
    // PRIVATE MEMBERS
    // **********************************************************************************

    var defaults = {
        message: "This field must not exceed %(maxlength)s chars."
    };

})(plugin.validators, plugin.utils);
