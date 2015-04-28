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
        var properties = {
            'code': null,
            'message': null
        };

        properties = fmval.utils.updateObject(properties, options);

        this._(setCode)(properties.code);
        this.setMessage(properties.message);
    };

    /**
     * @param {Function} privateMember
     * @returns {Function}
     */
    BaseValidator.member('_', function _(privateMember) {
        return function () {
            return privateMember.apply(this, Array.prototype.slice.call(arguments));
        }.bind(this);
    });

    /**
     * @type {Function}
     */
    BaseValidator.member('constructor', BaseValidator);

    /**
     * @param {String} value
     * @throws {ValidationError}
     * @returns {BaseValidator} The instance on which this method was called.
     */
    BaseValidator.member('run', function run(value) {
        if (!this.tester(value)) {
            throw new fmval.validators.ValidationError(this.message);
        }

        return this;
    });

    /**
     * @param {String} message
     * @throws {TypeError}
     * @returns {BaseValidator} The instance on which this method was called.
     */
    BaseValidator.member('setMessage', function setMessage(message) {

        if (typeof message !== 'string' || !message.length) {
            throw new TypeError("The property 'message' must be a not empty string.");
        }

        this.message = message;

        return this;
    });

    /**
     * @param {String} value
     * @returns {Boolean}
     */
    BaseValidator.member('tester', function tester(value) {
        return true;
    });


    var setCode = function setCode(code) {

        if (typeof code !== 'string' || !code.length) {
            throw new TypeError("The property 'code' must be a not empty string.");
        }

        this.code = code;

        return this;
    };


    return BaseValidator;

})();
