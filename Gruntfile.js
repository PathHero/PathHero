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

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

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
        'Client/app/**/*.js',
        'Client/create/**/*.js',
        'Client/play/**/*.js',
        'Client/app/**/*.jsx',
        'Client/create/**/*.jsx',
        'Client/play/**/*.jsx',
        'Server/**/*.js',
        'Spec/**/*.js'
      ],
      options: {
        jshintrc: true,
        ignores: [
          'Client/bower_components/**/*.js'        ],
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
        'Client/app/**/*.js',
        'Client/create/**/*.js',
        'Client/play/**/*.js',
        'Client/app/**/*.jsx',
        'Client/create/**/*.jsx',
        'Client/play/**/*.jsx',
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
          'Client/app/**/*.js',
          'Client/create/**/*.js',
          'Client/play/**/*.js',
          'Client/app/**/*.jsx',
          'Client/create/**/*.jsx',
          'Client/play/**/*.jsx',
        ],
        options: {
          livereload: true
        },
        tasks: ['check']
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

  grunt.registerTask('test', 'mochaTest:test');
  grunt.registerTask('check', ['jshint', 'mochaTest:test', 'coverage']);
  grunt.registerTask('coverage', ['env:coverage', 'instrument', 'mochaTest:cov',
    'storeCoverage', 'makeReport']);
  grunt.registerTask('default', ['concurrent']);
  grunt.registerTask('deploy', ['sass', 'nodemon']);
};
