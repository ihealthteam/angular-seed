'use strict';
var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;

var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

var fallbackToIndex = function (connect, index) {
  return connect().use(function (req, res, next) {
    if(req.url === '/index.html') {
      return next();
    }
    res.end( require('fs').readFileSync(index) );
  });
};

module.exports = function (grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // configurable paths
  var yeomanConfig = {
    app: 'app',
    dist: 'dist'
  };

  try {
    yeomanConfig.app = require('./bower.json').appPath || yeomanConfig.app;
  } catch (e) {}

  grunt.initConfig({
    yeoman: yeomanConfig,
    docular: {
      copyDocDir: '/docs',
      baseUrl: 'http://localhost:8000', //base tag used by Angular
      showAngularDocs: false, //parse and render Angular documentation
      showDocularDocs: false, //parse and render Docular documentation
      docAPIOrder : ['doc', 'angular'], //order to load ui resources
      groups: [
        {
          groupTitle: 'CleverStack Seed', //Title used in the UI
          groupId: 'cleverstack', //identifier and determines directory
          groupIcon: 'icon-book', //Icon to use for this group
          sections: [
            {
              id: "api",
              title: "API",
              scripts: [
                "app/scripts/init.js",
                "app/scripts/routes.js",
                "app/scripts/services",
                "app/scripts/filters",
                "app/scripts/directives"
              ]
            }
          ]
        }
      ] //groups of documentation to parse
    },
    karma: {
      options: {
        configFile: 'karma.conf.js',
        browsers: ['PhantomJS'],

      },
      unit: {
        reporters: ['dots'],
        background: true,
        runnerPort: 9100
      },
      e2e: {
        configFile: 'karma.e2e.conf.js',
        reporters: ['dots'],
        background: true,
        runnerPort: 9200
      },
      ci: {
        unit: {
          configFile: 'karma.conf.js',
          reporters: ['junit', 'coverage'],
          singleRun: true
        },
        e2e: {
          configFile: 'karma.e2e.conf.js'
        }
      }
    },
    watch: {
      unit: {
        files: ['app/scripts/**/*.js', 'test/unit/**/*.js'],
        tasks: ['karma:unit:run']
      },
      e2e: {
        files: ['app/scripts/**/*.js', 'test/e2e/**/*.js'],
        tasks: ['karma:e2e:run']
      },
      jade: {
        files: [
          'app/views/**/*.jade',
          'app/views/**/partials/*.jade'
        ],
        tasks: ['jade']
      },
      stylus: {
        files: ['<%= yeoman.app %>/styles/{,*/}*.styl', '<%= yeoman.app %>/styles/**/*.styl'],
        tasks: ['stylus']
      },
      livereload: {
        files: [
          '<%= yeoman.app %>/{,*/}*.html',
          '{.tmp,<%= yeoman.app %>}/styles/{,*/}*.css',
          '{.tmp,<%= yeoman.app %>}/views/{,*/}*.html',
          '{.tmp,<%= yeoman.app %>}/scripts/{,*/}*.js',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ],
        tasks: ['livereload']
      }
    },
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: '0.0.0.0'
      },
      livereload: {
        options: {
          middleware: function (connect) {
            return [
              lrSnippet,
              mountFolder(connect, '.tmp'),
              mountFolder(connect, yeomanConfig.app),
              fallbackToIndex(connect, 'app/index.html')
            ];
          }
        }
      },
      test: {
        options: {
          middleware: function (connect) {
            return [
              mountFolder(connect, '.tmp'),
              mountFolder(connect, 'test'),
              fallbackToIndex(connect, '.tmp/index.html')
            ];
          }
        }
      }
    },
    open: {
      server: {
        url: 'http://localhost:<%= connect.options.port %>'
      },
      docs: {
        url: 'docs/index.html'
      }
    },
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/*',
            '!<%= yeoman.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        '<%= yeoman.app %>/scripts/{,*/}*.js'
      ]
    },
    concat: {
      dist: {
        files: {
          '<%= yeoman.dist %>/scripts/scripts.js': [
            '.tmp/scripts/{,*/}*.js',
            '<%= yeoman.app %>/scripts/{,*/}*.js'
          ]
        }
      }
    },
    useminPrepare: {
      html: '<%= yeoman.app %>/index.html',
      options: {
        dest: '<%= yeoman.dist %>'
      }
    },
    usemin: {
      html: ['<%= yeoman.dist %>/{,*/}*.html'],
      css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
      options: {
        dirs: ['<%= yeoman.dist %>']
      }
    },
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '**/*.{png,jpg,jpeg}',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },
    cssmin: {
      dist: {
        files: {
          '<%= yeoman.dist %>/styles/screen.css': [
            '.tmp/styles/{,*/}*.css',
            '<%= yeoman.app %>/styles/{,*/}*.css'
          ]
        }
      }
    },
    htmlmin: {
      dist: {
        options: {
          /*removeCommentsFromCDATA: true,
          // https://github.com/yeoman/grunt-usemin/issues/44
          //collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeAttributeQuotes: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeOptionalTags: true*/
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>',
          src: ['*.html', 'views/**/*.html', 'views/**/partials/*.html'],
          dest: '<%= yeoman.dist %>'
        }]
      }
    },
    ngmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>/scripts',
          src: '*.js',
          dest: '<%= yeoman.dist %>/scripts'
        }]
      }
    },
    uglify: {
      dist: {
        files: {
          '<%= yeoman.dist %>/scripts/scripts.js': [
            '<%= yeoman.dist %>/scripts/scripts.js'
          ]
        }
      }
    },
    rev: {
      dist: {
        files: {
          src: [
            '<%= yeoman.dist %>/scripts/{,*/}*.js',
            '<%= yeoman.dist %>/styles/{,*/}*.css',
            '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
            '<%= yeoman.dist %>/styles/fonts/*'
          ]
        }
      }
    },
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.{ico,txt}',
            '.htaccess',
            'components/**/*.{js,css,eot,svg,ttf,woff,png,jpg,jpeg,gif,webp}',
            'images/{,*/}*.{gif,webp, png}',
            'images/**/*.{gif,webp, png}',
            'styles/fonts/**/*',
            'fonts/**/*',
            'home/**/*'
          ]
        }]
      }
    }
  });

  grunt.renameTask('regarde', 'watch');

  grunt.registerTask('docs', ['docular']);

  grunt.registerTask('test', [
    'karma:unit',
    'watch:unit'
  ]);

  grunt.registerTask('test:unit', [
    'test'
  ]);

  grunt.registerTask('test:ci', [
    'karma:ci:unit',
    'karma:ci:e2e'
  ]);

  grunt.registerTask('test:e2e', [
    'karma:e2e',
    'watch:e2e'
  ]);

  grunt.registerTask('server', [
    'clean:server',
    'livereload-start',
    'connect:livereload',
    'watch'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    // 'jshint',
    'useminPrepare',
    'imagemin',
    'cssmin',
    'htmlmin',
    'concat',
    'copy',
    'ngmin',
    'uglify',
    'rev',
    'usemin',
    'docs'
  ]);

  grunt.registerTask('default', ['build']);
};