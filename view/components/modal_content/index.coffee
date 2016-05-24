module.exports =
  Vue.extend
    template: require('./template.html')
    props: ['content_options','content_data']
    components:
      'field': require('../field')