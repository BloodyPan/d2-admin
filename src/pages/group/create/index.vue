<template>
  <d2-container>
    <el-dialog title="生成圈子" :visible.sync="dialogVisible">
      <el-form ref="group" :model="group" :rules="rules">
        <el-form-item label="圈子名" prop="name" label-width="120px">
          <el-input
            v-model="group.name"
            auto-complete="off"
            placeholder="圈子名称">
          </el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type" label-width="120px">
          <el-select v-model="group.type" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="经度(分享链接)" prop="lng" label-width="120px">
          <el-input
            v-model="group.lng"
            auto-complete="off"
            placeholder="经度">
          </el-input>
        </el-form-item>
        <el-form-item label="纬度(分享链接)" prop="lat" label-width="120px">
          <el-input
            v-model="group.lat"
            auto-complete="off"
            placeholder="纬度">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addGroup">确 定</el-button>
      </div>
    </el-dialog>
    <el-button
      size="medium"
      type="primary"
      plain
      @click="showCreate()">添加圈子</el-button>
    <div style="overflow: scroll; height: 100%;">
      <div class="wrapper" ref="wrapper">
        <el-table
          :data="tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
          style="width: 100%;margin-bottom: 15px"
          class="content"
          :row-class-name="tableRowClassName">
          <el-table-column type="index"></el-table-column>
          <el-table-column prop="name" label="圈子名"></el-table-column>
          <el-table-column prop="type" label="类型">
            <template slot-scope="scope">
              {{ getType(scope.row.type) }}
            </template>
          </el-table-column>
          <el-table-column prop="total" sortable label="当前人数"></el-table-column>
          <el-table-column prop="createAt" sortable label="生成时间">
            <template slot-scope="scope">
              {{ rowTime(scope.row.createAt) }}
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
                  @click="copyLink(`${(scope.row.url)}`)">复制链接</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </d2-container>
</template>

<script>
import { CreateGroup, GroupList } from '@/api/pages/group'
import * as clipboard from 'clipboard-polyfill'
import dayjs from 'dayjs'
import bs from '@/components/common/bs'

export default {
  mixins: [
    bs
  ],
  data () {
    return {
      tableData: [],
      dialogVisible: false,
      options: [{
        value: 0,
        label: '校园'
      }, {
        value: 1,
        label: '社会'
      }],
      group: {
        name: '',
        lat: 22.535256,
        lng: 113.93083,
        type: 0
      },
      rules: {
        name: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] },
          { min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: ['blur', 'change'] }
        ],
        lat: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] },
          { pattern: /^(-|\+)?([0-8]?\d{1}\.\d{0,6}|90\.0{0,6}|[0-8]?\d{1}|90)$/, message: '纬度必须为数字值，且在-90到90之间, 小数点保留六位' }
        ],
        lng: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] },
          { pattern: /^(-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,6})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,6}|180)$/, message: '经度必须为数字值, 且在-180到180之间, 小数点保留六位' }
        ]
      },
      total: 0,
      currentPage: 1,
      currentPageSize: 20,
      last_id: '9999999999',
      search: '',
      freshData: false
    }
  },
  mounted () {
    let height = document.getElementsByClassName('d2-container-full__body')[0].clientHeight - 20
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
    tableRowClassName ({ row, rowIndex }) {
      if (rowIndex % 2 === 1) {
        return 'success-row'
      }
      return ''
    },
    getType (type) {
      if (type === 0) {
        return '校园'
      }
      return '社会'
    },
    showCreate () {
      this.dialogVisible = true
    },
    async CreateGroup () {
      const res = await CreateGroup({
        data: JSON.stringify(this.group)
      })
      console.log(res.group)
      this.$refs.group.resetFields()
      this.$notify({
        title: '添加成功',
        duration: 3000
      })
      // this.last_id = '0'
      // this.fetch()
      var groups = [res.group]
      groups = groups.concat(this.tableData)
      this.tableData = groups
    },
    addGroup () {
      this.$refs.group.validate((valid) => {
        if (valid) {
          this.dialogVisible = false
          this.CreateGroup()
        } else {
          this.$message.error('表单验证未通过')
          return false
        }
      })
    },
    async fetch () {
      const res = await GroupList({
        limit: this.currentPageSize,
        lid: this.last_id
      })
      console.log(res)
      if (res.content.total > 0) {
        this.tableData = this.tableData.concat(res.content.groups)
        this.last_id = res.content.groups[res.content.total - 1].createAt
        this.$nextTick(() => {
          this.BS.refresh()
          this.freshData = false
        })
      }
    },
    copyLink (url) {
      clipboard.writeText(url)
      console.log(url)
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
