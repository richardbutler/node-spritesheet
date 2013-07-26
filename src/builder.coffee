fs            = require( 'fs' )
path          = require( 'path' )
qfs           = require( 'q-fs' )
exec          = require( 'child_process' ).exec
async         = require( 'async' )
_             = require( "underscore" )
ImageMagick   = require( './imagemagick' )
Layout        = require( './layout' )
Style         = require( './style' )

separator = path.sep || "/"

ensureDirectory = ( directory ) ->
  ( callback ) ->
    qfs.isDirectory( directory ).then ( isDir ) ->
      if isDir
        callback()
      else
        qfs.makeTree( directory ).then( callback )


class SpriteSheetBuilder

  @supportsPngcrush: ( callback ) ->
    exec "which pngcrush", ( error, stdout, stderr ) =>
      callback stdout and !error and !stderr
  
  @pngcrush: ( image, callback ) ->
    SpriteSheetBuilder.supportsPngcrush ( supported ) ->
      if supported
        crushed = "#{ image }.crushed"
        console.log "\n  pngcrushing, this may take a few moments...\n"
        exec "pngcrush -reduce #{ image } #{ crushed } && mv #{ crushed } #{ image }", ( error, stdout, stderr ) =>
          callback()
      else
        callback()

  @fromGruntTask: ( options ) ->
    builder = new SpriteSheetBuilder( options )
    
    outputConfigurations = options.output
    delete options.output
    
    if outputConfigurations && Object.keys( outputConfigurations ).length > 0
    
      for key of outputConfigurations
        config = outputConfigurations[ key ]
        builder.addConfiguration( key, config )
      
    return builder

  constructor: ( @options ) ->
    @files = options.images
    @outputConfigurations = {}
    @outputDirectory = path.normalize( options.outputDirectory )
    
    if options.outputCss
      @outputStyleFilePath        = [ @outputDirectory, options.outputCss ].join( separator )
      @outputStyleDirectoryPath   = path.dirname( @outputStyleFilePath )

  addConfiguration: ( name, options ) ->
    config = _.extend @options, options,
      name: name,
      outputStyleFilePath: @outputStyleFilePath
      outputStyleDirectoryPath: @outputStyleDirectoryPath

    ssc = new SpriteSheetConfiguration( options.images || @files, config )
    
    @outputConfigurations[ name ] = ssc
    
    # Ascertain the "base" configuration, i.e. the highest pixel density
    # images, to scale down to other ratios
    if !baseConfig || config.pixelRatio > baseConfig.pixelRatio
      baseConfig = config
    
    return ssc

  build: ( done ) ->
    throw "no output style file specified"  if !@outputStyleFilePath
  
    if Object.keys( @outputConfigurations ).length is 0
      # If no configurations are supplied, we need to supply a default.
      @addConfiguration( "default", { pixelRatio: 1 } )
    
    @configs = []
    baseConfig = null
    
    for key of @outputConfigurations
      config = @outputConfigurations[ key ]
      
      # Ascertain the "base" configuration, i.e. the highest pixel density
      # images, to scale down to other ratios
      if !baseConfig || config.pixelRatio > baseConfig.pixelRatio
        baseConfig = config
      
      @configs.push( config )
    
    SpriteSheetConfiguration.baseConfiguration = baseConfig
    
    async.series [
      ( callback ) =>
        async.forEachSeries @configs, @buildConfig, callback
      
      ensureDirectory( @outputStyleDirectoryPath )
      @writeStyleSheet
    ],
    done
  
  buildConfig: ( config, callback ) =>
    config.build( callback )

  writeStyleSheet: ( callback ) =>
    css = @configs.map ( config ) -> config.css
    
    fs.writeFile @outputStyleFilePath, css.join( "\n\n" ), ( err ) =>
      if err
        throw err
      else
        console.log "CSS file written to", @outputStyleFilePath, "\n"
        callback()


