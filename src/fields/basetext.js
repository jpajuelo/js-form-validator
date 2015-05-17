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
        MinLengthValidator = plugin.validators.MinLengthValidator,
        MaxLengthValidator = plugin.validators.MaxLengthValidator,
        RegExpValidator    = plugin.validators.RegExpValidator;

    // **********************************************************************************
    // CLASS DEFINITION
    // **********************************************************************************

    /**
     * [BaseTextField description]
     * @extends {AbstractField}
     *
     * @constructor
     * @param {String} name [description]
     * @param {Object.<String, *>} [options] [description]
     */
    ns.BaseTextField = defineClass({

        constructor: function BaseTextField(name, options) {
            this.superClass(name, updateValidators(updateObject(defaults, options)));
        },

        inherit: ns.AbstractField

    });

    // **********************************************************************************
    // PRIVATE MEMBERS
    // **********************************************************************************

    var defaults = {
        minlength:  0,
        maxlength:  1024,
        regexp:     null,
        controlTag: 'input',
        validators: []
    };

    var updateValidators = function updateValidators(options) {

        if (options.regexp instanceof RegExp) {
            options.validators.unshift(new RegExpValidator(options.regexp));
        }

        if (options.maxlength > options.minlength) {
            options.validators.unshift(new MaxLengthValidator(options.maxlength));
        }

        if (options.minlength > 0) {
            options.validators.unshift(new MinLengthValidator(options.minlength));
        }

        return options;
    };

})(plugin.fields, plugin.utils);
