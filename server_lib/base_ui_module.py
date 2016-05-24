#!/usr/bin/env python
# -*- coding: utf-8 -*-
from tornado.web import UIModule

JS_PATH = "/Users/chenli/dream/coonever/view/uiModule/build/"
HTML_PATH = "/Users/chenli/dream/coonever/view/uiModule/"


class MyUIModule(UIModule):

    def __init__(self, handler):
        UIModule.__init__(self, handler)
        self.class_name = self.__class__.__name__
        self.js_name = JS_PATH + self.class_name + '.js'
        self.html_name = HTML_PATH + self.class_name + '.html'
        self.css_name = HTML_PATH + self.class_name + '.css'

    def embedded_css(self):
        return self.render_string(self.css_name)

    def embedded_javascript(self):
        return self.render_string(self.js_name)

    def render(self):
        return self.render_string(self.html_name)


class JTUIModule(UIModule):

    def __init__(self, handler):
        UIModule.__init__(self, handler)
        self.class_name = self.__class__.__name__
        self.js_name = JS_PATH + self.class_name + '.js'
        self.html_name = HTML_PATH + self.class_name + '.html'

    def embedded_javascript(self):
        return self.render_string(self.js_name)

    def render(self):
        return self.render_string(self.html_name)


class TmpUIModule(UIModule):

    def __init__(self, handler):
        UIModule.__init__(self, handler)
        self.class_name = self.__class__.__name__
        self.html_name = HTML_PATH + self.class_name + '.html'

    def render(self):
        return self.render_string(self.html_name)
