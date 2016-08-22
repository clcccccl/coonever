# -*- coding: utf-8 -*-
#!/usr/bin/env python

'''
系统基础业务
'''

from sys_wraps import CooError
from dbImpl.user import User, RoleBusiness, Business, UserDetail


def check_logged(parm):
    '''
    检查用户是否已登录
    '''
    user = parm.get('user', {})
    return {'data': user.account if user else '0'}


def get_bar_data(parm):
    '''
    获取菜单数据
    '''
    roles = parm['user']['roles']
    businesses = RoleBusiness.get_bar_data_by_roles(roles) if len(roles) > 0 else []
    for business in businesses:
        if business['is_leaf'] == 0:
            business['child'] = Business.get_child_businesses(business['business_code'])
    return {'datas': businesses}


def test_account(parm):
    '''
    验证帐号是否可用
    '''
    account = parm.get('request_map')['account']
    users = User.get_user_by_account(account)
    return len(users)


def get_user_head_file_name(parm):
    '''
    获取用户头像地址
    '''
    account = parm['user']['account']
    user_detail = UserDetail.get_user_head_file_name_by_account(account)
    file_name = user_detail[0]['head_file'] if user_detail and user_detail[0]['head_file'] else 'default.png'
    return {'data': {'file_name': file_name}}


def get_user_detail(parm):
    '''
    获取用户自己的详细信息
    '''
    account = parm['user']['account']
    user_detail = UserDetail.get_user_detail_by_account(account)
    user_detail['head_file'] = user_detail['head_file'] if user_detail['head_file'] else 'default.png'
    return {'data': user_detail}


def get_blogger_detail(parm):
    '''
    获取博主的详细信息
    '''
    account = parm['request_map']['blogger_name']
    try:
        user_detail = UserDetail.get_user_detail_by_account(account)
        user_detail['head_file'] = user_detail['head_file'] if user_detail['head_file'] else 'default.png'
    except CooError, e:
        user_detail = {}
    return {'data': user_detail}
