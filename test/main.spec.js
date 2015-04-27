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


describe("A Utils TestCase", function() {

    it("should clone the object given", function() {
        var test = {
            'test1': 5,
            'test2': [],
            'test3': {
                'test3-1': "test",
                'test3-2': null,
                'test3-3': {}
            },
            'test4': null
        };

        expect(fmval.utils.cloneObject(test)).toEqual(test);
    });

});


describe("A Settings TestCase", function() {
    var anonymousMethod, option;

    it("should throw an exception whether the option do not exist", function() {

        anonymousMethod = function anonymousMethod() {
            option = new fmval.getOption("test");
        };

        expect(anonymousMethod).toThrowError(TypeError, "The option 'test' is not found.");
    });

});
