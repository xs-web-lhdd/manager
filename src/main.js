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
// 全局挂载
app.config.globalProperties.$request = request
app.config.globalProperties.$storage = storage
app.config.globalProperties.$api = api

app.use(Elementplus).use(store).use(router).mount('#app')
