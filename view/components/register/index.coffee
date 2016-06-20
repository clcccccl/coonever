module.exports =
  Vue.extend
    template: require('./template.html')
    data: ->
      new_user:{}
      can_user:true
      i: 0
    attached: ->
      @init_form()
    methods:
      init_form:->
        field1 =
          name: 'name'
          type: 'empty',
          prompt:'姓名不能为空'
        field2 =
          name:'account'
          type:'empty',
          prompt: '帐号不能为空'
        field3 =
          name:'password'
          type:'empty',
          prompt: '请输入密码'
        field4 =
          name:'repassword'
          type:'empty',
          prompt: '请再次输入密码'
        cl.initValidationForm('#register-form', [field1, field2, field3, field4])
      test_account:->
        if @new_user.account == ''
          return
        parm = JSON.stringify
          request_type: "test_account"
          request_map:
            account: @new_user.account
        cl.post_load
          parm:parm
          del_fun:(data)=>
            if data == 1
              @can_user = false
            else
              @can_user = true
      register: ->
        if !$('#register-form').form('is valid') or !@can_user
          return
        parm = JSON.stringify
          request_map: @new_user
        cl.post_load
          parm:parm
          del_fun:(data)=>
            if data
              window.location.href="/home"
