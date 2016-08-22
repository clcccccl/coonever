require './home.less'

require './cl_lib.coffee'

Vue = require('./vue_local.coffee')

window.v_head = new Vue
  el: "#blog"
  components:
    'blog_head': require('./components_blog/blog_head')
    'blog_left': require('./components_blog/blog_left')
    'write_blog': require('./components_blog/write_blog')
    'show_blog': require('./components_blog/show_blog')
  data:->
    blogger: ''
    edit_blog: false
    logged: null
    user_account: ''
  events:
    change_head_menu:(menu_key) ->
      if menu_key == 'write_blog'
        @edit_blog = true
      else
        @edit_blog = false
      @$broadcast('head_menu_changed', menu_key)
    change_content_id:(content_id) ->
      @$broadcast('content_id_changed',content_id)
    change_head_menus: ->
      @$broadcast('head_menus_changed')
    change_user_status:(logged)->
      @logged = logged
    change_blog_blone:(user_account)->
      @user_account = user_account
      @get_blogger()
      if @blogger = '' and cl.testBoolean(@user_account)
        @blogger = @user_account
        cl.href_p('blogger', 'set_value', @blogger)
  attached: ->
    @init()
  methods:
    init:->
      @get_blogger()
    get_blogger:->
      # 获取url中的数据
      # 博主
      # 为空时博主未登录者
      # 为空且未登录无博主
      @blogger = cl.href_p('blogger')
      if @blogger != ''
        @check_blogger()
    check_blogger:()->
      cl.p_load
        request_type: "test_account"
        request_map:{account: @blogger}
        del_fun:(data)=>
          if data != 1
            location.href = '/blog'
