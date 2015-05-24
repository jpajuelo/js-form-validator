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


module.exports = function (grunt) {

    "use strict";

    var modules = {

        core: [
            "src/main.js",
            "src/utils/main.js",
            "src/utils/object.js",
            "src/utils/inheritance.js",
            "src/utils/string.js",
            "src/utils/pattern.js",
            "src/settings.js"
        ],

        mixins: [
            "src/mixins/main.js",
            "src/mixins/eventcapturer.js"
        ],

        validators: [
            "src/validators/main.js",
            "src/validators/exception.js",
            "src/validators/abstract.js",
            "src/validators/required.js",
            "src/validators/minlength.js",
            "src/validators/maxlength.js",
            "src/validators/regexp.js",
            "src/validators/urischeme.js"
        ],

        fields: [
            "src/fields/main.js",
            "src/fields/abstract.js",
            "src/fields/basetext.js",
            "src/fields/text.js",
            "src/fields/longtext.js",
            "src/fields/password.js",
            "src/fields/email.js",
            "src/fields/url.js"
        ],

        forms: [
            "src/forms/main.js",
            "src/forms/validator.js"
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

        plugin: modules.core
            .concat(modules.mixins)
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
                    HTMLFormElement: true,
                    plugin: true
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
                process: function process(src) {
                    return src.replace(/(^|\n)[ \t]*"use strict";?\s*\n/g, '$1');
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
