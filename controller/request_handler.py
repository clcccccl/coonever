# -*- coding: utf-8 -*-
#!/usr/bin/env python

import json
import pdb
import importlib
import functools

from server_lib.base_request_handler import BaseHandler, BasicPostHandler, PostHandler
from server_lib.sys_wraps import handleError
from model.businessLayer import sys_business, base_business, sys_lib

MODEL_STR = 'model.businessLayer.'


def validationPermission(method):

    '''
    权限验证
    '''
    @functools.wraps(method)
    def wrapper(self, *args, **kwargs):
        user_id = self.get_secure_cookie("user_id")
        user = sys_lib.get_user_by_id(user_id)
        if sys_lib.validation_permission(user, self.api):
            method(self, *args, **kwargs)
        else:
            write_data = json.dumps({"response_data": {}, "error": 2, "error_text": '无权限'})
            self.write(write_data)
    return wrapper


def validationSession(method):

    '''
    在线验证
    '''
    @functools.wraps(method)
    def wrapper(self, *args, **kwargs):
        if False:
            # 不需要在线验证的情况
            method(self, *args, **kwargs)
        else:
            self.getUserFromCookie()
            self.getUser()
            if self.user:
                if method.__name__ == 'post':
                    self.request_argument['user'] = self.user
                method(self, *args, **kwargs)
            else:
                if method.__name__ == 'get':
                    self.redirect('/login')
                else:
                    write_data = json.dumps({"response_data": {}, "error": 3, "error_text": '已离线，需从新登陆'})
                    self.write(write_data)
    return wrapper


class Main(BaseHandler):
    def get(self):
        self.redirect('/home')


class Login(BaseHandler):
    def get(self):
        self.clear_cookie(name='user_id')
        self.clear_cookie(name='account')
        self.set_header("Content-Type", "text/html")
        self.render('login.html')

    def post(self):
        self.set_header("Content-Type", "application/json")
        user = sys_lib.user_login(json.loads(self.request.body))
        if len(user) > 0:
            self.set_secure_cookie("account", str(user[0].account))
            self.set_secure_cookie("user_id", str(user[0].id), expires_days=1)
        self.write(json.dumps({"response_data": user}))


class Test(BaseHandler):
    def get(self):
        self.set_header("Content-Type", "text/html")
        self.render('test.html')


class Home(BaseHandler):
    def initialize(self):
        '''
        初始化的时候获取application中的db
        '''
        pass

    @validationSession
    def get(self):
        self.set_header("Content-Type", "text/html")
        self.render('home.html')

    def getUserFromCookie(self):
        '''
        从Cookie中获取用户信息
        '''
        self.user_id = self.get_secure_cookie("user_id")
        self.account = self.get_secure_cookie("account")

    def getUser(self):
        self.user = (sys_lib.get_user_by_id(self.user_id) if self.user_id else {})


class PostHandler(PostHandler):
    '''
    用户业务操作，需要在线验证
    调用相应业务接口
    '''

    @handleError
    @validationSession
    @validationPermission
    def post(self):
        '''
        获取参数
        根据请求类型，调用相应业务层函数处理
        返回数据
        请求参数规则
            request_type:模块类别＋请求类别
            request_argument:请求参数
            request_data:请求中带list数据放这里
        返回数据规则
            response_data:
                ...内容随意
            error: 0\1\2 0正常，1出错， 2无权限
            error_text: 错误内容
        '''
        self.set_header("Content-Type", "application/json")
        mod = importlib.import_module(self.request_model)
        response_data = getattr(mod, self.api)(self.request_argument)
        write_data = json.dumps({"response_data": response_data, "error": 0, "error_text": ''})
        self.write(write_data)

    def getUser(self):
        self.user = (sys_lib.get_user_by_id(self.user_id) if self.user_id else {})

    def getModel(self):
        self.request_model = sys_lib.get_modle_by_api(self.api)


if __name__ == "__main__":
    pass
