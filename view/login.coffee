Vue = require('./vue_local.coffee')

require './cl_lib.coffee'

v_head = new Vue
  el: "#login"
  data:->
  	show_left_bar:false
  	head_type: 'login'
  	login_view: 'login'
  components:
    'login': require('./components_norm/login')
    'register': require('./components_norm/register')
    'foot_c': require('./components/foot')
    'head_c': require('./components/head')