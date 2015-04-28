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
    var anonymousMethod;

    beforeAll(function () {
        this.initialObject2 = {
            'test1': null,
            'test2': undefined,
            'test3': {
                'test3-1': "test",
                'test3-3': {}
            }
        };
        this.resultingObject2 = {
            'test1': null,
            'test2': null,
            'test3': {
                'test3-1': "test",
                'test3-3': {}
            }
        };
    });

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

    it("should clone the object2 given", function() {
        expect(fmval.utils.cloneObject(this.initialObject2)).toEqual(this.resultingObject2);
    });

    it("should clone the object3 given", function() {
        expect(fmval.utils.cloneObject()).toEqual({});
    });

    it("should clone the object4 given", function() {
        expect(fmval.utils.cloneObject(null)).toEqual({});
    });

    it("should throw an exception whether the object is not a direct instance of Object", function() {
        anonymousMethod =function anonymousMethod() {
            fmval.utils.cloneObject(3);
        };

        expect(anonymousMethod).toThrowError(TypeError);

        anonymousMethod =function anonymousMethod() {
            fmval.utils.cloneObject([]);
        };

        expect(anonymousMethod).toThrowError(TypeError);

        anonymousMethod =function anonymousMethod() {
            fmval.utils.cloneObject(new fmval.validators.RequiredValidator());
        };

        expect(anonymousMethod).toThrowError(TypeError);
    });

    it("should update the object1 given", function() {
        expect(fmval.utils.updateObject()).toEqual({});
        expect(fmval.utils.updateObject(undefined, null)).toEqual({});
        expect(fmval.utils.updateObject(null, null)).toEqual({});
    });

    it("should update the object2 given", function() {
        expect(fmval.utils.updateObject({'test1': ""}, {'test2': ""})).toEqual({
            'test1': "",
            'test2': ""
        });
    });

    it("should update the object3 given", function() {
        expect(fmval.utils.updateObject({'test1': ""}, {'test1': null})).toEqual({
            'test1': ""
        });
    });

    it("should update the object4 given", function() {
        expect(fmval.utils.updateObject({'test1': null}, {'test2': undefined})).toEqual({
            'test1': null,
            'test2': null
        });
    });

    it("should update the object5 given", function() {
        expect(fmval.utils.updateObject({'test1': {'test2': ""}}, {'test1': undefined})).toEqual({
            'test1': {
                'test2': ""
            }
        });
    });

    it("should update the object6 given", function() {
        expect(fmval.utils.updateObject({'test1': {'test2': ""}}, {'test1': {'test3': ""}})).toEqual({
            'test1': {
                'test2': "",
                'test3': ""
            }
        });
    });

    it("should update the object7 given", function() {
        expect(fmval.utils.updateObject({'test1': {'test2': ""}}, {'test1': {'test2': "data"}})).toEqual({
            'test1': {
                'test2': "data"
            }
        });
    });

    it("should update the object8 given", function() {
        expect(fmval.utils.updateObject({'test1': {'test2': ""}}, {'test1': 5})).toEqual({
            'test1': {
                'test2': ""
            }
        });
    });

    it("should update the object9 given", function() {
        expect(fmval.utils.updateObject({'test1': ""}, {'test1': 5})).toEqual({
            'test1': ""
        });
    });

    it("should update the object10 given", function() {
        expect(fmval.utils.updateObject({'test1': null}, {'test1': 5})).toEqual({
            'test1': 5
        });
    });

    it("should update the object11 given", function() {
        expect(fmval.utils.updateObject({'test1': null}, {'test1': {}})).toEqual({
            'test1': {}
        });
    });

    it("should update the object12 given", function() {
        expect(fmval.utils.updateObject({'test1': 5}, {'test1': {}})).toEqual({
            'test1': 5
        });
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
