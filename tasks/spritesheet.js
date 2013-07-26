var fs = require( "fs" );

module.exports = function( grunt ) {
    "use strict";

    var Builder = require( '../' ).Builder;

    grunt.registerMultiTask( "spritesheet", "Compile images to sprite sheet", function() {
        var options = this.options(),
            done = this.async();

        grunt.verbose.writeflags( options, "Options" );

        var srcFiles;

        grunt.util.async.forEachSeries( this.files, function( file, callback ) {
            var builder,
                dir = '',
                files = [], f;

            srcFiles = grunt.file.expand( file.src );

            for( var i = 0; i < srcFiles.length; i++ ) {
                f = dir + srcFiles[ i ];

                if ( fs.statSync( f ).isFile() ) {
                    files.push( f );
                }
            }

            options.images = files;
            options.outputDirectory = dir + file.dest;

            builder = Builder.fromGruntTask( options );
            builder.build( callback );
        },
        done );
    });
}; 
