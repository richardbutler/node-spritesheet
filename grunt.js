/*global module:false*/
module.exports = function(grunt) {

    grunt.initConfig({
        coffee: {
            dist: {
                options: {
                    bare: true
                },
                files: {
                    'lib/builder.js': 'src/builder.coffee',
                    'lib/imagemagick.js': 'src/imagemagick.coffee',
                    'lib/style.js': 'src/style.coffee',
                    'lib/layout.js': 'src/layout.coffee'
                }
            }
        },
        clean: {
            client: {
                src: [ 'lib' ]
            }
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib');

    grunt.registerTask('default', 'clean coffee');
};
