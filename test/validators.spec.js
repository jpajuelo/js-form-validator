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


describe("A test suite for validator classes", function() {

    "use strict";

    beforeAll(function () {
        this.AbstractValidator = plugin.validators.AbstractValidator;
        this.ValidationError = plugin.validators.ValidationError;
    });

    describe("A testcase for class AbstractValidator", function () {

        it("should create a new instance with default options", function () {
            this.validator = new this.AbstractValidator();

            expect(this.validator.code).toEqual("not_provided");
            expect(this.validator.message).toEqual("The error was not specified.");
        });

        it("should not throw an exception if a value is given", function () {
            this.validator = new this.AbstractValidator();

            this.anonMethod = function () {
                this.validator.trigger();
            }.bind(this);

            expect(this.anonMethod).not.toThrow();
        });

    });

    describe("A testcase for class RequiredValidator", function () {

        beforeAll(function () {
            this.validatorClass = plugin.validators.RequiredValidator;
        });

        it("should create a new instance with default options", function () {
            this.validator = new this.validatorClass();

            expect(this.validator instanceof this.AbstractValidator).toBeTruthy();
            expect(this.validator.code).toEqual("required");
            expect(this.validator.message).toEqual("This field is required.");

        });

        it("should not throw an exception if the given value is allowed", function () {
            this.validator = new this.validatorClass();

            this.anonMethod = function () {
                this.validator.trigger("test");
            }.bind(this);

            expect(this.anonMethod).not.toThrow();
        });

        it("should throw an exception if the given value is not allowed", function () {
            this.validator = new this.validatorClass();

            this.anonMethod = function () {
                this.validator.trigger("");
            }.bind(this);

            expect(this.anonMethod).toThrow(new this.ValidationError("This field is required."));
        });

    });

    describe("A testcase for class MinLengthValidator", function () {

        beforeAll(function () {
            this.validatorClass = plugin.validators.MinLengthValidator;
        });

        it("should create a new instance with default options", function () {
            this.validator = new this.validatorClass(5);

            expect(this.validator instanceof this.AbstractValidator).toBeTruthy();
            expect(this.validator.minLength).toEqual(5);
            expect(this.validator.code).toEqual("min_length");
            expect(this.validator.message).toEqual("This field must contain at least 5 chars.");
        });

        it("should not throw an exception if the given value is allowed", function () {
            this.validator = new this.validatorClass(5);

            this.anonMethod = function () {
                this.validator.trigger("test value");
            }.bind(this);

            expect(this.anonMethod).not.toThrow();
        });

        it("should throw an exception if the given value is not allowed", function () {
            this.validator = new this.validatorClass(5);

            this.anonMethod = function () {
                this.validator.trigger("test");
            }.bind(this);

            expect(this.anonMethod).toThrow(new this.ValidationError("This field must contain at least 5 chars."));
        });

    });

    describe("A testcase for class MaxLengthValidator", function () {

        beforeAll(function () {
            this.validatorClass = plugin.validators.MaxLengthValidator;
        });

        it("should create a new instance with default options", function () {
            this.validator = new this.validatorClass(10);

            expect(this.validator instanceof this.AbstractValidator).toBeTruthy();
            expect(this.validator.maxLength).toEqual(10);
            expect(this.validator.code).toEqual("max_length");
            expect(this.validator.message).toEqual("This field must not exceed 10 chars.");
        });

        it("should not throw an exception if the given value is allowed", function () {
            this.validator = new this.validatorClass(10);

            this.anonMethod = function () {
                this.validator.trigger("test value");
            }.bind(this);

            expect(this.anonMethod).not.toThrow();
        });

        it("should throw an exception if the given value is not allowed", function () {
            this.validator = new this.validatorClass(10);

            this.anonMethod = function () {
                this.validator.trigger("test value with extra chars");
            }.bind(this);

            expect(this.anonMethod).toThrow(new this.ValidationError("This field must not exceed 10 chars."));
        });

    });

    describe("A testcase for class RegExpValidator", function () {

        beforeAll(function () {
            this.validatorClass = plugin.validators.RegExpValidator;
        });

        it("should create a new instance with default options", function () {
            this.validator = new this.validatorClass(/^[\w ]+$/);

            expect(this.validator instanceof this.AbstractValidator).toBeTruthy();
            expect(this.validator.regExp.source).toEqual("^[\\w ]+$");
            expect(this.validator.code).toEqual("invalid");
            expect(this.validator.message).toEqual("This field must be a valid value.");
        });

        it("should not throw an exception if the given value is allowed", function () {
            this.validator = new this.validatorClass(/^[\w ]+$/);

            this.anonMethod = function () {
                this.validator.trigger("test value");
            }.bind(this);

            expect(this.anonMethod).not.toThrow();
        });

        it("should throw an exception if the given value is not allowed", function () {
            this.validator = new this.validatorClass(/^[\w ]+$/);

            this.anonMethod = function () {
                this.validator.trigger("test value with $");
            }.bind(this);

            expect(this.anonMethod).toThrow(new this.ValidationError("This field must be a valid value."));
        });

    });

    describe("A testcase for class URISchemeValidator", function () {

        beforeAll(function () {
            this.validatorClass = plugin.validators.URISchemeValidator;
        });

        it("should create a new instance with default options", function () {
            this.validator = new this.validatorClass(['http', 'https']);

            expect(this.validator instanceof this.AbstractValidator).toBeTruthy();
            expect(this.validator.schemes).toEqual(['http', 'https']);
            expect(this.validator.code).toEqual("invalid_scheme");
            expect(this.validator.message).toEqual("The URI scheme must be (http | https).");
        });

        it("should not throw an exception if the given value is allowed", function () {
            this.validator = new this.validatorClass(['http', 'https']);

            this.anonMethod = function () {
                this.validator.trigger("http://localhost:8080");
            }.bind(this);

            expect(this.anonMethod).not.toThrow();
        });

    });

});
