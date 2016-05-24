module.exports =
  Vue.extend
    template: require('./template.html')
    props: ['error_options']
    components:
      'modal-content': require('../modal_content')
