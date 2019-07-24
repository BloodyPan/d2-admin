<template>
  <d2-container>
    <el-card class="box-card" slot="header">
      <el-form ref="searchForm" :model="searchForm" label-width="120px" flex="dir:left main:left box:justify">
        <el-form-item
          label="keys"
          prop="keys"
          :rules="[
            { required: true, message: '不能为空'}
          ]"
          :span="8"
          class="margin-btm-0">
          <el-input v-model="searchForm.keys" :rows="2" placeholder="请输入内容" type="textarea" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item class="form-item-search margin-btm-0">
          <el-button type="primary" @click="submitForm()">查找</el-button>
        </el-form-item>
      </el-form>
    </el-card>

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
import { SearchUser } from '@/api/pages/user/data-visor'
import dayjs from 'dayjs'
import md5 from 'js-md5'
import bs from '@/components/common/bs'

export default {
  mixins: [
    bs
  ],
  data () {
    return {
      searchForm: {
        keys: ''
      },
      tableData: [],
      search: '',
      freshData: false
    }
  },
  mounted () {
    let height = document.getElementsByClassName('d2-container-full__body')[0].clientHeight
    this.$refs.wrapper.style = 'height: ' + (height - 40) + 'px'
    if (this.$route.query.userid !== void 0) {
      this.fetch(this.$route.query.userid)
    }
  },
  methods: {
    rowTime: ts => dayjs(ts * 1000).format('YYYY-MM-DD HH:mm:ss'),
    md5Encode: str => md5.hex(String(str)),
    amplitude: function (id) {
      window.open('https://analytics.amplitude.com/spot/project/188397/search/' + id)
    },
    tableRowClassName ({ row, rowIndex }) {
      if (rowIndex % 2 === 1) {
        return 'success-row'
      }
      return ''
    },
    submitForm: function () {
      this.$refs.searchForm.validate((valid) => {
        if (valid) {
          this.fetch(this.searchForm.keys.split('\n').join(','))
        } else {
          this.$message.error('表单验证未通过')
          return false
        }
      })
    },
    async fetch (query) {
      const res = await SearchUser({
        query: query
      })
      this.tableData = res.content.persons
    }
  }
}
</script>

<style lang="scss">
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

  .form-item-search {
    .el-form-item__content {
      margin-left: 10px !important;
    }
  }
</style>
