<template>
  <div ref="chatDiv" style="margin: -16px;">
    <SplitPane :min-percent='25' :default-percent='25' split="vertical" style="height: 100%;">
      <template slot="paneL">
        <user-list></user-list>
      </template>
      <template slot="paneR">
        <!--<div style="width: 100%;height: 100%;">asdsddd</div>-->
        <SplitPane split="horizontal" :min-percent='80' :default-percent='80'>
          <template slot="paneL">
            <chat-view ref="chatView"></chat-view>
          </template>
          <template slot="paneR">
            <chat-input @send="sendMessage"></chat-input>
          </template>
        </SplitPane>
      </template>
    </SplitPane>
    <chat-quick-reply @send="sendMessage" style="margin-top: 10px;"></chat-quick-reply>
  </div>
</template>

<script>
  import userList from './components/user-list'
  import chatInput from './components/chat-input'
	import chatView from './components/chat-view'
	import chatQuickReply from './components/chat-quick-reply'
  export default {
  	name: 'user-chat',
  	components: {
	    'user-list': userList,
      'chat-input': chatInput,
      'chat-view': chatView,
			'chat-quick-reply': chatQuickReply
    },
    data() {
      return {
        clientHeight: 0
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
      },
      sendMessage(msg){
        this.$refs.chatView.send(msg)
      }
    }
  }
</script>

<style scoped>
</style>