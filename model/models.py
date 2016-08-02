# -*- coding: utf-8 -*-
#!/usr/bin/env python

import datetime
from peewee import *
from psycopg2 import IntegrityError

from db_base import pg_base, pg_update


class Role(pg_base.BaseTable):
    """
    角色表
    最高角色为super，其余角色都是都是其子孙角色
    """
    role_code = CharField(max_length=30, unique=True, null=True)  # 角色编码
    role_name = CharField(max_length=30, null=True)  # 角色名
    role_explain = TextField(null=True)  # 角色描述
    role_type = CharField(max_length=10, null=False)  # 角色类型(root系统固定角色，custom自定义角色，用户必须属于自定义角色)
    seq_code = CharField(max_length=200, null=False)  # 角色编码seq,中间用‘.’相隔
    parent_role_code = CharField(max_length=30, null=False)  # 父角色code（super为'None'）


class Model(pg_base.BaseTable):
    """
    模块表
    系统中所有的模块
    """
    model_code = CharField(max_length=30, unique=True, null=False)  # 模块编码
    model_name = CharField(max_length=30, null=False)  # 模块名
    model_explain = TextField(null=True)  # 模块描述
    model_level = IntegerField(null=False)  # 模块级别(0可用，1不可用)
    model_class = CharField(max_length=50, null=True)  # 相应UI model class的名称
    is_ui_model = BooleanField(null=False)  # 是否为ui_model（是，则model_class必须有值）
    parent_model_code = CharField(max_length=30, null=False)  # 父模块编码（super没有为'None'）
    seq_code = CharField(max_length=200, null=False)  # 模块编码seq,中间用‘.’相隔
    seq_name = CharField(max_length=500, null=False)  # 模块名seq,中间用‘/./’相隔


class Api(pg_base.BaseTable):
    '''
    api
    '''
    path = TextField(null=True)  # 所在目录
    api = CharField(max_length=30, unique=True, null=False)  # api
    restrict = IntegerField(null=False)  # 是否需要权限验证
    session = IntegerField(null=False)  # 是否需要在线验证
    disable = IntegerField(null=False)  # 是否弃用
    error = IntegerField(default=0)  # 报错数
    api_explain = TextField(null=True)  # API描述


class Business_Api(pg_base.BaseTable):
    '''
    业务api对应关系
    '''
    api = CharField(max_length=30, null=False)  # api
    business_code = CharField(max_length=30, null=False)  # 业务编码


class Role_Model(pg_base.BaseTable):
    """
    角色模块对应模块表
    限制可以给角色配置的模块
    """
    role_code = CharField(max_length=30, null=False)  # 角色码（Role.role_code）
    model_code = CharField(max_length=30, null=False)  # 模块编码（Model.model_code）


class Business(pg_base.BaseTable):
    """
    业务表
    系统中所有的业务
    """
    business_code = CharField(max_length=30, unique=True, null=False)  # 业务码（对应post.request_type）
    business_name = CharField(max_length=30, null=True)  # 业务名
    business_explain = TextField(null=True)  # 业务描述
    parent_business_code = CharField(max_length=30, null=False)  # 父亲业务码（对应post.request_type）
    component = TextField(null=True)  # 业务对应component名，叶子节点才有
    icon = TextField(null=True)  # 菜单对应图标，叶子节点才有
    is_leaf = IntegerField(null=False)  # 是否为叶子节点(0不是，1是)
    seq_code = TextField(null=False)  # seq_code


class Role_Business(pg_base.BaseTable):
    """
    模块业务对应表
    一个模块下有多个业务
    从而限制角色可选业务
    """
    role_code = CharField(max_length=30, null=False)  # 模块编码（Model.model_code）
    business_code = CharField(max_length=30, null=False)  # 业务码（Business.business_code）


class Model_Business(pg_base.BaseTable):
    """
    模块业务对应表
    一个模块下有多个业务
    从而限制角色可选业务
    """
    model_code = CharField(max_length=30, null=False)  # 模块编码（Model.model_code）
    business_code = CharField(max_length=30, null=False)  # 业务码（Business.business_code）


class User_Role(pg_base.BaseTable):
    """
    用户角色对应表
    同一用户可拥有多种角色，从而限制去可选模块和业务
    """
    account = CharField(max_length=30, null=False)  # 模块编码（User.account）
    role_code = CharField(max_length=30, null=False)  # 角色码（Role.role_code）


