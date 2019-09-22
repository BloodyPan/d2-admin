<template>
  <d2-container>
    <el-dialog
    title="详情"
    :visible.sync="dialogVisible"
    :before-close="handleClose"
    width="32rem">
      <ina-nickname ref="inappropriate" :message="userData" @close="closeDialog" @delete="deleteRow"></ina-nickname>
    </el-dialog>
    <div style="overflow: scroll; height: 100%;">
      <div class="wrapper" ref="wrapper">
        <el-table
          class="content"
          :data="tableData"
          style="width: 100%;margin-bottom: 15px;"
          :row-class-name="tableRowClassName">
          <el-table-column label="" width="80px">
            <template slot-scope="scope" v-if="scope.row.user">
              <div v-if="scope.row.user.banLevel === 1" class="warning-tag">警告</div>
            </template>
          </el-table-column>
          <el-table-column type="index"></el-table-column>
          <el-table-column prop="sensitiveWord" label="敏感词">
          </el-table-column>
          <el-table-column prop="sensitiveContent" label="昵称">
          </el-table-column>
          <el-table-column prop="user.username" label="用户名">
          </el-table-column>
          <el-table-column prop="seenTotal" label="观众人数" width="100px">
          </el-table-column>
          <el-table-column prop="userType" label="用户类别" width="100px">
            <template slot-scope="scope" v-if="scope.row.user">
              {{ getUserType(scope.row.user) }}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="danger"
                class="padding-tiny"
                @click="nuke(scope.row)">
                核弹
              </el-button>
              <el-button
                size="mini"
                type="primary"
                class="padding-tiny"
                @click="detail(scope.row)">
                查看
              </el-button>
              <a :href="`https://analytics.amplitude.com/spot/project/188397/search/${md5Encode(scope.row.user.id)}`" v-if="scope.row.user" class="amplitude" target="_blank">Amplitude</a>
              <a :href="`https://admin-cn.datavisor.cn/v3/en/main/user-details?uid=${scope.row.user.dvId}`" v-if="scope.row.user" class="dv" target="_blank">DV</a>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
            ref="userPagination"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-sizes="[20]"
            :page-size="currentPageSize"
            background
            layout="total, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
      </div>
    </div>
</d2-container>
</template>

<script>
import md5 from 'js-md5'
import dayjs from 'dayjs'
import bs from '@/components/common/bs'
import inaNickname from '../../../components/ina-nickname'
import { InappropriateNames, Nuke } from '@/api/pages/examine/inappropriate'

export default {
  mixins: [
    bs
  ],
  components: {
    'ina-nickname': inaNickname
  },
  data () {
    return {
      tableData: [],
      total: 0,
      currentPage: 1,
      currentPageSize: 20,
      dialogVisible: false,
      now: dayjs(),
      userData: {}
    }
  },
  methods: {
    tableRowClassName ({ row, rowIndex }) {
      if (rowIndex % 2 === 1) {
        return 'success-row'
      }
      return ''
    },
    md5Encode: str => md5.hex(String(str)),
    rowTime: ts => dayjs(ts * 1000).format('YYYY-MM-DD HH:mm:ss'),
    handleSizeChange (val) {
      this.currentPage = 1
      this.currentPageSize = val
      this.fetch()
    },
    handleCurrentChange (val) {
      this.fetch()
    },
    handleClose (done) {
      this.$refs.inappropriate.reset()
      done()
    },
    closeDialog () {
      this.$refs.inappropriate.reset()
      this.dialogVisible = false
    },
    deleteRow (row) {
      this.$refs.inappropriate.reset()
      this.tableData.splice(this.tableData.indexOf(row), 1)
      this.dialogVisible = false
    },
    async nuke (row) {
      const res = await Nuke({
        user_ids: row.user.id
      })
      this.$notify({
        title: res.msg,
        duration: 3000
      })
    },
    detail (row) {
      this.dialogVisible = true

      row.day = dayjs(this.value).format('YYYYMMDD')
      this.$nextTick(() => {
        if (this.userData.chatId && this.userData.chatId === row.chatId) {
          this.$refs.inappropriate.showPanel()
        }
        this.userData = row
      })
    },
    getUserType (user) {
      var userType = ''
      var birthday = user.birthday + ''
      if (user.sex === 2) {
        userType += '女性'
      }

      var age = this.now.year() - parseInt(birthday.slice(0, 4))
      if (age < 18) {
        userType += ' 未成年'
      } else if (age === 18) {
        var month = parseInt(birthday.slice(4, 6)) - this.now.month() - 1
        if (month > 0) {
          userType += ' 未成年'
        } else if (month === 0) {
          if (parseInt(birthday.slice(6, 8)) - this.now.date() > 0) {
            userType += ' 未成年'
          }
        }
      }
      return userType
    },
    async fetch () {
      const res = await InappropriateNames({
        offset: this.currentPageSize * (this.currentPage - 1),
        limit: this.currentPageSize
      })
      this.total = res.content.total
      console.log(res.content)
      if (res.content.total > 0) {
        var datas = res.content.inappropriates
        this.tableData = datas
      }
    }
  },
  mounted () {
    let height = document.getElementsByClassName('d2-container-full__body')[0].clientHeight - 20
    this.fetch()
    this.$refs.wrapper.style = 'height: ' + (height - 60) + 'px'
  }
}
</script>

<style>
  .warning-tag {
    display: inline-block;
    background-color: #F5A623;
    border-radius: 12.5px;
    color: white;
    font-size: 14px;
    font-weight: bolder;
    width: 54px;
    text-align: center;
    padding: 3px 10px;
  }

  .add-div {
    margin-bottom: 10px;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }

  .el-table td, .el-table th {
    padding: 6px 0;
  }

  .profile{
    width: 25px;
  }

  .wrapper{
    height: 500px;
    overflow: scroll;
    padding-bottom: 20px;
  }

  .amplitude {
    background-color: rgba(0, 0, 0, .4);
    color: white;
    padding: 8px;
    margin-left: 5px;
  }

  .dv {
    background-color: rgba(0, 0, 0, .3);
    color: white;
    padding: 8px;
    margin-left: 5px;
  }

  .padding-tiny {
    padding: 6px 5px;
    margin-left: 5px !important;
  }
</style>
