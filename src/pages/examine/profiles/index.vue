<template>
  <d2-container>
    <div class="profile-tpl">
        <template v-for="(row, index) in tableData">
            <div :key="`profile-${index}`" class="profile-container">
                <img class="profile-avatar" :src="row.user.profilePhoto" />
                <div class="profile-name">
                    {{ row.user.username }}
                    <br>
                    {{ row.user.nickname }}
                </div>
                <div class="profile-media" v-if="row.status">
                    <img class="profile-status" v-if="!row.status.video" :src="row.status.picture" />
                    <video class="profile-status" :src="row.status.video" v-if="row.status.video" controls/>
                </div>
                <div class="empty-status" v-else>无状态</div>
                <div class="profile-btns">
                    <el-button
                        size="mini"
                        type="danger"
                        :disabled="row.handle==2"
                        class="padding-tiny"
                        @click="confirmNuke(row)">
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
      :page-sizes="[5, 10, 20, 50, 100]"
      :page-size="currentPageSize"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
</d2-container>
</template>

<script>
import { Examination, Nuke, ExaminationOk } from '@/api/pages/examine/inappropriate'
import util from '@/libs/util.js'

export default {
  data () {
    return {
      tableData: [],
      total: 100000000000,
      currentPage: 1,
      currentPageSize: 10,
      dialogVisible: false,
      pageCookiePrefix: 'page_'
    }
  },
  methods: {
    tableRowClassName ({ row, rowIndex }) {
      if (rowIndex % 2 === 1) {
        return 'success-row'
      }
      return ''
    },
    getCurrentPage (pageSize) {
      const cookieKey = this.pageCookiePrefix + pageSize
      const value = util.cookies.get(cookieKey)
      if (value === void 0) {
        this.currentPage = 1
      } else {
        this.currentPage = parseInt(value)
      }
    },
    async fetch () {
      const res = await Examination({
        limit: this.currentPageSize,
        offset: (this.currentPage - 1) * this.currentPageSize
      })
      this.total = res.content.total
      this.tableData = res.content.examinations
      console.log(this.tableData)
    },
    handleSizeChange (val) {
      this.getCurrentPage(val)
      this.currentPageSize = val
      this.fetch()
    },
    handleCurrentChange (val) {
      const cookieKey = this.pageCookiePrefix + this.currentPageSize
      util.cookies.set(cookieKey, this.currentPage)
      this.fetch()
    },
    handleClose (done) {
      this.$refs.form.resetFields()
    },
    async nuke (row) {
      const res = await Nuke({
        user_ids: row.user.id,
        examination_id: row.eid,
        record: true
      })
      this.$notify({
        title: res.msg,
        duration: 3000
      })
      row.handle = 2
    },
    confirmNuke (row) {
      this.$confirm('向该用户发射核弹?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.nuke(row)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
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
      this.$confirm('整页面ok, 是否继续?', '提示', {
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
          message: '成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    }
  },
  mounted () {
    this.getCurrentPage(this.currentPageSize)
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

  .block-slider {
    display: inline-block;
    width: 50%;
  }

  .demonstration {
    font-size: 14px;
    color: #8492a6;
    line-height: 44px;
  }

  .slider {
    width: 80%;
    float: right;
  }

  .profile-tpl {
      margin-bottom: 10px;
  }

  .profile-container {
    background-color: #D8D8D8;
    display: inline-block;
    padding: 15px 10px 12px 10px;
    margin-top: 10px;
    margin-right: 10px;
    min-height: 125px;
    min-width: 180px;
    vertical-align: middle;
  }

  .profile-avatar {
    width: 60px;
    height: 60px;
    vertical-align: middle;
  }

  .profile-name {
    display: inline-block;
    margin: 0 12px;
    min-width: 55px;
    text-align: center;
  }

  .profile-media {
    display: inline-block;
  }

  .profile-status {
    height: 120px;
    vertical-align: middle;
  }

  .empty-status {
    border: 2px dashed #FCFCFC;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 120px;
    width: 67.5px;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.5);
  }

  .profile-btns {
      margin-top: 5px;
  }
</style>
