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

	var component_frient;

	__webpack_require__(19);

	component_frient = Vue.extend({
	  template: __webpack_require__(21),
	  components: {
	    'chat': __webpack_require__(22),
	    'add_friend': __webpack_require__(26)
	  },
	  data: function() {
	    return {
	      friend_view: ''
	    };
	  },
	  attached: function() {
	    return this.friend_view = 'chat';
	  },
	  methods: {
	    changeFriendView: function(friend_view) {
	      return this.friend_view = friend_view;
	    }
	  }
	});

	Vue.component('friend', component_frient);


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
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(20);
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
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, ".ig_other {\n  display: block;\n  width: 2.5em;\n  height: auto;\n  float: left;\n  margin: 0.2em 0em 0em;\n}\n.ig_other img {\n  display: block;\n  margin: 0em auto;\n  width: 100%;\n  height: 100%;\n  border-radius: 0.25rem;\n}\n.name_other {\n  display: block;\n  font-size: 1em;\n  color: rgba(0, 0, 0, 0.87);\n  font-weight: bold;\n}\n.content .text {\n  font-family: 'Lato', 'Helvetica Neue', Arial, Helvetica, sans-serif;\n}\n", ""]);

	// exports


/***/ },
/* 21 */
/***/ function(module, exports) {

	module.exports = "<div class=\"ui grid main container\" style=\"min-height: 80%;padding-top: 80px;padding-left: 100px\">\n  <div class=\"four wide column\">\n    <div class=\"ui fluid category search\">\n      <div class=\"ui icon input\">\n        <input class=\"prompt\" type=\"text\" placeholder=\"Search friend...\">\n        <i class=\"search icon\"></i>\n      </div>\n      <i class=\"add large user icon\" style=\"color: #666666;padding-left: 5px;\" @click=\"changeFriendView('add_friend')\"></i>\n    </div>\n    <div class=\"ui vertical fluid tabular menu\">\n      <a class=\"item ui image label\"><img src=\"/static/static/userfile/image/chenli.png\"> <span>陈力</span> <i class=\"large talk icon\"></i></a>\n      <a class=\"active item ui image label\"><img src=\"/static/static/userfile/image/chenli.png\"> <span>陈力</span></a>\n      <a class=\"item ui image label\"><img src=\"/static/static/userfile/image/chenli.png\"> <span>陈力</span></a>\n      <a class=\"item ui image label\"><img src=\"/static/static/userfile/image/chenli.png\"> <span>陈力</span></a>\n      <a class=\"item ui image label\"><img src=\"/static/static/userfile/image/chenli.png\"> <span>陈力</span></a>\n      <a class=\"item ui image label\"><img src=\"/static/static/userfile/image/chenli.png\"> <span>陈力</span> <i class=\"large talk icon\"></i></a>\n      <a class=\"item ui image label\"><img src=\"/static/static/userfile/image/chenli.png\"> <span>陈力</span> <i class=\"large talk icon\"></i></a>\n    </div>\n  </div>\n  <div class=\"twelve wide stretched column\">\n    <component\n      :is=\"friend_view\"\n      transition=\"fade\"\n      transition-mode=\"out-in\">\n    </component>\n  </div>\n</div>\n";

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(23);

	module.exports = Vue.extend({
	  template: __webpack_require__(25),
	  data: function() {
	    return {
	      socket: null,
	      message: ''
	    };
	  },
	  attached: function() {
	    console.log('asdasdas');
	    return this.init_socket();
	  },
	  methods: {
	    init_socket: function() {
	      this.socket = null;
	      this.socket = new WebSocket("ws://127.0.0.1:8000/message_socket");
	      this.socket.onopen = function() {
	        return console.log('onopen');
	      };
	      return this.socket.onmessage = function(evt) {
	        return console.log(evt.data);
	      };
	    },
	    newmessage: function() {
	      return this.socket.send(this.message);
	    }
	  }
	});


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(24);
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
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, ".ig_other {\n  display: block;\n  width: 2.5em;\n  height: auto;\n  float: left;\n  margin: 0.2em 0em 0em;\n}\n.ig_other img {\n  display: block;\n  margin: 0em auto;\n  width: 100%;\n  height: 100%;\n  border-radius: 0.25rem;\n}\n.name_other {\n  display: block;\n  font-size: 1em;\n  color: rgba(0, 0, 0, 0.87);\n  font-weight: bold;\n}\n.content .text {\n  font-family: 'Lato', 'Helvetica Neue', Arial, Helvetica, sans-serif;\n}\n", ""]);

	// exports


