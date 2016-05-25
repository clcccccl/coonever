#coonever
##技术选择
tornado,postgresql,webpack,vue.js,semantic-ui

##目的
用户角色，业务，模块，权限的可配置化

##基础数据结构
1.同一用户拥有多种角色
2.同一角色拥有多种业务
3.同一业务拥有多种模块

##实现原理
###1.vue.js component前端模块化
######每个部件一个component，比如foot，head，lef_bar
######每个功能页面一个component，功能内容性的component异步加载
######其他能复用的组件尽量独立为component

###2.页面的组装
######根据登陆用户的信息获取到侧边菜单
######点击侧边菜单动态加载component
######component 中post更新获取数据
######component的获取没有权限控制

###3.在线、权限验证
######数据表api中存储api的信息
######其中存储是否需要在线验证，是否需要权限验证

###4.post过程
####系统只有一个post接口：post_request

####4.1请求数据规则：
######request_type:请求类别
######request_argument:请求参数
######request_data:请求中带list数据放这里

####4.2通过request_type获取api

####4.3在线验证
先判断api是否需要在线验证，需要就进行在线验证

####4.4权限验证
先判断api是否需要权限验证，需要就使用角色进行在线验证

####4.5通过api查数据库获取所在mod

####4.6业务实现
使用response_data = getattr(mod, self.api)(self.request_argument)
