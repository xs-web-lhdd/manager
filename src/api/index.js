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
      // mock: true
    })
  },
  MenuList(params) {
    return request({
      url: '/menu/list',
      method: 'get',
      data: params,
      // mock: true
    })
  },
  getPermissionList() {
    return request({
      url: '/users/getPermisssionList',
      method: 'get',
      data: {},
      // mock: true
    })
  },
  getUserList(params) {
    return request({
      url: '/users/list',
      method: 'get',
      data: params,
      // mock: true
    })
  },
  userDel(params) {
    return request({
      url: '/users/delete',
      method: 'post',
      data: params,
      // mock: true
    })
  },
  getRoleList() {
    return request({
      url: '/roles/allList',
      method: 'get',
      data: {},
      // mock: true
    })
  },
  getDeptList(params) {
    return request({
      url: '/dept/list',
      method: 'get',
      data: params,
      // mock: true
    })
  },
  userSubmit(params) {
    return request({
      url: '/users/operate',
      method: 'post',
      data: params,
      // mock: true
    })
  },
  menuSubmit(params) {
    return request({
      url: '/menu/operate',
      method: 'post',
      data: params,
      // mock: true
    })
  },
  getRoleAllList(params) {
    return request({
      url: '/roles/list',
      method: 'get',
      data: params,
      // mock: true
    })
  },
  rolesOperate(params) {
    return request({
      url: '/roles/operate',
      method: 'post',
      data: params,
      // mock: true
    })
  },
  updatePermission(params) {
    return request({
      url: '/roles/update/permission',
      method: 'post',
      data: params,
      // mock: true
    })
  },
  getAllUserList(params) {
    return request({
      url: '/users/all/list',
      method: 'get',
      data: params,
      // mock: true
    })
  },
  deptOperate(params) {
    return request({
      url: '/dept/operate',
      method: 'post',
      data: params,
      // mock: true
    })
  },
  getLeaveList(params) {
    return request({
      url: '/leave/list',
      method: 'get',
      data: params,
      // mock: true
    })
  },
  leaveOperate(params) {
    return request({
      url: '/leave/operate',
      method: 'post',
      data: params,
      // mock: true
    })
  },
  leaveApprove(params) {
    return request({
      url: '/leave/approve',
      method: 'post',
      data: params,
      // mock: true
    })
  }
}