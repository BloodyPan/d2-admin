<template>
  <d2-container>
    <el-card class="box-card" slot="header">
      <div slot="header" class="clearfix">
        <span>释放测试号(释放后可以走注册流程)</span>
        <div style="color: red;">注: </div>
        <div style="color: red;">1. 000是给App Store审核用账号，最好不要使用</div>
        <div style="color: red;">2. 重置的账号只能用于测试注册后下发的用户引导, 走不了注册流程</div>
        <!--<el-button style="float: right padding: 3px 0" type="text">操作按钮</el-button>-->
      </div>
      <el-button
        v-for="(item, index) in unbindList"
        :key="'ubind-btn-' + index"
        :type="item.del ? 'primary' : 'danger'"
        :disabled="item.del"
        @click="unbindTestPhone(index)">
      {{ item.del ? `${item.phone} 已经可以用来注册啦`: `释放 ${item.phone} 测试号` }}
      </el-button>
    </el-card>

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
      <el-table-column prop="test.phoneNumber" label="手机号" width="250"></el-table-column>
      <el-table-column prop="username" label="用户名"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            :type="scope.row.test.resetFlag ? 'danger' : 'primary'"
            :disabled="!scope.row.test.resetFlag"
            @click="handleReset(scope.$index, scope.row)">
            {{ scope.row.test.resetFlag ? "重置" : "可用" }}
          </el-button>
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
import { ResetUser, ResetUserList, DelTestUser } from '@/api/pages/user/renew-user'

export default {
  data () {
    return {
      tableData: [],
      total: 0,
      currentPage: 1,
      currentPageSize: 5,
      unbindList: {
        0: {
          del: false,
          phone: '123'
        },
        1: {
          del: false,
          phone: '456'
        },
        2: {
          del: false,
          phone: '789'
        },
        3: {
          del: false,
          phone: '666'
        },
        4: {
          del: false,
          phone: '000'
        }
      }
    }
  },
  methods: {
    tableRowClassName ({row, rowIndex}) {
      if (rowIndex % 2 === 1) {
        return 'success-row'
      }
      return ''
    },
    async fetch () {
      const res = await ResetUserList({
        limit: this.currentPageSize,
        offset: (this.currentPage - 1) * this.currentPageSize
      })
      this.total = res.content.total
      this.tableData = res.content.persons
    },
    handleSizeChange (val) {
      this.currentPage = 1
      this.currentPageSize = val
      this.fetch()
    },
    handleCurrentChange (val) {
      this.fetch()
    },
    async unbindTestPhone (index) {
      this.unbindList[index].del = true
      const res = await DelTestUser({
        phone: '13800000' + this.unbindList[index].phone
      })
      this.$notify({
        title: '释放成功',
        message: res.msg,
        duration: 3000
      })
    },
    async handleReset (index, row) {
      const res = await ResetUser({
        uid: row.id
      })
      row.test.resetFlag = false
      this.$notify({
        title: '成功重置用户状态',
        message: res.msg,
        duration: 3000
      })
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
