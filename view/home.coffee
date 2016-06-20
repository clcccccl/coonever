require './home.less'

require './cl_lib.coffee'

Vue = require('./vue_local.coffee')

window.v_head = new Vue
  el: "#all"
  data:->
    view: ''
    show_left_bar: true
    head_type: 'ok'
    login_view: 'login'
  components:
    'head_c': require('./components/head')
    'left_bar_c': require('./components/left_bar')
    'foot_c': require('./components/foot')
  events: 
    change_component:(component_name) ->
      @change_component(component_name)
  attached: ->
    fun_map =
      type: 'value'
      key: 'view_model'
    value = cl.href_parm(fun_map)
    if value != ''
      @change_component(value)
    else
      @change_component('welcome')
  watch:
    'view': ->
      fun_map =
        type: 'set_value'
        key: 'view_model'
        value: @view
      cl.href_parm(fun_map)
  methods:
    load_new_component:(component_name)->
      cl.component_load
        component_name: component_name
        success:=>
          @change_component(component_name)
    change_component:(component_name) ->
      if Vue.options.components.propertyIsEnumerable(component_name)
        @view = component_name
      else
        @load_new_component(component_name)