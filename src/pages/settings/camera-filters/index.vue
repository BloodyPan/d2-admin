<template>
  <d2-container>
    <el-button
      size="medium"
      type="primary"
      plain
      @click="addDialogVisible = true">
      添加哈哈镜
    </el-button>
    <el-button
      :disabled="pubDisabled"
      size="medium"
      type="success">
      保存并发布
    </el-button>
    <el-button
      size="medium"
      type="primary"
      @click="fetch">
      <i class="fa fa-undo" aria-hidden="true"></i>
    </el-button>
    <el-table
      :data="tableData"
      style="width: 100%;margin-bottom: 15px"
      max-height="800"
      :row-class-name="tableRowClassName">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="name" label="缩略图">
        <template slot-scope="scope">
          <img class="photo" :src="scope.row.photoUrl">
        </template>
      </el-table-column>
      <el-table-column prop="name" label="类别" width="150px">
        <template slot-scope="scope">
          <span style="text-align: center;" v-html="getFilterTypeName(scope.row)"></span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="状态" width="80px">
        <template slot-scope="scope">
          <span v-if="scope.row.online" class="online-text">上架</span>
          <span v-else>下架</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <!-- <template slot="header">
          <el-button
            size="medium"
            type="primary"
            plain
            @click="addDialogVisible = true">
            添加哈哈镜
          </el-button>
          <el-button
            :disabled="pubDisabled"
            size="medium"
            type="success">
            保存并发布
          </el-button>
        </template> -->
        <template slot-scope="scope">
          <span class="icon-div">
            <span class="icon-rank" v-if="scope.$index !== 0" @click="order(-1, scope)">
              <i class="fa fa-chevron-up" aria-hidden="true"></i>
            </span>
            <span class="icon-rank" v-if="scope.$index !== tableData.length - 1" @click="order(1, scope)">
              <i class="fa fa-chevron-down" aria-hidden="true"></i>
            </span>
          </span>
          <el-button
            size="mini"
            plain
            @click="editRow(scope.row)">
            编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            plain
            v-if="scope.row.online"
            @click="online(scope, false)">
            下架
          </el-button>
          <el-button
            size="mini"
            type="success"
            plain
            v-else
            @click="online(scope, true)">
            上架
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
    title="添加滤镜"
    :show-close="noSaving"
    :close-on-click-modal="noSaving"
    :close-on-press-escape="noSaving"
    :visible.sync="addDialogVisible"
    width="550px">
      <el-form ref="addForm" :model="addForm" :rules="addRules" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input
            v-model="addForm.name"
            auto-complete="off"
            placeholder="请输入名称">
          </el-input>
        </el-form-item>
        <el-form-item label="类别" prop="filter_type">
          <el-select v-model="addForm.filter_type" placeholder="请选择">
            <el-option
              v-for="item in filterTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="缩略图" prop="photo_url">
          <el-input
            v-model="addForm.photo_url"
            auto-complete="off"
            placeholder="请输入缩略图文件名">
          </el-input>
        </el-form-item>
        <el-form-item label="数据包" prop="effect_url">
          <el-input
            v-model="addForm.effect_url"
            auto-complete="off"
            placeholder="请输入数据包文件名">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="saveBtnLoading" @click="addDialogVisible = false">取 消</el-button>
        <el-button :loading="saveBtnLoading" type="primary" @click="submitSaveFilter">添 加</el-button>
      </div>
    </el-dialog>
    <el-dialog
    title="编辑滤镜"
    :visible.sync="editDialogVisible"
    width="550px">
      <el-form ref="editForm" :model="editForm" :rules="editRules" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input
            v-model="editForm.name"
            auto-complete="off"
            placeholder="请输入名称">
          </el-input>
        </el-form-item>
        <el-form-item label="类别" prop="filter_type">
          <el-select v-model="editForm.filter_type" placeholder="请选择">
            <el-option
              v-for="item in filterTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="editBtnLoading" @click="deleteFilter">删 除</el-button>
        <el-button :loading="editBtnLoading" type="primary" @click="submitEditFilter">保 存</el-button>
      </div>
    </el-dialog>
  </d2-container>
</template>

