require './style.less'

module.exports =
  Vue.extend
    template: require('./template.html')
    data:->
      search:''
    attached: ->
      load()
    methods:
      load:->
        return