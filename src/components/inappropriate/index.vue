<template>
    <div style="display: flex;justify-content: space-evenly;">
        <div v-if="showOverlay" class="overlay">Loading...</div>
        <div v-if="showLoading" class="blank" v-html="loadingText"></div>
        <peek class="peek" ref="peek" v-else-if="showPeek" :content="content"></peek>
        <div class="chat-message" v-if="showChat">
          <chat-message ref="chatMessage" @loaded="msgLoaded"></chat-message>
        </div>
        <ul class="inline-block">
            <li v-if="userData.user && (userData.user.nuked || userData.user.banLevel === 1 || userData.user.blocked === 1)">
              <div class="tag-div">
                  <div v-if="userData.user.nuked" class="nuke-tag">核弹</div>
                  <div v-if="userData.user.banLevel === 1" class="warning-tag">警告</div>
                  <div v-if="userData.user.blocked === 1" class="block-tag">屏蔽</div>
              </div>
            </li>
            <li v-if="userData.user">
              <div class="info-common user-info">
                <!-- <div class="profile-div">
                    <img class="profile" :src="userData.user.profilePhoto">
                </div> -->
                <!-- <div style="margin-top: 5px;">
                    <span>昵称</span>
                    <span class="float-right">{{ userData.user.nickname }}</span>
                </div>
                <div style="margin-top: 5px;">
                    <span>用户名</span>
                    <span class="float-right">{{ userData.user.username }}</span>
                </div> -->
                <div style="margin-top: 5px;">
                    <span>敏感词</span>
                    <span class="float-right">{{ userData.sensitiveWord }}</span>
                </div>
                <div style="margin-top: 5px;">
                    <span>敏感内容</span>
                    <span class="float-right">{{ userData.sensitiveContent }}</span>
                </div>
                <div style="margin-top: 5px;">
                    <span>观众人数</span>
                    <span class="float-right">{{ userData.public ? "-" : userData.seenTotal }}</span>
                </div>
                <div style="margin-top: 5px;">
                    <span>IP所在地</span>
                    <span class="float-right">{{ userData.user.device.ipGeoLocation }}</span>
                </div>
                <div style="margin-top: 5px;">
                    <span>注册时间</span>
                    <span class="float-right">{{ timeFormat(userData.user.dateJoined) }}</span>
                </div>
                <div style="margin-top: 5px;">
                    <span>手机型号</span>
                    <span class="float-right">{{ getUA(userData.user.device.userAgent) }}</span>
                </div>
              </div>
            </li>
            <li v-if="userData.inapporiateName">
              <div class="info-common story-info">
                  <div>
                      <span>举报类型</span>
                      <span class="float-right">{{ userData.inapporiateName }}</span>
                  </div>
                  <div>
                      <span>举报时间</span>
                      <span class="float-right">{{ timeFormat(userData.createdAt) }}</span>
                  </div>
                  <div>
                      <span>场所</span>
                      <span class="float-right">{{ userData.scene }}</span>
                  </div>
              </div>
            </li>
            <li>
              <div v-if="showBtns" class="btn-div">
                  <el-button type="info" :disabled="disIgnore" :loading="ignoreLoading" @click="ignore(userData)">{{ ignoreWording }}</el-button>
                  <div class="btn-panel" v-if="!showPublic && userData.scene !== '群聊'">
                    <el-button type="warning" v-if="showWarning" :loading="warnLoading" @click="warnUser(userData)">{{ warningWording }}</el-button>
                    <el-button type="danger" v-if="showBlock" :loading="blockLoading" @click="blockUser(userData)">{{ blockWording }}</el-button>
                    <el-button type="primary" v-if="!showBlock" :loading="blockLoading" @click="unblockUser(userData)">{{ unblockWording }}</el-button>
                  </div>
                  <div class="btn-panel" v-if="showPublic && userData.scene !== '群聊'">
                    <el-button type="warning" :loading="warnLoading" @click="warnPubStatus(userData)">{{ warningPSWording }}</el-button>
                    <el-button type="danger" :disabled="disBlock" v-if="showPublicBlock" :loading="blockLoading" @click="blockPubStatus(userData)">{{ blockPSWording }}</el-button>
                    <el-button type="primary" :disabled="disBlock" v-if="!showPublicBlock" :loading="blockLoading" @click="unblockPubStatus(userData)">{{ unblockPSWording }}</el-button>
                  </div>
              </div>
            </li>
        </ul>
    </div>
