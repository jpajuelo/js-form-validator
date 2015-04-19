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

        this.options = utils.updateObject(defaultOptions, options);

        this.label = null;
        this.initialValue = null;

        this.name = null;
        this.element = this.buildElement();
        this.validators = buildValidators(this.options);

        this.helpText = null;
        this.errorMessage = null;
    };

    /**
     * @abstract
     * @access protected
     * @returns {HTMLElement}
     */
    BaseField.member('_buildElement', function _buildElement() {
        return null;
    });

    /**
     * @returns {BaseField} The instance on which this method was called.
     */
    BaseField.member('clean', function clean() {
        this.errorMessage = null;

        return this;
    });

    /**
     * @throws {TypeError}
     * @returns {String} The element value cleaned.
     */
    BaseField.member('getValue', function getValue() {

        if (!(this.element instanceof HTMLElement)) {
            throw new TypeError("The property 'element' must be a HTMLElement object.");
        }

        return this.element.value.trim();
    });

    /**
     * @returns {Boolean} If the element value an error.
     */
    BaseField.member('hasError', function hasError() {
        var cleanedValue, found, i;

        this.clean();

        cleanedValue = this.getValue();

        for (found = false, i = 0; !found && i < this.validators.length; i++) {
            try {
                this.validators[i].validate(cleanedValue);
            } catch (e) {
                if (e instanceof validators.ValidationError) {
                    this.errorMessage = e.message;
                    found = true;
                }
            }
        }

        return found;
    });


    var buildValidators = function buildValidators(options) {
        var validators = [];

        if (options.required) {
            validators.push(new validators.RequiredValidator());
        }

        if (options.minLength > 0) {
            validators.push(new validators.MinLengthValidator(options.minLength));
        }

        if (options.maxLength > options.minLength) {
            validators.push(new validators.MaxLengthValidator(options.maxLength));
        }

        if (options.pattern != null) {
            validators.push(new validators.RegexValidator(options.pattern));
        }

        return validators;
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
        this.parentClass.call(this, options);
    };

    TextField.inherit(forms.BaseField);

    /**
     * @override
     * @access protected
     * @returns {HTMLElement}
     */
    TextField.member('_buildElement', function _buildElement() {
        var element;

        element = document.createElement('input');
        element.className = "form-control";
        element.type = "text";

        return element;
    });

    return TextField;

})();


forms.PasswordField = (function () {

    /**
     * @constructor
     * @extends {BaseField}
     * @param {Object.<String, *>} [options]
     */
    var PasswordField = function PasswordField(options) {
        this.parentClass.call(this, options);
    };

    PasswordField.inherit(forms.BaseField);

    /**
     * @override
     * @access protected
     * @returns {HTMLElement}
     */
    PasswordField.member('_buildElement', function _buildElement() {
        var element;

        element = document.createElement('input');
        element.className = "form-control";
        element.type = "password";

        return element;
    });

    return PasswordField;

})();


forms.LongTextField = (function () {

    /**
     * @constructor
     * @extends {BaseField}
     * @param {Object.<String, *>} [options]
     */
    var LongTextField = function LongTextField(options) {
        this.parentClass.call(this, options);
    };

    LongTextField.inherit(forms.BaseField);

    /**
     * @override
     * @access protected
     * @returns {HTMLElement}
     */
    LongTextField.member('_buildElement', function _buildElement() {
        var element;

        element = document.createElement('textarea');
        element.className = "form-control";

        return element;
    });

    return LongTextField;

})();
