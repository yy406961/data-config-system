<!--
 * @Author: your name
 * @Date: 2020-11-27 09:45:29
 * @LastEditTime: 2020-11-27 09:46:53
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \data-config-system\src\views\home\index.vue
-->
<template>
  <div class="home">
    首页
    <el-button type="primary" @click="goConfig">跳配置管理</el-button>
    <el-button type="primary" @click="goTask">跳任务管理</el-button>
  </div>
</template>

<script>
export default {
  name: "home",
  data() {
    return {
    }
  },
  created() {
  },
  methods: {
    goConfig() {
      this.$router.push({ path: '/bigdata/configManagement'})
    },
    goTask() {
      this.$router.push({ path: '/bigdata/taskManagement'})
    }
  },
  components: {
  }
}
</script>

<style scoped lang="scss">
.home {
  height: 100%;
}
</style>