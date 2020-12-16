<template>
  <div class="bottomCom  flex items-center">
    <div class="controlPart flex items-center">
      <!-- <img src="@/assets/img/layout/home.png" alt="首页" @click="goHome"> -->
      <img src="@/assets/img/layout/password.png" alt="修改密码" @click="changePassword">
      <img src="@/assets/img/layout/exit.png" alt="退出" @click="exitSystem">
    </div>
    <div class="menuPart flex">
      <div class="menuItem flex items-center" v-for="(item, index) in menuList" :key="index + 'bottom'"
        @click="menuClick(item)">
        <!-- <img src="@/assets/img/layout/person.png" alt=""> -->
        <span >{{ item.title }}</span>
        <span class="closePage" @click="removeMenu(index)">×</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "bottomCom",
  components: {},
  props: {
  },
  data() {
    return {
      menuList: []
    }
  },
  watch: {
  },
  created() {
  },
  mounted() {
    this.getMeunData()
  },
  methods: {
    getMeunData() {
      this.menuList = this.$store.state.historyMenu
    },
    // 返回首页
    goHome() {
      this.$router.push({ path: '/bigdata/home' })
    },
    // 修改密码
    changePassword() {
      console.log('修改密码')
    },
    // 退出
    exitSystem() {
      this.$confirm('此操作将退出当前系统, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          showCloseL: true,
          type: 'success',
          message: '退出成功!',
          duration: 2000
        })
        this.$store.commit('getActiveMenu', '')
        this.$store.commit('getHistoryMenu', [])
        this.$router.push({ path: '/login' })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退出'
        })
      })
    },
    // 点击底部历史菜单跳转
    menuClick(data) {
      this.$router.push({ path: data.path })
    },
    // 移除某个历史菜单
    removeMenu(index) {
      event.stopPropagation()
      this.menuList.splice(index, 1)
    }
  }
}
</script>

<style scoped lang="scss">
.bottomCom {
  background: rgba(38,128,193,0.8);
  img {
    margin: 0 10px;
    width: 16px;
    height: 16px;
    cursor: pointer;
  }
  .controlPart {
    background: #297FCC;
    height: 100%;
  }
  .menuPart {
    margin-left: 5px;
    .menuItem {
      background: #297FCC;
      padding: 0 15px 0 10px;
      position: relative;
      margin-right: 5px;
      cursor: pointer;
      font-size: 12px;
      &:hover {
        background: #48A1F0;
      }
      .closePage {
        position: absolute;
        top: -10px;
        right: 2px;
        color: #ddd;
        &:hover {
          color: #fff;
        }
      }
    }
  }
}
</style>