module.exports =
  bind: ->
  update: (value, old_value) ->
    if value
      el = $(@el)
      date_str = cl.dateFormat(value)
      console.log date_str
      $(@el).html(date_str)
  unbind: ->