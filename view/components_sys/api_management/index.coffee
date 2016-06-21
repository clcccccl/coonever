require './style.less'

module.exports =
  Vue.extend
    template: require('./template.html')
    components:
      'paging': require('../../components/paging')
    data: ->
      apis:[]
      api_map : {}
      api: {}
      pag_count: 0
      search_key: ''
    events:
      page_change: (page)->
        @load(page)
    watch:
      'api.disable': ->
        if typeof(@api.disable) == 'boolean'
          @save_status()
      'api.restrict': ->
        if typeof(@api.restrict) == 'boolean'
          @save_status()

    attached: ->
      @load(1)
    methods:
      init_dropdown:->
        $('.ui.dropdown').dropdown()
      load:(page)->
        parm = JSON.stringify
          request_type: "get_apis"
          request_map: {page:page,search_key:@search_key}
        cl.post_load
          parm:parm
          del_fun:(data)=>
            @apis = data.datas
            @pag_count = data.page_count
      change_status:(api)->
        @api = api
      save_status:(api)->
        parm = JSON.stringify
          request_type: "edit_api"
          request_map: @api
        cl.post_load
          parm:parm
          del_fun:(data)=>
            return

Vue.component('api_management', module.exports)