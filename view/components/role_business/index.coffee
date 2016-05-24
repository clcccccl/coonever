require './style.less'

module.exports =
  Vue.extend
    template: require('./template.html')
    components:
      'error-modal': require('../error_modal')
      'paging': require('../paging')
    data: ->
      users:[]
      edit_add:false
      user_map : {}
      action : 0
      pag_count: 0
      search_key: ''

      show_add_user: false
      name_null: false
      account_null: false
      show_save: false
      show_edit: false
      title:
        0:'用户详情'
        1:'新增用户'
        2:'删除用户'
      error_data : 
        0:'删除用户后不可恢复，谨慎操作！'
        1:'删除用户'
    events: 
      page_change: (page)->
        @load(page)
    watch:
      'edit_add': ->
      	if @edit_add
          @init_form()
          @init_dropdown()
    attached: ->
      @load(1)
    methods:
      init_dropdown:->
        $('.ui.dropdown').dropdown()
      init_form:->
        $('#user-form').form({
          on: 'blur',
          fields: {
            user_name: {
              identifier  : 'user_name',
              rules: [{
                type   : 'empty',
                prompt : '请输入角色名'
              }]
            },
            account: {
              identifier  : 'account',
              rules: [{
                type: 'empty',
                prompt : '请输入角色名'
              }]
            }
            password: {
              identifier  : 'password',
              rules: [{
                type   : 'match[repassword]',
                prompt : '请输入角色名'
              }]
            }
            repassword: {
              identifier  : 'repassword',
              rules: [{
                type   : 'match[password]',
                prompt : '请输入角色名'
              }]
            }
          }
        })
      load:(page)->
        parm = JSON.stringify
          request_type: "sys_business.get_users"
          request_map: {page:page,search_key:@search_key}
        user_post_load
          parm:parm
          del_fun:(data)=>
            @users = data.datas
            @pag_count = data.page_count

      edit_user:(user) ->
        @user_map = cl_copy(user)
        @action = 0
        @edit_add = true

      add_user: ->
      	@user_map = {}
      	@action = 1
      	@edit_add = true

      hide_form: ->
        @edit_add = false
      save_user: ->
      	if !$('#user-form').form('is valid')
          return
        if @action == 0
          parm = JSON.stringify
            request_type: "sys_business.edit_user"
            request_map: @user_map
          @hide_form()
        else if @action == 1
          parm = JSON.stringify
            request_type: "sys_business.new_user"
            request_map: @user_map
          @hide_form()
        else if @action == 2
          parm = JSON.stringify
            request_type: "sys_business.del_user"
            request_map: {account:@user_map.account}
        user_post_load
          parm:parm
          del_fun:(data)=>
            @load()
            @user_map = {}
            @hide_add_user()
            @name_null = false
            @account_null = false
      hide_add_user: ->
        @show_add_user = false
      del:(item) ->
        @user_map = cl_copy(user)
        @action = 2
        $("#error_modal").modal('show')