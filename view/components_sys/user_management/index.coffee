require './style.less'

module.exports =
  Vue.extend
    template: require('./template.html')
    components:
      'error-modal': require('../../components/error_modal')
      'paging': require('../../components/paging')
      'choose-role': require('../../components/choose_role')
    data: ->
      users:[]
      edit_add:false
      user_map : {}
      action : 0
      pag_count: 0
      search_key: ''
      role_tree: []
      checked_roles:[]
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
      @load_roles()
    methods:
      init_dropdown:->
        $('.ui.dropdown').dropdown()
      init_form:->
        init_form:->
        field1 =
          name: 'user_name'
          type: 'empty',
          prompt:'请输入姓名'
        field2 =
          name: 'account'
          type: 'empty',
          prompt:'请输入帐号'
        field3 =
          name: 'password'
          type: 'empty',
          prompt:'请输入密码'
        field4 =
          name: 'repassword'
          type: 'empty',
          prompt:'请重复密码'
        cl.initValidationForm('#user-form', [field1, field2, field3, field4])
      load_roles:->
        parm = JSON.stringify
          request_type: "get_roles_tree"
        cl.post_load
          parm:parm
          del_fun:(data)=>
            @role_tree = data.datas
      load:(page)->
        parm = JSON.stringify
          request_type: "get_users"
          request_map: {page:page,search_key:@search_key}
        cl.post_load
          parm:parm
          del_fun:(data)=>
            @users = data.datas
            @pag_count = data.page_count
      change_role:(user)->
        @checked_roles = []
        @get_checked(@role_tree)
        $('#' + user.account).dropdown('hide')
        request_map =
          account: user.account
          roles: @checked_roles
        parm = JSON.stringify
          request_type: "change_user_role"
          request_map: request_map
        cl.post_load
          parm:parm
          del_fun:(data)=>
            @load(1)

      get_checked:(roles)->
        for role in roles
          if role['checked']
            @checked_roles.push(role)
            role['checked'] = false
          if role.child
            @get_checked(role.child)
      edit_user:(user) ->
        @user_map = cl_copy(user)
        @action = 0
        @edit_add = true

      add_user: ->
      	@user_map = {}
      	@action = 1
      	@edit_add = !@edit_add

      hide_form: ->
        @edit_add = false
      save_user: ->
      	if !$('#user-form').form('is valid')
          return
        if @action == 0
          parm = JSON.stringify
            request_type: "edit_user"
            request_map: @user_map
          @hide_form()
        else if @action == 1
          parm = JSON.stringify
            request_type: "new_user"
            request_map: @user_map
          @hide_form()
        else if @action == 2
          parm = JSON.stringify
            request_type: "del_user"
            request_map: {account:@user_map.account}
        cl.post_load
          parm:parm
          del_fun:(data)=>
            @load(1)
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

Vue.component('user_management', module.exports)