# node-spritesheet

Node-spritesheet is a utility to create sprite sheets in node.js. Its original
intention was to be used as a [Grunt](https://github.com/cowboy/grunt) task,
but I decided it was worth abstracting further.

In the most part, it is an indirect port of
[Jake Gordon](https://github.com/jakesgordon)'s much more mature
[Sprite Factory for Ruby](https://github.com/jakesgordon/sprite-factory).

## Pixel ratios (retina displays, etc)

It will also handle auto-resizing of images for specified pixel
densities. No more fart-arsing about for retina displays, just supply the
largest (highest-density) image. By default, this uses ImageMagick's version of
the Lanczos and Mitchell algorithms, depending on the most appropriate, but you
can specify any of the 20-odd [available](http://www.imagemagick.org/script/command-line-options.php#filter).

You're not locked in to auto-resampling though, you can supply multiple density
versions of the same image, if you prefer.

Additionally, it will add the relevant cross-browser media queries to the CSS.

## Requirements

Requires [ImageMagick](http://www.imagemagick.org), available via HomeBrew (`$ sudo brew install ImageMagick`) or MacPorts: (`$ sudo port install ImageMagick`).

## Installation

	npm install node-spritesheet

## Usage

	var Builder = require( 'node-spritesheet' ).Builder;
	var b = new Builder( options );
	b.build( callback );

### Simple example

Takes in a series of images a generates a spritesheet.

    var Builder = require( 'node-spritesheet' ).Builder;
    
    var builder = new Builder({
        outputDirectory: '/path/to/directory',
        outputImage: 'sprite.png',
        outputCss: 'sprite.css',
        selector: '.sprite',
        images: [ 'image1.png', 'image2.png', 'image3.png' ]
    });
    
    builder.build( function() {
        console.log( "Built from " + builder.files.length + " images" );
    });

### More complex example

Add configurations to the builder to output multiple spritesheets based on
different pixel densities, using media queries.

    var Builder = require( 'node-spritesheet' ).Builder;
    
    var builder = new Builder({
        outputDirectory: '/path/to/directory',
        outputCss: 'sprite.css',
        selector: '.sprite',
        images: [ 'image1.png', 'image2.png', image3.png' ]
    });
    
    builder.addConfiguration( "legacy", {
        pixelRatio: 1,
        outputImage: 'sprite.png'
    });
    
    builder.addConfiguration( "retina", {
        pixelRatio: 2,
        outputImage: 'sprite@2x.png'
    });
    
    builder.build( function() {
        console.log( "Built from " + builder.files.length + " images" );
    });

### Another complex example

Even though ImageMagick uses some pretty decent algorithms for resampling images,
you may not want node-spritesheet to automatically resize your retina versions
for you, you may want to instead keep two copies of each image.

    var Builder = require( 'node-spritesheet' ).Builder;
    
    var builder = new Builder({
        outputDirectory: '/path/to/directory',
        outputCss: 'sprite.css',
        selector: '.sprite'
    });
    
    builder.addConfiguration( "legacy", {
        pixelRatio: 1,
        outputImage: 'sprite.png',
        images: [ 'image1.png', 'image2.png', image3.png' ]
    });
    
    builder.addConfiguration( "retina", {
        pixelRatio: 2,
        outputImage: 'sprite@2x.png',
        images: [ 'image1@2x.png', 'image2@2x.png', image3@2x.png' ]
    });
    
    builder.build( function() {
        console.log( "Built from " + builder.files.length + " images" );
    });

## Grunt task

This is a multi-task, supporting multiple spritesheets in one gruntfile.

The following grunt.js structure takes all images in src/icons and creates
a spritesheet at bin/assets/sprite.png, with an accompanying stylesheet at
bin/assets/sprite.css.

### Simple example

    // Add to your grunt config.
	spritesheet: {
		compile: {
			options: {
				// Compiles to bin/assets/images/spritesheets/flags.png
				outputImage: 'images/spritesheets/flags.png',
				// Compiles to bin/assets/stylesheets/flags.css
				outputCss: 'stylesheets/flags.css',
				// Uses this compound selector in the css, e.g. '.flag.my-image {}'
				selector: '.flag'
			},
			files: {
				'bin/assets': 'src/icons/flags/*'
			}
		}
	}
	
	// Add to your imports.
	loadNpmTasks( 'node-spritesheet' );

### Complex example

This adds retina/legacy support, and resamples the images (assuming the
highest density has been supplied).

    // Add to your grunt config.
    spritesheet: {
        compile: {
            options: {
                outputCss: 'sprite.css',
                selector: '.sprite',
                
                // Optional ImageMagick sampling filter.
                downsampling: "LanczosSharp",
                
                // Optional absolute path to output image.
                httpImagePath: "http://static.mysite.com/images/sprite.png",
                
                // Output configurations: in this instance to output two sprite sheets,
                // one for "legacy" (i.e. 72dpi, pixel ratio 1), and "retina" (x2).
                // These keys (legacy, retina) are completely arbitrary.
                output: {
                    legacy: {
                        pixelRatio: 1,
                        outputImage: 'sprite.png'
                    },
                    // As the retina scheme has the highest pixel ratio, it will be
                    // assumed that all images passed to the builder are for 'retina',
                    // and will be downscaled for 'legacy'.
                    retina: {
                        pixelRatio: 2,
                        outputImage: 'sprite@2x.png'
                    }
                },
                
                // Allows you to augment your selector names for each image, based on
                // the bare image "name", or the full image path.
                resolveImageSelector: function( name, fullpath ) {
                    // For example, your files may well already be named with @2x, but
                    // you won't want that included in your CSS selectors.
                    return name.split( "@2x" ).join( "" );
                }
            },
            files: {
                'bin/assets': 'src/icons/flags/*'
            }
        }
    }
    
    // Add to your imports.
    loadNpmTasks( 'node-spritesheet' );

### Second complex example

Again, this adds retina/legacy support, but uses a filter function to ascertain
which images are retina and which aren't, meaning you don't have to rely on the
resampling option, if you want finer control.

    // Add to your grunt config.
    spritesheet: {
        compile: {
            options: {
                outputCss: 'sprite.css',
                selector: '.sprite',
                output: {
                    legacy: {
                        pixelRatio: 1,
                        outputImage: 'sprite.png',
                        // Just process the non-retina files
                        filter: function( fullpath ) {
                            return fullpath.indexOf( "@2x" ) === -1;
                        }
                    },
                    retina: {
                        pixelRatio: 2,
                        outputImage: 'sprite@2x.png',
                        // Just process the retina files
                        filter: function( fullpath ) {
                            return fullpath.indexOf( "@2x" ) >= 0;
                        }
                    }
                }
            },
            files: {
                'bin/assets': 'src/icons/flags/*'
            }
        }
    }
    
    // Add to your imports.
    loadNpmTasks( 'node-spritesheet' );
