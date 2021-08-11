/**
 * @description 菜单列表
 * @augments 凉风有信、
 */

const mongoose = require('../config/db')

const menuSchema = mongoose.Schema({
  menuType: Number, // 菜单类型
  menuName: String, // 菜单名称
  menuCode: String, // 权限标识
  path: String, // 路由地址
  icon: String, // 图标
  parentId: [mongoose.Types.ObjectId],
  component: String, // 组件地址
  menuState: Number, // 菜单状态
  createTime : {
    type: Date,
    default: Date.now()
  }, //创建时间
  updateTime : {
    type: Date,
    default: Date.now()    
  } //更新时间

}, { timestamps: true })



const Menu = mongoose.model('menu', menuSchema)

module.exports = Menu