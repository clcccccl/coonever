require './style.less'

module.exports =
  Vue.extend
    name: 'role_component'
    template: require('./template.html')
    props: ['roles']
    data:->
      rm_text:''
    attached: ->
      $('.ui.dropdown').dropdown()
      for role in @roles
        if !(role.child and role.child.length > 0)
          role.show = false
    methods:
      showChild:(role)->
      	if role.child && role.child.length > 0
          role.show = !role.show
      edit_role:(role)->
      	@$dispatch('edit_role', role)
      add_role:(role)->
      	@$dispatch('add_role', role)
      rm_role:(role)->
        @$dispatch('rm_role', role)