<template>
  <div ref="chatDiv" style="margin: -16px;">
    <SplitPane :min-percent='18' :default-percent='18' split="vertical">
      <template slot="paneL">
        <user-list></user-list>
      </template>
      <template slot="paneR">
        <SplitPane split="horizontal" :min-percent='80' :default-percent='80'>
          <template slot="paneL">
            <div style="margin: 10px;">右上</div>
          </template>
          <template slot="paneR">
            <div style="margin: 10px;">右下</div>
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
  export default {
  	name: 'user-chat',
  	components: {
	    'user-list': userList
    },
    data() {
	  return {
	  	clientHeight: 400,
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
      this.clientHeight =   `${document.documentElement.clientHeight}`          //document.body.clientWidth;
      window.onresize = function temp() {
      	this.clientHeight = `${document.documentElement.clientHeight}`
      };
      this.$refs.chatDiv.style.height = this.clientHeight - 250 + 'px'
    },
    watch: {
      clientHeight: function () {
      	this.changeFixed(this.clientHeight)
      }
    },
    methods: {
      changeFixed(clientHeight){
        this.$refs.chatDiv.style.height = clientHeight - 250 + 'px'
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
</style>

<style>
  .el-tag .el-icon-close{
    color: #FFFFFF !important;
    cursor: pointer;
  }
</style>