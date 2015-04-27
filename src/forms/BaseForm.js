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


fmval.forms.BaseForm = (function () {

    /**
     * @constructor
     * @param {String} name
     * @param {Array.<BaseField>} fields
     */
    var BaseForm = function BaseForm(name, fields) {
        var i;

        this.element = findFormElement(name);
        this.fields = {};

        for (i = 0; i < fields.length; i++) {
            this.addField(fields[i]);
        }

        this.data = {};
        this.errors = {};
    };

    /**
     * @param {Function} privateMember
     * @returns {Function}
     */
    BaseForm.member('_', function _(privateMember) {
        return function () {
            return privateMember.apply(this, Array.prototype.slice.call(arguments));
        }.bind(this);
    });

    /**
     * @param {BaseField} field
     * @returns {BaseForm} The instance on which this method was called.
     */
    BaseForm.member('addField', function addField(field) {

        if (!(field instanceof fmval.fields.BaseField)) {
            throw new TypeError("The argument 'field' must be an instance of BaseField.");
        }

        if (field.name in this.element.elements) {
            field.setControl(this.element.elements[field.name]);
        }

        this.fields[field.name] = field;

        return this;
    });

    /**
     * @returns {BaseForm} The instance on which this method was called.
     */
    BaseForm.member('build', function build() {
        var i, names;

        names = Object.keys(this.fields);

        for (i = names.length - 1; i >= 0; i--) {
            this.element.insertBefore(this.fields[names[i]].element, this.element.firstChild);
        }

        return this;
    });

    /**
     * @param {String} fieldName
     * @param {String} errorMessage
     * @returns {BaseForm} The instance on which this method was called.
     */
    BaseForm.member('setErrorMessage', function setErrorMessage(name, errorMessage) {

        this._(findField)(name).setError(new fmval.validators.ValidationError(errorMessage));

        return this._(addFieldError)(name);
    });

    /**
     * @param {String} fieldName
     * @param {String} initialValue
     * @returns {BaseForm} The instance on which this method was called.
     */
    BaseForm.member('setInitialValue', function setInitialValue(name, initialValue) {

        this._(findField)(name).setInitialValue(initialValue);

        return this;
    });

    /**
     * @returns {BaseForm} The instance on which this method was called.
     */
    BaseForm.member('cleanAll', function cleanAll() {
        var name;

        for (name in this.fields) {
            this._(cleanField)(name);
        }

        return this;
    });

    /**
     * @type {Function}
     */
    BaseForm.member('constructor', BaseForm);

    /**
     * @param {String} name
     * @returns {Boolean}
     */
    BaseForm.member('hasError', function hasError(name) {
        var errorFound;

        errorFound = this._(findField)(name).hasError();

        if (errorFound) {
            this._(addFieldError)(name);
        } else {
            this._(addFieldValue)(name);
        }

        return errorFound;
    });

    /**
     * @returns {Boolean}
     */
    BaseForm.member('isValid', function isValid() {
        var name;

        for (name in this.fields) {
            this.hasError(name);
        }

        return !Object.keys(this.errors).length;
    });


    var addFieldError = function addFieldError(name) {

        this.errors[name] = this.fields[name].getErrorMessage();
        delete this.data[name];

        return this;
    };

    var addFieldValue = function addFieldValue(name) {

        this.data[name] = this.fields[name].getValue();
        delete this.errors[name];

        return this;
    };

    var cleanField = function cleanField(name) {

        this.fields[name].clean();

        delete this.data[name];
        delete this.errors[name];

        return this;
    };

    var findField = function findField(name) {

        if (!(name in this.fields)) {
            throw new TypeError(fmval.utils.formatString("The field '%(name)s' is not found.", {
                'name': name
            }));
        }

        return this.fields[name];
    };

    var findFormElement = function findFormElement(name) {

        if (!(document.forms[name] instanceof HTMLFormElement)) {
            throw new TypeError(fmval.utils.formatString("The form '%(name)s' must be an instance of HTMLFormElement.", {
                'name': name
            }));
        }

        return document.forms[name];
    };

    return BaseForm;

})();
