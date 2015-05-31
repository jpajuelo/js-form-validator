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
        this.baseClass = plugin.fields.AbstractField;
        this.ValidationError = plugin.fields.ValidationError;
        this.checkFailureCallback = function checkFailureCallback(errorMessage) {
            expect(this.callback.calls.count()).toEqual(1);
            expect(this.callback.calls.argsFor(0)[0]).toEqual(errorMessage);
            expect(this.field.hasFailed()).toBeTruthy();
            expect(this.field.errorMessage).toEqual(errorMessage);
        };
        this.checkSuccessCallback = function checkSuccessCallback(value) {
            expect(this.callback.calls.count()).toEqual(1);
            expect(this.callback.calls.argsFor(0)[0]).toEqual(value);
            expect(this.field.hasPassed()).toBeTruthy();
            expect(this.field.errorMessage).toBeNull();
        };
        this.createField = function createField(options) {
            return new this.fieldClass('test', options);
        };
        this.errorMessages = {
            required: "This field is required.",
            min_length: "This field must be at least 5 chars.",
            max_length: "This field must be at most 10 chars.",
            invalid: "This field must be a valid value."
        };
    });

    beforeEach(function () {
        this.callback = jasmine.createSpy('spy');
    });

    afterEach(function () {
        this.settings.clean();
        this.callback = null;
        this.field = null;
    });

    describe("A testcase for class AbstractField", function() {

        beforeAll(function () {
            this.fieldClass = plugin.fields.AbstractField;
        });

        it("should throw error when controlTag is not provided", function() {
            this.anonMethod = function () {
                this.field = this.createField();
            }.bind(this);

            expect(this.anonMethod).toThrow();
        });

        it("should throw error when field name is empty string", function() {
            this.anonMethod = function () {
                this.field = new this.fieldClass("");
            }.bind(this);

            expect(this.anonMethod).toThrowError(TypeError);
        });

        it("should create instance successfully given controlTag", function () {
            this.field = this.createField({
                controlTag: 'input'
            });

            expect(this.field instanceof this.baseClass).toBeTruthy();
            expect(this.field.label).toBeNull();
            expect(this.field.helpText).toBeNull();
            expect(this.field.error).toBeNull();
            expect(this.field.validators.length).toBe(1);
        });

        it("should create instance successfully given field is not required", function () {
            this.field = this.createField({
                controlTag: 'input',
                required: false
            });

            expect(this.field.validators.length).toBe(0);
            expect(this.field.coverage).toBe(100);
        });

        it("should create instance successfully given controlAttr", function () {
            this.field = this.createField({
                controlTag: 'input',
                controlAttrs: {
                    placeholder: "Test"
                }
            });

            expect(this.field.control).toHaveAttr('placeholder', "Test");
        });

        it("should create instance successfully given label", function () {
            this.field = this.createField({
                controlTag: 'input',
                label: "Test"
            });

            expect(this.field.label).toEqual(this.settings.get('labelTag'));
            expect(this.field.label).toHaveText("Test");
            expect(this.field.label).toHaveAttr('for', "id_test");
        });

        it("should create instance successfully given field is not required and label", function () {
            this.field = this.createField({
                controlTag: 'input',
                required: false,
                label: "Test"
            });

            expect(this.field.label).toEqual(this.settings.get('labelTag'));
            expect(this.field.label).toContainElement('small');
            expect(this.field.label).toHaveAttr('for', "id_test");
        });

        it("should create instance successfully given helpText", function () {
            this.field = this.createField({
                controlTag: 'input',
                helpText: "help text"
            });

            expect(this.field.helpText).toEqual(this.settings.get('helpTextTag'));
            expect(this.field.helpText).toHaveText("help text");
        });

        it("should create instance successfully given control id", function () {
            this.field = this.createField({
                controlTag: 'input',
                controlAttrs: {
                    id: "test"
                }
            });

            expect(this.field.control).toHaveId("test");
        });

        it("should create instance successfully given empty control id", function () {
            this.field = this.createField({
                controlTag: 'input',
                controlAttrs: {
                    id: ""
                }
            });

            expect(this.field.label).not.toHaveAttr('for');
            expect(this.field.control.id).toBe("");
        });

        it("should create instance successfully given default empty control id", function () {
            this.settings.update({
                controlId: ""
            });

            this.field = this.createField({
                controlTag: 'input',
                label: "Test"
            });

            expect(this.field.label).not.toHaveAttr('for');
            expect(this.field.control.id).toEqual("");
        });

        it("should clean field given field has failed", function() {
            this.field = this.createField({
                    controlTag: 'input'
                })
                .validate();

            expect(this.field.hasFailed()).toBeTruthy();

            this.field.clean();

            expect(this.field.error).toBeNull();
            expect(this.field.state).toEqual(plugin.fields.states.CLEANED);
        });

        it("should throw error when invalid error is added", function() {
            this.anonMethod = function () {
                this.field = this.createField({
                        controlTag: 'input'
                    })
                    .addError();
            }.bind(this);

            expect(this.anonMethod).toThrowError(TypeError);
        });

        it("should throw error when invalid event name is given", function() {
            this.field = this.createField({
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

        it("should throw error when validator throws non ValidationError", function() {
            this.field = this.createField({
                    controlTag: 'input',
                    required: false
                })
                .addValidator(function (value) {
                    if (!value.length) {
                        throw new TypeError("The error is not a ValidationError");
                    }
                }.bind(this));

            this.anonMethod = function () {
                this.field.validate();
            }.bind(this);

            expect(this.anonMethod).toThrowError(TypeError, "The error is not a ValidationError");
        });

        it("should add validator when addValidator is used", function() {
            this.field = this.createField({
                    controlTag: 'input',
                    required: false
                })
                .addValidator(function (value) {
                    if (!value.length) {
                        throw new this.ValidationError("This field has an error.");
                    }
                }.bind(this))
                .validate();

            expect(this.field.errorMessage).toEqual("This field has an error.");
            expect(this.field.hasFailed()).toBeTruthy();
        });

        it("should use field thisArg when callback thisArg is not provided", function() {
            this.anonMethod = function () {
                this.field = this.createField({
                        controlTag: 'input',
                        required: false
                    })
                    .attach('success', function (value) {
                        if (this instanceof plugin.fields.AbstractField) {
                            throw new TypeError("The thisArg is instance of AbstractField");
                        }
                    })
                    .validate();
            }.bind(this);

            expect(this.anonMethod).toThrowError(TypeError, "The thisArg is instance of AbstractField");
        });

        it("should validate successfully given empty value and field is not required", function () {
            this.field = this.createField({
                    controlTag: 'input',
                    required: false
                })
                .attach('success', this.callback)
                .validate(true);

            this.checkSuccessCallback("");

            this.field.validate();
            expect(this.field.hasChanged()).toBeFalsy();
        });

    });

    describe("A testcase for class BaseTextField", function() {

        beforeAll(function () {
            this.fieldClass = plugin.fields.BaseTextField;
        });

        it("should create instance successfully given default options", function () {
            this.field = this.createField({
                controlTag: 'input'
            });

            expect(this.field instanceof this.baseClass).toBeTruthy();
            expect(this.field.control).toEqual('input');
            expect(this.field.validators.length).toBe(1);
        });

        it("should create instance successfully given zero-based minLength", function () {
            this.field = this.createField({
                controlTag: 'input',
                minLength: 5
            });

            expect(this.field.validators.length).toBe(2);
        });

        it("should create instance successfully given zero-based maxLength", function () {
            this.field = this.createField({
                controlTag: 'input',
                maxLength: 10
            });

            expect(this.field.validators.length).toBe(2);
        });

        it("should create instance successfully given regExp", function () {
            this.field = this.createField({
                controlTag: 'input',
                regExp: /^[\w]+$/
            });

            expect(this.field.validators.length).toBe(2);
        });

        it("should create instance successfully given default validators", function () {
            this.field = this.createField({
                controlTag: 'input',
                required: true,
                minLength: 5,
                maxLength: 10,
                regExp: /^[\w]+$/
            });

            expect(this.field.validators.length).toBe(4);
        });

        it("should not add negative minLength", function () {
            this.field = this.createField({
                controlTag: 'input',
                minLength: -5
            });

            expect(this.field.validators.length).toBe(1);
        });

        it("should not add negative maxLength", function () {
            this.field = this.createField({
                controlTag: 'input',
                maxLength: -5
            });

            expect(this.field.validators.length).toBe(1);
        });

        it("should add maxLength when minLength is lower", function () {
            this.field = this.createField({
                controlTag: 'input',
                minLength: 5,
                maxLength: 10
            });

            expect(this.field.validators.length).toBe(3);
        });

        it("should not add maxLength when minLength is higher", function () {
            this.field = this.createField({
                controlTag: 'input',
                minLength: 10,
                maxLength: 5
            });

            expect(this.field.validators.length).toBe(2);
        });

    });

    [
        {
            constructor: 'TextField',
            constructorExpects: function constructorExpects(field) {
                expect(field.control).toEqual('input');
                expect(field.control).toHaveAttr('type', 'text');
            }
        },
        {
            constructor: 'LongTextField',
            constructorExpects: function constructorExpects(field) {
                expect(field.control).toEqual('textarea');
            }
        },
        {
            constructor: 'PasswordField',
            constructorExpects: function constructorExpects(field) {
                expect(field.control).toEqual('input');
                expect(field.control).toHaveAttr('type', 'password');
            }
        }
    ].forEach(function (field) {

        describe("A testcase for class " + field.constructor, function() {

            beforeAll(function () {
                this.fieldClass = plugin.fields[field.constructor];
            });

            it("should create instance successfully given default options", function () {
                this.field = this.createField();

                expect(this.field instanceof this.baseClass).toBeTruthy();
                expect(this.field.validators.length).toBe(1);
                field.constructorExpects(this.field);
            });

            it("should throw error 'required' when field is validated", function () {
                this.field = this.createField()
                    .attach('failure', this.callback)
                    .validate();

                this.checkFailureCallback(this.errorMessages.required);
            });

            it("should throw error 'min_length' when field is validated", function () {
                this.field = this.createField({
                        minLength: 5
                    })
                    .addInitialValue("test")
                    .attach('failure', this.callback)
                    .validate();

                this.checkFailureCallback(this.errorMessages.min_length);
            });

            it("should throw error 'max_length' when field is validated", function () {
                this.field = this.createField({
                        maxLength: 10
                    })
                    .addInitialValue("testcase for fields")
                    .attach('failure', this.callback)
                    .validate();

                this.checkFailureCallback(this.errorMessages.max_length);
            });

            it("should throw error 'invalid' when field is validated", function () {
                this.field = this.createField({
                        regExp: /^[\w]+$/
                    })
                    .addInitialValue("test-data")
                    .attach('failure', this.callback)
                    .validate();

                this.checkFailureCallback(this.errorMessages.invalid);
            });

            it("should validate successfully given value is not empty", function () {
                this.field = this.createField()
                    .addInitialValue("test")
                    .attach('success', this.callback)
                    .validate();

                this.checkSuccessCallback("test");
            });

            it("should validate successfully when field is not required given value is empty", function () {
                this.field = this.createField({
                        required: false,
                        minLength: 5,
                        maxLength: 10,
                        regExp: /^[\w+]$/
                    })
                    .attach('success', this.callback)
                    .validate();

                this.checkSuccessCallback("");
            });

            it("should validate successfully when field has minLength", function () {
                this.field = this.createField({
                        minLength: 5
                    })
                    .addInitialValue("testcase")
                    .attach('success', this.callback)
                    .validate();

                this.checkSuccessCallback("testcase");
            });

            it("should validate successfully when field has maxLength", function () {
                this.field = this.createField({
                        maxLength: 10
                    })
                    .addInitialValue("testcase")
                    .attach('success', this.callback)
                    .validate();

                this.checkSuccessCallback("testcase");
            });

            it("should validate successfully when field has regExp", function () {
                this.field = this.createField({
                        regExp: /^[\w]+$/
                    })
                    .addInitialValue("testcase")
                    .attach('success', this.callback)
                    .validate();

                this.checkSuccessCallback("testcase");
            });

        });

    });

    describe("A testcase for class EmailField", function () {

        beforeAll(function () {
            this.fieldClass = plugin.fields.EmailField;
            this.errorMessages.invalid_email = "This field must be a valid email address.";
        });

        it("should create instance successfully with default options", function () {
            this.field = this.createField();

            expect(this.field instanceof this.baseClass).toBeTruthy();
            expect(this.field.validators.length).toBe(2);
            expect(this.field.control).toHaveAttr('type', 'text');
        });

        it("should throw error 'required' when field is validated", function () {
            this.field = this.createField()
                .attach('failure', this.callback)
                .validate();

            this.checkFailureCallback(this.errorMessages.required);
        });

        it("should throw error 'invalid' when field is validated", function () {
            this.field = this.createField()
                .attach('failure', this.callback)
                .addInitialValue("invalid email")
                .validate();

            this.checkFailureCallback(this.errorMessages.invalid_email);
        });

        it("should throw error 'invalid' when field is not required and validated", function () {
            this.field = this.createField({
                    required: false
                })
                .attach('failure', this.callback)
                .addInitialValue("invalid email")
                .validate();

            this.checkFailureCallback(this.errorMessages.invalid_email);
        });

        it("should validate successfully when field is not required given value is empty", function () {
            this.field = this.createField({
                    required: false
                })
                .attach('success', this.callback)
                .validate();

            this.checkSuccessCallback("");
        });

        it("should validate successfully given value is a valid email", function () {
            this.field = this.createField({
                    required: false
                })
                .addInitialValue("test@domain.org")
                .attach('success', this.callback)
                .validate();

            this.checkSuccessCallback("test@domain.org");
        });

    });

    describe("A testcase for class URLField", function() {

        beforeAll(function () {
            this.fieldClass = plugin.fields.URLField;
            this.errorMessages.invalid_url = "This field must be a valid URL.";
            this.errorMessages.invalid_scheme = "The URI scheme must be (http).";
        });

        it("should create instance successfully given default options", function () {
            this.field = this.createField();

            expect(this.field instanceof this.baseClass).toBeTruthy();
            expect(this.field.validators.length).toBe(2);
            expect(this.field.control).toHaveAttr('type', 'text');
        });

        it("should create instance successfully given schemes", function () {
            this.field = this.createField({
                schemes: ['http']
            });

            expect(this.field.validators.length).toBe(3);
        });

        it("should throw error 'required' when field is validated", function () {
            this.field = this.createField()
                .attach('failure', this.callback)
                .validate();

            this.checkFailureCallback(this.errorMessages.required);
        });

        it("should throw error 'invalid' when field is validated", function () {
            this.field = this.createField()
                .attach('failure', this.callback)
                .addInitialValue("invalid url")
                .validate();

            this.checkFailureCallback(this.errorMessages.invalid_url);
        });

        it("should throw error 'invalid' when field is not required and validated", function () {
            this.field = this.createField({
                    required: false
                })
                .attach('failure', this.callback)
                .addInitialValue("invalid url")
                .validate();

            this.checkFailureCallback(this.errorMessages.invalid_url);
        });

        it("should throw error 'invalid_scheme' when field is validated", function () {

            this.field = new this.fieldClass("test", {
                    schemes: ['http']
                })
                .attach('failure', this.callback)
                .addInitialValue("https://test.org")
                .validate();

            this.checkFailureCallback(this.errorMessages.invalid_scheme);
        });

        it("should validate successfully when field is not required given value is empty", function () {
            this.field = this.createField({
                    required: false,
                    schemes: ['http']
                })
                .attach('success', this.callback)
                .validate();

            this.checkSuccessCallback("");
        });

        it("should validate successfully given value is a valid URL", function () {
            this.field = this.createField({
                    required: false
                })
                .addInitialValue("http://test.org")
                .attach('success', this.callback)
                .validate();

            this.checkSuccessCallback("http://test.org");
        });

    });

    describe("A testcase for class ChoiceField", function() {

        beforeAll(function () {
            this.fieldClass = plugin.fields.ChoiceField;
            this.errorMessages.invalid_choice = "The selected 'test3' is out of the given choices.";
            this.choices = {
                test1: "Test 1",
                test2: "Test 2"
            };
        });

        it("should create instance successfully given default options", function () {
            this.field = this.createField();

            expect(this.field instanceof this.baseClass).toBeTruthy();
            expect(this.field.validators.length).toBe(2);
            expect(this.field.control).toEqual('select');
            expect(this.field.selected).toBeNull();
        });

        it("should create instance successfully given choices", function () {
            this.field = this.createField({
                choices: this.choices
            });

            expect(this.field.selected).toHaveText(this.choices.test1);
        });

        it("should select given option when field receives initial value", function () {
            this.field = this.createField({
                    choices: this.choices
                })
                .addInitialValue('test2');

            expect(this.field.selected).toHaveText(this.choices.test2);
        });

        it("should throw error when given initial value is not contained", function () {
            this.anonMethod = function () {
                this.field = this.createField()
                    .addInitialValue("test1");
            }.bind(this);

            expect(this.anonMethod).toThrowError(TypeError);
        });

        it("should throw error 'required' when field is validated", function () {
            this.field = this.createField()
                .attach('failure', this.callback)
                .validate();

            this.checkFailureCallback(this.errorMessages.required);
        });

        it("should throw error 'invalid_choice' when field is validated", function () {
            var option = $("<option>").val("test3").text("Test 3").get(0);

            this.field = this.createField({
                    choices: this.choices
                })
                .attach('failure', this.callback);

            this.field.control.appendChild(option);
            option.selected = true;

            this.field.validate();

            this.checkFailureCallback(this.errorMessages.invalid_choice);
        });

        it("should throw error 'invalid_choice' when field is not required and validated", function () {
            var option = $("<option>").val("test3").text("Test 3").get(0);

            this.field = this.createField({
                    required: false,
                    choices: this.choices
                })
                .attach('failure', this.callback);

            this.field.control.appendChild(option);
            option.selected = true;

            this.field.validate();

            this.checkFailureCallback(this.errorMessages.invalid_choice);
        });

        it("should validate successfully given selected option", function () {
            this.field = this.createField({
                    choices: this.choices
                })
                .attach('success', this.callback)
                .validate();

            this.checkSuccessCallback("test1");
        });

        it("should validate successfully when field is not required given value is empty", function () {
            this.field = this.createField({
                    required: false
                })
                .attach('success', this.callback)
                .validate();

            this.checkSuccessCallback("");
        });

        it("should validate successfully when field is not required given selected option", function () {
            this.field = this.createField({
                    required: false,
                    choices: this.choices
                })
                .attach('success', this.callback)
                .validate();

            this.checkSuccessCallback("test1");
        });

    });

});
