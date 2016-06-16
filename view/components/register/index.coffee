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
        $('#register-form').form({
          inline : true,
          on: 'blur',
          fields: {
            name: {
              identifier  : 'name',
              rules: [{
                type   : 'empty',
                prompt : '姓名不能为空'
              }]
            },
            account: {
              identifier  : 'account',
              rules: [{
                type   : 'empty',
                prompt : '帐号不能为空'
              }]
            },
            password: {
              identifier  : 'password',
              rules: [{
                type   : 'empty',
                prompt : '请输入密码'
              }]
            }
            repassword: {
              identifier  : 'repassword',
              rules: [{
                type   : 'match[password]',
                prompt : '请再次输入密码'
              }]
            }
          }
        })
      test_account:->
        if @new_user.account == ''
          return
        parm = JSON.stringify
          request_type: "test_account"
          request_map:
            account: @new_user.account
        post_load
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
        $.ajax
          url: '/login'
          type: 'PUT'
          data : parm
          success: (data, status, response) =>
            if data.response_data.length > 0
              window.location.href="/home"
