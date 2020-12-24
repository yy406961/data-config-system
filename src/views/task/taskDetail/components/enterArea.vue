<!--
 * @Author: your name
 * @Date: 2020-11-27 11:31:09
 * @LastEditTime: 2020-12-16 09:18:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data-config-system\src\views\task\taskDetail\components\enterArea.vue
-->
<template>
  <div class="enterArea">
    <div class="container">
      <div class="header flex items-center justify-center" v-if="warnTypeId === '1'">
        <img src="@/assets/img/task/1.png" alt="">
        <span>进入重点场所预警</span>
      </div>
      <div class="header flex items-center justify-center" v-if="warnTypeId === '2'">
        <img src="@/assets/img/task/2.png" alt="">
        <span>离开重点场所预警</span>
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
        <!-- 任务目标区域 -->
        <div class="tablePart">
          <div class="title flex justify-between">
            <span>任务目标区域</span>
            <div>
              <el-button class="hvr-glow" size="mini" type="primary" @click="addArea">新 增</el-button>
              <el-button class="hvr-glow" size="mini" type="primary" @click="deleteArea">删 除</el-button>
            </div>
          </div>
          <el-table
            :data="areaData"
            :height="tableHeight"
            stripe
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="areaSelection">
            <el-table-column type="selection" width="45"></el-table-column>
            <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
            <el-table-column label="区域编号" prop="areaNum" align="center"></el-table-column>
            <el-table-column label="区域名称" prop="areaName" align="center"></el-table-column>
            <el-table-column label="区域基站数量" prop="count" align="center"></el-table-column>
            <el-table-column label="服务单位" prop="serviceUnit" align="center"></el-table-column>
          </el-table>
          <el-pagination
            :page-size="1"
            :page-sizes="[5, 10, 15, 20]"
            :total="areaTableCount"
            :current-page="areaCurrentPage"
            layout="total, sizes, prev, pager, next"
            @size-change="areaSizeChange"
            @current-change="areaCurrentChange">
          </el-pagination>
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
      <targetNumber v-if="dialogVisible" @numberAdd="numberAdd"></targetNumber>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="submitForm">确 定</el-button>
        <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 添加任务目标区域  -->
    <el-dialog title="添加任务目标区域" :visible.sync="areaDialogVisible" width="100%" top="10vh">
      <targetArea v-if="areaDialogVisible" @areaAdd="areaAdd"></targetArea>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="submitArea">确 定</el-button>
        <el-button size="mini" @click="areaDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addKeyperson, addWarnArea, queryTaskNumKP, queryTaskNumKA,
  warnAdd, updateWarnTask, deleteTaskKP, deleteTaskKeyArea } from '@/api/task'
export default {
  name: "enterArea",
  data() {
    return {
      taskNum: '',
      warnTypeId: '',
      warnHandle: '',
      // 任务目标号码
      numberData: [],
      numberChosed: [],
      numberParams: {
        pageSize: 5,
        pageNum: 1
      },
      numberTableCount: 10,
      numberCurrentPage: 1,
      // 任务目标区域
      areaData: [],
      areaChosed: [],
      areaParams: {
        pageSize: 5,
        pageNum: 1
      },
      areaTableCount: 10,
      areaCurrentPage: 1,
      // 添加任务目标号码
      dialogVisible: false,
      numberAddChosed: [],
      // 添加任务目标区域
      areaDialogVisible: false,
      areaAddChosed: []
    }
  },
  computed: {
    tableHeight() {
      let h = $(window).height() - 416
      return h
    }
  },
  created() {
  },
  mounted() {
    this.warnTypeId = sessionStorage.getItem('warnTypeId')
    this.warnHandle = sessionStorage.getItem('warnHandle')
    this.taskNum = sessionStorage.getItem('taskNum')
    if (this.warnHandle === '修改') {
      this.getNumberData()
      this.getAreaData()
    }
  },
  methods: {
    // --------------------------------任务目标号码--------------------------------
    // 任务目标号码 获取表格数据
    getNumberData() {
      this.numberData = [
        // { name: 'aa', phone: '123', type: 'a' },
        // { name: 'aa', phone: '123', type: 'a' },
        // { name: 'aa', phone: '123', type: 'a' }
      ]
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
        if (res.code === 200) {
          this.getNumberData()
        }
      })
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
        if (res.code === 200) {
          this.dialogVisible = false
          this.getNumberData()
        }
      })
    },
    // ----------------------------------------- 任务目标区域 -------------------------------------
    // 任务目标区域 获取表格数据
    getAreaData() {
      // this.areaData = [
      //   { id: 1001, name: '省政府', count: '128', unit: 'FK总队/长沙网技' },
      //   { id: 1001, name: '省政府', count: '128', unit: 'FK总队/长沙网技' },
      //   { id: 1001, name: '省政府', count: '128', unit: 'FK总队/长沙网技' },
      //   { id: 1001, name: '省政府', count: '128', unit: 'FK总队/长沙网技' },
      //   { id: 1001, name: '省政府', count: '128', unit: 'FK总队/长沙网技' },
      // ]
      queryTaskNumKA(Object.assign(this.areaParams, {
        taskNum: this.taskNum,
        warnType: this.warnTypeId,
      })).then( res => {
        let { data, total } = res
        this.areaData = data
        this.areaTableCount = parseInt(total)
      })
    },
    // 任务目标区域 表格选择框
    areaSelection(val) {
      this.areaChosed = val
    },
    // 任务目标区域 表格分页
    areaSizeChange(val) {
      this.areaParams.pageSize = val
      this.areaTableCount = 1
      this.areaParams.pageNum = 1
      this.getAreaData()
    },
    areaCurrentChange(val) {
      this.areaParams.pageNum = val
      this.areaTableCount = val
      this.getAreaData()
    },
    // 新增区域
    addArea() {
      this.areaDialogVisible = true
    },
    // 新增选中的区域
    areaAdd(val) {
      this.areaAddChosed = val
    },
    // 添加任务目标区域 确认
    submitArea() {
      console.log('areaAddChosed', this.areaAddChosed)
      let length = this.areaAddChosed.length
      if (length === 0) {
        this.$message.warning('请至少选择一条数据')
        return
      }
      let areaList = []
      this.areaAddChosed.forEach(item => {
        areaList.push(item.id)
      })
      addWarnArea({
        taskNum: this.taskNum,
        warnType: this.warnTypeId,
        areaList
      }).then( res => {
        if (res.code === 200) {
          this.areaDialogVisible = false
          this.getAreaData()
        }
      })
    },
    // 删除区域
    deleteArea() {
      let length = this.areaChosed.length
      if (length === 0) {
        this.$message.warning('请至少选择一条数据')
        return
      }
      let areaNums = []
      this.areaChosed.forEach(item => {
        areaNums.push(item.areaNum)
      })
      deleteTaskKeyArea({
        taskNum: this.taskNum,
        warnType: this.warnTypeId,
        areaNums
      }).then( res => {
        if (res.code === 200) {
          this.getAreaData()
        }
      })
    },
    // ---------------------------------------- 保存 取消 ------------------------------------
    // 保存
    addConfig() {
      if (this.warnHandle === '新增') {
        warnAdd({
          taskNum: this.taskNum,
          warnType: this.warnTypeId
        }).then( res => {
          this.$emit('warnConfig', false)
        })
      } else {
        updateWarnTask({
          taskNum: this.taskNum,
          warnType: this.warnTypeId
        }).then( res => {
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
    targetNumber: () => import('./targetNumber'),
    targetArea: () => import('./targetArea')
  }
}
</script>

<style scoped lang="scss">
.enterArea {
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