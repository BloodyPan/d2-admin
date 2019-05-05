<template>
  <d2-container>
    <div slot="header" flex="main:justify">
      <el-date-picker size="mini" type="date" v-model="value" format="yyyy-MM-dd" placeholder="选择一个日期" @change="dateChanged"/>
    </div>
    <div style="overflow: scroll; height: 100%;">
    <div class="wrapper" ref="wrapper">
      <el-table
        class="content"
        :data="tableData"
        style="width: 100%;margin-bottom: 15px"
        max-height="800"
        :row-class-name="tableRowClassName">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="头像">
          <template slot-scope="scope">
            <img class="profile" :src="scope.row.user.profilePhoto">
          </template>
        </el-table-column>
        <el-table-column prop="user.nickname" label="昵称"></el-table-column>
        <el-table-column prop="user.username" label="用户名"></el-table-column>
        <el-table-column prop="type" label="举报类型">
          <template slot-scope="scope">
            {{ getInapporiateName(scope.row.inappropriateType) }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="detail(scope.$index, scope.row)">
              查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    </div>
</d2-container>
</template>

<script>
import dayjs from 'dayjs'
import bs from '@/components/common/bs'
import { Inappropriates } from '@/api/pages/examine/inappropriate'

export default {
  mixins: [
    bs
  ],
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
      last_id: ''
    }
  },
  methods: {
    tableRowClassName ({ row, rowIndex }) {
      if (rowIndex % 2 === 1) {
        return 'success-row'
      }
      return ''
    },
    getInapporiateName (val) {
      if (val === 2) {
        return '色情'
      } else if (val === 4) {
        return '语言骚扰、人身攻击'
      } else if (val === 4) {
        return '商业活动'
      } else if (val === 4) {
        return '煽动、歧视、谩骂'
      } else if (val === 4) {
        return '违法活动'
      }
      return '其他'
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
    detail () {
      console.log(1)
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
</style>
