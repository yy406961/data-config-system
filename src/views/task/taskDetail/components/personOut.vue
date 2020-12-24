<!--
 * @Author: your name
 * @Date: 2020-11-27 11:31:09
 * @LastEditTime: 2020-12-16 09:33:06
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data-config-system\src\views\task\taskDetail\components\personOut.vue
-->
<template>
  <div class="personOut">
    <div class="container">
      <div class="header flex items-center justify-center" >
        <img src="@/assets/img/task/3.png" alt="" v-if="warnTypeId === '3'">
        <img src="@/assets/img/task/4.png" alt="" v-if="warnTypeId === '4'">
        <span>重点人员{{ text }}预警</span>
      </div>
      <div class="content flex items-center justify-between">
        <!-- 任务目标号码 -->
        <div class="tablePart">
          <div class="title flex justify-between">
            <span>任务目标号码</span>
            <div>
              <el-button class="hvr-glow" size="mini" type="primary" @click="addNumber">新 增</el-button>
              <el-button class="hvr-glow" size="mini" type="primary" @click="deleteNumber">删 除</el-button>
            </div>
          </div>
          <el-table
            :data="numberData"
            :height="tableHeight"
            stripe
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="numberSelection">
            <el-table-column type="selection" width="45"></el-table-column>
            <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
            <el-table-column label="姓名" prop="kpName" align="center"></el-table-column>
            <el-table-column label="手机号码" prop="kpMsisdn" align="center"></el-table-column>
            <el-table-column label="关注人员类型" prop="kpType" align="center"></el-table-column>
          </el-table>
          <el-pagination
            :page-size="1"
            :page-sizes="[5, 10, 15, 20]"
            :total="numberTableCount"
            :current-page="numberCurrentPage"
            layout="total, sizes, prev, pager, next"
            @size-change="numberSizeChange"
            @current-change="numberCurrentChange">
          </el-pagination>
        </div>
        <!-- 任务目标漫出级别 -->
        <div class="tablePart">
          <div class="title flex justify-between">
            <span>任务目标{{ text }}级别</span>
          </div>
          <div class="divPart" :style="divPart">
            <el-form ref="infoFrom" :model="info" size="mini" label-width="100px">
              <el-form-item :label="text + '等级:'" prop="level">
                <el-radio-group v-model="info.level">
                  <el-radio label="1">省级</el-radio>
                  <el-radio label="2">市级</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="省份/城市:" prop="city">
                <el-select v-model="info.city" placeholder="请选择">
                  <el-option v-for="(item, index) in cityChoseList" :key="index + 'city'"
                    :label="item.cityName" :value="item.cityName"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>
    <!-- 分割线 -->
    <img src="@/assets/img/task/line.png" alt="" class="splitLine">
    <!-- 功能按钮 -->
    <div class="configBtn">
      <el-button class="hvr-glow" size="mini" type="primary" @click="addConfig">保 存</el-button>
      <el-button class="hvr-glow" size="mini" @click="goback">取 消</el-button>
    </div>
    <!-- 目标号码新增  -->
    <el-dialog title="添加任务目标号码" :visible.sync="dialogVisible" width="100%" top="10vh">
      <targetNumber @numberAdd="numberAdd"></targetNumber>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="submitForm">确 定</el-button>
        <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addKeyperson, queryTaskNumKP, queryWarn, warnAdd, updateWarnTask,
  hnCity, deleteTaskKP } from '@/api/task'
