module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    browserify : {
		  app : {
		    files : { 
		    	'public/build/js/commonRTC.js' : ['public/js/commonRTC.js'],
		    	'public/build/js/starter.js' : ['public/js/starter.js'],
		    	'public/build/js/feedback.js' : ['public/js/feedback.js']
		    }
		  }
		},
		express: {
		    dev: {
		      options: {
		        script: 'server.js',
		        background: false
		      }
		    },
		    background: {
		    	options: {
			        script: 'server.js',
			        background: true
			    }
		    }
		},
		watch: {
			js: {
				files: ['public/js/*.js'],
				tasks: ['browserify', 'uglify']
			}
		},
		uglify: {
			options: {
	    	},
		    main: {
		      files: {
		        'public/build/js/starter.min.js': ['public/build/js/starter.js'],
		        'public/build/js/feedback.min.js': ['public/build/js/feedback.js']
		      }
		    }
		},
		jshint: {
		  files: ['Gruntfile.js', 'public/js/*.js', 'test/public/*.js'],
			options: {
				curly: true,
				eqeqeq: true,
				eqnull: true,
				browser: true,
				globals: {
					jQuery: true
				}
			}
		}
  });

  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  
  grunt.registerTask('build-dev', ['browserify', 'express:dev', 'watch']);
  grunt.registerTask('default', ['express:background', 'jshint', 'browserify', 'uglify', 'watch']);
  grunt.registerTask('travis', ['jshint', 'browserify', 'uglify']);
};
