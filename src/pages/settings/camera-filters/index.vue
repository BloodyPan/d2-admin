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
      :loading="pubLoading"
      size="medium"
      type="success"
      @click="publish">
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
      <el-table-column width="50">
        <template slot-scope="scope">
          <span v-if="scope.row.changed" style="color: #f56c6c; font-size: 20px;">
            <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
          </span>
        </template>
      </el-table-column>
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

      <el-table-column label="" width="50">
        <template slot-scope="scope">
          <span v-if="scope.row.rankChange">
            <span class="icon-up" v-if="scope.row.rankChange > 0">
              <i class="fa fa-chevron-up" aria-hidden="true"></i>
              {{ scope.row.rankChange }}
            </span>
            <span class="icon-down" v-else>
              <i class="fa fa-chevron-down" aria-hidden="true"></i>
              {{ Math.abs(scope.row.rankChange) }}
            </span>
          </span>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
    title="添加滤镜"
    :before-close="resetAddForm"
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
        <el-form-item>
          <el-alert
            title="文件前缀: http://npic.getremark.com/"
            type="info"
            :closable="false"
            show-icon>
          </el-alert>
        </el-form-item>
        <el-form-item label="缩略图" prop="photo_url">
          <el-input
            v-model="addForm.photo_url"
            disabled
            auto-complete="off"
            placeholder="请上传缩略图">
          </el-input>
          <file-upload ref="uploadAvatar" @success="uploadedAvatar" @remove="removeAvatar"></file-upload>
        </el-form-item>
        <el-form-item label="数据包" prop="effect_url">
          <el-input
            v-model="addForm.effect_url"
            disabled
            auto-complete="off"
            placeholder="请上传滤镜数据包">
          </el-input>
          <file-upload ref="uploadZip" @success="uploadedZip" @remove="removeZip"></file-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="saveBtnLoading" @click="resetAddForm">取 消</el-button>
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
import fileUpload from '../../../components/file-upload'
import { CameraFilterList, AddCameraFilter, RemoveCameraFilter, ModifyCameraFilter, CameraFilterPublish } from '@/api/pages/settings/camera-filters'
export default {
  components: {
    'file-upload': fileUpload
  },
  data () {
    return {
      tableData: [],
      pubDisabled: true,
      pubLoading: false,
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
        filter_type: 0
      },
      editForm: {
        name: '',
        filter_type: ''
      },
      addRules: {
        name: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] },
          { min: 1, max: 64, message: '长度在 1 到 64 个字符', trigger: ['blur', 'change'] }
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
          { min: 1, max: 64, message: '长度在 1 到 64 个字符', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  mounted () {
    this.fetch()
  },
  methods: {
    tableRowClassName ({ row, rowIndex }) {
      if (rowIndex % 2 === 1) {
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
    uploadedAvatar (filename) {
      this.addForm.photo_url = filename
    },
    removeAvatar () {
      this.addForm.photo_url = ''
    },
    uploadedZip (filename) {
      this.addForm.effect_url = filename
    },
    removeZip () {
      this.addForm.effect_url = ''
    },
    resetAddForm () {
      this.$refs.addForm.resetFields()
      this.$refs.uploadAvatar.clearUpload()
      this.$refs.uploadZip.clearUpload()
      this.addDialogVisible = false
    },
    async saveFilter () {
      const res = await AddCameraFilter(this.addForm)
      console.log(res.pk)
      this.noSaving = true
      this.saveBtnLoading = false
      this.resetAddForm()
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
    orderChangeFields (rowIndex, rank) {
      const row = this.tableData[rowIndex]

      if (this.changedFields[row.fid] === void 0) {
        row.oriOnline = row.online
        row.changed = true

        this.pubDisabled = false
        this.changedFields[row.fid] = {
          online: row.online,
          rank: rowIndex + 1 + rank
        }
      } else {
        const currentRank = this.changedFields[row.fid].rank + rank

        if (currentRank === row.rank && row.online === row.oriOnline) {
          delete this.changedFields[row.fid]
          row.changed = false
        } else {
          this.changedFields[row.fid] = {
            online: row.online,
            rank: rowIndex + 1 + rank
          }
        }
      }

      row.rankChange = row.rank - (rowIndex + 1 + rank)
    },
    order (rank, scope) {
      const rowIndex = scope.$index
      this.orderChangeFields(rowIndex, rank)
      this.orderChangeFields(rowIndex + rank, -1 * rank)

      const rowData = this.tableData.splice(rowIndex, 1)
      this.tableData.splice(rowIndex + rank, 0, rowData[0])

      console.log(this.changedFields)
      if (Object.keys(this.changedFields).length === 0) {
        this.pubDisabled = true
      }
    },
    async filterPublish () {
      const res = await CameraFilterPublish({
        data: JSON.stringify(this.changedFields)
      })
      this.pubDisabled = true
      this.pubLoading = false
      this.changedFields = {}
      this.$notify({
        title: res.msg,
        duration: 3000
      })
      this.fetch()
    },
    publish () {
      this.pubLoading = true
      this.filterPublish()
    }
  }
}
</script>

<style>
  .el-table .success-row {
    background: #f0f9eb;
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

  .icon-up {
    color: #24ff33;
    vertical-align: middle;
  }

  .icon-down {
    color: #d62733;
    vertical-align: middle;
  }
</style>
