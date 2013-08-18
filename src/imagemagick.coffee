exec          = require( 'child_process' ).exec
async         = require( 'async' )

class ImageMagick

  identify: ( filepath, callback ) ->
    @exec "identify #{ filepath }", ( error, stdout, stderr ) ->
      if error or stderr
        throw "Error in identify (#{ filepath }): #{ error || stderr }"

      parts = stdout.split " "
      dims = parts[ 2 ].split "x"
      w = parseInt dims[ 0 ]
      h = parseInt dims[ 1 ]
      filename = filepath.split( '/' ).pop()
      name = filename.split( '.' ).shift()

      image =
        width: w
        height: h
        filename: filename
        name: name
        path: filepath

      callback image

  composite: ( options, callback ) ->
    { filepath, images, width, height, downsampling } = options

    console.log '  Writing images to sprite sheet...'

    command = "
      convert
      -size #{ width }x#{ height }
      canvas:transparent
      -alpha transparent
      #{ filepath }
    "

    imageBlocks = []
    while images.length
      imageBlocks.push images.splice(0,50)

    @exec command, ( error, stdout, stderr ) =>
      if error or stderr
        throw "Error in creating canvas (#{ filepath }): #{ error || stderr }"

      compose = ( images, next ) =>
        console.log "    Composing bulk of #{ images.length } images"
        @composeImages filepath, images, downsampling, next

      async.forEachSeries imageBlocks, compose, callback

  exec: ( command, callback ) ->
    #console.log "Exec: #{ command }"
    exec command, callback

  composeImages: ( filepath, images, downsampling, callback ) ->
    # No need - ImageMagick defaults to Mitchell or Lanczos, where appropriate.
    # downsampling ||= "Lanczos"

    command = " convert #{filepath} "

    images.forEach (image)->

      command += " #{image.path} -geometry #{ image.width }x#{ image.height }+#{ image.cssx }+#{ image.cssy } "
      command += "-filter #{ downsampling }" if downsampling
      command += " -composite"

    command += " #{filepath}"

    exec command, ( error, stdout, stderr ) ->
      if error or stderr
        throw "Error in composite (#{ filepath }): #{ error || stderr }"

      callback()

module.exports = new ImageMagick()
