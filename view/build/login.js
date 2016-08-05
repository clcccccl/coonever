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

	var Vue, v_head;

	Vue = __webpack_require__(23);

	__webpack_require__(22);

	v_head = new Vue({
	  el: "#login",
	  data: function() {
	    return {
	      show_left_bar: false,
	      head_type: 'login',
	      login_view: 'login'
	    };
	  },
	  components: {
	    'login': __webpack_require__(38),
	    'register': __webpack_require__(40),
	    'foot_c': __webpack_require__(36),
	    'head_c': __webpack_require__(24)
	  }
	});


/***/ },
/* 1 */,
/* 2 */,
/* 3 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */
/***/ function(module, exports) {

	window.cl = {
	  initValidationForm: function(form, field_datas) {
	    var field_data, fields, i, len, parm;
	    fields = {};
	    for (i = 0, len = field_datas.length; i < len; i++) {
	      field_data = field_datas[i];
	      fields[field_data.name] = {
	        identifier: field_data.name,
	        rules: [
	          {
	            type: field_data.type,
	            prompt: field_data.prompt
	          }
	        ]
	      };
	    }
	    parm = {
	      inline: true,
	      on: 'blur',
	      fields: fields
	    };
	    return $(form).form(parm);
	  },
	  notice: function(message, type, layout) {
	    return noty({
	      text: message,
	      type: type,
	      dismissQueue: true,
	      timeout: 10000,
	      closeWith: ['click'],
	      layout: layout,
	      theme: 'defaultTheme',
	      maxVisible: 10
	    });
	  },
	  noticeError: function(message) {
	    return this.notice(message, 'error', 'center');
	  },
	  noticeSuccess: function(message) {
	    return this.notice(message, 'success', 'center');
	  },
	  noticeWarning: function(message) {
	    return this.notice(message, 'warning', 'center');
	  },
	  noticeMessage: function(message) {
	    return this.notice(message, 'information', 'center');
	  },
	  component_load: function(parm) {
	    return $.ajax({
	      url: "static/build/" + parm.component_name + ".js",
	      dataType: 'script',
	      success: function() {
	        return parm.success();
	      },
	      async: true
	    });
	  },
	  post_load: function(post_parm) {
	    return $.ajax({
	      url: '/post_request',
	      type: 'POST',
	      data: post_parm.parm,
	      success: (function(_this) {
	        return function(data, status, response) {
	          if (data.error === 1) {
	            return _this.noticeError(data.error_text);
	          } else {
	            return post_parm.del_fun(data.response_data);
	          }
	        };
	      })(this)
	    });
	  },
	  href_parm: function(fun_map) {
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
	          href_3 = href_2.split(this.href_parm(get_fun_map))[1];
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
	  },
	  isPositiveNum: function(st) {
	    var ree;
	    ree = /^[1-9]*[0-9][0-9]*$/;
	    return ree.test(st);
	  },
	  cl_copy: function(map) {
	    return jQuery.extend(true, {}, map);
	  },
	  dateFormat: function(mask) {
	    return mask.substring(0, 16);
	  }
	};


/***/ },
/* 23 */
/***/ function(module, exports) {

	Vue.config.debug = true;

	Vue.config.delimiters = ['(%', '%)'];

	module.exports = Vue;


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(25);

	module.exports = Vue.extend({
	  template: __webpack_require__(27),
	  components: {
	    'user-self-icon': __webpack_require__(28)
	  },
	  props: ['show_left_bar', 'head_type', 'login_view'],
	  methods: {
	    changer_menu: function() {
	      return this.show_left_bar = !this.show_left_bar;
	    },
	    change_component: function(component_name) {
	      this.login_view = component_name;
	      this.head_type = component_name;
	      if (component_name !== 'login' && component_name !== 'register') {
	        return this.$dispatch('change_component', component_name);
	      }
	    }
	  }
	});


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(26);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(4)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/less-loader/index.js!./style.less", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/less-loader/index.js!./style.less");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, ".ui.head_bar {\n  padding: 0px;\n}\n", ""]);

	// exports


