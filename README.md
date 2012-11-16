# node-spritesheet

Node-spritesheet is a utility to create sprite sheets in node.js. Its original
intention was to be used as a [Grunt](https://github.com/cowboy/grunt) task,
but I decided it was worth abstracting further.

In the most part, it is an indirect port of
[Jake Gordon](https://github.com/jakesgordon)'s much more mature
[Sprite Factory for Ruby](https://github.com/jakesgordon/sprite-factory).

# Pixel ratios (retina displays, etc)

It will also handle auto-resizing of images for specified pixel
densities. No more fart-arsing about for retina displays, just supply the
largest (highest-density) image. By default, this uses ImageMagick's version of
the Lanczos and Mitchell algorithms, depending on the most appropriate, but you
can specify any of the 20-odd [available](http://www.imagemagick.org/script/command-line-options.php#filter).

Additionally, it will add the relevant cross-browser media queries to the CSS.

## Requirements

Requires [ImageMagick](http://www.imagemagick.org). For Unix/Mac, this will
be installed automagickally (ouch).

## Installation

	npm install node-spritesheet

## Usage

	var Builder = require( 'node-spritesheet' ).Builder;
	var b = new Builder( imagePaths, options );
	b.build( callback );

## Simple example

	var Builder = require( 'node-spritesheet' ).Builder;
	
	var builder = new Builder( [ 'image1.png', 'image2.png', image3.png' ], {
		outputImage: 'sprite.png',
		outputCss: 'sprite.css',
		selector: '.sprite'
	})
	
	builder.build( function() {
		console.log( "Built from " + builder.images.length + " images" );
	});

## Complex example

This adds retina/legacy support.

    var Builder = require( 'node-spritesheet' ).Builder;
    
    new Builder( [ 'image1@2x.png', 'image2@2x.png', image3@2x.png' ], {
        outputCss: 'sprite.css',
        selector: '.sprite',
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
    })
    .build();

## Grunt task

This is a multi-task, supporting multiple spritesheets in one gruntfile.

The following grunt.js structure takes all images in src/icons and creates
a spritesheet at bin/assets/sprite.png, with an accompanying stylesheet at
bin/assets/sprite.css.

	spritesheet: {
		compile: {
			options: {
				// Compiles to bin/assets/images/spritesheets/flags.png
				outputImage: 'images/spritesheets/flags.png',
				// Compiles to bin/assets/stylesheets/flags.css
				outputCss: 'stylesheets/flags.css',
				selector: '.flag'
				
				// ... Additional options as per above complex example, if needed.
			},
			files: {
				'bin/assets': 'src/icons/flags/*'
			}
		}
	}
	
	loadNpmTasks( 'node-spritesheet' );
