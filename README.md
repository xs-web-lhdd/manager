#### 基于Koa+Mongodb后台管理系统服务端：



##### 1、初始化项目

###### koa-generator快速生成koa服务的脚手架工具

全局安装脚手架工具：

```bash
yarn global add koa-generator
```

进入项目文件夹目录，执行生成命令

```bash
# koa2+项目名
koa2 manger-serve
```

安装依赖：

```bash
# 自定义包
npm install
# 默认包
npm install -y
```

启动服务：

```bash
yarn dev
```

###### 项目目录：

```bash
manger-serve
	apidoc # 接口文档设计
	bin
	config # 配置文件
	logs # 打印日志
	models # 数据库模型
	node_modules # 包
	public # 静态资源存放
	routes # 路由
	utils # 工具
	views # 服务端模板引擎
	.gitignore
	app.js
	package-lock.json
	package.json
```

##### 2、封装打印日志：

安装log4js: 

```bash
yarn add log4js -D
```

官网地址：[log4js - npm (npmjs.com)](https://www.npmjs.com/package/log4js)

封装：

```js
/**
 * @description 日志存储
 * @author 凉风有信、
 */

const log4js = require('log4js')

// 常量
const levels = {
  'trace': log4js.levels.TRACE,
  'debug': log4js.levels.DEBUG,
  'info': log4js.levels.INFO,
  'warn': log4js.levels.WARN,
  'error': log4js.levels.ERROR,
  'fatal': log4js.levels.FATAL
}

log4js.configure({
  // 追加器 固定语法不能改
  appenders: {
    console: { type: 'console' },
    // 往文件里打印---指定类型和文件名称
    info: {
      type: 'file',
      filename: 'logs/all-logs.log' // 输出到一个文件中
    },
    error: {
      type: 'dateFile', // 按天输出
      filename: 'logs/log', // 输出到文件中
      pattern: 'yyyy-MM-dd.log', // 文件名称按 年-月-日
      alwaysIncludePattern: true  // 设置文件名称为 filename + pattern
    }
  },
  // 种类：
  categories: {
    default: { appenders: [ 'console' ], level: "debug" },
    // 打印到文件中记得指定种类
    info: {
      appenders: [ 'info', 'console' ],
      level: 'info'
    },
    error: {
      appenders: [ 'error', 'console' ],
      level: 'error'
    }
  }
})


/**
 * debug信息日志输出
 * @param {string} content 
 */
exports.debug = (content) => {
  let logger = log4js.getLogger()
  logger.level = levels.debug
  logger.debug(content)
}


/**
 * 日志输出 level为error
 * @param {string} content 
 */
exports.error = (content) => {
  let logger = log4js.getLogger('error') // 因为要打印到文件中所以要传error
  logger.level = levels.error
  logger.error(content)
}


/**
 * 日志输出 level为info
 * @param {string} content 
 */
exports.info = (content) => {
  let logger = log4js.getLogger('info') // 因为要打印到文件中所以要传info
  logger.level = levels.info
  logger.info(content)
}
```

​	开发的时候输出到控制台，上线后输出到文件里面(把console删掉)，打印到文件里面记得在categories里面指定

​	详情见：[Node.js 之 log4js 完全讲解 (juejin.cn)](https://juejin.cn/post/6844903442054381582)

​	mongodb基本操作见：https://github.com/xs-web-lhdd/jingdong/tree/server  里面README文件

##### 3、工具函数的封装：

```js
/**
 * @description 工具函数
 * @author 凉风有信、
 */

// 统一状态码 
const CODE = {
    SUCCESS: 200,
    PARAM_ERROR: 10001, // 参数错误
    USER_ACCOUNT_ERROR: 20001, //账号或密码错误
    USER_LOGIN_ERROR: 30001, // 用户未登录
    BUSINESS_ERROR: 40001, //业务请求失败
    AUTH_ERROR: 500001, // 认证失败或TOKEN过期
}
module.exports = {
    /**
     * 分页结构封装
     * @param {number} pageNum 
     * @param {number} pageSize 
     */
    pager({ pageNum = 1, pageSize = 10 }) {
        pageNum *= 1;
        pageSize *= 1;
        // 从第几条数据进行索引
        const skipIndex = (pageNum - 1) * pageSize;
        return {
            page: {
                pageNum,
                pageSize
            },
            skipIndex
        }
    },
    // 成功返回
    success(data = '', msg = '', code = CODE.SUCCESS) {
        return {
            code, data, msg
        }
    },
    // 失败返回
    fail(msg = '', code = CODE.BUSINESS_ERROR) {
        return {
            code, msg
        }
    },
    CODE
}
```

##### 4、数据库连接：

config中index中配置：

```js
module.exports = {
  // 数据库地址
  URL: 'mongodb://localhost:27017/manager'
}
```

连接（两者可以写在一起）：

```js
const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)
const config = require('./index')

mongoose.connect(config.URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const db = mongoose.connection

db.on('error', err => {
  console.error('mongoose connection error', err)
})

db.on('open', () => {
  console.log('mongoose 连接成功')
})

module.exports = mongoose
```

数据库操作三部曲：

​		1、连接数据库（固定写法了）

​		2、创建数据库模型（按需求进行创建）

​		3、对数据库进行增删改查（数据库操作最重要的一部分）

以上是开发前通用架子搭建，下面就是该项目的业务代码了，嘿嘿嘿！！！



#### 登录：

通过jwt进行签名：

```js
router.post('/login', async (ctx, next) => {
  try {
    const { userName, userPwd } = ctx.request.body
    // 返回数据库指定字段有三种方式
    // 1、通过字符串空格的方式 ： 'userId userName userEmail state role deptId roleList'
    // 2、通过JSON的方式 1代表返回，0代表不返回：  { userId:1, userName:0 }
    // 3、通过select('userId')：打点调用select('userId')
    const res = await User.findOne({
      userName,
      userPwd: md5(userPwd) // 因为密码在数据库中是经过md5加密过的，因此在登录进行查找时也要用加密后的密码去进行查找
    }, 'userId userName userEmail state role deptId roleList')

    if (res) {
      const data = res._doc
      const token = jwt.sign({
        data: data
      }, 'imooc', { expiresIn: '1h' })
      data.token = token
      ctx.body = utils.success(data)
    } else {
      ctx.body = utils.fail('账号或密码不正确')
    }
  } catch (error) {
    ctx.body = utils.fail(error.msg)
  }
})
```

在找到用户后，要在返回的信息中注入服务端产生的token，将token存储到客户端

```js
// 引入jwt
const jwt = require('jsonwebtoken')
// 用jwt进行签名
const token = jwt.sign({
    data: data
}, 'imooc', { expiresIn: '1h' })
// 第一个参数是进行签名的数据，第二个参数是密钥，第三个参数是token过期时间
```

​	jwt官网：[jsonwebtoken - npm (npmjs.com)](https://www.npmjs.com/package/jsonwebtoken)

###### jwt与session那些事：

session做不到单点登录而jwt可以，jwt与session可参考以下文章：https://juejin.cn/post/6844904034181070861   https://juejin.cn/post/6844904115080790023   https://juejin.cn/post/6898630134530752520

