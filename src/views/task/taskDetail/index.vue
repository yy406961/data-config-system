<!--
 * @Author: your title
 * @Date: 2020-11-26 09:56:14
 * @LastEditTime: 2020-12-16 09:13:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data-config-system\src\views\task\taskDetail\index.vue
-->
<template>
  <div class="taskDetail">
    <!-- 任务详情基础信息 -->
    <div class="baseInfo flex flex-wrap">
      <div class="detailItem">
        <span class="detailLable">任务编号：</span><span>{{ detailDescribe.taskNum }}</span>
      </div>
      <div class="detailItem">
        <span class="detailLable">任务名称：</span><span>{{ detailDescribe.taskName }}</span>
      </div>
      <div class="detailItem">
        <span class="detailLable">服务单位：</span><span>{{ detailDescribe.serviceUnit }}</span>
      </div>
      <div class="detailItem">
        <span class="detailLable">创建时间：</span><span>{{ detailDescribe.createTimes }}</span>
      </div>
      <div class="detailItem">
        <span class="detailLable">结束时间：</span><span>{{ detailDescribe.endTimes }}</span>
      </div>
      <div class="detailItem">
        <span class="detailLable">当前状态：</span>
        <span :style="{'color': detailDescribe.state === '暂停中' ? '#E79302' : 
          detailDescribe.state === '已关闭' ? '#FF4848' : '5AFF85'}">
          {{ detailDescribe.state }}
        </span>
      </div>
      <div class="detailItem">
        <span class="detailLable">推送方式：</span><span>{{ detailDescribe.pushType }}</span>
      </div>
      <div class="detailItem">
        <span class="detailLable">相关凭证：</span>
        <span v-for="(item, index) in detailDescribe.credential" 
          :key="'credential'+ index"
          class="credentialFile">
          <img src="@/assets/img/task/file.png" alt="">
          {{ item }}
        </span>
      </div>
    </div>
    <!-- 分割线 -->
    <img src="@/assets/img/task/line.png" alt="" class="splitLine">
    <!-- 预警模块 -->
    <div class="detailContet flex flex-wrap" v-show="!checkConfig">
      <div class="newWarn flex items-center" @click="addWarn">
        <img src="@/assets/img/task/new.png" alt=""> <span>新增预警</span>
      </div>
      <div v-for="(item, index) in currentData" :key="index+ 'content'"
        class="detailContainer">
        <div class="title">{{ item.warnType }}</div>
        <img src="@/assets/img/task/go.png" alt="" class="check" @click="checkWarn(item)">
        <div class="content">
          <div class="contentItem">
            任务目标号码：<span class="targetNum">{{ item.kpCount }}</span> 人
          </div>
          <div class="contentItem" v-if="item.kaCount">
            任务目标区域：<span class="targetNum">{{ item.kaCount }}</span> 个
          </div>
          <div class="contentItem" v-if="item.assemble">
            任务聚集阈值：<span class="targetNum">{{ item.assemble }}</span> 个
          </div>
          <div class="contentItem" v-if="item.level && item.tid === 3">
            任务漫出级别：<span class="level">{{ item.level }}</span>
          </div>
          <div class="contentItem" v-if="item.level && item.tid === 4">
            任务漫入级别：<span class="level">{{ item.level }}</span>
          </div>
        </div>
        <div class="lampstand"
          :style="widthStyle">
          <i :class="['lampstandIcon', 'lampstandIcon' + item.tid]"
            :style="lampstandIconStyle"/>
          <lampstandCom :id="'lampstand' + index"></lampstandCom>
        </div>
        <div class="bottom"></div>
      </div>
    </div>
    <!-- 分页 -->
    <div class="pagebar" v-if="!checkConfig">
      <span v-for="n in totalPageNum" 
        :key="n"
        :class="['pageItem', currentNum === n ? 'active': '']"
        @click="changePage(n)">
        <span>{{ n }}</span>
      </span>
    </div>

    <!-- 查看 新增 配置 -->
    <div class="checkConfig" v-if="checkConfig">
      <!-- 进入重点场所预警 -->
      <enterArea v-if="showConfig === 1" @warnConfig="warnConfig"></enterArea>
      <!-- 离开指定场所预警 -->
      <enterArea v-if="showConfig === 2" @warnConfig="warnConfig"></enterArea>
      <!-- 人员漫出预警 -->
      <personOut v-if="showConfig === 3" @warnConfig="warnConfig"></personOut>
      <!-- 人员漫入预警 -->
      <personOut v-if="showConfig === 4" @warnConfig="warnConfig"></personOut>
      <!-- 人员聚集预警 -->
      <personGather v-if="showConfig === 5" @warnConfig="warnConfig"></personGather>
      <!-- 重点人员异常行为预警 -->
      <personUnusual v-if="showConfig === 6" @warnConfig="warnConfig"></personUnusual>
    </div>

    <!-- 新增预警 -->
    <el-dialog title="新增预警" :visible.sync="dialogVisible" width="30%">
      <el-form ref="ruleForm" :model="ruleForm" :inline="true" class="demo-ruleForm" label-width="120px"
                size="mini">
        <el-form-item label="预警类别" prop="warnType">
          <el-select v-model="ruleForm.warnType" placeholder="请选择">
            <el-option 
              v-for="(item, index) in warnTypeList" :key="index + 'type'"
              :label="item.warnType" 
              :value="item.tid"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" size="mini">确 定</el-button>
        <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>


