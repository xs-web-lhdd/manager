<template>
  <div class="login-wrapper">
    <div class="model">
      <el-form ref="userForm" :model="user" status-icon :rules="rules">
        <div class="title">火星</div>
        <el-form-item prop="userName">
          <el-input type="text" prefix-icon="el-icon-user" v-model="user.userName"></el-input>
        </el-form-item>
        <el-form-item prop="userPwd">
          <el-input type="password" prefix-icon="el-icon-view" show-password v-model="user.userPwd"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="btn-login" @click="login">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
// 引入组件时在vite中需要加后缀如：.vue 要不然会报错 在vueCli中可以不用加

export default {
  name: 'Login',
  data() {
    return {
      user: {
        userName: '',
        userPwd: ''
      },
      rules: {
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
    }
  },
  methods: {
    login() {
      this.$refs.userForm.validate((valid) => {
        if (valid) {
          this.$api.login(this.user).then((res) => {
            this.$store.commit('saveUserInfo', res)
            this.$router.push('/Welcome')
          })
        } else { return false }
      })
    }
  },
  setup () {
    const router = useRouter()
    const goHome = () => {
      router.back()
    }


    return { goHome }
  }
}
</script>

<style lang="scss" scoped>
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f9fcff;
  width: 100vw;
  height: 100vh;
  .model{
    width: 500px;
    padding: 50px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 0 10px 3px #c7c9cbcd;
    .title{
      font-size: 50px;
      line-height: 1.5;
      text-align: center;
      margin-bottom: 30px;
    }
    .btn-login{
      width: 100%;
    }
  }
}
</style>