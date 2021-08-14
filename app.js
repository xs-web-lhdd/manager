const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const log4js = require('./utils/log4')
const koajwt = require('koa-jwt')

const users = require('./routes/users')
const menus = require('./routes/menus')
const roles = require('./routes/roles')
const depts = require('./routes/depts')
const leaves = require('./routes/leaves')
const util = require('./utils/util')


require('./config/db')
// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  log4js.info('log output')
  await next().catch((err) => {
    if (err.status == '401') {
      ctx.status = 200;
      ctx.body = util.fail('Token认证失败', util.CODE.AUTH_ERROR)
    } else {
      throw err;
    }
  })
})

// 用unless指定不认证token的路由
app.use(koajwt({ secret: 'imooc' }).unless({
  path: [/^\/api\/users\/login/]
}))

// routes
app.use(users.routes(), users.allowedMethods())
app.use(menus.routes(), menus.allowedMethods())
app.use(roles.routes(), roles.allowedMethods())
app.use(depts.routes(), depts.allowedMethods())
app.use(leaves.routes(), leaves.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  log4js.error(err.stack)
});

module.exports = app
