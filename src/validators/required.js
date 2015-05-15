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


(function (ns) {

    "use strict";

    // **********************************************************************************
    // IMPORTS
    // **********************************************************************************

    var defineClass  = plugin.utils.inheritance.defineClass,
        updateObject = plugin.utils.object.update;

    // **********************************************************************************
    // CLASS DEFINITION
    // **********************************************************************************

    /**
     * [RequiredValidator description]
     * @extends {AbstractValidator}
     *
     * @constructor
     * @param {Object.<String, *>} [options] [description]
     */
    ns.RequiredValidator = defineClass({

        constructor: function RequiredValidator(options) {
            this.superClass(updateObject(validatorDefaults, options));
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
                return value.length > 0;
            },

            /**
             * [code description]
             * @override
             *
             * @type {String}
             */
            code: "required"

        }

    });

    // **********************************************************************************
    // PRIVATE MEMBERS
    // **********************************************************************************

    var validatorDefaults = {
        message: "This field is required."
    };

})(plugin.validators);
