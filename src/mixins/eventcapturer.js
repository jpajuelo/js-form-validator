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


(function (ns, utils) {

    "use strict";

    // **********************************************************************************
    // CLASS DEFINITION
    // **********************************************************************************

    /**
     * [EventCapturer description]
     *
     * @constructor
     * @param {String[]} names [description]
     */
    ns.EventCapturer = utils.define({

        constructor: function EventCapturer(names) {
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
             * @param {Function} thisArg [description]
             * @returns {EventCapturer} The instance on which the member is called.
             */
            attach: function attach(name, handler, thisArg) {

                if (!(name in this.events)) {
                    throw new TypeError("[error description]");
                }

                this.events[name].push({
                    handler: handler,
                    thisArg: arguments.length > 2 ? thisArg : this
                });

                return this;
            },

            /**
             * [dispatch description]
             *
             * @param {String} name [description]
             * @returns {EventCapturer} The instance on which the member is called.
             */
            dispatch: function dispatch(name) {
                var handlerArgs = Array.prototype.slice.call(arguments, 1);

                if (!(name in this.events)) {
                    throw new TypeError("[error description]");
                }

                this.events[name].forEach(function (callback) {
                    callback.handler.apply(callback.thisArg, handlerArgs);
                });

                return this;
            }

        }

    });

})(plugin.mixins, plugin.utils);
