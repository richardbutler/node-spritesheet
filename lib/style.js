var Style;

Style = (function() {

  function Style() {}

  Style.prototype.css = function(selector, attributes) {
    return "" + selector + " {\n" + (this.cssStyle(attributes)) + ";\n}\n";
  };

  Style.prototype.cssStyle = function(attributes) {
    return attributes.join(";\n");
  };

  Style.prototype.cssComment = function(comment) {
    return "/*\n" + comment + "\n*/";
  };

  Style.prototype.generate = function(selector, path, images) {
    var attr, image, styles, _i, _len;
    styles = [this.css(selector, ["  background: url( '" + path + "' ) no-repeat"])];
    for (_i = 0, _len = images.length; _i < _len; _i++) {
      image = images[_i];
      attr = ["  width: " + image.cssw + "px", "  height: " + image.cssh + "px", "  background-position: " + (-image.cssx) + "px " + (-image.cssy) + "px"];
      image.selector = selector;
      image.style = this.cssStyle(attr);
      styles.push(this.css([selector, image.name].join('.'), attr));
    }
    styles.push("");
    return styles.join("\n");
  };

  Style.prototype.comment = function(comment) {
    return this.cssComment(comment);
  };

  return Style;

})();

module.exports = new Style();
