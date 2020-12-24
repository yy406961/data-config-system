<!--
 * @Author: your name
 * @Date: 2020-11-30 09:08:35
 * @LastEditTime: 2020-12-15 17:22:55
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data-config-system\src\views\task\taskDetail\components\targetNumber.vue
-->
<template>
  <div class="targetNumber flex justify-between">
    <div class="treePart">
      <div class="treeTitle">服务单位</div>
      <div class="treeContent">
        <el-tree
          show-checkbox
          :data="structureData"
          :props="defaultProps"
          node-key="id"
          default-expand-all
          @check="checkChange"
          ref="tree">
        </el-tree>
      </div>
    </div>
    <div class="tablePart">
      <div class="formPart">
        <el-form ref="queryFrom" :model="query" :inline="true" size="mini" label-width="100px">
          <el-form-item label="人员姓名:" prop="kpName">
              <el-input v-model="query.kpName" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="手机号码:" prop="kpMsisdn">
            <el-input v-model="query.kpMsisdn" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="关注人员类型:" prop="kpTypes">
            <el-input v-model="query.kpTypes" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="hvr-glow" size="mini" type="primary" @click="userQuery">查询</el-button>
            <el-button class="hvr-glow" size="mini" type="primary" @click="resetForm('queryFrom')">重置</el-button>
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
        <el-table-column label="姓名" prop="kpName" align="center"></el-table-column>
        <el-table-column label="手机号码" prop="kpMsisdn" align="center"></el-table-column>
        <el-table-column label="身份证号码" prop="idCard" align="center"></el-table-column>
        <el-table-column label="关注人员类型" prop="kpType" align="center"></el-table-column>
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
  </div>
</template>

<script>
import { getKeyPersons, serviceUigt } from '@/api/task'
export default {
  name: "targetNumber",
  data() {
    return {
      structureData: [],
      defaultProps: {
        children: 'children',
        label: 'unit'
      },
      query: {
        kpName: '',
        kpMsisdn: '',
        kpTypes: ''
      },
      tableChosed: [],
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
    this.getStructureData()
    this.getTableData()
  },
  methods: {
    // 获取服务单位数据
    getStructureData() {
      // this.structureData = [
      //   {
      //     id: 1,
      //     unit: '涉稳',
      //   },
      //   {
      //     id: 2,
      //     unit: '涉毒',
      //   },
      //   {
      //     id: 3,
      //     unit: '反恐',
      //   }
      // ]
      serviceUigt().then( res => {
        let { data } = res
        let arr = []
        data.forEach((item, index) => {
          arr.push({
            id: item,
            unit: item
          })
        })
        this.structureData = arr
      })
    },
    // 结构树点击事件
    checkChange(index, data) {
      this.getTableData(data.checkedKeys)
    },
    // 获取表格数据
    getTableData(serviceUnits) {
      // this.listData = [
      //   { kpName: 'aa1', idCard: '123', kpType: '军1', kpMsisdn: '222'},
      //   { kpName: 'aa2', idCard: '123', kpType: '军1', kpMsisdn: '222'},
      // ]
      getKeyPersons(Object.assign(this.params, this.query, {
        taskNum: this.taskNum,
        serviceUnits
      })).then( res => {
        let { data, total } = res
        this.listData = data
        this.tableCount = parseInt(total)
      })
    },
    // 表格选择框
    handleSelection(val) {
      this.tableChosed = val
      this.$emit('numberAdd', val)
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
  },
  components: {
  }
}
</script>

<style scoped lang="scss">
.targetNumber {
  height: 100%;
  .treePart {
    width: 25%;
    .treeTitle {
      color: #fff;
      padding: 10px 0;
    }
    .treeContent {
      height: 380px;
      overflow: auto;
    }
  }
  .tablePart {
    width: 74%;
    .formPart {
      background: rgba(3,79,131,0.34);
      padding: 16px 20px 0;
      margin-bottom: 10px;
    }
  }
}
</style>