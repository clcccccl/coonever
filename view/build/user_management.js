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
/******/ ({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(60);

	module.exports = Vue.extend({
	  template: __webpack_require__(62),
	  components: {
	    'paging': __webpack_require__(6),
	    'choose-role': __webpack_require__(63)
	  },
	  data: function() {
	    return {
	      users: [],
	      edit_add: false,
	      user_map: {},
	      action: 0,
	      pag_count: 0,
	      search_key: '',
	      role_tree: [],
	      checked_roles: []
	    };
	  },
	  events: {
	    page_change: function(page) {
	      return this.load(page);
	    }
	  },
	  attached: function() {
	    this.load(1);
	    return this.load_roles();
	  },
	  methods: {
	    init_dropdown: function() {
	      return $('.ui.dropdown').dropdown();
	    },
	    load_roles: function() {
	      var parm;
	      parm = JSON.stringify({
	        request_type: "get_roles_tree"
	      });
	      return cl.post_load({
	        parm: parm,
	        del_fun: (function(_this) {
	          return function(data) {
	            _this.role_tree = data.datas;
	            return _this.$nextTick(function() {
	              return this.init_dropdown();
	            });
	          };
	        })(this)
	      });
	    },
	    load: function(page) {
	      var parm;
	      parm = JSON.stringify({
	        request_type: "get_users",
	        request_map: {
	          page: page,
	          search_key: this.search_key
	        }
	      });
	      return cl.post_load({
	        parm: parm,
	        del_fun: (function(_this) {
	          return function(data) {
	            _this.users = data.datas;
	            _this.pag_count = data.page_count;
	            return _this.$nextTick(function() {
	              return this.init_dropdown();
	            });
	          };
	        })(this)
	      });
	    },
	    change_role: function(user) {
	      var parm, request_map;
	      this.checked_roles = [];
	      this.get_checked(this.role_tree);
	      $('#' + user.account).dropdown('hide');
	      request_map = {
	        account: user.account,
	        roles: this.checked_roles
	      };
	      parm = JSON.stringify({
	        request_type: "change_user_role",
	        request_map: request_map
	      });
	      return cl.post_load({
	        parm: parm,
	        del_fun: (function(_this) {
	          return function(data) {
	            return _this.load(1);
	          };
	        })(this)
	      });
	    },
	    get_checked: function(roles) {
	      var i, len, results, role;
	      results = [];
	      for (i = 0, len = roles.length; i < len; i++) {
	        role = roles[i];
	        if (role['checked']) {
	          this.checked_roles.push(role);
	          role['checked'] = false;
	        }
	        if (role.child) {
	          results.push(this.get_checked(role.child));
	        } else {
	          results.push(void 0);
	        }
	      }
	      return results;
	    },
	    del: function(user) {
	      var parm;
	      this.user_map = cl.cl_copy(user);
	      parm = JSON.stringify({
	        request_type: "del_user",
	        request_map: {
	          account: this.user_map.account
	        }
	      });
	      return cl.post_load({
	        parm: parm,
	        del_fun: (function(_this) {
	          return function(data) {
	            _this.load(1);
	            return _this.user_map = {};
	          };
	        })(this)
	      });
	    }
	  }
	});

	Vue.component('user_management', module.exports);


/***/ },

/***/ 3:
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

/***/ 4:
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

/***/ 6:
/***/ function(module, exports, __webpack_require__) {

	module.exports = Vue.extend({
	  template: __webpack_require__(7),
	  props: ['pag_count'],
	  data: function() {
	    return {
	      show_count: 5,
	      show_page: false,
	      first_page: 1,
	      current_page: 1,
	      page_list: []
	    };
	  },
	  watch: {
	    'pag_count': function() {
	      return this.init_page();
	    },
	    'current_page': function() {
	      if (this.current_page !== 0) {
	        return this.$dispatch('page_change', this.current_page);
	      }
	    }
	  },
	  attached: function() {
	    return this.init_page();
	  },
	  methods: {
	    next: function(type) {
	      if (type === 'add') {
	        if (!((this.first_page + this.show_count) > this.pag_count)) {
	          this.first_page += 1;
	        }
	        if (!((this.current_page + 1) > this.pag_count)) {
	          return this.current_page += 1;
	        }
	      } else {
	        if (this.first_page > 1) {
	          this.first_page -= 1;
	        }
	        if ((this.current_page - 1) > 0) {
	          return this.current_page -= 1;
	        }
	      }
	    },
	    this_page: function(page) {
	      return this.current_page = page;
	    },
	    init_page: function() {
	      var num;
	      if (this.pag_count > 0) {
	        this.page_list = (function() {
	          var i, ref, results;
	          results = [];
	          for (num = i = 1, ref = this.pag_count; 1 <= ref ? i <= ref : i >= ref; num = 1 <= ref ? ++i : --i) {
	            results.push(num);
	          }
	          return results;
	        }).call(this);
	        this.current_page = 1;
	        this.show_page = true;
	        return this.show_count = this.pag_count > 5 ? 5 : this.pag_count;
	      }
	    }
	  }
	});


/***/ },

/***/ 7:
/***/ function(module, exports) {

	module.exports = "<tr>\n\t<th colspan=\"4\" v-if=\"show_page\">\n\t\t<div class=\"ui right floated pagination menu\" style=\"background-color: #F0F0F0;\">\n\t\t\t<a class=\"icon item\" @click=\"next('asd')\"  v-bind:class=\"{ 'disabled': current_page == 1}\">\n\t\t\t\t<i class=\"left chevron icon\"></i>\n\t\t\t</a>\n\t\t\t<a class=\"item\" v-for=\"page in page_list\" v-if=\"page>(first_page - 1) && page<(first_page + show_count)\" v-bind:class=\"{ 'active': page==current_page}\" @click=\"this_page(page)\">(%page%)</a>\n\t\t\t<a class=\"icon item\" @click=\"next('add')\" v-bind:class=\"{ 'disabled': (current_page + 1) > pag_count}\">\n\t\t\t\t<i class=\"right chevron icon\"></i>\n\t\t\t</a>\n\t\t</div>\n\t</th>\n</tr>";

/***/ },

/***/ 60:
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(61);
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

/***/ 61:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, ".ui.menu .item:before {\n  background: #F0F0F0;\n}\n.ui.attached.menu {\n  background-color: #F0F0F0;\n}\n.ui.attached.menu:not(.tabular) {\n  border: 0px;\n  border-bottom: 1px solid #ddd;\n}\n.ui.header .icon.himg {\n  padding-left: 30px;\n}\n.icon.hideimg {\n  margin-left: 20px;\n}\n", ""]);

	// exports


