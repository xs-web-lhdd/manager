/**
 * @description 维护用户自增长表
 * @author 凉风有信、
 */
const mongoose = require('../config/db')

const counterSchema = mongoose.Schema({
  _id: String,
  sequence_value: Number,

}, { timestamps: true })



const Counter = mongoose.model('counter', counterSchema)

module.exports = Counter