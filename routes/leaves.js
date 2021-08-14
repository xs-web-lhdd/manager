/**
 * @description 菜单管理模块
 * @author 凉风有信、
 */

const router = require('koa-router')()
const util = require('../utils/util')
const { find } = require('./../models/leaveSchema')
const Leave = require('./../models/leaveSchema')

router.prefix('/api/leave')

// 查询申请列表
router.get('/list', async (ctx, next) => {
  const { applyState } = ctx.request.query
  const { page, skipIndex } = util.pager(ctx.request.query)
  const authorization = ctx.request.headers.authorization
  let { data } = util.decoded(authorization)
  try {
    let params = {
      "applyUser.userId": data.userId
    }
    if (applyState) params.applyState = applyState
    const query = Leave.find(params)
    const list = await query.skip(skipIndex).limit(page.pageSize)
    const total = await Leave.countDocuments(params)
    ctx.body = util.success({
      page: {
        ...page,
        total
      },
      list
    })
  } catch (error) {
    ctx.body = util.fail(`数据库查询失败：${error.stack}`)
  }
})

module.exports = router