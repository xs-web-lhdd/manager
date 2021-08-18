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

// 角色操作：创建、编辑、删除
router.post('/operate', async (ctx, next) => {
  const { _id, action, roleName, remark } = ctx.request.body
  let res, info
  try {
    if (action === 'create') {
      // 判断数据库中是否存在
      const isExist = await Role.findOne({ roleName }, 'roleName remark')
      if (isExist) {
        ctx.body = util.fail(`该角色已存在，详情：${isExist.roleName}---${isExist.remark}`)
        return
      }
      res = await Role.create({ roleName, remark })
      info = '创建成功'
    } else if (action === 'edit') {
      let params = { roleName, remark }
      params.updateTime = new Date()
      res = await Role.findByIdAndUpdate(_id, params)
      info = '编辑成功'
    } else {
      res = await Role.findByIdAndDelete(_id)
      info = '删除成功'
    }
    ctx.body = util.success(res, info)
  } catch (error) {
    ctx.body = util.fail(`操作失败，${error.stack}`)
  }
})

// 权限设置
router.post('/update/permission', async (ctx, next) => {
  const { _id, permissionList } = ctx.request.body
  try {
    let params = { permissionList }
    params.updateTime = new Date()
    res = await Role.findByIdAndUpdate(_id, params)
    ctx.body = util.success(res, '权限设置成功')
  } catch (error) {
    ctx.body = util.fail('', `权限设置失败：${error.stack}`)
  }
})


module.exports = router