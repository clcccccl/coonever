# -*- coding: utf-8 -*-
#!/usr/bin/env python

from dbImpl import sys_lib_impl

'''
系统接口
'''


def get_modle_by_api(api):
    return sys_lib_impl.get_modle_by_api(api)


def validation_permission(user, business_model):
    '''
    权限验证
    '''
    api = business_model.split('.')[-1]
    roles = user['roles']
    return sys_lib_impl.roles_business_test(roles, api)


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
