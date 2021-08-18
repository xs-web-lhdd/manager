/**
 * @description 菜单管理模块
 * @author 凉风有信、
 */

const router = require('koa-router')()
const util = require('../utils/util')
const Menu = require('./../models/menuSchema')

router.prefix('/api/menu')

// 菜单增删：
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

// 菜单列表查询：
router.get('/list', async (ctx, next) => {
  const { menuName, menuState } = ctx.request.query
  const params = {}
  if (menuName) {
    params.menuName = menuName
  }
  if (menuState) {
    params.menuState = menuState
  }
  const rootList = await Menu.find(params) || []
  if (menuName || menuState==2) {
    ctx.body = util.success(rootList)
    return
  }
  const primissionList = util.getTreeMenu(rootList, null, [])
  ctx.body = util.success(primissionList)
})


module.exports = router