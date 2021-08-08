<template>
  <div class="basic-layout">
    <div :class="['nav-side', isCollapse?'fold':'unfold']">
      <!-- logo部分 -->
      <div class="logo">
        <img src="./../assets/logo.png" class="img" alt="">
        <span>Manager</span>
      </div>
      <!-- 导航菜单 -->
      <el-menu
        class="nav-menu"
        default-active="2"
        background-color="#001529"
        text-color="#fff"
        router
        :collapse=isCollapse
      >
        <el-submenu index="1">
          <template #title>
            <i class="el-icon-setting"></i>
            <span>系统管理</span>
          </template>
          <el-menu-item index="1-1">用户管理</el-menu-item>
          <el-menu-item index="1-2">菜单管理</el-menu-item>
        </el-submenu>
        <el-submenu index="2">
        <template #title>
          <i class="el-icon-location"></i>
          <span>审批管理</span>
        </template>
        <el-menu-item index="2-1">休假申请</el-menu-item>
        <el-menu-item index="2-2">待我审批</el-menu-item>
        </el-submenu>
      </el-menu>
    </div>
    <div :class="['content-right', isCollapse?'fold':'unfold']">
      <div class="nav-top">
        <div class="nav-left">
          <div class="menu-fold" @click="toggle"><i class="el-icon-s-fold"></i></div>
          <div class="bread">面包屑·</div>
        </div>
        <div class="userinfo">
          <el-badge :is-dot="true" class="notice" type="danger">
            <i class="el-icon-bell"></i>
          </el-badge>

          <el-dropdown @command="handleLogout">
            <span class="user-link">
              {{userInfo.userName}}
              <i class="el-icon--right"></i>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="email">邮箱：{{userInfo.userEmail}}</el-dropdown-item>
                <el-dropdown-item command="logout">退出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

        </div>
      </div>
      <div class="wrapper">
        <router-view class="main-page"></router-view>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      userInfo: {
        userName: 'Jack',
        userEmail: '3042146237@qq.com'
      },
      isCollapse: false
    }
  },
  methods: {
    handleLogout(key) {
      if (key === 'email') return
      this.$store.commit('saveUserInfo', '')
      this.userInfo = null
      this.$router.push('/login')
    },
    toggle() {
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>

<style lang="scss" scoped>
.basic-layout{
  position: relative;
  .nav-side{
    overflow: hidden;
    position: fixed;
    width: 200px;
    height: 100vh;
    background-color: #001529;
    color: #fff;
    overflow-y: auto;
    transition:  width .5s;
    .logo{
      display: flex;
      align-items: center;
      font-size: 18px;
      height: 50px;
      .img{
        width: 32px;
        height: 32px;
        margin: 0 16px;
      }
    }
    .nav-menu{
      height: calc(100vh - 50px);
      border-right: none;
    }
    // 合并
    &.fold{
      width: 64px;
    }
    // 展开
    &.unfold{
      width: 200px;
    }
  }
  .content-right{
    transition:  margin-left .5s;
    margin-left: 200px;
    // 合并
    &.fold{
      margin-left: 64px;
    }
    // 展开
    &.unfold{
      margin-left: 200px;
    }
    .nav-top{
      height: 50px;
      line-height: 50px;
      display: flex;
      justify-content: space-between;
      padding: 0 20px;
      border-bottom: 1px solid #ddd;
      .nav-left{
        display: flex;
        align-items: center;
        .menu-fold{
          margin-right: 15px;
          font-size: 18px;
        }
      }
      .userinfo{
        cursor: pointer;
        .notice{
          line-height: 30px;
          margin-right: 20px;
        }
        .user-link{
          color: #4091ff;
        }
      }
    }
    .wrapper{
      background: #eef0f3;
      padding: 20px;
      height: calc(100vh - 50px);
      .main-page{
          background: #fff;
          height: 100%;
      }
    }
  }
}
</style>
