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
 * @param {Object} sourceObject
 * @returns {Object} The sourceObject cloned.
 */
fmval.utils.cloneObject = function cloneObject(sourceObject) {
    var cloned, i;

    cloned = {};

    if (sourceObject === null || typeof sourceObject === 'undefined') {
        return cloned;
    }

    if (sourceObject.constructor !== Object) {
        throw new TypeError(this.formatString("The argument '%(name)s' must be a direct instance of Object.", {
            'name': sourceObject.constructor.name
        }));
    }

    for (i in sourceObject) {
        if (typeof sourceObject[i] === 'undefined' || sourceObject[i] === null) {
            cloned[i] = null;
        } else if (sourceObject[i].constructor === Object) {
            cloned[i] = this.cloneObject(sourceObject[i]);
        } else {
            cloned[i] = sourceObject[i];
        }
    }

    return cloned;
};


/**
 * @param {String} sourceString
 * @param {Object.<String, *>} namedArgs
 * @returns {String} The sourceString formatted by named arguments.
 */
fmval.utils.formatString = function formatString(sourceString, namedArgs) {
    var name;

    for (name in namedArgs) {
        sourceString = sourceString.replace("%(" + name + ")s", namedArgs[name]);
    }

    return sourceString;
};


/**
 * @param {Object} sourceObject
 * @param {Object} targetObject
 * @returns {Object} The sourceObject merged with targetObject.
 */
fmval.utils.updateObject = function updateObject(sourceObject, targetObject) {
    var name;

    sourceObject = this.cloneObject(sourceObject);
    targetObject = this.cloneObject(targetObject);

    for (name in targetObject) {
        if (targetObject[name] === null) {
            if ((name in sourceObject) && sourceObject[name] !== null) {
                continue;
            }
            sourceObject[name] = null;
        } else if (targetObject[name].constructor === Object) {
            if ((name in sourceObject) && sourceObject[name] !== null && sourceObject[name].constructor !== Object) {
                continue;
            }
            sourceObject[name] = this.updateObject(sourceObject[name], targetObject[name]);
        } else {
            if ((name in sourceObject) && sourceObject[name] !== null && sourceObject[name].constructor !== targetObject[name].constructor) {
                continue;
            }
            sourceObject[name] = targetObject[name];
        }
    }

    return sourceObject;
};
