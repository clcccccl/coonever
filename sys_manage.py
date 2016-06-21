# -*- coding: utf-8 -*-
#!/usr/bin/env python

import pdb

from model.businessLayer.sys_business import *
from model.businessLayer.base_business import *
from db_base import pg_update

'''
系统配置脚本
'''


def __getFuns():
    '''
    获取系统中的api接口函数信息
    '''
    funs_str = []
    funs = globals().copy()
    for fun in funs:
        if hasattr(funs[fun], '__call__') and fun[:2] != '__':
            funs_str.append(funs[fun])
    return funs_str


def __addApi():
    '''
    将其api接口函数信息添加到api表中
    '''
    funs = __getFuns()
    for fun in funs:
        if pg_update.select("api", where=" api = '%s' " % fun.__name__):
            # 已存在则跳过
            continue
        data_map = {}
        data_map['api'] = fun.__name__
        data_map['api_explain'] = fun.__doc__.strip('\n').split('\n')[0].strip(' ').strip('\n') if fun.__doc__ else ''
        data_map['path'] = fun.__module__
        data_map['disable'] = 0
        data_map['error'] = 0
        data_map['session'] = 1
        data_map['restrict'] = (0 if fun.__module__ == 'model.businessLayer.base_business' else 1)
        pg_update.insertOne("api", data_map)


def __addBusinessApi(api, business):
    '''
    传入api及business
    添加到business_code表中
    '''
    sql = '''
      select * from business_api
        where api = '%s' and business_code = '%s'
    ''' % (api, business)
    business_apis = pg_update.selectBySql(sql)
    if len(business_apis) == 0:
        data_map = {}
        data_map['api'] = api
        data_map['business_code'] = business
        pg_update.insertOne("business_api", data_map)


def __addRoleBusiness(role, business):
    '''
    传入role及business
    添加到role_business表中
    '''
    sql = '''
      select * from role_business
        where role = '%s' and business_code = '%s'
    ''' % (role, business)
    role_business = pg_update.selectBySql(sql)
    if len(business_apis) == 0:
        data_map['role_code'] = api
        data_map['business_code'] = business
        pg_update.insertOne("role_business", data_map)


def __main():
    pass


if __name__ == "__main__":
    __main()
    pass
