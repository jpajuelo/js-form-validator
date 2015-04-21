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


/**
 * @namespace
 */
var validators = {};


validators.ValidationError = (function () {

    /**
     * @constructor
     * @param {String} message
     */
    var ValidationError = function ValidationError(message) {
        this.parentClass.captureStackTrace(this, this.constructor);
        this.message = message;

        this.element = document.createElement('div');
        this.element.className = "control-error";
        this.element.textContent = message;
    };

    ValidationError.inherit(Error);

    /**
     * @type {String}
     */
    ValidationError.member('name', "ValidationError");

    return ValidationError;

})();


validators.BaseValidator = (function () {

    /**
     * @constructor
     * @param {Object.<String, *>} [options]
     */
    var BaseValidator = function BaseValidator(options) {
        var defaultOptions = {
            'code': null,
            'message': null
        };

        options = utils.updateObject(defaultOptions, options);

        this.code = options.code;
        this.message = options.message;
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


validators.RequiredValidator = (function () {

    /**
     * @constructor
     * @extends {BaseValidator}
     * @param {Object.<String, *>} [options]
     */
    var RequiredValidator = function RequiredValidator(options) {
        var defaultOptions = {
            'code': 'required',
            'message': "This field is required."
        };

        this.callParent(utils.updateObject(defaultOptions, options));
    };

    RequiredValidator.inherit(validators.BaseValidator);

    /**
     * @override
     * @param {String} fieldValue
     * @throws {ValidationError}
     * @returns {RequiredValidator} The instance on which this method was called.
     */
    RequiredValidator.member('validate', function validate(fieldValue) {
        if (!fieldValue.length) {
            throw new validators.ValidationError(this.message);
        }

        return this;
    });

    return RequiredValidator;

})();


validators.MaxLengthValidator = (function () {

    /**
     * @constructor
     * @extends {BaseValidator}
     * @param {Number} maxLength
     * @param {Object.<String, *>} [options]
     */
    var MaxLengthValidator = function MaxLengthValidator(maxLength, options) {
        var defaultOptions = {
            'code': 'max_length',
            'message': "This field must not exceed %(maxLength)s chars."
        };

        defaultOptions.message = utils.formatString(defaultOptions.message, {
            'maxLength': maxLength
        });

        this.maxLength = maxLength;
        this.callParent(utils.updateObject(defaultOptions, options));
    };

    MaxLengthValidator.inherit(validators.BaseValidator);

    /**
     * @override
     * @param {String} fieldValue
     * @throws {ValidationError}
     * @returns {MaxLengthValidator} The instance on which this method was called.
     */
    MaxLengthValidator.member('validate', function validate(fieldValue) {
        if (fieldValue.length > this.maxLength) {
            throw new validators.ValidationError(this.message);
        }

        return this;
    });

    return MaxLengthValidator;

})();


validators.MinLengthValidator = (function () {

    /**
     * @constructor
     * @extends {BaseValidator}
     * @param {Number} minLength
     * @param {Object.<String, *>} [options]
     */
    var MinLengthValidator = function MinLengthValidator(minLength, options) {
        var defaultOptions = {
            'code': 'min_length',
            'message': "This field must contain at least %(minLength)s chars."
        };

        defaultOptions.message = utils.formatString(defaultOptions.message, {
            'minLength': minLength
        });

        this.minLength = minLength;
        this.callParent(utils.updateObject(defaultOptions, options));
    };

    MinLengthValidator.inherit(validators.BaseValidator);

    /**
     * @override
     * @param {String} fieldValue
     * @throws {ValidationError}
     * @returns {MinLengthValidator} The instance on which this method was called.
     */
    MinLengthValidator.member('validate', function validate(fieldValue) {
        if (fieldValue.length < this.minLength) {
            throw new validators.ValidationError(this.message);
        }

        return this;
    });

    return MinLengthValidator;

})();


validators.RegexValidator = (function () {

    /**
     * @constructor
     * @extends {BaseValidator}
     * @param {String|Regexp} pattern
     * @param {Object.<String, *>} [options]
     */
    var RegexValidator = function RegexValidator(pattern, options) {
        var defaultOptions = {
            'code': 'invalid',
            'message': "This field must be a valid value."
        };

        this.regex = new RegExp(pattern);
        this.callParent(utils.updateObject(defaultOptions, options));
    };

    RegexValidator.inherit(validators.BaseValidator);

    /**
     * @override
     * @param {String} fieldValue
     * @throws {ValidationError}
     * @returns {RegexValidator} The instance on which this method was called.
     */
    RegexValidator.member('validate', function validate(fieldValue) {
        if (!this.regex.test(fieldValue)) {
            throw new validators.ValidationError(this.message);
        }

        return this;
    });

    return RegexValidator;

})();
