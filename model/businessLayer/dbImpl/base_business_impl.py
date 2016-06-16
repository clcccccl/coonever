# -*- coding: utf-8 -*-
#!/usr/bin/env python

'''
实现基础业务的数据库操作部分
原则上制作数据库操作和数据处理
create by chenli at 16/01/07 11:37
'''

import math

from db_base import pg_update


def get_user_by_account(account):
    '''
    通过帐号获取用户
    '''
    return pg_update.select("user_info", where=" account = '%s' " % account)


def get_bar_data_by_roles(roles):
    '''
    更加角色获取菜单数据
    '''
    roles_str = ''
    for role in roles:
        roles_str += "'" + role['role_code'] + "',"
    sql = '''
        select b.* from role_business rb, business b
          where rb.business_code = b.business_code
            and rb.role_code in (%s)
            and rb.status = 0
            and b.status = 0
    ''' % roles_str[:-1]
    return pg_update.selectBySql(sql)


def get_child_businesses(parent_business_code):
    '''
    通过父业务编码获取子业务
    '''
    child_business = pg_update.select("business", order_by='id',
                                      where=" parent_business_code = '%s' " % parent_business_code)
    for business in child_business:
        if business['is_leaf'] == 0:
            business['child'] = pg_update.select("business", order_by='id',
                                                 where=" parent_business_code = '%s' " % parent_business_code)
    return child_business
