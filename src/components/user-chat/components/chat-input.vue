<template>
  <div class="chat-input-div">
    <el-input
      type="textarea"
      resize="none"
      class="el-text-area"
      placeholder="请输入内容"
      v-model="chatContent">
    </el-input>
    <el-row class="btn-row">
      <el-button type="primary" @click="send">发送</el-button>
    </el-row>
  </div>
</template>

<script>
import util from '@/libs/util.js'
export default {
  name: 'chat-input',
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
    }
  }
}
</script>

<style scoped>
  .chat-input-div {
    margin: 5px 0 5px 5px;
    height: 100%;
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
  .chat-input-div textarea {
    height: 95% !important;
    border: 0 !important;
    outline: 0 !important;
  }
</style>
