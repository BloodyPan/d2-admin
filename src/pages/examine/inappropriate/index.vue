<template>
  <d2-container>
    <div slot="header" flex="main:justify">
      <el-date-picker size="mini" type="date" v-model="value" format="yyyy-MM-dd" placeholder="选择一个日期" @change="dateChanged"/>
    </div>
    <el-dialog
    title="详情"
    :visible.sync="dialogVisible"
    :before-close="handleClose"
    width="55rem">
      <inappropriate ref="inappropriate" :message="userData" @close="closeDialog" @delete="deleteRow" @warn="warnRow" @block="blockRow"></inappropriate>
    </el-dialog>
    <div style="overflow: scroll; height: 100%;">
      <div class="wrapper" ref="wrapper">
        <el-table
          class="content"
          :data="tableData"
          style="width: 100%;margin-bottom: 15px;"
          :row-class-name="tableRowClassName">
          <el-table-column label="" width="60px">
            <template slot-scope="scope" v-if="scope.row.user">
              <div v-if="scope.row.user.blocked === 1" class="block-tag">屏蔽</div>
              <div v-else-if="scope.row.user.banLevel === 1" class="warning-tag">警告</div>
            </template>
          </el-table-column>
          <el-table-column type="index"></el-table-column>
          <!-- <el-table-column label="头像" width="55px">
            <template slot-scope="scope">
              <img class="profile" :src="scope.row.user.profilePhoto">
            </template>
          </el-table-column>
          <el-table-column prop="user.username" label="用户名"></el-table-column> -->
          <el-table-column prop="sensitiveWord" label="敏感词">
          </el-table-column>
          <el-table-column prop="sensitiveContent" label="敏感内容">
          </el-table-column>
          <el-table-column prop="type" label="举报类型" width="150px">
            <template slot-scope="scope">
              {{ getInapporiateName(scope.row) }}
            </template>
          </el-table-column>
          <el-table-column prop="chatType" label="场所" width="100px">
            <template slot-scope="scope">
              {{ getScene(scope.row) }}
            </template>
          </el-table-column>
          <el-table-column prop="seenTotal" label="观众人数" width="80px">
            <template slot-scope="scope">
              {{ scope.row.public ? "-" : scope.row.seenTotal }}
            </template>
          </el-table-column>
          <el-table-column prop="createdAt" sortable label="举报时间" width="160px">
            <template slot-scope="scope">
              {{ rowTime(scope.row.createdAt) }}
            </template>
          </el-table-column>
          <el-table-column prop="userType" label="用户类别" width="120px">
            <template slot-scope="scope" v-if="scope.row.user">
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
              <a :href="`https://analytics.amplitude.com/spot/project/188397/search/${md5Encode(scope.row.user.id)}`" v-if="scope.row.user" class="amplitude" target="_blank">Amplitude</a>
              <a :href="`https://admin-cn.datavisor.cn/v3/en/main/user-details?uid=${scope.row.user.dvId}`" v-if="scope.row.user" class="dv" target="_blank">DV</a>
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
      currentPageSize: 20,
      dialogVisible: false,
      value: new Date(),
      form: {
        phrase: ''
      },
      freshData: false,
      last_id: 99999999999,
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
    warnRow (row) {
      row.user.banLevel = 1
    },
    blockRow (row) {
      this.$refs.inappropriate.reset()
      row.user.blocked = 1
      this.dialogVisible = false
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
    getScene (row) {
      var scene = ''
      var chatItems = row.chatId.split(':')
      var chatIds = row.chatId
      if (chatItems.length === 2) {
        chatIds = chatItems[1].split('_')
      } else {
        chatIds = row.chatId.split('_')
      }
      var chatType = chatIds[0]
      if (chatType === 'feed') {
        scene = '日常'
      } else if (chatType === 'status') {
        if (row.public) {
          scene = '二三度状态'
        } else {
          scene = '状态'
        }
      } else if (chatType === 'url') {
        scene = '链接'
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
      this.last_id = 99999999999
      this.tableData = []
      this.freshData = false
      this.fetch()
    },
    async fetch () {
      const res = await Inappropriates({
        day: dayjs(this.value).format('YYYYMMDD'),
        limit: this.currentPageSize,
        timestamp: this.last_id
      })
      this.total = res.content.total
      console.log(res.content)
      if (res.content.total > 0) {
        var datas = res.content.inappropriates
        this.tableData = this.tableData.concat(datas)
        this.last_id = datas[datas.length - 1].createdAt
        this.$nextTick(() => {
          this.BS.refresh()
          this.freshData = false
        })
      } else if (this.freshData === true) {
        this.$notify.info({
          title: '',
          message: '已加载完所有举报信息',
          position: 'bottom-right'
        })
      }
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
  .warning-tag, .block-tag {
    display: inline-block;
    border-radius: 12.5px;
    color: white;
    font-size: 12px;
    font-weight: bolder;
    width: 40px;
    text-align: center;
    padding: 2px;
  }

  .warning-tag {
    background-color: #F5A623;
  }

  .block-tag {
    background-color: #f56c6c;
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
</style>
