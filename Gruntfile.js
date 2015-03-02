/*
 * grunt-vault
 * https://github.com/briguy202/tools
 *
 * Copyright (c) 2015 Brian Hibma
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {
    'use strict';

    require('load-grunt-tasks')(grunt, {
        pattern: ['grunt-*']
    });

    grunt.initConfig({
        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/*.js',
                '<%= nodeunit.tests %>'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        // Before generating any new files, remove any previously-created files.
        clean: {
            tests: ['tmp', 'vaultDefault']
        },

        // Configuration to be run (and then tested).
        vaultpull: {
            options: {
                noop: true
            },
            test_no_options: { },

            test_destination_option: {
                options: {
                    destination: 'tmp/findme'
                }
            },

            test_from_local: {
                options: {
                    // Running this task assumes that you are running an AEM environment at http://localhost:4502
                    noop: false,
                    destination: 'tmp/local'
                }
            }
        },

        vaultclean: {
            options: {
                noop: false
            },
            test_no_options: {
                files: {
                    'tmp/test_no_options_cleaned.xml': ['test/fixtures/dirty.xml']
                }
            },
            test_replacements: {
                files: [
                    { src: ['test/fixtures/dirty.xml'], dest: 'tmp/test_replacements_cleaned.xml' },
                    { src: ['**/*.xml'], dest: 'tmp/replacements/', expand: true, cwd: 'test/fixtures' }
                ],
                options: {
                    replacements: [
                        { search: '/apps/geometrixx/', replacement: '/apps/dev/geometrixx/' },
                        { search: '/content/dam/geometrixx/', replacement: '/content/dev/dam/geometrixx/' }
                    ],
                    jcr_cq_nodes: ['lastModified', 'lastModifiedBy', 'isCheckedOut', 'uuid']
                }
            },
            test_compression: {
                files: [
                    { src: ['**/*.xml'], dest: 'tmp/compression/', expand: true, cwd: 'test/fixtures' }
                ],
                options: {
                    compress: true
                }
            }
        },

        // Unit tests.
        nodeunit: {
            tests: ['test/*_test.js'],
            vaultpull_test: ['test/vaultpull_test.js'],
            vaultclean_test: ['test/vaultclean_test.js']
        }

    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    grunt.registerTask('test_vaultpull', ['clean', 'vaultpull', 'nodeunit:vaultpull_test', 'clean']);
    grunt.registerTask('test_vaultclean', ['clean', 'vaultclean', 'nodeunit:vaultclean_test', 'clean']);
    grunt.registerTask('test_all', ['test_vaultpull', 'test_vaultclean']);
    grunt.registerTask('default', ['jshint', 'test_all']);
};