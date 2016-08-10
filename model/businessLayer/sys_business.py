# -*- coding: utf-8 -*-
#!/usr/bin/env python

'''
系统管理业务
只处理业务流程，和数据处理
数据库操作交给dbImpl
create by chenli at 16/01/07 11:37
'''

import pdb
import math

import tools

from sys_wraps import CooError
from dbImpl.user import User, UserRole, Role, Business, RoleBusiness, Api, BusinessApi


'''
用户管理－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－
'''


def get_users(parm):
    '''
    获取系统内的用户
    '''
    limit = 10
    parm = parm.get('request_map')
    result = {}
    page = parm['page']
    search_key = parm['search_key']
    offset = (int(page) - 1) * limit
    where = ("status = 0 and name like '%%%s%%' " % search_key if search_key and search_key != '' else " status = 0 ")
    users = User.get_users(offset, limit, where)
    user_roles = UserRole.get_roles_by_accounts([user['account'] for user in users])
    for user in users:
        user['roles'] = []
        user['role'] = ''
        for user_role in user_roles:
            if user_role['account'] == user['account']:
                user['role'] += (user_role['role_name'] + ' ')
                user['roles'].append(user_role)
    count = User.users_count(where)
    page_count = int(math.ceil(float(count) / limit))
    result['datas'] = users
    result['page_count'] = page_count
    return result


def new_user(parm):
    '''
    新增用户
    '''
    request_map = parm.get('request_map')
    user = User(name=request_map.get('name'), account=request_map.get('account'), password=request_map.get('password'))
    user.add_user()


def edit_user(parm):
    '''
    用户信息更新
    '''
    request_map = parm.get('request_map')
    user = User(name=request_map.get('name'), account=request_map.get('account'), password=request_map.get('password'))
    user.update_user()


def change_user_role(parm):
    '''
    更新用户对应角色
    '''
    request_map = parm.get('request_map')
    user_account = request_map.get('account')
    roles = request_map.get('roles')
    #删除原对应角色
    UserRole.delete_role_by_account(user_account)
    #新增用户对应角色
    UserRole.add_user_role(user_account, roles)


def del_user(parm):
    '''
    删除用户
    '''
    request_map = parm.get('request_map')
    account = request_map.get('account')
    User.del_user_by_account(account)


'''
角色管理－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－
'''


def save_role(pam):
    '''
    角色增删改
    '''
    request_map = pam.get('request_map')
    if request_map.get('id'):
        Role.update_role(request_map)
        if request_map.get('status') == 1:
            UserRole.delete_role_by_role_code(request_map['role_code'])
    else:
        Role.add_role(request_map)


def get_roles_tree(parm):
    '''
    获取角色树
    create by chenli at 16/01/07 11:37
    '''
    roles = Role.get_roles()
    for role in roles:
        role['show'] = True
    data = {'datas': tools.listToTree(roles, 'parent_role_code', 'role_code')}
    return data


def get_roles(parm):
    '''
    获取角色列表
    create by chenli at 16/01/07 11:37
    '''
    return Role.get_roles()


'''
业务管理－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－
'''


def get_businesses_tree(parm):
    '''
    获取业务树
    '''
    businesses = Business.get_businesses()
    for business in businesses:
        business['show'] = True
    return {'datas': tools.listToTree(businesses, 'parent_business_code', 'business_code')}


def get_role_businesses_tree(parm):
    '''
    根据角色获取业务树
    '''
    role_code = parm.get('request_map').get('role_code')
    businesses = RoleBusiness.get_businesses_by_role(role_code)
    role_business = RoleBusiness.get_businesses_by_roles([{'role_code': role_code}])
    role_business = [business_code['business_code'] for business_code in role_business]
    for business in businesses:
        business['checked'] = True if business['business_code'] in role_business else False
    return {'datas': tools.listToTree(businesses, 'parent_business_code', 'business_code')}


def get_business_by_api(parm):
    '''
    根据api获取可拥有api的业务
    '''
    api = parm.get('request_map').get('api')
    businesses = Business.get_component_businesses()
    business_api = BusinessApi.get_businesses_by_api(api)
    business_api = [business_code['business_code'] for business_code in business_api]
    for business in businesses:
        business['checked'] = True if business['business_code'] in business_api else False
    return {'datas': businesses}


def save_business(parm):
    '''
    业务的增删改
    '''
    request_map = parm.get('request_map')
    if request_map.get('id'):
        Business.update_business(request_map)
        if request_map.get('status') == 1:
            RoleBusiness.delete_role_business_by_business_code(request_map['business_code'])
    else:
        Business.add_business(request_map)


def save_role_business(parm):
    '''
    修改角色的业务
    '''
    request_map = parm.get('request_map')
    checked = request_map.get('checked')
    if checked:
        RoleBusiness.add_role_business(request_map.get('role_code'), request_map.get('business_code'))
    else:
        RoleBusiness.delete_role_business(request_map.get('role_code'), request_map.get('business_code'))
    return {}

'''
API管理－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－
'''


def get_apis(parm):
    '''
    获取系统内的api
    '''
    return Api.get_apis(parm.get('request_map'))


def edit_api(parm):
    '''
    编辑api
    '''
    request_map = parm.get('request_map')
    api = {'api': request_map['api']}
    if isinstance(request_map['session'], bool):
        api['session'] = 1 if request_map['session'] else 0
    if isinstance(request_map['restrict'], bool):
        api['restrict'] = 1 if request_map['restrict'] else 0
    Api.update_api(api)


def save_business_api(parm):
    '''
    修改业务api
    '''
    request_map = parm.get('request_map')
    checked = request_map.get('checked')
    if checked:
        BusinessApi.add_business_api(request_map.get('business_code'), request_map.get('api'))
    else:
        BusinessApi.delete_business_api(request_map.get('business_code'), request_map.get('api'))
    return {}