/***/ },

/***/ 62:
/***/ function(module, exports) {

	module.exports = "<div class=\"ui main container\" style=\"min-height: 100%;padding-left: 100px\">\n\t<div class=\"ui top attached menu\">\n\t\t<div class=\"ui dropdown icon item\">\n\t\t\t<h3 class=\"ui header\">用户管理</h3>\n\t\t</div>\n\t\t<div class=\"right menu\">\n\t\t\t<div class=\"ui right aligned category search item\">\n\t\t\t\t<div class=\"ui transparent icon input\">\n\t\t\t\t\t<input class=\"prompt\" type=\"text\" v-model=\"search_key\" placeholder=\"Search users...\">\n\t\t\t\t\t<i class=\"search link icon\" @click=\"load(1)\"></i>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"results\"></div>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n\t<div class=\"ui bottom attached segment\" style=\"background-color: #F8F8F8;border:0px;\">\n\t\t<table class=\"ui very basic table\">\n\t\t\t<thead>\n\t\t\t\t<tr>\n\t\t\t\t\t<th>用户名</th>\n\t\t\t\t\t<th>帐号</th>\n\t\t\t\t\t<th>角色</th>\n\t\t\t\t\t<th>操作</th>\n\t\t\t\t</tr>\n\t\t\t</thead>\n\t\t\t<tbody>\n\t\t\t\t<tr v-for=\"user in users\">\n\t\t\t\t\t<td>(% user.name %)</td>\n\t\t\t\t\t<td>(% user.account %)</td>\n\t\t\t\t\t<td>\n\t\t\t\t\t\t<div class=\"ui left pointing dropdown link item\" id=\"(% user.account %)\">\n\t\t\t\t\t\t\t(% user.role %)<a><i class=\"configure icon\"></i></a>\n\t\t\t\t\t\t\t<div class=\"menu\" style='min-width: 300px;'>\n\t\t\t\t\t\t\t\t<div class=\"header\">\n\t\t\t\t\t\t\t\t\t<i class=\"tags icon\"></i>\n\t\t\t\t\t\t\t\t\t角色选择\n\t\t\t\t\t\t\t\t\t<a><i class=\"large green submit checkmark icon hideimg\" @click=\"change_role(user)\"></i></a>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<choose-role :roles.sync=\"role_tree\" style=\"margin-bottom: 20px;\"></choose-role>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</td>\n\t\t\t\t\t<td>\n\t\t\t\t\t\t<div class=\"ui left pointing dropdown link item\">\n\t\t\t\t\t    \t<i class=\"large brown remove circle icon\"></i>\n\t\t\t\t\t\t\t<div class=\"menu\">\n\t\t\t\t\t\t\t\t<button class=\"item\" style=\"background: #FFFAF3\" @click=\"del(user)\">确认删除?请谨慎操作！</button>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</td>\n\t\t\t\t</tr>\n\t\t\t</tbody>\n\t\t</table>\n\t\t<paging :pag_count.sync=\"pag_count\"></paging>\t\n\t</div>\n</div>";

/***/ },

/***/ 63:
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(64);

	module.exports = Vue.extend({
	  name: 'choose-role',
	  template: __webpack_require__(66),
	  props: ['roles'],
	  methods: {
	    select_role: function(roles) {
	      if (role.child && role.child.length > 0) {
	        return role.show = !role.show;
	      }
	    },
	    cancel_role: function(role) {
	      return this.$dispatch('edit_role', role);
	    }
	  }
	});


/***/ },

/***/ 64:
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(65);
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

/***/ 65:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, ".item_role {\n  padding-left: 20px;\n  padding-top: 10px;\n}\n", ""]);

	// exports


/***/ },

/***/ 66:
/***/ function(module, exports) {

	module.exports = "<div>\n    <div class=\"item_role\" data-value=\"important\" v-for=\"role in roles\">\n\t\t<div class=\"ui checkbox\" v-if=\"role.role_code != 'root'\" >\n\t\t\t<input type=\"checkbox\" name=\"example\" v-model=\"role.checked\" style=\"disabled\" disabled=\"(% role.role_type == 'root' %)\">\n\t\t\t<label>(% role.role_name %)</label>\n\t\t</div>\n\t\t<choose-role :roles.sync=\"role.child\"></choose-role>\n\t\t<div class=\"item\">\n\t\t</div>\n\t</div>\n</div>\n";

/***/ }

/******/ });