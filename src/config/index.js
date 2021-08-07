/**
 * 环境配置封装
 */
const env = import.meta.env.MODE || 'prod';
const EnvConfig = {
    // 开发环境 --- 对应的实际接口和mock接口
    dev: {
        baseApi: '/',
        mockAPi: 'https://www.fastmock.site/mock/b846b9ca901d017a72546d2589b4eb0d/api'
    },
    // 测试环境 --- 对应的实际接口和mock接口
    test: {
        baseApi: '//test.futurefe.com/api',
        mockAPi: 'https://www.fastmock.site/mock/b846b9ca901d017a72546d2589b4eb0d/api'
    },
    // 生产环境 --- 对应的实际接口和mock接口
    prod: {
        baseApi: '//futurefe.com/api',
        mockAPi: ''
    }
}
export default {
    env: 'dev',
    mock: true,
    namespace: 'manager',
    ...EnvConfig[env]
}