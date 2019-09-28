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
                <div class="source">{{ getSource(row) }}</div>
                <!-- <img class="profile-status" v-if="row.status" :src="row.status.picture" /> -->
                <!-- <div class="empty-status" v-else>无状态</div> -->
                <div class="sensitive-content" v-if="row.word">{{ `敏感词: ${row.word}` }}</div>
                <div class="sensitive-content" v-html="highlight(row)" v-if="row.word">
                </div>
                <div class="profile-btns">
                    <el-button
                        size="mini"
                        type="danger"
                        :disabled="row.handle==0"
                        class="save-user-btn"
                        @click="confirmNuke(row)">
                        Nuke
                    </el-button>
                </div>
                <div class="profile-btns" style="float: right;">
                    <el-button
                        size="mini"
                        type="success"
                        :disabled="row.handle==1 || row.handle==2"
                        class="save-user-btn"
                        @click="confirmOk(row)">
                        {{ row.handle == 1 ? "已救回" : "救回" }}
                    </el-button>
                </div>
            </div>
        </template>
    </div>
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
import { AutoNuke, DeleteNuke, Nuke } from '@/api/pages/examine/inappropriate'
import dayjs from 'dayjs'

export default {
  data () {
    return {
      tableData: [],
      total: 0,
      currentPage: 1,
      currentPageSize: 10,
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
    highlight (row) {
      console.log(row)
      return row.content.replace(new RegExp(row.word, 'g'), "<span class='highlight'>" + row.word + '</span>')
    },
    getSource (row) {
      const nukeFrom = row.nukeFrom
      var nukeText = ''
      switch (nukeFrom) {
        case 1:
          nukeText = '昵称'
          break
        case 2:
          nukeText = 'Spot Handle'
          break
        case 3:
          nukeText = '私聊'
          break
        case 4:
          nukeText = '匿名群聊'
          break
        case 5:
          nukeText = '群聊'
          break
        case 6:
          nukeText = '状态'
          break
        case 7:
          nukeText = '猜干嘛'
          break
        case 8:
          nukeText = '分享足迹'
          break
        case 9:
          nukeText = '加好友备注信息'
          break
        case 10:
          nukeText = '一天评论'
          break
        case 11:
          nukeText = '修改群名'
          break
        case 12:
          nukeText = 'CMS人工操作'
          break
        default:
          nukeText = ''
      }
      return '来自: ' + nukeText
    },
    async fetch () {
      const res = await AutoNuke({
        limit: this.currentPageSize,
        offset: (this.currentPage - 1) * this.currentPageSize
      })
      this.total = res.content.total
      this.tableData = res.content.nukes
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
    confirmOk (row) {
      this.$confirm('救回该用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.ok(row)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    async ok (row) {
      const res = await DeleteNuke({
        pk: row.id
      })
      this.$notify({
        title: res.msg,
        duration: 3000
      })
      row.handle = 1
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
    async nuke (row) {
      const res = await Nuke({
        user_ids: row.user.id,
        auto_nuke_id: row.id,
        record: false
      })
      this.$notify({
        title: res.msg,
        duration: 3000
      })
      row.handle = 0
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

  .profile-status {
    height: 100px;
    vertical-align: middle;
  }

  .empty-status {
    border: 2px dashed #FCFCFC;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 100px;
    width: 56px;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.5);
  }

  .source {
    margin: 10px 0;
  }

  .profile-btns {
    margin-top: 5px;
    display: inline-block;
    width: 40%;
  }

  .save-user-btn {
      width: 100%;
  }

  .sensitive-content {
    border: 2px dashed rgba(0, 0, 0, 0.5);
    padding: 10px;
    margin-top: 10px;
    background-color: #b3d8ff;
  }

  .highlight {
    color: red;
    font-weight: bolder;
  }
</style>
