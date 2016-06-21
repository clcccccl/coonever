# -*- coding: utf-8 -*-
#!/usr/bin/env python

from dbImpl import sys_lib_impl
from sys_wraps import CooError

'''
系统接口
'''


def clear_session(session):
    sys_lib_impl.clear_session(session)

def get_modle_by_api(api):
    api = sys_lib_impl.get_api_by_api(api)
    if api:
        return api[0]['path']
    else:
        raise CooError(fun_name='get_modle_by_api', api=api, text='通过api获取模块失败')


def user_login(parm):
    '''
    用户登录
    '''
    user = parm.get('request_map')
    user = sys_lib_impl.get_user_by_ap(user)
    if not user:
        raise CooError(text='用户名或密码错误')
    session = sys_lib_impl.add_session_by_account(user[0]['account'])
    return user, session


def user_register(parm):
    '''
    用户注册
    '''
    user = parm.get('request_map')
    del user['repassword']
    sys_lib_impl.user_register(user)
    user = sys_lib_impl.get_user_by_ap(user)
    if not user:
        raise CooError(text='用户名或密码错误')
    session = sys_lib_impl.add_session_by_account(user[0]['account'])
    return user, session


def get_user_by_id(user_id):
    '''
    通过帐号和id获取用户
    '''
    return sys_lib_impl.get_user_by_id(user_id)


def test_need_validation(api):
    '''
    获取api数据，检查是否需要在线验证，是否需要权限验证
    '''
    api_datas = sys_lib_impl.get_api_by_api(api)
    if api_datas:
        api_data = api_datas[0]
        return api_data, True if api_data['session'] == 1 else False, True if api_data['restrict'] == 1 else False
    else:
        raise CooError(fun_name='test_need_validation', api=api, text='通过api测试是否需要验证失败')


def validation_session(session):
    '''
    在线验证
    '''
    sessions = sys_lib_impl.get_session_by_session(session)
    if sessions:
        sys_lib_impl.update_session(session)
        return True
    else:
        return False


def validation_permission(user, business_model):
    '''
    权限验证
    '''
    api = business_model.split('.')[-1]
    roles = user['roles']
    return sys_lib_impl.roles_business_test(roles, api)
