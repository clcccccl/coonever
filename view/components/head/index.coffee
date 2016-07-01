require('./style.less')

module.exports =
  Vue.extend
    template: require('./template.html')
    components:
      'user-self-icon': require('../../components/user_self_icon')
    props: ['show_left_bar','head_type','login_view']
    methods:
      changer_menu: ->
        @show_left_bar = !@show_left_bar
      change_component:(component_name) ->
        @login_view = component_name
        @head_type = component_name
        if component_name != 'login' and component_name != 'register'
            @$dispatch('change_component', component_name)