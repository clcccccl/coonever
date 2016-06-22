module.exports =
  bind:->
  update: (value, old_value) ->
  	if value == 'login' or value == 'register'
  	  return
  	parm = JSON.stringify
      request_type: "get_user_head_file_name"
    cl.post_load
      parm:parm
      del_fun:(data)=>
        @el.src = "/static/static/userfile/image/" + data.data.file_name
  unbind:->