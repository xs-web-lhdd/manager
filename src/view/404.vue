<template>
  <div class="exception">
    <img src="../assets/images/404.jpeg" title="找不到相应页面......">
    <el-button class="btn-home" @click="goHome">回首页</el-button>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
export default {
  name: '404',
  setup () {
    const router = useRouter()
    const goHome = () => {
      router.push('/')
    }
    return { goHome }
  }
}
</script>

<style lang="scss" scoped>
.exception{
  position: relative;
  overflow: hidden;
  img{
    width: 100%;
    height: 100vh;
  }
  .btn-home{
    position: fixed;
    bottom: 100px;
    left: 50%;
    transform: translate(-50%, 0);
  }
}

</style>