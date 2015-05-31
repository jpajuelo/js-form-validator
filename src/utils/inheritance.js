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

    // ==================================================================================
    // PUBLIC MEMBERS
    // ==================================================================================

    /**
     * [define description]
     *
     * @param {Object.<String, *>} features [description]
     * @returns {Function} [description]
     */
    ns.define = function define(features) {

        if ('inherit' in features) {
            inherit(features.constructor, features.inherit);
        }

        if ('mixins' in features) {
            bindMixins(features.constructor, features.mixins);
        }

        if ('members' in features) {
            addMembers(features.constructor, features.members);
        }

        return features.constructor;
    };

    // ==================================================================================
    // PRIVATE MEMBERS
    // ==================================================================================

    var addMembers = function addMembers(constructor, members) {

        for (var name in members) {
            constructor.prototype[name] = members[name];
        }
    };

    var bindMixins = function bindMixins(constructor, mixins) {
        mixins.forEach(function (mixin) {
            addMembers(constructor, mixin.prototype);
        });

        constructor.prototype.mixinClass = function mixinClass(index) {
            mixins[index].apply(this, Array.prototype.slice.call(arguments, 1));
        };
    };

    var inherit = function inherit(constructor, superConstructor) {
        var counter = 0;

        constructor.prototype = Object.create(superConstructor.prototype);

        addMembers(constructor, {

            constructor: constructor,

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
            },

            superMember: function superMember(name) {
                var memberArgs = Array.prototype.slice.call(arguments, 1);

                return superConstructor.prototype[name].apply(this, memberArgs);
            }

        });
    };

})(plugin.utils);
