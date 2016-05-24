# -*- coding: utf-8 -*-
#!/usr/bin/env python

import json

from tornado.web import RequestHandler


class BaseHandler(RequestHandler):
    '''
    最底层的handler class,做最基础的操作
    '''
    def initialize(self):
        '''
        初始化的时候获取application中的db
        '''
        pass


class BasicPostHandler(BaseHandler):
    '''
    专用于Post
    该class接收处理系统大多数Post
    '''
    def initialize(self):
        '''
        初始化的时候获取请求中的参数
        '''
        self.request_argument = {}
        self.api = None
        self.request_map = {}
        self.request_data = []
        self.getRequestArgument()

    def getRequestArgument(self):
        '''
        获取post携带来的参数
        '''
        self.request_argument = json.loads(self.request.body)
        self.api = self.request_argument.get('request_type')
        self.request_map = self.request_argument.get('request_map')
        self.request_data = self.request_argument.get('request_data')

    def post(self):
        '''
        获取参数
        根据请求类型，调用相应业务层函数处理
        返回数据
        '''
        pass


class PostHandler(BaseHandler):
    '''
    专用于Post
    该class接收处理系统大多数Post
    '''
    def initialize(self):
        '''
        初始化的时候获取请求中的参数
        '''
        self.user = {}
        self.user_id = None
        self.account = None
        self.request_argument = {}
        self.api = None
        self.request_model = None
        self.request_map = {}
        self.request_data = []
        self.getRequestArgument()
        self.getModel()

    def getRequestArgument(self):
        '''
        获取post携带来的参数
        '''
        self.request_argument = json.loads(self.request.body)
        self.api = self.request_argument.get('request_type')
        self.request_map = self.request_argument.get('request_map')
        self.request_data = self.request_argument.get('request_data')

    def getUserFromCookie(self):
        '''
        从Cookie中获取用户信息
        '''
        self.user_id = self.get_secure_cookie("user_id")
        self.account = self.get_secure_cookie("account")

    def getModel(self):
        pass

if __name__ == '__main__':
    pass
