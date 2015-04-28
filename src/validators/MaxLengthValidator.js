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
     * @extends {BaseValidator}
     *
     * @constructor
     * @param {Number} maxLength
     * @param {Object.<String, *>} [options]
     */
    var MaxLengthValidator = function MaxLengthValidator(maxLength, options) {
        var properties = {
            'code': "maxlength",
            'message': "This field must not exceed %(maxLength)s chars."
        };

        properties.message = fmval.utils.formatString(properties.message, {
            'maxLength': maxLength
        });

        this.callParent(fmval.utils.updateObject(properties, options));
        this.maxLength = maxLength;
    };

    MaxLengthValidator.inherit(fmval.validators.BaseValidator);

    /**
     * @override
     *
     * @param {String} value
     * @returns {Boolean}
     */
    MaxLengthValidator.member('tester', function tester(value) {
        return value.length <= this.maxLength;
    });


    return MaxLengthValidator;

})();
