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


(function (ns, utils, user, mixins) {

    "use strict";

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
    ns.AbstractField = utils.define({

        constructor: function AbstractField(name, options) {
            options = addValidator(utils.update(defaults, options));

            this.name = getName(name);

            this.label = getLabel(options);
            this.helpText = getHelpText(options);

            this.control = getControl.call(this, options);
            this.element = createElement.call(this, options);

            this.state = ns.states.CLEANED;
            this.error = null;
            this.value = null;

            this.validators = options.validators;
            this.completed = 0;

            Object.defineProperties(this, {
                coverage: {
                    get: function get() {
                        if (!this.validators.length) {
                            return 100;
                        }

                        return (this.completed / this.validators.length) * 100;
                    }
                },
                errorMessage: {
                    get: function get() {
                        return this.error !== null ? this.error.message : null;
                    }
                },
                trimmedValue: {
                    get: function get() {
                        return this.control.value.trim();
                    }
                }
            });

            this.mixinClass(0, ['failure', 'success']);
        },

        mixins: [mixins.EventCapturer],

        members: {

            /**
             * [_insertError description]
             *
             * @param {ValidationError} error [description]
             * @returns {AbstractField} The instance on which the member is called.
             */
            _insertError: function _insertError(error) {
                this.element.insertBefore(error.get(), this.control.nextSibling);

                this.state = ns.states.FAILURE;
                this.error = error;

                this.element.classList.add('has-failed');

                return this.dispatch('failure', error.message, this);
            },

            /**
             * [_insertValue description]
             *
             * @param {String} value [description]
             * @param {Boolean} commit [description]
             * @returns {AbstractField} The instance on which the member is called.
             */
            _insertValue: function _insertValue(value, commit) {

                if (commit) {
                    this.control.value = value;
                }

                this.state = ns.states.SUCCESS;
                this.value = value;

                this.element.classList.add('has-passed');

                return this.dispatch('success', value, this);
            },

            /**
             * [addAttr description]
             *
             * @param {String} name [description]
             * @param {String|Number|Boolean} value [description]
             * @returns {AbstractField} The instance on which the member is called.
             */
            addAttr: function addAttr(name, value) {
                this.control.setAttribute(name, value);

                return this;
            },

            /**
             * [addError description]
             *
             * @param {ValidationError} error [description]
             * @returns {AbstractField} The instance on which the member is called.
             */
            addError: function addError(error) {

                if (!(error instanceof ns.ValidationError)) {
                    throw new TypeError("[error description");
                }

                return this.clean()._insertError(error);
            },

            /**
             * [addInitialValue description]
             *
             * @param {String|Number|Boolean} initialValue [description]
             * @returns {AbstractField} The instance on which the member is called.
             */
            addInitialValue: function addInitialValue(initialValue) {
                return this.clean()._insertValue(initialValue, true);
            },

            /**
             * [addValidator description]
             *
             * @param {Function} validator [description]
             * @returns {AbstractField} The instance on which the member is called.
             */
            addValidator: function addValidator(validator) {
                this.validators.push(validator);

                return this;
            },

            /**
             * [clean description]
             *
             * @returns {AbstractField} The instance on which the member is called.
             */
            clean: function clean() {

                if (this.hasFailed()) {
                    removeError.call(this);
                }

                if (this.hasPassed()) {
                    removeValue.call(this);
                }

                this.state = ns.states.CLEANED;
                this.completed = 0;

                return this;
            },

            /**
             * [get description]
             *
             * @returns {HTMLElement} [description]
             */
            get: function get() {
                return this.element;
            },

            /**
             * [hasChanged description]
             *
             * @returns {Boolean} [description]
             */
            hasChanged: function hasChanged() {
                return this.value === null || this.value !== this.trimmedValue;
            },

            /**
             * [hasFailed description]
             *
             * @returns {Boolean} [description]
             */
            hasFailed: function hasFailed() {
                return this.state === ns.states.FAILURE;
            },

            /**
             * [hasPassed description]
             *
             * @returns {Boolean} [description]
             */
            hasPassed: function hasPassed() {
                return this.state === ns.states.SUCCESS;
            },

            /**
             * [validate description]
             *
             * @param {Boolean} [commit=false] [description]
             * @returns {AbstractField} The instance on which the member is called.
             */
            validate: function validate(commit) {
                var value;

                if (typeof commit !== 'boolean') {
                    commit = false;
                }

                if (this.hasChanged() || this.coverage !== 100) {
                    value = this.clean().trimmedValue;

                    if (!findError.call(this, value)) {
                        this._insertValue(value, commit);
                    }
                }

                return this;
            }

        }

    });

    // **********************************************************************************
    // PRIVATE MEMBERS
    // **********************************************************************************

    var defaults = {
        required: true,
        label: "",
        helpText: "",
        controlTag: "",
        controlAttrs: {},
        validators: [],
        errorMessages: {
            required: "This field is required."
        }
    };

    var addAttrs = function addAttrs(controlAttrs) {

        for (var name in controlAttrs) {
            this.addAttr(name, controlAttrs[name]);
        }

        return this;
    };

    var addValidator = function addValidator(options) {

        if (options.required) {
            options.validators.unshift(cleanRequired.bind(options));
        }

        return options;
    };

    var cleanRequired = function cleanRequired(value, field) {

        if (!value.length) {
            throw new ns.ValidationError(this.errorMessages.required);
        }

        return value;
    };

    var createElement = function createElement(options) {
        var element = document.createElement(user.get('fieldTag'));

        element.className = user.get('fieldClass');

        if (this.label !== null) {
            element.appendChild(this.label);

            if (this.control.id) {
                this.label.setAttribute('for', this.control.id);
            }
        }

        addAttrs.call(this, options.controlAttrs);
        element.appendChild(this.control);

        if (this.helpText !== null) {
            element.appendChild(this.helpText);
        }

        return element;
    };

    var findError = function findError(value) {
        return this.validators.some(function (validator) {
            try {
                validator(value, this);
                this.completed++;
            } catch (e) {
                if (!(e instanceof ns.ValidationError)) {
                    throw e;
                }
                this._insertError(e);
            }

            return this.hasFailed();
        }, this);
    };

    var getControl = function getControl(options) {
        var control   = document.createElement(options.controlTag),
            controlId = getId(options.controlAttrs);

        if (controlId) {
            control.id = utils.format(controlId, {
                name: this.name
            });
        }

        control.className = user.get('controlClass');
        control.name = this.name;

        return control;
    };

    var getHelpText = function getHelpText(options) {
        var helpText = null;

        if (options.helpText) {
            helpText = document.createElement(user.get('helpTextTag'));
            helpText.className = user.get('helpTextClass');
            helpText.textContent = options.helpText;
        }

        return helpText;
    };

    var getId = function getId(controlAttrs) {
        var id = 'id' in controlAttrs ? controlAttrs.id : user.get('controlId');

        delete controlAttrs.id;

        return id;
    };

    var getLabel = function getLabel(options) {
        var label = null,
            optional;

        if (options.label) {
            label = document.createElement(user.get('labelTag'));
            label.className = user.get('labelClass');
            label.textContent = options.label;

            if (!options.required) {
                optional = label.appendChild(document.createElement('small'));
                optional.textContent = "optional";
            }
        }

        return label;
    };

    var getName = function getName(name) {
        if (typeof name !== 'string' || !name.length) {
            throw new TypeError("The name must be a not-empty string.");
        }

        return name;
    };

    var removeError = function removeError() {
        this.element.removeChild(this.error.get());
        this.error = null;

        this.element.classList.remove('has-failed');

        return this;
    };

    var removeValue = function removeValue() {
        this.value = null;

        this.element.classList.remove('has-passed');

        return this;
    };

})(plugin.fields, plugin.utils, plugin.settings, plugin.mixins);
