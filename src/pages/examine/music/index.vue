<template>
  <d2-container>
    <div class="total">总计: {{ total }}</div>
    <div style="overflow: scroll; height: 100%;">
      <div class="wrapper" ref="wrapper">
        <el-table
          class="content"
          :data="tableData"
          style="width: 100%;margin-bottom: 15px;"
          :row-class-name="tableRowClassName">
          <el-table-column type="index"></el-table-column>
          <el-table-column prop="sensitiveWord" label="敏感词" width="100px">
          </el-table-column>
          <el-table-column prop="songLyric" label="歌词">
            <template slot-scope="scope">
                <div v-html="highlight(scope.row)"></div>
            </template>
          </el-table-column>
          <el-table-column prop="songName" label="歌曲名" width="100px">
          </el-table-column>
          <el-table-column prop="singerName" label="艺人" width="100px">
          </el-table-column>
          <el-table-column label="操作" width="150px">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="success"
                :disabled="scope.row.handleType===2"
                @click="online(scope.row)">
                上架
              </el-button>
              <el-button
                size="mini"
                type="danger"
                :disabled="scope.row.handleType===1"
                @click="offline(scope.row)">
                下架
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
import { InappropriateLyrics } from '@/api/pages/examine/inappropriate'

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
      dialogVisible: false,
      value: new Date(),
      form: {
        phrase: ''
      },
      freshData: false,
      last_id: '99999999999999999999999999',
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
    highlight (row) {
      return row.songLyric.replace(new RegExp(row.sensitiveWord, 'g'), "<span class='highlight'>" + row.sensitiveWord + '</span>')
    },
    async fetch () {
      const res = await InappropriateLyrics({
        day: dayjs(this.value).format('YYYYMMDD'),
        limit: this.currentPageSize,
        serialization_id: this.last_id
      })
      console.log(res.content)
      if (this.total === 0) {
        this.total = res.content.total
      }
      if (res.content.total > 0) {
        var datas = res.content.sensitiveSongs
        this.tableData = this.tableData.concat(datas)
        this.last_id = datas[datas.length - 1].serializationId
        this.$nextTick(() => {
          this.BS.refresh()
          this.freshData = false
        })
      } else if (this.freshData === true) {
        this.$notify.info({
          title: '',
          message: '已加载完所有敏感歌曲',
          position: 'bottom-right'
        })
      }
    },
    online (row) {
      console.log(row)
      row.handleType = 2
    },
    offline (row) {
      console.log(row)
      row.handleType = 1
    }
  },
  mounted () {
    let height = document.getElementsByClassName('d2-container-full__body')[0].clientHeight - 20
    this.fetch()
    this.$refs.wrapper.style = 'height: ' + (height - 60) + 'px'
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

<style scoped>
    .total {
        display: inline-block;
        padding: 6px 10px;
        background-color:#409eff;
        color: white;
        font-weight: bolder;
        font-size: 14px;
    }
</style>

<style>
  .el-table .success-row {
    background: #f0f9eb;
  }

  .el-table td, .el-table th {
    padding: 6px 0;
  }

  .wrapper{
    height: 500px;
    overflow: scroll;
    padding-bottom: 20px;
  }

  .highlight {
    color: red;
    font-weight: bolder;
  }
</style>
