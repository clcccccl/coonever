# -*- coding: utf-8 -*-
#!/usr/bin/env python

import functools
import traceback
import json
import sys
import os
import datetime

# from log import log_hander

reload(sys)
sys.setdefaultencoding('utf-8')


def handleError(method):
    '''
    出现错误的时候,用json返回错误信息回去
    很好用的一个装饰器
    '''
    @functools.wraps(method)
    def wrapper(self, *args, **kwargs):
        try:
            method(self, *args, **kwargs)
        except CooError, e:
            self.write(json.dumps({"response_data": {}, 'error': 1, 'error_text': e.text}))
        # except Exception:
        #     self.write(json.dumps({"response_data": {}, 'error': 1, 'error_text': "服务器错误"}))
    return wrapper


def getExpInfoAll(just_info=False):
    '''得到Exception的异常'''
    if just_info:
        info = sys.exc_info()
        return str(info[1])
    else:
        return traceback.format_exc()


class ClModelImpl(object):
    '''
    数据实现基类
    '''
    def __init__(self):
        pass

    def str_len_test(self, key, str_data, max_len):
        if len(str_data) > max_len:
            raise CooError(text=key + '最大长度为:' + str(max_len) + ' but "%s"' % str_data + '长度为' + str(len(str_data)))

    def __del__(self):
        '''
        析构函数
        '''
        pass


class CooError(Exception):
    '''
    系统异常类
    error_type = 0:系统数据异常
    error_type = 1:用户数据错误
    '''
    def __init__(self, error_type=1, user_id=0, api=None, text=None, fun_name=None, add_log=True):
        self.error_type = error_type
        self.user_id = user_id
        self.api = api
        self.fun_name = fun_name
        self.text = text
        self.value = "api:" + str(self.api) + " fun_name:" + str(self.fun_name) + " user_id:" + str(self.user_id) + " value:" + str(self.text)
        # if add_log:
        #     self.add_log()

    # def add_log(self):
    #     log_hander.info(self.value)

    def __str__(self):
        return repr(self.value)


if __name__ == '__main__':
    raise CooError
