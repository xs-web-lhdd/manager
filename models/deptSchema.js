/**
 * @description 菜单列表
 * @augments 凉风有信、
 */

const mongoose = require('../config/db')

const deptSchema = mongoose.Schema({
  deptName: String,
  userId: String,
  userName: String,
  userEmail: String,
  parentId: [mongoose.Types.ObjectId],
  createTime : {
    type: Date,
    default: Date.now()
  },
  updateTime : {
    type: Date,
    default: Date.now()    
  }
}, { timestamps: true })



const Dept = mongoose.model('dept', deptSchema)

module.exports = Dept