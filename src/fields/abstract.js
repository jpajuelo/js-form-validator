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

    var defineClass        = utils.inheritance.defineClass,
        updateObject       = utils.object.update,
        formatString       = utils.string.format,
        getSetting         = plugin.settings.get,
        ValidationError    = plugin.validators.ValidationError,
        RequiredValidator  = plugin.validators.RequiredValidator,
        EventCapturerMixin = plugin.mixins.EventCapturerMixin;

    // **********************************************************************************
    // CLASS DEFINITION
    // **********************************************************************************

    /**
     * [AbstractField description]
     *
     * @constructor
     * @param {String} name [description]
     * @param {Object.<String, *>} [options] [description]
     */
    ns.AbstractField = defineClass({

        constructor: function AbstractField(name, options) {
            options = updateObject(defaults, options);

            this.state = ns.states.CLEANED;
            this.name  = this._(getName, name);
            this.error = null;

            this.label    = this._(getLabel, options);
            this.control  = this._(getControl, options);
            this.helpText = this._(getHelpText, options);

            this._(addAttrs, options.controlAttrs);

            this.element    = this._(createElement);
            this.validators = this._(getValidators, options);
            this.pendings   = [];

            Object.defineProperty(this, 'errorMessage', {
                get: function get() {
                    return this.error instanceof ValidationError ? this.error.message : null;
                }
            });

            Object.defineProperty(this, 'value', {
                get: function get() {
                    return this.control.value.trim();
                }
            });

            this.mixinClass(0, ['failure', 'pending', 'success']);
        },

        mixins: [EventCapturerMixin],

        members: {

            /**
             * [addAttr description]
             *
             * @param {String} name [description]
             * @param {String|Number|Boolean} value [description]
             * @returns {BaseControl} The instance on which the method is called.
             */
            addAttr: function addAttr(name, value) {
                this.control.setAttribute(name, value);

                return this;
            },

            /**
             * [addError description]
             *
             * @param {ValidationError} error [description]
             * @returns {AbstractField} The instance on which the method is called.
             */
            addError: function addError(error) {
                return this.clean()._(insertError, error);
            },

            /**
             * [addValidator description]
             *
             * @param {AbstractValidator|Function} validator [description]
             */
            addValidator: function addValidator(validator) {
                this.validators.push(validator);

                return this;
            },

            /**
             * [clean description]
             *
             * @returns {AbstractField} The instance on which the method is called.
             */
            clean: function clean() {
                switch (this.state) {
                case ns.states.FAILURE:
                    this._(removeError);
                    break;
                }

                this.state = ns.states.CLEANED;

                return this;
            },

            /**
             * [validate description]
             *
             * @returns {AbstractField} The instance on which the method is called.
             */
            validate: function validate() {
                var hasError = this.clean()._(findError, this.validators, this.value);

                return hasError ? this : this._(dispatchSuccess);
            }

        }

    });

    // **********************************************************************************
    // PRIVATE MEMBERS
    // **********************************************************************************

    var defaults = {
        required:      true,
        label:         "",
        helpText:      "",
        controlTag:    "",
        controlAttrs:  {},
        validators:    [],
        errorMessages: {}
    };

    var addAttrs = function addAttrs(controlAttrs) {

        for (var name in controlAttrs) {
            this.addAttr(name, controlAttrs[name]);
        }

        return this;
    };

    var createElement = function createElement() {
        var element = document.createElement(getSetting('fieldTag'));

        element.className = getSetting('fieldClass');

        if (this.label !== null) {
            element.appendChild(this.label);

            if (this.control.id) {
                this.label.setAttribute('for', this.control.id);
            }
        }

        element.appendChild(this.control);

        if (this.helpText !== null) {
            element.appendChild(this.helpText);
        }

        return element;
    };

    var dispatchSuccess = function dispatchSuccess() {
        this.state = ns.states.SUCCESS;

        return this.dispatch('success', this);
    };

    var findError = function findError(validators, value) {
        return validators.some(function (validator, index) {
            return this._(triggerValidator, index, validator, value);
        }, this);
    };

    var getControl = function getControl(options) {
        var control   = document.createElement(options.controlTag),
            controlId = this._(getId, options.controlAttrs);

        if (controlId) {
            control.setAttribute('id', controlId);
        }

        control.className = getSetting('controlClass');
        control.name      = this.name;

        return control;
    };

    var getHelpText = function getHelpText(options) {
        var helpText = null;

        if (options.helpText) {
            helpText = document.createElement(getSetting('helpTextTag'));
            helpText.className   = getSetting('helpTextClass');
            helpText.textContent = options.helpText;
        }

        return helpText;
    };

    var getId = function getId(controlAttrs) {
        var id = controlAttrs.id ? controlAttrs.id : getSetting('controlId');

        delete controlAttrs.id;

        return formatString(id, {
            name: this.name
        });
    };

    var getLabel = function getLabel(options) {
        var label = null;

        if (options.label) {
            label = document.createElement(getSetting('labelTag'));
            label.className   = getSetting('labelClass');
            label.textContent = options.label;
        }

        return label;
    };

    var getName = function getName(name) {

        if (typeof name !== 'string' || !name.length) {
            throw new TypeError("The name must be a not-empty string.");
        }

        return name;
    };

    var getValidators = function getValidators(options) {

        if (options.required) {
            options.validators.unshift(new RequiredValidator());
        }

        return options.validators.map(function (validator) {

            if (validator.code in options.errorMessages) {
                validator.addMessage(options.errorMessages[validator.code]);
            }

            return validator;
        });
    };

    var handlePending = function handlePending(errorMessage) {

        if (typeof errorMessage === 'string' && errorMessage.length) {
            this._(insertError, new ValidationError(errorMessage));
            this.pendings.length = 0;
            delete this.latestValue;
        } else {
            if (!this._(findError, this.pendings, this.latestValue)) {
                this._(dispatchSuccess);
            }
        }
    };

    var insertError = function insertError(error) {
        this.element.insertBefore(error.get(), this.control.nextSibling);
        this.state = ns.states.FAILURE;
        this.error = error;

        return this.dispatch('failure', this);
    };

    var removeError = function removeError() {

        if (this.error instanceof ValidationError) {
            this.element.removeChild(this.error.get());
        }

        this.error = null;

        return this;
    };

    var triggerValidator = function triggerValidator(index, validator, value) {

        if (typeof validator === 'function') {
            if (validator.length > 1) {
                this.state = ns.states.PENDING;
                this.latestValue = value;
                this.pendings = this.validators.slice(index + 1);
                validator(value, handlePending.bind(this));
            } else {
                try {
                    validator(value);
                } catch (e) {
                    this._(insertError, e);
                }
            }
        } else {
            try {
                validator.trigger(value);
            } catch (e) {
                this._(insertError, e);
            }
        }

        return this.state === ns.states.FAILURE || this.state === ns.states.PENDING;
    };

})(plugin.fields, plugin.utils);
