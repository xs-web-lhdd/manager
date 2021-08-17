### 基于Vue3+ElementUi-Plus+Node+Mongode的全栈式后台管理系统：



#### 项目基础架子搭建：

##### 1、项目初始化&目录规范&vite细节：

###### 全局安装vue脚手架(前提)：

```js
npm install @vue/cli -g
```

查看版本：```vue --version ``` 目前4.x以上版本支持创建Vue3项目

创建项目(manager-fe是项目名称)：

```js
vue create manager-fe
```

###### 通过vite创建项目：

官网：https://vitejs.dev/

创建项目：

```bash
npm init @vitejs/app manager-fe
# 或
yarn create @vitejs/app manager-fe
```

###### 安装项目所需插件：

```bash
# 安装项目生产依赖
yarn add vue-router@next vuex@next element-plus axios -S
# 安装项目开发依赖
yarn add sass -S
```

element-plus文档：[Element Plus - The world's most popular Vue 3 UI framework (gitee.io)](https://element-plus.gitee.io/#/zh-CN/component/installation)

###### VSCode插件：

像vscode中的插件Eslint Vetur Prettier就不再赘述了，想必大家应该都有

###### 项目目录：

```bash
manager-fe
	node_modules # 包
	public
	src
		api # 统一管理接口
		assets # 管理静态文件 css img等
			images
			style # 存放样式
				index.scss # 公共演示
				reset.css # 重置基本样式
		components # 组件
		config # 项目配置 mockApi等
		router # 路由
		store # vueX
		untils # 工具函数   应该是utils当时手误，嘿嘿嘿
		view # vue文件
		App.vue
		main.js
	.env.dev # 环境变量
	.gitignore # 不提交到git上的文件
	README.md
	index.html
	package.json
	vite.config.js # vite配置文件 可参考官网进行配置https://vitejs.dev/config/
	yarn.lock
```

###### vite的细节点：	

​	可通过**`import.meta.env`**查看环境变量，官网解释：https://vitejs.dev/guide/env-and-mode.html

​	改变为开发环境：在package.json中："dev": "vite --mode dev"

​	vite创建的项目不像vue cli创建的项目（在选中vueX vueRouter）时会自动创建router store文件夹以及入口文件，这需要自己进行创建

​	vite在引入组件时一定要把后缀.vue加上，否则会报错

```js
import xxx from './xxx.vue'
// vite中.vue后缀不能少，vue-cli可以不用加（会自动加）
```

​	在vite.config.js中配置端口、代理：

```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: 'localhost',
    port: 8080,
    proxy:{
      "/api":{
        target:"http://localhost:3000"
      }
    }
  },
  plugins: [vue()]
})
```

##### 2、三种路由跳转：

router-link

```vue
静态：<router-link to="/login">跳转</router-link>
动态： <router-link :to="`/login/${item.id}`">跳转</router-link>
```

options API跳转

```js
this.$router.push('/welcome')
```

composition API跳转

```js
import { useRouter } from 'vue-router'
const router = useRouter()
router.push('/welcome')
```

##### 3、全局导入ElementPlus：

在main.js中：

```js
import Elementplus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css' // 样式

app.use(Elementplus)
```

##### 4、环境配置：

```js
const env = import.meta.env.MODE || 'prod'; // vite中通过import.meta.env得到环境变量
const EnvConfig = {
    // 开发环境 --- 对应的实际接口和mock接口
    dev: {
        baseApi: '/api',
        mockAPi: 'https://www.fastmock.site/mock/b846b9ca901d017a72546d2589b4eb0d/api'
    },
    // 测试环境 --- 对应的实际接口和mock接口
    test: {
        baseApi: '//test.xxx.com/api',
        mockAPi: 'https://www.fastmock.site/mock/b846b9ca901d017a72546d2589b4eb0d/api'
    },
    // 生产环境 --- 对应的实际接口和mock接口
    prod: {
        baseApi: '//test.xxx.com/api',
        mockAPi: 'https://www.fastmock.site/mock/b846b9ca901d017a72546d2589b4eb0d/api'
    }
}
export default {
    env,
    mock: false, // mock总开关
    namespace: 'manager', // 命名空间---防止localstorage中变量多了重名而导致覆盖
    ...EnvConfig[env]
}
```

​	这里面的mock平台是fastmock，用法可以去看文档：[Mock.js (mockjs.com)](http://mockjs.com/)

##### 5、axios二次封装：

本项目是API统一管理

```js
/**
 * @description axios二次封装
 * @author 凉风有信、
 */
 import axios from 'axios'
 import config from './../config'
 import { ElMessage } from 'element-plus'
 import router from './../router'
 import storage from './storage'
 
 const TOKEN_INVALID = 'Token认证失败，请重新登录'
 const NETWORK_ERROR = '网络请求异常，请稍后重试'
 
 // 创建axios实例对象，添加全局配置
 const service = axios.create({
     baseURL: config.baseApi,
     timeout: 8000
 })
 
 // 请求拦截
 service.interceptors.request.use((req) => {
     const headers = req.headers;
     const { token = "" } = storage.getItem('userInfo') || {};
     if (!headers.Authorization) headers.Authorization = 'Bearer ' + token;
     return req;
 })
 
 // 响应拦截
 service.interceptors.response.use((res) => {
     const { code, data, msg } = res.data;
     if (code === 200) {
         return data;
     } else if (code === 500001) {
         ElMessage.error(TOKEN_INVALID)
         setTimeout(() => {
             router.push('/login')
         }, 1500)
         return Promise.reject(TOKEN_INVALID)
     } else {
         ElMessage.error(msg || NETWORK_ERROR)
         return Promise.reject(msg || NETWORK_ERROR)
     }
 })
 /**
  * 请求核心函数
  * @param {*} options 请求配置
  */
 function request(options) {
     options.method = options.method || 'get'
     if (options.method.toLowerCase() === 'get') {
         options.params = options.data;
     }
     let isMock = config.mock;
     // 如果请求传mock那么就按请求的mock来，如果没有传就按全局mock来，这里请求时传的mock就好比一个小开关，而全局mock好比总开关，这里用一个isMock变量，改的时候改isMock而不直接改config.mock防止改全局mock出错
     if (typeof options.mock != 'undefined') {
         isMock = options.mock;
     }
     if (config.env === 'prod') {
         service.defaults.baseURL = config.baseApi
     } else {
         service.defaults.baseURL = isMock ? config.mockAPi : config.baseApi
     }
 
     return service(options)
 }
// 上面是为统一接口做准备
// 下面是为直接调.get .post这种请求方式做准备
 ['get', 'post', 'put', 'delete', 'patch'].forEach((item) => {
     request[item] = (url, data, options) => {
         return request({
             url,
             data,
             method: item,
             ...options
         })
     }
 })
 
 export default request;
 
```

拦截器可以参考以下文章：[axios拦截器封装http请求，刷新token重发请求 (juejin.cn)](https://juejin.cn/post/6844903894481371143)

​	[axios 请求拦截器&响应拦截器 - 简书 (jianshu.com)](https://www.jianshu.com/p/6e10aaf4688b)

##### 6、全局挂载：

在main.js中：

```js
// 引入：
import request from './untils/request';
// 挂载：
app.config.globalProperties.$request = request
```

因为在该项目中是采用统一接口管理的模式，因此需要全局挂载API：

```js
// 引入：
import api from './api'
// 挂载：
app.config.globalProperties.$api = api
```

##### 7、storage二次封装（统一管理）：

```js
// 引入命名空间
import config from './../config/index'

export default {
  setItem(key, value) {
    let storage = this.getStorage()
    storage[key] = value
    window.localStorage.setItem(config.namespace, JSON.stringify(storage))
  },
  getItem(key) {
    return this.getStorage()[key]
  },
  getStorage() {
    return JSON.parse(window.localStorage.getItem(config.namespace) || "{}")
  },
  clearItem(key) {
    let storage = this.getStorage()
    delete storage[key]
    window.localStorage.setItem(config.namespace, JSON.stringify(storage))
  },
  clearAll() {
    window.localStorage.clear()
  }
}
```

​	在这个封装中要注意一些细节：在取出来进行操作时要JSON.parse转化为对象，当往loaclstorage里面存储时要JSON.stringify转化为字符串，中间还有一个命名空间，防止loaclstorage多了之后名称重复然后进行覆盖，这个封装还是很秒的

​	写完之后记得在全局进入：

```js
import storage from './untils/storage'
app.config.globalProperties.$storage = storage
```

到这里基本架子搭建完毕，后面就是业务开发了！！！嘿嘿嘿


#### 样式细节总结：

##### 1、calc()函数：

通过calc函数计算出高度

```css
height: calc(100vh - 50px);
// 用vh盛满整个屏幕
```

详请见：https://www.runoob.com/cssref/func-calc.html

##### 2、translation：

指定某个东西发生变化时产生过渡：像：宽度：

```js
transition:  margin-left .5s;
// 指定对margin-left产生过渡
```

详情见：https://www.runoob.com/cssref/css3-pr-transition-property.html

#### Element-Plus组件详情：

##### 1、表单验证：

需要在el-form-item中添加:rules，然后可以在script中定义规则，也可以直接在:rules后面添加规则，一般在script中添加规则

```js
      rules: {
        // 指定对谁进行验证：
        userName: [
          {
            required: true, message: '请输入用户名', trigger: 'blur'
          }
        ],
        userPwd: [
          {
            required: true, message: '请输入密码', trigger: 'blur'
          }
        ]
      }
```

验证：

在写验证规则时需要给el-form上绑定一个ref，然后在调用验证时获取到dom节点进行验证

```js
      this.$refs.userForm.validate((valid) => {
        if (valid) {
		   通过校验时执行的操作
        } else { return false }
      })
```

​		官方文档：[组件 | Element (element-plus.org)](https://element-plus.org/#/zh-CN/component/form)

###### 表单重置：

结构：

```vue
          <el-button @click="() => handleReset('ruleForm')">重置</el-button>
```

事件：

```js
// 接受的参数是dom上绑的ref对象
const handleReset = (form) => { 
     ctx.$refs[form].resetFields()
}
// .resetFields()是ElementPlus自带的方法
```

在重置的时候记得加prop

##### 2、下拉框使用：

el-dropdown有command事件

```vue
          <el-dropdown @command="handleLogout">
            <span class="user-link">
              {{userInfo?.userName}}
              <i class="el-icon--right"></i>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="email">邮箱：{{userInfo?.userEmail}}</el-dropdown-item>
                <el-dropdown-item command="logout">退出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
```

用@command进行事件绑定，然后根据值的不同执行不同事件

```js
    handleLogout(key) {
      if (key === 'email') return
      this.$store.commit('saveUserInfo', '')
      this.userInfo = null
      this.$router.push('/login')
    }
```

​	官方网址：[组件 | Element (element-plus.org)](https://element-plus.org/#/zh-CN/component/dropdown)

##### 3、面包屑的实现：

```vue
<template>
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item v-for="(item, index) in breadList" :key="index">
          <router-link to="/Welcome" v-if="index === 0">{{item.meta.title}}</router-link>
          <span v-else>{{item.meta.title}}</span>
        </el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script>
export default {
  name: 'BreadCrumb',
  computed: {
    breadList() {
      // 精髓：通过route得到相应的路由数组，然后进行循环遍历
      return this.$route.matched
    }
  }
}
</script>
```

this.$route.matched是路由的数组，能拿到路由相关的信息，然后得到path，name等所需信息，用router-link做一个锚点，点击首页时跳到首页（因为任何页面都是由首页跳转过来的，所以matched中第一个必然是首页路由，因此可通过一个if语句+router-link进行跳转）

​	官方网址：[组件 | Element (element-plus.org)](https://element-plus.org/#/zh-CN/component/breadcrumb)

##### 4、侧边栏菜单递归组件使用：

```vue
  <template v-for="menu in userMenu" :key="menu._id">
        <el-submenu v-if="menu.children && menu.children.length > 0 && menu.children[0].menuType==1" :index="menu.path">
          <template #title>
            <i :class="menu.icon"></i>
            <span>{{menu.menuName}}</span>
          </template>
          <TreeMenu :userMenu="menu.children"/>
        </el-submenu>
        <el-menu-item v-else-if="menu.menuType == 1" :index="menu.path">{{menu.menuName}}</el-menu-item>
  </template>
```

​	像导航这种就需要使用递归组件，在使用递归组件时要设置跳出递归的条件，否则会无限递归，就会报爆栈的错误，在该项目中使用递归组件时需要结合接口文档中的菜单列表，如果该菜单下面有子菜单，而且子菜单的数组长度不为0，而且子菜单下面的子菜单还是菜单而不是按钮的时候才进行递归组件，否则就展示该菜单下面的子菜单，不展示该菜单下面的按钮......说的有点啰里啰唆了，大家看上面if条件再看接口文档应该能看懂！！！溜了溜了......

​	对了，这个里面还有一个小细节就是通过``` location.hash.slice(1) ```获取当前的路由地址，然后把当前都有地址在侧边栏中设置为高亮......貌似又迷糊了，看Home.vue中12行和67行代码吧！！！

​	侧边栏：官方文档：[组件 | Element (element-plus.org)](https://element-plus.org/#/zh-CN/component/menu)

##### 5、表格：

```vue
      <el-table
        :data="userList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"/>
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :formatter="item.formatter"
          align="center"
        >
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="150"
          align="center"
        >
          <template #default="scope">
            <el-button @click="handleEdit(scope.row)" size="mini" v-has="'user-edit'">编辑</el-button>
            <el-button type="danger" size="mini" @click="() => handleDel(scope.row)" v-has="'user-delete'">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
```

​	在操作时需要用到插槽放按钮，通过```:data="userList"```循环遍历出从后端拿到的数据，遍历出表格每一列	

​	在Vue中想要获取到全局挂载的对象（好比vue2中的this），需要用到getCurrentInstance

官方文档：[组合式 API | Vue.js (vuejs.org)](https://v3.cn.vuejs.org/api/composition-api.html#getcurrentinstance)

```js
// 引入
import { getCurrentInstance } from 'vue'
// 实例化调用
const { proxy } = getCurrentInstance()
// 使用
proxy.$api.getUserList(params) // 调用全局挂载的api发送请求
```

###### 消息提示：

```js
proxy.$message.success('删除成功')
```

也可通过全局的proxy进行使用

###### 全选：

```js
// 在el-table上面绑定
@selection-change="handleSelectionChange"
// 执行事件    
const handleSelectionChange = (list) => {
    // list里面有所有选中的行的所有信息，可以根据里面的信息执行一系列操作
}
```

###### 格式化：

```js
// 在el-table-column绑定
:formatter="item.formatter"
// 在el-table-column中循环的数组中定义formatter
  { 
    label: '用户角色',
    prop: 'role',
    formatter(row, column, value) {  //格式化 --- 根据不同的数值转换为不同的名称
      return {
        0: '管理员',
        1: '普通用户'
      }[value]
    } 
  }
```

##### 7、分页：

```vue
      <el-pagination
        class="pagination"
        background
        layout="prev, pager, next"
        :total="pager.total"
        :page-size="pager.pageSize"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
```

​	@current-change="handleCurrentChange"是点击换页时的事件

```js
    const handleCurrentChange = (current) => {
      // current是当前第几页码
      pager.pageNum = current
      getUserList()
    }
```

​	官网地址： [组件 | Element (gitee.io)](https://element-plus.gitee.io/#/zh-CN/component/pagination)

#####  8、级联选择器：

```vue
          <el-cascader
            v-model="userForm.deptId"
            placeholder="请选择所属部门"
            :options="deptList"
            :props="{ checkStrictly: true, value: '_id', label: 'deptName' }"
            clearable
            style="width: 100%"
          >
          </el-cascader>
```

​	注意一个细节：```:props="{ checkStrictly: true, value: '_id', label: 'deptName' }"```可以自定义value和label，做到一个映射关系，value对应_id，label对应deptName
​	官网地址：[组件 | Element (gitee.io)](https://element-plus.gitee.io/#/zh-CN/component/cascader)

#### 用户管理：

​	细节点：当点击编辑时表单弹出来，并将那一行表格里面的数据赋值到表单上面去，但是不能直接赋值，赋值的时候可以用一个一个赋值，也可以直接对对象进行赋值（用assign做一个浅拷贝），但有一个细节点是不能直接赋值，如果直接赋值那么在取消表单或者确定表单时表单重置就不起作用了，即再次点开新增的时候表单里面默认就有值，这样不是我们想要的，因此需要这样写：

```js
      proxy.$nextTick(() => {
        Object.assign(userForm, row)
      })
```

​	nextTick()作用是在dom渲染完成后再去执行代码，这样表单的初始状态就是一个空，这样点击取消或者确定后重置就会成初始状态，因为初始状态是一个空，所以再次点击新增的时候表单就是空的。

​	提到上面浅拷贝就忍不住提一下深拷贝，有一个简单的方式可以实现深拷贝：

```js
JSON.parse(JSON.stringify(menuList)) // 很方便快捷
```

​	官网解释：[全局 API | Vue.js (vuejs.org)](https://v3.cn.vuejs.org/api/global-api.html#nexttick)  [实例方法 | Vue.js (vuejs.org)](https://v3.cn.vuejs.org/api/instance-methods.html#nexttick)

##### 时间格式化：

对服务端返回的时间戳进行进一步处理：

```js
// 格式化之前的时间戳 2021-08-14T07:35:54.850+00:00  
  formateTime(value, stdValue) { // 格式化时间戳的简单方式（根据数据库返回的时间戳模型进行格式化） 2021-08-14T07:35:54.850+00:00
    return value.split('.')[0].split('T')[0] + ' ' + stdValue.toString().split(' ')[4]
  }
// 上面接收两个参数，第一个参数是世界时间（Date.now()） 第二个参数是中国标准时间(new Date())，这点细节需要注意！！！
// 格式化之后 2021-08-14 07:35:54
```

对比代码中的要简单了许多！！！嘿嘿嘿

#### 菜单管理：

##### 菜单新增：

​	在菜单管理页面新增时要接收两个参数，第一个参数是判断是那个新增（最上面的新增，还是表格右边的新增），如果是最上边的新增，那么在点开表单后父级菜单要为空，如果是右边菜单那么点开后父级菜单里面要含有当前菜单的名称:

​	上边新增：

![](C:\Users\LiuHao\Desktop\待开发项目\vue3+ele+koa+mon后台管理系统\manager-fe\src\assets\images\MenuAddTop.png)

​	

​	右边新增：

![](C:\Users\LiuHao\Desktop\待开发项目\vue3+ele+koa+mon后台管理系统\manager-fe\src\assets\images\MenuAddRight.png)

那么如果是右边的新增就要将父菜单和自身的名字赋值上去：

```js
if (type === 2) {
  menuForm.parentId = [...row.parentId, row._id].filter(item => item)
}
```

因为在模板上双向绑定的是menuForm.parentId，所以改变menuForm.parentId就可以了，因为parentdId是一个数组，所以改变后也需要是一个数组，用filter过滤一下是因为担心因为```...row.parentId```是空而导致数组里面有空，从而自己菜单名称不显示（menuForm.parentId是一个数组，里面都是菜单对应的\_id，在模板中\_id对应value，menuName对应label，这样双向绑定的\_id就会显示菜单名称（包括父菜单名称和自身菜单名称））

​	还有一个细节就是一定是父菜单的\_id在数组前边，自身菜单\_id在后边，这样在数据库中存储符合菜单间的层级关系