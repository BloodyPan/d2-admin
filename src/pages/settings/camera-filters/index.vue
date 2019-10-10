<template>
  <d2-container>
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
      <el-table-column prop="name" label="类别">
        <template slot-scope="scope">
          <span style="text-align: center;" v-html="getFilterTypeName(scope.row)"></span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.online" class="online-text">上架</span>
          <span v-else>下架</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot="header">
          <el-button
            size="medium"
            type="primary"
            plain
            @click="addDialogVisible = true">
            添加哈哈镜
          </el-button>
          <el-button
            :disabled="noChanged"
            size="medium"
            type="success">
            保存并发布
          </el-button>
        </template>
        <template slot-scope="scope">
          <el-button
            size="mini"
            plain
            @click="handleRemove(scope.$index, scope.row)">
            编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            plain
            v-if="scope.row.online"
            @click="handleRemove(scope.$index, scope.row)">
            下架
          </el-button>
          <el-button
            size="mini"
            type="success"
            plain
            v-else
            @click="handleRemove(scope.$index, scope.row)">
            上架
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
    title="添加滤镜"
    :visible.sync="addDialogVisible"
    width="450px">
      <el-form ref="form" :model="addForm" :rules="addRules" label-width="80px">
        <el-form-item label="名称" prop="phrase">
          <el-input
            v-model="addForm.name"
            auto-complete="off"
            placeholder="请输入名称">
          </el-input>
        </el-form-item>
        <el-form-item label="类别" prop="phrase">
          <el-select v-model="addForm.filter_type" placeholder="请选择">
            <el-option
              v-for="item in filterTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="缩略图" prop="phrase">
          <el-input
            v-model="addForm.photo_url"
            auto-complete="off"
            placeholder="请输入缩略图文件名">
          </el-input>
        </el-form-item>
        <el-form-item label="数据包" prop="phrase">
          <el-input
            v-model="addForm.effect_url"
            auto-complete="off"
            placeholder="请输入数据包文件名">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary">确 定</el-button>
      </div>
    </el-dialog>
  </d2-container>
</template>

<script>
import { CameraFilterList, AddCameraFilter } from '@/api/pages/settings/face-filters'
export default {
  name: 'android',
  data () {
    return {
      tableData: [],
      noChanged: true,
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
      addForm: {
        name: '',
        photo_url: '',
        effect_url: '',
        filter_type: ''
      },
      addRules: {
        name: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] },
          { min: 1, max: 16, message: '长度在 1 到 16 个字符', trigger: ['blur', 'change'] }
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
      const res = await CameraFilterList({})
      this.total = res.content.total
      this.tableData = res.content.filters
    },
    async saveFilter () {
      const res = await AddCameraFilter(this.addForm)
      console.log(res.pk)
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
</style>
