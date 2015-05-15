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
    // NAMESPACE DEFINITION
    // **********************************************************************************

    /**
     * @namespace [description]
     */
    ns.inheritance = {

        /**
         * [members description]
         *
         * @param {Function} existingClass [description]
         * @param {Object.<String, *>} memberGroup [description]
         */
        members: function members(existingClass, memberGroup) {

            for (var name in memberGroup) {
                existingClass.prototype[name] = memberGroup[name];
            }
        },

        defineClass: function defineClass(definition) {

            if ('inherit' in definition) {
                ns.inheritance.inherit(definition.constructor, definition.inherit);
            }

            if ('members' in definition) {
                ns.inheritance.members(definition.constructor, definition.members);
            }

            definition.constructor.prototype._ = function _(method) {
                return method.apply(this, Array.prototype.slice.call(arguments, 1));
            };

            return definition.constructor;
        },

        /**
         * [inherit description]
         *
         * @param {Function} existingClass [description]
         * @param {Function} superConstructor [description]
         */
        inherit: function inherit(existingClass, superConstructor) {
            var counter = 0;

            existingClass.prototype = Object.create(superConstructor.prototype);

            ns.inheritance.members(existingClass, {

                constructor: existingClass,

                superConstructor: superConstructor,

                superClass: function superClass() {
                    var currentClass = superConstructor;

                    for (var i = 0; i < counter; i++) {
                        currentClass = currentClass.prototype.superConstructor;
                    }

                    counter++;

                    try {
                        currentClass.apply(this, Array.prototype.slice.call(arguments));
                    } catch (e) {
                        counter = 0;
                        throw e;
                    }

                    counter--;
                }

            });
        },

    };

})(plugin.utils);
