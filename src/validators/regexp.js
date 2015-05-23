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
     * @param {RegExp} regExp [description]
     * @param {Object.<String, *>} [options] [description]
     */
    ns.RegExpValidator = defineClass({

        constructor: function RegExpValidator(regExp, options) {
            this.regExp = regExp;
            this.superClass(updateObject(defaults, options));
        },

        inherit: ns.AbstractValidator,

        members: {

            /**
             * [checkout description]
             * @override
             *
             * @param {String} value [description]
             * @param {AbstractField} field [description]
             * @returns {Boolean} [description]
             */
            checkout: function checkout(value, field) {
                return this.regExp.test(value);
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

    var defaults = {
        message: "This field must be a valid value."
    };

})(plugin.validators, plugin.utils);
