<!--
 * @Author: your name
 * @Date: 2020-11-30 15:33:52
 * @LastEditTime: 2020-12-16 10:34:32
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data-config-system\src\views\config\areaConfig\index.vue
-->
<template>
  <div class="areaConfig flex justify-between">
    <!-- 区域列表 -->
    <div class="partContent">
      <div class="partTitle flex justify-between">
        <span>区域列表</span>
        <div>
          <el-button size="mini" type="primary" @click="addArea">新增</el-button>
          <el-button size="mini" type="primary" @click="deleteArea">删除</el-button>
        </div>
      </div>
      <el-table
        :data="areaList"
        :height="areaHeight"
        stripe
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelection">
        <el-table-column type="selection" width="45"></el-table-column>
        <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
        <el-table-column label="区域编号" prop="areaNum" align="center"></el-table-column>
        <el-table-column label="区域名称" prop="areaName" align="center"></el-table-column>
        <el-table-column label="区域基站数量" prop="uliCount" align="center"></el-table-column>
        <el-table-column label="服务单位" prop="serviceUnit" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="120">
          <template slot-scope="scope">
            <el-button type="text" @click="checkArea(scope.row)">查看</el-button>
            <el-button type="text" @click="editArea(scope.row)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :page-size="1"
        :page-sizes="[5, 10, 15, 20]"
        :total="areaCount"
        :current-page="areaCurrentPage"
        layout="total, sizes, prev, pager, next"
        @size-change="areaHandleSizeChange"
        @current-change="areaHandleCurrentChange">
      </el-pagination>
    </div>
    <!-- 地图 基站列表 -->
    <div class="partContent">
      <div class="mapPart">
        <areaMap id="areaMap" 
          :mapTool="mapTool" 
          :option="mapData"
          ref="areaMap"></areaMap>
        <!-- 新增功能按钮 -->
        <div v-if="mapTool" class="keepBtn">
          <el-button size="mini" type="primary" @click="keepArea">保存</el-button>
          <el-button size="mini" type="primary" @click="cancelArea">取消</el-button>
        </div>
        <!-- 修改功能按钮 -->
        <div v-if="modifyBtn" class="modifyBtn">
          <el-button size="mini" type="primary" @click="keepModify">保存</el-button>
          <el-button size="mini" type="primary" @click="cancelModify">取消</el-button>
        </div>
      </div>

      <div class="partTitle flex justify-between">
        <span>基站列表</span>
        <div>
          <el-button size="mini" type="primary" @click="exportList">导出</el-button>
        </div>
      </div>
        
      <el-table
        :data="stationList"
        :height="stationHeight"
        stripe
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
        <el-table-column label="ULI" prop="uli" align="center"></el-table-column>
        <el-table-column label="基站地址" prop="address" align="center"></el-table-column>
        <el-table-column label="所属运营商" prop="owner" align="center"></el-table-column>
      </el-table>
      <el-pagination
        :page-size="1"
        :page-sizes="[5, 10, 15, 20]"
        :total="stationCount"
        :current-page="stationCurrentPage"
        layout="total, sizes, prev, pager, next"
        @size-change="stationHandleSizeChange"
        @current-change="stationHandleCurrentChange">
      </el-pagination>
    </div>
    <!-- 新增修改弹窗 -->
    <el-dialog :title="dialogTtitle" :visible.sync="dialogVisible" width="40%" @closed="dialogClosed">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" class="demo-ruleForm" label-width="100px"
                size="mini">
        <!-- <el-form-item label="区域编号" prop="areaNum">
          <el-input v-model="ruleForm.areaNum" placeholder="请输入"></el-input>
        </el-form-item> -->
        <el-form-item label="区域名称" prop="areaName">
          <el-input v-model="ruleForm.areaName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="服务单位" prop="serviceUnit">
          <el-select v-model="ruleForm.serviceUnit" placeholder="请选择">
            <el-option  v-for="(item, index) in unitList" :key="index + 'unit'"
              :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="经纬度集" prop="areaCoverage">
          <el-input v-model="ruleForm.areaCoverage" type="textarea" 
            :rows="4" placeholder="请输入"></el-input>
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
import { keyAreasAll, keyAreasAdd, keyAreasUpdate, keyAreaUliExport,
  keyAreasDelete, keyAreaUli } from '@/api/config'
