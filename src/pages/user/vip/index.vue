<template>
  <d2-container>
    <div style="overflow: scroll; height: 100%;">
      <div class="wrapper" ref="wrapper">
        <el-table
          :data="tableData.filter(data => !search || data.nickname.toLowerCase().includes(search.toLowerCase()) || data.username.toLowerCase().includes(search.toLowerCase())|| data.test.phoneNumber.includes(search))"
          style="width: 100%;margin-bottom: 15px"
          class="content"
          :row-class-name="tableRowClassName">
          <el-table-column type="index"></el-table-column>
          <el-table-column label="头像">
            <template slot-scope="scope">
              <img class="profile" :src="scope.row.profilePhoto">
            </template>
          </el-table-column>
          <el-table-column prop="nickname" label="昵称"></el-table-column>
          <el-table-column prop="username" label="用户名"></el-table-column>
          <el-table-column prop="test.phoneNumber" label="手机"></el-table-column>
          <el-table-column prop="friendCount" sortable label="好友数"></el-table-column>
          <el-table-column prop="time" sortable label="注册时间">
            <template slot-scope="scope">
              {{ rowTime(scope.row.dateJoined) }}
            </template>
          </el-table-column>
          <el-table-column prop="time" sortable label="活跃时间">
            <template slot-scope="scope">
              {{ rowTime(scope.row.lastActive) }}
            </template>
          </el-table-column>
          <el-table-column align="right">
            <!-- eslint-disable-next-line vue/no-unused-vars -->
            <template slot="header" slot-scope="scope">
              <el-input
                v-model="search"
                size="mini"
                placeholder="输入关键字搜索"/>
            </template>
            <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="info"
                  plain
                  @click="amplitude(`${md5Encode(scope.row.id)}`)">Amplitude</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </d2-container>
</template>

<script>
import { VipUserList } from '@/api/pages/user/vip'
import dayjs from 'dayjs'
import md5 from 'js-md5'
import bs from '@/components/common/bs'

export default {
  mixins: [
    bs
  ],
  data () {
    return {
      tableData: [],
      total: 0,
      currentPage: 1,
      currentPageSize: 20,
      search: '',
      freshData: false
    }
  },
  mounted () {
    let height = document.getElementsByClassName('d2-container-full__body')[0].clientHeight
    this.fetch()
    this.$refs.wrapper.style = 'height: ' + (height - 40) + 'px'
    this.$nextTick(_ => {
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
  },
  methods: {
    rowTime: ts => dayjs(ts * 1000).format('YYYY-MM-DD HH:mm:ss'),
    md5Encode: str => md5.hex(String(str)),
    amplitude: function (id) {
      window.open('https://analytics.amplitude.com/spot/project/188397/search/' + id)
    },
    tableRowClassName ({row, rowIndex}) {
      if (rowIndex % 2 === 1) {
        return 'success-row'
      }
      return ''
    },
    async fetch () {
      let offset = (this.currentPage - 1) * this.currentPageSize
      if (offset > this.total) {
        return
      }
      const res = await VipUserList({
        limit: this.currentPageSize,
        offset: (this.currentPage - 1) * this.currentPageSize
      })
      this.total += res.content.total
      if (this.total > 0) {
        this.tableData = this.tableData.concat(res.content.persons)
        this.$nextTick(() => {
          this.BS.refresh()
          this.freshData = false
        })
      }
    }
  }
}
</script>

<style>
  .wrapper{
    height: 500px;
    overflow: scroll;
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
</style>
