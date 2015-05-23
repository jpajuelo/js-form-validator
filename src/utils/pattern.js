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

    var emailRE = {
        user: "^[-!#$%&'*+/=?^_`{}|~A-Z0-9]+" +
              "(\\.[-!#$%&'*+/=?^_`{}|~0-9A-Z]+)*",
        domain: "((?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\\.)+)" +
                "(?:[A-Z0-9-]{2,63}(?!-))$"
    };

    var ipv4RE = "(?:25[0-5]|2[0-4]\\d|[0-1]?\\d?\\d)" +
                 "(?:\\.(?:25[0-5]|2[0-4]\\d|[0-1]?\\d?\\d)){3}";

    var hostRE = {
        name: "[A-Z0-9](?:[A-Z0-9-]*[A-Z0-9])?",
        domain: "(?:\\.[A-Z0-9]+(?:[A-Z0-9-]*[A-Z0-9]+)*)*",
        tld: "\\.[A-Z]{2,}\\.?"
    };

    var urlRE = {
        scheme: "^(?:[A-Z0-9\\.\\-]*)://",
        host: "(?:" + ipv4RE + "|" +
              "(" + hostRE.name + hostRE.domain + hostRE.tld + "|localhost))",
        port: "(?::\\d{2,5})?",
        path: "(?:[/?#][^\\s]*)?$"
    };

    // **********************************************************************************
    // NAMESPACE DEFINITION
    // **********************************************************************************

    /**
     * @namespace [description]
     */
    ns.pattern = {

        /**
         * [email description]
         *
         * @type {String}
         */
        email: emailRE.user + "@" + emailRE.domain,

        /**
         * [url description]
         *
         * @type {String}
         */
        url: urlRE.scheme + urlRE.host + urlRE.port + urlRE.path

    };

})(plugin.utils);
