/**
 * @description API统一管理
 * @author 凉风有信、
 */

import request from './../untils/request'
export default {
  login(params) {
    return request({
      url: '/users/login',
      method: 'post',
      data: params
      // mock: true
    })
  },
  noticeCount(params) {
    return request({
      url: '/leave/count',
      method: 'get',
      data: {},
      mock: true
    })
  },
  MenuList() {
    return request({
      url: '/menu/list',
      method: 'get',
      data: {},
      mock: true
    })
  }
}