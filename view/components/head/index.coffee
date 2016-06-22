require('./style.less')

module.exports =
  Vue.extend
    template: require('./template.html')
    directives:
      'user-head': require('../../directives/user_head')
    props: ['show_left_bar','head_type','login_view']
    attached: ->
      @init_popup()
    methods:
      init_popup:->
        $('.user-head').popup
          inline:false
          hoverable: true
          position : 'bottom right'
      changer_menu: ->
        @show_left_bar = !@show_left_bar
      change_component:(component_name) ->
        @login_view = component_name
        @head_type = component_name
        if component_name != 'login' and component_name != 'register'
            @$dispatch('change_component', component_name)
      logout:->
      	window.location.href="/login"