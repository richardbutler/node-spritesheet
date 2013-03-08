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

  Style.prototype.joinSelectors = function(directSelector, imageSelector) {
    var deepest, ret, selectors;
    ret = (function() {
      var _i, _len, _ref, _results;
      _ref = imageSelector.split(',');
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        selectors = _ref[_i];
        selectors = selectors.split(' ');
        deepest = [directSelector, selectors.pop()].join('');
        selectors.push(deepest);
        _results.push(selectors.join(' '));
      }
      return _results;
    })();
    return ret.join(',');
  };

  Style.prototype.resolveImageSelector = function(name) {
    return '.' + name;
  };

  Style.prototype.generate = function(options) {
    var attr, css, height, image, imagePath, images, pixelRatio, relativeImagePath, styles, width, _i, _len;
    imagePath = options.imagePath, relativeImagePath = options.relativeImagePath, images = options.images, pixelRatio = options.pixelRatio, width = options.width, height = options.height;
    this.pixelRatio = pixelRatio || 1;
    styles = [this.css(this.selector, ["  background: url(" + relativeImagePath + ") no-repeat", "  background-size: " + (width / pixelRatio) + "px " + (height / pixelRatio) + "px "])];
    for (_i = 0, _len = images.length; _i < _len; _i++) {
      image = images[_i];
      attr = ["  width: " + (image.cssw / pixelRatio) + "px", "  height: " + (image.cssh / pixelRatio) + "px", "  background-position: " + (-image.cssx / pixelRatio) + "px " + (-image.cssy / pixelRatio) + "px"];
      image.style = this.cssStyle(attr);
      image.selector = this.resolveImageSelector(image.name, image.path);
      styles.push(this.css(this.joinSelectors(this.selector, image.selector), attr));
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
