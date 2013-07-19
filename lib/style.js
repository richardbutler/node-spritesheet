var Style, path;

path = require("path");

Style = (function() {

  function Style(options) {
    this.selector = options.selector;
    this.pixelRatio = options.pixelRatio || 1;
    if (options.resolveImageSelector) {
      this.resolveImageSelector = options.resolveImageSelector;
    }
  }

  Style.prototype.css = function(selector, attributes) {
    return "" + selector + " {\n" + (this.cssStyle(attributes)) + ";\n}\n";
  };

  Style.prototype.cssStyle = function(attributes) {
    return attributes.join(";\n");
  };

  Style.prototype.cssComment = function(comment) {
    return "/*\n" + comment + "\n*/";
  };

  Style.prototype.resolveImageSelector = function(name) {
    return name;
  };

  Style.prototype.generate = function(options) {
    var attr, css, image, imagePath, images, pixelRatio, relativeImagePath, styles, _i, _len;
    imagePath = options.imagePath, relativeImagePath = options.relativeImagePath, images = options.images, pixelRatio = options.pixelRatio;
    this.pixelRatio = pixelRatio || 1;
    var _lastWidth = 0, _lastHeight = 0, sameSize = true;
    _lastWidth = images[0].cssw;
    _lastHeight= images[0].cssh;

    for (_i = 0, _len = images.length; _i < _len; _i++) {
       if (_lastWidth != images[0].cssw || _lastHeight != images[0].cssh) {
           sameSize = false;
       }
    }

    if (sameSize)
      styles = [this.css(this.selector, ["  background: url( '" + relativeImagePath + "' ) no-repeat", "  width: " + _lastWidth + "px", "  height: " + _lastHeight + "px" ])];
    else
      styles = [this.css(this.selector, ["  background: url( '" + relativeImagePath + "' ) no-repeat"])];

    for (_i = 0, _len = images.length; _i < _len; _i++) {
      image = images[_i];
      if (sameSize)
         attr = ["  background-position: " + (-image.cssx) + "px " + (-image.cssy) + "px"];
      else
         attr = ["  width: " + image.cssw + "px", "  height: " + image.cssh + "px", "  background-position: " + (-image.cssx) + "px " + (-image.cssy) + "px"];      image.style = this.cssStyle(attr);
      image.selector = this.resolveImageSelector(image.name, image.path);
      styles.push(this.css([this.selector, image.selector].join('.'), attr));
    }
    styles.push("");
    css = styles.join("\n");
    if (pixelRatio > 1) {
      css = this.wrapMediaQuery(css);
    }
    return css;
  };

  Style.prototype.comment = function(comment) {
    return this.cssComment(comment);
  };

  Style.prototype.wrapMediaQuery = function(css) {
    return "@media\n(min--moz-device-pixel-ratio: " + this.pixelRatio + "),\n(-o-min-device-pixel-ratio: " + this.pixelRatio + "/1),\n(-webkit-min-device-pixel-ratio: " + this.pixelRatio + "),\n(min-device-pixel-ratio: " + this.pixelRatio + ") {\n" + css + "}\n";
  };

  return Style;

})();

module.exports = Style;
