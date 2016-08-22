module.exports =
  Vue.extend
    template: require('./template.html')
    components:
      'editor': require('../../components/editor')
    data:->
      content_id: ''
      blog: {}
    events:
      content_id_changed:(content_id) ->
        @content_id = content_id
      valuechanged:(value) ->
        @blog.content = value
    attached: ->
      id = cl.href_p('blog_id')
      if cl.testBoolean(id)
        cl.href_p('blog_id', 'del_value')
        @load_blog(id)
    methods:
      load_blog:(id) ->
        parm = JSON.stringify
          request_type: "load_blog"
          request_map: id
        cl.post_load
          parm:parm
          del_fun:(data)=>
            @blog = data.datas
            @$broadcast('content_changed',@blog.content)
      save_blog:->
        if not cl.testBoolean(@blog.blog_title)
          cl.noticeWarning('想个题目撒！')
          return
        if not cl.testBoolean(@blog.content)
          cl.noticeWarning('标题党？要么写要么滚！')
          return
        @blog.blog_type = @content_id
        if not cl.testBoolean(@blog.blog_type)
          cl.noticeWarning('系统异常，联系管理员')
          return
        parm = JSON.stringify
          request_type: "save_blog"
          request_map: @blog
        cl.post_load
          parm:parm
          del_fun:(data)=>
            window.location.href = "/blog?h_m_k=" + @blog.blog_type + "&content_id=" + data.datas