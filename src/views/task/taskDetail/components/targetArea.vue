<!--
 * @Author: your name
 * @Date: 2020-11-30 11:25:14
 * @LastEditTime: 2020-12-15 17:21:08
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data-config-system\src\views\task\taskDetail\components\targetArea.vue
-->
<template>
  <div class="targetArea">
    <div class="formPart">
      <el-form ref="queryFrom" :model="query" :inline="true" size="mini" label-width="100px">
        <el-form-item label="区域名称:" prop="areaName">
            <el-input v-model="query.areaName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="hvr-glow" size="mini" type="primary" @click="areaQuery">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      :data="listData"
      stripe
      tooltip-effect="dark"
      style="width: 100%"
      height="300"
      @selection-change="handleSelection">
      <el-table-column type="selection" width="45"></el-table-column>
      <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
      <el-table-column label="区域编号" prop="areaNum" align="center"></el-table-column>
      <el-table-column label="区域名称" prop="areaName" align="center"></el-table-column>
      <el-table-column label="区域基站数量" prop="uliCount" align="center"></el-table-column>
      <el-table-column label="服务单位" prop="serviceUnit" align="center"></el-table-column>
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
</template>

<script>
import { getKeyArea } from '@/api/task'
export default {
  name: "targetArea",
  data() {
    return {
      query: {
        name: ''
      },
      listData: [],
      params: {
        pageSize: 5,
        pageNum: 1
      },
      tableCount: 10,
      currentPage: 1,
    }
  },
  created() {
  },
  mounted() {
    this.getTableData()
  },
  methods: {
    // 查询
    areaQuery() {
      console.log(this.query)
      this.params.pageNum = 1
      this.currentPage = 1
      this.getTableData()
    },
    // 获取表格数据
    getTableData() {
      this.listData = [
        { areaName: '区域1', areaNum: '123', serviceUnit: 'FK总队/长沙网技', uliCount: '222'},
        { areaName: '区域2', areaNum: '124', serviceUnit: 'FK总队/长沙网技', uliCount: '222'},
        { areaName: '区域3', areaNum: '125', serviceUnit: 'FK总队/长沙网技', uliCount: '222'},
        { areaName: '区域4', areaNum: '126', serviceUnit: 'FK总队/长沙网技', uliCount: '222'},
        { areaName: '区域5', areaNum: '127', serviceUnit: 'FK总队/长沙网技', uliCount: '222'}
      ]
      getKeyArea().then( res => {
        let { data, count } = res
        this.listData = data
        this.tableCount = parseInt(count)
      })
    },
    // 表格选择框
    handleSelection(val) {
      this.$emit('areaAdd', val)
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
  components: {
  }
}
</script>

<style scoped lang="scss">
.targetArea {
  height: 100%;
  .formPart {
    background: rgba(3,79,131,0.34);
    padding: 16px 20px 0;
    margin-bottom: 10px;
  }
}
</style>