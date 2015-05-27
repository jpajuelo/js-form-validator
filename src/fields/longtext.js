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
     * [LongTextField description]
     * @extends {BaseTextField}
     *
     * @constructor
     * @param {String} name [description]
     * @param {Object.<String, *>} [options] [description]
     */
    ns.LongTextField = utils.define({

        constructor: function LongTextField(name, options) {
            this.superClass(name, utils.update(defaults, options));
        },

        inherit: ns.BaseTextField

    });

    // **********************************************************************************
    // PRIVATE MEMBERS
    // **********************************************************************************

    var defaults = {
        controlTag: 'textarea'
    };

})(plugin.fields, plugin.utils);
