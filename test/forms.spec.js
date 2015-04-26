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
            this.fieldList1 = [
                new fmval.fields.TextField('test1'),
                new fmval.fields.LongTextField('test2')
            ];
        });

        it("should throw an exception whether the HTML form do not exist", function() {

            anonymousMethod = function anonymousMethod() {
                form = new fmval.forms.BaseForm("form-test", []);
            };

            expect(anonymousMethod).toThrowError(TypeError);
        });

        it("should create an instance with no fields successfully", function() {
            jasmine.getFixtures().load("form-with-no-fields.html");

            form = new fmval.forms.BaseForm("form-test", []);

            expect(form.element instanceof HTMLFormElement).toBeTruthy();
        });

        it("should create an instance with fields successfully", function() {
            jasmine.getFixtures().load("form-with-no-fields.html");

            form = new fmval.forms.BaseForm("form-test", this.fieldList1);

            expect(form.element instanceof HTMLFormElement).toBeTruthy();
        });

        it("should throw an exception whether a field is not instance of BaseField", function() {
            jasmine.getFixtures().load("form-with-no-fields.html");

            anonymousMethod = function anonymousMethod() {
                form = new fmval.forms.BaseForm("form-test", ["error"]);
            };

            expect(anonymousMethod).toThrowError(TypeError, "The field is not instance of BaseField.");
        });

        it("should validate the list 1 of fields", function() {
            jasmine.getFixtures().load("form-with-no-fields.html");

            form = new fmval.forms.BaseForm("form-test", this.fieldList1);

            expect(form.isValid()).toBeFalsy();
            expect("test1" in form.errors).toBeTruthy();
        });

        it("should build and validate the list 1 of fields", function() {
            jasmine.getFixtures().load("form-with-no-fields.html");

            form = new fmval.forms.BaseForm("form-test", this.fieldList1);
            form.build();

            expect(form.isValid()).toBeFalsy();
            expect("test1" in form.errors).toBeTruthy();
        });

        it("should clean the list1 of fields", function() {
            jasmine.getFixtures().load("form-with-no-fields.html");

            form = new fmval.forms.BaseForm("form-test", this.fieldList1);

            expect(form.isValid()).toBeFalsy();

            form.cleanAll();
            expect(!Object.keys(form.errors).length).toBeTruthy();
        });

        it("should throw an exception whether the field name is not saved", function() {
            jasmine.getFixtures().load("form-with-no-fields.html");

            form = new fmval.forms.BaseForm("form-test", this.fieldList1);

            anonymousMethod = function anonymousMethod() {
                form.hasError("test-not-found");
            };

            expect(anonymousMethod).toThrowError(TypeError, "The field test-not-found is not found.");
        });

        it("should add an error message to a particular field", function() {
            jasmine.getFixtures().load("form-with-no-fields.html");

            form = new fmval.forms.BaseForm("form-test", this.fieldList1);
            form.addError('test1', new fmval.validators.ValidationError("This field is being tested."))

            expect(form.errors.test1).toEqual("This field is being tested.");
        });

        it("should build the list 1 of fields in a form with fields ", function() {
            jasmine.getFixtures().load("form-with-fields.html");

            form = new fmval.forms.BaseForm("form-test", this.fieldList1);

            expect(form.isValid()).toBeFalsy();
            expect("test1" in form.errors).toBeTruthy();
        });

    });

});
