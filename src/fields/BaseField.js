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


fmval.fields.BaseField = (function () {

    /**
     * @constructor
     * @param {String} name
     * @param {Object.<String, *>} [options]
     * @throws {TypeError}
     */
    var BaseField = function BaseField(name, options) {
        var defaults = {
            'errorMessages': {},
            'maxLength': 1024,
            'minLength': 0,
            'pattern': null,
            'required': true
        };

        var properties = {
            'initialValue': null,
            'label': null
        };

        defaults = fmval.utils.updateObject(defaults, options);
        properties = fmval.utils.updateObject(properties, options);

        this.formGroup = document.createElement('div');
        this.formGroup.className = "form-group";

        this.error = null;
        this.helpText = null;

        this._(buildDefaultControl)();
        this._(setName)(name);
        this.setInitialValue(properties.initialValue);

        this._(setValidators)(defaults);
        this._(setLabel)(properties.label);
    };

    /**
     * @param {Function} privateMember
     * @returns {Function}
     */
    BaseField.member('_', function _(privateMember) {
        return function () {
            return privateMember.apply(this, Array.prototype.slice.call(arguments));
        }.bind(this);
    });

    /**
     * @returns {BaseField} The instance on which this method was called.
     */
    BaseField.member('clean', function clean() {
        return this.setInitialValue(this.initialValue)._(removeError)();
    });

    /**
     * @type {Function}
     */
    BaseField.member('constructor', BaseField);

    /**
     * @abstract
     * @returns {HTMLElement}
     */
    BaseField.member('createControl', function createControl() {
        return null;
    });

    /**
     * @throws {TypeError}
     * @returns {String}
     */
    BaseField.member('getErrorMessage', function getErrorMessage() {
        if (!(this.error instanceof fmval.validators.ValidationError)) {
            throw new TypeError("The property 'error' must be an instance of ValidationError.");
        }

        return this.error.message;
    });

    /**
     * @returns {String}
     */
    BaseField.member('getValue', function getValue() {
        return this.element.value.trim();
    });

    /**
     * @throws {TypeError}
     * @returns {Boolean}
     */
    BaseField.member('hasError', function hasError() {
        var found, i, value;

        value = this._(removeError)().getValue();

        for (found = false, i = 0; !found && i < this.validators.length; i++) {
            try {
                this.validators[i].run(value);
            } catch (e) {
                this.setError(e);
                found = true;
            }
        }

        return found;
    });

    /**
     * @param {HTMLElement} control
     * @throws {TypeError}
     * @returns {BaseField} The instance on which this method was called.
     */
    BaseField.member('setControl', function setControl(control) {

        if (!(control instanceof this.element.constructor)) {
            throw new TypeError(fmval.utils.formatString("The property 'element' must be an instance of %(name)s.", {
                'name': this.element.constructor.name
            }));
        }

        this.element = control;
        this._(setName)(this.name);
        this.setInitialValue(this.initialValue);

        return this;
    });

    /**
     * @param {ValidationError} error
     * @throws {TypeError}
     * @returns {BaseField} The instance on which this method was called.
     */
    BaseField.member('setError', function setError(error) {

        if (!(error instanceof fmval.validators.ValidationError)) {
            throw new TypeError("The property 'error' must be an instance of ValidationError.");
        }

        this._(removeError)();
        this.formGroup.appendChild(error.element);
        this.error = error;

        return this;
    });

    /**
     * @param {String} initialValue
     * @throws {TypeError}
     * @returns {BaseField} The instance on which this method was called.
     */
    BaseField.member('setInitialValue', function setInitialValue(initialValue) {

        if (initialValue !== null && typeof initialValue !== 'string') {
            throw new TypeError("The property 'initialValue' must be a string or null.");
        }

        if (initialValue !== null && initialValue.length > 0) {
            this.element.value = initialValue;
            this.initialValue = initialValue;
        } else {
            this.element.value = "";
            this.initialValue = null;
        }

        return this;
    });


    var buildDefaultControl = function buildDefaultControl() {

        this.element = this.createControl();

        if (!(this.element instanceof HTMLElement)) {
            throw new TypeError("The property 'element' must be an instance of HTMLElement.");
        }

        this.element.className = fmval.getOption('controlClass');
        this.formGroup.appendChild(this.element);

        return this;
    };

    var removeError = function removeError() {
        if (this.error instanceof fmval.validators.ValidationError) {
            this.formGroup.removeChild(this.error.element);
        }

        this.error = null;

        return this;
    };

    var setLabel = function setLabel(label) {

        if (label !== null && typeof label !== 'string') {
            throw new TypeError("The property 'label' must be a string or null.");
        }

        if (label !== null && label.length > 0) {
            this.label = document.createElement('label');

            this.label.className = fmval.getOption('labelClass');
            this.label.textContent = label;
            this.label.setAttribute('for', this.element.id);

            this.formGroup.insertBefore(this.label, this.element);
        } else {
            this.label = null;
        }

        return this;
    };

    var setName = function setName(name) {

        if (typeof name !== 'string' || !name.length) {
            throw new TypeError("The property 'name' must be a not empty string.");
        }

        this.element.name = name;
        this.name = name;

        this.element.id = fmval.utils.formatString(fmval.getOption('controlId'), {
            'name': name
        });

        return this;
    };

    var setValidator = function setValidator(validator, errorMessages) {

        if (validator.code in errorMessages) {
            validator.setMessage(errorMessages[validator.code]);
        }

        this.validators.push(validator);

        return this;
    };

    var setValidators = function setValidators(options) {
        var validator;

        this.validators = [];

        if (options.required) {
            this._(setValidator)(new fmval.validators.RequiredValidator(), options.errorMessages);
        }

        if (options.minLength > 0) {
            this._(setValidator)(new fmval.validators.MinLengthValidator(options.minLength), options.errorMessages);
        }

        if (options.maxLength > options.minLength) {
            this._(setValidator)(new fmval.validators.MaxLengthValidator(options.maxLength), options.errorMessages);
        }

        if (options.pattern !== null) {
            this._(setValidator)(new fmval.validators.RegexValidator(options.pattern), options.errorMessages);
        }

        return this;
    };


    return BaseField;

})();
