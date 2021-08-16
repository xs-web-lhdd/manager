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



