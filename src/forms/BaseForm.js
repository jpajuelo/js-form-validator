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
     * @param {String} formName
     * @param {Array.<BaseField>} fieldList
     */
    var BaseForm = function BaseForm(formName, fieldList) {
        var i;

        this.element = findFormElement(formName);
        this.fieldGroup = {};

        for (i = 0; i < fieldList.length; i++) {
            this.addField(fieldList[i]);
        }

        this.data = {};
        this.errors = {};
    };

    /**
     * @param {String} fieldName
     * @param {ValidationError} errorMessage
     * @returns {BaseForm} The instance on which this method was called.
     */
    BaseForm.member('addError', function addError(fieldName, errorMessage) {

        findField.call(this, fieldName).setErrorMessage(errorMessage);
        addFieldError.call(this, fieldName);

        return this;
    });

    /**
     * @param {BaseField} field
     * @returns {BaseForm} The instance on which this method was called.
     */
    BaseForm.member('addField', function addField(field) {

        if (!(field instanceof fmval.fields.BaseField)) {
            throw new TypeError("The field is not instance of BaseField.");
        }

        if (field.name in this.element.elements) {
            field.setControl(this.element.elements[field.name]);
        }

        this.fieldGroup[field.name] = field;

        return this;
    });

    /**
     * @param {String} fieldName
     * @param {String} initialValue
     * @returns {BaseForm} The instance on which this method was called.
     */
    BaseForm.member('addInitialValue', function addInitialValue(fieldName, initialValue) {
        return this;
    });

    /**
     * @returns {BaseForm} The instance on which this method was called.
     */
    BaseForm.member('build', function build() {
        var i, nameList;

        nameList = Object.keys(this.fieldGroup);

        for (i = nameList.length - 1; i >= 0; i--) {
            this.element.insertBefore(this.fieldGroup[nameList[i]], this.element.firstChild);
        }

        return this;
    });

    /**
     * @returns {BaseForm} The instance on which this method was called.
     */
    BaseForm.member('cleanAll', function cleanAll() {
        var fieldName;

        for (fieldName in this.fieldGroup) {
            cleanField.call(this, fieldName);
        }

        return this;
    });

    /**
     * @param {String} fieldName
     * @returns {Boolean}
     */
    BaseForm.member('hasError', function hasError(fieldName) {
        var errorFound;

        errorFound = findField.call(this, fieldName).hasError();

        if (errorFound) {
            addFieldError.call(this, fieldName);
        } else {
            addFieldValue.call(this, fieldName);
        }

        return errorFound;
    });

    /**
     * @returns {Boolean}
     */
    BaseForm.member('isValid', function isValid() {
        var fieldName;

        for (fieldName in this.fieldGroup) {
            this.hasError(fieldName);
        }

        return !Object.keys(this.errors).length;
    });


    var addFieldError = function addFieldError(fieldName) {

        this.errors[fieldName] = this.fieldGroup[fieldName].getErrorMessage();
        delete this.data[fieldName];

        return this;
    };

    var addFieldValue = function addFieldValue(fieldName) {

        this.data[fieldName] = this.fieldGroup[fieldName].getValue();
        delete this.errors[fieldName];

        return this;
    };

    var cleanField = function cleanField(fieldName) {

        this.fieldGroup[fieldName].clean();

        delete this.data[fieldName];
        delete this.errors[fieldName];

        return this;
    };

    var findField = function findField(fieldName) {

        if (!(fieldName in this.fieldGroup)) {
            throw new TypeError(fmval.utils.formatString("The field %(name)s is not found.", {
                'name': fieldName
            }));
        }

        return this.fieldGroup[fieldName];
    };

    var findFormElement = function findFormElement(formName) {

        if (!(document.forms[formName] instanceof HTMLFormElement)) {
            throw new TypeError(fmval.utils.formatString("The form %(name)s is not instance of HTMLFormElement.", {
                'name': formName
            }));
        }

        return document.forms[formName];
    };

    return BaseForm;

})();
