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
 * @returns {Function} The instance on which this method was called.
 */
Function.prototype.inherit = function inherit(parentClass) {
    this.prototype = Object.create(parentClass.prototype);
    this.prototype.constructor = this;

    // TODO: think a better way to get the parent class.
    this.prototype.parentClass = parentClass;

    return this;
};


/**
 * @param {String} memberName
 * @param {Function} memberMethod
 * @returns {Function} The instance on which this method was called.
 */
Function.prototype.member = function member(memberName, memberMethod) {
    this.prototype[memberName] = memberMethod;

    return this;
};


/**
 * @namespace
 */
var utils = {

    /**
     * @param {Object} sourceObject
     * @param {Boolean} recursiveCall
     * @returns {Object} The new object cloned.
     */
    cloneObject: function cloneObject(sourceObject, recursiveCall) {
        var cloned, i;

        if (typeof recursiveCall !== 'boolean') {
            recursiveCall = false;
        }

        if (sourceObject == null || typeof sourceObject !== 'object') {
            return recursiveCall ? sourceObject : {};
        }

        if (sourceObject instanceof RegExp) {
            return sourceObject;
        }

        if (Array.isArray(sourceObject)) {
            cloned = [];
        } else {
            cloned = {};
        }

        for (i in sourceObject) {
            if (sourceObject[i] != null && typeof sourceObject[i] === 'object') {
                cloned[i] = this.cloneObject(sourceObject[i], true);
            } else {
                cloned[i] = sourceObject[i];
            }
        }

        return cloned;
    },

    /**
     * @param {String} sourceString
     * @param {Object.<String, *>} namedArgs
     * @returns {String} The new string formatted.
     */
    formatString: function formatString(sourceString, namedArgs) {
        var name;

        for (name in namedArgs) {
            if (sourceString.indexOf("%(" + name + ")s") != -1) {
                sourceString = sourceString.replace("%(" + name + ")s", namedArgs[name]);
            }
        }

        return sourceString;
    },

    /**
     * @param {Object} sourceObject
     * @param {Object} targetObject
     * @return {Object} The sourceObject merged with targetObject.
     */
    updateObject: function updateObject(sourceObject, targetObject) {
        var name;

        sourceObject = this.cloneObject(sourceObject);
        targetObject = this.cloneObject(targetObject);

        for (name in sourceObject) {
            if (name in targetObject) {
                sourceObject[name] = targetObject[name];
            }
        }

        return sourceObject;
    }

};
