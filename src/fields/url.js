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
    // CLASS DEFINITION
    // ==================================================================================

    /**
     * [URLField description]
     * @extends {TextField}
     *
     * @constructor
     * @param {String} name [description]
     * @param {Object.<String, *>} [options] [description]
     */
    ns.URLField = utils.define({

        constructor: function URLField(name, options) {
            this.superClass(name, addValidator(utils.update(defaults, options)));
        },

        inherit: ns.TextField

    });

    // ==================================================================================
    // PRIVATE MEMBERS
    // ==================================================================================

    var defaults = {
        regExp: utils.regexps.url,
        schemes: [],
        validators: [],
        errorMessages: {
            invalid: "This field must be a valid URL.",
            invalid_scheme: "The URI scheme must be (%(schemes)s)."
        }
    };

    var addValidator = function addValidator(options) {

        if (options.schemes.length) {
            options.validators.unshift(cleanInvalidScheme.bind(options));
        }

        return options;
    };

    var cleanInvalidScheme = function cleanInvalidScheme(value, field) {

        if (value && this.schemes.indexOf(value.split("://")[0]) < 0) {
            throw new ns.ValidationError(this.errorMessages.invalid_scheme, {
                schemes: this.schemes.join(" | ")
            });
        }

        return value;
    };

})(plugin.fields, plugin.utils);
