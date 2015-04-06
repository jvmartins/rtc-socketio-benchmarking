module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    bower : {
      install : {
        options : {
          targetDir : 'bower_components',
          layout : 'byComponent',
          verbose: true,
          cleanup: true
        }
      }
    },
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
		scripts: {
			files: ['public/js/*.js'],
			tasks: ['browserify', 'uglify']
		},
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
	}
  })

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-contrib-watch');
  
  grunt.registerTask('build-dev', ['bower:install', 'browserify', 'express:dev']);
  grunt.registerTask('default', ['express:background', 'browserify', 'uglify', 'watch'])

}