export default {
  name: "personOut",
  data() {
    return {
      taskNum: '',
      warnTypeId: '',
      warnHandle: '',
      text: '漫入',
      // 任务目标号码
      numberData: [],
      numberChosed: [],
      numberParams: {
        pageSize: 5,
        pageNum: 1
      },
      numberTableCount: 10,
      numberCurrentPage: 1,
      // 添加任务目标号码
      dialogVisible: false,
      numberAddChosed: [],
      // 任务目标漫出级别
      info: {
        level: '1', // 漫出漫入级别 1省级，2市级
        city: ''
      },
      cityChoseList: [],
      proList: [
        { cityName: '湖南省' }
      ],
      cityList: []
    }
  },
  computed: {
    tableHeight() {
      let h = $(window).height() - 416
      return h
    },
    divPart() {
      let h = $(window).height() - 416
      return {
        height: h + 'px'
      }
    }
  },
  watch: {
    'info.level'(newval) {
      if (newval) {
        this.info.city = ''
        if (newval === '1') {
          // 漫出漫入级别 1省级，2市级
          this.cityChoseList = this.proList
        } else {
          this.cityChoseList = this.cityList
        }
      }
    }
  },
  created() {
  },
  mounted() {
    this.warnTypeId = sessionStorage.getItem('warnTypeId')
    this.text = this.warnTypeId === '3' ? '漫出' : '漫入'
    this.warnHandle = sessionStorage.getItem('warnHandle')
    this.taskNum = sessionStorage.getItem('taskNum')
    this.getCityList()
    this.cityChoseList = this.proList
    if (this.warnHandle === '修改') {
      this.getNumberData()
      this.getQueryWarnInfo()
    }
  },
  methods: {
    // 获取湖南省所有市的名字
    getCityList() {
      hnCity().then( res => {
        this.cityList = res.data
      })
    },
    // 任务目标号码 获取表格数据
    getNumberData() {
      // this.numberData = [
      //   { name: 'aa', phone: '123', type: 'a' },
      //   { name: 'aa', phone: '123', type: 'a' },
      // ]
      queryTaskNumKP(Object.assign(this.numberParams, {
        taskNum: this.taskNum,
        warnType: this.warnTypeId,
      })).then( res => {
        let { data, total } = res
        this.numberData = data
        this.numberTableCount = parseInt(total)
      })
    },
    // 任务目标号码 表格选择框
    numberSelection(val) {
      this.numberChosed = val
    },
    // 任务目标号码 表格分页
    numberSizeChange(val) {
      this.numberParams.pageSize = val
      this.numberTableCount = 1
      this.numberParams.pageNum = 1
      this.getNumberData()
    },
    numberCurrentChange(val) {
      this.numberParams.pageNum = val
      this.numberTableCount = val
      this.getNumberData()
    },
    // 新增目标号码
    addNumber() {
      this.dialogVisible = true
    },
    // 新增选中的目标号码
    numberAdd(val) {
      this.numberAddChosed = val
    },
    // 添加任务目标号码确认
    submitForm() {
      console.log('numberAddChosed', this.numberAddChosed)
      let length = this.numberAddChosed.length
      if (length === 0) {
        this.$message.warning('请至少选择一条数据')
        return
      }
      let kpids = []
      this.numberAddChosed.forEach(item => {
        kpids.push(item.id)
      })
      addKeyperson({
        taskNum: this.taskNum,
        warnType: this.warnTypeId,
        kpids
      }).then( res => {
        this.dialogVisible = false
        this.getNumberData()
      })
    },
    // 删除目标号码
    deleteNumber() {
      let length = this.numberChosed.length
      if (length === 0) {
        this.$message.warning('请至少选择一条数据')
        return
      }
      let kpIds = []
      this.numberChosed.forEach(item => {
        kpIds.push(item.id)
      })
      deleteTaskKP({
        taskNum: this.taskNum,
        warnType: this.warnTypeId,
        kpIds
      }).then( res => {
        this.getNumberData()
      })
    },
    // 获取任务目标漫出级别
    getQueryWarnInfo() {
      queryWarn({
        taskNum: this.taskNum,
        warnType: this.warnTypeId,
      }).then( res => {
        this.info.level = res.data.level
        this.$nextTick(() => {
          this.info.city = res.data.city
        })
        
      })
    },
    // 保存
    addConfig() {
      if (this.warnHandle === '新增') {
        warnAdd(Object.assign(this.info, {
          taskNum: this.taskNum,
          warnType: this.warnTypeId,
        })).then( res => {
          this.$emit('warnConfig', false)
        })
      } else {
        updateWarnTask(Object.assign(this.info, {
          taskNum: this.taskNum,
          warnType: this.warnTypeId,
        })).then( res => {
          this.$emit('warnConfig', false)
        })
      }
    },
    // 取消
    goback() {
      this.$emit('warnConfig', false)
    }
  },
  components: {
    targetNumber: () => import('./targetNumber')
  }
}
</script>

<style scoped lang="scss">
.personOut {
  height: 100%;
  .container {
    height: calc(100% - 56px);
    .header {
      text-align: center;
      color: #08E5FF;
      img {
        width: 40px;
        height: 40px;
      }
    }
    .content {
      height: calc(100% - 40px);
      .tablePart {
        width: calc(50% - 8px);
        height: 100%;
        .title {
          margin-bottom: 10px;
          height: 28px;
          line-height: 28px;
        }
      }
      .divPart {
        background: rgba(0,0,0,0.2);
        border: 1px solid #00BDFF;
        padding: 40px 50px 0;
      }
    }
  }
  .splitLine {
    width: 98%;
    margin: 12px auto;
    display: block;
  }
  .configBtn {
    text-align: center;
  }
}
</style>