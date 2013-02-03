path = require( "path" )

class Style

  constructor: ( options ) ->
    @selector = options.selector
    @pixelRatio = options.pixelRatio || 1
    
    @resolveImageSelector = options.resolveImageSelector if options.resolveImageSelector

  css: ( selector, attributes ) ->
    "#{ selector } {\n#{ @cssStyle( attributes ) };\n}\n"
  
  cssStyle: ( attributes ) ->
    attributes.join ";\n"
  
  cssComment: ( comment ) ->
    "/*\n#{ comment }\n*/"
  
  joinSelectors: ( directSelector, imageSelector ) ->
    ret = for selectors in imageSelector.split( ',' )
      selectors = selectors.split( ' ' )
      deepest = [ directSelector, selectors.pop() ].join( '' )
      selectors.push( deepest )
      selectors.join( ' ' )
    ret.join( ',' )
  
  resolveImageSelector: ( name ) ->
    '.' + name
  
  generate: ( options ) ->
    { imagePath, relativeImagePath, images, pixelRatio, width, height } = options
    
    @pixelRatio = pixelRatio || 1
  
    styles = [
      @css @selector, [
        "  background: url(#{ relativeImagePath }) no-repeat"
        "  background-size: #{ width/pixelRatio }px #{ height/pixelRatio }px "
      ]
    ]
    for image in images
      attr = [
        "  width: #{ image.cssw / pixelRatio }px"
        "  height: #{ image.cssh / pixelRatio }px"
        "  background-position: #{ -image.cssx / pixelRatio }px #{ -image.cssy / pixelRatio }px"
      ]
      image.style = @cssStyle attr
      image.selector = @resolveImageSelector( image.name, image.path )
      styles.push @css( @joinSelectors(@selector, image.selector), attr )
    
    styles.push ""
    css = styles.join "\n"
    
    if pixelRatio > 1
      css = @wrapMediaQuery( css )
  
    return css
  
  comment: ( comment ) ->
    @cssComment comment
    
  wrapMediaQuery: ( css ) ->
    "@media\n
(min--moz-device-pixel-ratio: #{ @pixelRatio }),\n
(-o-min-device-pixel-ratio: #{ @pixelRatio }/1),\n
(-webkit-min-device-pixel-ratio: #{ @pixelRatio }),\n
(min-device-pixel-ratio: #{ @pixelRatio }) {\n
#{ css }
}\n"
  
module.exports = Style
