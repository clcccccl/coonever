module.exports =
  Vue.extend
    template: require('./template.html')
    data: ->
      user:{}
    attached: ->
      @init_form()
    methods:
      init_form:->
        $('#login-form').form({
          on: 'blur',
          fields: {
            account: {
              identifier  : 'account',
              rules: [{
                type   : 'empty',
                prompt : '帐号'
              }]
            },
            password: {
              identifier  : 'password',
              rules: [{
                type: 'empty',
                prompt : '请输入角色名'
              }]
            }
          }
        })
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
            if data.response_data.length > 0
              window.location.href="/home"