/***/ },
/* 27 */
/***/ function(module, exports) {

	module.exports = "<div class=\"ui fixed inverted menu grid four column\" style=\"padding: 0px\" id=\"v-head\">\n\t<div class=\"column\">\n\t\t<div class=\"ui dividing\" v-on:click=\"changer_menu\" style=\"color: #ffffff;padding:10px;padding-right: 20px\" v-if=\"head_type!='login' && head_type!='register'\">\n\t\t\t<label><i class=\"grid layout icon\"></i>菜单</label>\n\t\t</div>\n\t</div>\n\t<div class=\"column\">\n\t</div>\n\t<div class=\"column\">\n\t</div>\n\t<div class=\"column\">\n\t\t<div class=\"ui dividing\" style=\"color: #ffffff;float:right;padding:10px;padding-right: 20px\" v-if=\"head_type=='login'\" v-on:click=\"change_component('register')\">\n\t\t<label><i class=\"add square icon\"></i>注册</label>\n\t\t</div>\n\t\t<div class=\"ui dividing\" style=\"color: #ffffff;float:right;padding:10px;padding-right: 20px\" v-if=\"head_type=='register'\" v-on:click=\"change_component('login')\">\n\t\t\t<label><i class=\"ticket icon\"></i>登陆</label>\n\t\t</div>\n\t\t<div class=\"ui dividing\" style=\"color: #ffffff;float:right;padding:10px;padding-right: 20px\" v-if=\"head_type!='login' && head_type!='register'\">\n        \t<user-self-icon></user-self-icon>\n        </div>\n    </div>\n</div>\n";

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = Vue.extend({
	  template: __webpack_require__(29),
	  directives: {
	    'user-head': __webpack_require__(30)
	  },
	  components: {
	    'user-info': __webpack_require__(31)
	  },
	  data: function() {
	    return {
	      info_type: 'popup',
	      user: {}
	    };
	  },
	  attached: function() {
	    this.init_popup();
	    return this.get_user_detail();
	  },
	  methods: {
	    init_popup: function() {
	      return $('.user-head').popup({
	        inline: false,
	        hoverable: true,
	        position: 'bottom right'
	      });
	    },
	    change_component: function(component_name) {
	      return this.$dispatch('change_component', component_name);
	    },
	    get_user_detail: function() {
	      var parm;
	      parm = JSON.stringify({
	        request_type: "get_user_detail"
	      });
	      return cl.post_load({
	        parm: parm,
	        del_fun: (function(_this) {
	          return function(data) {
	            return _this.user = data.data;
	          };
	        })(this)
	      });
	    }
	  }
	});


/***/ },
/* 29 */
/***/ function(module, exports) {

	module.exports = "<a class=\"ui image label user-head\" style=\"height: 30px\" v-on:click=\"change_component('user_detail')\"><img v-user-head=\"user.head_file\" style=\"min-height: 30px;\">(% user.name %)</a>\n<div class=\"ui popup card\" style=\"padding: 0px;margin: 0px\">\n\t<user-info :type.sync=\"info_type\" :user_detail.sync=\"user\"></user-info>\n</div>";

/***/ },
/* 30 */
/***/ function(module, exports) {

	module.exports = {
	  bind: function() {},
	  update: function(value, old_value) {
	    if (value) {
	      return this.el.src = "/static/static/userfile/image/" + value;
	    } else {
	      return this.el.src = "/static/static/userfile/image/default.png";
	    }
	  },
	  unbind: function() {}
	};


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = Vue.extend({
	  template: __webpack_require__(32),
	  directives: {
	    'user-head': __webpack_require__(30),
	    'dateformat': __webpack_require__(33)
	  },
	  props: ['type', 'user_detail'],
	  methods: {
	    logout: function() {
	      return window.location.href = "/login";
	    }
	  }
	});


/***/ },
/* 32 */
/***/ function(module, exports) {

	module.exports = "<div class=\"image\" v-if=\"type!='popup'\">\n\t<img v-user-head=\"user_detail.head_file\" style=\"max-height: 200px;\">\n</div>\n<div class=\"content\" style=\"padding-top: 10px\" v-if=\"type!='popup'\">\n\t<h3 class=\"ui header\">(% user_detail.name %)<div class=\"sub header\">(% user_detail.account %)</div>\n\t</h3>\n\t<div class=\"description\">(% user_detail.motto %)</div>\n\t<div class=\"description\" style=\"padding-top: 10px;color:#999999\" >加入时间：\n\t    <span v-dateformat=\"user_detail.create_date\"></span>\n\t</div>\n</div>\n<div class=\"image\" v-if=\"type=='popup'\">\n\t<img  v-user-head=\"user_detail.head_file\" style=\"max-height: 200px\">\n</div>\n<div class=\"content\" v-if=\"type=='popup'\">\n\t<div class=\"header\">(% user_detail.name %)</div>\n\t<div class=\"meta\">\n\t\t<a>(% user_detail.account %)</a>\n\t</div>\n\t<div class=\"description\">(% user_detail.motto %)</div>\n</div>\n<div class=\"extra content\" v-if=\"type=='popup'\">\n\t<span class=\"right floated\" v-on:click=\"logout\"><label><i class=\"power icon\"></i>退出</label></span>\n</div>";

/***/ },
/* 33 */
/***/ function(module, exports) {

	module.exports = {
	  bind: function() {},
	  update: function(value, old_value) {
	    var date_str, el;
	    if (value) {
	      el = $(this.el);
	      date_str = cl.dateFormat(value);
	      console.log(date_str);
	      return $(this.el).html(date_str);
	    }
	  },
	  unbind: function() {}
	};


/***/ },
/* 34 */,
/* 35 */,
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = Vue.extend({
	  template: __webpack_require__(37)
	});


