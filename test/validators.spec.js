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
    var anonymousMethod, validator;

    describe("A BaseValidator TestCase", function() {

        it("should create an instance with no options successfully", function() {
            validator = new fmval.validators.BaseValidator();

            expect(validator instanceof fmval.validators.BaseValidator).toBeTruthy();

            expect(validator.code).toBeNull();
            expect(validator.message).toBeNull();
        });

        it("should not throw an exception whether 'validate' is called", function() {
            validator = new fmval.validators.BaseValidator();

            anonymousMethod = function anonymousMethod() {
                validator.validate();
            };

            expect(anonymousMethod).not.toThrow();
        });

    });

    describe("A RequiredValidator TestCase", function() {

        it("should create an instance with no options successfully", function() {
            validator = new fmval.validators.RequiredValidator();

            expect(validator instanceof fmval.validators.BaseValidator).toBeTruthy();
            expect(validator instanceof fmval.validators.RequiredValidator).toBeTruthy();

            expect(validator.code).toEqual("required");
            expect(validator.message).toEqual("This field is required.");
        });

        it("should not throw an exception whether 'validate' receives an acceptable value", function() {
            validator = new fmval.validators.RequiredValidator();

            anonymousMethod = function anonymousMethod() {
                validator.validate("test");
            };

            expect(anonymousMethod).not.toThrow();
        });

        it("should throw an exception whether 'validate' receives an unacceptable value", function() {
            validator = new fmval.validators.RequiredValidator();

            anonymousMethod = function anonymousMethod() {
                validator.validate("");
            };

            expect(anonymousMethod).toThrow(new fmval.validators.ValidationError("This field is required."));
        });

    });

    describe("A MinLengthValidator TestCase", function() {

        it('should create an instance with no options successfully', function() {
            validator = new fmval.validators.MinLengthValidator(5);

            expect(validator instanceof fmval.validators.BaseValidator).toBeTruthy();
            expect(validator instanceof fmval.validators.MinLengthValidator).toBeTruthy();

            expect(validator.minLength).toEqual(5);
            expect(validator.code).toEqual("min_length");
            expect(validator.message).toEqual("This field must contain at least 5 chars.");
        });

        it("should not throw an exception whether 'validate' receives an acceptable value", function() {
            validator = new fmval.validators.MinLengthValidator(5);

            anonymousMethod = function anonymousMethod() {
                validator.validate("test value");
            };

            expect(anonymousMethod).not.toThrow();
        });

        it("should throw an exception whether 'validate' receives an unacceptable value", function() {
            validator = new fmval.validators.MinLengthValidator(5);

            anonymousMethod = function anonymousMethod() {
                validator.validate("test");
            };

            expect(anonymousMethod).toThrow(new fmval.validators.ValidationError("This field must contain at least 5 chars."));
        });

    });

    describe("A MaxLengthValidator TestCase", function() {

        it('should create an instance with no options successfully', function() {
            validator = new fmval.validators.MaxLengthValidator(10);

            expect(validator instanceof fmval.validators.BaseValidator).toBeTruthy();
            expect(validator instanceof fmval.validators.MaxLengthValidator).toBeTruthy();

            expect(validator.maxLength).toEqual(10);
            expect(validator.code).toEqual("max_length");
            expect(validator.message).toEqual("This field must not exceed 10 chars.");
        });

        it("should not throw an exception whether 'validate' receives an acceptable value", function() {
            validator = new fmval.validators.MaxLengthValidator(10);

            anonymousMethod = function anonymousMethod() {
                validator.validate("test value");
            };

            expect(anonymousMethod).not.toThrow();
        });

        it("should throw an exception whether 'validate' receives an unacceptable value", function() {
            validator = new fmval.validators.MaxLengthValidator(10);

            anonymousMethod = function anonymousMethod() {
                validator.validate("test value with extra chars");
            };

            expect(anonymousMethod).toThrow(new fmval.validators.ValidationError("This field must not exceed 10 chars."));
        });

    });

    describe("A RegexValidator TestCase", function() {

        it('should create an instance with no options successfully', function() {
            validator = new fmval.validators.RegexValidator(/^[\w ]+$/);

            expect(validator instanceof fmval.validators.BaseValidator).toBeTruthy();
            expect(validator instanceof fmval.validators.RegexValidator).toBeTruthy();

            expect(validator.regex instanceof RegExp).toBeTruthy();
            expect(validator.regex.source).toEqual("^[\\w ]+$");
            expect(validator.code).toEqual("invalid");
            expect(validator.message).toEqual("This field must be a valid value.");
        });

        it("should not throw an exception whether 'validate' receives an acceptable value", function() {
            validator = new fmval.validators.RegexValidator(/^[\w ]+$/);

            anonymousMethod = function anonymousMethod() {
                validator.validate("test value");
            };

            expect(anonymousMethod).not.toThrow();
        });

        it("should throw an exception whether 'validate' receives an unacceptable value", function() {
            validator = new fmval.validators.RegexValidator(/^[\w ]+$/);

            anonymousMethod = function anonymousMethod() {
                validator.validate("test value with $");
            };

            expect(anonymousMethod).toThrow(new fmval.validators.ValidationError("This field must be a valid value."));
        });

    });

});
