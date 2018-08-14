<template>
  <div ref="chatDiv" style="margin: -16px;">
    <SplitPane :min-percent='25' :default-percent='25' split="vertical" style="height: 100%;">
      <template slot="paneL">
        <user-list></user-list>
      </template>
      <template slot="paneR">
        <SplitPane split="horizontal" :min-percent='80' :default-percent='80'>
          <template slot="paneL">
            <div style="margin: 10px;">右上</div>
          </template>
          <template slot="paneR">
            <chat-input></chat-input>
          </template>
        </SplitPane>
      </template>
    </SplitPane>
    <div>
    </div>
    <el-tag
      class="reply-tag"
      v-for="tag in tags"
      :key="tag.name"
      closable
      color="rgba(0, 0, 0, .5)">
      {{tag.name}}
    </el-tag>
  </div>
</template>

<script>
  import userList from './components/user-list'
  import chatInput from './components/chat-input'
  export default {
  	name: 'user-chat',
  	components: {
	    'user-list': userList,
      'chat-input': chatInput
    },
    data() {
	  return {
			selectSearch: '1',
			inputSearch: '',
	  	clientHeight: 0,
      tags: [
        { name: '标签1'},
        { name: '标签2'},
        { name: '标签3'},
        { name: '标签4'},
        { name: '标签5'},
        { name: '标签6'},
        { name: '标签7'}
      ]
    }
	},
    mounted () {
      this.clientHeight = `${document.documentElement.clientHeight}`
    },
    watch: {
      clientHeight: function () {
      	this.changeFixed(this.clientHeight)
      }
    },
    methods: {
      changeFixed(clientHeight){
        this.$refs.chatDiv.style.height = clientHeight - 190 + 'px'
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
    margin-top: 15px;
    margin-right: 4px;
  }

  .search{
    margin-bottom: 5px;
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