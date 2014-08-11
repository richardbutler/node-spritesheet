path = require( "path" )

class Style

  constructor: ( options ) ->
    @selector = options.selector
    @pixelRatio = options.pixelRatio || 1
    @alwaysIncludeSpacing = options.alwaysIncludeSpacing
    
    @resolveImageSelector = options.resolveImageSelector if options.resolveImageSelector

  css: ( selector, attributes ) ->
    "#{ selector } {\n#{ @cssStyle( attributes ) };\n}\n"
  
  cssStyle: ( attributes ) ->
    attributes.join ";\n"
  
  cssComment: ( comment ) ->
    "/*\n#{ comment }\n*/"
  
  resolveImageSelector: ( name ) ->
    name
  
  generate: ( options ) ->
    { imagePath, relativeImagePath, images, pixelRatio, width, height } = options
    relativeImagePath = relativeImagePath.replace /(\\+)/g, "/"
    @pixelRatio = pixelRatio || 1
  
    styles = [
      @css @selector, [
        "  background: url( '#{ relativeImagePath }' ) no-repeat"
        "  background-size: #{ width / pixelRatio }px #{ height / pixelRatio }px"
      ]
    ]

    # Only add background-position, width and height for pixelRatio === 1.
    if @alwaysIncludeSpacing or pixelRatio is 1
      for image in images
        positionX = ( -image.cssx / pixelRatio )
        if positionX != 0
          positionX = positionX+'px'

        positionY = ( -image.cssy / pixelRatio )
        if positionY != 0
          positionY = positionY+'px'

        attr = [
          "  width: #{ image.cssw / pixelRatio }px"
          "  height: #{ image.cssh / pixelRatio }px"
          "  background-position: #{positionX} #{positionY}"
        ]


        image.style = @cssStyle attr
        image.selector = @resolveImageSelector( image.name, image.path )

        styles.push @css( [ @selector, image.selector ].join( '.' ), attr )
    
    styles.push ""
    css = styles.join "\n"
    
    if pixelRatio > 1
      css = @wrapMediaQuery( css )
  
    return css
  
  comment: ( comment ) ->
    @cssComment comment
    
  wrapMediaQuery: ( css ) ->
    "@media (min--moz-device-pixel-ratio: #{ @pixelRatio }),\n
(-o-min-device-pixel-ratio: #{ @pixelRatio }/1),\n
(-webkit-min-device-pixel-ratio: #{ @pixelRatio }),\n
(min-device-pixel-ratio: #{ @pixelRatio }) {\n
#{ css }
}\n"
  
module.exports = Style
