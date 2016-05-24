Vue = require('./vue_local.coffee')

require './cl_lib.coffee'

asd_c = Vue.extend
  template: '<div>I am async! duck</div>'

Vue.component('clc', asd_c)

window.v_head = new Vue
  el: "#test"
  data:->
    view: ''
    show_left_bar: true
    head_type: 'ok'
  events: 
    change_component:(component_name) ->
      @change_component(component_name)
  attached: ->
    fun_map =
      type: 'value'
      key: 'view_model'
    value = href_parm(fun_map)
    if value != ''
      @change_component(value)
    else
      @change_component('clc')
  watch:
    'view': ->
      fun_map =
        type: 'set_value'
        key: 'view_model'
        value: @view
      href_parm(fun_map)
  methods:
    load_new_component:(component_name)->
      component_load
        component_name: component_name
        success:=>
          @change_component(component_name)
    change_component:(component_name) ->
      if Vue.options.components.propertyIsEnumerable(component_name)
        @view = component_name
      else
        @load_new_component(component_name)
