/**
 * @description 角色管理模块
 * @author 凉风有信、
 */

const router = require('koa-router')()
const util = require('../utils/util')
const Role = require('./../models/roleSchema')
 
router.prefix('/api/roles')

// 查询所有角色列表
router.get('/allList', async (ctx, next) => {
  try {
    const list = await Role.find({}, '_id roleName')
    ctx.body = util.success(list)
  } catch (error) {
    ctx.body = util.fail(`查询失败：${error.stack}`)
  }
})

// 按页获取角色列表
router.get('/list', async (ctx, next) => {
  const { roleName } = ctx.request.query
  const { page, skipIndex } = util.pager(ctx.request.query)
  try {
    let params = {}
    if (roleName) params.roleName = roleName
    const query = Role.find(params)
    const list =  await query.skip(skipIndex).limit(page.pageSize)
    const total = await Role.countDocuments(params)
    ctx.body = util.success({
      page: {
        ...page,
        total
      },
      list
    })
  } catch (error) {
    ctx.body = util.fail(`数据库查询异常：${error.stack}`)
  }
})



module.exports = router