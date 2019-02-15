<template>
  <d2-container>
    <el-table
      :data="tableData"
      style="width: 100%;margin-bottom: 15px"
      max-height="500"
      :row-class-name="tableRowClassName">
      <el-table-column type="index"></el-table-column>
      <el-table-column label="头像">
        <template slot-scope="scope">
          <img class="profile" :src="scope.row.profilePhoto">
        </template>
      </el-table-column>
      <el-table-column prop="nickname" label="用户名称" width="250"></el-table-column>
      <el-table-column prop="operation" label="操作"></el-table-column>
      <el-table-column prop="ip" label="IP"></el-table-column>
      <el-table-column prop="time" label="时间">
        <template slot-scope="scope">
          {{ rowTime(scope.row.id) }}
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      ref="userPagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :page-sizes="[5, 10, 20, 50, 100]"
      :page-size="currentPageSize"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
</d2-container>
</template>

<script>
import dayjs from 'dayjs'
import fakeData from './data.json'

export default {
  data () {
    return {
      tableData: [],
      total: 100,
      currentPage: 1,
      currentPageSize: 10
    }
  },
  methods: {
    tableRowClassName ({row, rowIndex}) {
      if (rowIndex % 2 === 1) {
        return 'success-row'
      }
      return ''
    },
    rowTime: function (id) {
      var ts = dayjs().valueOf() - id * 500
      return dayjs(ts).format('YYYY-MM-DD HH:mm:ss')
    },
    fetch () {
      var start = (this.currentPage - 1) * this.currentPageSize
      var end = start + this.currentPageSize
      this.tableData = fakeData.slice(start, end)
    },
    handleSizeChange (val) {
      this.currentPage = 1
      this.currentPageSize = val
      this.fetch()
    },
    handleCurrentChange (val) {
      this.fetch()
    }
  },
  mounted () {
    this.fetch()
  }
}
</script>

<style>
  .el-table .success-row {
    background: #f0f9eb;
  }

  .el-table td, .el-table th {
    padding: 6px 0;
  }

  .profile{
    width: 25px;
  }
</style>
