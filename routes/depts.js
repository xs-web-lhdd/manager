/**
 * @description 菜单管理模块
 * @author 凉风有信、
 */

const router = require('koa-router')()
const util = require('../utils/util')
const Dept = require('./../models/deptSchema')

router.prefix('/api/dept')

// 部门树形列表
router.get('/list', async (ctx, next) => {
  const { deptName } = ctx.request.query
  let params = {}
  if (deptName) params.deptName = deptName
  let rootList = await Dept.find(params)
  ctx.body = util.success(rootList)
})

// 部门操作：创建、编辑、删除
router.post('/operate', async (ctx, next) => {
  const { _id, action, ...params } = ctx.request.body
  let res, info
  try {
    if (action === 'create') {
      res = await Dept.create(params)
      info = '创建成功'
    } else if (action === 'edit') {
      params.updateTime = new Date()
      res = await Dept.findByIdAndUpdate(_id, params)
      info = '编辑成功'
    } else {
      // 删除当前节点
      res = await Dept.findByIdAndDelete(_id)
      // 删除子节点
      await Dept.deleteMany({parentId: { $all: [_id] } })
      info = '删除成功'
    }
    ctx.body = util.success('',info)
  } catch (error) {
    ctx. body = util.fail(`数据库操作失败：${error.stack}`)
  }
})



module.exports = router