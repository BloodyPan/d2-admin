<template>
  <d2-container>
    <div slot="header" flex="main:justify">
      <el-date-picker size="mini" type="date" v-model="value" format="yyyy-MM-dd" placeholder="选择一个日期" @change="dateChanged"/>
    </div>
    <el-dialog
    title="详情"
    :visible.sync="dialogVisible"
    width="50%">
      <inappropriate ref="inappropriate" :message="userData" @close="closeDialog"></inappropriate>
    </el-dialog>
    <div style="overflow: scroll; height: 100%;">
      <div class="wrapper" ref="wrapper">
        <el-table
          class="content"
          :data="tableData"
          style="width: 100%;margin-bottom: 15px"
          max-height="800"
          :row-class-name="tableRowClassName">
          <el-table-column label="" width="80px">
            <template slot-scope="scope">
              <div v-if="scope.row.user.banLevel === 1" class="warning-tag">警告</div>
            </template>
          </el-table-column>
          <el-table-column type="index"></el-table-column>
          <el-table-column label="头像" width="55px">
            <template slot-scope="scope">
              <img class="profile" :src="scope.row.user.profilePhoto">
            </template>
          </el-table-column>
          <el-table-column prop="user.username" label="用户名"></el-table-column>
          <el-table-column prop="type" label="举报类型">
            <template slot-scope="scope">
              {{ getInapporiateName(scope.row) }}
            </template>
          </el-table-column>
          <el-table-column prop="user.username" label="场所">
            <template slot-scope="scope">
              {{ getScene(scope.row) }}
            </template>
          </el-table-column>
          <el-table-column prop="createdAt" label="举报时间">
            <template slot-scope="scope">
              {{ rowTime(scope.row.createdAt) }}
            </template>
          </el-table-column>
          <el-table-column prop="user.username" label="用户类别">
            <template slot-scope="scope">
              {{ getUserType(scope.row.user) }}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="detail(scope.row)">
                查看详情
              </el-button>
              <a :href="`https://analytics.amplitude.com/spot/project/188397/search/${md5Encode(scope.row.user.id)}`" class="amplitude" target="_blank">A</a>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
</d2-container>
</template>

<script>
import md5 from 'js-md5'
import dayjs from 'dayjs'
import bs from '@/components/common/bs'
import inappropriate from '../../../components/inappropriate'
import { Inappropriates } from '@/api/pages/examine/inappropriate'

export default {
  mixins: [
    bs
  ],
  components: {
    'inappropriate': inappropriate
  },
  data () {
    return {
      tableData: [],
      total: 0,
      currentPage: 1,
      currentPageSize: 15,
      dialogVisible: false,
      value: new Date(),
      form: {
        phrase: ''
      },
      freshData: false,
      last_id: '',
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
    getScene (row) {
      var scene = ''
      var chatIds = row.chatId.split('_')
      var chatType = chatIds[0]
      if (chatType === 'feed') {
        scene = '日常'
      } else if (chatType === 'group') {
        scene = '群聊'
      } else if (chatType === 'channel') {
        scene = '匿名留言板'
      } else if (chatType === 'bottle') {
        scene = '私聊 - 笔友'
      } else {
        scene = '私聊'
      }
      row.scene = scene
      return scene
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
    getInapporiateName (row) {
      var val = row.inappropriateType
      var inapporiateName = '其他'
      if (val === 2) {
        inapporiateName = '色情'
      } else if (val === 4) {
        inapporiateName = '语言骚扰、人身攻击'
      } else if (val === 8) {
        inapporiateName = '商业活动'
      } else if (val === 16) {
        inapporiateName = '煽动、歧视、谩骂'
      } else if (val === 32) {
        inapporiateName = '违法活动'
      }
      row.inapporiateName = inapporiateName
      return inapporiateName
    },
    dateChanged () {
      this.last_id = ''
      this.tableData = []
      this.fetch()
    },
    async fetch () {
      const res = await Inappropriates({
        day: dayjs(this.value).format('YYYYMMDD'),
        limit: this.currentPageSize,
        chat_id: this.last_id
      })
      this.total = res.content.total
      if (res.content.total > 0) {
        var datas = res.content.inappropriates
        this.tableData = this.tableData.concat(datas)
        this.last_id = datas[datas.length - 1].chatId
        this.$nextTick(() => {
          this.BS.refresh()
          this.freshData = false
        })
      }
    },
    detail (row) {
      this.dialogVisible = true

      row.day = dayjs(this.value).format('YYYYMMDD')
      this.$nextTick(() => {
        this.userData = row
      })
    },
    closeDialog () {
      this.dialogVisible = false
    }
  },
  mounted () {
    let height = document.getElementsByClassName('d2-container-full__body')[0].clientHeight - 20
    this.fetch()
    this.$refs.wrapper.style = 'height: ' + (height - 40) + 'px'
    this.$nextTick(() => {
      this.BS.on('scroll', (pos) => {
        // 滚动条滚到95%的地方开始拉新数据
        if (this.BS.maxScrollY * 0.9 > pos.y) {
          if (this.freshData === false) {
            this.freshData = true
            this.currentPage += 1
            this.fetch()
          }
        }
      })
    })
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
  }

  .amplitude {
    background-color: rgba(0, 0, 0, .5);
    color: white;
    padding: 8px;
    margin-left: 5px;
  }
</style>