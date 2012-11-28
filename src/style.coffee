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
  
  cssSelector: ( selector, image ) ->
    all = image.name.replace( /__/g, ' ' ).replace( /--/g, ':' ).split( ' ' )
    deepest = [ selector, all.pop() ].join( '.' )
    all.push( deepest )
    all.join( ' ' )
  
  resolveImageSelector: ( name ) ->
    name
  
  generate: ( options ) ->
    { imagePath, relativeImagePath, images, pixelRatio } = options
    
    @pixelRatio = pixelRatio || 1
  
    styles = [
      @css @selector, [
        "  background: url( '#{ relativeImagePath }' ) no-repeat"
      ]
    ]
    for image in images
      attr = [
        "  width: #{ image.cssw }px"
        "  height: #{ image.cssh }px"
        "  background-position: #{ -image.cssx }px #{ -image.cssy }px"
      ]
      image.style = @cssStyle attr
      image.selector = @resolveImageSelector( image.name, image.path )
      
      styles.push @css( @cssSelector(@selector, image), attr )
    
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
