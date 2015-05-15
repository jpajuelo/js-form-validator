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
    ns.string = {

        /**
         * [format description]
         *
         * @param {String} target [description]
         * @param {Object.<String, *>} namedArgs [description]
         * @returns {String} [description]
         */
        format: function format(target, namedArgs) {

            for (var name in namedArgs) {
                target = target.replace("%(" + name + ")s", namedArgs[name]);
            }

            return target;
        }

    };

})(plugin.utils);