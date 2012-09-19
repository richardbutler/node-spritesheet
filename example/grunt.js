/*global module:false*/
module.exports = function(grunt) {

    grunt.initConfig({
        spritesheet: {
            compile: {
                options: {
                    outputImage: 'sprite/img/flags.png',
                    outputCss: 'sprite/css/flags.css',
                    selector: '.flag'
                },
                files: {
                    'bin': 'src/img/*'
                }
            }
        }
    });
    
    grunt.loadNpmTasks('node-spritesheet');

    grunt.registerTask('default', 'spritesheet');
};
