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


fmval.fields.PasswordField = (function () {

    /**
     * @constructor
     * @extends {TextField}
     * @param {String} fieldName
     * @param {Object.<String, *>} [options]
     */
    var PasswordField = function PasswordField(fieldName, options) {
        options = fmval.utils.updateObject(options);
        options.type = "password";

        this.callParent(fieldName, options);
    };

    PasswordField.inherit(fmval.fields.TextField);

    return PasswordField;

})();