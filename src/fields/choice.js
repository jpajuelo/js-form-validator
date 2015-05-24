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
        updateObject    = utils.object.update,
        formatString    = utils.string.format,
        ValidationError = plugin.validators.ValidationError;

    // **********************************************************************************
    // CLASS DEFINITION
    // **********************************************************************************

    /**
     * [ChoiceField description]
     * @extends {AbstractField}
     *
     * @constructor
     * @param {String} name [description]
     * @param {Object.<String, *>} [options] [description]
     */
    ns.ChoiceField = defineClass({

        constructor: function ChoiceField(name, options) {
            options = updateObject(defaults, options);
            options.validators.unshift(validInvalidChoice.bind(options));

            this.choices = {};
            this.superClass(name, options);

            Object.defineProperty(this, 'selected', {
                get: function get() {
                    return findSelected(this.choices);
                }
            });

            for (var value in options.choices) {
                this.addChoice(value, options.choices[value]);
            }
        },

        inherit: ns.AbstractField,

        members: {

            /**
             * [addChoice description]
             *
             * @param {String} value [description]
             * @param {String} textContent [description]
             */
            addChoice: function addChoice(value, textContent) {
                var option = document.createElement('option');

                option.value = value;
                option.textContent = textContent;

                this.choices[value] = option;
                this.control.appendChild(option);

                return this;
            },

            /**
             * [addInitialValue description]
             * @override
             *
             * @param {String} initialValue [description]
             */
            addInitialValue: function addInitialValue(initialValue) {
                if (!(initialValue in this.choices)) {
                    throw new TypeError("[error description]");
                }

                return this.superMember('addInitialValue', initialValue);
            }

        }

    });

    // **********************************************************************************
    // PRIVATE MEMBERS
    // **********************************************************************************

    var defaults = {
        choices: {},
        controlTag: 'select',
        validators: [],
        errorMessages: {
            invalid_choice: "The selected '%(value)s' is out of the given choices.",
        }
    };

    var findSelected = function findSelected(choices) {
        for (var value in choices) {
            if (choices[value].selected) {
                return choices[value];
            }
        }

        return null;
    };

    var validInvalidChoice = function validInvalidChoice(value, field) {
        if (value && !(value in field.choices)) {
            throw new ValidationError(formatString(this.errorMessages.invalid_choice, {
                value: value
            }));
        }
    };

})(plugin.fields, plugin.utils);
