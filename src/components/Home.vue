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
        :default-active="activeMenu"
        background-color="#001529"
        text-color="#fff"
        router
        :collapse="isCollapse"
      >
        <TreeMenu :userMenu="userMenu"/>
      </el-menu>
    </div>
    <div :class="['content-right', isCollapse?'fold':'unfold']">
      <div class="nav-top">
        <div class="nav-left">
          <div class="menu-fold" @click="toggle"><i class="el-icon-s-fold"></i></div>
          <div class="bread">
            <BreadCrumb />
          </div>
        </div>
        <div class="userinfo">
          <el-badge :is-dot="noticeCount>0?true:false" class="notice" type="danger">
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
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import TreeMenu from './TreeMenu.vue'
import BreadCrumb from './BreadCrumb.vue'
export default {
  name: 'Home',
  components: { TreeMenu, BreadCrumb },
  data() {
    return {
      userInfo: this.$store.state.userInfo,
      isCollapse: false,
      noticeCount: 0,
      userMenu: [],
      activeMenu: location.hash.slice(1)
    }
  },
  mounted() {
    this.getNoticeCount()
    this.getMenuList()
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
    },
    async getNoticeCount() {
      try {
        const count = await this.$api.noticeCount()
        this.noticeCount = count
      } catch (error) {
        console.log(error);
      }
    },
    async getMenuList() {
      try {
        const list = await this.$api.MenuList()
        this.userMenu = list
      } catch (error) {
        console.log(error);
      }
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
      min-height: calc(100vh - 50px);
      // .main-page{
      //     height: 100%;
      // }
    }
  }
}
</style>
