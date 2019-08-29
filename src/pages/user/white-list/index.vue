<template>
  <d2-container>
    <div class="add-div">
      <el-input v-model="keyword" width="100" placeholder="用户名或手机号"></el-input>
      <el-button
        type="primary"
        @click="search">
        搜索
      </el-button>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%;margin-bottom: 15px"
      max-height="800"
      :row-class-name="tableRowClassName">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="nickname" label="昵称"></el-table-column>
      <el-table-column prop="username" label="用户名"></el-table-column>
      <el-table-column prop="phone" label="手机后4位">
        <template slot-scope="scope">
          {{ scope.row.test.phoneNumber.substring(scope.row.test.phoneNumber.length-4) }}
        </template>
      </el-table-column>
      <el-table-column prop="friendCount" label="好友数"></el-table-column>
      <el-table-column prop="realName" label="姓名"></el-table-column>
      <el-table-column prop="time" label="注册日期">
        <template slot-scope="scope">
          {{ rowTime(scope.row.dateJoined) }}
        </template>
      </el-table-column>
      <!-- <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            @click="handleRemove(scope.$index, scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <el-pagination
      ref="userPagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :page-sizes="[5, 15, 25, 50, 100]"
      :page-size="currentPageSize"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
</d2-container>
</template>

<script>
import { WhiteListUser } from '@/api/pages/user/white-list'
import dayjs from 'dayjs'

export default {
  data () {
    return {
      tableData: [],
      total: 0,
      currentPage: 1,
      currentPageSize: 15,
      dialogVisible: false,
      keyword: '',
      q: ''
    }
  },
  methods: {
    rowTime: ts => dayjs(ts * 1000).format('YYYY-MM-DD HH:mm:ss'),
    tableRowClassName ({ row, rowIndex }) {
      if (rowIndex % 2 === 1) {
        return 'success-row'
      }
      return ''
    },
    search () {
      this.q = this.keyword
    },
    async fetch () {
      const res = await WhiteListUser({
        limit: this.currentPageSize,
        offset: (this.currentPage - 1) * this.currentPageSize
      })
      this.total = res.content.total
      this.tableData = res.content.persons
      console.log(res.content.persons)
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
  .add-div {
    margin-bottom: 10px;
    text-align: right;
  }

  .add-div .el-input {
    width: 200px;
    margin-right: 10px;
  }

  .search-div {
    float: right;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }

  .el-table td, .el-table th {
    padding: 6px 0;
  }
</style>
