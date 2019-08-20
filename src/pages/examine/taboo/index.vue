<template>
  <d2-container>
    <div class="add-div">
      <el-input v-model="keyword" width="100" placeholder="搜索关键词"></el-input>
      <el-button
        type="primary">
        搜索
      </el-button>
      <el-button
        type="success"
        plain
        @click="dialogVisible = true">
        添加关键词
      </el-button>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%;margin-bottom: 15px"
      max-height="800"
      :row-class-name="tableRowClassName">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="word" label="敏感词"></el-table-column>
      <el-table-column prop="level" label="敏感词等级">
        <template slot-scope="scope">
          {{ getLevelName(scope.row.level) }}
        </template>
      </el-table-column>
      <el-table-column prop="time" label="创建时间">
        <template slot-scope="scope">
          {{ rowTime(scope.row.time) }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            @click="handleRemove(scope.$index, scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      ref="userPagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :page-sizes="[5, 15, 25, 50, 100]"
      :page-size="currentPageSize"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <el-dialog
    title="添加敏感词"
    :visible.sync="dialogVisible"
    @closed="handleClose"
    width="450px">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="敏感词等级" prop="level">
          <el-select v-model="form.level" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label-width="0" prop="phrase">
          <el-input
            type="textarea"
            rows=5
            v-model="form.phrase"
            auto-complete="off"
            placeholder="可以一次添加一个/多个，以换行符作为多个的分隔符">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addPhrase">确 定</el-button>
      </div>
    </el-dialog>
</d2-container>
</template>

<script>
import { GetTaboos, AddTaboo, RemoveTaboo } from '@/api/pages/examine/taboo'
import dayjs from 'dayjs'

export default {
  data () {
    return {
      tableData: [],
      options: [{
        value: 1,
        label: '政治'
      }, {
        value: 2,
        label: '恐暴'
      }, {
        value: 4,
        label: '色情'
      }, {
        value: 8,
        label: '辱骂'
      }, {
        value: 16,
        label: '其他'
      }],
      total: 0,
      currentPage: 1,
      currentPageSize: 15,
      dialogVisible: false,
      keyword: '',
      form: {
        phrase: '',
        level: ''
      },
      rules: {
        phrase: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        level: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ]
      }
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
    getLevelName (level) {
      if (level === 1) {
        return '政治'
      } else if (level === 2) {
        return '恐暴'
      } else if (level === 4) {
        return '色情'
      } else if (level === 8) {
        return '辱骂'
      } else {
        return '其他'
      }
    },
    async fetch () {
      const res = await GetTaboos({
        limit: this.currentPageSize,
        offset: (this.currentPage - 1) * this.currentPageSize
      })
      this.total = res.content.total
      this.tableData = res.content.taboos
    },
    handleSizeChange (val) {
      this.currentPage = 1
      this.currentPageSize = val
      this.fetch()
    },
    handleCurrentChange (val) {
      this.fetch()
    },
    async handleRemove (index, row) {
      const res = await RemoveTaboo({
        'taboo_id': row.tabooId,
        remove: 1
      })
      this.$notify({
        title: res.msg,
        duration: 3000
      })
      this.fetch()
    },
    async handleAdd (word, level) {
      const res = await AddTaboo({
        word: word,
        level: level,
        add: 1
      })
      this.$notify({
        title: res.msg,
        duration: 3000
      })
      this.fetch()
    },
    handleClose (done) {
      this.$refs.form.resetFields()
    },
    addPhrase () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.dialogVisible = false
          console.log(this.form.phrase)
          this.handleAdd(this.form.phrase, this.form.level)
          this.$refs.form.resetFields()
        } else {
          this.$message.error('请输入敏感词')
          return false
        }
      })
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
</style>
