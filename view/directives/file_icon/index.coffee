module.exports =
  bind:->
  update: (value, old_value) ->
  	if value
      @el.src = "/static/static/userfile/image/" + value
    else
      @el.src = "/static/static/userfile/image/default.png"
  unbind:->