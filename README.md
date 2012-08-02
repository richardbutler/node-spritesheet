# node-spritesheet

Node-spritesheet is a utility to create sprite sheets in node.js. Its original
intention was to be used as a [Grunt](https://github.com/cowboy/grunt) task,
but I decided it was worth abstracting further.

In the most part, it is an indirect port of
[Jake Gordon](https://github.com/jakesgordon)'s much more mature
[Sprite Factory for Ruby](https://github.com/jakesgordon/sprite-factory).

## Requirements

Requires [ImageMagick](http://www.imagemagick.org). For Unix/Mac, this will
be installed automagickally (ouch).

## Installation

	npm install node-spritesheet

## Usage

	var Builder = require('node-spritesheet').Builder;
	var b = new Builder( imagePaths, imageArr, options );
	b.build( callback );

## Examples

	var Builder = require('node-spritesheet').Builder,
		images = [];
	
	new Builder( [ 'image1.png', 'image2.png', image3.png' ], images, {
		outputImage: 'sprite.png',
		outputCss: 'sprite.css',
		selector: '.sprite'
	})
	.build( function() {
		console.log( "Built from " + images.length + " images" );
	});

## Grunt task

This is a multi-task, supporting multiple spritesheets in one gruntfile.

The following grunt.js structure takes all images in src/icons and creates
a spritesheet at bin/assets/sprite.png, with an accompanying stylesheet at
bin/assets/sprite.css.

	spritesheet: {
		compile: {
			options: {
				outputImage: 'sprite.png',
				outputCss: 'sprite.css',
				selector: '.texture'
			},
			files: {
				'bin/assets': 'src/icons/*'
			}
		}
	}
	
	loadNpmTasks( 'node-spritesheet' );
