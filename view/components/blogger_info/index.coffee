module.exports =
  Vue.extend
    template: require('./template.html')
    props: ['blogger_name']
    directives:
      'user-head': require('../../directives/user_head')
    data:->
      blogger: {}
    attached: ->
      @init()
    methods:
      init:->
        @get_blogger_detail()
      init_popup:->
        $('.blogger-head').popup
          inline:false
          hoverable: true
          position : 'bottom left'
      get_blogger_detail:->
        cl.p_load
          request_map: {blogger_name: @blogger_name}
          request_type: "get_blogger_detail"
          del_fun:(data)=>
            @blogger = data.data
            @.$nextTick ->
              @init_popup()
