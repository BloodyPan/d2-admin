<template>
  <div class="tag-div">
    <el-button class="button-new-tag" size="small" @click="showDialog">+ New Tag</el-button>
    <el-tooltip
      :content="reply.desc"
      placement="top"
      :key="reply.qid"
      v-for="(reply, index) in replies">
      <el-tag
        class="reply-tag"
        closable
        :disable-transitions="false"
        @close="handleClose(index, reply.qid)"
        v-on:click.native="sendQuickReply(reply.desc)"
        color="rgba(0, 0, 0, .5)">
        {{ reply.phrase }}
      </el-tag>
    </el-tooltip>

    <el-dialog title="添加快捷回复" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="Tag简单描述"  prop="phrase" :label-width="formLabelWidth">
          <el-input
            v-model="form.phrase"
            auto-complete="off"
            placeholder="简单的描述">
          </el-input>
        </el-form-item>
        <el-form-item label="具体回复内容"  prop="desc" :label-width="formLabelWidth">
          <el-input
            type="textarea"
            :rows="3"
            v-model="form.desc"
            auto-complete="off"
            placeholder="具体回复给用户的内容">
          </el-input>
        </el-form-item>
        <el-form-item label="是否私有" :label-width="formLabelWidth">
          <el-switch v-model="form.private" inactive-text="public" active-text="private">
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addReplyTag">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { GetQuickReply, AddQuickReply, DelQuickReply } from '@/api/components/user-chat/chat-quick-reply'

export default {
  name: 'chat-quick-reply',
  data () {
    return {
      replies: [],
      dialogFormVisible: false,
      formLabelWidth: '120px',
      form: {
        phrase: '',
        desc: '',
        private: false
      },
      rules: {
        phrase: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] },
          { min: 1, max: 16, message: '长度在 1 到 16 个字符', trigger: ['blur', 'change'] }
        ],
        desc: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] },
          { min: 1, max: 256, message: '长度在 1 到 256 个字符', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  mounted () {
    this.getTag()
  },
  methods: {
    sendQuickReply (desc) {
      this.$emit('send', desc)
    },
    handleClose (index, qid) {
      this.replies.splice(index, 1)
      this.delTag(qid)
    },
    showDialog () {
      this.form.phrase = ''
      this.form.desc = ''
      this.dialogFormVisible = true
      try {
        this.$refs.form.resetFields()
      } catch (err) {
      }
    },
    addReplyTag () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.dialogFormVisible = false
          this.addTag(this.form)
        } else {
          this.$message.error('表单验证未通过')
          return false
        }
      })
    },
    async getTag (params) {
      const res = await GetQuickReply(params)
      if (res.content.total > 0) {
        this.replies = res.content.replies
      }
    },
    async addTag (data) {
      const res = await AddQuickReply({
        data: JSON.stringify(data)
      })
      this.replies.push(res.reply)
      this.$notify({
        title: '添加成功',
        message: '快捷回复已经成功添加',
        duration: 3000
      })
    },
    async delTag (qid) {
      await DelQuickReply({
        pk: qid
      })

      this.$notify({
        title: '删除成功',
        message: '快捷回复已经成功删除',
        duration: 3000
      })
    }
  }
}
</script>

<style scoped>
  .tag-div {
    line-height: 2.3;
    white-space: nowrap;
    width: 99%;
    overflow: scroll;
  }

  .el-tag {
    color: #FFFFFF !important;
    cursor: pointer;
  }

  .reply-tag{
    margin-right: 4px;
  }

  .button-new-tag {
    margin-right: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }

  .input-new-tag {
    width: 120px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>

<style>
  .el-tag .el-icon-close{
    color: #FFFFFF !important;
    cursor: pointer
  }

  .el-select .el-input {
    width: 100px;
  }

  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
</style>
