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


describe("A Test Suite for API Forms", function() {
    var anonymousMethod, form;

    jasmine.getFixtures().fixturesPath = "test/fixtures";

    describe("A BaseForm TestCase", function() {

        beforeAll(function () {

            this.fields1 = [
                new fmval.fields.TextField('test1')
            ];

            this.fields2 = [
                new fmval.fields.TextField('test1', {
                    'initialValue': "test"
                }),
                new fmval.fields.LongTextField('test2')
            ];

        });

        it("should throw an exception whether the HTML form do not exist", function() {

            anonymousMethod = function anonymousMethod() {
                form = new fmval.forms.BaseForm("form-test", []);
            };

            expect(anonymousMethod).toThrowError(TypeError, "The form 'form-test' must be an instance of HTMLFormElement.");
        });

        it("should create an instance with no fields successfully", function() {
            jasmine.getFixtures().load("form-with-no-fields.html");

            form = new fmval.forms.BaseForm("form-test", []);

            expect(form.element instanceof HTMLFormElement).toBeTruthy();
            expect(Object.keys(form.fields).length).toBe(0);
        });

        it("should create an instance with fields successfully", function() {
            jasmine.getFixtures().load("form-with-no-fields.html");

            form = new fmval.forms.BaseForm("form-test", this.fields1);

            expect(form.element instanceof HTMLFormElement).toBeTruthy();
            expect(Object.keys(form.fields).length).toBe(1);
          });

        it("should throw an exception whether a field is not instance of BaseField", function() {
            jasmine.getFixtures().load("form-with-no-fields.html");

            anonymousMethod = function anonymousMethod() {
                form = new fmval.forms.BaseForm("form-test", ["error"]);
            };

            expect(anonymousMethod).toThrowError(TypeError, "The argument 'field' must be an instance of BaseField.");
        });

        it("should validate the list 1 of fields", function() {
            jasmine.getFixtures().load("form-with-no-fields.html");

            form = new fmval.forms.BaseForm("form-test", this.fields1);

            expect(form.isValid()).toBeFalsy();
            expect("test1" in form.errors).toBeTruthy();
        });

        it("should build and validate the list 1 of fields", function() {
            jasmine.getFixtures().load("form-with-no-fields.html");

            form = new fmval.forms.BaseForm("form-test", this.fields1);
            form.build();

            expect(form.isValid()).toBeFalsy();
            expect("test1" in form.errors).toBeTruthy();
        });

        it("should clean the list1 of fields", function() {
            jasmine.getFixtures().load("form-with-no-fields.html");

            form = new fmval.forms.BaseForm("form-test", this.fields1);

            expect(form.isValid()).toBeFalsy();

            form.cleanAll();
            expect(!Object.keys(form.errors).length).toBeTruthy();
        });

        it("should throw an exception whether the field name is not saved", function() {
            jasmine.getFixtures().load("form-with-no-fields.html");

            form = new fmval.forms.BaseForm("form-test", this.fields1);

            anonymousMethod = function anonymousMethod() {
                form.hasError("test-not-found");
            };

            expect(anonymousMethod).toThrowError(TypeError, "The field 'test-not-found' is not found.");
        });

        it("should add an error message to a particular field", function() {
            jasmine.getFixtures().load("form-with-no-fields.html");

            form = new fmval.forms.BaseForm("form-test", this.fields1);
            form.setErrorMessage('test1', "This field is being tested.");

            expect(form.errors.test1).toEqual("This field is being tested.");
        });

        it("should build the list 1 of fields in a form with fields", function() {
            jasmine.getFixtures().load("form-with-fields.html");

            form = new fmval.forms.BaseForm("form-test", this.fields1);

            expect(form.isValid()).toBeFalsy();
            expect("test1" in form.errors).toBeTruthy();
        });

        it("should validate a list of fields with initial data", function() {
            jasmine.getFixtures().load("form-with-no-fields.html");

            form = new fmval.forms.BaseForm("form-test", this.fields2);

            expect(form.isValid()).toBeFalsy();
            expect("test1" in form.errors).toBeFalsy();
            expect("test1" in form.data).toBeTruthy();
        });

        it("should add initial value to a field saved", function() {
            jasmine.getFixtures().load("form-with-no-fields.html");

            form = new fmval.forms.BaseForm("form-test", this.fields1);
            form.setInitialValue('test1', "test");

            expect(form.isValid()).toBeTruthy();
            expect("test1" in form.errors).toBeFalsy();
            expect("test1" in form.data).toBeTruthy();
        });

    });

});
