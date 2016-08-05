# -*- coding: utf-8 -*-
#!/usr/bin/env python

from sys_wraps import CooError

from dbImpl.user import Api, User, RoleBusiness, UserRole
from dbImpl.sys import Session, File, MessageSendRecord, Message


'''
系统接口
'''


def get_messages_by_session(session):
    session_date = Session.get_session_by_session(session)
    return MessageSendRecord.get_message_by_account(session_date[0]['account']) if session_date else []


def save_message_user_to_user(message, session, receive_account):
    session_date = Session.get_session_by_session(session)
    Message.add_message(message, 'user_user', 'user', session_date[0]['account'], 'user', receive_account)


def chang_message_status(session, message):
    pass


def add_file(file_data):
    return File.add_file(file_data)


def clear_session(session):
    Session.clear_session(session)


def get_modle_by_api(api):
    api = Api.get_api_by_api(api)
    if api:
        return api[0]['path']
    else:
        raise CooError(fun_name='get_modle_by_api', api=api, text='通过api获取模块失败')


def user_login(parm):
    '''
    用户登录
    '''
    user = parm.get('request_map')
    user = User.get_user_by_ap(user)
    if not user:
        raise CooError(text='用户名或密码错误')
    session = Session.add_session_by_account(user[0]['account'])
    return user, session


def user_register(parm):
    '''
    用户注册
    '''
    request_map = parm.get('request_map')
    user = User(name=request_map.get('name'), account=request_map.get('account'), password=request_map.get('password'))
    user.add_user()
    user = User.get_user_by_ap(user.user_map)
    if not user:
        raise CooError(text='用户名或密码错误')
    session = Session.add_session_by_account(user[0]['account'])
    return user, session


def get_user_by_account(account):
    '''
    通过帐号获取用户
    '''
    return UserRole.get_user_roles_by_account(account)


def test_need_validation(api):
    '''
    获取api数据，检查是否需要在线验证，是否需要权限验证
    '''
    api_datas = Api.get_api_by_api(api)
    if api_datas:
        api_data = api_datas[0]
        return api_data, True if api_data['session'] == 1 else False, True if api_data['restrict'] == 1 else False
    else:
        raise CooError(fun_name='test_need_validation', api=api, text='通过api测试是否需要验证失败')


def validation_session(session):
    '''
    在线验证
    '''
    sessions = Session.get_session_by_session(session)
    if sessions:
        Session.update_session(session)
        return True
    else:
        return False


def validation_permission(user, business_model):
    '''
    权限验证
    '''
    api = business_model.split('.')[-1]
    roles = user['roles']
    return RoleBusiness.roles_api_test(roles, api)
