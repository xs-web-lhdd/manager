<template>
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item v-for="(item, index) in breadList" :key="index">
          <router-link to="/welcome" v-if="index === 0">{{item.meta.title}}</router-link>
          <span v-else>{{item.meta.title}}</span>
        </el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script>
export default {
  name: 'BreadCrumb',
  computed: {
    breadList() {
      return this.$route.matched
    }
  },
  mounted() {
    console.log(this.$route);
  }
}
</script>

<style lang="scss" scoped>

</style>
