module.exports =
  Vue.extend
    template: require('./template.html')
    directives:
      'user-head': require('../../directives/user_head')
    components:
      'user-info': require('../../components/user_info')
    data:->
      info_type:'popup'
      user:{}
    attached: ->
      @init_popup()
      @get_user_detail()
    methods:
      init_popup:->
        $('.user-head').popup
          inline:false
          hoverable: true
          position : 'bottom right'
      change_component:(component_name) ->
        @$dispatch('change_component', component_name)
      get_user_detail:->
        parm = JSON.stringify
          request_type: "get_user_detail"
        cl.post_load
          parm:parm
          del_fun:(data)=>
            @user = data.data