import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store'
import Elementplus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css';
import request from './untils/request';
import storage from './untils/storage';
import './assets/style/reset.css'
import './assets/style/index.scss'
import api from './api'

const app = createApp(App)

// 全局指令
app.directive('has', {
  beforeMount: (el, binding) => {
    // 获取按钮权限
    let actionList = storage.getItem('actionList')
    let value = binding.value
    // 判断列表中是否有相应的权限标识
    let hasPermission = actionList.includes(value)
    if (!hasPermission) {
      // 元素隐藏并删除
      el.style = "display: none"
      setTimeout(() => {
        el.parentNode.removeChild(el)
      }, 0);
    }
  }
})

// 全局挂载
app.config.globalProperties.$request = request
app.config.globalProperties.$storage = storage
app.config.globalProperties.$api = api

app.use(Elementplus,{size:'small'}).use(store).use(router).mount('#app')
