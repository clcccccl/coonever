# -*- coding: utf-8 -*-
#!/usr/bin/env python

import functools
import traceback
import json
import sys
import os

reload(sys)
sys.setdefaultencoding('utf-8')


def handleError(method):
    '''
    出现错误的时候,用json返回错误信息回去
    很好用的一个装饰器
    '''
    @functools.wraps(method)
    def wrapper(self, *args, **kwargs):
        # try:
        #     method(self, *args, **kwargs)
        # except Exception, e:
        #     print e
        #     self.write(json.dumps({"response_data": {}, 'error': 1, 'error_text': str(e.__str__())}))
        method(self, *args, **kwargs)
    return wrapper


def getExpInfoAll(just_info=False):
    '''得到Exception的异常'''
    if just_info:
        info = sys.exc_info()
        return str(info[1])
    else:
        return traceback.format_exc()
