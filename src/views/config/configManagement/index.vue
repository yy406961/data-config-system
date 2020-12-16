<!--
 * @Author: your name
 * @Date: 2020-11-27 09:22:24
 * @LastEditTime: 2020-11-30 15:34:58
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \data-config-system\src\views\config\configManagement\index.vue
-->
<template>
  <div class="configManagement">
    配置管理
    <el-button type="primary" @click="click">跳关注人员CDR配置</el-button>
    <el-button type="primary" @click="goArea">跳区域配置</el-button>
  </div>
</template>

<script>
export default {
  name: "configManagement",
  data() {
    return {
    }
  },
  created() {
  },
  methods: {
    click() {
      this.$router.push({ path: '/bigdata/cdrConfig'})
    },
    goArea() {
      this.$router.push({ path: '/bigdata/areaConfig'})
    }
  },
  components: {
  }
}
</script>

<style scoped lang="scss">
.configManagement {
  height: 100%;
}
</style>