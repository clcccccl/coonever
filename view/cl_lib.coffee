window.component_load = (parm)->
  $.ajax
    url: "static/build/" + parm.component_name + ".js"
    dataType: 'script'
    success: ->
      parm.success()
    async: true

window.post_load = (post_parm)->
  $.ajax
    url: '/post_request'
    type: 'POST'
    data : post_parm.parm
    success: (data, status, response) =>
      post_parm.del_fun(data.response_data)


window.href_parm = (fun_map)->
  if fun_map.type == 'base_href'
    try
      return window.location.href.split("?")[0]
    catch e
      return window.location.href
  if fun_map.type == 'parm'
    try
      return window.location.href.split("?")[1]
    catch e
      return ''
  if fun_map.type == 'value'
    try
      parm_map = {}
      parm_list = window.location.href.split("?")[1].split("&")
      for parm_str in parm_list
        parm_map[parm_str.split("=")[0]] = parm_str.split("=")[1]
      if fun_map.key && fun_map.key != ''
        return parm_map[fun_map.key]
      else
        return parm_map
    catch e
        return ''
  if fun_map.type == 'set_value'
    if fun_map.key && fun_map.key != '' && fun_map.value && fun_map.value != ''
      try
        href_1 = window.location.href.split(fun_map.key)[0]
        href_2 = window.location.href.split(fun_map.key)[1]
        get_fun_map =
          type: 'value'
          key: fun_map.key
        href_3 = href_2.split(href_parm(get_fun_map))[1]
        complete_href = href_1 + fun_map.key + '=' + fun_map.value + href_3
        window.history.pushState({},0,complete_href)
      catch e
        window.history.pushState({},0,window.location.href + '?' + fun_map.key + '=' + fun_map.value)
    else if fun_map.value && fun_map.value != ''
      try
        if window.location.href.split("?")[1]
          window.history.pushState({},0,window.location.href + '&' + fun_map.value)
        else
          window.history.pushState({},0,window.location.href + '?' + fun_map.value)
      catch e
        window.history.pushState({},0,window.location.href + '?' + fun_map.value)

#判断是否为正整数
window.isPositiveNum = (st)->
    ree = /^[1-9]*[0-9][0-9]*$/
    return ree.test(st)

#map深复制
window.cl_copy = (map)->
    return jQuery.extend(true, {} , map)