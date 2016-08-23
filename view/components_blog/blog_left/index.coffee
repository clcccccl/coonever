module.exports =
  Vue.extend
    template: require('./template.html')
    props: ['blogger', 'user_account']
    data:->
      content_menus: []
      mousein: false
      content_id: ''
      content_menu: {}
      head_menu_key: ''
      new_head_menu:
        restrict: 0
      del_head_menu:
        status: 1
    watch:
      'content_id': ->
        fun_type = if cl.testBoolean(@content_id) then 'set_value' else 'del_value'
        cl.href_p('content_id', fun_type, @content_id)
        @$dispatch('change_content_id', @content_id)
    events:
      head_menu_changed: (head_menu_key)->
        @head_menu_key = head_menu_key
        @load_blog_content_menus()
    attached: ->
      @get_content_id()
    methods:
      get_content_id:->
        # 内容id
        @content_id = cl.href_p('content_id')
      change_content_menu:(content_id)->
        @content_id = content_id
      load_blog_content_menus:->
        cl.p_load
          request_type: "get_blog_content_menu"
          request_map:
            blogger: @blogger
            head_menu: @head_menu_key
          del_fun:(data)=>
            @content_menus = data.datas
            @set_content_id()
            @.$nextTick ->
              @init_hover()
      set_content_id:->
        if !cl.testBoolean(@content_menus)
          @content_id = ''
        else
          in_content_menu = false
          for content_menu in @content_menus
            if @content_id == content_menu.id.toString()
              in_content_menu = true
              break
          if !in_content_menu
            @content_id = @content_menus[0].id
      add_head_menu:->
        if cl.testBoolean(@new_head_menu.menu_name)
          @save_head_menu(@new_head_menu)
      save_head_menu:(head_menu)->
        parm = JSON.stringify
          request_type: "edit_blog_head_menu"
          request_map: head_menu
        cl.post_load
          parm:parm
          del_fun:(data)=>
            @$dispatch('change_head_menus')
            @load_blog_content_menus()
            if head_menu.hasOwnProperty('restrict')
              @new_head_menu.menu_name = ''
      edit_blog:(content_menu)->
        location.href = "/blog?h_m_k=write_blog&content_id=" + @head_menu_key + "&blog_id=" + content_menu.id
      del_blog:(content_menu)->
        if @head_menu_key == 'write_blog'
          @del_head_menu.menu_key = content_menu.id
          @save_head_menu(@del_head_menu)
          return
        content_menu.status = 1
        cl.p_load
          request_type: "save_blog"
          request_map: content_menu
          del_fun:(data)=>
            @load_blog_content_menus()
      init_hover:->
        $('.content_menus').hover(
          ()=>
            @mousein = true
          ()=>
            @mousein = false)