require './style.less'

module.exports =
  Vue.extend
    template: require('./template.html')
    components:
      'paging': require('../../components/paging')
      'choose-role': require('../../components/choose_role')
      'loading': require('../../components/loading')
    data: ->
      users:[]
      edit_add:false
      user_map : {}
      action : 0
      pag_count: 0
      search_key: ''
      role_tree: []
      checked_roles:[]
      loading: false
    events: 
      page_change: (page)->
        @load(page)
    attached: ->
      @load(1)
      @load_roles()
    methods:
      init_dropdown:->
        $('.ui.dropdown').dropdown()
      load_roles:->
        parm = JSON.stringify
          request_type: "get_roles_tree"
        cl.post_load
          parm:parm
          del_fun:(data)=>
            @role_tree = data.datas
            @.$nextTick ->
              @init_dropdown()
      load:(page)->
        @loading = true
        parm = JSON.stringify
          request_type: "get_users"
          request_map: {page:page,search_key:@search_key}
        cl.post_load
          parm:parm
          del_fun:(data)=>
            @users = data.datas
            @pag_count = data.page_count
            @.$nextTick ->
              @init_dropdown()
              @loading = false
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
      del:(user) ->
        @loading = true
        @user_map = cl.cl_copy(user)
        parm = JSON.stringify
          request_type: "del_user"
          request_map: {account:@user_map.account}
        cl.post_load
          parm:parm
          del_fun:(data)=>
            @loading = false
            @load(1)
            @user_map = {}

Vue.component('user_management', module.exports)