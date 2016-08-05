module.exports =
  Vue.extend
    template: require('./template.html')
    data: ->
      user:{}
    attached: ->
      @init_form()
    methods:
      init_form:->
        field1=
          name: 'account'
          type: 'empty',
          prompt:'请输入帐号'
        field2=
          name:'password'
          type:'empty',
          prompt: '请输入密码'
        cl.initValidationForm('#login-form', [field1, field2])
      login: ->
      	if !$('#login-form').form('is valid')
          return
        parm = JSON.stringify
          request_map: @user
        $.ajax
          url: '/login'
          type: 'POST'
          data : parm
          success: (data, status, response) =>
            if data.error == 1
              cl.noticeError(data.error_text)
            else
              window.location.href="/home"