class User_Model(pg_base.BaseTable):
    """
    用户模块对应表
    用户所拥有的模块
    用于用户登录后模块筛选
    若所选model不是ui_model，则用户拥有该model下的所有model
    """
    account = CharField(max_length=30, null=False)  # 模块编码（User.account）
    role_code = CharField(max_length=30, null=False)  # 角色码（Role.role_code）


class User_Business(pg_base.BaseTable):
    """
    用户业务对应表
    用户所拥有的业务
    用于权限控制
    """
    account = CharField(max_length=30, null=False)  # 模块编码（User.account）
    business_code = CharField(max_length=30, null=False)  # 业务码（Business.business_code）


class User_info(pg_base.BaseTable):
    """
    用户表
    """
    name = CharField(max_length=30, null=False)  # 姓名
    account = CharField(max_length=30, unique=True, null=False)  # 账号
    password = CharField(max_length=30, null=False)  # 密码


class User_detail(pg_base.BaseTable):
    """
    用户详细信息表
    """
    account = CharField(max_length=30, unique=True, null=False)  # 账号
    head_file = TextField(null=True)  # 头像地址
    motto = TextField(null=True)  # 格言


class Session(pg_base.BaseTable):
    """
    在线表
    """
    account = CharField(max_length=30, null=False)  # 账号
    session = CharField(max_length=40, unique=True, null=False)  # session
    invalid_time = DateTimeField(null=False)  # 失效时间


class File(pg_base.BaseTable):
    '''
    文件表
    '''
    path = TextField(null=True)  # 文件路径
    file_name = TextField(null=True)  # 文件名
    file_type = TextField(null=True)  # 文件类型
    file_suffix = TextField(null=True)  # 文件后缀
    exist = IntegerField(null=False)  # 是否存在(0不存在，1存在)
    file_size = IntegerField(null=False)  # 文件大小


class Message(pg_base.BaseTable):
    '''
    消息表
    '''
    message = TextField(null=True)  # 消息内容
    message_type = TextField(null=True)  # 消息类型
    send_type = TextField(null=True)  # 发送者 user,sys
    send_value = TextField(null=True)  # 发送者 user为account，sys 为 super
    receive_type = TextField(null=True)  # 接收者 user, role, all
    receive_value = TextField(null=True)  # 接收者 user为account, role 为role_code，all为super
    finish = IntegerField(null=True)  # 消息是否已完成


class Message_Send_Record(pg_base.BaseTable):
    '''
    消息发送记录表
    消息发送成功后将数据移至Message_Send_Record_His表
    '''
    message_id = IntegerField(null=False)  # message_id
    send_status = IntegerField(null=True)  # 发送状态
    receive_account = CharField(max_length=30, null=False)  # 接收者账号


class Message_Send_Record_His(pg_base.BaseTable):
    '''
    消息发送记录历史
    '''
    message_id = IntegerField(null=False)  # message_id
    send_status = IntegerField(null=True)  # 发送状态
    receive_account = CharField(max_length=30, null=False)  # 接收者账号


def forciblyCreateAllTable():
    pg_update.forciblyCreateTable(Role)
    pg_update.forciblyCreateTable(Model)
    pg_update.forciblyCreateTable(Role_Model)
    pg_update.forciblyCreateTable(Business)
    pg_update.forciblyCreateTable(Api)
    pg_update.forciblyCreateTable(Business_Api)
    pg_update.forciblyCreateTable(Model_Business)
    pg_update.forciblyCreateTable(User_Role)
    pg_update.forciblyCreateTable(User_Model)
    pg_update.forciblyCreateTable(User_Business)
    pg_update.forciblyCreateTable(User_info)
    pg_update.forciblyCreateTable(Role_Business)
    pg_update.forciblyCreateTable(File)


