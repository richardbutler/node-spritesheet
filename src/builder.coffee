fs            = require( 'fs' )
path          = require( 'path' )
qfs           = require( 'q-fs' )
exec          = require( 'child_process' ).exec
async         = require( 'async' )
ImageMagick   = require( './imagemagick' )
Layout        = require( './layout' )
Style         = require( './style' )

class SpriteSheetBuilder

  @supportsPngcrush: ( callback ) ->
    exec "which pngcrush", ( error, stdout, stderr ) =>
      callback stdout and !error and !stderr
  
  @pngcrush: ( image, callback ) ->
    SpriteSheetBuilder.supportsPngcrush ( supported ) ->
      if supported
        crushed = "#{ image }.crushed"
        console.log "pngcrushing, this may take a few moments..."
        exec "pngcrush -reduce #{ image } #{ crushed } && mv #{ crushed } #{ image }", ( error, stdout, stderr ) =>
          callback()
      else
        callback()

  constructor: ( @files, @images, @options ) ->
    @outputDirectory = @options.outputDirectory
    
    separator = path.sep || "/"
    
    if @options.outputImage
      @outputImageFilePath        = [ @outputDirectory, @options.outputImage ].join( separator )
      @outputImageDirectoryPath   = path.dirname( @outputImageFilePath )
      
    if @options.outputCss
      @outputStyleFilePath        = [ @outputDirectory, @options.outputCss ].join( separator )
      @outputStyleDirectoryPath   = path.dirname( @outputStyleFilePath )
    
    @selector = @options.selector || ''

  build: ( callback ) =>
    throw "no image files specified"          if !@images
    throw "no output image file specified"    if !@outputImageFilePath
    throw "no output style file specified"    if !@outputStyleFilePath
    
    @layoutImages =>
      console.log @summary()
      
      async.series [
        @ensureDirectory( @outputImageDirectoryPath )
        @ensureDirectory( @outputStyleDirectoryPath )
        @style
        @createSprite
      ], callback
  
  layoutImages: ( callback ) =>
    continueBuild = ( err ) =>
      layout = new Layout()
      @layout = layout.layout @images, @options
      
      callback()
    
    async.forEachSeries @files, @identify, continueBuild

  identify: ( filepath, callback ) =>
    ImageMagick.identify filepath, ( image ) =>
      @images.push image
      callback null, image
      
  style: ( callback ) =>
    relativeImagePath = path.relative( @outputStyleDirectoryPath, @outputImageFilePath )
    css = Style.generate @selector, relativeImagePath, @images
    
    fs.writeFile @outputStyleFilePath, css, ( err ) =>
      if err
        throw err
      else
        console.log "CSS file written to", @outputStyleFilePath
        callback()

  styleComment: ( comment ) ->
    Style.comment comment

  createSprite: ( callback ) =>
    ImageMagick.composite @outputImageFilePath, @images, @layout.width, @layout.height, =>
      SpriteSheetBuilder.pngcrush @outputImageFilePath, callback

  summary: ->
    output = "\nCreating a sprite from following images:\n"
    
    for i in @images
      output += "  #{ @reportPath( i.path ) } (#{ i.width }x#{ i.height })\n"

    output += "\nOutput files:
      #{ @reportPath @outputImageFilePath }
      #{ @reportPath @outputStyleFilePath }"

    output += "\nOutput size:
       #{ @layout.width }x#{ @layout.height }"
    
    return output

  reportPath: ( path ) ->
    path
    
  ensureDirectory: ( directory ) =>
    ( callback ) =>
      qfs.makeTree( directory ).then( callback )

module.exports = SpriteSheetBuilder