/***/ },
/* 25 */
/***/ function(module, exports) {

	module.exports = "<div class=\"ui segment\">\n  <div class=\"ui comments\">\n    <h3 class=\"ui dividing header\">聊天</h3>\n    <div class=\"ui reply form\">\n      <div class=\"field\">\n        <input  @keyup.enter=\"newmessage\" v-model=\"message\"></input>\n      </div>\n    </div>\n    <div class=\"comment\">\n      <a class=\"avatar\">\n        <img src=\"/static/static/userfile/image/chenli.png\">\n      </a>\n      <div class=\"content\">\n        <a class=\"author\">马特</a>\n        <div class=\"metadata\">\n          <span class=\"date\">在今天5:42pm</span>\n        </div>\n        <div class=\"text\">\n          怎样的艺术！怎样的艺术！怎样的艺术！怎样的艺术！怎样的艺术！怎样的艺术！怎样的艺术！怎样的艺术！怎样的艺术！怎样的艺术！怎样的艺术！怎样的艺术！怎样的艺术！\n        </div>\n      </div>\n    </div>\n    <div class=\"comment\">\n      <a class=\"avatar\">\n        <img src=\"/static/static/userfile/image/chenli.png\">\n      </a>\n      <div class=\"content\">\n        <a class=\"author\">埃利奥特付</a>\n        <div class=\"metadata\">\n          <span class=\"date\">在昨天12:30am</span>\n        </div>\n        <div class=\"text\">\n          <p>这对我的调查非常有用。感谢！</p>\n        </div>\n      </div>\n    </div>\n    <div class=\"comment\">\n      <a class=\"avatar\">\n        <img src=\"/static/static/userfile/image/chenli.png\">\n      </a>\n      <div class=\"content\">\n        <a class=\"author\">乔亨德森</a>\n        <div class=\"metadata\">\n          <span class=\"date\">5天前</span>\n        </div>\n        <div class=\"text\">\n          老兄，这是可怕的。太感谢了！\n        </div>\n      </div>\n    </div>\n    <div class=\"comment\">\n      <a class=\"avatar\">\n        <img src=\"/static/static/userfile/image/chenli.png\">\n      </a>\n      <div class=\"content\">\n        <a class=\"author\">乔亨德森</a>\n        <div class=\"metadata\">\n          <span class=\"date\">5天前</span>\n        </div>\n        <div class=\"text\">\n          老兄，这是可怕的。太感谢了！\n        </div>\n      </div>\n    </div>\n    <div class=\"comment\">\n      <a class=\"avatar\">\n        <img src=\"/static/static/userfile/image/chenli.png\">\n      </a>\n      <div class=\"content\">\n        <a class=\"author\">乔亨德森</a>\n        <div class=\"metadata\">\n          <span class=\"date\">5天前</span>\n        </div>\n        <div class=\"text\">\n          老兄，这是可怕的。太感谢了！\n        </div>\n      </div>\n    </div>\n    <div class=\"comment\">\n      <a class=\"avatar\">\n        <img src=\"/static/static/userfile/image/chenli.png\">\n      </a>\n      <div class=\"content\">\n        <a class=\"author\">乔亨德森</a>\n        <div class=\"metadata\">\n          <span class=\"date\">5天前</span>\n        </div>\n        <div class=\"text\">\n          老兄，这是可怕的。太感谢了！\n        </div>\n      </div>\n    </div>\n    <div class=\"comment\">\n      <a class=\"avatar\">\n        <img src=\"/static/static/userfile/image/chenli.png\">\n      </a>\n      <div class=\"content\">\n        <a class=\"author\">乔亨德森</a>\n        <div class=\"metadata\">\n          <span class=\"date\">5天前</span>\n        </div>\n        <div class=\"text\">\n          老兄，这是可怕的。太感谢了！\n        </div>\n      </div>\n    </div>\n    <div class=\"comment\">\n      <a class=\"avatar\">\n        <img src=\"/static/static/userfile/image/chenli.png\">\n      </a>\n      <div class=\"content\">\n        <a class=\"author\">乔亨德森</a>\n        <div class=\"metadata\">\n          <span class=\"date\">5天前</span>\n        </div>\n        <div class=\"text\">\n          老兄，这是可怕的。太感谢了！\n        </div>\n      </div>\n    </div>\n    <div class=\"comment\">\n      <a class=\"avatar\">\n        <img src=\"/static/static/userfile/image/chenli.png\">\n      </a>\n      <div class=\"content\">\n        <a class=\"author\">乔亨德森</a>\n        <div class=\"metadata\">\n          <span class=\"date\">5天前</span>\n        </div>\n        <div class=\"text\">\n          老兄，这是可怕的。太感谢了！\n        </div>\n      </div>\n    </div>\n    <div class=\"comment\">\n      <a class=\"avatar\">\n        <img src=\"/static/static/userfile/image/chenli.png\">\n      </a>\n      <div class=\"content\">\n        <a class=\"author\">乔亨德森</a>\n        <div class=\"metadata\">\n          <span class=\"date\">5天前</span>\n        </div>\n        <div class=\"text\">\n          老兄，这是可怕的。太感谢了！\n        </div>\n      </div>\n    </div>\n    <div class=\"comment\">\n      <a class=\"avatar\">\n        <img src=\"/static/static/userfile/image/chenli.png\">\n      </a>\n      <div class=\"content\">\n        <a class=\"author\">乔亨德森</a>\n        <div class=\"metadata\">\n          <span class=\"date\">5天前</span>\n        </div>\n        <div class=\"text\">\n          老兄，这是可怕的。太感谢了！\n        </div>\n      </div>\n    </div>\n  </div>\n</div>";

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(27);

	module.exports = Vue.extend({
	  template: __webpack_require__(29),
	  data: function() {
	    return {
	      socket: null,
	      message: ''
	    };
	  },
	  attached: function() {
	    console.log('asdasdas');
	    return this.init_socket();
	  },
	  methods: {
	    init_socket: function() {
	      this.socket = null;
	      this.socket = new WebSocket("ws://127.0.0.1:8000/message_socket");
	      this.socket.onopen = function() {
	        return console.log('onopen');
	      };
	      return this.socket.onmessage = function(evt) {
	        return console.log(evt.data);
	      };
	    },
	    newmessage: function() {
	      return this.socket.send(this.message);
	    }
	  }
	});


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(28);
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
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, ".ig_other {\n  display: block;\n  width: 2.5em;\n  height: auto;\n  float: left;\n  margin: 0.2em 0em 0em;\n}\n.ig_other img {\n  display: block;\n  margin: 0em auto;\n  width: 100%;\n  height: 100%;\n  border-radius: 0.25rem;\n}\n.name_other {\n  display: block;\n  font-size: 1em;\n  color: rgba(0, 0, 0, 0.87);\n  font-weight: bold;\n}\n.content .text {\n  font-family: 'Lato', 'Helvetica Neue', Arial, Helvetica, sans-serif;\n}\n.ui.comments .comment:first-child {\n  padding-top: 20px;\n}\n", ""]);

	// exports


