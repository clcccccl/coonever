window.cl=
  initValidationForm:(form, field_datas)->
    fields = {}
    for field_data in field_datas
      fields[field_data.name] =
        identifier:field_data.name
        rules:[
          type:field_data.type
          prompt:field_data.prompt
        ]
    parm =
      inline: true
      on: 'blur'
      fields: fields
    $(form).form(parm)
  notice:(message, type, layout)->
    noty
      text:message
      type:type
      dismissQueue: true
      timeout: 10000
      closeWith: ['click']
      layout: layout
      theme: 'defaultTheme'
      maxVisible: 10
  noticeError:(message)->
    @notice(message, 'error', 'center')
  noticeSuccess:(message)->
    @notice(message, 'success', 'center')
  noticeWarning:(message)->
    @notice(message, 'warning', 'center')
  noticeMessage:(message)->
    @notice(message, 'information', 'center')
  component_load:(parm)->
    $.ajax
      url: "static/build/" + parm.component_name + ".js"
      dataType: 'script'
      success: ->
        parm.success()
      async: true
  p_load:(post_parm)->
    parm = JSON.stringify
      request_type: post_parm.request_type
      request_map: post_parm.request_map
    @post_load
      parm:parm
      del_fun:post_parm.del_fun
  post_load: (post_parm)->
    $.ajax
      url: '/post_request'
      type: 'POST'
      data : post_parm.parm
      success: (data, status, response) =>
        if data.error == 1
          @noticeError(data.error_text)
        else
          post_parm.del_fun(data.response_data)
  href_p:(key, type='value', value='')->
    fun_map =
      type: type
      key: key
      value: value
    return @href_parm(fun_map)
  href_parm: (fun_map)->
    url_list = window.location.href.split("?")
    parm_head = url_list[0]
    parm_list = if url_list.length > 1 then url_list[1].split("&") else []
    # 将没有 = 的字符串过滤
    parm_list = @del_list_element(parm_list, (data)->
      return if data.search('=') == -1 then true else false
    )
    parm_map = {}
    parm_map[parm_str.split("=")[0]] = parm_str.split("=")[1] for parm_str in parm_list
    if fun_map.type == 'value'
      try
        if @testBoolean(fun_map.key)
          return if typeof(parm_map[fun_map.key]) == "undefined" then '' else parm_map[fun_map.key]
        else
          return parm_map
      catch e
          return ''

    if fun_map.type == 'del_value'
      if @testBoolean(fun_map.key) and parm_list.length > 0
        parm_list = @del_list_element(parm_list, (data)->
          return if data.split("=")[0] == fun_map.key then true else false
        )
      else
        return false
    if fun_map.type == 'set_value'
      if @testBoolean(fun_map.key) and @testBoolean(fun_map.value)
        if parm_map.hasOwnProperty(fun_map.key)
          parm_list = @del_list_element(parm_list, (data)->
            return if data.split("=")[0] == fun_map.key then true else false
          )
        parm_list.push(fun_map.key + '=' + fun_map.value)
      else
        return false
    parm_content = "?"
    parm_content = parm_content + parm_str + '&' for parm_str in parm_list
    parm_content = if parm_content.length > 0 then parm_content.slice(0,-1) else ''
    window.history.pushState({},0,parm_head + parm_content)
    return true
  del_list_element:(list_data, judgment_fun)->
    return (data for data in list_data when not judgment_fun(data))
  isPositiveNum: (st)->
    ree = /^[1-9]*[0-9][0-9]*$/
    return ree.test(st)
  cl_copy: (obj)->
    if typeof(obj.length) == "undefined"
      return jQuery.extend(true, {} , obj)
    else
      return (data for data in list_obj)
  dateFormat:(mask)->
    return mask.substring(0,16)
  testBoolean:(data, return_data=true)->
    # 所有{}返回false,无法判断
    if typeof(data) == "undefined" or data in [null, '' ,0]
      return false
    if typeof(data) == 'object'
      return if data.length > 0 then true else false
    else
      return true
