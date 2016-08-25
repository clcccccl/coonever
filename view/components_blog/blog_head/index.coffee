require './style.less'

module.exports =
  Vue.extend
    template: require('./template.html')
    props: ['blogger', 'user_account']
    components:
      'login-model': require('../../components/login_model')
      'blogger-info': require('../../components/blogger_info')
    data:->
      head_menu_key: ''
      head_menus: []
      logged: null
      home_icon:''
    events:
      head_menus_changed: ->
        @load_blog_head_menus()
    watch:
      'head_menu_key': ->
        fun_type = if cl.testBoolean(@head_menu_key) then 'set_value' else 'del_value'
        cl.href_p('h_m_k', fun_type, @head_menu_key)
        @$dispatch('change_head_menu', @head_menu_key)
      'logged': ->
        @init_popup()        
        @home_icon = if @logged then 'logout' else 'login'
    attached: ->
      @init()
    methods:
      init:->
        @get_head_menu()
        @check_logged()
      get_head_menu:->
        # 博客头部菜单
        @head_menu_key = cl.href_p('h_m_k')
      check_logged:->
        cl.p_load
          request_type: "check_logged"
          del_fun:(data)=>
            @logged = if data.data == '0' then false else true
            if @logged
              @user_account = data.data
              if @blogger == ''
                @blogger = @user_account
                cl.href_p('blogger', 'set_value', @blogger)
            @load_blog_head_menus()
      init_popup:->
        $('.home-icon').popup
          inline:false
          hoverable: true
          position : 'bottom right'
      my_blog:->
        if @logged
          location.href = "/blog"
      change_head_menu:(menu_key) ->
        @head_menu_key = menu_key
      load_blog_head_menus:->
        request_map =
          blogger: @blogger
        cl.p_load
          request_type: "get_blog_head_menu"
          request_map: request_map
          del_fun:(data)=>
            @head_menus = data.datas
            @check_head_menu_key()
      check_head_menu_key:->
        in_head_menu = false
        for head_menu in @head_menus
          if @head_menu_key == head_menu.menu_key
            in_head_menu = true
            break
        if !in_head_menu && @head_menus.length > 0 && (@head_menu_key!= 'write_blog' or @user_account != @blogger)
          @head_menu_key = @head_menus[0].menu_key
