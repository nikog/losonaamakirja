module.exports = function(grunt) {
 
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
      uglify: {
	options: {
	  mangle: false
	},
        deploy: {
          files: {
            'web/js/app.min.js': [
		'web/js/bootstrap.js',
		'web/js/bootstrap-affix.js',
		'web/js/bootstrap-alert.js',
		'web/js/bootstrap-carousel.js',
		'web/js/bootstrap-collapse.js',
		'web/js/bootstrap-button.js',
		'web/js/bootstrap-modal.js',
		'web/js/bootstrap-scrollspy.js',
		'web/js/bootstrap-tab.js',
		'web/js/bootstrap-tooltip.js',
		'web/js/bootstrap-transition.js',
		'web/js/bootstrap-typeahead.js',
		'web/js/bootstrap-dropdown.js',
  		  
		'web/js/directives.js',
		'web/js/filters.js',
		'web/js/services.js',
		'web/js/controllers.js',
		'web/js/app.js'
	   ]
         }
       }
     },
	cssmin: {
                options: {
                  's0': true  
                },
		compress: {
			files: {
				'web/css/losofacebook-main.min.css': [
					'web/css/losofacebook-*.css'
				]}
			}
		}
  });
 
  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-contrib-cssmin');
 
  // Default task(s).
  grunt.registerTask('default', ['uglify', 'cssmin']);
 
};
