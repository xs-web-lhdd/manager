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
  const { applyState, type } = ctx.request.query
  const { page, skipIndex } = util.pager(ctx.request.query)
  const authorization = ctx.request.headers.authorization
  let { data } = util.decoded(authorization)
  try {
    let params = {}
    if (type == 'approve') {
      console.log(applyState);
      if ((applyState == 1) || (applyState == 2)) {
        params.curAuditUserName = data.userName
        params.$or = [{ applyState: 1 }, { applyState: 2 }]
      } else if (applyState > 2) {
        params = { 'auditFlows.userId': data.userId, applyState }
      } else {
        params = { 'auditFlows.userId': data.userId }
      }
    } else {
      params = {
        "applyUser.userId": data.userId
      }
      if (applyState) params.applyState = applyState
    }
    // if (applyState) params.applyState = applyState
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

// 审核通过还是拒绝
router.post('/approve', async (ctx, next) => {
  const { id, action, remark } = ctx.request.body
  const authorization = ctx.request.headers.authorization
  let { data } = util.decoded(authorization)
  try {
    let params = {}
    const doc = await Leave.findById(id)
    let auditLogs = doc.auditLogs || []
    if (action === 'refuse') {
      params.applyState = 3
    } else {
      // 审理通过---到下一级
      if (doc.auditFlows.length === doc.auditLogs.length) {
        ctx.body = util.success('当前申请单已处理，请勿重复提交')
        return
      } else if (doc.auditFlows.length === doc.auditLogs.length + 1) {
        params.applyState = 4
      } else if (doc.auditFlows.length > doc.auditLogs.length) {
        params.applyState = 2
        params.curAuditUserName = doc.auditFlows[doc.auditLogs.length + 1].userName
      }
    }
    auditLogs.push({
      userId: data.userId,
      userName: data.userName,
      createTime: new Date(),
      remark: remark,
      action: action === 'refuse' ? '审核拒绝' : '审核通过'
    })
    params.auditLogs = auditLogs
    let res = await Leave.findByIdAndUpdate(id, params)
    ctx.body = util.success('', '处理成功')
  } catch (error) {
    ctx.body = util.fail(`数据库查询失败：${error.stack}`)
  }
})

// 消息列表接口
router.get('/count', async (ctx, next) => {
  const authorization = ctx.request.headers.authorization
  let { data } = util.decoded(authorization)
  try {
    let params = {}
    params.curAuditUserName = data.userName
    params.$or = [{ applyState: 1 }, { applyState: 2 }]
    const total = await Leave.countDocuments(params)
    ctx.body = util.success(total)
  } catch (error) {
    ctx.body = util.fail(`查询异常：${error.stack}`)
  }
})

module.exports = router