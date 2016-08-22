# -*- coding: utf-8 -*-
#!/usr/bin/env python

'''
实现系统业务的数据库操作部分
原则上制作数据库操作和数据处理
create by chenli at 16/01/07 11:37
'''

import math
import datetime
import uuid

from db_base import pg_update
from sys_wraps import CooError, ClModelImpl


class Blog(ClModelImpl):
    '''
    博客相关操作
    '''
    table_name = 'blog'

    @classmethod
    def add_blog(self, blog):
        return pg_update.insertOne(self.table_name, blog, return_id=True)

    @classmethod
    def update_blog(self, blog):
        pg_update.update(self.table_name, blog, where=" id = %s" % blog['id'])

    @classmethod
    def get_blog(self, blog_id):
        return pg_update.select(self.table_name, where=" id = %s" % blog_id)

    @classmethod
    def get_blog_content_menu(self, blogger, head_menu, user):
        if not blogger and not user:
            blogger = 'root'
        elif not blogger and user:
            blogger = user['account']
        sql = '''
          select * from blog
            where author = '%s'
              and blog_type = '%s'
              and status = 0
              order by create_date
        ''' % (blogger, head_menu)
        return pg_update.selectBySql(sql)


class Blog_Menu(ClModelImpl):
    '''
    博客菜单相关操作
    '''
    table_name = 'blog_menu'

    @classmethod
    def test_blone(self, account, menu_key):
        blog_menu = pg_update.select(self.table_name, where=" menu_key = '%s'" % menu_key)[0]
        return True if blog_menu['blone_account'] == account else False

    @classmethod
    def add_menu(self, head_menu):
        pg_update.insertOne(self.table_name, head_menu)

    @classmethod
    def update_menu(self, head_menu):
        pg_update.update(self.table_name, head_menu, where=" menu_key = '%s' " % head_menu['menu_key'])

    @classmethod
    def get_blog_head_menu(self, blogger, user):
        restrict = 0
        if blogger:
            # if test_friend(blogger, user['account']):
            #     restrict = 3
            # else:
            #     restrict = 2
            restrict = 3
        elif user:
            blogger = user['account']
            restrict = 5
        else:
            blogger = 'root'
            restrict = 2
        sql = '''
          select * from %s
            where blone_account = '%s'
              and restrict < %s
              and status = 0
              order by create_date
        ''' % (self.table_name, blogger, restrict)
        return pg_update.selectBySql(sql)


if __name__ == "__main__":
    pass
