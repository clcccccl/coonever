module.exports =
  Vue.extend
    template: require('./template.html')
    data:->
      bar_data:[]
    attached: ->
      @get_bar_data()
    methods:
      change_component:(component_name) ->
        @$dispatch('change_component', component_name)
      get_bar_data:->
        parm = JSON.stringify
          request_type: "get_bar_data"
        post_load
          parm:parm
          url: "post_request"
          del_fun:(data)=>
            @bar_data = data
