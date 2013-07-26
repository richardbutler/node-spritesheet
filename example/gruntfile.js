/*global module:false*/
module.exports = function(grunt) {

    grunt.initConfig({
        spritesheet: {
            
            //
            // Simple example.
            //
            flags_simple: {
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
            // Complex example with multiple pixel ratios. Uses automatic
            // image resampling.
            //
            flags_resample: {
                options: {
                    outputCss: 'sprite/css/flags-ex.css',
                    selector: ".flag",
                    downsampling: "LanczosSharp",
                    output: {
                        legacy: {
                            pixelRatio: 1,
                            outputImage: 'sprite/img/flags-ex.png'
                        },
                        retina: {
                            pixelRatio: 2,
                            outputImage: 'sprite/img/flags-ex@2x.png'
                        }
                    }
                },
                files: {
                    'bin': 'src/img/flags-2x/*'
                }
            },
            
            //
            // Second multi-ratio example, but takes source images for both
            // pixel densities, i.e. doesn't resample the images from the
            // highest density.
            //
            flags: {
                options: {
                    outputCss: 'sprite/css/flags-ex2.css',
                    selector: ".flag",
                    httpImagePath: "http://test.com/static/sprite.png",
                    output: {
                        legacy: {
                            pixelRatio: 1,
                            outputImage: 'sprite/img/flags-ex2.png',
                            filter: function( fullpath ) {
                                return fullpath.indexOf( "-2x" ) === -1;
                            }
                        },
                        retina: {
                            pixelRatio: 2,
                            outputImage: 'sprite/img/flags-ex2@2x.png',
                            filter: function( fullpath ) {
                                return fullpath.indexOf( "-2x" ) >= 0;
                            }
                        }
                    }
                },
                files: {
                    'bin': 'src/img/**/*'
                }
            }
            
        }
    });
    
    grunt.loadTasks('../tasks');

    grunt.registerTask('default', 'spritesheet');
};
