# -*- coding: utf-8 -*-
#!/usr/bin/env python

from dbImpl import sys_lib_impl

'''
系统接口
'''


def get_modle_by_api(api):
    return sys_lib_impl.get_api_by_api(api)[0]['path']


def user_login(parm):
    '''
    用户登录
    '''
    user = parm.get('request_map')
    return sys_lib_impl.get_user_by_ap(user)


def get_user_by_id(user_id):
    '''
    通过帐号和id获取用户
    '''
    return sys_lib_impl.get_user_by_id(user_id)


def test_need_validation(api):
    '''
    获取api数据，检查是否需要在线验证，是否需要权限验证
    '''
    api_data = sys_lib_impl.get_api_by_api(api)[0]
    return True if api_data['session'] == 1 else False, True if api_data['restrict'] == 1 else False


def validation_session(user):
    '''
    在线验证
    '''
    return True if user else False


def validation_permission(user, business_model):
    '''
    权限验证
    '''
    api = business_model.split('.')[-1]
    roles = user['roles']
    return sys_lib_impl.roles_business_test(roles, api)
