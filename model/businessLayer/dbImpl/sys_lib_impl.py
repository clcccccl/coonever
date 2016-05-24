# -*- coding: utf-8 -*-
#!/usr/bin/env python

'''
实现系统业务的数据库操作部分
原则上制作数据库操作和数据处理
create by chenli at 16/01/07 11:37
'''

from db_base import pg_update
import math


def get_modle_by_api(api):
    sql = '''
      select path from api where api = '%s'
    ''' % api
    return pg_update.selectBySql(sql)[0]['path']


def roles_business_test(roles, api):
    '''
    角色和业务匹配
    '''
    sql = '''
      select restrict from api where api = '%s'
    ''' % api
    apis = pg_update.selectBySql(sql)
    if len(api) == 0:
        return False
    elif apis[0]['restrict'] == 0:
        return True
    if len(roles) == 0:
        return False
    roles_str = ''
    for role in roles:
        roles_str += "'" + role['role_code'] + "',"
    sql = '''
      select business_code from business
        where business_code in
          (select business_code from role_business where role_code in (%s))
    ''' % roles_str[:-1]
    business_codes = pg_update.selectBySql(sql)
    sql = '''
      select seq_code from business
        where business_code in
          (select business_code from business_api
            where api = '%s')
    ''' % api
    business_seq_code = pg_update.selectBySql(sql)[0]['seq_code']
    for business_code in business_codes:
        if business_seq_code.find(business_code['business_code']) > 0:
            return True
    return False


def get_user_by_ap(user):
    '''
    通过用户名密码获取用户
    '''
    where = " account = '%s' and password = '%s' " % (user['account'], user['password'])
    return pg_update.select("user_info", where=where, columns='id,account')


def get_user_by_id(user_id):
    sql = '''
    select * from role
      where role_code in (
        select r.role_code
        from user_info u,user_role r
        where u.id = %s and u.account = r.account
          and r.status=0)
    ''' % user_id
    roles = pg_update.selectBySql(sql)
    user = pg_update.select("user_info", where=' id = %s ' % user_id, columns='id,account')[0]
    user['roles'] = roles
    return user
