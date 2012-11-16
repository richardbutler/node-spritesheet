/*global module:false*/
module.exports = function(grunt) {

    grunt.initConfig({
        spritesheet: {
            
            //
            // Simple example.
            //
            flags: {
                options: {
                    outputImage: 'sprite/img/flags.png',
                    outputCss: 'sprite/css/flags.css',
                    selector: '.flag'
                },
                files: {
                    'bin': 'src/img/flags/*'
                }
            },
            
            //
            // Complex example with multiple pixel ratios.
            //
            text: {
                options: {
                    outputCss: 'sprite/css/text.css',
                    selector: ".text",
                    downsampling: "Lanczos",
                    output: {
                        legacy: {
                            pixelRatio: 1,
                            outputImage: 'sprite/img/text.png',
                            resolveImagePath: function( path ) {
                                return path.split( "@2x" ).join( "" );
                            }
                        },
                        retina: {
                            pixelRatio: 2,
                            outputImage: 'sprite/img/text@2x.png',
                        }
                    },
                    resolveImageSelector: function( name, fullpath ) {
                        return name.split( "@2x" ).join( "" );
                    }
                },
                files: {
                    'bin': 'src/img/text/*'
                }
            }
            
        }
    });
    
    grunt.loadNpmTasks('node-spritesheet');

    grunt.registerTask('default', 'spritesheet');
};
