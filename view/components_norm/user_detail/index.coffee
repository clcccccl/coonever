require './style.less'

module.exports =
  Vue.extend
    template: require('./template.html')
    components:
      'user-info': require('../../components/user_info')
      'file-display': require('../../components/file_display')
    data:->
      user_detail: {}
      type:'info'
      user_head_chnage_file:
        file_name:''
    attached: ->
      @get_user_detail()
    methods:
      get_user_detail:->
        parm = JSON.stringify
          request_type: "get_user_detail"
        cl.post_load
          parm:parm
          del_fun:(data)=>
            @user_detail = data.data
            @user_head_chnage_file = data.data.head_file
      

Vue.component('user_detail', module.exports)