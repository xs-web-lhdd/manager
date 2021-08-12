/**
 * @description 角色列表
 * @author 凉风有信、
 */

const mongoose = require('../config/db')

const roleSchema = mongoose.Schema({
  roleName: String,
  remark: String,
  permissionList: {
    checkedKeys: [],
    halfCheckedKeys: []
  },
  createTime: {
    type: Date,
    default: Date.now()
  },
  updateTime: {
    type: Date,
    default: Date.now()
  }

}, { timestamps: true })



const Role = mongoose.model('role', roleSchema)

module.exports = Role