require './style.less'

module.exports =
  Vue.extend
    name: 'role_component'
    template: require('./template.html')
    components:
      'choose-business': require('../../components/choose_business')
    props: ['roles']
    data:->
      rm_text:''
    attached: ->
      $('.ui.dropdown').dropdown()
      for role in @roles
        if !(role.child and role.child.length > 0)
          role.show = false
    methods:
      getBussinessTree:(role)->
        @checked_business = []
        parm = JSON.stringify
          request_type: "get_role_businesses_tree"
          request_map: {role_code:role.role_code}
        cl.post_load
          parm:parm
          del_fun:(data)=>
            Vue.set(role, 'business_tree', data.datas )
      showChild:(role)->
      	if role.child && role.child.length > 0
          role.show = !role.show
      edit_role:(role)->
      	@$dispatch('edit_role', role)
      add_role:(role)->
      	@$dispatch('add_role', role)
      rm_role:(role)->
        @$dispatch('rm_role', role)