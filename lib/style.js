var Style, path;

path = require("path");

Style = (function() {

  function Style(options) {
		console.log('layout options',options.layout)
	  this.layout = options.layout
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
    if (this.pixelRatio < 2 ) {
      var attr, css, image, imagePath, images, pixelRatio, relativeImagePath, styles, _i, _len;
      imagePath = options.imagePath, relativeImagePath = options.relativeImagePath, images = options.images, pixelRatio = options.pixelRatio;
      this.pixelRatio = pixelRatio || 1;
      styles = [this.css(this.selector, ["  background: url( '" + relativeImagePath + "' ) no-repeat"])];
      for (_i = 0, _len = images.length; _i < _len; _i++) {
        image = images[_i];
        attr = ["  width: " + image.cssw + "px", "  height: " + image.cssh + "px", "  background-position: " + (-image.cssx) + "px " + (-image.cssy) + "px"];
        image.style = this.cssStyle(attr);
        image.selector = this.resolveImageSelector(image.name, image.path);
        styles.push(this.css([this.selector, image.selector].join('.'), attr));
      }
			styles.push("")
      css = styles.join("\n");
	  } else {
			var spriteHeight = options.layout.height/2
			var spriteWidth = options.layout.width/2
	    css = "@media\n(min--moz-device-pixel-ratio: " + this.pixelRatio + "),\n(-o-min-device-pixel-ratio: " + this.pixelRatio + "/1),\n(-webkit-min-device-pixel-ratio: " + this.pixelRatio + "),\n(min-device-pixel-ratio: " + this.pixelRatio + ") {\n  .sprite {\n    -moz-background-size: " + spriteWidth + "px " + spriteHeight + "px;\n    -ie-background-size: " + spriteWidth + "px " + spriteHeight + "px;\n    -o-background-size: " + spriteWidth + "px " + spriteHeight + "px;\n    -webkit-background-size: " + spriteWidth + "px " + spriteHeight + "px;\n    background-size: " + spriteWidth + "px " + spriteHeight + "px;\n  }\n}\n";
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
