# -*- coding: utf-8 -*-
#!/usr/bin/env python

'''
实现系统业务的数据库操作部分
原则上制作数据库操作和数据处理
create by chenli at 16/01/07 11:37
'''

import math

from db_base import pg_update
from sys_wraps import CooError, ClModelImpl


class User(ClModelImpl):
    '''
    用户相关操作
    '''
    max_name_len = 30
    max_account_len = 30
    max_password_len = 30

    def __init__(self, name=None, account=None, password=None, user_map={}):
        self.account = account
        self.password = password
        self.name = name
        self._str_len_text()
        self.user_map = user_map
        if not user_map:
            if self.account:
                user_map['account'] = self.account
            if self.password:
                user_map['password'] = self.password
            if self.name:
                user_map['name'] = self.name

    def add_user(self):
        '''
        新增用户
        '''
        try:
            pg_update.insertOne("user_info", self.user_map)
        except Exception, e:
            if str(e).find('unique') != -1:
                raise CooError(text='用户已存在:' + self.user_map['account'])
            else:
                print e
                raise CooError(text='未知错误')

    def update_user(self):
        '''
        用户信息更新
        '''
        pg_update.update("user_info", self.user_map, where=" account = '%s' " % self.data_map['account'])

    @classmethod
    def get_users(self, offset, limit, where):
        sql = '''
            select name,account
              from user_info
              where %s
              order by id
              limit %s
              offset %s
        ''' % (where, limit, offset)
        return pg_update.selectBySql(sql)

    def _str_len_text(self):
        if self.account is not None:
            self.str_len_test('account', self.account, self.max_account_len)
        if self.password is not None:
            self.str_len_test('password', self.password, self.max_password_len)
        if self.name is not None:
            self.str_len_test('name', self.name, self.max_name_len)

    @classmethod
    def users_count(self, where):
        sql_count = '''
            select count(*)
              from user_info
              where %s
        ''' % where
        return pg_update.selectBySql(sql_count)[0]['count']

    @classmethod
    def del_user_by_account(self, account):
        '''
        删除用户
        '''
        where = (" account = '%s' " % account)
        pg_update.delete('user_info', where=where)
        UserRole.delete_role_by_account(account)

    @classmethod
    def get_user_by_ap(self, user):
        '''
        通过用户名密码获取用户
        '''
        where = " account = '%s' and password = '%s' " % (user['account'], user['password'])
        return pg_update.select("user_info", where=where, columns='id,account')

    @classmethod
    def get_user_by_account(self, account):
        '''
        通过帐号获取用户
        '''
        return pg_update.select("user_info", where=" account = '%s' " % account, columns='id,account')


class UserDetail(ClModelImpl):
    '''
    用户详细相关操作
    '''
    @classmethod
    def get_user_head_file_name_by_account(self, account):
        return pg_update.select("user_detail", where=" account = '%s' and status = 0 " % account)

    @classmethod
    def get_user_detail_by_account(self, account):
        '''
        通过帐号获取用户详细信息
        '''
        sql = '''
          select ui.*,ud.head_file,ud.motto
            from user_info ui
            left join (
            select * from user_detail where status=0 and account='%s'
            )ud
              on ud.account=ui.account
            where
              ui.status=0 and ui.account='%s'
        ''' % (account, account)
        users = pg_update.selectBySql(sql)
        if len(users) != 1:
            raise CooError(text='系统数据异常')
        roles = UserRole.get_roles_by_account(account)
        users[0]['roles'] = roles
        return users[0]


class UserRole(ClModelImpl):
    '''
    用户角色相关操作
    '''

    @classmethod
    def get_user_roles_by_account(self, account):
        roles = UserRole.get_roles_by_account(account)
        user = User.get_user_by_account(account)
        if user:
            user[0]['roles'] = roles
            return user[0]
        else:
            raise CooError(user_id=user_id, fun_name='get_user_roles_by_account', text='通过account获取用户失败')

    @classmethod
    def get_users_by_role(self, role_code):
        sql = '''
         select * from user_role where role_code = '%s'
        ''' % role_code
        return pg_update.selectBySql(sql)

    @classmethod
    def get_roles_by_account(self, account):
        sql = '''
        select * from role
          where role_code in (
            select r.role_code
            from user_info u,user_role r
            where u.account = '%s' and u.account = r.account
              and r.status=0)
        ''' % account
        return pg_update.selectBySql(sql)

    @classmethod
    def delete_role_by_account(self, account):
        '''
        通过账户删除用户所属角色
        '''
        where = " account = '%s' " % account
        pg_update.delete('user_role', where=where)

    @classmethod
    def delete_role_by_role_code(self, role_code):
        '''
        通过角色代码删除用户所属角色
        '''
        where = " role_code = '%s' " % role_code
        pg_update.delete('user_role', where=where)

    @classmethod
    def add_user_role(self, user_account, roles):
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

    @classmethod
    def get_roles_by_accounts(self, accounts):
        '''
        通过accounts获取roles
        '''
        accounts_str = ''
        for account in accounts:
            accounts_str += "'" + account + "',"
        if accounts_str == '':
            return []
        sql = '''
            select u_r.account,r.role_code,r.role_name
              from user_role u_r,role r
              where u_r.account in (%s)
                and u_r.role_code = r.role_code
                and u_r.status = 0
        ''' % accounts_str[:-1]
        return pg_update.selectBySql(sql)


