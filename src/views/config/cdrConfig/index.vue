<template>
  <div class="cdrConfig">
    <!-- 搜索功能 -->
    <div class="formPart">
      <el-form ref="queryFrom" :model="query" :inline="true" size="mini" label-width="100px">
        <el-form-item label="姓 名:" prop="kpName">
            <el-input v-model="query.kpName" placeholder="请输入"></el-input>
        </el-form-item>
        <template v-if="detailSearch">
          <el-form-item label="身份证号:" prop="idCard">
            <el-input v-model="query.idCard" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="手机号码:" prop="kpMsisdn">
            <el-input v-model="query.kpMsisdn" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="管辖单位:" prop="mgUnit">
              <el-input v-model="query.mgUnit" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="重点人类型:" prop="kpType">
              <el-input v-model="query.kpType" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="是否同步:" prop="stutas">
            <el-select v-model="query.stutas" placeholder="请选择">
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否上控:" prop="control">
            <el-select v-model="query.control" placeholder="请选择">
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状 态:" prop="stuta">
            <el-select v-model="query.stuta" placeholder="请选择">
              <el-option label="失联" value="失联"></el-option>
              <el-option label="今日在线" value="今日在线"></el-option>
              <el-option label="在网今日未在线" value="在网今日未在线"></el-option>
              <el-option label="在网近三日消失" value="在网近三日消失"></el-option>
            </el-select>
          </el-form-item>
        </template>
        <el-form-item>
          <el-button class="hvr-glow" size="mini" type="primary" @click="userQuery">查询</el-button>
          <el-button class="hvr-glow" size="mini" type="primary" @click="resetForm('queryFrom')">重置</el-button>
        </el-form-item>
        <div class="deailSpan" @click="detailSearchChange">
          <span>详细筛选</span>
          <img src="@/assets/img/up.png" alt="" v-if="detailSearch">
          <img src="@/assets/img/lower.png" alt="" v-else>
        </div>
      </el-form>
    </div>
    <!-- 功能按钮 -->
    <div class="btnsPart flex justify-end">
      <el-button class="hvr-glow" size="mini" type="primary" @click="newUserBtn">新增</el-button>
      <el-button class="hvr-glow" size="mini" type="primary" @click="controlBtn">上控</el-button>
      <el-button class="hvr-glow" size="mini" type="primary" @click="onekeyControl">一键上控</el-button>
      <el-button class="hvr-glow" size="mini" type="primary" @click="downControl">下控</el-button>
      <el-button class="hvr-glow" size="mini" type="primary" @click="modeDownload">模板下载</el-button>
      <el-upload
          ref="upload"
          :file-list="fileList"
          :http-request="importBtn"
          accept=".xlsx, .xls"
          action= '#'
          class="upload">
          <el-button class="upload-btn" icon="el-icon-upload" size="mini" type="primary">批量导入</el-button>
      </el-upload>
      <el-button class="hvr-glow" size="mini" type="primary" @click="keypersonExport">重点人信息导出</el-button>
    </div>
    <!-- 表格 -->
    <div class="tablePart">
      <el-table
        :data="listData"
        stripe
        tooltip-effect="dark"
        style="width: 100%"
        :height="tableHeight"
        @selection-change="handleSelection">
        <el-table-column type="selection" width="45"></el-table-column>
        <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
        <el-table-column label="姓名" prop="kpName" align="center"></el-table-column>
        <el-table-column label="身份证号码" prop="idCard" align="center"></el-table-column>
        <el-table-column label="人员属性" prop="kpAttr" align="center"></el-table-column>
        <el-table-column label="人员籍贯" prop="kpPlace" align="center"></el-table-column>
        <el-table-column label="电话号码" prop="kpMsisdn" align="center"></el-table-column>
        <el-table-column label="号码归属地" prop="msisdnOwner" align="center"></el-table-column>
        <el-table-column label="重点人类型" prop="kpType" align="center"></el-table-column>
        <el-table-column label="管辖单位" prop="mgUnit" align="center"></el-table-column>
        <el-table-column label="是否上控" prop="control" align="center"></el-table-column>
        <el-table-column label="是否同步" prop="stutas" align="center"></el-table-column>
        <el-table-column label="状态" prop="stuta" align="center"></el-table-column>
        <el-table-column label="最后捕获时间" prop="endTimes" align="center"  width="120" ></el-table-column>
        <el-table-column label="基站地址" prop="uliAddress" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="120">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-edit" @click="editUser(scope.row)">修改</el-button>
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
    <!-- 新增、修改弹窗 -->
    <el-dialog :title="dialogTtitle" :visible.sync="dialogVisible" width="50%" @closed="dialogClosed">
      <el-form ref="ruleForm" :model="ruleForm" :inline="true" :rules="rules" class="demo-ruleForm" label-width="120px"
                size="mini">
        <el-form-item label="姓名" prop="kpName">
            <el-input v-model="ruleForm.kpName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="idCard">
            <el-input v-model="ruleForm.idCard" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="人员属性" prop="kpAttr">
            <el-input v-model="ruleForm.kpAttr" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="人员籍贯" prop="kpPlace">
            <el-input v-model="ruleForm.kpPlace" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="kpMsisdn">
            <el-input v-model="ruleForm.kpMsisdn" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="号码归属地" prop="msisdnOwner">
          <el-input v-model="ruleForm.msisdnOwner" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="重点人类型" prop="kpType">
          <el-input v-model="ruleForm.kpType" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="管辖单位" prop="mgUnit">
          <el-input v-model="ruleForm.mgUnit" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="是否上控" prop="control">
          <el-select v-model="ruleForm.control" placeholder="请选择">
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="服务单位" prop="serviceUnit">
          <el-input v-model="ruleForm.serviceUnit" placeholder="请输入"></el-input>
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
import { pageAll, addKeyPerson, keyPersonControl, keyPersonAllControl, keyPersonUpdate,
  downloadExcelTemplate, bacthAddkeyPerson, exportExcel, keyPersonUnlock } from '@/api/config'
