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


fmval.validators.MaxLengthValidator = (function () {

    /**
     * @constructor
     * @extends {BaseValidator}
     * @param {Number} maxLength
     * @param {Object.<String, *>} [options]
     */
    var MaxLengthValidator = function MaxLengthValidator(maxLength, options) {
        var defaultOptions = {
            'code': "max_length",
            'message': "This field must not exceed %(maxLength)s chars."
        };

        defaultOptions.message = fmval.utils.formatString(defaultOptions.message, {
            'maxLength': maxLength
        });

        this.maxLength = maxLength;

        this.callParent(fmval.utils.updateObject(defaultOptions, options));
    };

    MaxLengthValidator.inherit(fmval.validators.BaseValidator);

    /**
     * @override
     * @param {String} fieldValue
     * @throws {ValidationError}
     * @returns {MaxLengthValidator} The instance on which this method was called.
     */
    MaxLengthValidator.member('validate', function validate(fieldValue) {
        if (fieldValue.length > this.maxLength) {
            throw new fmval.validators.ValidationError(this.message);
        }

        return this;
    });

    return MaxLengthValidator;

})();
