/**
 * @description 菜单管理模块
 * @author 凉风有信、
 */

const router = require('koa-router')()
const util = require('../utils/util')
const Menu = require('./../models/menuSchema')

router.prefix('/api/menu')

router.post('/operate', async (ctx, next) => {
  const { _id, active, ...params } = ctx.request.body
  let res, info

  try {
    if (active === 'add') {
      res = await Menu.create(params)
      info = '创建成功'
    } else if (active === 'edit') {
      params.updateTime = new Date()
      res = await Menu.findByIdAndUpdate(_id, params)
      info = '编辑成功'
    } else {
      // 删除父亲数据
      res = await Menu.findByIdAndDelete(_id)
      // 输出父数据相关的子数据
      await Menu.deleteMany({
        parentId: { $all: [ _id ]}
      })
      info = '删除成功'
    }
    ctx.body = util.success('', info)
  } catch (error) {
    ctx.body = util.fail(error.stack)
  }
})

module.exports = router