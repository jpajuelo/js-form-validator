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


describe("A test suite for form classes", function() {

    "use strict";

    beforeAll(function () {
        jasmine.getFixtures().fixturesPath = "test/fixtures";
        this.TextField = plugin.fields.TextField;
    });

    describe("A testcase for class FormValidator", function () {

        beforeAll(function () {
            this.formClass = plugin.forms.FormValidator;
            this.fields = [
                new this.TextField("lastname"),
                new this.TextField("username", {
                    required: false
                })
            ];
        });

        beforeEach(function () {
            jasmine.getFixtures().load("form-with-no-fields.html");
        });

        it("should throw error when form name is not found", function () {
            this.anonMethod = function () {
                this.form = new this.formClass("invalid_form", []);
            }.bind(this);

            expect(this.anonMethod).toThrowError(TypeError);
        });

        it("should create instance successfully", function() {
            this.form = new this.formClass("test_form", []);

            expect(this.form.element instanceof HTMLFormElement).toBeTruthy();
            expect(Object.keys(this.form.fields).length).toBe(0);
        });

        it("should add error when first field failed", function() {
            this.form = new this.formClass("test_form", this.fields);

            expect(this.form.isValid()).toBeFalsy();
            expect("lastname" in this.form.errors).toBeTruthy();
            expect("lastname" in this.form.data).toBeFalsy();
        });

        it("should throw error when field is not instance of AbstractField", function() {
            this.anonMethod = function () {
                this.form = new this.formClass("test_form", ["error"]);
            }.bind(this);

            expect(this.anonMethod).toThrowError(TypeError);
        });

        it("should clean form when field has error", function() {
            this.form = new this.formClass("test_form", this.fields);

            expect(this.form.isValid()).toBeFalsy();
            this.form.cleanAll();
            expect(!Object.keys(this.form.errors).length).toBeTruthy();
        });

        it("should add error then form is invalid", function() {
            this.form = new this.formClass("test_form", this.fields);
            this.form.addErrorMessage('lastname', "This field is being tested.");

            expect(this.form.errors.lastname).toEqual("This field is being tested.");
        });

        it("should add initial value then form is valid", function() {
            this.form = new this.formClass("test_form", this.fields);
            this.form.addInitialValue('lastname', "test");

            expect(this.form.isValid()).toBeTruthy();
            expect("lastname" in this.form.errors).toBeFalsy();
            expect("lastname" in this.form.data).toBeTruthy();
        });

    });

});
