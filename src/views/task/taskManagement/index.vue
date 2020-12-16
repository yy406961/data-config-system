<!--
 * @Author: your name
 * @Date: 2020-11-26 09:54:08
 * @LastEditTime: 2020-12-15 14:04:48
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data-config-system\src\views\task\taskManagement\index.vue
-->
<template>
  <div class="taskManagement">
    <!-- 搜索功能 -->
    <div class="formPart">
      <el-form ref="queryFrom" :model="query" :inline="true" size="mini" label-width="100px">
        <el-form-item label="任务编号:" prop="taskNum">
            <el-input v-model="query.taskNum" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="任务名称:" prop="taskName">
          <el-input v-model="query.taskName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="服务单位:" prop="serviceUnit">
          <el-input v-model="query.serviceUnit" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="hvr-glow" size="mini" type="primary" @click="userQuery">查询</el-button>
          <el-button class="hvr-glow" size="mini" type="primary" @click="resetForm('queryFrom')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 功能按钮 -->
    <div class="btnsPart">
      <el-button class="hvr-glow" size="mini" type="primary" @click="addTask">新增任务</el-button>
    </div>
    <!-- 表格 -->
    <div class="tablePart">
      <el-table
        :data="listData"
        stripe
        :height="tableHeight"
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
        <el-table-column label="任务编号" prop="taskNum" align="center"></el-table-column>
        <el-table-column label="任务名称" prop="taskName" align="center"></el-table-column>
        <el-table-column label="服务单位" prop="serviceUnit" align="center"></el-table-column>
        <el-table-column label="状态" prop="state" align="center">
          <template slot-scope="scope">
            <span :class="scope.row.state === '暂停中' ? 'statusOrange' :
                  scope.row.state === '已关闭' ? 'statusRed' : 'statusGreen'">
              {{ scope.row.state }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTimes" align="center"></el-table-column>
        <el-table-column label="截止时间" prop="endTimes" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="150">
          <template slot-scope="scope">
            <el-button type="text" @click="taskDetail(scope.row)" >
              <span style="color: #02D0E7">详情</span>
            </el-button>
            <el-button type="text" @click="taskSuspend(scope.row)">
              <span style="color: #E79302">暂停</span>
            </el-button>
            <el-button type="text" @click="taskClosed(scope.row)">
              <span style="color: #8B8B8B">关闭</span>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :page-size="1"
        :page-sizes="[5, 10, 15, 20]"
        :total="tableCount"
        :current-page="currentPage"
        layout="total, sizes, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange">
      </el-pagination>
    </div>
    <!-- 新增任务 -->
    <el-dialog title="新增" :visible.sync="dialogVisible" width="50%" @closed="dialogClosed">
      <el-form ref="ruleForm" :model="ruleForm" :inline="true" :rules="rules" class="demo-ruleForm" label-width="120px"
                size="mini">
        <el-form-item label="任务名称" prop="taskName">
            <el-input v-model="ruleForm.taskName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="服务单位" prop="serviceUnit">
            <el-input v-model="ruleForm.serviceUnit" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="结束时间" prop="endTimes">
          <el-date-picker v-model="ruleForm.endTimes" 
            type="date" 
            format="yyyy-MM-dd" 
            value-format="yyyy-MM-dd" 
            placeholder="请输入">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="推送方式" prop="pushType">
          <el-select v-model="ruleForm.pushType" placeholder="请选择">
            <el-option label="文件" value="文件"></el-option>
            <el-option label="数据" value="数据"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="相关凭据:">
          <el-upload
              ref="upload"
              :file-list="fileList"
              :http-request="getAttachmentAdd"
              accept=".doc, .docx, .xlsx, .xls"
              action= '#'
              :on-remove="tempRemove"
              class="upload-demo"
              multiple>
              <el-button class="upload-btn" icon="el-icon-upload" size="mini" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('ruleForm')" size="mini">确 定</el-button>
        <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { taskInfoAll, taskInfoAdd, fileUpload, taskPause, taskShut } from '@/api/task'
export default {
  name: "statistic",
  components: {
  },
  data() {
    return {
      query: {
        taskName: '',
        taskNum: '',
        serviceUnit: '',
      },
      listData: [],
      params: {
        pageSize: 5,
        pageNum: 1
      },
      tableCount: 10,
      currentPage: 1,
      dialogVisible: false,
      ruleForm: {
        taskName: '',
        serviceUnit: '',
        endTimes: '',
        pushType: ''
      },
      fileList: [],
      rules: {
        taskName: [
          { required: true, message: '请输入任务名称', trigger: 'blur' }
        ],
        serviceUnit: [
          { required: true, message: '请输入服务单位', trigger: 'blur' }
        ],
        endTimes: [
          { required: true, message: '请选择截止日期', trigger: 'change' }
        ],
        pushType: [
          { required: true, message: '请选择推送方式', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    tableHeight() {
      let h = $(window).height() - 126 - 170
      return h
    }
  },
  created() {
  },
  mounted() {
    this.getTableData()
  },
  methods: {
    // 获取表格数据
    getTableData() {
      this.listData = [
        { taskNum: '202000101', taskName: 'FK任务', serviceUnit: 'FK总队', state: '启动中', createTimes: '2020-11-23', endTimes: '2021-11-23'},
        { taskNum: '202000102', taskName: 'FK任务', serviceUnit: 'FK总队', state: '启动中', createTimes: '2020-11-23', endTimes: '2021-11-23'},
        { taskNum: '202000103', taskName: 'FK任务', serviceUnit: 'FK总队', state: '启动中', createTimes: '2020-11-23', endTimes: '2021-11-23'},
        { taskNum: '202000104', taskName: 'FK任务', serviceUnit: 'FK总队', state: '暂停中', createTimes: '2020-11-23', endTimes: '2021-11-23'},
      ]
      taskInfoAll(Object.assign(this.params, this.query)).then( res => {
        // stutas 任务状态，0关闭，1启动，2暂停
        let { data, count } = res
        data.forEach(item => {
          if (item.stutas === 0) {
            item.state = '已关闭'
          } else if (item.stutas === 1) {
            item.state = '启动中'
          } else if (item.stutas === 2) {
            item.state = '暂停中'
          }  
        })
        this.listData = data
        this.tableCount = parseInt(count)
      })
    },
    // 查询
    userQuery() {
      console.log(this.query)
      this.params.pageNum = 1
      this.currentPage = 1
      this.getTableData()
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 新增任务
    addTask() {
      this.dialogVisible = true
    },
    //文件上传
    getAttachmentAdd(params) {
      let file = new FormData()
      file.append('files',params.file)
      fileUpload(file).then( res => {
        if (res.code === '200') {
          res.data.forEach( item => {
            this.fileList.push({ name: item })
          })
        }
      })
    },
    //文件删除
    tempRemove(file, fileList) {
      this.fileList = fileList
    },
    // 弹窗确定
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          taskInfoAdd(this.ruleForm).then( res => {
            this.$message.success(res.msg)
            this.dialogVisible = false
            this.getTableData()
          })
        } else {
          console.log('error submit!!')
          return false;
        }
      });
    },
    // 弹窗关闭
    dialogClosed() {
        this.$refs.ruleForm.resetFields()
    },
    // 详情
    taskDetail(row) {
      this.$router.push({name: "bigdata.taskDetail", params: { taskNum: row.taskNum }})
    },
    // 暂停
    taskSuspend(row) {
      this.$confirm('确认暂停该任务?', '提示', {
          confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
      }).then(() => {
        taskPause({
          taskNum: row.taskNum,
        }).then( res => {
          this.$message.success(res.msg)
          this.getTableData()
        })
      }).catch(() => {
          this.$message.info('已取消')
      })
    },
    // 关闭
    taskClosed(row) {
      this.$confirm('确认关闭该任务?', '提示', {
          confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
      }).then(() => {
        taskShut({
          taskNum: row.taskNum,
        }).then( res => {
          this.$message.success(res.msg)
          this.getTableData()
        })
      }).catch(() => {
          this.$message.info('已取消')
      })
    },
    // 表格分页
    handleSizeChange(val) {
      this.params.pageSize = val
      this.currentPage = 1
      this.params.pageNum = 1
      this.getTableData()
    },
    handleCurrentChange(val) {
      this.params.pageNum = val
      this.currentPage = val
      this.getTableData()
    },
  },
  watch: {
  }
}
</script>

<style scoped lang="scss">
.taskManagement {
  height: 100%;
  background: rgba(3,79,131,0.34);
  .formPart {
    background: rgba(3,79,131,0.34);
    padding: 20px 20px 6px;
    .el-input {
      width: 190px;
    }
    .el-select {
      width: 190px;
    } 
  }
  .btnsPart {
    margin: 10px 0;
    padding: 0 10px;
    text-align: right;
  }
  .tablePart {
    margin: 0 10px;
    .statusGreen {
      color: #5AFF85;
    }
    .statusRed {
      color: #FF4848;
    }
    .statusOrange {
      color: #E79302;
    }
  }
  .demo-ruleForm {
    .el-input {
      width: 190px;
    }
    .el-select {
      width: 190px;
    } 
  }
}
</style>