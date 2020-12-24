<!--
 * @Author: your name
 * @Date: 2020-11-24 11:27:55
 * @LastEditTime: 2020-11-27 12:05:26
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data-config-system\src\components\layout\breadcrumbCom.vue
-->
<template>
  <div class="breadcrumbCom flex">
    <span v-for="(item, index) in renderData" :key="index + 'breadcrumbCom'"
      :class="['menuItem', 
      index === renderData.length - 1 ? 'active' : '',
      item.disabled ? 'disabled' : '']"
      @click="tabsChange(item, index)">
      {{ item.name }}
      <span v-if="index !== renderData.length - 1" class="intervalIcon">></span>
    </span>
    <img src="@/assets/img/layout/back.png" alt="" class="return" @click="returnBack" v-if="showBack">
  </div>
</template>

<script>
export default {
  name: "breadcrumbCom",
  components: {},
  props: {
    // 菜单数据
    renderData: {
      type: Array
    },
    // 是否显示返回按钮，首页不显示
    showBack: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showIndex: 0
    }
  },
  watch: {
  },
  created() {
  },
  mounted() {
  },
  methods: {
    tabsChange(item, index) {
      this.$router.push({ path: item.path })
    },
    returnBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped lang="scss">
.breadcrumbCom {
  font-size: 14px;
  position: relative;
  padding-left: 9px;
  height: 30px;
  &:before {
    content: '';
    display: inline-block;
    position: relative;
    top: 11px;
    width: 2px;
    height: 15px;
    margin-right: 6px;
    background-color: #1BA6FF;
  }
  .menuItem {
    height: 30px;
    line-height: 37px;
    cursor: pointer;
    color: #1BA6FF;
    &:hover {
      color: #1BA6FF;
    }
  }
  .intervalIcon {
    padding: 0 8px;
  }
  .active {
    color: #08E5FF;
  }
  .return {
    position: absolute;
    top: 9px;
    right: 8px;
    width: 20px;
    height: 20px;
    cursor: pointer;
  }
}
</style>