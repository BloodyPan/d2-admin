<template>
  <d2-container>
    <div class="profile-tpl">
        <template v-for="(row, index) in tableData">
            <div :key="index" class="profile-container">
                <img class="profile-avatar" :src="row.user.profilePhoto" />
                <div class="profile-name">
                    {{ row.user.username }}
                    <br>
                    {{ row.user.nickname }}
                </div>
                <img class="profile-status" :src="row.status.picture" />
                <div class="profile-btns">
                    <el-button
                        size="mini"
                        type="danger"
                        :disabled="row.handle==2"
                        class="padding-tiny"
                        @click="nuke(row)">
                        Nuke
                    </el-button>
                    <el-button
                        size="mini"
                        type="success"
                        :disabled="row.handle==1"
                        class="padding-tiny"
                        style="float: right;"
                        @click="ok(row)">
                        OK
                    </el-button>
                </div>
            </div>
        </template>
    </div>
    <el-button
        size="medium"
        type="success"
        class="padding-tiny"
        @click="okAll()">
        OK 整页面
    </el-button>
    <el-pagination
      ref="userPagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :page-sizes="[20, 50, 100]"
      :page-size="currentPageSize"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
</d2-container>
</template>

<script>
import { Examination, Nuke, ExaminationOk } from '@/api/pages/examine/inappropriate'
import dayjs from 'dayjs'

export default {
  data () {
    return {
      tableData: [],
      total: 0,
      currentPage: 1,
      currentPageSize: 20,
      dialogVisible: false
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
    async fetch () {
      const res = await Examination({
        limit: this.currentPageSize,
        offset: (this.currentPage - 1) * this.currentPageSize
      })
      this.total = res.content.total
      this.tableData = res.content.examinations
    },
    handleSizeChange (val) {
      this.currentPage = 1
      this.currentPageSize = val
      this.fetch()
    },
    handleCurrentChange (val) {
      this.fetch()
    },
    handleClose (done) {
      this.$refs.form.resetFields()
    },
    async nuke (row) {
      const res = await Nuke({
        user_ids: row.user.id,
        examination_id: row.eid
      })
      this.$notify({
        title: res.msg,
        duration: 3000
      })
      row.handle = 2
    },
    async ok (row) {
      const res = await ExaminationOk({
        user_ids: row.eid
      })
      this.$notify({
        title: res.msg,
        duration: 3000
      })
      row.handle = 1
    },
    okAll () {
      this.$confirm('即将发射全屏核弹, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var eids = []
        for (var i in this.tableData) {
          if (this.tableData[i].handle === 0) {
            this.tableData[i].handle = 1
            eids.push(this.tableData[i].eid)
          }
        }
        if (eids.length === 0) {
          return
        }
        ExaminationOk({
          user_ids: eids.join()
        })
        this.$message({
          type: 'success',
          message: '发射成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消发射'
        })
      })
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

  .profile-tpl {
      margin-bottom: 10px;
  }

  .profile-container {
    background-color: #D8D8D8;
    display: inline-block;
    padding: 15px 12px 12px 12px;
    margin-top: 10px;
    margin-right: 10px;
  }

  .profile-avatar {
    width: 60px;
    height: 60px;
    vertical-align: middle;
  }

  .profile-name {
    display: inline-block;
    margin: 0 12px;
  }

  .profile-status {
    height: 100px;
    vertical-align: middle;
  }

  .profile-btns {
      margin-top: 5px;
  }
</style>
