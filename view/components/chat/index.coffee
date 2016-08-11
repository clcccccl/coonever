require './style.less'

module.exports =
  Vue.extend
    template: require('./template.html')
    data:->
      socket : null
      message : ''
    attached: ->
      console.log 'asdasdas'
      @init_socket()
    methods:
      init_socket:->
        @socket = null
        @socket = new WebSocket("ws://127.0.0.1:8000/message_socket")
        @socket.onopen = ->
          console.log 'onopen'
        @socket.onmessage = (evt)->
          console.log evt.data
      newmessage:->
        @socket.send(@message)
