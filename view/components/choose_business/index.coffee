require './style.less'

module.exports =
  Vue.extend
    name: 'choose-business'
    template: require('./template.html')
    props: ['businesses', 'role_code']
    methods:
      changeChecked:(business)->
        parm = JSON.stringify
          request_type: "save_role_business"
          request_map: {role_code:@role_code,business_code:business.business_code,checked:business.checked}
        cl.post_load
          parm:parm
          del_fun:(data)=>
            @users = data.datas
            @pag_count = data.page_count