class SpriteSheetConfiguration

  constructor: ( files, options ) ->
    throw "no selector specified" if !options.selector
    
    @images = []
    @filter = options.filter
    @outputDirectory = path.normalize options.outputDirectory
    
    # Use the .filter() function, if applicable
    @files = if @filter then files.filter( @filter ) else files
    
    # The ImageMagick filter method to use for resizing images.
    @downsampling = options.downsampling
    
    # The target pixel density ratio for this configuration.
    @pixelRatio = options.pixelRatio || 1
    
    # The pseudonym for which this configuration should be referenced, e.g. "retina".
    @name = options.name || "default"

    if options.outputStyleDirectoryPath
      @outputStyleDirectoryPath   = options.outputStyleDirectoryPath
    
    if options.outputImage
      @outputImageFilePath        = [ @outputDirectory, options.outputImage ].join( separator )
      @outputImageDirectoryPath   = path.dirname( @outputImageFilePath )
      @httpImagePath              = options.httpImagePath || path.relative( @outputStyleDirectoryPath, @outputImageFilePath )

    if options.outputStyleFilePath
      @outputStyleFilePath        = options.outputStyleFilePath

    @style = new Style( options )

  build: ( callback ) =>
    throw "No output image file specified"    if !@outputImageFilePath
    
    console.log "--------------------------------------------------------------"
    console.log "Building '#{ @name }' at pixel ratio #{ @pixelRatio }"
    console.log "--------------------------------------------------------------"
    
    # Whether the images in this configuration should be resized, based on the
    # highest-density pixel ratio.
    @derived = ( !@filter and SpriteSheetConfiguration.baseConfiguration.name isnt @name ) or @files.length is 0
    
    # The multiplier for any image resizing that needs to take place against
    # the base configuration.
    @baseRatio = @pixelRatio / SpriteSheetConfiguration.baseConfiguration.pixelRatio
    
    @layoutImages =>
      if @images.length is 0
        throw "No image files specified"
      
      console.log @summary()
      
      @generateCSS()
      
      async.series [
        ensureDirectory( @outputImageDirectoryPath )
        @createSprite
      ],
      callback
  
  layoutImages: ( callback ) =>
    async.forEachSeries @files, @identify, =>
      layout = new Layout()
      @layout = layout.layout @images, @options
      
      callback()

  identify: ( filepath, callback ) =>
    ImageMagick.identify filepath, ( image ) =>
      if @derived
        image.width = image.width * @baseRatio
        image.height = image.height * @baseRatio
        
        if Math.round( image.width ) isnt image.width or Math.round( image.height ) isnt image.height
           
           image.width = Math.ceil( image.width )
           image.height = Math.ceil( image.height )
           
           console.log( "  WARN: Dimensions for #{ image.filename } don't use multiples of the pixel ratio, so they've been rounded." )
        
        image.baseRatio = @baseRatio
      
      @images.push image
      callback null, image
  
  generateCSS: =>
    @css = @style.generate
      relativeImagePath: @httpImagePath
      images: @images
      pixelRatio: @pixelRatio
      width: @layout.width
      height: @layout.height

  createSprite: ( callback ) =>
    ImageMagick.composite(
      filepath:     @outputImageFilePath
      images:       @images
      width:        @layout.width
      height:       @layout.height
      downsampling: @downsampling
    ,
    => SpriteSheetBuilder.pngcrush( @outputImageFilePath, callback ) )

  summary: ->
    output = "\n  Creating a sprite from following images:\n"
    
    for i in @images
      output += "    #{ @reportPath( i.path ) } (#{ i.width }x#{ i.height }"
      
      if @derived
        output += " - derived from #{ SpriteSheetConfiguration.baseConfiguration.name }"
      
      output += ")\n"

    output += "\n  Output files:
     #{ @reportPath @outputImageFilePath }"

    output += "\n  Output size:
      #{ @layout.width }x#{ @layout.height }
      \n"
    
    return output

  reportPath: ( path ) ->
    path

module.exports = SpriteSheetBuilder
