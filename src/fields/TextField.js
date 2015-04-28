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


fmval.fields.TextField = (function () {

    /**
     * @extends {BaseField}
     *
     * @constructor
     * @param {String} name
     * @param {Object.<String, *>} [options]
     * @throws {TypeError}
     */
    var TextField = function TextField(name, options) {
        var properties = {
            'placeholder': null,
            'type': "text"
        };

        properties = fmval.utils.updateObject(properties, options);
        this.callParent(name, options);

        this._(setType)(properties.type);
        this.setPlaceholder(properties.placeholder);
    };

    TextField.inherit(fmval.fields.BaseField);

    /**
     * @override
     *
     * @returns {HTMLInputElement}
     */
    TextField.member('createControl', function createControl() {
        return document.createElement('input');
    });

    /**
     * @override
     *
     * @param {HTMLInputElement} control
     * @returns {TextField} The instance on which this method was called.
     */
    TextField.member('setControl', function setControl(control) {

        this.parentClass.prototype.setControl.call(this, control);
        this._(setType)(this.type);

        return this;
    });

    /**
     * @param {String} placeholder
     * @returns {TextField} The instance on which this method was called.
     */
    TextField.member('setPlaceholder', function setPlaceholder(placeholder) {

        if (placeholder !== null && typeof placeholder !== 'string') {
            throw new TypeError("The property 'placeholder' must be a string or null.");
        }

        if (placeholder === null || !placeholder.length) {
            this.element.removeAttribute('placeholder');
            this.placeholder = null;
        } else {
            this.element.setAttribute('placeholder', placeholder);
            this.placeholder = placeholder;
        }

        return this;
    });


    var setType = function setType(type) {

        this.element.type = type;
        this.type = type;

        return this;
    };


    return TextField;

})();
