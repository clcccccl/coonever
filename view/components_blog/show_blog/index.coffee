module.exports =
  Vue.extend
    template: require('./template.html')
    props: ['coent_id','head_menu_key','blog_blone']
    data:->
      blog: {}
    events:
      content_id_changed:(content_id) ->
        if cl.testBoolean(content_id)
          @load_blog(content_id)
        else
          @blog = {}
    methods:
      load_blog:(content_id) ->
        parm = JSON.stringify
          request_type: "load_blog"
          request_map: content_id
        cl.post_load
          parm:parm
          del_fun:(data)=>
            @blog = data.datas
            @change_blog_content()
      change_blog_content:->
        @.$nextTick ->
          $('#blog_content').html @blog.content