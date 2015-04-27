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


"use strict";


fmval.validators.RegexValidator = (function () {

    /**
     * @extends {BaseValidator}
     *
     * @constructor
     * @param {String|Regexp} pattern
     * @param {Object.<String, *>} [options]
     */
    var RegexValidator = function RegexValidator(pattern, options) {
        var properties = {
            'code': "invalid",
            'message': "This field must be a valid value."
        };

        this.callParent(fmval.utils.updateObject(properties, options));
        this.regex = new RegExp(pattern);
    };

    RegexValidator.inherit(fmval.validators.BaseValidator);

    /**
     * @override
     *
     * @param {String} value
     * @returns {Boolean}
     */
    RegexValidator.member('tester', function tester(value) {
        return this.regex.test(value);
    });


    return RegexValidator;

})();
