# -*- coding: utf-8 -*-
#!/usr/bin/env python

'''
实现系统业务的数据库操作部分
原则上制作数据库操作和数据处理
create by chenli at 16/01/07 11:37
'''

import math
import uuid
import datetime

from db_base import pg_update
from sys_wraps import CooError


def add_file(file_data):
    file_seq = pg_update.getSeq('file')
    file_data['id'] = int(file_seq)
    file_data['exist'] = 1
    file_data['path'] = file_data['path'] + str(file_seq) + '_' + file_data['file_name']
    pg_update.insertOne("file", file_data)
    return file_data


def clear_session(session):
    data = {}
    data['invalid_time'] = str(datetime.datetime.now())[:19]
    data['status'] = 1
    pg_update.update("session", data, where=" session = '%s'" % session)


def get_session_by_session(session):
    where = "session = '%s' and status = 0 and invalid_time > now() " % session
    return pg_update.select("session", where=where)


def update_session(session):
    pg_update.update("session", {'invalid_time': str(datetime.datetime.now() + datetime.timedelta(seconds=600))[:19]}, where=" session = '%s' " % session)


def user_register(user):
    try:
        pg_update.insertOne("user_info", user)
    except Exception, e:
        if str(e).find('unique') != -1:
            raise CooError(text='用户已存在:' + user['account'])
        else:
            raise CooError(text='未知错误')


def get_api_by_api(api):
    sql = '''
      select * from api where api = '%s'
    ''' % api
    return pg_update.selectBySql(sql)


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


def add_session_by_account(account):
    '''
    session注册
    '''
    where = "account = '%s' and status = 0 and invalid_time > now() " % account
    session = pg_update.select("session", where=where)
    if session:
        raise CooError(text='该帐号已被登陆！')
    data = {}
    data['account'] = account
    data['session'] = str(uuid.uuid4())
    # 60秒后失效
    data['invalid_time'] = str(datetime.datetime.now() + datetime.timedelta(seconds=600))[:19]
    try:
        pg_update.insertOne("session", data)
        return data['session']
    except Exception, e:
        if str(e).find('unique') != -1:
            return add_session_by_account(account)
        else:
            print e
            raise CooError(text='未知错误')


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
    user = pg_update.select("user_info", where=' id = %s ' % user_id, columns='id,account')
    if user:
        user[0]['roles'] = roles
        return user[0]
    else:
        raise CooError(user_id=user_id, fun_name='get_user_by_id', text='通过user_id获取用户失败')
