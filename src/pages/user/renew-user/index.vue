<template>
  <d2-container>
    <el-card class="box-card" slot="header">
      <div slot="header" class="clearfix">
        <span>释放测试号(释放后可以走注册流程)</span>
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
import util from '@/libs/util.spot.js'
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
    fetch () {
      this.$axios({
        method: 'get',
        url: 'ResetUser',
        params: {
          limit: this.currentPageSize,
          offset: (this.currentPage - 1) * this.currentPageSize
        }
      })
        .then(res => {
          this.total = res.content.total
          this.tableData = res.content.persons
        })
        .catch(err => {
          this.$message.error(err)
        })
    },
    handleSizeChange (val) {
      this.currentPage = 1
      this.currentPageSize = val
      this.fetch()
    },
    handleCurrentChange (val) {
      this.fetch()
    },
    unbindTestPhone (index) {
      this.unbindList[index].del = true

      let params = util.csrfParam()
      params.append('phone', '13800000' + this.unbindList[index].phone)
      this.$axios({
        method: 'post',
        url: 'DelTestUser',
        data: params
      })
        .then(res => {
          this.$notify({
            title: '释放成功',
            message: res.msg,
            duration: 3000
          })
        })
        .catch(err => {
          this.$message.error(err)
        })
    },
    handleReset (index, row) {
      let params = util.csrfParam()
      params.append('uid', row.id)
      this.$axios({
        method: 'post',
        url: 'ResetUser',
        data: params
      })
        .then(res => {
          row.test.resetFlag = false
          this.$notify({
            title: '成功重置用户状态',
            message: res.msg,
            duration: 3000
          })
        })
        .catch(err => {
          this.$message.error(err)
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