/***/ },
/* 37 */
/***/ function(module, exports) {

	module.exports = "<div class=\"ui fixed inverted vertical footer segment\">\n\t<div class=\"ui center aligned container\">\n\t\t<div class=\"ui horizontal inverted small divided link list\">\n\t\t\t<a class=\"item\" href=\"#\">Site Map</a>\n\t\t\t<a class=\"item\" href=\"#\">Contact Us</a>\n\t\t\t<a class=\"item\" href=\"#\">Terms and Conditions</a>\n\t\t\t<a class=\"item\" href=\"#\">Privacy Policy</a>\n\t\t</div>\n\t</div>\n</div>";

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = Vue.extend({
	  template: __webpack_require__(39),
	  data: function() {
	    return {
	      user: {}
	    };
	  },
	  attached: function() {
	    return this.init_form();
	  },
	  methods: {
	    init_form: function() {
	      var field1, field2;
	      field1 = {
	        name: 'account',
	        type: 'empty',
	        prompt: '请输入帐号'
	      };
	      field2 = {
	        name: 'password',
	        type: 'empty',
	        prompt: '请输入密码'
	      };
	      return cl.initValidationForm('#login-form', [field1, field2]);
	    },
	    login: function() {
	      var parm;
	      if (!$('#login-form').form('is valid')) {
	        return;
	      }
	      parm = JSON.stringify({
	        request_map: this.user
	      });
	      return $.ajax({
	        url: '/login',
	        type: 'POST',
	        data: parm,
	        success: (function(_this) {
	          return function(data, status, response) {
	            if (data.error === 1) {
	              return cl.noticeError(data.error_text);
	            } else {
	              return window.location.href = "/home";
	            }
	          };
	        })(this)
	      });
	    }
	  }
	});


/***/ },
/* 39 */
/***/ function(module, exports) {

	module.exports = "<div class=\"ui main text container\" style=\"min-height: 100%;padding-top: 180px;\" id=\"login-form\">\n\t<h1 class=\"ui header\">用户登录</h1>\n\t<div class=\"ui form\">\n\t\t<div class=\"field\">\n\t\t\t<label>帐号</label>\n\t\t\t<input type=\"text\" name=\"account\" placeholder=\"帐号\" v-model=\"user.account\">\n\t\t</div>\n\t\t<div class=\"field\">\n\t\t\t<label>密码</label>\n\t\t\t<input type=\"password\" name=\"password\" placeholder=\"密码\" v-model=\"user.password\" @keyup.enter=\"login\">\n\t\t</div>\n\t\t<button class=\"ui button\" @click=\"login\">登录</button>\n\t</div>\n</div>\n";

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = Vue.extend({
	  template: __webpack_require__(41),
	  data: function() {
	    return {
	      new_user: {},
	      can_user: true,
	      i: 0
	    };
	  },
	  attached: function() {
	    return this.init_form();
	  },
	  methods: {
	    init_form: function() {
	      var field1, field2, field3, field4;
	      field1 = {
	        name: 'name',
	        type: 'empty',
	        prompt: '姓名不能为空'
	      };
	      field2 = {
	        name: 'account',
	        type: 'empty',
	        prompt: '帐号不能为空'
	      };
	      field3 = {
	        name: 'password',
	        type: 'empty',
	        prompt: '请输入密码'
	      };
	      field4 = {
	        name: 'repassword',
	        type: 'empty',
	        prompt: '请再次输入密码'
	      };
	      return cl.initValidationForm('#register-form', [field1, field2, field3, field4]);
	    },
	    test_account: function() {
	      var parm;
	      if (this.new_user.account === '') {
	        return;
	      }
	      parm = JSON.stringify({
	        request_type: "test_account",
	        request_map: {
	          account: this.new_user.account
	        }
	      });
	      return cl.post_load({
	        parm: parm,
	        del_fun: (function(_this) {
	          return function(data) {
	            if (data === 1) {
	              return _this.can_user = false;
	            } else {
	              return _this.can_user = true;
	            }
	          };
	        })(this)
	      });
	    },
	    register: function() {
	      var parm;
	      if (!$('#register-form').form('is valid') || !this.can_user) {
	        return;
	      }
	      parm = JSON.stringify({
	        request_map: this.new_user
	      });
	      return $.ajax({
	        url: '/login',
	        type: 'PUT',
	        data: parm,
	        success: (function(_this) {
	          return function(data, status, response) {
	            if (data.error === 1) {
	              return cl.noticeError(data.error_text);
	            } else {
	              return window.location.href = "/home";
	            }
	          };
	        })(this)
	      });
	    }
	  }
	});


/***/ },
/* 41 */
/***/ function(module, exports) {

	module.exports = "<div class=\"ui main text container\" style=\"min-height: 100%;padding-top: 150px;\" id=\"register-form\">\n\t<h1 class=\"ui header\">用户注册</h1>\n\t<div class=\"ui form\">\n\t\t<div class=\"field\">\n\t\t\t<label>姓名</label>\n\t\t\t<input type=\"text\" name=\"name\" placeholder=\"姓名\" v-model=\"new_user.name\">\n\t\t</div>\n\t\t<div class=\"field\">\n\t\t\t<label>帐号<span v-if=\"!can_user\" style=\"margin-left: 300px;color: #9f3a38\">该帐号已存在</span></label>\n\t\t\t<input type=\"text\" name=\"account\" placeholder=\"帐号\" v-model=\"new_user.account\" @blur=\"test_account\">\n\t\t</div>\n\t\t<div class=\"field\">\n\t\t\t<label>密码</label>\n\t\t\t<input type=\"password\" name=\"password\" placeholder=\"密码\" v-model=\"new_user.password\">\n\t\t</div>\n\t\t<div class=\"field\">\n\t\t\t<label>重复密码</label>\n\t\t\t<input type=\"password\" name=\"repassword\" placeholder=\"重复密码\" v-model=\"new_user.repassword\">\n\t\t</div>\n\t\t<button class=\"ui positive button\" @click=\"register\">注册</button>\n\t</div>\n</div>";

/***/ }
/******/ ]);