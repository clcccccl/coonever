# -*- coding: utf-8 -*-
#!/usr/bin/env python

'''
blog相关api
只处理业务流程，和数据处理
数据库操作交给dbImpl
create by chenli at 16/08/15 15:43
'''

import pdb
import math
import time

import tools

from sys_wraps import CooError
from dbImpl.blog import Blog_Menu, Blog


def load_blog(parm):
    '''
    获取博客
    '''
    blog_id = parm.get('request_map', {})
    blogs = Blog.get_blog(blog_id)
    return {'datas': blogs[0] if blogs else {}}


def save_blog(parm):
    '''
    保存博客
    '''
    blog = parm.get('request_map', {})
    user = parm.get('user', {})
    blog_id = blog.get('id', None)
    blog['content'] = blog['content'].replace("'", "''")
    if not user:
        raise CooError(text='%s用户不存在，请从新登录。')
    if not blog_id:
        blog['author'] = user['account']
        blog_id = Blog.add_blog(blog)
    else:
        if user.get('account', 1) != blog.get('author', 2):
            raise CooError(text='非博主无法编辑博客内容')
        Blog.update_blog(blog)
    return {'datas': blog_id}


def edit_blog_head_menu(parm):
    head_menu = parm.get('request_map', {})
    user = parm.get('user', {})
    if not user:
        raise CooError(text='%s用户不存在，请从新登录。')
    if not head_menu.get('menu_key', None):
        head_menu['menu_key'] = user['account'] + '.' + str(time.time())
        head_menu['blone_account'] = user['account']
        head_menu['restrict'] = 0
        Blog_Menu.add_menu(head_menu)
    else:
        if not Blog_Menu.test_blone(user['account'], head_menu['menu_key']):
            raise CooError(text='非博主无法编辑博客内容')
        Blog_Menu.update_menu(head_menu)


def get_blog_head_menu(parm):
    '''
    获取某博主的blog头部菜单
    没有博主，用户已登录，则提供用户自己的菜单
    没有博主，且用户未登录则提供系统菜单
    '''
    # 获取博主
    blogger = parm.get('request_map').get('blogger', '')
    # 获取用户信息
    user = parm.get('user', {})
    return {'datas': Blog_Menu.get_blog_head_menu(blogger, user)}


def get_blog_content_menu(parm):
    '''
    获取博客内容菜单
    没有博主，用户已登录，则提供用户自己的菜单
    没有博主，且用户未登录则提供系统菜单
    '''
    # 获取博主
    head_menu = parm.get('request_map').get('head_menu', '')
    if not head_menu:
        raise CooError(text='博客异常，联系管理员')
    blogger = parm.get('request_map').get('blogger', '')
    # 获取用户信息
    user = parm.get('user', {})
    if head_menu == 'write_blog':
        datas = [{'id': data['menu_key'], 'blog_title': data['menu_name']} for data in Blog_Menu.get_blog_head_menu(blogger, user)]
    else:
        datas = Blog.get_blog_content_menu(blogger, head_menu, user)
    return {'datas': datas}
