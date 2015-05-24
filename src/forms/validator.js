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


(function (ns, utils) {

    "use strict";

    var defineClass     = utils.inheritance.defineClass,
        ValidationError = plugin.validators.ValidationError,
        states          = plugin.fields.states,
        AbstractField   = plugin.fields.AbstractField;

    // **********************************************************************************
    // CLASS DEFINITION
    // **********************************************************************************

    /**
     * [FormValidator description]
     *
     * @constructor
     * @param {String} name [description]
     * @param {AbstractField[]} fields [description]
     */
    ns.FormValidator = defineClass({

        constructor: function FormValidator(name, fields) {
            this.element = getFormElement(name);

            this.data = {};
            this.errors = {};
            this.fields = [];
            this.fieldsByName = {};

            fields.forEach(function (field) {
                this.addField(field);
            }, this);
        },

        members: {

            /**
             * [addErrorMessage description]
             *
             * @param {String} name [description]
             * @param {String} errorMessage [description]
             * @returns {FormValidator} The instance on which the member is called.
             */
            addErrorMessage: function addErrorMessage(name, errorMessage) {
                if (!(name in this.fieldsByName)){
                    throw new TypeError("[error description]");
                }

                this.fieldsByName[name].addError(new ValidationError(errorMessage));

                return this;
            },

            /**
             * [addField description]
             *
             * @param {AbstractField} field [description]
             * @returns {FormValidator} The instance on which the member is called.
             */
            addField: function addField(field) {
                if (!(field instanceof AbstractField)) {
                    throw new TypeError("[error description]");
                }

                field.attach('success', addFieldValue, this);
                field.attach('failure', addFieldError, this);

                return insertField.call(this, field);
            },

            /**
             * [addInitialValue description]
             *
             * @param {String} name [description]
             * @param {String} initialValue [description]
             * @returns {FormValidator} The instance on which the member is called.
             */
            addInitialValue: function addInitialValue(name, initialValue) {
                if (!(name in this.fieldsByName)){
                    throw new TypeError("[error description]");
                }

                this.fieldsByName[name].addInitialValue(initialValue);

                return this;
            },

            /**
             * [cleanAll description]
             *
             * @returns {FormValidator} The instance on which the member is called.
             */
            cleanAll: function cleanAll() {
                this.fields.forEach(function (field) {
                    cleanField.call(this, field);
                }, this);

                return this;
            },

            /**
             * [get description]
             *
             * @returns {HTMLFormElement} [description]
             */
            get: function get() {
                return this.element;
            },

            /**
             * [isValid description]
             *
             * @returns {Boolean} [description]
             */
            isValid: function isValid() {
                return this.fields.every(function (field) {
                    field.validate();

                    return !Object.keys(this.errors).length;
                }, this);
            }

        }

    });

    // **********************************************************************************
    // PRIVATE MEMBERS
    // **********************************************************************************

    var addFieldError = function addFieldError(errorMessage, field) {
        var name = field.name;

        this.errors[name] = errorMessage;
        delete this.data[name];

        return this;
    };

    var addFieldValue = function addFieldValue(value, field) {
        var name = field.name;

        this.data[name] = value;
        delete this.errors[name];

        return this;
    };

    var cleanField = function cleanField(field) {
        var name = field.name;

        field.clean();

        delete this.data[name];
        delete this.errors[name];

        return this;
    };

    var getFormElement = function getFormElement(name) {
        if (!(document.forms[name] instanceof HTMLFormElement)) {
            throw new TypeError("[error description");
        }

        return document.forms[name];
    };

    var insertField = function insertField(field) {
        var n = this.fields.length,
            refElem = n ? this.fields[n - 1].get().nextSibling: this.get().firstChild;

        this.fields.push(field);
        this.fieldsByName[field.name] = field;
        this.element.insertBefore(field.get(), refElem);

        return this;
    };

})(plugin.forms, plugin.utils);
