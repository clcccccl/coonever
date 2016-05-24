component_welcome =
  Vue.extend
    template: require('./template.html')

Vue.component('welcome', component_welcome)