def initializeDb():
    forciblyCreateAllTable()
    data = pg_update.insertOne("user_info", {'name': '陈力', "account": 'chenli', 'password': "cl212037"})
    data = pg_update.insertOne("role", {'role_code': 'root', "role_name": 'root', 'role_explain': "超级用户，拥有系统中所有的模块和权限",
                               'role_type': 'root', 'seq_code': 'root', 'parent_role_code': 'None'})
    data = pg_update.insertOne("role", {'role_code': 'user_root', "role_name": '超级用户', 'role_explain': "超级用户，拥有系统中所有用户相关的模块和权限",
                               'role_type': 'root', 'seq_code': 'root.user_root', 'parent_role_code': 'root'})
    data = pg_update.insertOne("role", {'role_code': 'sys_root', "role_name": '超级管理员', 'role_explain': "超级管理员，拥有系统中所有系统相关的模块和权限",
                               'role_type': 'root', 'seq_code': 'root.sys_root', 'parent_role_code': 'root'})
    data = pg_update.insertOne("role", {'role_code': 'sys_manage', "role_name": '系统管理员', 'role_explain': "管理系统系统业务",
                               'role_type': 'norm', 'seq_code': 'root.sys_root.sys_manage', 'parent_role_code': 'sys_root'})

    data = pg_update.insertOne("user_role", {'role_code': 'sys_manage', "account": 'chenli'})

    data = pg_update.insertOne("business", {'business_code': 'top', "business_name": '顶层业务', 'business_explain': "系统顶层业务，其它业务都是其子孙业务",
                               'parent_business_code': 'None', 'is_leaf': 0, 'seq_code': 'top'})
    data = pg_update.insertOne("business", {'business_code': 'sys', "business_name": '系统业务', 'business_explain': "包括所有系统管理的业务",
                               'parent_business_code': 'top', 'is_leaf': 0, 'seq_code': 'top.sys'})
    data = pg_update.insertOne("business", {'business_code': 'sys_base_deploy', "business_name": '基础配置', 'business_explain': "系统基础数据的更新（单表）",
                               'parent_business_code': 'sys', 'is_leaf': 0, 'seq_code': 'top.sys.sys_base_deploy'})
    data = pg_update.insertOne("business", {'business_code': 'user_management', "business_name": '用户管理', 'business_explain': "用户管理",
                               'parent_business_code': 'sys_base_deploy', 'is_leaf': 1, 'component': 'user_management', 'icon': 'users', 'seq_code': 'top.sys.sys_base_deploy.user_management'})
    data = pg_update.insertOne("business", {'business_code': 'role_management', "business_name": '角色管理', 'business_explain': "角色管理",
                               'parent_business_code': 'sys_base_deploy', 'is_leaf': 1, 'component': 'role_management', 'icon': 'spy', 'seq_code': 'top.sys.sys_base_deploy.role_management'})
    data = pg_update.insertOne("business", {'business_code': 'business_management', "business_name": '业务管理', 'business_explain': "业务管理",
                               'parent_business_code': 'sys_base_deploy', 'is_leaf': 1, 'component': 'business_management', 'icon': 'users', 'seq_code': 'top.sys.sys_base_deploy.business_management'})
    data = pg_update.insertOne("business", {'business_code': 'api_management', "business_name": 'API管理', 'business_explain': "API管理",
                               'parent_business_code': 'sys_base_deploy', 'is_leaf': 1, 'component': 'api_management', 'icon': 'users', 'seq_code': 'top.sys.sys_base_deploy.api_management'})

    data = pg_update.insertOne("role_business", {'role_code': 'root', "business_code": 'top'})
    data = pg_update.insertOne("role_business", {'role_code': 'sys_root', "business_code": 'sys'})
    data = pg_update.insertOne("role_business", {'role_code': 'sys_manage', "business_code": 'sys_base_deploy'})

    data = pg_update.insertOne("business_api", {'api': 'get_businesses_tree', 'business_code': 'business_management'})
    data = pg_update.insertOne("business_api", {'api': 'save_business', 'business_code': 'business_management'})
    data = pg_update.insertOne("business_api", {'api': 'get_roles', 'business_code': 'role_management'})
    data = pg_update.insertOne("business_api", {'api': 'get_roles_tree', 'business_code': 'role_management'})
    data = pg_update.insertOne("business_api", {'api': 'save_role', 'business_code': 'role_management'})
    data = pg_update.insertOne("business_api", {'api': 'change_user_role', 'business_code': 'user_management'})
    data = pg_update.insertOne("business_api", {'api': 'edit_user', 'business_code': 'user_management'})
    data = pg_update.insertOne("business_api", {'api': 'new_user', 'business_code': 'user_management'})
    data = pg_update.insertOne("business_api", {'api': 'get_users', 'business_code': 'user_management'})
    data = pg_update.insertOne("business_api", {'api': 'edit_api', 'business_code': 'user_management'})
    data = pg_update.insertOne("business_api", {'api': 'get_apis', 'business_code': 'user_management'})


if __name__ == "__main__":
    '''
    null=False,为空时发出警告，但是数据还是存进去了
    unique=True，不唯一时直接报错，数据没有存进去
    首先在程序中加限制，其次在插入数据时可以捕获异常来处理
    '''
    # initializeDb()
    pg_update.forciblyCreateTable(Message)
    pg_update.forciblyCreateTable(Message_Send_Record)
    pg_update.forciblyCreateTable(Message_Send_Record_His)
    pass
