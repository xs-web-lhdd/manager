// 使用createWebHashHistory的好处：在上线的时候不需要ngeix的配置
import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../components/Home.vue'

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
                    title: '欢迎体验Vue3'
                },
                component: () => import('../view/Welcome.vue')
            },
            {
                name: 'user',
                path: 'user',
                meta: {
                    title: '用户管理'
                },
                component: () => import('../view/User.vue')
            }
        ] 
    },
    {
        name: 'Login',
        path: '/login',
        meta: {
            title: '登录'
        },
        component:() => import('../view/Login.vue')
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router