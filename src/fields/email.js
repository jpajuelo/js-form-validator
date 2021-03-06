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
     * [EmailField description]
     * @extends {TextField}
     *
     * @constructor
     * @param {String} name [description]
     * @param {Object.<String, *>} [options] [description]
     */
    ns.EmailField = utils.define({

        constructor: function EmailField(name, options) {
            this.superClass(name, utils.update(defaults, options));
        },

        inherit: ns.TextField

    });

    // ==================================================================================
    // PRIVATE MEMBERS
    // ==================================================================================

    var defaults = {
        regExp: utils.regexps.email,
        errorMessages: {
            invalid: "This field must be a valid email address."
        }
    };

})(plugin.fields, plugin.utils);
