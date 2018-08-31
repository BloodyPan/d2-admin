<template>
  <div class="chat-input-div">
    <chat-quick-reply @send="sendQuickReply" style="margin-top: 10px;"></chat-quick-reply>
    <el-row class="text-div">
      <el-input
      type="textarea"
      resize="none"
      class="el-text-area"
      placeholder="请输入内容"
      v-model="chatContent">
    </el-input>
    </el-row>
    <el-row class="btn-row">
      <el-button type="primary" @click="send">发送</el-button>
    </el-row>
  </div>
</template>

<script>
import util from '@/libs/util.js'
import chatQuickReply from './chat-quick-reply'
export default {
  name: 'chat-input',
  components: {
    'chat-quick-reply': chatQuickReply
  },
  data () {
    return {
      chatContent: ''
    }
  },
  methods: {
    send () {
      if (util.spot.trim(this.chatContent)) {
        this.$emit('send', this.chatContent)
      }
      this.chatContent = ''
    },
    sendQuickReply (msg) {
      this.$emit('send', msg)
    }
  }
}
</script>

<style scoped>
  .chat-input-div {
    margin: 5px 0 5px 5px;
    height: 100%;
  }

  .text-div {
    height: 60%;
  }

  .el-text-area {
    height: 100%;
  }

  .btn-row {
    position: absolute;
    right: 10px;
    bottom: 10px;
  }
</style>

<style>
  .text-div textarea {
    height: 95% !important;
    border: 0 !important;
    outline: 0 !important;
  }
</style>
