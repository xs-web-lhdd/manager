/**
 * @description vueX状态管理
 * @author 凉风有信、
 */

import { createStore } from 'vuex'
import storage from './../untils/storage'
export default createStore({
  state: {
    userInfo: "" || storage.getItem('userInfo'),  // 获取用户信息
    menuList: storage.getItem('menuList') || [],
    actionList: storage.getItem('actionList') || [],
    noticeCount: 0
  },
  mutations: {
    saveUserInfo(state, userInfo) {
      state.userInfo = userInfo
      storage.setItem('userInfo', userInfo)
    },
    saveUserMenu(state, menuList) {
      state.menuList = menuList
      storage.setItem('menuList', menuList)
    },
    saveUserAction(state, actionList) {
      state.actionList = actionList
      storage.setItem('actionList', actionList)
    },
    saveNoticeCount(state, noticeCount) {
      state.noticeCount = noticeCount
      storage.setItem('noticeCount', noticeCount)
    }
  },
  actions: {
  },
  modules: {
  }
})
