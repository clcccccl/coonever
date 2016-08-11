require('./style.less')

component_frient =
  Vue.extend
    template: require('./template.html')
    components:
      'chat': require('../../components/chat')
      'add_friend': require('../../components/add_friend')
    data: ->
      friend_view:''
    attached: ->
      @friend_view = 'chat'
    methods:
      changeFriendView:(friend_view)->
        @friend_view = friend_view

Vue.component('friend', component_frient)
