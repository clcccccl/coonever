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
        self.session = None
        self.request_argument = {}
        self.api = None
        self.api_data = {}
        self.request_model = None
        self.need_validation_session = True
        self.need_validation_permission = True
        self.request_map = {}
        self.request_data = []
        self.getRequestArgument()
        self.test_need_validation()
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
        self.session = self.get_secure_cookie("session")

    def getModel(self):
        pass

    def test_need_validation(self):
        pass


class FileUploadCl(BaseHandler):
    '''
    文件上传相关API
    '''
    def post(self):
        '''
        新增文件
        '''
        self.set_header("Content-Type", "application/json")
        key = self.get_argument("key")
        if self.request.files:
            for i in self.request.files:
                fd = self.request.files[i]
                for f in fd:
                    file_name = f.get("filename")
                    file_body = f["body"]
                    md5.update(file_body)
                    file_hash = md5.hexdigest()
                    file_path = "static/uploaded_files/%s.%s" % (file_hash, file_name)
                    img = open(file_path, 'w')
                    img.write(file_body)
                    img.close()
                    file_id = self.pg.db.insert("uploaded_files_bz", key=key, file_name=file_name, path='/' + file_path)
        self.write(json.dumps({'error': '0', 'id': file_id}))


class remove_exist_file(BaseHandler):

    '''
    create by bigzhu at 15/09/11 17:38:32 删除某个文件
    '''
    def post(self):
        '''
        新增文件
        '''
        self.set_header("Content-Type", "application/json")
        data = json.loads(self.request.body)
        id = data.get('id')
        count = self.pg.db.update('uploaded_files_bz', where="id=%s" % id, is_delete=1)
        if count != 1:
            raise Exception('id=%s, count=%' % (id, count))
        self.write(json.dumps({'error': '0'}, cls=public_bz.ExtEncoder))


class get_exist_files(BaseHandler):

    '''
    create by bigzhu at 15/09/11 12:41:52 取文件列表
    '''
    def post(self):
        '''
        新增文件
        '''
        self.set_header("Content-Type", "application/json")
        data = json.loads(self.request.body)
        key = data.get('key')
        files = list(self.pg.db.select('uploaded_files_bz', where="key='%s' and (is_delete=0 or is_delete is null)" % key))
        self.write(json.dumps({'error': '0', 'files': files}, cls=public_bz.ExtEncoder))


if __name__ == '__main__':
    pass