</template>

<script>
import util from '@/libs/util.js'
import peek from '../peek'
import chatMessage from '../user-chat/components/chat-message'
import { FeedDetail } from '@/api/pages/feed'
import { IngoreInappropriate, FlagUser, UnblockUser, BlockPublicStatus } from '@/api/pages/examine/inappropriate'

export default {
  name: 'inappropriate',
  components: {
    'peek': peek,
    'chat-message': chatMessage
  },
  props: {
    message: {
      type: Object
    }
  },
  data () {
    return {
      title: '',
      visible: false,
      /* ------------ 基本信息 -------- */
      userData: {},
      loadingText: 'loading...',
      /* ------------ Btn ----------- */
      showBtns: true,
      disBlock: false,
      disIgnore: false,
      ignoreWording: '正常并忽略',
      warningWording: '警告并标记',
      blockWording: '全网屏蔽',
      unblockWording: '解除屏蔽',
      warningPSWording: '警告并屏蔽24小时',
      blockPSWording: '永久屏蔽二三度',
      unblockPSWording: '解除屏蔽',
      ignoreLoading: false,
      warnLoading: false,
      blockLoading: false,
      showWarning: true,
      showBlock: true,
      /* ------------ 展示控件 ----------- */
      showOverlay: true,
      showLoading: true,
      showPeek: false,
      showChat: true,
      showPublic: false,
      showPublicBlock: true,
      /* ------------ peek 组件 -------- */
      content: {}
    }
  },
  watch: {
    message: function (val) {
      this.userData = val
      if (val.user) {
        this.showWarning = val.user.banLevel === 0
        this.showBlock = val.user.blocked === 0
      }
      this.showPublicBlock = val.blockTime < 31536000
      this.showPanel()
    }
  },
  methods: {
    timeFormat: time => util.spot.formatTimestamp(time, 'yyyy-MM-dd hh:mm:ss'),
    getUA: ua => util.spot.getUAInfo(ua),
    reset () {
      if (this.showPeek) {
        this.$refs.peek.stopPeek()
      }
      this.showOverlay = true
      this.showLoading = true
      this.ignoreLoading = false
      this.warnLoading = false
      this.blockLoading = false
      this.showPeek = false
      this.showChat = true
      this.showPublic = false
    },
    msgLoaded (flag) {
      this.showPeek = false
      this.showOverlay = false
      if (flag === 0) {
        this.showLoading = true
        this.showChat = false
        this.loadingText = '没有聊天'
      } else {
        this.showLoading = false
      }
    },
    showPanel () {
      var chatId = this.userData.chatId
      if (chatId === void 0) {
        return
      }

      var chatItems = chatId.split(':')
      var realChatId = chatItems[1]
      var chatIdItems = realChatId.split('_')
      var firstItem = chatIdItems[0]
      if (firstItem === 'status' || firstItem === 'feed') {
        this.showChat = false
        this.showOverlay = false
        this.showPublic = this.userData.public

        var status = firstItem === 'status' ? 1 : 0
        this.getPeek(chatIdItems[1], chatIdItems[2], status)
      } else {
        this.$refs.chatMessage.fetch(this.userData)
      }
    },
    async ignore (row) {
      this.ignoreLoading = true
      var res = await IngoreInappropriate({
        day: row.day,
        chat_id: row.chatId
      })
      this.$notify({
        title: res.msg,
        duration: 3000
      })
      this.$emit('delete', row)
    },
    async warnUser (row) {
      this.warnLoading = true
      var res = await FlagUser({
        username: row.user.username,
        flag: 1,
        flag_type: row.inappropriateType,
        day: row.day,
        chat_id: row.chatId
      })
      this.warnLoading = false
      this.showWarning = false
      this.$notify({
        title: res.msg,
        duration: 3000
      })
      row.user.banLevel = 1
      this.$emit('warn', row)
    },
    async blockUser (row) {
      this.blockLoading = true
      var res = await FlagUser({
        username: row.user.username,
        flag: 2,
        day: row.day,
        chat_id: row.chatId
      })
      this.blockLoading = false
      this.showBlock = false
      this.$notify({
        title: res.msg,
        duration: 3000
      })
      row.user.blocked = 1
      this.$emit('block', row, 1)
    },
    async unblockUser (row) {
      this.blockLoading = true
      var res = await UnblockUser({
        username: row.user.username,
        day: row.day,
        chat_id: row.chatId
      })
      this.blockLoading = false
      this.showBlock = true
      this.$notify({
        title: res.msg,
        duration: 3000
      })
      row.user.blocked = 0
      this.$emit('block', row, 0)
    },
    async warnPubStatus (row) {
      this.warnLoading = true
      var res = await BlockPublicStatus({
        day: row.day,
        chat_id: row.chatId,
        block_time: 86400
      })
      this.$notify({
        title: res.msg,
        duration: 3000
      })
      this.$emit('close')
    },
    async blockPubStatus (row) {
      var blockTime = 86400 * 365
      this.blockLoading = true
      var res = await BlockPublicStatus({
        day: row.day,
        chat_id: row.chatId,
        block_time: blockTime
      })
      this.blockLoading = false
      this.$notify({
        title: res.msg,
        duration: 3000
      })
      this.showPublicBlock = false
      row.blockTime = blockTime
      this.$emit('block-time', row, blockTime)
    },
    async unblockPubStatus (row) {
      this.blockLoading = true
      var res = await BlockPublicStatus({
        day: row.day,
        chat_id: row.chatId,
        block_time: 0
      })
      this.blockLoading = false
      this.$notify({
        title: res.msg,
        duration: 3000
      })
      this.showPublicBlock = true
      row.blockTime = 0
      this.$emit('block-time', row, 0)
    },
    async getPeek (userId, feedId, status) {
      var res = await FeedDetail({
        user_id: userId,
        feed_id: feedId,
        status: status
      })
      this.showLoading = false
      this.showPeek = true
      this.$nextTick(_ => {
        this.content = res.remark
      })
    }
  }
}
</script>

