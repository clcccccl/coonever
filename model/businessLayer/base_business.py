# -*- coding: utf-8 -*-
#!/usr/bin/env python

from dbImpl import base_business_impl

'''
系统基础业务
'''


def get_bar_data(parm):
    '''
    获取菜单数据
    '''
    roles = parm['user']['roles']
    businesses = base_business_impl.get_bar_data_by_roles(roles) if len(roles) > 0 else []
    for business in businesses:
        if business['is_leaf'] == 0:
            business['child'] = base_business_impl.get_child_businesses(business['business_code'])
    return {'datas': businesses}


def test_account(parm):
    '''
    验证帐号是否可用
    '''
    account = parm.get('request_map')['account']
    users = base_business_impl.get_user_by_account(account)
    return len(users)


def get_user_head_file_name(parm):
    '''
    获取用户头像地址
    '''
    account = parm['user']['account']
    user_detail = base_business_impl.get_user_head_file_name_by_account(account)
    file_name = user_detail[0]['head_file'] if user_detail and user_detail[0]['head_file'] else 'default.png'
    return {'data': {'file_name': file_name}}