import { serviceUigt } from '@/api/task'
export default {
  name: "areaConfig",
  data() {
    return {
      // 区域列表
      areaList: [],
      areaChosed: [],
      areaParams: {
        pageSize: 5,
        pageNum: 1
      },
      areaCount: 0,
      areaCurrentPage: 1,
      // 基站列表
      checkAreaId: '',
      checkAreaName: '',
      stationList: [],
      stationParams: {
        pageSize: 5,
        pageNum: 1
      },
      stationCount: 0,
      stationCurrentPage: 1,
      // 地图相关
      mapTool: false,
      areaBorder: {},
      mapData: {
        areaBorder: [],
        cellInfo: []
      },
      modifyBtn: false,
      // 新增修改弹窗
      dialogTtitle: '新增区域',
      dialogVisible: false,
      ruleForm: {
        areaName: '',
        serviceUnit: '',
        areaCoverage: '',
        radius: ''
      },
      unitList: [],
      rules: {
        areaName: [
          { required: true, message: '请输入区域名称', trigger: 'blur' }
        ]
      },
      modifyRow: {}
    }
  },
  computed: {
    areaHeight() {
      let h = $(window).height() - 126 - 82
      return h
    },
    stationHeight() {
      let h = ($(window).height() - 126) * 0.45 - 82
      return h
    }
  },
  created() {
  },
  mounted() {
    this.getUnitData()
    this.getAreaData()
  },
  methods: {
    // 获取所有服务单位
    getUnitData() {
      serviceUigt().then( res => {
        this.unitList = res.data
      })
    },
    // 新增
    addArea() {
      this.modifyBtn = false
      this.mapTool = true
      this.$refs.areaMap.clearAll()
    },
    // 删除
    deleteArea() {
      let length = this.areaChosed.length
      if (length === 0) {
        this.$message.warning('请至少选择一条数据')
        return
      }
      let kaList = []
      this.areaChosed.forEach(item => {
        kaList.push(item.id)
      })
      this.$confirm(`确认删除勾选的"${length}"条区域?`, '提示', {
        confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
      }).then(() => {
        keyAreasDelete({ kaList }).then( res => {
          this.getAreaData()
        })
      }).catch(() => {
        this.$message.info('已取消删除')
      })
      
    },
    // 获取区域列表
    getAreaData() {
      keyAreasAll(this.areaParams).then( res => {
        let { data, total } = res
        this.areaList = data
        this.areaCount = parseInt(total)
        // 显示第一个区域的基站列表和地图边框
        this.$nextTick(() => {
          if (this.areaList.length !== 0) {
            this.checkAreaId = this.areaList[0].areaNum
            this.getStationData()
            this.getAreaBorder(this.areaList[0].areaCoverage, this.areaList[0].radius)
            this.mapData.cellInfo = this.areaList[0].areaUliList
          }
        })
      })
    },
    // 表格选择框
    handleSelection(val) {
      this.areaChosed = val
    },
    // 查看当前行的 区域的基站列表和地图边框
    checkArea(row) {
      this.$refs.areaMap.clearAll()
      this.modifyBtn = false
      this.mapTool = false
      this.checkAreaId = row.areaNum
      this.getStationData()
      this.getAreaBorder(row.areaCoverage, row.radius)
      this.mapData.cellInfo = row.areaUliList
    },
    // 修改
    editArea(row) {
      // 编辑的时候点修改，应先获取当前行区域的边框和基站点
      if (this.mapTool) {
        this.$refs.areaMap.clearAll()
        this.mapTool = false
      }
      this.checkAreaId = row.areaNum
      this.getAreaBorder(row.areaCoverage, row.radius)
      this.mapData.cellInfo = row.areaUliList
      this.$nextTick(() => {
        
        this.modifyBtn = true
        this.$refs.areaMap.areaEdit()
      })
      // 暂存修改行的相关内容
      this.modifyRow = JSON.parse(JSON.stringify(row))
    },
    // 区域列表 表格分页
    areaHandleSizeChange(val) {
      this.areaParams.pageSize = val
      this.areaCurrentPage = 1
      this.areaParams.pageNum = 1
      this.getAreaData()
    },
    areaHandleCurrentChange(val) {
      this.areaParams.pageNum = val
      this.areaCurrentPage = val
      this.getAreaData()
    },
    // 获取区域边框 数据
    getAreaBorder(data, radius) {
      let list = data.split(',')
      let border = []
      list.forEach(item => {
        let arr = item.split(' ')
        border.push(
          { lon: arr[0], lat: arr[1] }
        )
      })
      this.mapData.areaBorder = border
      this.mapData.radius = radius
    },
    // 保存 新增 区域
    keepArea() {
      this.ruleForm = {
        areaName: '',
        serviceUnit: '',
        areaCoverage: '',
        radius: ''
      }
      this.areaBorder = this.$refs.areaMap.getOverLayData()
      if (!this.areaBorder) {
        this.$message.warning('请框选区域！')
      } else if (this.$refs.areaMap.isDrawingState()) {
        this.$message.warning('请编辑结束后再提交！')
      } else {
        this.dialogVisible = true
        this.dialogTtitle = '新增区域'
        // 将获得的经纬度填入表单
        this.ruleForm.areaCoverage = this.areaBorder.areaCoverage
        this.ruleForm.radius = this.areaBorder.radius
      }
    },
    // 取消 新增 区域
    cancelArea() {
      this.mapTool = false
      this.$refs.areaMap.clearAll()
    },
    // 保存 修改 区域
    keepModify() {
      this.dialogVisible = true
      this.dialogTtitle = '修改区域'
      let areaBorder = this.$refs.areaMap.getModifyBorder()
      delete this.modifyRow.areaUliList
      this.ruleForm = this.modifyRow
      this.ruleForm.areaCoverage = areaBorder.areaCoverage
      this.ruleForm.radius = areaBorder.radius
    },
    // 取消 修改 区域
    cancelModify() {
      this.modifyBtn = false
      // 区域边界恢复未修改的样子
      this.$refs.areaMap.redraw()
    },
    // 弹窗关闭
    dialogClosed() {
      this.$refs.ruleForm.resetFields()
    },
    // 弹窗确定
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.dialogTtitle === '新增区域') {
            this.dialogVisible = false
            keyAreasAdd(this.ruleForm).then( res => {
              this.dialogVisible = false
              this.getAreaData()
            })
          } else {
            this.dialogVisible = false
            
            keyAreasUpdate(this.ruleForm).then( res => {
              this.dialogVisible = false
              this.getAreaData()
            })
          }
        } else {
          console.log('error submit!!')
          return false;
        }
      });
    },
    // 获取基站列表
    getStationData() {
      // this.stationList = [
      //   { uli: '123', address: 'a', owner: '222'},
      //   { uli: '123', address: 'a', owner: '222'},
      // ]
      keyAreaUli(Object.assign(this.stationParams, {
        keyAreaNum: this.checkAreaId
      })).then( res => {
        let { data, total } = res
        this.stationList = data
        this.stationCount = parseInt(total)
      })
    },
    // 基站列表 表格分页
    stationHandleSizeChange(val) {
      this.stationParams.pageSize = val
      this.stationCurrentPage = 1
      this.stationParams.pageNum = 1
      this.getStationData()
    },
    stationHandleCurrentChange(val) {
      this.stationParams.pageNum = val
      this.stationCurrentPage = val
      this.getStationData()
    },
    // 导出
    exportList() {
      keyAreaUliExport({
        keyAreaNum: this.checkAreaId
      }).then(res=>{
        let blob = new Blob([res], {type: "application/vnd.ms-excel,charset=utf-8"});// 创建一个类文件对象：Blob对象表示一个不可变的、原始数据的类文件对象
        const elink = document.createElement('a')// 创建一个a标签
        elink.download = this.checkAreaId;// 设置a标签的下载属性
        elink.style.display = 'none';// 将a标签设置为隐藏
        elink.href = URL.createObjectURL(blob);// 把之前处理好的地址赋给a标签的href
        document.body.appendChild(elink);// 将a标签添加到body中
        elink.click();// 执行a标签的点击方法
        URL.revokeObjectURL(elink.href) // 下载完成释放URL 对象
        document.body.removeChild(elink)// 移除a标签
      })
    }
  },
  components: {
    areaMap: () => import('./components/areaMap')
  }
}
</script>

<style scoped lang="scss">
.areaConfig {
  height: 100%;
  .partContent {
    width: calc(50% - 6px);
    .partTitle {
      font-size: 16px;
      height: 30px;
      line-height: 30px;
      margin-bottom: 10px;
    }
    .mapPart {
      height: calc(55% - 6px);
      margin-bottom: 6px;
      overflow: hidden;
      position: relative;
      .keepBtn {
        position: absolute;
        top: 58px;
        right: 6px;
      }
      .modifyBtn {
        position: absolute;
        top: 6px;
        right: 6px;
      }
    }
  }
  .fromCount {
    color: #fff;
    .el-input {
      width: 100px;
      margin-right: 5px;  
    }
  }
}
</style>