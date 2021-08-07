/**
 * @description vueX状态管理
 * @author 凉风有信、
 */

import { createStore } from 'vuex'
import storage from './../untils/storage'
export default createStore({
  state: {
    userInfo: "" || storage.getItem('userInfo')  // 获取用户信息
  },
  mutations: {
    saveUserInfo(state, userInfo) {
      state.userInfo = userInfo
      storage.setItem('userInfo', userInfo)
    }
  },
  actions: {
  },
  modules: {
  }
})
