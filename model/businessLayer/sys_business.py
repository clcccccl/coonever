# -*- coding: utf-8 -*-
#!/usr/bin/env python

'''
系统管理业务
只处理业务流程，和数据处理
数据库操作交给dbImpl
create by chenli at 16/01/07 11:37
'''

import pdb

import tools

from dbImpl import sys_business_impl


'''
用户管理－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－
'''


def get_users(parm):
    '''
    获取系统内的用户
    '''
    return sys_business_impl.get_users(parm.get('request_map'))


def new_user(parm):
    '''
    新增用户
    '''
    request_map = parm.get('request_map')
    user = {'name': request_map.get('name'), 'account': request_map.get('account'), 'password': request_map.get('password')}
    sys_business_impl.add_user(user)


def edit_user(parm):
    '''
    用户信息更新
    '''
    request_map = parm.get('request_map')
    user = {'name': request_map.get('name'), 'account': request_map.get('account'), 'password': request_map.get('password')}
    sys_business_impl.update_user(user)


def change_user_role(parm):
    '''
    更新用户对应角色
    '''
    request_map = parm.get('request_map')
    user_account = request_map.get('account')
    roles = request_map.get('roles')
    #删除原对应角色
    sys_business_impl.delete_user_role(user_account=user_account)
    #新增用户对应角色
    sys_business_impl.add_user_role(user_account, roles)


'''
角色管理－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－
'''


def save_role(pam):
    '''
    角色增删改
    '''
    request_map = pam.get('request_map')
    if request_map.get('id'):
        sys_business_impl.update_role(request_map)
        if request_map.get('status') == 1:
            sys_business_impl.delete_user_role(role_code=request_map['role_code'])
    else:
        sys_business_impl.add_role(request_map)


def get_roles_tree(parm):
    '''
    获取角色树
    create by chenli at 16/01/07 11:37
    '''
    roles = sys_business_impl.get_roles()
    for role in roles:
        role['show'] = True
    return tools.listToTree(roles, 'parent_role_code', 'role_code')


def get_roles(parm):
    '''
    获取角色列表
    create by chenli at 16/01/07 11:37
    '''
    return sys_business_impl.get_roles()


'''
业务管理－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－
'''


def get_businesses_tree(parm):
    '''
    获取业务树
    '''
    businesses = sys_business_impl.get_businesses()
    for business in businesses:
        business['show'] = True
    return tools.listToTree(businesses, 'parent_business_code', 'business_code')


def save_business(pam):
    '''
    业务的增删改
    '''
    request_map = pam.get('request_map')
    if request_map.get('id'):
        sys_business_impl.update_business(request_map)
        if request_map.get('status') == 1:
            sys_business_impl.delete_role_business(request_map['business_code'])
    else:
        sys_business_impl.add_business(request_map)

'''
API管理－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－
'''


def get_apis(parm):
    '''
    获取系统内的api
    '''
    return sys_business_impl.get_apis(parm.get('request_map'))


def edit_api(parm):
    '''
    编辑api
    '''
    request_map = parm.get('request_map')
    api = {'api': request_map['api']}
    if isinstance(request_map['disable'], bool):
        api['disable'] = 1 if request_map['disable'] else 0
    if isinstance(request_map['restrict'], bool):
        api['restrict'] = 1 if request_map['restrict'] else 0
    sys_business_impl.update_api(api)
