class Layout

  layout: ( images, options = {} ) ->
  
    return width: 0, height: 0 if !images || !images.length
  
    hpadding = options.hpadding || 0
    vpadding = options.vpadding || 0
    hmargin  = options.hmargin  || 0
    vmargin  = options.vmargin  || 0
  
    for i in images
      i.w = i.width  + ( 2 * hpadding ) + ( 2 * hmargin )
      i.h = i.height + ( 2 * vpadding ) + ( 2 * vmargin )
    
    images.sort ( a, b ) =>
      diff = @compare( Math.max( b.w, b.h ), Math.max( a.w, a.h ) )
      diff = @compare( Math.min( b.w, b.h ), Math.min( a.w, a.h ) ) if diff is 0
      diff = @compare( b.h, a.h ) if diff is 0
      diff = @compare( b.w, a.w ) if diff is 0
      diff
  
    root =
      x: 0
      y: 0
      w: images[ 0 ].w
      h: images[ 0 ].h
  
    lp = ( i ) =>
      node = @findNode( root, i.w, i.h )
      if node
        @placeImage( i, node, hpadding, vpadding, hmargin, vmargin )
        @splitNode( node, i.w, i.h )
      else
        root = @grow( root, i.w, i.h )
        lp i
  
    for i in images
      lp i
  
    return {
      width: root.w
      height: root.h
    }
  
  compare: ( a, b ) ->
    return 1 if a > b
    return -1 if b > a
    return 0
  
  placeImage: ( image, node, hpadding, vpadding, hmargin, vmargin ) ->
    image.cssx = node.x + hmargin
    image.cssy = node.y + vmargin
    image.cssw = image.width  + ( 2 * hpadding )
    image.cssh = image.height + ( 2 * vpadding )
    image.x    = image.cssx + hpadding
    image.y    = image.cssy + vpadding
  
  findNode: ( root, w, h ) ->
    if root.used
      return @findNode( root.right, w, h ) || @findNode( root.down, w, h )
    else if ( w <= root.w ) && ( h <= root.h )
      return root
  
  splitNode: ( node, w, h ) ->
    node.used = true
    node.down =
      x: node.x
      y: node.y + h
      w: node.w
      h: node.h - h
    node.right =
      x: node.x + w
      y: node.y
      w: node.w - w
      h: h
  
  grow: ( root, w, h ) ->
  
    canGrowDown  = ( w <= root.w )
    canGrowRight = ( h <= root.h )
  
    shouldGrowRight = canGrowRight && ( root.h >= ( root.w + w ) )
    shouldGrowDown  = canGrowDown  && ( root.w >= ( root.h + h ) )
  
    if shouldGrowRight
      @growRight root, w, h
    else if shouldGrowDown
      @growDown root, w, h
    else if canGrowRight
      @growRight root, w, h
    else if canGrowDown
      @growDown root, w, h
    else
      throw "Can't fit #{ w }x#{ h } block into root #{ root.w }x#{ root.h } - this should not happen if images are pre-sorted correctly"
  
  growRight: ( root, w, h ) ->
    return {
      used: true
      x     : 0
      y     : 0
      w     : root.w + w
      h     : root.h
      down  : root
      right: {
        x: root.w
        y: 0
        w: w
        h: root.h
      }
    }
  
  growDown: ( root, w, h ) ->
    return {
      used  : true
      x     : 0
      y     : 0
      w     : root.w
      h     : root.h + h
      down  : 
        x : 0
        y : root.h
        w : root.w
        h : h
      right: root
    }

module.exports = Layout