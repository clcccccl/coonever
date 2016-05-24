module.exports =
  Vue.extend
    template: require('./template.html')
    props: ['pag_count']
    data:->
      show_count: 5
      show_page: false
      first_page: 1
      current_page: 1
      page_list: []
    watch:
      'pag_count': ->
        @init_page()
      'current_page': ->
        if @current_page != 0
          @$dispatch('page_change', @current_page)
    attached: ->
      @init_page()
    methods:
      next:(type) ->
        if type == 'add'
          if !((@first_page + @show_count) > @pag_count)
            @first_page += 1
          if !((@current_page + 1) > @pag_count)
            @current_page += 1
        else
          if @first_page > 1
            @first_page -= 1
          if (@current_page - 1) > 0
            @current_page -= 1
      this_page:(page) ->
        @current_page = page
      init_page:->
        if @pag_count > 0
          @page_list = (num for num in [1..@pag_count])
          @current_page = 1
          @show_page = true
          @show_count =  if @pag_count > 5 then 5 else @pag_count
