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


describe("A test suite for the helpers", function () {

    "use strict";

    describe("A testcase for the object helpers", function () {

        beforeAll(function () {
            this.cloneObject = plugin.utils.object.clone;
            this.updateObject = plugin.utils.object.update;
        });

        it("should throw error when source is not simple instance of object", function () {
            this.anonMethod = function () {
                this.cloneObject(0);
            }.bind(this);

            expect(this.anonMethod).toThrowError(TypeError);
        });

        it("should create empty object when trg-prop and src-prop are null or undefined", function () {
            expect(this.updateObject()).toEqual({});
            expect(this.updateObject(null, null)).toEqual({});
            expect(this.updateObject({}, {})).toEqual({});
        });

        it("should update trg-prop when trg-prop is null and src-prop is any kind", function () {
            expect(this.updateObject({a: null}, {a: null})).toEqual({a: null});
            expect(this.updateObject({a: null}, {a: undefined})).toEqual({a: null});
            expect(this.updateObject({a: null}, {a: 0})).toEqual({a: 0});
            expect(this.updateObject({a: null}, {a: true})).toEqual({a: true});
            expect(this.updateObject({a: null}, {a: "test"})).toEqual({a: "test"});
            expect(this.updateObject({a: null}, {a: []})).toEqual({a: []});
            expect(this.updateObject({a: null}, {a: {b: 0}})).toEqual({a: {b: 0}});
            expect(this.updateObject({a: null}, {a: Object})).toEqual({a: Object});
        });

        it("should update trg-prop when trg-prop and src-prop are instance of same class", function () {
            expect(this.updateObject({a: 0}, {a: 1})).toEqual({a: 1});
            expect(this.updateObject({a: true}, {a: false})).toEqual({a: false});
            expect(this.updateObject({a: "test1"}, {a: "test2"})).toEqual({a: "test2"});
            expect(this.updateObject({a: [0]}, {a: [1]})).toEqual({a: [0, 1]});
            expect(this.updateObject({a: {b: 0}}, {a: {c: true}})).toEqual({a: {b: 0, c: true}});
        });

        it("should update trg-prop when trg-prop is parent class of src-prop", function () {
            expect(this.updateObject({test: Object}, {test: Object})).toEqual({test: Object});
            expect(this.updateObject({test: Object}, {test: Number})).toEqual({test: Number});
        });

        it("should keep trg-prop when trg-prop and src-prop are instance of different class", function () {
            expect(this.updateObject({a: 0}, {a: null})).toEqual({a: 0});
            expect(this.updateObject({a: true}, {a: 0})).toEqual({a: true});
            expect(this.updateObject({a: "test1"}, {a: { b: "test2"}})).toEqual({a: "test1"});
            expect(this.updateObject({a: [0]}, {a: Object})).toEqual({a: [0]});
            expect(this.updateObject({a: {b: 0}}, {a: []})).toEqual({a: {b: 0}});
            expect(this.updateObject({a: Array}, {a: Number})).toEqual({a: Array});
        });

        it("should add src-prop when trg-prop has not got it", function () {
            expect(this.updateObject(null, {a: 0})).toEqual({a: 0});
            expect(this.updateObject(null, {a: null})).toEqual({a: null});
            expect(this.updateObject({a: 0}, {b: []})).toEqual({a: 0, b: []});
        });

    });

    describe("A testcase for the string helpers", function () {

        beforeAll(function () {
            this.formatString = plugin.utils.string.format;
        });

        it("should format target given named arguments", function () {
            expect(this.formatString("name: %(name)s", {name: "value"})).toEqual("name: value");
        });

    });

    describe("A testcase for the pattern helpers", function () {

        beforeAll(function () {
            this.email = new RegExp(plugin.utils.pattern.email, "i");
            this.url = new RegExp(plugin.utils.pattern.url, "i");
        });

        it("should check if url pattern works with urls", function () {
            expect(this.url.test("http://test.org")).toBeTruthy();
        });

        it("should check if url pattern does not work with non-urls", function () {
            expect(this.url.test("http://test.u")).toBeFalsy();
        });

        it("should check if email pattern works with emails", function () {
            expect(this.email.test("nickname@domain.org")).toBeTruthy();
        });

        it("should check if email pattern does not work with non-emails", function () {
            expect(this.email.test("a@b.c")).toBeFalsy();
        });

    });

    describe("A testcase for the object inheritance", function () {

        beforeAll(function () {
            this.defineClass = plugin.utils.inheritance.defineClass;
        });

        it("should create a new instance successfully", function () {
            this.anonClass = this.defineClass({
                constructor: function TestClass(prop1) {
                    this.prop1 = prop1;
                },
                members : {
                    getProp1: function getProp1() {
                        return this.prop1;
                    }
                }
            });
            this.test = new this.anonClass("test");

            expect(this.test.getProp1()).toEqual("test");
        });

        it("should create a new instance inherited another class successfully", function () {
            this.anon1Class = this.defineClass({
                constructor: function Test1Class(prop1) {
                    this.prop1 = prop1;
                },
                members : {
                    getProp1: function getProp1() {
                        return this.prop1;
                    }
                }
            });
            this.anon2Class = this.defineClass({
                constructor: function Test2Class(prop1) {
                    this.superClass(prop1);
                },
                inherit: this.anon1Class
            });

            this.test = new this.anon2Class("test");

            expect(this.test instanceof this.anon1Class).toBeTruthy();
            expect(this.test.getProp1()).toEqual("test");
        });

        it("should create a new instance bound mixin class successfully", function () {
            this.anonMixin = this.defineClass({
                constructor: function TestMixin(prop2) {
                    this.prop2 = prop2;
                },
                members : {
                    getProp2: function getProp2() {
                        return this.prop2;
                    }
                }
            });
            this.anonClass = this.defineClass({
                constructor: function TestClass(prop1) {
                    this.prop1 = prop1;
                    this.mixinClass(0, "mixin_prop");
                },
                mixins: [this.anonMixin],
                members : {
                    getProp1: function getProp1() {
                        return this.prop1;
                    }
                }
            });

            this.test = new this.anonClass("test");

            expect(this.test instanceof this.anonMixin).toBeFalsy();
            expect(this.test.getProp1()).toEqual("test");
            expect(this.test.getProp2()).toEqual("mixin_prop");
        });

        it("should throw error when constructor has error", function () {
            this.anon1Class = this.defineClass({
                constructor: function Test1Class(prop1) {
                    if (typeof prop1 !== 'string') {
                        throw new TypeError("[error description]");
                    }
                    this.prop1 = prop1;
                },
                members : {
                    getProp1: function getProp1() {
                        return this.prop1;
                    }
                }
            });
            this.anon2Class = this.defineClass({
                constructor: function Test2Class(prop1) {
                    this.superClass(prop1);
                },
                inherit: this.anon1Class
            });

            this.anonMethod = function () {
                this.test = new this.anon2Class(0);
            }.bind(this);

            expect(this.anonMethod).toThrowError(TypeError);
        });

        it("should create a new instance inherited different classes successfully", function () {
            this.anon1Class = this.defineClass({
                constructor: function Test1Class(prop1) {
                    this.prop1 = prop1;
                },
                members : {
                    getProp1: function getProp1() {
                        return this.prop1;
                    }
                }
            });
            this.anon2Class = this.defineClass({
                constructor: function Test2Class(prop1) {
                    this.superClass(prop1);
                },
                inherit: this.anon1Class
            });
            this.anon3Class = this.defineClass({
                constructor: function Test3Class(prop1) {
                    this.superClass(prop1);
                },
                inherit: this.anon2Class
            });

            this.test = new this.anon3Class("test");

            expect(this.test instanceof this.anon1Class).toBeTruthy();
            expect(this.test instanceof this.anon2Class).toBeTruthy();
            expect(this.test.getProp1()).toEqual("test");
        });

    });

});


describe("A test suite for the settings", function () {

    "use strict";

    beforeAll(function () {
        this.getSetting = plugin.settings.get;
    });

    it("should return default setting", function () {
        expect(this.getSetting("controlClass")).toEqual("field-control");
    });

    it("should update default settings", function () {
        plugin.settings.update({
            controlClass: "test-control"
        });

        expect(this.getSetting("controlClass")).toEqual("test-control");
    });

    it("should clean user settings when default settings were modified", function () {
        plugin.settings.update({
            controlClass: "test-control"
        });
        plugin.settings.clean();

        expect(this.getSetting("controlClass")).toEqual("field-control");
    });

    it("should throw error when setting name does not exist", function () {
        this.anonMethod = function () {
            this.getSetting("test");
        }.bind(this);

        expect(this.anonMethod).toThrowError(TypeError);
    });

});
