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


describe("A Test Suite for API Validators", function() {
    var anonymousMethod, error, validator;

    describe("A ValidationError TestCase", function() {

        it("should throw an exception whether 'message' is null", function() {

            anonymousMethod = function anonymousMethod() {
                error = new fmval.validators.ValidationError();
            };

            expect(anonymousMethod).toThrowError(TypeError, "The property 'message' must be a not empty string.");
        });

        it("should throw an exception whether 'message' is a empty string", function() {

            anonymousMethod = function anonymousMethod() {
                error = new fmval.validators.ValidationError("");
            };

            expect(anonymousMethod).toThrowError(TypeError, "The property 'message' must be a not empty string.");
        });

    });

    describe("A BaseValidator TestCase", function() {

        it("should throw an exception whether 'code' is null", function() {

            anonymousMethod = function anonymousMethod() {
                validator = new fmval.validators.BaseValidator();
            };

            expect(anonymousMethod).toThrowError(TypeError, "The property 'code' must be a not empty string.");
        });

        it("should throw an exception whether 'code' is a empty string", function() {

            anonymousMethod = function anonymousMethod() {
                validator = new fmval.validators.BaseValidator({
                    'code': ""
                });
            };

            expect(anonymousMethod).toThrowError(TypeError, "The property 'code' must be a not empty string.");
        });

        it("should throw an exception whether 'message' is null", function() {

            anonymousMethod = function anonymousMethod() {
                validator = new fmval.validators.BaseValidator({
                    'code': "test"
                });
            };

            expect(anonymousMethod).toThrowError(TypeError, "The property 'message' must be a not empty string.");
        });

        it("should throw an exception whether 'message' is a empty string", function() {

            anonymousMethod = function anonymousMethod() {
                validator = new fmval.validators.BaseValidator({
                    'code': "test",
                    'message': ""
                });
            };

            expect(anonymousMethod).toThrowError(TypeError, "The property 'message' must be a not empty string.");
        });

        it("should create an instance with valid 'code' and 'message'", function() {
            validator = new fmval.validators.BaseValidator({
                'code': "test",
                'message': "test description"
            });

            expect(validator.run()).toBeTruthy();
        });

    });

    describe("A RequiredValidator TestCase", function() {

        it("should create an instance with no options successfully", function() {
            validator = new fmval.validators.RequiredValidator();

            expect(validator instanceof fmval.validators.BaseValidator).toBeTruthy();
            expect(validator.code).toEqual("required");
            expect(validator.message).toEqual("This field is required.");

            anonymousMethod = function anonymousMethod() {
                validator.run("test");
            };

            expect(anonymousMethod).not.toThrow();
        });

        it("should throw an exception whether it receives an unacceptable value", function() {
            validator = new fmval.validators.RequiredValidator();

            anonymousMethod = function anonymousMethod() {
                validator.run("");
            };

            expect(anonymousMethod).toThrow(new fmval.validators.ValidationError("This field is required."));
        });

    });

    describe("A MinLengthValidator TestCase", function() {

        it('should create an instance with no options successfully', function() {
            validator = new fmval.validators.MinLengthValidator(5);

            expect(validator instanceof fmval.validators.BaseValidator).toBeTruthy();
            expect(validator.minLength).toEqual(5);
            expect(validator.code).toEqual("minlength");
            expect(validator.message).toEqual("This field must contain at least 5 chars.");

            anonymousMethod = function anonymousMethod() {
                validator.run("test value");
            };

            expect(anonymousMethod).not.toThrow();

        });

        it("should throw an exception whether it receives an unacceptable value", function() {
            validator = new fmval.validators.MinLengthValidator(5);

            anonymousMethod = function anonymousMethod() {
                validator.run("test");
            };

            expect(anonymousMethod).toThrow(new fmval.validators.ValidationError("This field must contain at least 5 chars."));
        });

    });

    describe("A MaxLengthValidator TestCase", function() {

        it('should create an instance with no options successfully', function() {
            validator = new fmval.validators.MaxLengthValidator(10);

            expect(validator instanceof fmval.validators.BaseValidator).toBeTruthy();
            expect(validator.maxLength).toEqual(10);
            expect(validator.code).toEqual("maxlength");
            expect(validator.message).toEqual("This field must not exceed 10 chars.");

            anonymousMethod = function anonymousMethod() {
                validator.run("test value");
            };

            expect(anonymousMethod).not.toThrow();
        });

        it("should throw an exception whether it receives an unacceptable value", function() {
            validator = new fmval.validators.MaxLengthValidator(10);

            anonymousMethod = function anonymousMethod() {
                validator.run("test value with extra chars");
            };

            expect(anonymousMethod).toThrow(new fmval.validators.ValidationError("This field must not exceed 10 chars."));
        });

    });

    describe("A RegexValidator TestCase", function() {

        it('should create an instance with no options successfully', function() {
            validator = new fmval.validators.RegexValidator(/^[\w ]+$/);

            expect(validator instanceof fmval.validators.BaseValidator).toBeTruthy();
            expect(validator.regex.source).toEqual("^[\\w ]+$");
            expect(validator.code).toEqual("invalid");
            expect(validator.message).toEqual("This field must be a valid value.");

            anonymousMethod = function anonymousMethod() {
                validator.run("test value");
            };

            expect(anonymousMethod).not.toThrow();
        });

        it("should throw an exception whether it receives an unacceptable value", function() {
            validator = new fmval.validators.RegexValidator(/^[\w ]+$/);

            anonymousMethod = function anonymousMethod() {
                validator.run("test value with $");
            };

            expect(anonymousMethod).toThrow(new fmval.validators.ValidationError("This field must be a valid value."));
        });

    });

});
