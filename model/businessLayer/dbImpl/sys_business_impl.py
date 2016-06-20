# -*- coding: utf-8 -*-
#!/usr/bin/env python

'''
实现系统业务的数据库操作部分
原则上制作数据库操作和数据处理
create by chenli at 16/01/07 11:37
'''

import math

from db_base import pg_update
from sys_wraps import CooError

#-------user


def get_users(parm):
    '''
    获取用户信息类别，加所属角色信息
    '''
    result = {}
    limit = 10
    page = parm['page']
    search_key = parm['search_key']
    offset = (int(page) - 1) * limit
    where = ("u.status = 0 and u.name like '%%%s%%' " % search_key if search_key and search_key != '' else " u.status = 0 ")
    sql = '''
        select u.name,u.account
          from user_info u
          where %s
          order by u.id
          limit %s
          offset %s
    ''' % (where, limit, offset)
    users = pg_update.selectBySql(sql)
    accounts_str = ''
    for user in users:
        accounts_str += "'" + user['account'] + "',"
    sql = '''
        select u_r.account,r.role_code,r.role_name
          from user_role u_r,role r
          where u_r.account in (%s)
            and u_r.role_code = r.role_code
            and u_r.status = 0
    ''' % accounts_str[:-1]
    user_roles = pg_update.selectBySql(sql)
    for user in users:
        user['roles'] = []
        user['role'] = ''
        for user_role in user_roles:
            if user_role['account'] == user['account']:
                user['role'] += (user_role['role_name'] + ' ')
                user['roles'].append(user_role)
    sql_count = '''
        select count(*)
          from user_info u
          where %s
    ''' % where
    count = pg_update.selectBySql(sql_count)[0]['count']
    page_count = int(math.ceil(float(count) / limit))
    result['datas'] = users
    result['page_count'] = page_count
    return result


def add_user(data_map):
    '''
    新增用户
    '''
    try:
        pg_update.insertOne("user_info", data_map)
    except Exception, e:
        if str(e).find('unique') != -1:
            raise CooError(text='用户已存在:' + data_map['account'])
        else:
            raise CooError(text='未知错误')


def update_user(data_map):
    '''
    用户信息更新
    '''
    pg_update.update("user_info", data_map, where=" account = '%s' " % data_map['account'])


def delete_user_role(user_account=None, role_code=None):
    '''
    删除用户所属角色
    '''
    if user_account or role_code:
        where = (" account = '%s' " % user_account if user_account else " role_code = '%s' " % role_code)
        pg_update.delete('user_role', where=where)


def add_user_role(user_account, roles):
    '''
    新增用户所属角色
    '''
    user_role_list = []
    for role in roles:
        user_role = {}
        user_role['account'] = user_account
        user_role['role_code'] = role['role_code']
        user_role_list.append(user_role)
    pg_update.insert('user_role', user_role_list)

#-------role


def get_roles():
    '''
    获取所有角色
    create by chenli at 16/01/07 11:37
    '''
    return pg_update.select("role", order_by="id", limit=-1)


def add_role(data_map):
    '''
    新增角色
    '''
    try:
        pg_update.insertOne("role", data_map)
    except Exception, e:
        if str(e).find('unique') != -1:
            raise CooError(text='角色代码已存在:' + data_map['role_code'])
        else:
            raise CooError(text='未知错误')


def update_role(data_map):
    '''
    编辑和删除角色
    '''
    pg_update.update("role", data_map, where=" id = %s " % data_map['id'])


#-------business
def get_businesses():
    '''
    获取所有业务
    '''
    datas = pg_update.select("business", order_by="id", limit=-1)
    return datas


def update_business(data_map):
    '''
    编辑和删除业务
    '''
    pg_update.update("business", data_map, where=" id = %s " % data_map['id'])


def add_business(data_map):
    '''
    新增业务
    '''
    pg_update.insertOne("business", data_map)


def delete_role_business(business_code):
    '''
    删除某业务对应的角色业务
    '''
    pg_update.update("business", {'status': 1}, where=" business_code = '%s' " % business_code)


#-------api
def get_apis(parm):
    '''
    获取api
    '''
    result = {}
    limit = 10
    page = parm['page']
    search_key = parm['search_key']
    offset = (int(page) - 1) * limit
    where = ("a.status = 0 and a.api like '%%%s%%' " % search_key if search_key and search_key != '' else " a.status = 0 ")
    sql = '''
        select a.*
          from api a
          where %s
          order by id
          limit %s offset %s
    ''' % (where, limit, offset)
    apis = pg_update.selectBySql(sql)
    api_str = ''
    for api in apis:
        api_str += "'" + api['api'] + "',"
    sql = '''
        select b_a.api,b.business_code,b.business_name
          from business_api b_a,business b
          where b_a.api in (%s)
            and b_a.business_code = b.business_code
            and b_a.status = 0
    ''' % api_str[:-1]
    business_apis = pg_update.selectBySql(sql)
    for api in apis:
        api['business'] = []
        api['business_text'] = ''
        for business_api in business_apis:
            if business_api['api'] == api['api']:
                api['business_text'] += (business_api['business_name'] + ' ')
                api['business'].append(business_api)
    sql_count = '''
        select count(*)
          from api a
          where %s
    ''' % where
    count = pg_update.selectBySql(sql_count)[0]['count']
    page_count = math.ceil(float(count) / limit)
    result['datas'] = apis
    result['page_count'] = page_count
    return result


def update_api(data_map):
    '''
    用户信息更新
    '''
    pg_update.update("api", data_map, where=" api = '%s' " % data_map['api'])
