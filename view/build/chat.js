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

	var component_chat;

	component_chat = Vue.extend({
	  template: __webpack_require__(19),
	  data: function() {
	    return {
	      socket: null,
	      message: ''
	    };
	  },
	  attached: function() {
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

	Vue.component('chat', component_chat);


/***/ },

/***/ 19:
/***/ function(module, exports) {

	module.exports = "<div class=\"ui main text container\" style=\"min-height: 100%;padding-top: 20px;\">\n<div class=\"ui comments\">\n  <h3 class=\"ui dividing header\">聊天</h3>\n  <div class=\"ui reply form\">\n    <div class=\"field\">\n      <input  @keyup.enter=\"newmessage\" v-model=\"message\"></input>\n    </div>\n  </div>\n  <div class=\"comment\">\n    <a class=\"avatar\">\n      <img src=\"/static/static/userfile/image/chenli.png\">\n    </a>\n    <div class=\"content\">\n      <a class=\"author\">马特</a>\n      <div class=\"metadata\">\n        <span class=\"date\">在今天5:42pm</span>\n      </div>\n      <div class=\"text\">\n        怎样的艺术！\n      </div>\n    </div>\n  </div>\n  <div class=\"comment\">\n    <a class=\"avatar\">\n      <img src=\"/static/static/userfile/image/chenli.png\">\n    </a>\n    <div class=\"content\">\n      <a class=\"author\">埃利奥特付</a>\n      <div class=\"metadata\">\n        <span class=\"date\">在昨天12:30am</span>\n      </div>\n      <div class=\"text\">\n        <p>这对我的调查非常有用。感谢！</p>\n      </div>\n    </div>\n  </div>\n  <div class=\"comment\">\n    <a class=\"avatar\">\n      <img src=\"/static/static/userfile/image/chenli.png\">\n    </a>\n    <div class=\"content\">\n      <a class=\"author\">乔亨德森</a>\n      <div class=\"metadata\">\n        <span class=\"date\">5天前</span>\n      </div>\n      <div class=\"text\">\n        老兄，这是可怕的。太感谢了！\n      </div>\n    </div>\n  </div>\n</div>\n</div>";

/***/ }

/******/ });