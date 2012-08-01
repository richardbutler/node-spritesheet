class Style

  css: ( selector, attributes ) ->
    "#{ selector } {\n#{ @cssStyle( attributes ) };\n}\n"
  
  cssStyle: ( attributes ) ->
    attributes.join ";\n"
  
  cssComment: ( comment ) ->
    "/*\n#{ comment }\n*/"
  
  generate: ( selector, path, images ) ->
    styles = [
      @css selector, [
        "  background: url( '#{ path }' ) no-repeat"
      ]
    ]
    for image in images
      attr = [
        "  width: #{ image.cssw }px"
        "  height: #{ image.cssh }px"
        "  background-position: #{ -image.cssx }px #{ -image.cssy }px"
      ]
      image.selector = selector
      image.style = @cssStyle attr
      
      styles.push @css( [ selector, image.name ].join( '.' ), attr )
    
    styles.push ""
    styles.join "\n"
  
  comment: ( comment ) ->
    @cssComment comment
  
module.exports = new Style()