<script>
import { CameraFilterList, AddCameraFilter, RemoveCameraFilter, ModifyCameraFilter } from '@/api/pages/settings/camera-filters'
export default {
  name: 'android',
  data () {
    return {
      tableData: [],
      pubDisabled: true,
      noSaving: true,
      saveBtnLoading: false,
      editBtnLoading: false,
      changedFields: {},
      currentId: 0,
      filterTypes: [{
        value: 0,
        label: '搞怪自拍（非耳朵）'
      }, {
        value: 1,
        label: '搞怪自拍（耳朵）'
      }, {
        value: 2,
        label: '拍外面'
      }, {
        value: 3,
        label: '遮脸'
      }],
      addDialogVisible: false,
      editDialogVisible: false,
      addForm: {
        name: '',
        photo_url: '',
        effect_url: '',
        filter_type: ''
      },
      editForm: {
        name: '',
        filter_type: ''
      },
      addRules: {
        name: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] },
          { min: 1, max: 16, message: '长度在 1 到 64 个字符', trigger: ['blur', 'change'] }
        ],
        photo_url: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        effect_url: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        filter_type: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ]
      },
      editRules: {
        name: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] },
          { min: 1, max: 16, message: '长度在 1 到 64 个字符', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  mounted () {
    this.fetch()
  },
  methods: {
    tableRowClassName ({ row, rowIndex }) {
      if (row.changed) {
        return 'change-row'
      } else if (rowIndex % 2 === 1) {
        return 'success-row'
      }
      return ''
    },
    getFilterTypeName (row) {
      switch (row.filterType) {
        case 0:
          return '搞怪自拍<br>（非耳朵）'
        case 1:
          return '搞怪自拍<br>（耳朵）'
        case 2:
          return '拍外面'
        case 3:
          return '遮脸'
        default:
          return '其他'
      }
    },
    async fetch () {
      this.pubDisabled = true
      const res = await CameraFilterList({})
      this.total = res.content.total
      this.tableData = res.content.filters
    },
    async saveFilter () {
      const res = await AddCameraFilter(this.addForm)
      console.log(res.pk)
      this.$refs.addForm.resetFields()
      this.addDialogVisible = false
      this.noSaving = true
      this.saveBtnLoading = false
      this.fetch()
    },
    submitSaveFilter () {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.noSaving = false
          this.saveBtnLoading = true
          this.saveFilter()
        } else {
          return false
        }
      })
    },
    editRow (row) {
      this.currentId = row.fid
      this.editForm.name = row.name
      this.editForm.filter_type = row.filterType
      this.editDialogVisible = true
    },
    async remoceFilter () {
      const res = await RemoveCameraFilter({
        pk: this.currentId
      })
      this.currentId = 0
      this.editBtnLoading = false
      this.editDialogVisible = false
      this.$notify({
        title: res.msg,
        duration: 3000
      })
      this.fetch()
    },
    deleteFilter () {
      this.$confirm('确定删除该滤镜?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.editBtnLoading = true
        this.remoceFilter()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    async modifyFilter () {
      const res = await ModifyCameraFilter({
        pk: this.currentId,
        name: this.editForm.name,
        filter_type: this.editForm.filter_type
      })
      this.currentId = 0
      this.editBtnLoading = false
      this.editDialogVisible = false
      this.$notify({
        title: res.msg,
        duration: 3000
      })
      this.fetch()
    },
    submitEditFilter () {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.$confirm('确定修改该滤镜?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.editBtnLoading = true
            this.modifyFilter()
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
        } else {
          return false
        }
      })
    },
    online (scope, flag) {
      const rowIndex = scope.$index
      const filterId = scope.row.fid
      const currentOnline = scope.row.online

      scope.row.online = flag
      if (this.changedFields[filterId] === void 0) {
        scope.row.oriOnline = currentOnline
        scope.row.changed = true

        this.pubDisabled = false
        this.changedFields[filterId] = {
          online: flag,
          rank: rowIndex + 1
        }
      } else {
        const currentRank = this.changedFields[filterId].rank

        if (currentRank === scope.row.rank && scope.row.oriOnline === scope.row.online) {
          delete this.changedFields[filterId]
          scope.row.changed = false
        } else {
          this.changedFields[filterId] = {
            online: flag,
            rank: rowIndex + 1
          }
        }
      }

      console.log(this.changedFields)
      if (Object.keys(this.changedFields).length === 0) {
        this.pubDisabled = true
      }
    },
    order (rank, scope) {
      const rowIndex = scope.$index
      const filterId = scope.row.fid
      if (this.changedFields[filterId] === void 0) {
        scope.row.oriOnline = scope.row.online
        scope.row.changed = true

        this.pubDisabled = false
        this.changedFields[filterId] = {
          online: scope.row.online,
          rank: rowIndex + 1 + rank
        }
      } else {
        const currentRank = this.changedFields[filterId].rank + rank

        if (currentRank === scope.row.rank && scope.row.online === scope.row.oriOnline) {
          delete this.changedFields[filterId]
          scope.row.changed = false
        } else {
          this.changedFields[filterId] = {
            online: scope.row.online,
            rank: rowIndex + 1 + rank
          }
        }
      }
      const rowData = this.tableData.splice(rowIndex, 1)
      this.tableData.splice(rowIndex + rank, 0, rowData[0])

      console.log(this.changedFields)
      if (Object.keys(this.changedFields).length === 0) {
        this.pubDisabled = true
      }
    }
  }
}
</script>

<style>
  .el-table .success-row {
    background: #f0f9eb;
  }

  .el-table .change-row {
    background: #f3d19e;
  }
</style>

<style scoped>
  .photo{
    width: 50px;
  }

  .online-text {
    color: #2ECC00;
  }

  .icon-div {
    width: 28px;
    height: 64px;
    margin-right: 10px;
    display: inline-flex;
    flex-direction: column;
    justify-content: space-around;
    vertical-align: middle;
  }

  .icon-rank {
    width: 28px;
    height: 28px;
    text-align: center;
    background-color: #f4f4f5;
    border-color: #e9e9eb;
    color: #909399;
    display: block;
    padding: 0 6px;
    line-height: 24px;
    font-size: 12px;
    border-width: 1px;
    border-style: solid;
    border-radius: 4px;
    box-sizing: border-box;
    white-space: nowrap;
    cursor: pointer;
  }
</style>
