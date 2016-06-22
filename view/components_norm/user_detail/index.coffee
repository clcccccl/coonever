require './style.less'

module.exports =
  Vue.extend
    template: require('./template.html')
    directives:
      'user-head': require('../../directives/user_head')
    data:->
      model:"user_detail"

Vue.component('user_detail', module.exports)