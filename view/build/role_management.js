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

	__webpack_require__(35);

	module.exports = Vue.extend({
	  template: __webpack_require__(37),
	  data: function() {
	    return {
	      roles: [],
	      role: {},
	      parent_role: {},
	      action: 0,
	      rm_role_error_options: {
	        id: "rm_role_error_modal",
	        modal_title: "删除角色失败",
	        modal_content: "该角色有子角色，无法删除"
	      }
	    };
	  },
	  events: {
	    edit_role: function(role) {
	      $('.ui.form.role').form('reset');
	      this.action = 0;
	      this.role = {};
	      this.role = jQuery.extend(true, {}, role);
	      return $('#edit-role-modal').modal('show');
	    },
	    add_role: function(role) {
	      $('.ui.form.role').form('reset');
	      this.action = 1;
	      this.parent_role = {};
	      this.parent_role = jQuery.extend(true, {}, role);
	      this.role = {};
	      return $('#edit-role-modal').modal('show');
	    },
	    rm_role: function(role) {
	      this.action = 2;
	      this.role = {};
	      this.role = jQuery.extend(true, {}, role);
	      if (this.role.child && this.role.child.length > 0) {
	        return $('#rm_role_error_modal').modal('show');
	      } else {
	        return this.save();
	      }
	    }
	  },
	  components: {
	    'role-component': __webpack_require__(38),
	    'error-modal': __webpack_require__(13)
	  },
	  attached: function() {
	    this.load();
	    return this.init_form();
	  },
	  methods: {
	    init_form: function() {
	      var field1, field2;
	      field1 = {
	        name: 'role_name',
	        type: 'empty',
	        prompt: '请输入角色名'
	      };
	      field2 = {
	        name: 'role_code',
	        type: 'empty',
	        prompt: '请输入角色编码'
	      };
	      return cl.initValidationForm('.ui.form.role', [field1, field2]);
	    },
	    load: function() {
	      var parm;
	      parm = JSON.stringify({
	        request_type: "get_roles_tree"
	      });
	      return cl.post_load({
	        parm: parm,
	        del_fun: (function(_this) {
	          return function(data) {
	            return _this.roles = data.datas;
	          };
	        })(this)
	      });
	    },
	    save: function() {
	      var parm;
	      if (!$('.ui.form.role').form('is valid')) {
	        return;
	      }
	      if (this.action === 1) {
	        this.role.parent_role_code = this.parent_role.role_code;
	        this.role.role_type = 'norm';
	        this.role.seq_code = this.parent_role.seq_code + '.' + this.role.role_code;
	      }
	      if (this.action === 2) {
	        this.role.status = 1;
	      }
	      parm = JSON.stringify({
	        request_type: "save_role",
	        request_map: this.role
	      });
	      return cl.post_load({
	        parm: parm,
	        del_fun: (function(_this) {
	          return function(data) {
	            $('#edit-role-modal').modal('hide');
	            return _this.load();
	          };
	        })(this)
	      });
	    }
	  }
	});

	Vue.component('role_management', module.exports);


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
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = Vue.extend({
	  template: __webpack_require__(14),
	  props: ['error_options'],
	  components: {
	    'modal-content': __webpack_require__(15)
	  }
	});


/***/ },
/* 14 */
/***/ function(module, exports) {

	module.exports = "<div class=\"ui modal\" id=\"(%error_options.id%)\">\n\t<i class=\"close icon\"></i>\n\t<div class=\"header\">\n\t\t(%error_options.modal_title%)\n\t</div>\n\t<div class=\"content\">\n\t\t<p>(%error_options.modal_content%)</p>\n\t</div>\n\t<div class=\"actions\">\n\t\t<div class=\"ui black deny button\">\n\t\t\t返回\n\t\t</div>\n\t</div>\n</div>";

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = Vue.extend({
	  template: __webpack_require__(16),
	  props: ['content_options', 'content_data'],
	  components: {
	    'field': __webpack_require__(17)
	  }
	});


/***/ },
/* 16 */
/***/ function(module, exports) {

	module.exports = "<div class=\"content\">\n\t<div class=\"ui form\">\n\t\t<div class=\"field\" v-for=\"field in content_options\">\n\t\t\t<field :field_options=\"field\"></field>\n\t\t</div>\n\t</div>\n</div>";

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = Vue.extend({
	  template: __webpack_require__(18),
	  props: ['field_options']
	});


/***/ },
/* 18 */
/***/ function(module, exports) {

	module.exports = "<label>(% field_options.label %)</label>\n<input type=\"text\" disabled=\"(%field_options.edit%)\" v-if=\"field_options.type=='text'\">\n<textarea type=\"textarea\" disabled=\"(%field_options.edit%)\" rows=\"3\" v-if=\"field_options.type=='textarea'\"></textarea>\n";

/***/ },
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */,
/* 24 */,
/* 25 */,
/* 26 */,
/* 27 */,
/* 28 */,
/* 29 */,
/* 30 */,
/* 31 */,
/* 32 */,
/* 33 */,
/* 34 */,
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(36);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(4)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/less-loader/index.js!./style.less", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/less-loader/index.js!./style.less");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, ".ui.menu .item:before {\n  background: #F0F0F0;\n}\n.ui.attached.menu {\n  background-color: #F0F0F0;\n}\n.ui.attached.menu:not(.tabular) {\n  border: 0px;\n  border-bottom: 1px solid #ddd;\n}\n.ui.header .icon.himg {\n  padding-left: 30px;\n}\n.icon.hideimg {\n  margin-left: 20px;\n}\n", ""]);

	// exports


