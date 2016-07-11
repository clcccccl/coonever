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


class File(ClModelImpl):
    '''
    文件相关操作
    '''
    @classmethod
    def add_file(self, file_data):
        file_seq = pg_update.getSeq('file')
        file_data['id'] = int(file_seq)
        file_data['exist'] = 1
        file_data['path'] = file_data['path'] + str(file_seq) + '_' + file_data['file_name']
        pg_update.insertOne("file", file_data)
        return file_data


class Session(ClModelImpl):
    '''
    Session相关操作
    '''
    @classmethod
    def clear_session(self, session):
        data = {}
        data['invalid_time'] = str(datetime.datetime.now())[:19]
        data['status'] = 1
        pg_update.update("session", data, where=" session = '%s'" % session)

    @classmethod
    def get_session_by_session(self, session):
        where = "session = '%s' and status = 0 and invalid_time > now() " % session
        return pg_update.select("session", where=where)

    @classmethod
    def update_session(self, session):
        pg_update.update("session", {'invalid_time': str(datetime.datetime.now() + datetime.timedelta(seconds=600))[:19]}, where=" session = '%s' " % session)

    @classmethod
    def add_session_by_account(self, account):
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

if __name__ == "__main__":
    __main()
    pass
