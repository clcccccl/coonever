module.exports =
  Vue.extend
    template: require('./template.html')
    directives:
      'user-head': require('../../directives/user_head')
      'dateformat': require('../../directives/dateformat')
    props: ['type', 'user_detail']
    methods:
      logout:->
      	window.location.href="/login"