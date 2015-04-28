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

        it("should throw an exception whether the control is null", function() {

            anonymousMethod = function anonymousMethod() {
                field = new fmval.fields.BaseField("test");
            };

            expect(anonymousMethod).toThrowError(TypeError);
        });

    });

    describe("A TextField TestCase", function() {

        it("should create an instance with no options successfully", function() {
            field = new fmval.fields.TextField("test");

            expect(field instanceof fmval.fields.BaseField).toBeTruthy();

            expect(field.element).toEqual('input');
            expect(field.element).toHaveAttr('type', "text");
            expect(field.element).toHaveClass(fmval.getOption('controlClass'));
            expect(field.element).toHaveAttr('name', "test");

            expect(field.validators.length).toEqual(2);
            expect(field.validators).toContain(new fmval.validators.RequiredValidator());
            expect(field.validators).toContain(new fmval.validators.MaxLengthValidator(1024));
        });

        it("should create an instance with required=false", function() {
            field = new fmval.fields.TextField("test", {
                'required': false
            });

            expect(field.validators.length).toEqual(1);
            expect(field.validators).toContain(new fmval.validators.MaxLengthValidator(1024));
        });

        it("should create an instance with minLength=5", function() {
            field = new fmval.fields.TextField("test", {
                'minLength': 5
            });

            expect(field.validators.length).toEqual(3);
            expect(field.validators).toContain(new fmval.validators.RequiredValidator());
            expect(field.validators).toContain(new fmval.validators.MinLengthValidator(5));
            expect(field.validators).toContain(new fmval.validators.MaxLengthValidator(1024));
        });

        it("should create an instance with minLength=10 and maxLength=5", function() {
            field = new fmval.fields.TextField("test", {
                'minLength': 10,
                'maxLength': 5
            });

            expect(field.validators.length).toEqual(2);
            expect(field.validators).toContain(new fmval.validators.RequiredValidator());
            expect(field.validators).toContain(new fmval.validators.MinLengthValidator(10));
        });

        it("should create an instance with pattern=/^[\\w ]+$/", function() {
            field = new fmval.fields.TextField("test", {
                'pattern': /^[\w ]+$/
            });

            expect(field.validators.length).toEqual(3);
            expect(field.validators).toContain(new fmval.validators.RequiredValidator());
            expect(field.validators).toContain(new fmval.validators.MaxLengthValidator(1024));
            expect(field.validators).toContain(new fmval.validators.RegexValidator(/^[\w ]+$/));
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

        it("should create an instance with initialValue='test'", function() {
            field = new fmval.fields.TextField("test", {
                'initialValue': "test"
            });
            expect(field.initialValue).toEqual("test");
            expect(field.hasError()).toBeFalsy();
        });

        it("should throw an exception whether the 'error' given is null", function() {
            field = new fmval.fields.TextField("test");

            anonymousMethod = function anonymousMethod() {
                field.setError(null);
            };

            expect(anonymousMethod).toThrowError(TypeError, "The property 'error' must be an instance of ValidationError.");
        });

        it("should throw an exception whether it adds an invalid control", function() {
            var testElement;

            field = new fmval.fields.TextField("test");
            testElement = document.createElement('textarea');

            anonymousMethod = function anonymousMethod() {
                field.setControl(testElement);
            };

            expect(anonymousMethod).toThrowError(TypeError);
        });

        it("should keep the default type whether the 'type' given is null", function() {

            field = new fmval.fields.TextField("test", {
                'type': null
            });

            expect(field.type).toEqual("text");
        });

        it("should throw an exception whether the 'placeholder' given is not null or a not empty string", function() {

            anonymousMethod = function anonymousMethod() {
                field = new fmval.fields.TextField("test", {
                    'placeholder': 3
                });
            };

            expect(anonymousMethod).toThrowError(TypeError, "The property 'placeholder' must be a string or null.");
        });

        it("should throw an exception whether the 'label' given is not null or a not empty string", function() {

            anonymousMethod = function anonymousMethod() {
                field = new fmval.fields.TextField("test", {
                    'label': 3
                });
            };

            expect(anonymousMethod).toThrowError(TypeError, "The property 'label' must be a string or null.");
        });

        it("should throw an exception whether the 'initialValue' given is not null or a not empty string", function() {

            anonymousMethod = function anonymousMethod() {
                field = new fmval.fields.TextField("test", {
                    'initialValue': 3
                });
            };

            expect(anonymousMethod).toThrowError(TypeError, "The property 'initialValue' must be a string or null.");
        });

        it("should change the control class by default", function() {
            expect(fmval.getOption('controlClass')).toEqual("form-control");

            fmval.updateSettings({
                'controlClass': "control-test"
            });

            field = new fmval.fields.TextField("test");

            expect(field.element).toHaveClass("control-test");

            fmval.cleanCache();
            expect(fmval.getOption('controlClass')).toEqual("form-control");
        });

        it("should throw an exception whether the 'name' given is a empty string", function() {

            anonymousMethod = function anonymousMethod() {
                field = new fmval.fields.TextField("");
            };

            expect(anonymousMethod).toThrowError(TypeError, "The property 'name' must be a not empty string.");
        });

        it("should throw an exception whether the 'error' is null yet", function() {
            field = new fmval.fields.TextField("test");

            anonymousMethod = function anonymousMethod() {
                field.getErrorMessage();
            };

            expect(anonymousMethod).toThrowError(TypeError, "The property 'error' must be an instance of ValidationError.");
        });

        it("should add a new error successfully", function() {
            field = new fmval.fields.TextField("test");

            field.setError(new fmval.validators.ValidationError("This field is being tested."));
            expect(field.getErrorMessage()).toEqual("This field is being tested.");
        });

        it("should use 'required' as first validator by default", function() {
            field = new fmval.fields.TextField("test");

            expect(field.hasError()).toBeTruthy();
            expect(field.getErrorMessage()).toEqual("This field is required.");
        });

        it("should clean the object after validating the field successfully", function() {
            field = new fmval.fields.TextField("test", {
                'minLength': 5
            });

            field.element.value = "test";
            expect(field.hasError()).toBeTruthy();

            field.clean();

            expect(field.error).toBeNull();
            expect(field.getValue()).toEqual("");
        });

    });

    describe("A PasswordField TestCase", function() {

        it("should create an instance with no options successfully", function() {
            field = new fmval.fields.PasswordField("test");

            expect(field instanceof fmval.fields.TextField).toBeTruthy();
            expect(field.element).toHaveAttr('type', "password");
        });

    });

    describe("A LongTextField TestCase", function() {

        it("should create an instance with no options successfully", function() {
            field = new fmval.fields.LongTextField("test");

            expect(field instanceof fmval.fields.BaseField).toBeTruthy();

            expect(field.element).toEqual('textarea');
            expect(field.element).toHaveClass(fmval.getOption('controlClass'));
            expect(field.element).toHaveAttr('name', "test");
        });

    });

});
