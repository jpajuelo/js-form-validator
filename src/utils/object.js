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


(function (ns) {

    "use strict";

    // **********************************************************************************
    // PRIVATE MEMBERS
    // **********************************************************************************

    var cloneProperty = function cloneProperty(sourceValue) {

        if (isNull(sourceValue)) {
            return null;
        }

        if (isSimple(sourceValue)) {
            return this.clone(sourceValue);
        }

        if (Array.isArray(sourceValue)) {
            return sourceValue.slice();
        }

        return sourceValue;
    };

    var isNull = function isNull(source) {
        return typeof source === 'undefined' || source === null;
    };

    var isSimple = function isSimple(source) {
        return typeof source === 'object' && source !== null && source.constructor === Object;
    };

    var isSubClass = function isSubClass(parentClass, childClass) {
        var c1, c2, found = false;

        if (typeof parentClass !== 'function' || typeof childClass !== 'function') {
            return found;
        }

        c1 = parentClass.prototype;
        c2 = childClass.prototype;

        while (!(found = (c1 === c2))) {
            c2 = Object.getPrototypeOf(c2);

            if (c2 === null || (c2 === Object.prototype && c1 !== c2)) {
                break;
            }
        }

        return found;
    };

    var updateProperty = function updateProperty(targetValue, sourceValue) {

        if (isNull(sourceValue)) {
            if (isNull(targetValue)) {
                targetValue = null;
            }
        } else if (typeof sourceValue === 'function') {
            if (isNull(targetValue) || isSubClass(targetValue, sourceValue)) {
                targetValue = sourceValue;
            }
        } else if (isSimple(sourceValue)) {
            if (isNull(targetValue) || isSimple(targetValue)) {
                targetValue = this.update(targetValue, sourceValue);
            }
        } else if (Array.isArray(sourceValue)) {
            if (isNull(targetValue)) {
                targetValue = [];
            }
            if (Array.isArray(targetValue)) {
                targetValue = targetValue.concat(sourceValue);
            }
        } else {
            if (isNull(targetValue) || targetValue.constructor === sourceValue.constructor) {
                targetValue = sourceValue;
            }
        }

        return targetValue;
    };

    // **********************************************************************************
    // NAMESPACE DEFINITION
    // **********************************************************************************

    /**
     * @namespace [description]
     */
    ns.object = {

        /**
         * [clone description]
         *
         * @param {Object} source [description]
         * @returns {Object} [description]
         */
        clone: function clone(source) {
            var target = {};

            if (isNull(source)) {
                return target;
            }

            if (!isSimple(source)) {
                throw new TypeError("[error description]");
            }

            for (var name in source) {
                target[name] = cloneProperty.call(ns.object, source[name]);
            }

            return target;
        },

        /**
         * [update description]
         *
         * @param {Object.<String, *>} target [description]
         * @param {Object.<String, *>} source [description]
         * @returns {Object.<String, *>} [description]
         */
        update: function update(target, source) {
            target = ns.object.clone(target);
            source = ns.object.clone(source);

            for (var name in source) {
                target[name] = updateProperty.call(ns.object, target[name], source[name]);
            }

            return target;
        }

    };

})(plugin.utils);
