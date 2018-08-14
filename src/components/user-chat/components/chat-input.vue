<template>
  <div class="input-div">
    <el-input
      type="textarea"
      resize="none"
      :autosize="{ minRows: 4, maxRows: 4}"
      placeholder="请输入内容"
      v-model="chatContent">
    </el-input>
    <el-row class="btn-row">
      <el-button type="primary">发送</el-button>
    </el-row>
  </div>
</template>

<script>
	export default {
		name: "chat-input",
    data() {
			return {
        chatContent: ''
      }
    }
	}
</script>

<style scoped>
  .input-div{
    margin: 5px 0 5px 5px;
  }

  .btn-row{
    position: absolute;
    right: 10px;
    bottom: 10px;
  }
</style>