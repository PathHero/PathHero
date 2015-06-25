'use strict';
module.exports = function(grunt) {
  grunt.file.setBase(__dirname);
  grunt.loadNpmTasks('grunt-notify');
  grunt.loadNpmTasks('grunt-jsxhint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-env');
  grunt.loadNpmTasks('grunt-istanbul');
  grunt.loadNpmTasks('grunt-react');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-preprocess');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    browserify: {
      options: {
        browserifyOptions: {
          debug: true
        }
      },
      'Client/play/static/playBundle.js': [
        'Client/play/src/compiled/play.js'
      ],
      'Client/create/static/createBundle.js': [
        'Client/create/src/compiled/create.js',
      ]
    },

    react: {
      playFiles: {
        expand: true,
        cwd: 'Client/play/src',
        src: ['**/*.jsx'],
        dest: 'Client/play/src/compiled',
        ext: '.js'
      },
      createFiles: {
        expand: true,
        cwd: 'Client/create/src',
        src: ['**/*.jsx'],
        dest: 'Client/create/src/compiled',
        ext: '.js'
      }
    },

    preprocess: {
      multifile: {
        files: {
          'Client/index.hbs' : 'Client/index.pre.hbs',
          'Client/create/create.hbs' : 'Client/create/create.pre.hbs',
          'Client/create/index.hbs' : 'Client/create/index.pre.hbs',
          'Client/create/login.hbs' : 'Client/create/login.pre.hbs',
          'Client/play/index.hbs' : 'Client/play/index.pre.hbs',
          'Client/play/player.hbs': 'Client/play/player.pre.hbs'
        }
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'nyan',
          clearRequireCache: true
        },
        src: ['Spec/**/*.js']
      },
      cov: {
        options: {
          reporter: 'min',
          quite: false,
          clearRequireCache: true
        },
        src: ['Spec/**/*.js']
      }
    },

    jshint: {
      files: [
        'Gruntfile.js',
        'server.js',
        'Client/create/src/*.js',
        'Client/play/src/*.js',
        'Client/create/src/*.jsx',
        'Client/play/src/*.jsx',
        'Server/**/*.js',
        'Spec/**/*.js'
      ],
      options: {
        jshintrc: true,
        force: true,
      }
    },

    env: {
      coverage: {
        APP_DIR_FOR_CODE_COVERAGE: '../coverage/instrument/'
      },
    },

    instrument: {
      ignore: ['Client/bower_components/**/*.js'],
      files: [
        'Client/create/**/*.js',
        'Client/play/**/*.js',
        'Server/**/*.js'
      ],
      options: {
        lazy: true,
        basePath: 'coverage/instrument/',
        instrumenter: require('istanbul-react').Instrumenter,
      }
    },

    storeCoverage: {
      options: {
        dir: 'coverage/reports'
      }
    },

    makeReport: {
      src: 'coverage/**/*.json',
      options: {
        type: 'lcov',
        dir: 'coverage/reports',
        print: 'detail'
      }
    },

    sass: {
      dev: {
        src: ['Client/style/style.scss'],
        dest: 'Client/style/style.css'
      },
    },

    concurrent: {
      dev: {
        tasks: ['nodemon', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    watch: {
      client: {
        files: [
          'Client/lib/**/*.js',
          'Client/create/src/**/*.js',
          'Client/play/src/**/*.js',
          'Client/create/src/**/*.jsx',
          'Client/play/src/**/*.jsx',
        ],
        options: {
          livereload: true
        },
        tasks: ['jshint', 'react', 'browserify']
      },
      css: {
        files: [
          'Client/style/*.css'
        ],
        options: {
          livereload: true
        },
        tasks: []
      },
      server: {
        files: [
          'Gruntfile.js',
          'server.js',
          'Server/**/*.js',
          'Spec/**/*.js'
        ],
        tasks: ['check']
      },
      sass: {
        // We watch and compile sass files as normal but don't live reload here
        files: ['Client/style/*.scss'],
        tasks: ['sass'],
      },
    }
  });

  grunt.registerTask('process', 'preprocess');
  grunt.registerTask('test', 'mochaTest:test');
  grunt.registerTask('check', ['jshint', 'mochaTest:test', 'coverage']);
  grunt.registerTask('coverage', ['env:coverage', 'instrument', 'mochaTest:cov',
    'storeCoverage', 'makeReport']);
  grunt.registerTask('default', ['concurrent']);
  grunt.registerTask('deploy', ['react', 'browserify', 'nodemon']);
};
