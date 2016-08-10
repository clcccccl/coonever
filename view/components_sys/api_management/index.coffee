require './style.less'

module.exports =
  Vue.extend
    template: require('./template.html')
    components:
      'paging': require('../../components/paging')
      'api-choose-business': require('../../components/api_choose_business')
    data: ->
      apis:[]
      api_map : {}
      api: {}
      pag_count: 0
      search_key: ''
      businesses: []
    events:
      page_change: (page)->
        @load(page)

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
            @.$nextTick ->
              @init_dropdown()
      getBusiness:(api)->
        @businesses = []
        @api = api
        parm = JSON.stringify
          request_type: "get_business_by_api"
          request_map: {api:@api.api}
        cl.post_load
          parm:parm
          del_fun:(data)=>
            @businesses = data.datas
            @.$nextTick ->
              @init_dropdown()
      save_status:(api)->
        parm = JSON.stringify
          request_type: "edit_api"
          request_map: api
        cl.post_load
          parm:parm
          del_fun:(data)=>
            return
      changeChecked:(api, business)->
        parm = JSON.stringify
          request_type: "save_business_api"
          request_map: {api:api.api,business_code:business.business_code,checked:business.checked}
        cl.post_load
          parm:parm
          del_fun:(data)=>
            @load(1)

Vue.component('api_management', module.exports)