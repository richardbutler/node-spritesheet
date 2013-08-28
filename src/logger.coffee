
class Logger
  constructor: ->
    @_log = true

Logger::disable = ->
  @_log = false

Logger::enable = ->
  @_log = true

Logger::log = ->
  console.log.apply console, arguments if @_log

module.exports = new Logger()
