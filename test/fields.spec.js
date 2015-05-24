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


describe("A test suite for field classes", function() {

    "use strict";

    beforeAll(function () {
        this.settings = plugin.settings;
        this.AbstractField = plugin.fields.AbstractField;
        this.ValidationError = plugin.validators.ValidationError;
        this.RequiredValidator = plugin.validators.RequiredValidator;
        this.MaxLengthValidator = plugin.validators.MaxLengthValidator;
        this.MinLengthValidator = plugin.validators.MinLengthValidator;
        this.RegExpValidator = plugin.validators.RegExpValidator;
    });

    afterEach(function () {
        this.settings.clean();
    });

    describe("A testcase for class AbstractField", function() {

        it("should throw error if new instance is created with default options", function() {
            this.anonMethod = function () {
                this.field = new this.AbstractField("test");
            }.bind(this);

            expect(this.anonMethod).toThrow();
        });

        it("should create a new instance with controlTag='input'", function() {
            this.field = new this.AbstractField("test", {
                controlTag: 'input'
            });

            expect(this.field.validators.length).toEqual(1);
            expect(this.field.validators).toContain(new this.RequiredValidator());
        });

        it("should create a new instance with controlTag='input' and required=false", function() {
            this.field = new this.AbstractField("test", {
                controlTag: 'input',
                required: false
            });

            expect(this.field.validators.length).toEqual(0);
        });

        it("should create a new instance with attr placeholder='Test'", function() {
            this.field = new this.AbstractField("test", {
                controlTag: 'input',
                controlAttrs: {
                    placeholder: "Test"
                }
            });

            expect(this.field.control).toHaveAttr('placeholder', "Test");
        });

        it("should create a new instance with label='Test:'", function() {
            this.field = new this.AbstractField("test", {
                label: "Test:",
                controlTag: 'input'
            });

            expect(this.field.label).toEqual(this.settings.get('labelTag'));
            expect(this.field.label).toHaveText("Test:");
            expect(this.field.label).toHaveAttr('for', "id_test");
        });

        it("should create a new instance with helpText='Enter chars.'", function() {
            this.field = new this.AbstractField("test", {
                helpText: "Enter chars.",
                controlTag: 'input'
            });

            expect(this.field.helpText).toEqual(this.settings.get('helpTextTag'));
            expect(this.field.helpText).toHaveText("Enter chars.");
        });

        it("should create a new instance with attr id='test'", function() {
            this.field = new this.AbstractField("test", {
                controlTag: 'input',
                controlAttrs: {
                    id: "test"
                }
            });

            expect(this.field.control).toHaveId("test");
        });

        it("should create a new instance with attr id=''", function() {
            this.field = new this.AbstractField("test", {
                controlTag: 'input',
                controlAttrs: {
                    id: ""
                }
            });

            expect(this.field.control.id).toEqual("");
        });

        it("should create a new instance with setting controlId=''", function() {
            this.settings.update({
                controlId: ""
            });

            this.field = new this.AbstractField("test", {
                label: "Test:",
                controlTag: 'input'
            });

            expect(this.field.label).not.toHaveAttr('for');
            expect(this.field.control.id).toEqual("");
        });

        it("should add label with optional text when required is false", function() {
            this.field = new this.AbstractField("test", {
                label: "Test",
                required: false,
                controlTag: 'input'
            });

            expect(this.field.label).not.toBeNull();
            expect(this.field.label).toContainElement("small");
        });

        it("should set failure state by default when it is validated", function() {
            this.field = new this.AbstractField("test", {
                controlTag: 'input'
            });
            this.field.validate();

            expect(this.field.errorMessage).toEqual("This field is required.");
            expect(this.field.state).toEqual(plugin.fields.states.FAILURE);
        });

        it("should add new error and clean the field", function() {
            this.field = new this.AbstractField("test", {
                controlTag: 'input'
            });

            this.field.addError(new this.ValidationError("This field has an error."))
            expect(this.field.errorMessage).toEqual("This field has an error.");
            expect(this.field.state).toEqual(plugin.fields.states.FAILURE);

            this.field.clean();
            expect(this.field.error).toBeNull();
            expect(this.field.state).toEqual(plugin.fields.states.CLEANED);
        });

        it("should throw error when error added is failed", function() {
            this.field = new this.AbstractField("test", {
                controlTag: 'input'
            });

            this.anonMethod = function () {
                this.field.addError(new Error("error message"));
            }.bind(this);

            expect(this.anonMethod).toThrowError(TypeError);
        });

        it("should throw error when event name does not exist", function() {
            this.field = new this.AbstractField("test", {
                controlTag: 'input'
            });

            this.anonMethod = function () {
                this.field.attach('invalid_event');
            }.bind(this);

            expect(this.anonMethod).toThrowError(TypeError);

            this.anonMethod = function () {
                this.field.dispatch('invalid_event');
            }.bind(this);

            expect(this.anonMethod).toThrowError(TypeError);
        });

    });

    describe("A testcase for class BaseTextField", function() {

        beforeAll(function () {
            this.fieldClass = plugin.fields.BaseTextField;
        });

        it("should create a new instance with default options", function () {
            this.field = new this.fieldClass("test");

            expect(this.field instanceof this.AbstractField).toBeTruthy();
            expect(this.field.control).toEqual('input');
            expect(this.field.validators.length).toEqual(1);
            expect(this.field.validators).toContain(new this.RequiredValidator());
        });

        it("should create a new instance with minlength=5", function () {
            this.field = new this.fieldClass("test", {
                minLength: 5
            });

            expect(this.field.validators.length).toEqual(2);
            expect(this.field.validators).toContain(new this.RequiredValidator());
            expect(this.field.validators).toContain(new this.MinLengthValidator(5));
        });

        it("should create a new instance with minlength=10 and maxlength=5", function () {
            this.field = new this.fieldClass("test", {
                minLength: 10,
                maxLength: 5
            });

            expect(this.field.validators.length).toEqual(2);
            expect(this.field.validators).toContain(new this.RequiredValidator());
            expect(this.field.validators).toContain(new this.MinLengthValidator(10));
        });

        it("should create a new instance with minlength=5 and maxlength=10", function () {
            this.field = new this.fieldClass("test", {
                minLength: 5,
                maxLength: 10
            });

            expect(this.field.validators.length).toEqual(3);
            expect(this.field.validators).toContain(new this.RequiredValidator());
            expect(this.field.validators).toContain(new this.MinLengthValidator(5));
            expect(this.field.validators).toContain(new this.MaxLengthValidator(10));
        });

        it("should create a new instance with regexp=/^[\\w ]+$/", function () {
            this.field = new this.fieldClass("test", {
                regExp: /^[\w ]+$/
            });

            expect(this.field.validators.length).toEqual(2);
            expect(this.field.validators).toContain(new this.RequiredValidator());
            expect(this.field.validators).toContain(new this.RegExpValidator(/^[\w ]+$/));
        });

        it("should throw error if given 'name' is an empty string", function() {
            this.anonMethod = function () {
                this.field = new this.fieldClass("");
            }.bind(this);

            expect(this.anonMethod).toThrowError(TypeError, "The name must be a not-empty string.");
        });

    });

    describe("A testcase for class TextField", function() {

        beforeAll(function () {
            this.fieldClass = plugin.fields.TextField;
        });

        it("should create a new instance with default options", function () {
            this.field = new this.fieldClass("test");

            expect(this.field instanceof this.AbstractField).toBeTruthy();
            expect(this.field.control).toEqual('input');
            expect(this.field.control).toHaveAttr("type", "text");
            expect(this.field.validators.length).toEqual(1);
            expect(this.field.validators).toContain(new this.RequiredValidator());
        });

        it("should validate the field given a simple validator", function() {
            this.field = new this.fieldClass("test", {
                required: false
            });

            this.field.addValidator(function (value) {
                if (!value.length) {
                    throw new this.ValidationError("This field has an error.");
                }
            }.bind(this));

            this.field.validate();

            expect(this.field.errorMessage).toEqual("This field has an error.");
            expect(this.field.state).toEqual(plugin.fields.states.FAILURE);
        });

        it("should throw error when validator throws a non ValidationError", function() {
            this.field = new this.fieldClass("test", {
                required: false
            });

            this.field.addValidator(function (value) {
                if (!value.length) {
                    throw new TypeError("The error is not a ValidationError");
                }
            }.bind(this));

            this.anonMethod = function () {
                this.field.validate();
            }.bind(this);

            expect(this.anonMethod).toThrowError(TypeError, "The error is not a ValidationError");
        });

        it("should keep object this when handler is added with no thisArg", function() {
            this.field = new this.fieldClass("test", {
                required: false
            });

            this.field.attach('success', function () {
                if (this instanceof plugin.fields.TextField) {
                    throw new TypeError("The thisArg is instance of TextField");
                }
            });

            this.anonMethod = function () {
                this.field.validate();
            }.bind(this);

            expect(this.anonMethod).toThrowError(TypeError, "The thisArg is instance of TextField");
        });

    });

    describe("A testcase for class PasswordField", function() {

        beforeAll(function () {
            this.fieldClass = plugin.fields.PasswordField;
        });

        it("should create a new instance with default options", function () {
            this.field = new this.fieldClass("test");

            expect(this.field instanceof this.AbstractField).toBeTruthy();
            expect(this.field.control).toHaveAttr("type", "password");
        });

    });

    describe("A testcase for class EmailField", function() {

        beforeAll(function () {
            this.fieldClass = plugin.fields.EmailField;
        });

        it("should create a new instance with default options", function () {
            this.field = new this.fieldClass("test");

            expect(this.field instanceof this.AbstractField).toBeTruthy();
            expect(this.field.control).toHaveAttr("type", "text");
        });

        it("should validate a valid email address successfully", function() {
            this.field = new this.fieldClass("test");

            this.field.control.value = "test@domain.org";
            this.field.validate();

            expect(this.field.errorMessage).toBeNull();
            expect(this.field.state).toEqual(plugin.fields.states.SUCCESS);
        });

    });

    describe("A testcase for class LongTextField", function() {

        beforeAll(function () {
            this.fieldClass = plugin.fields.LongTextField;
        });

        it("should create a new instance with default options", function () {
            this.field = new this.fieldClass("test");

            expect(this.field instanceof this.AbstractField).toBeTruthy();
            expect(this.field.control).toEqual("textarea");
        });

    });

    describe("A testcase for class URLField", function() {

        beforeAll(function () {
            this.fieldClass = plugin.fields.URLField;
        });

        it("should create a new instance with default options", function () {
            this.field = new this.fieldClass("test");

            expect(this.field instanceof this.AbstractField).toBeTruthy();
            expect(this.field.control).toHaveAttr("type", "text");
        });

        it("should validate a valid URL successfully", function() {
            this.field = new this.fieldClass("test");

            this.field.control.value = "http://test.org";
            this.field.validate();

            expect(this.field.errorMessage).toBeNull();
            expect(this.field.state).toEqual(plugin.fields.states.SUCCESS);
        });

        it("should add uri scheme validator when class is instantiated", function() {
            this.field = new this.fieldClass("test", {
                schemes: ['https']
            });

            this.field.control.value = "http://test.org";
            this.field.validate();

            expect(this.field.errorMessage).toEqual("The URI scheme must be (https).");
            expect(this.field.state).toEqual(plugin.fields.states.FAILURE);
        });

        it("should add uri scheme validator when class is instantiated and error message is modified", function() {
            this.field = new this.fieldClass("test", {
                schemes: ['https'],
                errorMessages: {
                    invalid_scheme: "The errorMessage was modified"
                }
            });

            this.field.control.value = "http://test.org";
            this.field.validate();

            expect(this.field.errorMessage).toEqual("The errorMessage was modified");
            expect(this.field.state).toEqual(plugin.fields.states.FAILURE);
        });

    });

    describe("A testcase for class ChoiceField", function() {

        beforeAll(function () {
            this.fieldClass = plugin.fields.ChoiceField;
            this.choices = {
                test1: "Test 1",
                test2: "Test 2"
            };
        });

        it("should create a new instance with default options", function () {
            this.field = new this.fieldClass("test");

            expect(this.field instanceof this.AbstractField).toBeTruthy();
            expect(this.field.control).toEqual("select");
        });

        it("should add choices when field is created", function () {
            this.field = new this.fieldClass("test", {
                choices: this.choices
            });

            expect(this.field.selected).toHaveValue("test1");
        });

        it("should select the second option when field is created", function () {
            this.field = new this.fieldClass("test", {
                choices: this.choices
            });

            this.field.addInitialValue("test2");
            expect(this.field.selected).toHaveValue("test2");
        });

        it("should throw error when initialValue is not contained", function () {
            this.field = new this.fieldClass("test", {
                choices: this.choices
            });

            this.anonMethod = function () {
                this.field.addInitialValue("test3");
            }.bind(this);

            expect(this.anonMethod).toThrowError(TypeError);
        });

        it("should validate field successfully", function () {
            this.field = new this.fieldClass("test", {
                choices: this.choices
            });

            this.field.validate();

            expect(this.field.state).toEqual(plugin.fields.states.SUCCESS);
        });

        it("should throw invalid_choice when option is added without using addChoice", function () {
            var option = $("<option>").val("test3").text("Test 3").get(0);

            this.field = new this.fieldClass("test", {
                choices: this.choices
            });

            this.field.control.appendChild(option);
            option.selected = true;

            this.field.validate();

            expect(this.field.selected).toBeNull();
            expect(this.field.errorMessage).toEqual("The selected 'test3' is out of the given choices.");
        });

    });

});
