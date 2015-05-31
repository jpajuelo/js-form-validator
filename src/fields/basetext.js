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

    // ==================================================================================
    // CLASS DEFINITION
    // ==================================================================================

    /**
     * [BaseTextField description]
     * @extends {AbstractField}
     *
     * @constructor
     * @param {String} name [description]
     * @param {Object.<String, *>} [options] [description]
     */
    ns.BaseTextField = utils.define({

        constructor: function BaseTextField(name, options) {
            this.superClass(name, addValidators(utils.update(defaults, options)));

            this.control.addEventListener('blur', handleOnBlur.bind(this));
            this.control.addEventListener('input', handleOnInput.bind(this));
        },

        inherit: ns.AbstractField

    });

    // ==================================================================================
    // PRIVATE MEMBERS
    // ==================================================================================

    var defaults = {
        minLength: 0,
        maxLength: 0,
        regExp: null,
        validators: [],
        errorMessages: {
            min_length: "This field must be at least %(minLength)s chars.",
            max_length: "This field must be at most %(maxLength)s chars.",
            invalid: "This field must be a valid value."
        }
    };

    var addValidators = function addValidators(options) {

        if (options.regExp instanceof RegExp) {
            options.validators.unshift(cleanInvalid.bind(options));
        }

        if (options.maxLength > 0 && options.maxLength > options.minLength) {
            options.validators.unshift(cleanMaxLength.bind(options));
        }

        if (options.minLength > 0) {
            options.validators.unshift(cleanMinLength.bind(options));
        }

        return options;
    };

    var cleanMaxLength = function cleanMaxLength(value, field) {

        if (value && value.length > this.maxLength) {
            throw new ns.ValidationError(this.errorMessages.max_length, {
                maxLength: this.maxLength
            });
        }

        return value;
    };

    var cleanMinLength = function cleanMinLength(value, field) {

        if (value && value.length < this.minLength) {
            throw new ns.ValidationError(this.errorMessages.min_length, {
                minLength: this.minLength
            });
        }

        return value;
    };

    var cleanInvalid = function cleanInvalid(value, field) {

        if (value && !this.regExp.test(value)) {
            throw new ns.ValidationError(this.errorMessages.invalid);
        }

        return value;
    };

    var handleOnBlur = function handleOnBlur(event) {
        this.validate(true);
    };

    var handleOnInput = function handleOnInput(event) {
        this.validate();
    };

})(plugin.fields, plugin.utils);
