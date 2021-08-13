/**
 * @description 用户管理模块
 * @author 凉风有信、
 */
const router = require('koa-router')()
const jwt = require('jsonwebtoken')
const User = require('../models/userSchema')
const Menu = require('../models/menuSchema')
const Role = require('../models/roleSchema')
const Counter = require('../models/counterSchema')
const utils = require('../utils/util')
const md5 = require('md5')
const util = require('../utils/util')
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
      userPwd: md5(userPwd)
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
    if (!userName || !userEmail || !deptId) {
      ctx.body = utils.fail('参数错误', utils.CODE.PARAM_ERROR)
      return
    }
    const res = await User.findOne({ $or: [ { userName }, { userEmail } ] }, '_id userName userEmail')
    if (res) {
      ctx.body = utils.fail(`系统检测到有重复的用户，信息如下：${res.userName}---${res.userEmail}`)
      return
    }
    const doc = await Counter.findOneAndUpdate({ _id: 'userId' }, { $inc: { sequence_value: 1 } }, { new: true })
    try {
      const user = new User({
        userId: doc.sequence_value,
        userPwd: md5('123456'),
        userName, userEmail, role: 1, // 默认普通用户
        roleList, job, state, deptId, mobile
      })
      user.save()
      ctx.body = utils.success({}, '创建成功')      
    } catch (error) {
      ctx.body = utils.fail(error.stack ,'用户创建失败')
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

// 获取用户对应的权限菜单
router.get('/getPermisssionList', async (ctx, next) => {
  const authorization = ctx.request.headers.authorization
  let { data } = utils.decoded(authorization)
  let menuList = await getMenuList(data.role, data.roleList)
  let actionList = getActionList(JSON.parse(JSON.stringify(menuList))) // 深克隆的简单方法
  ctx.body = utils.success({ menuList, actionList })
})

getMenuList = async (userRole, roleKeys) => {
  let rootList = []
  // 等于 0 说明是管理员
  if (userRole === 0) {
    rootList = await Menu.find({}) || []
  } else {
    roleList = await Role.find({ _id: { $in: roleKeys } })
    let permissionList = []
    roleList.map((role) => {
      const { checkedKeys, halfCheckedKeys} = role.permissionList
      permissionList = permissionList.concat([...checkedKeys, ...halfCheckedKeys])
    })
    permissionList = [...new Set(permissionList)]
    rootList = await Menu.find({ _id: { $in: permissionList } })
  }
  return util.getTreeMenu(rootList, null, [])
}

// 按钮权限过滤---从菜单中进行过滤按钮
getActionList = (list) => {
  const actionList = []
  const deep = (arr) => {
    while (arr.length) {
      let item = arr.pop()
      if (item.action) {
        item.action.map(action => {
          actionList.push(action.menuCode)
        })
      }
      if (item.children && !item.action) {
        deep(item.children);
      }
    }
  }
  deep(list)
  return actionList
}

module.exports = router