/***/ },
/* 37 */
/***/ function(module, exports) {

	module.exports = "<div class=\"ui main container\" style=\"min-height: 100%;padding-left: 100px\">\n\t<div class=\"ui top attached menu\">\n\t\t<div class=\"ui dropdown icon item\">\n\t\t\t<h3 class=\"ui header\">角色管理</h3>\n\t\t</div>\n\t</div>\n\t<div class=\"ui bottom attached segment\" style=\"background-color: #F8F8F8;border:0px;\" v-if=\"roles.length > 0\">\n\t\t<role-component :roles.sync=\"roles\"></role-component>\n\t</div>\n\t<div class=\"ui modal\" id=\"edit-role-modal\">\n\t\t<i class=\"close icon\"></i>\n\t\t<div class=\"header\">角色详情</div>\n\t\t<div class=\"content\">\n\t\t\t<div class=\"ui form role\">\n\t\t\t\t<div class=\"field\">\n\t\t\t\t\t<label>角色名</label>\n\t\t\t\t\t<input name=\"role_name\" placeholder=\"请输入角色名\" type=\"text\" v-model=\"role.role_name\">\n\t\t\t\t</div>\n\t\t\t\t<div class=\"field\">\n\t\t\t\t\t<label>角色编码</label>\n\t\t\t\t\t<input name=\"role_code\" placeholder=\"请输入角色编码\" type=\"text\" v-model=\"role.role_code\">\n\t\t\t\t</div>\n\t\t\t\t<div class=\"field\">\n\t\t\t\t\t<label>角色描述</label>\n\t\t\t\t\t<input type=\"text\" placeholder=\"请输入角色描述\" v-model=\"role.role_explain\">\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t\t<div class=\"actions\">\n\t\t\t<div class=\"ui buttons\">\n\t\t\t\t<button class=\"ui deny button\">返回</button>\n\t\t\t\t<div class=\"or\"></div>\n\t\t\t\t<button class=\"ui submit blue right button\" @click=\"save\">保存</button>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n\t<error-modal :error_options=\"rm_role_error_options\"></error-modal>\n</div>";

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(39);

	module.exports = Vue.extend({
	  name: 'role_component',
	  template: __webpack_require__(41),
	  props: ['roles'],
	  data: function() {
	    return {
	      rm_text: ''
	    };
	  },
	  attached: function() {
	    var i, len, ref, results, role;
	    $('.ui.dropdown').dropdown();
	    ref = this.roles;
	    results = [];
	    for (i = 0, len = ref.length; i < len; i++) {
	      role = ref[i];
	      if (!(role.child && role.child.length > 0)) {
	        results.push(role.show = false);
	      } else {
	        results.push(void 0);
	      }
	    }
	    return results;
	  },
	  methods: {
	    showChild: function(role) {
	      if (role.child && role.child.length > 0) {
	        return role.show = !role.show;
	      }
	    },
	    edit_role: function(role) {
	      return this.$dispatch('edit_role', role);
	    },
	    add_role: function(role) {
	      return this.$dispatch('add_role', role);
	    },
	    rm_role: function(role) {
	      return this.$dispatch('rm_role', role);
	    }
	  }
	});


/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(40);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(4)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/less-loader/index.js!./style.less", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/less-loader/index.js!./style.less");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, "", ""]);

	// exports


/***/ },
/* 41 */
/***/ function(module, exports) {

	module.exports = "<div class=\"ui list\">\n\t<div v-for=\"role in roles\" class=\"item\">\n\t\t<i class=\"folder open icon\" v-bind:class=\"{ 'open': role.show}\" @click=\"showChild(role)\"></i>\n\t\t<div class=\"content\">\n\t\t\t<div class=\"header\">(% role.role_name %)\n\t\t\t\t<i class=\"edit icon\" style=\"margin-left: 10px\" @click=\"edit_role(role)\"></i>\n\t\t\t\t<i class=\"add circle icon\" @click=\"add_role(role)\"></i>\n\t\t\t\t<div class=\"ui left pointing dropdown link item\">\n\t\t\t\t\t<i class=\"remove circle icon\"></i>\n\t\t\t\t\t<div class=\"menu\">\n\t\t\t\t\t\t<button class=\"item\" style=\"background: #FFFAF3\" @click=\"rm_role(role)\">确认删除?请谨慎操作！</button>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"description\">(% role.role_explain %)</div>\n\t\t\t<role_component :roles.sync=\"role.child\" v-if=\"role.show && role.child && role.child.length > 0\"></role_component>\n\t\t</div>\n\t</div>\n</div>";

/***/ }
/******/ ]);