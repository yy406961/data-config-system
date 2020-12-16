<template>
  <div class="headerCom flex justify-between">
    <div class="headerLeft">
      <div :class="iconToggle" @click="showMenu">
        <div class="headerCrumb"></div>
      </div>
    </div>
    <div class="headerMiddle">
      <img src="@/assets/img/layout/title.png" alt="">
    </div>
    <div class="headerRight"></div>
    <!-- 弹出菜单 -->
    <transition name="fade">
      <div class="headerMenu" v-show="menuState">
        <!-- <span class="closeMenu" @click="closeMenu">×</span> -->
        <div class="menuTitle">系统设置</div>
        <div class="menuContent">
          <div v-for="(item, index) in menuData" 
            :key="index + 'header'"
            class="menuItem">
            <div class="menuHeader flex items-center">
              <img src="@/assets/img/layout/1.png" alt="" class="menuIcon">
              <span @click="menuClick(item)">{{ item.name }}</span>
            </div>
            <div v-if="item.children">
              <p v-for="(it, i) in item.children" :key="i + 'child'"
                class="childItem"
                @click="childClick(it)">
                {{ it.name }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <div class="menuMask" v-show="menuState" :style="maskPart" @click="menuState = false"></div>
  </div>
</template>

<script>
export default {
  name: "headerCom",
  props: {
  },
  components: {},
  data() {
    return {
      menuState: false,
      menuData: [
        { 
          name: '配置管理',
          // path: '/bigdata/configManagement',
          id: 1,
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
        },
        {
          name: '任务管理',
          path: '/bigdata/taskManagement',
          id: 2
        },
      ]
    }
  },
  watch: {
  },
  computed: {
    iconToggle() {
      return ['iconToggle', this.menuState ? 'change' : '']
    },
    maskPart() {
      let h = $(window).height() - 50
      return {
        height: h + 'px'
      }
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    showMenu() {
      this.menuState = !this.menuState
    },
    closeMenu() {
      this.menuState = false
    },
    menuClick(data) {
      if (data.path) {
        this.$router.push({ path: data.path })
        this.menuState = false
      }
    },
    childClick(data) {
      this.$router.push({ path: data.path })
      this.menuState = false
    }
  }
}
</script>

<style scoped lang="scss">
.headerCom {
  color: rgba(255,255,255,0.6);
  position: relative;
  z-index: 1000;
  .headerLeft {
    width: 33%;
    // text-align: right;
    padding-right: 30px;
    padding-left: 10px;
    background: url("../../assets/img/layout/left.png") no-repeat center;
    background-size: 102% 100%;
    height: 54px;
    .iconToggle {
      position: relative;
      width: 30px;
      height: 100%;
      margin-left: 13px;
      cursor: pointer;
      z-index: 10;
      .headerCrumb {
        transition-duration: 0.4s;
        position: absolute;
        height: 2px;
        width: 19px;
        top: 26px;
        background-color: #fff;
        &:before {
            transition-duration: 0.4s;
            position: absolute;
            width: 19px;
            height: 2px;
            background-color: #fff;
            content: "";
            top: -8px;
            left: 0;
        }
        &:after {
            transition-duration: 0.4s;
            position: absolute;
            width: 19px;
            height: 2px;
            background-color:  #fff;
            content: "";
            top: 8px;
            left: 0;
        }
      }
      &:hover .headerCrumb {
        background-color: #fff;
        &:before {
          background-color: #fff;
        }
        &:after {
          background-color: #fff;
        }
      }
      &.change .headerCrumb {
        transition-duration: 0.4s;
        transform: rotateZ(90deg);
        &:before {
          transform: rotateZ(45deg) scaleX(0.75) translate(8px, -1px);
        }
        &:after {
          transform: rotateZ(-45deg) scaleX(0.75) translate(8px, 1px);
        }
      }
    }
  }
  .headerMiddle {
    width: 34%;
    text-align: center;
    background: url("../../assets/img/layout/middle.png") no-repeat center;
    background-size: 100% 100%;
    padding-top: 5px;
  }
  .headerRight {
    width: 33%;
    text-align: left;
    padding-left: 30px;
    background: url("../../assets/img/layout/right.png") no-repeat center;
    background-size: 102% 100%;
    height: 54px;
  }
  .headerMenu {
    background: rgba(0,0,0,0.8);
    color: #fff;
    position: absolute;
    top: 50px;
    width: 100%;
    z-index: 100;
    padding: 14px 30px 20px;
    .closeMenu {
      position: absolute;
      top: -13px;
      right: 6px;
      cursor: pointer;
    }
    .menuTitle {
      font-size: 14px;
      line-height: 50px;
      border-bottom: 1px solid #3AA3F0;
      margin-bottom: 10px;
    }
    .menuItem {
      line-height: 30px;
      color: #08E5FF;
      cursor: pointer;
      font-size: 13px;
      .menuHeader {
        margin: 10px 0;
        &:hover {
          color: #fff;
        }
      }
      .menuIcon {
        width: 23px;
        height: 23px;
        margin-right: 10px;
      }
      .childItem {
        padding-left: 34px;
        &:hover {
          color: #fff;
        }
      } 
    }
  }
  .menuMask {
    width: 100%;
    position: absolute;
    top: 50px;
    left: 0;
  }
}
</style>