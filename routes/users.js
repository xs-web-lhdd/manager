/**
 * @description 用户管理模块
 * @author 凉风有信、
 */
const router = require('koa-router')()
const User = require('../models/userSchema')
const utils = require('../utils/util')
// 前缀
router.prefix('/api/users')

router.post('/login', async (ctx, next) => {
  try {
    const { userName, userPwd } = ctx.request.body
    const res = await User.findOne({
      userName,
      userPwd
    })
    if (res) {
      ctx.body = utils.success(res)
    } else {
      ctx.body = utils.fail('账号或密码不正确')
    }
  } catch (error) {
    console.log(error.msg)
    ctx.body = utils.fail(error.msg)
  }
})



module.exports = router
