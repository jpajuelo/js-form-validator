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
    // CLASS DEFINITION
    // **********************************************************************************

    /**
     * [EventCapturerMixin description]
     *
     * @constructor
     * @param {String[]} names [description]
     */
    ns.EventCapturerMixin = defineClass({

        constructor: function EventCapturerMixin(names) {
            this.events = {};

            names.forEach(function (name) {
                this.events[name] = [];
            }, this);
        },

        members: {

            /**
             * [attach description]
             *
             * @param {String} name [description]
             * @param {Function} handler [description]
             * @returns {EventCapturerMixin} The instance on which the member is called.
             */
            attach: function attach(name, handler) {
                this.events[name].push(handler);

                return this;
            },

            /**
             * [dispatch description]
             *
             * @param {String} name [description]
             * @returns {EventCapturerMixin} The instance on which the member is called.
             */
            dispatch: function dispatch(name) {
                var handlerArgs = Array.prototype.slice.call(arguments, 1);

                this.events[name].forEach(function (handler) {
                    handler.apply(this, handlerArgs);
                }, this);

                return this;
            }

        }

    });

})(plugin.mixins);
