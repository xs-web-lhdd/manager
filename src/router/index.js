// 使用createWebHashHistory的好处：在上线的时候不需要ngeix的配置
import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Login from '../components/Login.vue'

const routes = [
    {
        name: 'Home',
        path: '/',
        meta: {
            title: '首页'
        },
        component:Home,
        redirect:'/Welcome',
        children: [
            {
                name: 'welcome',
                path: '/welcome',
                meta: {
                    title: '欢迎页'
                },
                component: Welcome
            },
            {
                name: 'login',
                path: '/login',
                meta: {
                    title: '注册页'
                },
                component: Login
            }
        ] 
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router