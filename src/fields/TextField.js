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
     * @constructor
     * @extends {BaseField}
     * @param {String} fieldName
     * @param {Object.<String, *>} [options]
     */
    var TextField = function TextField(fieldName, options) {
        var defaultOptions = {
            'placeholder': null,
            'type': "text"
        };

        defaultOptions = fmval.utils.updateObject(defaultOptions, options);

        this.type = defaultOptions.type;

        this.callParent(fieldName, options);

        this.placeholder = null;
        this.setPlaceholder(defaultOptions.placeholder);
    };

    TextField.inherit(fmval.fields.BaseField);

    /**
     * @override
     * @returns {HTMLElement}
     */
    TextField.member('createControl', function createControl() {
        var element;

        element = document.createElement('input');
        element.className = "form-control";
        element.type = this.type;

        return element;
    });

    /**
     * @throws {TypeError}
     * @returns {TextField} The instance on which this method was called.
     */
    TextField.member('setPlaceholder', function setPlaceholder(fieldPlaceholder) {

        if (fieldPlaceholder != null) {
            getControl.call(this).setAttribute('placeholder', fieldPlaceholder);
            this.placeholder = fieldPlaceholder;
        }

        return this;
    });

    return TextField;

})();
