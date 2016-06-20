require './style.less'

module.exports =
  Vue.extend
    template: require('./template.html')
    data:->
      businesses:[]
      business: {}
      parent_business:{}
      action: 0
      is_leaf:['父节点','子节点']
      rm_business_error_options:
        id: "rm_business_error_modal"
        modal_title:"删除业务失败"
        modal_content:"该业务有子业务，无法删除"
    events: 
      edit_business: (business)->
        $('.ui.form.business').form('reset')
        @action = 0
        @business = {}
        @business = jQuery.extend(true, {} , business)
        $('#edit-business-modal').modal('show')
      add_business: (business)->
        $('.ui.form.business').form('reset')
        @action = 1
        @parent_business = {}
        @parent_business = jQuery.extend(true, {} , business)
        @business = {}
        @business =
          is_leaf: 0
        $('#edit-business-modal').modal('show')
      rm_business: (business)->
        @action = 2
        @business = {}
        @business = jQuery.extend(true, {} , business)
        if @business.child and @business.child.length > 0
          $('#rm_business_error_modal').modal('show')
        else
          @save()
    components:
      'business-component': require('../../components/business_component')
      'error-modal': require('../../components/error_modal')
    attached: ->
      @load()
      @init_form()
    methods:
      init_form:->
        field1=
          name: 'business_name'
          type: 'empty',
          prompt : '请输入业务名'
        field2=
          name: 'business_code'
          type: 'empty',
          prompt : '请输入业务编码'
        cl.initValidationForm('.ui.form.business', [field1, field2])
      load:->
        parm = JSON.stringify
          request_type: "get_businesses_tree"
        cl.post_load
          parm:parm
          del_fun:(data)=>
            @businesses = data.datas
      save:->
        if !$('.ui.form.business').form('is valid')
          return
        if @business.is_leaf
          @business.is_leaf = 1
        else
          @business.is_leaf = 0
        if @action == 1
          @business.parent_business_code = @parent_business.business_code
          @business.seq_code = @parent_business.seq_code + '.' + @business.business_code
        if @action == 2
          @business.status = 1
        parm = JSON.stringify
          request_type: "save_business"
          request_map:@business
        cl.post_load
          parm:parm
          del_fun:(data)=>
            $('#edit-business-modal').modal('hide')
            @load()

Vue.component('business_management', module.exports)
