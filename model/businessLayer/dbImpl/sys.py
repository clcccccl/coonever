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


class Message(ClModelImpl):
    '''
    消息相关操作
    '''
    @classmethod
    def add_message(self, message, message_type, send_type, send_value, receive_type, receive_value):
        message_data = {}
        message_data['id'] = int(pg_update.getSeq('message'))
        message_data['message'] = message
        message_data['message_type'] = message_type
        message_data['send_type'] = send_type
        message_data['send_value'] = send_value
        message_data['receive_type'] = receive_type
        message_data['receive_value'] = receive_value
        pg_update.insertOne("message", message_data)
        MessageSendRecord.add_message_send_record(message_data)


class MessageSendRecord(ClModelImpl):
    '''
    消息相关操作
    '''
    @classmethod
    def add_message_send_record(self, message_data):
        if message_data['receive_type'] == 'user':
            message_record_data = {}
            message_record_data['message_id'] = message_data['id']
            message_record_data['send_status'] = 0
            message_record_data['receive_account'] = message_data['receive_value']
            pg_update.insertOne("message_send_record", message_record_data)
        if message_data['receive_type'] == 'role':
            message_record_datas = []
            users = User.get_users_by_role(message_data['receive_value'])
            for user in users:
                message_record_data = {}
                message_record_data['message_id'] = message_data['id']
                message_record_data['send_status'] = 0
                message_record_data['receive_account'] = user['account']
                message_record_datas.append(message_record_data)
            pg_update.insert("message_send_record", message_record_datas)

    @classmethod
    def get_message_by_account(self, account):
        sql = '''
          select m.message,m.message_type,m.send_type,m.send_value,msr.*
          from message m, message_send_record msr
          where msr.message_id = m.id
            and msr.send_status = 0
            and m.status = 0
            and msr.status = 0
            and msr.receive_account = '%s'
        ''' % account
        return pg_update.selectBySql(sql)


if __name__ == "__main__":
    pass
