/**
 * @description 菜单管理模块
 * @author 凉风有信、
 */

const router = require('koa-router')()
const util = require('../utils/util')
const Dept = require('./../models/deptSchema')
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

// 休假申请---创建、作废
router.post('/operate', async (ctx, next) => {
  const { id, action, ...params } = ctx.request.body
  const authorization = ctx.request.headers.authorization
  let { data } = util.decoded(authorization)
  if (action === 'create') {
    // 生成申请单号
    let orderNo = 'XJ'
    orderNo += util.formateDate(new Date(), 'yyyyMMdd')
    const total = await Leave.countDocuments()
    params.orderNo = orderNo + total
    // 获取用户部门ID
    let DeptId = data.deptId.pop()
    // 查找用户负责人信息
    let dept = await Dept.findById(DeptId)
    // 获取人事部门和财务部门负责人信息
    let userList = await Dept.find({ deptName: { $in: ['人事部门', '财务部门'] } })
    // 审批人
    let auditUsers = dept.userName
    // 当前审批人
    let curAuditUserName = dept.userName
    // 审批流
    let auditFlows = [
      { userId: dept.userId, userName: dept.userName, userEmail: dept.userEmail }
    ]
    userList.map(item => {
      auditFlows.push({
        userId: item.userId, userName: item.userName, userEmail: item.userEmail
      })
      auditUsers += ',' + item.userName
    })

    params.auditUsers = auditUsers
    params.curAuditUserName = curAuditUserName
    params.auditFlows = auditFlows
    params.applyUser = {
      userId: data.userId,
      userName: data.userName,
      userEmail: data.userEmail
    } // 得到用户

    let res = await Leave.create(params)
    ctx.body = util.success('', '创建成功')

  } else {
    // 软删除
    let res = await Leave.findByIdAndUpdate(id, { applyState: 5 })
    ctx.body = util.success('', '操作成功')
  }
})

module.exports = router