<template>
  <d2-container class="mng-list" :filename="filename">
    <slot name="search-box">
      <el-row>
        <el-col :span="showOptionBox? 24 : 23">
          <slot name="search-inner-box">
          </slot>
        </el-col>
      </el-row>
    </slot>

    <slot name="option-box" v-if="showOptionBox">
      <el-row class="mng-list-option-box">
        <el-col :span="23">
          <el-button v-access="createAccessRule" size="small" type="primary" @click="onClickCreate">新增</el-button>
          <el-button v-access:alias="updateAccessRule" size="small" @click="onClickUpdate">修改</el-button>
          <el-button v-access="delAccessRule" size="small" type="danger" @click="onClickDel">删除</el-button>
          <slot name="option-box-attch-but"></slot>
        </el-col>
      </el-row> 
    </slot>

    <slot>
      <el-table
        :data="page.records"
        stripe
        height="600"
        border
        style="width: 100%">
        <!--实现自己需要定义table-->
      </el-table>
    </slot>

    <template slot="footer">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.current"
        :page-sizes="[5, 10, 50, 100]"
        :page-size="page.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total">
      </el-pagination>
    </template>
    <slot name="form-dialog">
      <el-dialog
        :title="formMode === 'edit' ? '编辑' : '新增'"
        :visible.sync="dialogFormVisible"
        :before-close="handleClose"
        width="70%"
        :modal="true">
        <slot name="form"></slot>
      </el-dialog>
    </slot>
  </d2-container>
</template>

<script>
import _ from 'lodash'
import { mapState } from 'vuex'
export default {
  name: 'd2-mng-page',
  props: {
    // 针对d2-admin 查看源码功能的属性配置
    filename: {
      type: String,
      default: __filename
    },
    formMode: {
      type: String,
      default: 'add'
    },
    dialogFormVisible: false,
    onClickCreateModifyDialogFormVisible: {
      type: Boolean,
      default() {
        return true
      }
    },
    showOptionBox: false,
    selectRows: {
      type: Array,
      default() {
        return []
      }
    },
    page: {
      type: Object,
      default() {
        return {
          records: [],
          total: 0,
          size: 10,
          current: 1
        }
      }
    },
    // 添加按钮的`access`权限规则
    createAccessRule: {
      type: [String, Array, Object],
      default() {
        return []
      }
    },
    // 采用别名模式
    updateAccessRule: {
      type: [String, Array],
      default() {
        return []
      }
    },
    delAccessRule: {
      type: [String, Array, Object],
      default() {
        return []
      }
    }
  },
  data () {
    return {
    }
  },
  methods: {
    handleClose(done) {
      this.$emit('update:dialogFormVisible', false)
    },
    handleSizeChange(val) {
      this.page.size = val
      // 混合组件实现
      this.qryData()
    },
    handleCurrentChange(val) {
      this.page.current = val
      // 混合组件实现
      this.qryData()
    },
    onClickCreate() {
      this.$emit('update:formMode', 'add')
      this.$emit('create')
      if (this.onClickCreateModifyDialogFormVisible) {
        this.$emit('update:dialogFormVisible', true);
      }
    },
    onClickUpdate() {
      if (!_.isEmpty(this.selectRows) && this.selectRows.length === 1) {
        this.$emit('update:formMode', 'edit')
        this.$emit('update', this.selectRows[0])
      } else {
        this.$vp.toast('请选择一条需要编辑的记录', { type: 'warning' })
      }
    },
    onClickDel() {
      if (!_.isEmpty(this.selectRows) || this.selectRows.length === 1) {
        this.$emit('del')
      } else {
        this.$vp.toast('请选择一条需要删除的记录', { type: 'warning' })
      }
    },
    qryData() {
      this.$emit('qry-data')
    }
  }
}
</script>

<style lang="scss" scoped>
  .mng-list-option-box {
    margin-bottom: 10px;
  }
</style>