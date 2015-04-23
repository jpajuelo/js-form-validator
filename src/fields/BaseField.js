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
     * @param {String} fieldName
     * @param {Object.<String, *>} [options]
     */
    var BaseField = function BaseField(fieldName, options) {
        var defaultOptions = {
            'maxLength': 1024,
            'minLength': 0,
            'pattern': null,
            'required': true
        };

        var defaultProps = {
            'label': null
        };

        defaultOptions = fmval.utils.updateObject(defaultOptions, options);
        defaultProps = fmval.utils.updateObject(defaultProps, options);

        this.formGroup = document.createElement('div');
        this.formGroup.className = "form-group";

        this.label = document.createElement('label');
        this.label.className = "control-label";
        this.setLabel(defaultProps.label);

        this.name = fieldName;
        this.validatorList = createValidatorList(defaultOptions);

        this.element = null;
        this.setControl(this.createControl());

        this.errorMessage = null;
        this.initialValue = null;
        this.helpText = null;
    };

    /**
     * @throws {TypeError}
     * @returns {BaseField} The instance on which this method was called.
     */
    BaseField.member('clean', function clean() {
        return emptyControl.call(this).removeErrorMessage.call(this);
    });

    /**
     * @abstract
     * @returns {HTMLElement}
     */
    BaseField.member('createControl', function createControl() {
        return null;
    });

    /**
     * @throws {TypeError}
     * @returns {HTMLElement}
     */
    BaseField.member('getControl', function getControl() {
        if (!(this.element instanceof HTMLElement)) {
            throw new TypeError("The control is not instance of HTMLElement.");
        }

        return this.element;
    });

    /**
     * @returns {String}
     */
    BaseField.member('getErrorMessage', function getErrorMessage() {
        return (this.errorMessage !== null) ? this.errorMessage.message : "";
    });

    /**
     * @throws {TypeError}
     * @returns {String}
     */
    BaseField.member('getValue', function getValue() {
        return this.getControl().getAttribute('value').trim();
    });

    /**
     * @throws {TypeError}
     * @returns {Boolean}
     */
    BaseField.member('hasError', function hasError() {
        var found, i, value;

        value = removeErrorMessage.call(this).getValue();

        for (found = false, i = 0; !found && i < this.validatorList.length; i++) {
            try {
                this.validatorList[i].validate(value);
            } catch (e) {
                this.setErrorMessage(e);
                found = true;
            }
        }

        return found;
    });

    /**
     * @param {ValidationError} fieldControl
     * @returns {BaseField} The instance on which this method was called.
     */
    BaseField.member('setControl', function setControl(fieldControl) {

        if (fieldControl instanceof HTMLElement) {

            fieldControl.addEventListener('input', function (event) {
                this.hasError();
            }.bind(this));

            this.element = fieldControl;
            this.setName(this.name);
        }

        return this;
    });

    /**
     * @param {ValidationError} fieldError
     * @returns {BaseField} The instance on which this method was called.
     */
    BaseField.member('setErrorMessage', function setErrorMessage(fieldError) {

        if (fieldError instanceof fmval.validators.ValidationError) {
            removeErrorMessage.call(this);

            if (fieldError.element.parentNode != this.fieldGroup) {
                this.fieldGroup.appendChild(fieldError.element);
            }

            this.errorMessage = fieldError;
        }

        return this;
    });

    /**
     * @param {String} fieldLabel
     * @returns {BaseField} The instance on which this method was called.
     */
    BaseField.member('setLabel', function setLabel(fieldLabel) {

        if (fieldLabel !== null) {
            this.label.textContent = fieldLabel;

            if (this.label.parentNode !== this.fieldGroup) {
                this.fieldGroup.insertBefore(this.label, this.fieldGroup.firstChild);
            }
        }

        return this;
    });

    /**
     * @throws {TypeError}
     * @returns {BaseField} The instance on which this method was called.
     */
    BaseField.member('setName', function setName(fieldName) {

        if (fieldName !== null) {
            this.getControl().setAttribute('name', fieldName);
            this.name = fieldName;
        }

        return this;
    });

    var createValidatorList = function createValidatorList(options) {
        var validatorList = [];

        if (options.required) {
            validatorList.push(new fmval.validators.RequiredValidator());
        }

        if (options.minLength > 0) {
            validatorList.push(new fmval.validators.MinLengthValidator(options.minLength));
        }

        if (options.maxLength > options.minLength) {
            validatorList.push(new fmval.validators.MaxLengthValidator(options.maxLength));
        }

        if (options.pattern !== null) {
            validatorList.push(new fmval.validators.RegexValidator(options.pattern));
        }

        return validatorList;
    };

    var emptyControl = function emptyControl() {
        this.getControl().value = "";

        return this;
    };

    var removeErrorMessage = function removeErrorMessage() {
        if (this.errorMessage !== null) {
            this.formGroup.removeChild(this.errorMessage.element);
            this.errorMessage = null;
        }

        return this;
    };

    return BaseField;

})();
