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
            // Complex example with multiple pixel ratios.
            //
            flags: {
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
            }
            
        }
    });
    
    grunt.loadNpmTasks('node-spritesheet');

    grunt.registerTask('default', 'spritesheet');
};
