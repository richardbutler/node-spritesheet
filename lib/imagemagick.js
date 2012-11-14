var ImageMagick, async, exec;

exec = require('child_process').exec;

async = require('async');

ImageMagick = (function() {

  function ImageMagick() {}

  ImageMagick.prototype.identify = function(filepath, callback) {
    return this.exec("identify " + filepath, function(error, stdout, stderr) {
      var dims, filename, h, image, name, parts, w;
      if (error || stderr) {
        throw "Error in identify (" + filepath + "): " + (error || stderr);
      }
      parts = stdout.split(" ");
      dims = parts[2].split("x");
      w = parseInt(dims[0]);
      h = parseInt(dims[1]);
      filename = filepath.split('/').pop();
      name = filename.split('.').shift();
      image = {
        width: w,
        height: h,
        filename: filename,
        name: name,
        path: filepath
      };
      return callback(image);
    });
  };

  ImageMagick.prototype.composite = function(filepath, images, width, height, callback) {
    var _this = this;
    console.log('Writing images to sprite sheet...');
    return this.exec("convert -size " + width + "x" + height + " canvas:transparent -alpha transparent " + filepath, function(error, stdout, stderr) {
      var compose;
      if (error || stderr) {
        throw "Error in creating canvas (" + filepath + "): " + (error || stderr);
      }
      compose = function(image, next) {
        console.log("  Composing " + image.path);
        return _this.composeImage(filepath, image, next);
      };
      return async.forEachSeries(images, compose, callback);
    });
  };

  ImageMagick.prototype.exec = function(command, callback) {
    return exec(command, callback);
  };

  ImageMagick.prototype.composeImage = function(filepath, image, callback) {
    return exec("composite -geometry +" + image.cssx + "+" + image.cssy + " " + image.path + " " + filepath + " " + filepath + ".tmp && mv " + filepath + ".tmp " + filepath, function(error, stdout, stderr) {
      if (error || stderr) {
        throw "Error in composite (" + filepath + "): " + (error || stderr);
      }
      return callback();
    });
  };

  return ImageMagick;

})();

module.exports = new ImageMagick();
