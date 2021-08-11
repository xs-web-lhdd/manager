/**
 * 
 */

const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)
const config = require('./index')

mongoose.connect(config.URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const db = mongoose.connection

db.on('error', err => {
  console.error('mongoose connection error', err)
})

db.on('open', () => {
  console.log('mongoose 连接成功')
})

module.exports = mongoose