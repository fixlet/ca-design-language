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
                    src: ['bootstrap.scss'],
                    dest: 'src/css',
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
                src: 'src/css/*.css'
            }
        },
        cssmin: { // Begin CSS Minify Plugin
            target: {
                files: [{
                    expand: true,
                    cwd: 'src/css',
                    src: ['*.css', '!*.min.css'],
                    dest: 'src/css',
                    ext: '.min.css'
                }]
            }
        },

        //CLEAN CONFIGURATION
        clean: {
            devcss: 'app/css/*',
            devjs: 'app/js/*',
        },

        concat: {
            options: {
                // Custom function to remove all export and import statements
                process: function (src) {
                    return src.replace(/^(export|import).*/gm, '');
                }
            },
            bootstrap: {
                src: [
                    'app/src/js/bootstrap/*.js'
                ],
                dest: 'app/src/js/bootstrap.js'
            }
        },

        //JS
        babel: {
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
            build: {
                src: ['app/js/*.js'],
                dest: 'app/js/script.min.js'
            }
        },


        //WATCHERS
        watch: {
            css: {
                files: '**/*.scss',
                tasks: ['sass', 'postcss', 'cssmin']
            },
            js: {
                files: '**/*.js',
                tasks: ['uglify']
            }
        }
    });

    require('load-grunt-tasks')(grunt, { // These plugins provide necessary tasks.
        scope: 'devDependencies',
        pattern: ['grunt-*'] // Exclude Sass compilers. We choose the one to load later on.
        //pattern: ['grunt-*', '!grunt-sass', '!grunt-contrib-sass'] // Exclude Sass compilers. We choose the one to load later on.
    });
    require('time-grunt')(grunt);

    // Supported Compilers: sass (Ruby) and libsass.
    /*(function (sassCompilerName) {
        require('./grunt/bs-sass-compile/' + sassCompilerName + '.js')(grunt);
    })(process.env.TWBS_SASS || 'libsass');*/

    // Register Grunt tasks
    grunt.registerTask('default', ['watch']);

    //clean
    grunt.registerTask('clean-dev-css', ['clean:devcss']);
    grunt.registerTask('clean-dev-js', ['clean:devjs']);

    //styles
    grunt.registerTask('dev-css', ['sass', 'postcss', 'cssmin']);

    //js
    grunt.registerTask('dev-concat-bootstrap', ['concat:bootstrap']);
    grunt.registerTask('dev-js', ['clean:devjs', 'babel:dev', 'uglify:build']);
};