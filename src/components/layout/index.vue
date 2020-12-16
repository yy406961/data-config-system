<template>
  <div class="layout">
    <headerCom class="elHeader"></headerCom>
    <breadcrumbCom :renderData="breadcrumbList" :showBack="showBack"></breadcrumbCom>
    <div class="elContainer">
      <router-view/>
    </div>
    <bottomCom class="elBottom"></bottomCom>
  </div>
</template>

<script>
export default {
  name: "layout",
  components: {
    headerCom: () => import('./headerCom'),
    bottomCom: () => import('./bottomCom'),
    breadcrumbCom: () => import('./breadcrumbCom'),
  },
  data() {
    return {
      showBack: false,
      breadcrumbList: [
        // { name: '任务管理', path: '/bigdata/followPerson' },
        // { name: '任务详情', path: '/bigdata/followPerson' },
      ],
      breadcrumbData: [
        {
          name: '首页',
          path: '/bigdata/home'
        },
        {
          name: '任务管理',
          path: '/bigdata/taskManagement',
          children: [
            {
              name: '任务详情',
              path: '/bigdata/taskDetail',
            }
          ]
        },
        { 
          name: '配置管理',
          path: '/bigdata/configManagement',
          children: [
            {
              name: '关注人员CDR配置',
              path: '/bigdata/cdrConfig',
            },
            {
              name: '区域配置',
              path: '/bigdata/areaConfig',
            }
          ]
        }
      ]
    }
  },
  created() {
  },
  mounted() {
    this.getBreadcrumbList()
  },
  methods: {
    getBreadcrumbList() {
      let data= this.$store.state.activeMenu
      this.breadcrumbList = []
      let temArr = []
      this.breadcrumbData.forEach(item => {
        if (item.path === data) {
          temArr.push(item)
        } else {
          if (item.children) {
            item.children.forEach(it => {
              if (it.path === data) {
                temArr.push(item)
                temArr.push(it)
              }
            })
          }
        }
      })
      this.breadcrumbList = temArr
    }
  },
  watch: {
    $route: {
      handler: function (val){
        this.showBack = val.name !== 'bigdata.home' ? true : false
        this.$store.commit('getActiveMenu', val.path)
        this.getBreadcrumbList()
        // 将当前路由存入VUEX中的 historyMenu
        let arr = this.$store.state.historyMenu
        if (val.name !== 'login') {
          let isExist = arr.find( item => {
            return item.title === val.meta.title
          })
          if (isExist === undefined) {
            if (arr.length >= 11) {
              arr.push({ title: val.meta.title, path: val.path })
            } else {
              arr.push({ title: val.meta.title, path: val.path })
            }
            this.$store.commit('getHistoryMenu', arr)
          }
        }
      },
      // 深度观察监听
      deep: true
    }
  },
  destroyed () {
    this.$store.commit('getActiveMenu', '')
    this.$store.commit('getHistoryMenu', [])
  }
}
</script>

<style scoped lang="scss">
.layout {
  height: 100%;
  position: relative;
  background: url("../../assets/img/layout/bg.png") no-repeat center;
  background-size: 100% 100%;
  color: #fff;
  .elHeader {
    width: 100%;
    height: 50px;
    // line-height: 50px;
  }
  .elContainer {
    width: calc(100% - 16px);
    height: calc(100% - 50px - 30px - 30px - 16px);
    margin: 8px;
    overflow: auto;
    background: rgba(3,79,131,0.24);
  }
  .elBottom {
    height: 30px;
    line-height: 30px;
  }
}
</style>