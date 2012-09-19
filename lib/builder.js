var ImageMagick, Layout, SpriteSheetBuilder, Style, async, exec, fs, path, qfs,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

fs = require('fs');

path = require('path');

qfs = require('q-fs');

exec = require('child_process').exec;

async = require('async');

ImageMagick = require('./imagemagick');

Layout = require('./layout');

Style = require('./style');

SpriteSheetBuilder = (function() {

  SpriteSheetBuilder.supportsPngcrush = function(callback) {
    var _this = this;
    return exec("which pngcrush", function(error, stdout, stderr) {
      return callback(stdout && !error && !stderr);
    });
  };

  SpriteSheetBuilder.pngcrush = function(image, callback) {
    return SpriteSheetBuilder.supportsPngcrush(function(supported) {
      var crushed,
        _this = this;
      if (supported) {
        crushed = "" + image + ".crushed";
        console.log("pngcrushing, this may take a few moments...");
        return exec("pngcrush -reduce " + image + " " + crushed + " && mv " + crushed + " " + image, function(error, stdout, stderr) {
          return callback();
        });
      } else {
        return callback();
      }
    });
  };

  function SpriteSheetBuilder(files, images, options) {
    var separator;
    this.files = files;
    this.images = images;
    this.options = options;
    this.ensureDirectory = __bind(this.ensureDirectory, this);

    this.createSprite = __bind(this.createSprite, this);

    this.style = __bind(this.style, this);

    this.identify = __bind(this.identify, this);

    this.layoutImages = __bind(this.layoutImages, this);

    this.build = __bind(this.build, this);

    this.outputDirectory = this.options.outputDirectory;
    separator = path.sep || "/";
    if (this.options.outputImage) {
      this.outputImageFilePath = [this.outputDirectory, this.options.outputImage].join(separator);
      this.outputImageDirectoryPath = path.dirname(this.outputImageFilePath);
    }
    if (this.options.outputCss) {
      this.outputStyleFilePath = [this.outputDirectory, this.options.outputCss].join(separator);
      this.outputStyleDirectoryPath = path.dirname(this.outputStyleFilePath);
    }
    this.selector = this.options.selector || '';
  }

  SpriteSheetBuilder.prototype.build = function(callback) {
    var _this = this;
    if (!this.images) {
      throw "no image files specified";
    }
    if (!this.outputImageFilePath) {
      throw "no output image file specified";
    }
    if (!this.outputStyleFilePath) {
      throw "no output style file specified";
    }
    return this.layoutImages(function() {
      console.log(_this.summary());
      return async.series([_this.ensureDirectory(_this.outputImageDirectoryPath), _this.ensureDirectory(_this.outputStyleDirectoryPath), _this.style, _this.createSprite], callback);
    });
  };

  SpriteSheetBuilder.prototype.layoutImages = function(callback) {
    var continueBuild,
      _this = this;
    continueBuild = function(err) {
      var layout;
      layout = new Layout();
      _this.layout = layout.layout(_this.images, _this.options);
      return callback();
    };
    return async.forEachSeries(this.files, this.identify, continueBuild);
  };

  SpriteSheetBuilder.prototype.identify = function(filepath, callback) {
    var _this = this;
    return ImageMagick.identify(filepath, function(image) {
      _this.images.push(image);
      return callback(null, image);
    });
  };

  SpriteSheetBuilder.prototype.style = function(callback) {
    var css, relativeImagePath,
      _this = this;
    relativeImagePath = path.relative(this.outputStyleDirectoryPath, this.outputImageFilePath);
    css = Style.generate(this.selector, relativeImagePath, this.images);
    return fs.writeFile(this.outputStyleFilePath, css, function(err) {
      if (err) {
        throw err;
      } else {
        console.log("CSS file written to", _this.outputStyleFilePath);
        return callback();
      }
    });
  };

  SpriteSheetBuilder.prototype.styleComment = function(comment) {
    return Style.comment(comment);
  };

  SpriteSheetBuilder.prototype.createSprite = function(callback) {
    var _this = this;
    return ImageMagick.composite(this.outputImageFilePath, this.images, this.layout.width, this.layout.height, function() {
      return SpriteSheetBuilder.pngcrush(_this.outputImageFilePath, callback);
    });
  };

  SpriteSheetBuilder.prototype.summary = function() {
    var i, output, _i, _len, _ref;
    output = "\nCreating a sprite from following images:\n";
    _ref = this.images;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      i = _ref[_i];
      output += "  " + (this.reportPath(i.path)) + " (" + i.width + "x" + i.height + ")\n";
    }
    output += "\nOutput files:      " + (this.reportPath(this.outputImageFilePath)) + "      " + (this.reportPath(this.outputStyleFilePath));
    output += "\nOutput size:       " + this.layout.width + "x" + this.layout.height;
    return output;
  };

  SpriteSheetBuilder.prototype.reportPath = function(path) {
    return path;
  };

  SpriteSheetBuilder.prototype.ensureDirectory = function(directory) {
    var _this = this;
    return function(callback) {
      return qfs.makeTree(directory).then(callback);
    };
  };

  return SpriteSheetBuilder;

})();

module.exports = SpriteSheetBuilder;
