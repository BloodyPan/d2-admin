<template>
  <div ref="chatDiv" style="margin: -16px;">
    <SplitPane :min-percent='25' :default-percent='25' split="vertical" style="height: 100%;">
      <template slot="paneL">
        <user-list @showChat="displayChat"></user-list>
      </template>
      <template slot="paneR">
        <div v-if="overlay" class="overlay">还未选中或发起聊天，快去跟用户聊一聊吧</div>
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
  </div>
</template>

<script>
import userList from './components/user-list'
import chatInput from './components/chat-input'
import chatView from './components/chat-view'
export default {
  name: 'user-chat',
  components: {
    'user-list': userList,
    'chat-input': chatInput,
    'chat-view': chatView
  },
  data () {
    return {
      clientHeight: 0,
      overlay: true
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
    changeFixed (clientHeight) {
      this.$refs.chatDiv.style.height = clientHeight - 160 + 'px'
    },
    sendMessage (msg) {
      this.$refs.chatView.send(msg)
    },
    displayChat (uid) {
      this.overlay = false
      this.$refs.chatView.fetch(uid)
    }
  }
}
</script>

<style scoped>
  .overlay {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 999;
    background-color: white;
    font-size: 16px;
    letter-spacing: 2px;
    color: rgba(0,0,0,.6);
    display: flex;
    align-items: center;
    justify-content: center;
    border-left: 1px solid #ececec;
  }
</style>
