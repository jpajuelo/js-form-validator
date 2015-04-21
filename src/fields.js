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
var forms = {};


forms.BaseField = (function () {

    /**
     * @constructor
     * @param {Object.<String, *>} [options]
     */
    var BaseField = function BaseField(options) {
        var defaultOptions = {
            'maxLength': 1024,
            'minLength': 0,
            'pattern': null,
            'required': true
        };

        var defaultProps = {
            'label': null
        };

        defaultOptions = utils.updateObject(defaultOptions, options);
        defaultProps = utils.updateObject(defaultProps, options);

        this.label = defaultProps.label;
        this.initialValue = null;

        this.name = null;
        this.element = _createControl.call(this);
        this.validators = buildValidators(defaultOptions);

        this.helpText = null;
        this.errorMessage = document.createElement('p');
        this.errorMessage.className = "control-error";
    };

    /**
     * @abstract
     * @returns {HTMLElement}
     */
    BaseField.member('createControl', function createControl() {
        return null;
    });

    /**
     * @returns {HTMLElement}
     */
    BaseField.member('build', function build() {
        var fieldGroup, labelControl;

        fieldGroup = document.createElement('div');
        fieldGroup.className = "form-group";

        if (this.label) {
            labelControl = document.createElement('label');
            labelControl.className = "control-label";
            labelControl.textContent = this.label;

            fieldGroup.appendChild(labelControl);
        }

        fieldGroup.appendChild(this.element);
        fieldGroup.appendChild(this.errorMessage);

        return fieldGroup;
    });

    /**
     * @returns {BaseField} The instance on which this method was called.
     */
    BaseField.member('clean', function clean() {
        this.errorMessage.textContent = "";

        return this;
    });

    /**
     * @throws {TypeError}
     * @returns {String} The message of the error found.
     */
    BaseField.member('getErrorMessage', function getErrorMessage() {

        if (!(this.element instanceof HTMLElement)) {
            throw new TypeError("The element is not instance of HTMLElement.");
        }

        return this.errorMessage.textContent;
    });

    /**
     * @throws {TypeError}
     * @returns {String} The element value cleaned.
     */
    BaseField.member('getValue', function getValue() {

        if (!(this.element instanceof HTMLElement)) {
            throw new TypeError("The element is not instance of HTMLElement.");
        }

        return this.element.value.trim();
    });

    /**
     * @returns {Boolean} If the element value an error.
     */
    BaseField.member('hasError', function hasError() {
        var cleanedValue, found, i;

        cleanedValue = this.clean().getValue();

        for (found = false, i = 0; !found && i < this.validators.length; i++) {
            try {
                this.validators[i].validate(cleanedValue);
            } catch (e) {
                if (e instanceof validators.ValidationError) {
                    this.errorMessage.textContent = e.message;
                    found = true;
                }
            }
        }

        return found;
    });

    /**
     * @returns {BaseField} The instance on which this method was called.
     */
    BaseField.member('setName', function setName(fieldName) {

        if (!(this.element instanceof HTMLElement)) {
            throw new TypeError("The element is not instance of HTMLElement.");
        }

        this.name = fieldName;
        this.element.setAttribute('name', fieldName);

        return this;
    });


    var _createControl = function _createControl() {
        var newControl = this.createControl();

        if (!(newControl instanceof HTMLElement)) {
            throw new TypeError("The element is not instance of HTMLElement.");
        }

        newControl.addEventListener('input', function (event) {
            this.hasError();
        }.bind(this));

        return newControl;
    };

    var buildValidators = function buildValidators(options) {
        var validatorList = [];

        if (options.required) {
            validatorList.push(new validators.RequiredValidator());
        }

        if (options.minLength > 0) {
            validatorList.push(new validators.MinLengthValidator(options.minLength));
        }

        if (options.maxLength > options.minLength) {
            validatorList.push(new validators.MaxLengthValidator(options.maxLength));
        }

        if (options.pattern != null) {
            validatorList.push(new validators.RegexValidator(options.pattern));
        }

        return validatorList;
    };

    return BaseField;

})();


forms.TextField = (function () {

    /**
     * @constructor
     * @extends {BaseField}
     * @param {Object.<String, *>} [options]
     */
    var TextField = function TextField(options) {
        var defaultOptions = {
            'placeholder': null,
            'type': "text"
        };

        defaultOptions = utils.updateObject(defaultOptions, options);

        this.type = defaultOptions.type;
        this.placeholder = defaultOptions.placeholder;
        this.callParent(options);
    };

    TextField.inherit(forms.BaseField);

    /**
     * @override
     * @returns {HTMLElement}
     */
    TextField.member('createControl', function createControl() {
        var element;

        element = document.createElement('input');
        element.className = "form-control";
        element.type = this.type;

        if (this.placeholder != null) {
            element.placeholder = this.placeholder;
        }

        return element;
    });

    return TextField;

})();


forms.PasswordField = (function () {

    /**
     * @constructor
     * @extends {TextField}
     * @param {Object.<String, *>} [options]
     */
    var PasswordField = function PasswordField(options) {
        options = utils.updateObject(options);
        options.type = "password";

        this.callParent(options);
    };

    PasswordField.inherit(forms.TextField);

    return PasswordField;

})();


forms.LongTextField = (function () {

    /**
     * @constructor
     * @extends {BaseField}
     * @param {Object.<String, *>} [options]
     */
    var LongTextField = function LongTextField(options) {
        this.callParent(options);
    };

    LongTextField.inherit(forms.BaseField);

    /**
     * @override
     * @returns {HTMLElement}
     */
    LongTextField.member('createControl', function createControl() {
        var element;

        element = document.createElement('textarea');
        element.className = "form-control";

        return element;
    });

    return LongTextField;

})();
