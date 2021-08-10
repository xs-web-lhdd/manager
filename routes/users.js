/**
 * @description 用户管理模块
 * @author 凉风有信、
 */
const router = require('koa-router')()
const jwt = require('jsonwebtoken')
const User = require('../models/userSchema')
const utils = require('../utils/util')
// 前缀
router.prefix('/api/users')

router.post('/login', async (ctx, next) => {
  try {
    const { userName, userPwd } = ctx.request.body
    // 返回数据库指定字段有三种方式
    // 1、通过字符串空格的方式 ： 'userId userName userEmail state role deptId roleList'
    // 2、通过JSON的方式 1代表返回，0代表不返回：  { userId:1, userName:0 }
    // 3、通过select('userId')：打点调用select('userId')
    const res = await User.findOne({
      userName,
      userPwd
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
    console.log(error.msg)
    ctx.body = utils.fail(error.msg)
  }
})


// 用户列表：
router.get('/list', async (ctx, next) => {
  // get是query传参 --- 细节！！！
  const { userId, userName, state } = ctx.request.query
  const { page, skipIndex } = utils.pager(ctx.request.query)
  let params = {}
  if (userId) params.userId = userId
  if (userName) params.userName = userName
  if (state && state != '0') params.state = state
  try {
    // 根据params进行查询：过滤掉密码
    const query = User.find(params, {_id: 0, userPwd: 0})
    const list = await query.skip(skipIndex).limit(page.pageSize)
    const total = await User.countDocuments(params)
  
    ctx.body = utils.success({
      page: {
        ...page,
        total
      },
      list
    })  
  } catch (error) {
    ctx.body = utils.fail(`数据库查询异常：${error.stack}`)
  }
})


module.exports = router
