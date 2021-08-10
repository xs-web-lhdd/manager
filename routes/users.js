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


// 删除用户
router.post('/delete', async (ctx, next) => {
  // 待删除的用户Id
  const { userId } = ctx.request.body
  const res = await User.updateMany({ userId: { $in: userId } }, { state: 2 })
  if (res.nModified > 0) {
    ctx.body = utils.success(res, `共删除成功${res.nModified}条数据`)
    return
  }
  ctx.body = utils.fail('删除失败')
})


// 用户新增/编辑：
router.post('/operate', async (ctx, next) => {
  const { userId, userName, userEmail, mobile, job, state, roleList, deptId, active  } = ctx.request.body
  if (active === 'add') {
    if (userName || userEmail || deptId) {
      ctx.body = utils.fail('参数错误', utils.CODE.PARAM_ERROR)
      return
    }
  } else {
    if (!deptId) {
      ctx.body = utils.fail('部门不能为空', utils.CODE.PARAM_ERROR)
      return
    }
    try {
      const res = await User.findOneAndUpdate({userId}, {mobile, job, state, roleList, deptId})
      if (res) {
        ctx.body = utils.success('更新成功')
        return
      }      
    } catch (error) {
      ctx.body = utils.fail('更新失败', error.stack) 
    }
  }

})


module.exports = router
