<template>
  <d2-container>
    <el-table
      :data="tableData"
      style="width: 100%;margin-bottom: 15px"
      max-height="600"
      :row-class-name="tableRowClassName">
      <el-table-column type="index"></el-table-column>
      <el-table-column label="头像">
        <template slot-scope="scope">
          <img class="profile" :src="scope.row.operator.profilePhoto">
        </template>
      </el-table-column>
      <el-table-column prop="operator.nickname" label="昵称"></el-table-column>
      <el-table-column prop="operator.username" label="用户名"></el-table-column>
      <el-table-column prop="operation" label="操作"></el-table-column>
      <el-table-column prop="operator.device.ip" label="IP"></el-table-column>
      <el-table-column prop="time" label="时间">
        <template slot-scope="scope">
          {{ rowTime(scope.row.createAt) }}
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
import { GetOperateHistory } from '@/api/pages/history/operate'
import dayjs from 'dayjs'

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
    rowTime: function (ts) {
      return dayjs(ts * 1000).format('YYYY-MM-DD HH:mm:ss')
    },
    async fetch () {
      const res = await GetOperateHistory({
        limit: this.currentPageSize,
        offset: (this.currentPage - 1) * this.currentPageSize
      })
      this.total = res.content.total
      this.tableData = res.content.operations
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
