/**
 * @description axios二次封装
 */
import axios from 'axios'
import config from '../config/index'
import { ElMessage } from 'element-plus'
import router from '../router/index'


const TOCKEN_INVALID = 'Token认证失败，请重新登录'
const NETWORK_ERROR = '网络异常'
 
// 创造axios实例对象，添加全局配置
const service = axios.create({
    baseURL: config.baseApi,
    timeout: 8000
})

// 请求拦截
service.interceptors.request.use((req) => {
    // TO-DO
    const headers = req.headers
    if (!headers.Authorization) {
        headers.Authorization = 'liang'
    }
    return req
})

// 响应拦截
service.interceptors.response.use((res) => {
    const { data, code, msg } = res.data
    // 成功时的请求
    if (code === 200) {
        return data
    }
    // 未登录时的错误提示
    else if (code === 40001) {
        ElMessage.error(TOCKEN_INVALID)
        setTimeout(() => {
            router.push('/login')
        }, 3000)
        return Promise.reject(TOCKEN_INVALID)
    }
    else {
        return Promise.reject(msg || NETWORK_ERROR)
    }
})

// 请求核心函数 options --- 请求配置
function request(options) {
    options.method = options.method || 'get'
    if (options.method.toLowerCase() === 'get') {
        options.params = options.data
    }

    // 根据调不同的接口获取不同数据，生产环境就是实际线上接口，开发环境就是mock平台接口
    if (config.env === 'prod') {
        service.defaults.baseURL = config.baseApi 
    }else {
        service.defaults.baseURL = config.mock ? config.mockApi : config.baseApi
    }

    return service(options)
}

export default request