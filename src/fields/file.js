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
     * [FileField description]
     * @extends {AbstractField}
     *
     * @constructor
     * @param {String} name [description]
     * @param {Object.<String, *>} [options] [description]
     */
    ns.FileField = utils.define({

        constructor: function FileField(name, options) {
            this.superClass(name, addValidators(utils.update(defaults, options)));

            Object.defineProperty(this, 'uploaded', {
                get: function get() {
                    return !this.control.files.length ? null : this.control.files[0];
                }
            });

            this.control.addEventListener('change', handleOnChange.bind(this));
        },

        inherit: ns.AbstractField

    });

    // ==================================================================================
    // PRIVATE MEMBERS
    // ==================================================================================

    var defaults = {
        maxLength: 0,
        maxValue: 0,
        unit: 'MiB',
        controlTag: 'input',
        controlAttrs: {
            type: 'file'
        },
        validators: [],
        errorMessages: {
            max_value: "The file size must be less than %(maxValue)s %(unit)s.",
            max_length: "The filename must be at most %(maxLength)s chars."
        }
    };

    var units = ['B', 'KiB', 'MiB', 'GiB'];

    var addValidators = function addValidators(options) {

        if (units.indexOf(options.unit) < 0) {
            options.unit = defaults.unit;
        }

        if (options.maxValue > 0) {
            options.validators.unshift(cleanMaxValue.bind(options));
        }

        if (options.maxLength > 0) {
            options.validators.unshift(cleanMaxLength.bind(options));
        }

        return options;
    };

    var cleanMaxLength = function cleanMaxLength(value, field) {
        var file = field.uploaded;

        if (file !== null && file.name.length > this.maxLength) {
            throw new ns.ValidationError(this.errorMessages.max_length, {
                maxLength: this.maxLength
            });
        }

        return value;
    };

    var cleanMaxValue = function cleanMaxValue(value, field) {
        var file = field.uploaded;

        if (file !== null && convert(file.size, this.unit) > this.maxValue) {
            throw new ns.ValidationError(this.errorMessages.max_value, {
                maxValue: this.maxValue,
                unit: this.unit
            });
        }

        return value;
    };

    var convert = function convert(size, unit) {

        for (var i = 0; unit !== units[i] && i < units.length; i++) {
            size /= 1024;
        }

        return size.toFixed(3);
    };

    var handleOnChange = function handleOnChange(event) {
        this.validate();
    };

})(plugin.fields, plugin.utils);
