var Style;

Style = (function() {

  function Style() {}

  Style.prototype.css = function(selector, attributes) {
    return "" + selector + " {\n" + attributes + ";\n}\n";
  };

  Style.prototype.cssStyle = function(attributes) {
    return attributes.join(";\n");
  };

  Style.prototype.cssComment = function(comment) {
    return "/*\n" + comment + "\n*/";
  };

  Style.prototype.cssSelector = function(selector, image) {
    var all, deepest;
    all = image.name.replace(/__/g, ' ').replace(/--/g, ':').split(' ');
    deepest = [selector, all.pop()].join('.');
    all.push(deepest);
    return all.join(' ');
  };

  Style.prototype.generate = function(selector, path, images) {
    var attr, image, styles, _i, _len;
    styles = [this.css(selector, ["  background: url( '" + path + "' ) no-repeat"])];
    for (_i = 0, _len = images.length; _i < _len; _i++) {
      image = images[_i];
      attr = ["  width: " + image.cssw + "px", "  height: " + image.cssh + "px", "  background-position: " + (-image.cssx) + "px " + (-image.cssy) + "px"];
      image.selector = this.cssSelector(selector, image);
      image.style = this.cssStyle(attr);
      styles.push(this.css(image.selector, image.style));
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
