<template>
  <div style="line-height: 2.3;">
    <el-tag
      class="reply-tag"
      v-for="tag in tags"
      :key="tag"
      closable
      :disable-transitions="false"
      @close="handleClose(tag)"
      v-on:click.native="sendQuickReply(tag)"
      color="rgba(0, 0, 0, .5)">
      {{tag}}
    </el-tag>
    <el-input
      class="input-new-tag"
      v-if="inputVisible"
      v-model="inputValue"
      ref="saveTagInput"
      size="small"
      @keyup.enter.native="handleInputConfirm"
      @blur="handleInputConfirm">
    </el-input>
    <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
  </div>
</template>

<script>
	export default {
		name: "chat-quick-reply",
    data() {
			return {
				tags: ['谢谢反馈', '意见在修复啦', '期待下一版哦', '快点去更新新版吧'],
				inputVisible: false,
				inputValue: ''
      }
    },
    methods: {
			showInput() {
				this.inputVisible = true;
				this.$nextTick(_ => {
					this.$refs.saveTagInput.$refs.input.focus();
				});
			},
			sendQuickReply(tag) {
				this.$emit('send', tag);
      },
			handleClose(tag) {
				this.tags.splice(this.tags.indexOf(tag), 1);
			},
			handleInputConfirm() {
				let inputValue = this.inputValue;
				if (inputValue) {
					this.tags.push(inputValue);
				}
				this.inputVisible = false;
				this.inputValue = '';
			}
    }
	}
</script>

<style scoped>
  .el-tag{
    color: #FFFFFF !important;
    cursor: pointer;
  }

  .reply-tag{
    margin-right: 4px;
  }

  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }

  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>

<style>
  .el-tag .el-icon-close{
    color: #FFFFFF !important;
    cursor: pointer;
  }

  .el-select .el-input {
    width: 100px;
  }

  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
</style>
