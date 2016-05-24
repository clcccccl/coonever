require './style.less'

module.exports =
  Vue.extend
    name: 'choose-role'
    template: require('./template.html')
    props: ['roles']
    methods:
      select_role:(roles)->
        if role.child && role.child.length > 0
          role.show = !role.show
      cancel_role:(role)->
        @$dispatch('edit_role', role)
