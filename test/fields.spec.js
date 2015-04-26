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


describe("A Test Suite for API Fields", function() {
    var anonymousMethod, field;

    describe("A BaseField TestCase", function() {

        it("should create an instance with no options successfully", function() {
            field = new fmval.fields.BaseField("test");

            expect(field instanceof fmval.fields.BaseField).toBeTruthy();

            expect(field.name).toEqual("test");
            expect(field.element).toBeNull();
            expect(field.validatorList.length).toEqual(2);
            expect(field.getErrorMessage()).toEqual("");
        });

        it("should throw an exception whether the control is null", function() {
            field = new fmval.fields.BaseField("test");

            anonymousMethod = function anonymousMethod() {
                field.getControl();
            };

            expect(anonymousMethod).toThrowError(TypeError);

            anonymousMethod = function anonymousMethod() {
                field.clean();
            };

            expect(anonymousMethod).toThrowError(TypeError);

            anonymousMethod = function anonymousMethod() {
                field.getValue();
            };

            expect(anonymousMethod).toThrowError(TypeError);

        });

        it("should create an instance with no options successfully", function() {
            field = new fmval.fields.BaseField("test");

            expect(field instanceof fmval.fields.BaseField).toBeTruthy();

            expect(field.name).toEqual("test");
            expect(field.element).toBeNull();
            expect(field.validatorList.length).toEqual(2);
        });

    });

    describe("A TextField TestCase", function() {

        it("should create an instance with no options successfully", function() {
            field = new fmval.fields.TextField("test");

            expect(field instanceof fmval.fields.TextField).toBeTruthy();

            expect(field.element).toEqual('input');
            expect(field.element).toHaveClass("form-control");
            expect(field.element).toHaveAttr('name', "test");

            expect(field.validatorList.length).toEqual(2);
            expect(field.validatorList).toContain(new fmval.validators.RequiredValidator());
            expect(field.validatorList).toContain(new fmval.validators.MaxLengthValidator(1024));
        });

        it("should create an instance with required=false", function() {
            field = new fmval.fields.TextField("test", {
                'required': false
            });

            expect(field.validatorList.length).toEqual(1);
            expect(field.validatorList).toContain(new fmval.validators.MaxLengthValidator(1024));
        });

        it("should create an instance with minLength=5", function() {
            field = new fmval.fields.TextField("test", {
                'minLength': 5
            });

            expect(field.validatorList.length).toEqual(3);
            expect(field.validatorList).toContain(new fmval.validators.RequiredValidator());
            expect(field.validatorList).toContain(new fmval.validators.MinLengthValidator(5));
            expect(field.validatorList).toContain(new fmval.validators.MaxLengthValidator(1024));
        });

        it("should create an instance with minLength=10 and maxLength=5", function() {
            field = new fmval.fields.TextField("test", {
                'minLength': 10,
                'maxLength': 5
            });

            expect(field.validatorList.length).toEqual(2);
            expect(field.validatorList).toContain(new fmval.validators.RequiredValidator());
            expect(field.validatorList).toContain(new fmval.validators.MinLengthValidator(10));
        });

        it("should create an instance with pattern=/^[\\w ]+$/", function() {
            field = new fmval.fields.TextField("test", {
                'pattern': /^[\w ]+$/
            });

            expect(field.validatorList.length).toEqual(3);
            expect(field.validatorList).toContain(new fmval.validators.RequiredValidator());
            expect(field.validatorList).toContain(new fmval.validators.MaxLengthValidator(1024));
            expect(field.validatorList).toContain(new fmval.validators.RegexValidator(/^[\w ]+$/));
        });

        it("should create an instance with placeholder='Test'", function() {
            field = new fmval.fields.TextField("test", {
                'placeholder': "Test"
            });

            expect(field.element).toHaveAttr('placeholder', "Test");
        });

        it("should create an instance with label='Test:'", function() {
            field = new fmval.fields.TextField("test", {
                'label': "Test:"
            });

            expect(field.label).toEqual('label');
            expect(field.label).toHaveText("Test:");
        });

        it("should not change the current name for null", function() {
            field = new fmval.fields.TextField("test");

            field.setName(null);
            expect(field.element).toHaveAttr('name', "test");
        });

        it("should not change the errorMessage for null", function() {
            field = new fmval.fields.TextField("test");

            expect(field.hasError()).toBeTruthy();
            field.setErrorMessage(null);
            expect(field.getErrorMessage()).toEqual("This field is required.");
        });

        it("should add a new errorMessage successfully", function() {
            field = new fmval.fields.TextField("test");

            field.setErrorMessage(new fmval.validators.ValidationError("This field is being tested."));
            expect(field.getErrorMessage()).toEqual("This field is being tested.");
        });

        it("should use RequiredValidator by default", function() {
            field = new fmval.fields.TextField("test");

            expect(field.hasError()).toBeTruthy();
            expect(field.getErrorMessage()).toEqual("This field is required.");
        });

        it("should clean the object after validating the field", function() {
            field = new fmval.fields.TextField("test", {
                'minLength': 5
            });

            field.element.value = "test";
            expect(field.hasError()).toBeTruthy();

            field.clean();

            expect(field.errorMessage).toBeNull();
            expect(field.getValue()).toEqual("");
        });

    });

    describe("A PasswordField TestCase", function() {

        it("should create an instance with no options successfully", function() {
            field = new fmval.fields.PasswordField("test");

            expect(field instanceof fmval.fields.PasswordField).toBeTruthy();

            expect(field.name).toEqual("test");
            expect(field.element).toHaveAttr('type', "password");
            expect(field.element).not.toBeNull();
        });

    });

    describe("A LongTextField TestCase", function() {

        it("should create an instance with no options successfully", function() {
            field = new fmval.fields.LongTextField("test");

            expect(field instanceof fmval.fields.LongTextField).toBeTruthy();

            expect(field.name).toEqual("test");
            expect(field.element).not.toBeNull();
        });

    });

});
