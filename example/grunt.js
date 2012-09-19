/*global module:false*/
module.exports = function(grunt) {

    grunt.initConfig({
        spritesheet: {
            compile: {
                options: {
                    outputImage: 'flags.png',
                    outputCss: 'flags.css',
                    selector: '.flag'
                },
                files: {
                    'bin/sprite': 'src/img/*'
                }
            }
        }
    });
    
    grunt.loadNpmTasks('node-spritesheet');

    grunt.registerTask('default', 'spritesheet');
};
