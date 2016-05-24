# -*- coding: utf-8 -*-
#!/usr/bin/env python

from model.businessLayer.sys_business import *
from model.businessLayer.base_business import *
from db_base import pg_update

import pdb

here_funs = ['main', 'getFuns', 'get_child_business', 'addApi']


def __getFuns():
    funs_str = []
    funs = globals().copy()
    for fun in funs:
        if hasattr(funs[fun], '__call__') and fun[:2] != '__':
            funs_str.append(funs[fun])
    return funs_str


def __addApi():
    funs = __getFuns()
    for fun in funs:
        if pg_update.select("api", where=" api = '%s' " % fun.__name__):
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
    sql = '''
      select * from business_api
        where api = '%s' and business_code = '%s'
    ''' % (api, business)
    business_apis = pg_update.selectBySql(sql)
    if len(business_apis) == 0:
        data_map['api'] = api
        data_map['business_code'] = business
        pg_update.insertOne("business_api", data_map)


def __addRoleBusiness(role, business):
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
    __addApi()
    pass


if __name__ == "__main__":
    __main()
    pass
