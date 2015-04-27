module.exports = function(grunt) {

  grunt.initConfig({
    jshint : {
      files : ['server.js', 'lib/**/*.js']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
}
