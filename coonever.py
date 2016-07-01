# -*- coding: utf-8 -*-
#!/usr/bin/env python

import tornado.ioloop
import tornado.web
import os

import tools

from controller.request_handler import Main, Home, Test, Login, PostHandler, FileUpload


class Application(tornado.web.Application):
    def __init__(self, settings):
        handlers = [
            (r"/", Main),
            (r"/home", Home),
            (r"/test", Test),
            (r"/login", Login),
            (r"/post_request", PostHandler),
            (r"/file_upload", FileUpload)
        ]
        tornado.web.Application.__init__(self, handlers, **settings)


def main():
    server_parameter = tools.getIniConfig({'group': 'sys', 'keys': ['port', 'address']}, './config.ini')
    settings = dict(
        static_path=os.path.join(os.path.dirname(__file__), "view"),
        template_path=os.path.join("view/template"),
        ui_modules=[],
        cookie_secret="__TODO:_GENERATE_YOUR_OWN_RANDOM_VALUE_HERE__",
        debug=True,
    )
    app = Application(settings)
    app.listen(server_parameter['port'], server_parameter['address'])
    tornado.ioloop.IOLoop.current().start()


if __name__ == "__main__":
    main()