<script>
import { taskDetails } from '@/api/task'
export default {
  name: "taskDetail",
  data() {
    return {
      taskNum: '',
      detailDescribe: {
        taskNum: '20200212',
        taskName: 'FK预警任务',
        serviceUnit: 'FK总队',
        createTimes: '2020-11-24',
        endTimes: '2020-11-24',
        state: '启动中',
        pushType: 'FTP文件流',
        credential: ['文书1', '文书2', '文书3']
      },
      detailData: [
        { warnType: '进入重点场所预警', kpCount: '24531', kaCount: '2', tid: 1 },
        { warnType: '离开指定场所预警', kpCount: '24531', kaCount: '3', tid: 2 },
        { warnType: '人员漫出预警', kpCount: '24531', level: '省级', tid: 3 },
        { warnType: '人员漫入预警', kpCount: '24531', level: '省级', tid: 4 },
        { warnType: '人员聚集预警', kpCount: '24531', assemble: '3', tid: 5 },
        { warnType: '重点人员异常行为预警', kpCount: '24531', tid: 6 },
      ],
      totalPageNum: 0,
      currentData: [],
      currentNum: 1,
      checkConfig: false,
      showConfig: 0,
      // 新增预警
      dialogVisible: false,
      ruleForm: {
        warnType: ''
      },
      warnTypeList: [
        { warnType: '进入重点场所预警', tid: 1 },
        { warnType: '离开指定场所预警', tid: 2 },
        { warnType: '人员漫出预警', tid: 3 },
        { warnType: '人员漫入预警', tid: 4 },
        { warnType: '人员聚集预警', tid: 5 },
        { warnType: '重点人员异常行为预警', tid: 6 },
      ]
    }
  },
  computed: {
    widthStyle() {
      let w = ($(window).height() - 200) / 2
      return {
        width: w + 'px'
      }
    },
    lampstandIconStyle() {
      let w = ($(window).height() - 200) / 2 / 7
      return {
        width: w + 'px',
        height:  w + 'px'
      }
    }
  },
  created() {
    this.getTotalPageNum()
    this.getCurrentData(1)

    if (this.$route.params.taskNum) {
      this.taskNum = this.$route.params.taskNum
      sessionStorage.setItem('taskNum',  this.$route.params.taskNum)
    } else {
      this.taskNum = parseInt(sessionStorage.getItem('taskNum'))
    }
    this.getTaskDetails()
  },
  methods: {
    // 获取当前任务详情数据
    getTaskDetails() {
      taskDetails({
        taskNum: this.taskNum,
      }).then( res => {
        let { data } = res
        // stutas 任务状态，0关闭，1启动，2暂停
        if (data.stutas === 0) {
          data.state = '已关闭'
        } else if (data.stutas === 1) {
          data.state = '启动中'
        } else if (data.stutas === 2) {
          data.state = '暂停中'
        } 
        this.detailDescribe = data
        this.detailData = data.warnIntoVOList
        this.getTotalPageNum()
        this.getCurrentData(1)
      })
    },
    // 获取总页数
    getTotalPageNum() {
      this.totalPageNum = Math.ceil(this.detailData.length / 8)
    },
    // 切换页数
    changePage(n) {
      this.currentNum = n
      this.getCurrentData(n)
    },
    // 当前显示的预警
    getCurrentData(n) {
      let start = (n - 1) * 8
      this.currentData = this.detailData.slice(start, start + 8)
    },
    // 新增预警
    addWarn() {
      this.dialogVisible = true
    },
    // 确定新增
    submitForm() {
      if (this.ruleForm.warnType === '') {
        this.$message.warning('请选择预警类型')
        return
      }
      let isExist = this.detailData.find( item => {
          return item.tid === this.ruleForm.warnType
      })
      if (isExist !== undefined) {
        this.$message.warning('已存在该预警，请重新选择')
        return
      }
      this.dialogVisible = false
      this.checkConfig = true
      this.showConfig = this.ruleForm.warnType
      sessionStorage.setItem('warnTypeId', this.ruleForm.warnType)
      sessionStorage.setItem('warnHandle', '新增')
    },
    // 查看预警
    checkWarn(data) {
      this.checkConfig = true
      this.showConfig = data.tid
      sessionStorage.setItem('warnTypeId', data.tid)
      sessionStorage.setItem('warnHandle', '修改')
    },
    // 关闭预警配置
    warnConfig(val) {
      this.checkConfig = val
    }
  },
  destroyed () {
    sessionStorage.removeItem('warnTypeId')
    sessionStorage.removeItem('warnHandle')
  },
  components: {
    lampstandCom: () => import('./components/lampstand'),
    enterArea: () => import('./components/enterArea'),
    personGather: () => import('./components/personGather'),
    personOut: () => import('./components/personOut'),
    personUnusual: () => import('./components/personUnusual'),
  }
}
</script>