class Role(ClModelImpl):
    '''
    角色相关操作
    '''
    @classmethod
    def get_roles(slef):
        '''
        获取所有角色
        create by chenli at 16/01/07 11:37
        '''
        return pg_update.select("role", order_by="id", limit=-1)

    @classmethod
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

    @classmethod
    def update_role(data_map):
        '''
        编辑和删除角色
        '''
        pg_update.update("role", data_map, where=" id = %s " % data_map['id'])

    @classmethod
    def get_role_parent_role_code(slef, role_code):
        '''
        获取所有角色
        create by chenli at 16/01/07 11:37
        '''
        parent_role_code = pg_update.select("role", where="role_code = '%s' " % role_code)[0]['parent_role_code']
        return 'root' if parent_role_code == 'None' else parent_role_code


class Business(ClModelImpl):
    '''
    业务相关操作
    '''
    @classmethod
    def get_businesses(self):
        '''
        获取所有业务
        '''
        return pg_update.select("business", order_by="id", limit=-1)

    @classmethod
    def update_business(self, data_map):
        '''
        编辑和删除业务
        '''
        pg_update.update("business", data_map, where=" id = %s " % data_map['id'])

    @classmethod
    def add_business(self, data_map):
        '''
        新增业务
        '''
        pg_update.insertOne("business", data_map)

    @classmethod
    def get_child_businesses(self, parent_business_code):
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


class RoleBusiness(ClModelImpl):
    '''
    角色业务相关操作
    '''
    @classmethod
    def delete_role_business_by_business_code(self, business_code):
        '''
        删除某业务对应的角色业务
        '''
        pg_update.update("business", {'status': 1}, where=" business_code = '%s' " % business_code)

    @classmethod
    def get_businesses_by_role(self, role_code):
        '''
        根据角色获取该角色可选业务
        子角色可以选择父角色拥有的业务
        '''
        # 获取父角色代码
        parent_role_code = Role.get_role_parent_role_code(role_code)
        return self.get_businesses_by_role_code(parent_role_code)

    @classmethod
    def get_businesses_by_roles(self, roles):
        '''
        获取所有业务
        '''
        roles = [role['role_code'] for role in roles]
        ls = "','"
        roles_str = "'" + (ls.join(roles)) + "'"
        sql = '''
          select business_code from business
            where business_code in
              (select business_code from role_business
                where role_code in (%s)
                  and status = 0
              )
        ''' % roles_str
        return pg_update.selectBySql(sql)

    @classmethod
    def get_businesses_by_role_code(self, role_code):
        '''
        获取某角色拥有的所有业务
        '''
        business_codes = pg_update.select("role_business", where="role_code = '%s'" % role_code)
        where = ''
        for business_code in business_codes:
            where += "or seq_code like '%%%s%%'" % business_code['business_code']
        sql = '''
          select * from (
            select * from business where status = 0
          ) b where %s
        ''' % where[2:]
        return pg_update.selectBySql(sql)

    @classmethod
    def roles_api_test(self, roles, api):
        '''
        角色和业务匹配
        '''
        apis = Api.get_api_by_api(api)
        if len(api) == 0:
            return False
        elif apis[0]['restrict'] == 0:
            return True
        if len(roles) == 0:
            return False
        business_codes = RoleBusiness.get_businesses_by_roles(roles)
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

    @classmethod
    def get_bar_data_by_roles(self, roles):
        '''
        更加角色获取菜单数据
        '''
        roles = [role['role_code'] for role in roles]
        ls = "','"
        roles_str = "'" + (ls.join(roles)) + "'"
        sql = '''
            select b.* from role_business rb, business b
              where rb.business_code = b.business_code
                and rb.role_code in (%s)
                and rb.status = 0
                and b.status = 0
        ''' % roles_str
        return pg_update.selectBySql(sql)

    @classmethod
    def delete_role_business(self, role_code, business_code):
        '''
        添加角色拥有业务
        '''
        where = (" role_code = '%s' and business_code = '%s' " % (role_code, business_code))
        pg_update.delete('role_business', where=where)

    @classmethod
    def add_role_business(self, role_code, business_code):
        '''
        添加角色拥有业务
        '''
        pg_update.insertOne("role_business", {'role_code': role_code, 'business_code': business_code})


class Api(ClModelImpl):
    '''
    api相关操作
    '''
    @classmethod
    def get_apis(self, parm):
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
        api_str = ','.join(["'" + api['api'] + "'" for api in apis])
        sql = '''
            select b_a.api,b.business_code,b.business_name
              from business_api b_a,business b
              where b_a.api in (%s)
                and b_a.business_code = b.business_code
                and b_a.status = 0
        ''' % api_str
        business_apis = pg_update.selectBySql(sql) if apis else []
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

    @classmethod
    def update_api(self, data_map):
        '''
        api信息更新
        '''
        pg_update.update("api", data_map, where=" api = '%s' " % data_map['api'])

    @classmethod
    def get_api_by_api(self, api):
        sql = '''
          select * from api where api = '%s'
        ''' % api
        return pg_update.selectBySql(sql)


if __name__ == "__main__":
    pass
