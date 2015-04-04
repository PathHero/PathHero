'use strict';
module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-notify');
  grunt.loadNpmTasks('grunt-jsxhint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-jest');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      files: [
        'Gruntfile.js',
        'server.js',
        'preprocessor.js',
        'Client/**/*.js',
        'Server/**/*.js',
      ],
      options: {jshintrc: true}
    },

    jest: {
      options: {
        coverage: true
      }
    },

    sass: {
      dev: {
        src: ['Client/style/*.sass'],
        dest: 'Client/style/style.css',
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
          'Client/**/*.js',
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

  grunt.registerTask('check', ['jshint', 'jest']);
  grunt.registerTask('default', ['concurrent']);
};