<style scoped>
  .overlay {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 1000;
    background-color: white;
    font-size: 16px;
    letter-spacing: 2px;
    color: rgba(0,0,0,.6);
    display: flex;
    align-items: center;
    justify-content: center;
    border-left: 1px solid #ececec;
    top: 0;
    left: 0;
  }

  .float-right {
    float: right;
  }

  .arrow-left {
    background-color: rgb(211, 210, 210);
    left: -16px;
    font-size: 16px;
  }

  .arrow-right {
    background-color: rgb(211, 210, 210);
    right: -16px;
    font-size: 16px;
  }

  .info-common {
    display: inline-block;
    vertical-align: top;
    margin-left: 20px;
    border-radius: 5px;
    padding: 20px;
    min-width: 28rem;
    font-size: 16px;
    font-weight: bold;
  }

  .user-info {
    background-color: #eafae1;
    color: rgba(0, 0, 0, 0.6);
  }

  .story-info {
    margin-top: 15px;
    background-color: rgb(186, 218, 250);
  }

  .info-icon {
    width: 35px;
    vertical-align: middle;
  }

  .info-count {
    font-size: 18px;
    vertical-align: middle;
    float: right;
  }

  .inline-block {
    display: inline-block;
  }

  ul {
    list-style: none;
    padding-inline-start: 0 !important;
    margin-block-start: 0 !important;
    margin-block-end: 0 !important;
    vertical-align: top;
    width: 65%;
  }

  .profile-div {
    text-align: center;
    margin-top: -50px;
    margin-bottom: 10px;
  }

  .profile {
    width: 50px;
    border-radius: 50%;
    vertical-align: middle;
  }

  .btn-div, .tag-div {
    text-align: right;
    display: inline-block;
    margin-left: 20px;
    border-radius: 5px;
    min-width: 28rem;
    font-size: 16px;
    font-weight: bold;
    padding: 20px 0 20px 40px
  }

  .blank {
    width: 500px;
    height: 500px;
    background-color: rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bolder;
  }

  .chat-message {
    width: 500px;
    height: 500px;
  }

  .btn-panel {
    display: inline-block;
    margin-left: 10px;
  }
</style>
