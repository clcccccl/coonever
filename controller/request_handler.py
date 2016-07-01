# -*- coding: utf-8 -*-
#!/usr/bin/env python

import json
import pdb
import importlib
import functools

from base_request_handler import BaseHandler, BasicPostHandler, PostHandler, FileUploadCl
from sys_wraps import handleError
from model.businessLayer import sys_business, base_business, sys_lib


def validationSessionHome(method):

    '''
    主页请求在线验证
    '''
    @functools.wraps(method)
    def wrapper(self, *args, **kwargs):
        self.getSessionFromCookie()
        if sys_lib.validation_session(self.session):
            method(self, *args, **kwargs)
        else:
            self.redirect('/login')
    return wrapper


def validationSession(method):

    '''
    统一post请求在线验证
    '''
    @functools.wraps(method)
    def wrapper(self, *args, **kwargs):
        # 判断api是否需要在线验证
        if self.need_validation_session:
            self.getUserFromCookie()
            self.getUser()
            if sys_lib.validation_session(self.session):
                self.request_argument['user'] = self.user
                method(self, *args, **kwargs)
            else:
                write_data = json.dumps({"response_data": {}, "error": 3, "error_text": '已离线，需从新登陆'})
                self.write(write_data)
        else:
            method(self, *args, **kwargs)
    return wrapper


def validationPermission(method):

    '''
    权限验证
    '''
    @functools.wraps(method)
    def wrapper(self, *args, **kwargs):
        if self.need_validation_permission:
            if sys_lib.validation_permission(self.user, self.api):
                method(self, *args, **kwargs)
            else:
                write_data = json.dumps({"response_data": {}, "error": 2, "error_text": '无权限'})
                self.write(write_data)
        else:
            method(self, *args, **kwargs)
    return wrapper


class Main(BaseHandler):
    def get(self):
        self.redirect('/home')


class Login(BaseHandler):
    def get(self):
        self.set_header("Content-Type", "text/html")
        session = self.get_secure_cookie("session")
        if session:
            sys_lib.clear_session(session)
        self.clear_cookie(name='user_id')
        self.clear_cookie(name='account')
        self.clear_cookie(name='session')
        self.render('login.html')

    @handleError
    def post(self):
        self.set_header("Content-Type", "application/json")
        user, session = sys_lib.user_login(json.loads(self.request.body))
        if len(user) > 0:
            self.set_secure_cookie("session", session)
            self.set_secure_cookie("account", str(user[0].account))
            self.set_secure_cookie("user_id", str(user[0].id), expires_days=1)
        self.write(json.dumps({"response_data": user, "error": 0 if user else 1, "error_text": '' if user else '帐号活着密码错误'}))

    @handleError
    def put(self):
        self.set_header("Content-Type", "application/json")
        user, session = sys_lib.user_register(json.loads(self.request.body))
        if len(user) > 0:
            self.set_secure_cookie("session", session)
            self.set_secure_cookie("account", str(user[0].account))
            self.set_secure_cookie("user_id", str(user[0].id), expires_days=1)
        self.write(json.dumps({"response_data": user, "error": 0 if user else 1, "error_text": '' if user else '帐号活着密码错误'}))


class Test(BaseHandler):
    def get(self):
        self.set_header("Content-Type", "text/html")
        self.render('test.html')


class Home(BaseHandler):
    @validationSessionHome
    def get(self):
        self.set_header("Content-Type", "text/html")
        self.render('home.html')

    def getSessionFromCookie(self):
        '''
        从Cookie中获取用户信息
        '''
        self.session = self.get_secure_cookie("session")


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
            request_type:请求类别
            request_argument:请求参数
            request_data:请求中带list数据放这里
        返回数据规则
            response_data:
                datas:[] list数据
                data: {} map数据
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
        if self.api_data:
            self.request_model = self.api_data['path']
        else:
            self.request_model = sys_lib.get_modle_by_api(self.api)

    def test_need_validation(self):
        self.api_data, self.need_validation_session, self.need_validation_permission = sys_lib.test_need_validation(self.api)


class FileUpload(BaseHandler):
    '''
    文件上传相关API
    '''
    def post(self):
        '''
        新增文件
        '''
        self.set_header("Content-Type", "application/json")
        if self.request.files and self.request.files['file']:
            file = self.request.files['file'][0]
            file_data = {}
            file_data['file_size'] = int(self.get_argument("size"))
            file_data['file_type'] = self.get_argument("file_type")
            file_data['file_name'] = file['filename']
            file_data['file_suffix'] = self.get_argument("file_suffix")
            if file_data['file_type'] == 'user_head':
                file_data['path'] = "view/static/userfile/image/"
            else:
                file_data['path'] = "view/static/userfile/other/"
            file_data = sys_lib.add_file(file_data)
            open_file = open(file_data['path'], 'w')
            open_file.write(file["body"])
            open_file.close()
            self.write(json.dumps({'error': '0', 'data': file_data}))
        else:
            self.write(json.dumps({'error': '1', 'data': {}}))

if __name__ == "__main__":
    pass
