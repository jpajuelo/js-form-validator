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


fmval.fields.LongTextField = (function () {

    /**
     * @constructor
     * @extends {BaseField}
     * @param {String} fieldName
     * @param {Object.<String, *>} [options]
     */
    var LongTextField = function LongTextField(fieldName, options) {
        this.callParent(fieldName, options);
    };

    LongTextField.inherit(fmval.fields.BaseField);

    /**
     * @override
     * @returns {HTMLElement}
     */
    LongTextField.member('createControl', function createControl() {
        var element;

        element = document.createElement('textarea');
        element.className = "form-control";

        return element;
    });

    return LongTextField;

})();
