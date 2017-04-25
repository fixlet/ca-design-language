// Load Grunt
module.exports = function (grunt) {
    'use strict'

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        //STYLES
        sass: { // Begin Sass Plugin
            dist: {
                options: {
                    sourceMap: true,
                    sourceMapEmbed: false
                },
                files: [{
                    expand: true,
                    cwd: 'src/scss',
                    src: ['index.scss', 'DEMO.scss'],
                    dest: 'build/css',
                    ext: '.css'
                }]
            },
            dev: {
                options: {
                    sourceMap: true,
                    sourceMapEmbed: true
                },
                files: [{
                    expand: true,
                    cwd: 'src/scss',
                    src: ['index.scss'],
                    dest: '../asm/assets/ca-design/css/',
                    rename: function (dest, src) {
                        return dest + src.replace('index', 'ca-design.min');
                    },
                    ext: '.css'
                }]
            }
        },
        postcss: { // Begin Post CSS Plugin
            options: {
                map: false,
                processors: [
                    require('autoprefixer')
                ]
            },
            dist: {
                src: 'build/css/*.css'
            }
        },
        cssmin: { // Begin CSS Minify Plugin
            target: {
                files: [{
                    expand: true,
                    cwd: 'build/css',
                    src: ['*.css', '!*.min.css'],
                    dest: 'build/css',
                    ext: '.min.css'
                }]
            }
        },

        //CLEAN CONFIGURATION
        clean: {
            all: 'build/**',
            devcss: 'build/css/**',
            devjs: 'build/js/**',
        },

        concat: {
            options: {
                // Custom function to remove all export and import statements
                process: function (src) {
                    return src.replace(/^(export|import).*/gm, '');
                }
            },
            bootstrap: {
                //TODO rewrite
                src: [
                    'app/src/js/bootstrap/*.js'
                ],
                dest: 'app/src/js/bootstrap.js'
            }
        },

        copy: {
            assets: {
                files: [
                    {expand: true, cwd: 'src/', src: ['fonts/**'], dest: 'build/'},
                    {expand: true, cwd: 'src/', src: ['img/**'], dest: 'build/'}
                ],
            },
        },

        //JS
        babel: {
            //TODO rewrite
            dev: {
                options: {
                    sourceMap: true
                },
                files: [
                    {
                        expand: true,
                        cwd: 'app/src/js',
                        src: ['*.js'],
                        dest: 'app/js/'
                    }
                ]
            },
            //TODO rewrite
            dist: {
                /*options: {
                 extends: '../../js/.babelrc'
                 },*/
                files: {
                    '<%= concat.bootstrap.dest %>': '<%= concat.bootstrap.dest %>'
                }
            }
        },

        uglify: {
            //TODO rewrite
            build: {
                src: ['app/js/*.js'],
                dest: 'app/js/script.min.js'
            }
        },

        //WATCHERS
        watch: {
            css: {
                files: 'src/scss/dlg/**/*.scss',
                tasks: ['asm-css']
            },
            // js: {
            //     files: '**/*.js',
            //     tasks: ['uglify']
            // }
        }
    });


    require('load-grunt-tasks')(grunt, { // These plugins provide necessary tasks.
        scope: 'devDependencies',
        pattern: ['grunt-*'] // Exclude Sass compilers. We choose the one to load later on.
    });
    require('time-grunt')(grunt);

    // Register Grunt tasks
    grunt.registerTask('default', ['watch']);

    //clean
    grunt.registerTask('clean-all', ['clean:all']);
    grunt.registerTask('clean-css', ['clean:devcss']);
    grunt.registerTask('clean-js', ['clean:devjs']);

    grunt.registerTask('copy-assets', ['copy:assets']);

    //styles
    grunt.registerTask('dev-css', ['sass:dist', 'postcss', 'cssmin']);
    grunt.registerTask('asm-css', ['sass:dev']);

    //js
    grunt.registerTask('dev-concat-bootstrap', ['concat:bootstrap']);
    grunt.registerTask('dev-js', ['clean:devjs', 'babel:dev', 'uglify:build']);
};