module.exports =
  Vue.extend
    name: 'business_component'
    template: require('./template.html')
    props: ['businesses']
    data:->
      rm_text:''
    attached: ->
      $('.ui.dropdown').dropdown()
      for business in @businesses
        if !(business.child and business.child.length > 0)
          business.show = false
    methods:
      showChild:(business)->
        if business.child && business.child.length > 0
          business.show = !business.show
      edit_business:(business)->
      	@$dispatch('edit_business', business)
      add_business:(business)->
      	@$dispatch('add_business', business)
      rm_business:(business)->
        @$dispatch('rm_business', business)