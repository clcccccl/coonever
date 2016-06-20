require './style.less'

module.exports =
  Vue.extend
    template: require('./template.html')
    data:->
      roles:[]
      role: {}
      parent_role:{}
      action: 0
      rm_role_error_options:
        id: "rm_role_error_modal"
        modal_title:"删除角色失败"
        modal_content:"该角色有子角色，无法删除"
    events: 
      edit_role: (role)->
        $('.ui.form.role').form('reset')
        @action = 0
        @role = {}
        @role = jQuery.extend(true, {} , role)
        $('#edit-role-modal').modal('show')
      add_role: (role)->
        $('.ui.form.role').form('reset')
        @action = 1
        @parent_role = {}
        @parent_role = jQuery.extend(true, {} , role)
        @role = {}
        $('#edit-role-modal').modal('show')
      rm_role: (role)->
        @action = 2
        @role = {}
        @role = jQuery.extend(true, {} , role)
        if @role.child and @role.child.length > 0
          $('#rm_role_error_modal').modal('show')
        else
          @save()
    components:
      'role-component': require('../../components/role_component')
      'error-modal': require('../../components/error_modal')
    attached: ->
      @load()
      @init_form()
    methods:
      init_form:->
        field1=
          name: 'role_name'
          type: 'empty',
          prompt : '请输入角色名'
        field2=
          name: 'role_code'
          type: 'empty',
          prompt : '请输入角色编码'
        cl.initValidationForm('.ui.form.role', [field1, field2])
      load:->
        parm = JSON.stringify
          request_type: "get_roles_tree"
        cl.post_load
          parm:parm
          del_fun:(data)=>
            @roles = data.datas
      save:->
        if !$('.ui.form.role').form('is valid')
          return
        if @action == 1
          @role.parent_role_code = @parent_role.role_code
          @role.role_type = 'norm'
          @role.seq_code = @parent_role.seq_code + '.' + @role.role_code
        if @action == 2
          @role.status = 1
        parm = JSON.stringify
          request_type: "save_role"
          request_map:@role
        cl.post_load
          parm:parm
          del_fun:(data)=>
            $('#edit-role-modal').modal('hide')
            @load()

Vue.component('role_management', module.exports)