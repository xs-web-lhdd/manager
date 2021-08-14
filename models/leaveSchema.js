/**
 * @description 休假申请列表
 * @augments 凉风有信、
 */

const mongoose = require('../config/db')

const leaveSchema = mongoose.Schema({
  orderNo: String,
  applyType: Number,
  startTime : {
    type: Date,
    default: Date.now()
  },
  endTime : {
    type: Date,
    default: Date.now()
  },
  applyUser: {
    userName: String,
    userId: String,
    userEmail: String
  },
  leaveTime: String,
  reasons: String,
  auditUsers: String,
  curAuditUserName: String,
  auditFlows: [
    {
      userId: String,
      userName: String,
      userEmail: String
    }
  ],
  auditLogs: [
    {
      userId: String,
      userName: String,
      createTime: Date,
      remark: String,
      action: String
    }
  ],
  applyState: {
    type: Number,
    default: 1
  },
  createTime : {
    type: Date,
    default: Date.now()
  }
}, { timestamps: true })



const Leave = mongoose.model('leave', leaveSchema)

module.exports = Leave