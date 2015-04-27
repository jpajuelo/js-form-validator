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


module.exports = function (grunt) {

    var modules = {

        main: [
            "src/core.js",
            "src/utils.js",
            "src/settings.js"
        ],

        validators: [
            "src/validators/ValidationError.js",
            "src/validators/BaseValidator.js",
            "src/validators/RequiredValidator.js",
            "src/validators/MinLengthValidator.js",
            "src/validators/MaxLengthValidator.js",
            "src/validators/RegexValidator.js"
        ],

        fields: [
            "src/fields/BaseField.js",
            "src/fields/TextField.js",
            "src/fields/LongTextField.js",
            "src/fields/PasswordField.js"
        ],

        forms: [
            "src/forms/BaseForm.js"
        ]

    };

    grunt.initConfig({

        banner: [
            " *  Copyright 2015 Jaime Pajuelo",
            " *",
            " *  Licensed under the Apache License, Version 2.0 (the \"License\");",
            " *  you may not use this file except in compliance with the License.",
            " *  You may obtain a copy of the License at",
            " *",
            " *      http://www.apache.org/licenses/LICENSE-2.0",
            " *",
            " *  Unless required by applicable law or agreed to in writing, software",
            " *  distributed under the License is distributed on an \"AS IS\" BASIS,",
            " *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.",
            " *  See the License for the specific language governing permissions and",
            " *  limitations under the License."
        ].join("\n"),

        plugin: modules.main
            .concat(modules.validators)
            .concat(modules.fields)
            .concat(modules.forms),

        pkg: grunt.file.readJSON("package.json"),

        jshint: {
            options: {
                undef: true,
                globalstrict: true,
                globals: {
                    document: true,
                    fmval: true,
                    HTMLElement: true,
                    HTMLFormElement: true
                }
            },
            all: "<%= plugin %>"
        },

        jasmine: {
            options: {
                specs: "test/**/*.spec.js",
                vendor: [
                    "bower_components/jquery/dist/jquery.js",
                    "bower_components/jasmine-jquery/lib/jasmine-jquery.js"
                ],
                template: require('grunt-template-jasmine-istanbul'),
                templateOptions: {
                    coverage: "test/reports/coverage.json",
                    report: "test/reports/coverage/html"
                }
            },
            all: "<%= plugin %>"
        },

        concat: {
            options: {
                banner: [
                    "/*!",
                    "<%= banner %>",
                    " */",
                    "\n",
                    "\"use strict\";",
                    "\n\n"
                ].join("\n"),
                separator: "\n\n",
                stripBanners: true,
                process: function (src, filepath) {
                    return src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
                }
            },
            dist: {
                src: "<%= plugin %>",
                dest: "dist/<%= pkg.name %>.js"
            }
        },

        uglify: {
            options: {
                banner: [
                    "/*!",
                    "<%= banner %>",
                    " */\n"
                ].join("\n"),
                preserveComments: false,
                mangle: false
            },
            dist: {
                src: '<%= concat.dist.dest %>',
                dest: 'dist/<%= pkg.name %>.min.js'
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-jasmine');

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('test', ['jshint:all', 'jasmine:all']);
    grunt.registerTask('dist', ['concat:dist', 'uglify:dist']);
    grunt.registerTask('default', ['test', 'dist']);

};
