<!--
 * @Author: your name
 * @Date: 2020-11-24 16:58:38
 * @LastEditTime: 2020-12-03 09:56:15
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data-config-system\src\views\login\index.vue
-->
<template>
  <div class="login">
    <div class="container">
      <div class="title">
        <img src="@/assets/img/login/title.png" alt="">
      </div>
      <div class="content">
        <el-form ref="form" :model="loginForm" :rules="rule" size="small">
          <el-form-item prop="userName">
            <el-input v-model="loginForm.userName" placeholder="请输入用户名" prefix-icon="el-icon-user-solid"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="loginForm.password" placeholder="请输入密码" prefix-icon="el-icon-unlock" show-password  @keyup.enter.native="login('form')"></el-input>
          </el-form-item>
          <el-form-item style="margin-top: 30px">
            <el-button type="primary" @click="login('form')">立 即 登 录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "login",
  components: {},
  data() {
    return {
      loginForm: {
        userName: 'admin',
        password: '123456'
      },
      rule: {
        userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },
  created() {
  },
  mounted() {
    // this.login('form')
  },
  methods: {
    login(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$router.push({ path: '/bigdata/taskManagement' })
          this.$store.commit('getActiveMenu', '/bigdata/taskManagement')
          let arr = [
            { 
              title: "任务管理",
              path: '/bigdata/taskManagement',
            }
          ]
          this.$store.commit('getHistoryMenu', arr)
        } else {
            return false;
        }
      });
    }
  }
}
</script>

<style scoped lang="scss">
.login {
  width: 100%;
  height: 100%;
  position: relative;
  .container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0,20,53,0.58);
    border: 2px solid #22AEFF;
    .title {
      padding: 19px 50px 5px;
      background: rgba(0,20,53,0.43);
    }
    .content {
      padding: 30px 40px;
      ::v-deep .el-input__inner {
        border: 0px solid #00B9FC;
        border-bottom: 1px solid #00B9FC;
        border-radius: 0;
      }
      .el-button--primary {
        width: 100%;
        background: linear-gradient(90deg, #0586B0, #1DCAEC);
        border-radius: 15px;
      }
    }
  }
}
</style>