/***/ },
/* 29 */
/***/ function(module, exports) {

	module.exports = "<div class=\"ui segment\">\n  <div class=\"ui comments\">\n    <h3 class=\"ui dividing header\">世界</h3>\n    <div class=\"ui reply form\">\n      <div class=\"field\">\n        <div class=\"ui search\">\n          <div class=\"ui icon input\">\n            <input class=\"prompt\" type=\"text\" placeholder=\"输入账号或者用户名搜索\">\n            <i class=\"search icon\"></i>\n          </div>\n          <div class=\"results\"></div>\n        </div>\n      </div>\n    </div>\n    <div class=\"ui grid comments\">\n      <div class=\"comment eight wide column\">\n        <a class=\"avatar\">\n          <img src=\"/static/static/userfile/image/chenli.png\">\n        </a>\n        <div class=\"content\">\n          <a class=\"author\">埃利奥特付</a>\n          <div class=\"metadata\">\n            <span class=\"date\">在昨天12:30am</span>\n          </div>\n          <div class=\"text\">\n            <p>这对我的调查非常有用。感谢！</p>\n          </div>\n        </div>\n      </div>\n      <div class=\"comment eight wide column\">\n        <a class=\"avatar\">\n          <img src=\"/static/static/userfile/image/chenli.png\">\n        </a>\n        <div class=\"content\">\n          <a class=\"author\">马特</a>\n          <div class=\"metadata\">\n            <span class=\"date\">在今天5:42pm</span>\n          </div>\n          <div class=\"text\">\n            怎样的艺术！\n          </div>\n        </div>\n      </div>\n      \n      <div class=\"comment eight wide column\">\n        <a class=\"avatar\">\n          <img src=\"/static/static/userfile/image/chenli.png\">\n        </a>\n        <div class=\"content\">\n          <a class=\"author\">乔亨德森</a>\n          <div class=\"metadata\">\n            <span class=\"date\">5天前</span>\n          </div>\n          <div class=\"text\">\n            老兄，这是可怕的。太感谢了！\n          </div>\n        </div>\n      </div>\n      <div class=\"comment eight wide column\">\n        <a class=\"avatar\">\n          <img src=\"/static/static/userfile/image/chenli.png\">\n        </a>\n        <div class=\"content\">\n          <a class=\"author\">乔亨德森</a>\n          <div class=\"metadata\">\n            <span class=\"date\">5天前</span>\n          </div>\n          <div class=\"text\">\n            老兄，这是可怕的。太感谢了！\n          </div>\n        </div>\n      </div>\n      <div class=\"comment eight wide column\">\n        <a class=\"avatar\">\n          <img src=\"/static/static/userfile/image/chenli.png\">\n        </a>\n        <div class=\"content\">\n          <a class=\"author\">乔亨德森</a>\n          <div class=\"metadata\">\n            <span class=\"date\">5天前</span>\n          </div>\n          <div class=\"text\">\n            老兄，这是可怕的。太感谢了！\n          </div>\n        </div>\n      </div>\n      <div class=\"comment eight wide column\">\n        <a class=\"avatar\">\n          <img src=\"/static/static/userfile/image/chenli.png\">\n        </a>\n        <div class=\"content\">\n          <a class=\"author\">乔亨德森</a>\n          <div class=\"metadata\">\n            <span class=\"date\">5天前</span>\n          </div>\n          <div class=\"text\">\n            老兄，这是可怕的。太感谢了！\n          </div>\n        </div>\n      </div>\n      \n    </div>\n  </div>\n</div>";

/***/ }
/******/ ]);