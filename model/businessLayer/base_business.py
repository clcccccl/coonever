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
    return businesses