export default {
  name: "cdrConfig",
  components: {
  },
  data() {
    return {
      query: {
        kpName: '',
        idCard: '',
        kpMsisdn: '',
        mgUnit: '',
        kpType: '',
        stutas: '',
        control: '',
        serviceUnit: ''
      },
      detailSearch: false,
      tableChosed: [],
      listData: [],
      params: {
        pageSize: 5,
        pageNum: 1
      },
      tableCount: 10,
      currentPage: 1,
      dialogTtitle: '新增',
      dialogVisible: false,
      ruleForm: {
        kpName: '',
        idCard: '',
        kpAttr: '',
        kpPlace: '',
        kpMsisdn: '',
        msisdnOwner: '',
        kpType: '',
        mgUnit: '',
        control: '',
        serviceUnit: ''
      },
      rules: {
        kpName: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        idCard: [
          { required: true, message: '请输入身份证号码', trigger: 'blur' }
        ],
        kpMsisdn: [
          { required: true, message: '请输入手机号码', trigger: 'blur' }
        ],
        kpType: [
          { required: true, message: '请输入重点人类型', trigger: 'blur' }
        ],
        mgUnit: [
          { required: true, message: '请输入管辖单位', trigger: 'blur' }
        ],
        serviceUnit: [
          { required: true, message: '请输入服务单位', trigger: 'blur' }
        ]
      },
      fileList: [],
    }
  },
  computed: {
    tableHeight() {
      let h = $(window).height() - 126 - 170
      if (this.detailSearch) {
        return h - 47
      }
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
      // this.listData = [
      //   { id: 1, kpName: 'aa', idCard: '123', kpType: 'a', mgUnit: 'b', kpMsisdn: '222'},
      //   { id: 2, kpName: 'aa', idCard: '123', kpType: 'a', mgUnit: 'b', kpMsisdn: '222'},
      // ]
      pageAll(Object.assign(this.params, this.query)).then( res => {
        let { data, total } = res
        this.listData = data
        this.tableCount = parseInt(total)
      })
    },
    // 查询
    userQuery() {
      this.params.pageNum = 1
      this.currentPage = 1
      this.getTableData()
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 新增
    newUserBtn() {
      this.dialogVisible = true
      this.dialogTtitle = '新增'
    },
    // 上控
    controlBtn() {
      let length = this.tableChosed.length
      if (length === 0) {
        this.$message.warning('请至少选择一条数据')
        return
      }
      let kpList = []
      this.tableChosed.forEach(item => {
        kpList.push(item.id)
      })
      this.$confirm(`确认对勾选的"${length}"条信息进行上控?`, '提示', {
        confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
      }).then(() => {
        keyPersonControl({
          kpList
        }).then( res => {
          this.$message.success('上控成功')
          this.getTableData()
        })
      }).catch(() => {
        this.$message.info('已取消上控')
      })
    },
    // 一键上控
    onekeyControl() {
      keyPersonAllControl().then( res => {
        this.$message.success('一键上控成功')
        this.getTableData()
      })
    },
    // 下控
    downControl() {
      let length = this.tableChosed.length
      if (length === 0) {
        this.$message.warning('请至少选择一条数据')
        return
      }
      let kpList = []
      this.tableChosed.forEach(item => {
        kpList.push(item.id)
      })
      this.$confirm(`确认对勾选的"${length}"条信息进行下控?`, '提示', {
        confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
      }).then(() => {
        keyPersonUnlock({
          kpList
        }).then( res => {
          this.$message.success('下控成功')
          this.getTableData()
        })
      }).catch(() => {
        this.$message.info('已取消下控')
      })
    },
    // 模板下载
    modeDownload() {
      downloadExcelTemplate().then(res=>{
        this.exportFun(res, '模板')
      })
    },
    // 下载方法
    exportFun(data, name) {
      let blob = new Blob([data], {type: "application/vnd.ms-excel,charset=utf-8"}) // 创建一个类文件对象：Blob对象表示一个不可变的、原始数据的类文件对象
      const elink = document.createElement('a')// 创建一个a标签
      elink.download = name // 设置a标签的下载属性
      elink.style.display = 'none' // 将a标签设置为隐藏
      elink.href = URL.createObjectURL(blob) // 把之前处理好的地址赋给a标签的href
      document.body.appendChild(elink) // 将a标签添加到body中
      elink.click() // 执行a标签的点击方法
      URL.revokeObjectURL(elink.href) // 下载完成释放URL 对象
      document.body.removeChild(elink) // 移除a标签
    },
    // 批量导入
    importBtn(params) {
      let file = new FormData()
      file.append('file',params.file)
      bacthAddkeyPerson(file).then( res => {
        this.$message.success(res.msg)
        this.params.pageNum = 1
        this.currentPage = 1
        this.getTableData()
      })
    },
    // 重点人信息导出
    keypersonExport() {
      let length = this.tableChosed.length
      if (length === 0) {
        this.$message.warning('请至少选择一条数据')
        return
      }
      let kpList = []
      this.tableChosed.forEach(item => {
        kpList.push(item.id)
      })
      this.$confirm(`确认导出勾选的"${length}"条信息?`, '提示', {
        confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
      }).then(() => {
        exportExcel({ kpList }).then( res => {
          this.exportFun(res, '重点人信息')
        })
      }).catch(() => {
        this.$message.info('已取消导出')
      })
    },
    // 详细筛选点击
    detailSearchChange() {
      this.detailSearch = !this.detailSearch
    },
    // 表格选择框
    handleSelection(val) {
      this.tableChosed = val
    },
    // 修改
    editUser(row) {
      this.dialogVisible = true
      this.dialogTtitle = '修改'
      this.ruleForm = JSON.parse(JSON.stringify(row))
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
    // 弹窗关闭
    dialogClosed() {
      this.$refs.ruleForm.resetFields()
    },
    // 弹窗确定
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.dialogTtitle === '新增') {
            this.dialogVisible = false
            addKeyPerson(this.ruleForm).then( res => {
              this.dialogVisible = false
              this.getTableData()
            })
          } else {
            this.dialogVisible = false
            keyPersonUpdate(this.ruleForm).then( res => {
              this.dialogVisible = false
              this.getTableData()
            })
          }
        } else {
          console.log('error submit!!')
          return false;
        }
      });
    },
  },
  watch: {
  }
}
</script>

<style scoped lang="scss">
.cdrConfig {
  height: 100%;
  background: rgba(3,79,131,0.34);
  .demo-ruleForm {
    .el-input {
      width: 190px;
    }
    .el-select {
      width: 190px;
    } 
  }
  .formPart {
    background: rgba(3,79,131,0.34);
    padding: 20px 20px 6px;
    .el-input {
      width: 190px;
    }
    .el-select {
      width: 190px;
    } 
    .deailSpan {
      color: #00B9FC;
      display: inline-block;
      cursor: pointer;
      margin-top: 4px;
      font-size: 14px;
      span {
        margin-right: 5px;
      }
    }
  }
  .btnsPart {
    margin: 10px 0;
    padding: 0 10px;
    text-align: right;
    height: 29px;
    .upload {
      margin: 0 10px;
      ::v-deep .el-upload-list {
        display: none;
      }
    }
  }
  .tablePart {
    margin: 0 10px;
  }
}
</style>