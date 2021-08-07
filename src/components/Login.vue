<template>
<div>
  <h1>欢迎来到登录界面</h1>
  <el-button @click="goHome">回首页</el-button>
  <Welcome msg="凉风有信、" />
</div>
</template>

<script>
import { onMounted } from '@vue/runtime-core'
import { useRouter } from 'vue-router'
// 在vite中需要加后缀如：.vue 要不然会报错 在vueCli中可以不用加
import Welcome from './Welcome.vue'

export default {
  name: 'Login',
  components: { Welcome },
  mounted() {
    this.$request({
      method: 'get',
      url: '/login',
      data: {
        name: 'hello'
      }
    }).then((res) => {
      console.log(res)
    })
  },
  setup () {
    const router = useRouter()
    const goHome = () => {
      router.back()
    }
    // const login = () => {
    //   axios.get('/login').then((result) => {
    //     console.log(result)
    //   })
    // }
    // login()

    return { goHome }
  }
}
</script>

<style lang="scss" scoped>

</style>