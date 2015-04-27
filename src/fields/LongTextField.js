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
     * @extends {BaseField}
     *
     * @constructor
     * @param {String} name
     * @param {Object.<String, *>} [options]
     * @throws {TypeError}
     */
    var LongTextField = function LongTextField(name, options) {
        this.callParent(name, options);
    };

    LongTextField.inherit(fmval.fields.BaseField);

    /**
     * @override
     *
     * @returns {HTMLElement}
     */
    LongTextField.member('createControl', function createControl() {
        return document.createElement('textarea');
    });


    return LongTextField;

})();
