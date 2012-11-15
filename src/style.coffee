class Style

  css: ( selector, attributes ) ->
    "#{ selector } {\n#{ attributes };\n}\n"
  
  cssStyle: ( attributes ) ->
    attributes.join ";\n"
  
  cssComment: ( comment ) ->
    "/*\n#{ comment }\n*/"
  
  cssSelector: ( selector, image ) ->
    [ selector, image.name ].join( '.' )
  
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
      image.selector = @cssSelector selector, image
      image.style = @cssStyle attr
      
      styles.push @css( image.selector, image.style )
    
    styles.push ""
    styles.join "\n"
  
  comment: ( comment ) ->
    @cssComment comment
  
module.exports = new Style()
