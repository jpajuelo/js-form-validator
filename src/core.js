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


/**
 * @param {Function} parentClass
 * @returns {Function}
 */
Function.prototype.inherit = function inherit(parentClass) {
    var callCounter = 0;

    this.prototype = Object.create(parentClass.prototype);

    /**
     * @type {Function}
     */
    this.prototype.constructor = this;

    /**
     * @type {Function}
     */
    this.prototype.parentClass = parentClass;

    /**
     * @returns {Object} The instance on which this method was called.
     */
    this.prototype.callParent = function callParent() {
        var currentClass, i;

        currentClass = parentClass;

        for (i = 0; i < callCounter; i++) {
            currentClass = currentClass.prototype.parentClass;
        }

        callCounter++;
        currentClass.apply(this, Array.prototype.slice.call(arguments));

        callCounter = 0;

        return this;
    };

    return this;
};


/**
 * @param {String} memberName
 * @param {Function} memberMethod
 * @returns {Function}
 */
Function.prototype.member = function member(memberName, memberMethod) {
    this.prototype[memberName] = memberMethod;

    return this;
};


/**
 * @namespace
 */
var fmval = {
    /**
     * @namespace
     */
    fields: {},
    /**
     * @namespace
     */
    forms: {},
    /**
     * @namespace
     */
    utils: {},
    /**
     * @namespace
     */
    validators: {}
};
