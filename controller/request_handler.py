# -*- coding: utf-8 -*-
#!/usr/bin/env python

import json
import pdb
import importlib
import functools
import tornado.escape
import tornado.websocket
import time
import thread

from base_request_handler import BaseHandler, BasicPostHandler, PostHandler, FileUploadCl
from sys_wraps import handleError, MessageSocketsManager
from model.businessLayer import sys_business, base_business, sys_lib

message_sockets_manager = MessageSocketsManager()


class MessageSocketHandler(tornado.websocket.WebSocketHandler):
    i = 1

    def open(self):
        print 'open'
        # 检查在线状态
        # self.session = self.get_secure_cookie("session")
        # if sys_lib.validation_session(self.session):
        #     # 将新加的Socket链接交给MessageSocketsManager
        #     message_sockets_manager.add_socket(self)
        #     messages = sys_lib.get_messages_by_session(self.session)
        #     message_sockets_manager.send_massages(self.session, messages)
        # else:
        #     self.close()
        self.write_message('服务器socket 打开了')

    def on_message(self, message):
        print 'on_message' + message
        # # 将message保存起来
        # sys_lib.save_message_user_to_user(message, self.session, 'caimi')
        # # 获取可以发送的消息
        # message_sockets_manager.send_massages(self.session, message)
        thread.start_new_thread(self.send_msss, (message,))

    def on_close(self):
        # if self.session:
        #     message_sockets_manager.remove_socket(self.session)
        print 'on_close'

    def send_msss(self, message):
        while True:
            self.i += 1
            time.sleep(5)
            self.write_message(message + str(self.i))

    def check_origin(self, origin):
        return True

    def write_message(self, message, binary=False):
        if self.ws_connection is None:
            raise Exception()
        if isinstance(message, dict):
            message = tornado.escape.json_encode(message)
        self.ws_connection.write_message(message, binary=binary)
        # sys_lib.chang_message_status(self.session, message)

    def close(self, code=None, reason=None):
        # if self.session:
        #     message_sockets_manager.remove_socket(self.session)
        if self.ws_connection:
            self.ws_connection.close(code, reason)
            self.ws_connection = None


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
        self.getUserFromCookie()
        self.getUser()
        self.request_argument['user'] = self.user
        # 判断api是否需要在线验证
        if self.need_validation_session:
            if sys_lib.validation_session(self.session):
                method(self, *args, **kwargs)
            else:
                write_data = json.dumps({"response_data": {}, "error": 3, "error_text": '已离线，需从新登陆'})
                self.write(write_data)
        else:
            sys_lib.validation_session(self.session)
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
        self.redirect('/blog')


class Blog(BaseHandler):
    def get(self):
        self.set_header("Content-Type", "text/html")
        self.render('blog.html')


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
        self.user = (sys_lib.get_user_by_account(self.account) if self.account else {})

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
