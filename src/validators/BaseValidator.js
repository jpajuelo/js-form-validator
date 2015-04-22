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


fmval.validators.BaseValidator = (function () {

    /**
     * @constructor
     * @param {Object.<String, *>} [options]
     */
    var BaseValidator = function BaseValidator(options) {
        var defaultOptions = {
            'code': null,
            'message': null
        };

        defaultOptions = fmval.utils.updateObject(defaultOptions, options);

        this.code = defaultOptions.code;
        this.message = defaultOptions.message;
    };

    /**
     * @param {String} fieldValue
     * @returns {BaseValidator} The instance on which this method was called.
     */
    BaseValidator.member('validate', function validate(fieldValue) {
        return this;
    });

    return BaseValidator;

})();