<style scoped lang="scss">
.taskDetail {
  height: 100%;
  background: url("~@/assets/img/task/bg.png") no-repeat center;
  background-size: 100% 100%;
  .baseInfo {
    font-size: 14px;
    padding: 12px 30px 8px;
    .detailItem {
      width: 20%;
      color: #E5F2FF;
      height: 35px;
      line-height: 35px;
      &:last-child {
        width: 40%;
      }
      .detailLable {
        color: #84C1FF;
      }
      .credentialFile {
        color: #20FFF2;
        text-decoration: underline;
        margin-right: 10px;
        cursor: pointer;
        img {
          width: 20px;
          height: 20px;
          position: relative;
          top: 5px;
        }
      }
    }
  }
  .splitLine {
    width: 98%;
    margin: 0 auto;
    display: block;
  }
  .detailContet {
    height: calc(100% - 90px - 44px);
    padding: 24px 20px 0;
    position: relative;
    .newWarn {
      position: absolute;
      top: 4px;
      right: 41px;
      color: #1AD8D3;
      font-size: 13px;
      cursor: pointer;
      img {
        width: 16px;
        height: 16px;
        margin-right: 5px;
      }
    }
    .detailContainer {
      width: 25%;
      padding: 0 15px;
      margin-bottom: 14px;
      position: relative;
      height: calc(50% - 14px);
      .title {
        text-align: center;
        background: url("~@/assets/img/task/cardTitle.png") no-repeat center;
        background-size: 100% 100%;
        height: 41px;
        line-height: 33px;
        text-shadow: 1px 0 1px #fff, 0 1px 1px #fff;
      }
      .check {
        position: absolute;
        top: 55px;
        right: 50px;
        width: 12px;
        height: 12px;
        cursor: pointer;
      }
      .content {
        text-align: center;
        background: url("~@/assets/img/task/cardContent.png") no-repeat center;
        background-size: 100% 100%;
        height: calc(100% - 40px - 40px);
        .contentItem {
          color: #84C1FF;
          text-align: left;
          padding-left: 40px;
          line-height: 35px;
          .targetNum {
            color: #FCFF17;
            font-family: "LESLIE";
          }
          .level {
            color: #FF7930;
          }
        }
      }
      .lampstand {
        width: 78%;
        height: auto;
        position: absolute;
        bottom: -29px;
        margin: 0 auto;
        left: 50%;
        transform: translateX(-50%);
        .lampstandIcon {
          display: inline-block;
          position: absolute;
          left: 50%;
          transform: translate(-42%, 29%);
        }
        .lampstandIcon1 {
          background: url("~@/assets/img/task/1.png") no-repeat center;
          background-size: 100% 100%;
        }
        .lampstandIcon2 {
          background: url("~@/assets/img/task/2.png") no-repeat center;
          background-size: 100% 100%;
        }
        .lampstandIcon3 {
          background: url("~@/assets/img/task/3.png") no-repeat center;
          background-size: 100% 100%;
        }
        .lampstandIcon4 {
          background: url("~@/assets/img/task/4.png") no-repeat center;
          background-size: 100% 100%;
        }
        .lampstandIcon5 {
          background: url("~@/assets/img/task/5.png") no-repeat center;
          background-size: 100% 100%;
        }
        .lampstandIcon6 {
          background: url("~@/assets/img/task/6.png") no-repeat center;
          background-size: 100% 100%;
        }
      }
      .bottom {
        text-align: center;
        background: url("~@/assets/img/task/cardBottom.png") no-repeat center;
        background-size: 100% 100%;
        height: 40px;
      }
    }
  }
  .pagebar {
    text-align: center;
    margin: 4px 0 8px;
    .pageItem {
      position: relative;
      display: inline-block;
      width: 26px;
      height: 26px;
      background: url("~@/assets/img/task/numbg.png") no-repeat center;
      background-size: 100% 100%;
      text-align: center;
      line-height: 26px;
      margin: 0 12px;
      color: #1AD8D3;
      font-size: 14px;
      cursor: pointer;
      &:before {
        content: '';
        display: inline-block;
        position: absolute;
        top: 13px;
        left: -24px;
        width: 26px;
        height: 1px;
        border-bottom: 1px dashed #1AD8D3;
      }
      &:after {
        content: '';
        display: inline-block;
        position: absolute;
        top: 13px;
        right: -25px;
        width: 26px;
        height: 1px;
        border-bottom: 1px dashed #1AD8D3;
      }
    }
    .active {
      background: url("~@/assets/img/task/numbg1.png") no-repeat center;
      background-size: 100% 100%;
      color: #fff;
    }
  }
  .checkConfig {
    height: calc(100% - 92px);
    position: relative;
    padding: 10px 26px 14px;
  }
}
</style>