<template>
  <div class="welcome">
      <h1>欢迎来到主界面：{{msg}}</h1>
      <!-- <el-button>去登陆</el-button> -->
      <router-link to="/login">
        <el-button>去登陆</el-button>
      </router-link>
  </div>
</template>

<script>
export default {
  name: 'Welcome',
  props: ['msg']
}
</script>

<style lang="scss" scoped>

</style>