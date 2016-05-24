/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var Vue, asd_c;

	Vue = __webpack_require__(1);

	__webpack_require__(2);

	asd_c = Vue.extend({
	  template: '<div>I am async! duck</div>'
	});

	Vue.component('clc', asd_c);

	window.v_head = new Vue({
	  el: "#test",
	  data: function() {
	    return {
	      view: '',
	      show_left_bar: true,
	      head_type: 'ok'
	    };
	  },
	  events: {
	    change_component: function(component_name) {
	      return this.change_component(component_name);
	    }
	  },
	  attached: function() {
	    var fun_map, value;
	    fun_map = {
	      type: 'value',
	      key: 'view_model'
	    };
	    value = href_parm(fun_map);
	    if (value !== '') {
	      return this.change_component(value);
	    } else {
	      return this.change_component('clc');
	    }
	  },
	  watch: {
	    'view': function() {
	      var fun_map;
	      fun_map = {
	        type: 'set_value',
	        key: 'view_model',
	        value: this.view
	      };
	      return href_parm(fun_map);
	    }
	  },
	  methods: {
	    load_new_component: function(component_name) {
	      return component_load({
	        component_name: component_name,
	        success: (function(_this) {
	          return function() {
	            return _this.change_component(component_name);
	          };
	        })(this)
	      });
	    },
	    change_component: function(component_name) {
	      if (Vue.options.components.propertyIsEnumerable(component_name)) {
	        return this.view = component_name;
	      } else {
	        return this.load_new_component(component_name);
	      }
	    }
	  }
	});


/***/ },
/* 1 */
/***/ function(module, exports) {

	Vue.config.debug = true;

	Vue.config.delimiters = ['(%', '%)'];

	module.exports = Vue;


/***/ },
/* 2 */
/***/ function(module, exports) {

	window.component_load = function(parm) {
	  return $.ajax({
	    url: "static/build/" + parm.component_name + ".js",
	    dataType: 'script',
	    success: function() {
	      return parm.success();
	    },
	    async: true
	  });
	};

	window.post_load = function(post_parm) {
	  return $.ajax({
	    url: post_parm.url,
	    type: 'POST',
	    data: post_parm.parm,
	    success: (function(_this) {
	      return function(data, status, response) {
	        return post_parm.del_fun(data.response_data);
	      };
	    })(this)
	  });
	};

	window.user_post_load = function(post_parm) {
	  if (!post_parm.url) {
	    post_parm.url = '/user_post_request';
	  }
	  return $.ajax({
	    url: post_parm.url,
	    type: 'POST',
	    data: post_parm.parm,
	    success: (function(_this) {
	      return function(data, status, response) {
	        return post_parm.del_fun(data.response_data);
	      };
	    })(this)
	  });
	};

	window.base_post_load = function(post_parm) {
	  if (!post_parm.url) {
	    post_parm.url = '/user_post_request';
	  }
	  return $.ajax({
	    url: post_parm.url,
	    type: 'POST',
	    data: post_parm.parm,
	    success: (function(_this) {
	      return function(data, status, response) {
	        return post_parm.del_fun(data.response_data);
	      };
	    })(this)
	  });
	};

	window.common_post_load = function(post_parm) {
	  if (!post_parm.url) {
	    post_parm.url = '/user_post_request';
	  }
	  return $.ajax({
	    url: post_parm.url,
	    type: 'POST',
	    data: post_parm.parm,
	    success: (function(_this) {
	      return function(data, status, response) {
	        return post_parm.del_fun(data.response_data);
	      };
	    })(this)
	  });
	};

	window.smp_post_load = function(post_parm) {
	  var parm, sm_post_parm;
	  parm = JSON.stringify({
	    request_type: post_parm.type
	  });
	  sm_post_parm = {
	    parm: parm,
	    del_fun: post_parm.del_fun
	  };
	  return post_load(sm_post_parm);
	};

	window.href_parm = function(fun_map) {
	  var complete_href, e, error, error1, error2, error3, error4, get_fun_map, href_1, href_2, href_3, i, len, parm_list, parm_map, parm_str;
	  if (fun_map.type === 'base_href') {
	    try {
	      return window.location.href.split("?")[0];
	    } catch (error) {
	      e = error;
	      return window.location.href;
	    }
	  }
	  if (fun_map.type === 'parm') {
	    try {
	      return window.location.href.split("?")[1];
	    } catch (error1) {
	      e = error1;
	      return '';
	    }
	  }
	  if (fun_map.type === 'value') {
	    try {
	      parm_map = {};
	      parm_list = window.location.href.split("?")[1].split("&");
	      for (i = 0, len = parm_list.length; i < len; i++) {
	        parm_str = parm_list[i];
	        parm_map[parm_str.split("=")[0]] = parm_str.split("=")[1];
	      }
	      if (fun_map.key && fun_map.key !== '') {
	        return parm_map[fun_map.key];
	      } else {
	        return parm_map;
	      }
	    } catch (error2) {
	      e = error2;
	      return '';
	    }
	  }
	  if (fun_map.type === 'set_value') {
	    if (fun_map.key && fun_map.key !== '' && fun_map.value && fun_map.value !== '') {
	      try {
	        href_1 = window.location.href.split(fun_map.key)[0];
	        href_2 = window.location.href.split(fun_map.key)[1];
	        get_fun_map = {
	          type: 'value',
	          key: fun_map.key
	        };
	        href_3 = href_2.split(href_parm(get_fun_map))[1];
	        complete_href = href_1 + fun_map.key + '=' + fun_map.value + href_3;
	        return window.history.pushState({}, 0, complete_href);
	      } catch (error3) {
	        e = error3;
	        return window.history.pushState({}, 0, window.location.href + '?' + fun_map.key + '=' + fun_map.value);
	      }
	    } else if (fun_map.value && fun_map.value !== '') {
	      try {
	        if (window.location.href.split("?")[1]) {
	          return window.history.pushState({}, 0, window.location.href + '&' + fun_map.value);
	        } else {
	          return window.history.pushState({}, 0, window.location.href + '?' + fun_map.value);
	        }
	      } catch (error4) {
	        e = error4;
	        return window.history.pushState({}, 0, window.location.href + '?' + fun_map.value);
	      }
	    }
	  }
	};

	window.isPositiveNum = function(st) {
	  var ree;
	  ree = /^[1-9]*[0-9][0-9]*$/;
	  return ree.test(st);
	};

	window.cl_copy = function(map) {
	  return jQuery.extend(true, {}, map);
	};


/***/ }
/******/ ]);