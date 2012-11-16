module.exports = function(grunt) {
  "use strict";

  var Builder = require('../').Builder;

  grunt.registerMultiTask("spritesheet", "Compile images to sprite sheet", function() {
    var helpers = require('grunt-lib-contrib').init(grunt);
    var options = helpers.options(this);
    var done = this.async()

    grunt.verbose.writeflags(options, "Options");

    // TODO: ditch this when grunt v0.4 is released
    this.files = this.files || helpers.normalizeMultiTaskFiles(this.data, this.target);

    var srcFiles;
    var images;

    grunt.utils.async.forEachSeries( this.files, function(file, callback) {
      var builder;
      var dir = ''; //grunt.task.expand( './..' );
      
      srcFiles = grunt.file.expandFiles(file.src);
      
      for ( var i = 0; i < srcFiles.length; i++ ) {
        srcFiles[ i ] = dir + srcFiles[ i ];
      }
      
      options.outputDirectory = dir + file.dest;
      
      builder = new Builder( srcFiles, options );
      builder.build( callback );
    },
    done );
  });
};