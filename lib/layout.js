var Layout;

Layout = (function() {
  function Layout() {}

  Layout.prototype.layout = function(images, options) {
    var hmargin, hpadding, i, lp, root, vmargin, vpadding, _i, _j, _len, _len1,
      _this = this;
    if (options == null) {
      options = {};
    }
    if (!images || !images.length) {
      return {
        width: 0,
        height: 0
      };
    }
    hpadding = options.hpadding || 0;
    vpadding = options.vpadding || 0;
    hmargin = options.hmargin || 0;
    vmargin = options.vmargin || 0;
    for (_i = 0, _len = images.length; _i < _len; _i++) {
      i = images[_i];
      i.w = i.width + (2 * hpadding) + (2 * hmargin);
      i.h = i.height + (2 * vpadding) + (2 * vmargin);
    }
    images.sort(function(a, b) {
      var diff;
      diff = _this.compare(Math.max(b.w, b.h), Math.max(a.w, a.h));
      if (diff === 0) {
        diff = _this.compare(Math.min(b.w, b.h), Math.min(a.w, a.h));
      }
      if (diff === 0) {
        diff = _this.compare(b.h, a.h);
      }
      if (diff === 0) {
        diff = _this.compare(b.w, a.w);
      }
      return diff;
    });
    root = {
      x: 0,
      y: 0,
      w: images[0].w,
      h: images[0].h
    };
    lp = function(i) {
      var node;
      node = _this.findNode(root, i.w, i.h);
      if (node) {
        _this.placeImage(i, node, hpadding, vpadding, hmargin, vmargin);
        return _this.splitNode(node, i.w, i.h);
      } else {
        root = _this.grow(root, i.w, i.h);
        return lp(i);
      }
    };
    for (_j = 0, _len1 = images.length; _j < _len1; _j++) {
      i = images[_j];
      lp(i);
    }
    return {
      width: root.w,
      height: root.h
    };
  };

  Layout.prototype.compare = function(a, b) {
    if (a > b) {
      return 1;
    }
    if (b > a) {
      return -1;
    }
    return 0;
  };

  Layout.prototype.placeImage = function(image, node, hpadding, vpadding, hmargin, vmargin) {
    image.cssx = node.x + hmargin;
    image.cssy = node.y + vmargin;
    image.cssw = image.width + (2 * hpadding);
    image.cssh = image.height + (2 * vpadding);
    image.x = image.cssx + hpadding;
    return image.y = image.cssy + vpadding;
  };

  Layout.prototype.findNode = function(root, w, h) {
    if (root.used) {
      return this.findNode(root.right, w, h) || this.findNode(root.down, w, h);
    } else if ((w <= root.w) && (h <= root.h)) {
      return root;
    }
  };

  Layout.prototype.splitNode = function(node, w, h) {
    node.used = true;
    node.down = {
      x: node.x,
      y: node.y + h,
      w: node.w,
      h: node.h - h
    };
    return node.right = {
      x: node.x + w,
      y: node.y,
      w: node.w - w,
      h: h
    };
  };

  Layout.prototype.grow = function(root, w, h) {
    var canGrowDown, canGrowRight, shouldGrowDown, shouldGrowRight;
    canGrowDown = w <= root.w;
    canGrowRight = h <= root.h;
    shouldGrowRight = canGrowRight && (root.h >= (root.w + w));
    shouldGrowDown = canGrowDown && (root.w >= (root.h + h));
    if (shouldGrowRight) {
      return this.growRight(root, w, h);
    } else if (shouldGrowDown) {
      return this.growDown(root, w, h);
    } else if (canGrowRight) {
      return this.growRight(root, w, h);
    } else if (canGrowDown) {
      return this.growDown(root, w, h);
    } else {
      throw "Can't fit " + w + "x" + h + " block into root " + root.w + "x" + root.h + " - this should not happen if images are pre-sorted correctly";
    }
  };

  Layout.prototype.growRight = function(root, w, h) {
    return {
      used: true,
      x: 0,
      y: 0,
      w: root.w + w,
      h: root.h,
      down: root,
      right: {
        x: root.w,
        y: 0,
        w: w,
        h: root.h
      }
    };
  };

  Layout.prototype.growDown = function(root, w, h) {
    return {
      used: true,
      x: 0,
      y: 0,
      w: root.w,
      h: root.h + h,
      down: {
        x: 0,
        y: root.h,
        w: root.w,
        h: h
      },
      right: root
    };
  };

  return Layout;

})();

module.exports = Layout;
