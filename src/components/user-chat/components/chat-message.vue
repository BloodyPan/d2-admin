<template>
  <div style="height: 100%; overflow: scroll; background: #ECECEC; padding-top: 10px;">
    <div class="wrapper" ref="wrapper">
      <div class="content">
        <template v-for="(chat, index) in chats">
          <div :key="`chat-row-${index}`" :class="chat.right ? 'chat-content-row-right' : 'chat-content-row'">
            <img :class="chat.right ? 'chat-profile chat-profile-right' : 'chat-profile'" :src="chat.profilePhoto">
            <ul style="margin: 0;" class="chat-content">
              <li :class="chat.nickClass">{{ chat.nickname }}</li>
              <li :key="`chat-li-${index}`" v-for="(row, index) in chat.rows">
                <!-- FEED_BACK -->
                <div :class="chat.right ? 'bubble bubble-right' : 'bubble'"
                  v-if="row.chatType === 1">
                  <div class='feedback'>Feedback</div>
                  <span>{{ row.message }}</span>
                </div>
                <!-- MESSAGE_TYPE_NORMAL -->
                <div :class="chat.right ? 'bubble bubble-right' : 'bubble'"
                  v-else-if="row.messageType === 0"
                  v-html="row.message.replace(/\n/g, '<br>')">
                </div>
                <!-- MESSAGE_TYPE_NORMAL -->
                <div v-else-if="row.messageType === 1">
                  <img class="sticker" :src="row.sticker.origin.gif"/>
                </div>
                <!-- MESSAGE_TYPE_FACE_MESSAGE -->
                <div style="position: relative;" class="pointer" v-else-if="row.messageType === 9">
                  <div class="video-icon-div" @click="playPeek(row.extraContext)" v-if="row.extraContext.video">
                      <img class="video-icon" src="http://wpic.getremark.com/icon-video-play.png">
                  </div>
                  <video :ref="`${row.extraContext.video}_${row.extraContext.photo}`" class="chat-peek" v-if="row.extraContext.video" :src="row.extraContext.video"  @click="playPeek(row.extraContext)"></video>
                  <img class="chat-peek-photo chat-peek-doodle" v-if="row.extraContext.video && row.extraContext.photo" :src="row.extraContext.photo" @click="playPeek(row.extraContext)">
                  <img class="chat-peek-photo" v-else-if="row.extraContext.photo" :src="row.extraContext.photo">
                </div>
                <!-- MESSAGE_TYPE_FIRE -->
                <div v-else-if="row.messageType === 16">
                  [打炮] <img class="fire-icon" :src="row.message">
                </div>
                <!-- MESSAGE_TYPE_GUESS -->
                <div v-else-if="row.messageType === 30">
                  [猜干嘛] {{ row.message }}
                </div>
                <!-- MESSAGE_TYPE_MUSIC_CHAT -->
                <div class="music-bubble" @click="playVoice(row.lyric.m4aUrl)" v-else-if="row.messageType === 32">
                  <img class="music-icon" src="//pic7.getremark.com/mc-playing.png">
                  <div class="music-lyric">{{ row.lyric.lyric }}</div>
                </div>
                <!-- MESSAGE_TYPE_VOICE_CHAT -->
                <div v-else-if="row.messageType === 33">
                  <button class="voice-icon" @click="playVoice(row.message)"></button>
                </div>
                <!-- MESSAGE_TYPE_GROUP_USER_JOINT -->
                <div v-else-if="row.messageType === 40">
                </div>
                <!-- MESSAGE_TYPE_SHARE_SHOP -->
                <div v-else-if="row.messageType === 44">
                  [分享店铺]
                </div>
                <!-- MESSAGE_TYPE_MEET_UP -->
                <div v-else-if="row.messageType === 45">
                  [店铺走起]
                </div>
                <!-- MESSAGE_TYPE_GOING -->
                <div v-else-if="row.messageType === 46">
                  [现在要去]
                </div>
                <!-- MESSAGE_TYPE_MUSIC -->
                <div v-else-if="row.messageType === 47">
                  [在听]
                </div>
                <!-- MESSAGE_TYPE_WEB -->
                <div v-else-if="row.messageType === 48">
                  [在看]
                </div>
                <div v-else>[未处理消息]</div>
              </li>
              <!-- 分隔 -->
              <li style="height: 20px;"></li>
            </ul>
          </div>
          <div :key="`clear-div-${index}`" class="clear"></div>
        </template>
      </div>
    </div>
    <audio ref="chatAudio" class="voice-player" src="" controls></audio>
  </div>
</template>

<script>
import util from '@/libs/util.js'
import bs from '@/components/common/bs'
import { ChatMessages } from '@/api/components/user-chat/chat-message'

export default {
  name: 'chat-message',
  mixins: [
    bs
  ],
  data () {
    return {
      userData: {},
      uid: 0,
      chatId: '',
      cuid: 0,
      device: {},
      chats: [],
      chats_tmp: [],
      refreshScroll: false,
      userIndex: {},
      fakeUser: util.data.fakeUser
    }
  },
  methods: {
    timeFormat: time => util.spot.formatTimestamp(time, 'yyyy-MM-dd hh:mm'),
    generateData (msgs, initChat) {
      let currentIndex = -1
      if (initChat) {
        this.chats = []
        this.chats_tmp = []
        this.cuid = 0
      } else {
        currentIndex = this.chats.length - 1
      }
      var fakeId = 1
      for (var index in msgs) {
        if (msgs[index].user.id !== this.cuid) {
          this.cuid = msgs[index].user.id

          if (this.userIndex[this.cuid] === void 0) {
            this.userIndex[this.cuid] = fakeId
            fakeId++
          }
          var userFakeId = this.userIndex[this.cuid]
          var inappropriatesFlag = msgs[index].user.id !== this.uid
          if (this.userData.scene === '群聊') {
            inappropriatesFlag = false
          }
          this.chats_tmp.push({
            right: false,
            profilePhoto: 'http://wpic.getremark.com/' + this.fakeUser[userFakeId].profilePhoto,
            nickname: this.fakeUser[userFakeId].nickname + (inappropriatesFlag ? ' 【被举报】' : ''),
            nickClass: inappropriatesFlag ? 'nickname-inappropriates' : 'nickname',
            rows: [msgs[index]]
          })
          currentIndex++
        } else {
          this.chats_tmp[currentIndex].rows.push(msgs[index])
        }
      }
      this.chats = this.chats_tmp
      this.$nextTick(_ => {
        this.BS.refresh()
        // this.BS.scrollTo(0, this.BS.maxScrollY)

        // 二次刷新
        let that = this
        setTimeout(() => {
          that.BS.refresh()
          // that.BS.scrollTo(0, that.BS.maxScrollY)
        }, 100)
      })
    },
    async fetch (userData) {
      const uid = userData.whistleblower.id
      const chatId = userData.chatId
      const time = userData.createdAt

      this.userData = userData
      if (this.chatId === chatId) {
        this.$emit('loaded', 1)
        return
      }
      this.refreshScroll = false
      this.uid = uid
      this.chatId = chatId

      const res = await ChatMessages({
        uid: uid,
        chat_id: chatId,
        time: time
      })
      console.log(res)
      if (res.content === void 0) {
        this.$emit('loaded', 0)
      } else {
        this.$emit('loaded', 1)
        this.generateData(res.content.messages, true)
      }
    },
    playPeek (context) {
      var refName = context.video + '_' + context.photo
      this.$refs[refName][0].play()
    },
    playVoice (voice) {
      this.$refs.chatAudio.src = voice
      this.$refs.chatAudio.play()
    }
  }
}
</script>

<style scoped>
  ul {
    -webkit-padding-start: 15px !important;
  }

  .clear {
    clear:both;
  }

  .wrapper {
    height: 100%;
    overflow: scroll;
    padding: 0 25px;
  }

  .content {
    list-style: none;
  }

  .wrapper li {
    list-style-type: none;
    line-height: 20px;
    margin-bottom: 5px;
  }

  .chat-content {
    color: rgba(0, 0, 0, 0.9);;
    font-size: 16px;
    font-weight: bold;
    word-break: break-all;
    display:flex;
    flex-direction:column;
    justify-content:center;
  }

  .chat-profile {
    width: 30px;
    height: 30px;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
  }

  .chat-content-row .chat-profile {
    float: left;
  }

  .chat-content-row-right {
    float: right;
  }

  .chat-content-row-right .chat-profile {
    float: right;
  }
  .chat-content-row-right .chat-content {
    text-align: right;
    padding-right: 15px;
    color: black !important;
  }

  .chat-profile-right {
    right: 38px;
  }

  .feedback {
    border-radius: 3px;
    padding: 2px 3px;
    background-color: #d9534f;
    font-size: 2px;
    color: rgba(255, 255, 255, 0.8);
    display: inline-block;
    margin-right: 5px;
  }

  .nickname {
    color: gray;
    font-size: 12px;
  }

  .nickname-inappropriates {
    color: red !important;
    font-size: 12px;
    font-weight: bolder;
  }

  /* 聊天气泡 */
  .bubble {
    border-radius: 10px;
    padding: 5px 10px;
    background-color: #ebebeb;
    display: inline-block;
  }

  .bubble-right {
    background-color: #A0E75A;
  }

  /* peek相关 */
  .chat-peek {
    width: 80px;
  }

  .pointer{
    cursor: pointer;
  }

  .video-icon-div {
    position: absolute;
    z-index: 1000;
    width: 80px;
    height: 100%;
    top: 0;
    left: 0;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .video-icon {
    width: 30px;
  }

  .chat-peek-photo {
    width: 80px;
    z-index: 999;
    position: relative;
    /* border: 2px solid #FF6A00; */
    /* border-radius: 10px; */
  }

  .chat-peek-doodle {
    margin-left: -82px;
  }

  .sticker {
    width: 100px;
  }

  /* 语音信息相关 */
  .voice-player{
    width: 0;
    height: 0;
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
  }

  .voice-icon {
    background: url("http://pic7.getremark.com/cms-voice-icon.png");
    background-size: contain;
    width: 40px;
    height: 40px;
    border: 0 !important;
    cursor: pointer;
    outline: none !important;
  }

  .voice-icon:active, .voice-icon:visited, .voice-icon:focus {
    background: url("http://pic7.getremark.com/cms-voice-icon-r.png");
    background-size: contain;
  }

  /* Music chat */
  .music-bubble {
    background-color: rgba(0, 0, 0, 0.04);
    border-radius: 16px;
    padding: 8px 12px;
    font-size: 14px;
    display: inline-block;
    cursor: pointer;
    background: url("//pic7.getremark.com/mc-back.png") no-repeat;
    background-size: cover;
    color: white;
  }

  .fire-icon {
    width: 15px;
    vertical-align: middle;
  }

  .music-icon {
    width: 10px;
    margin-right: 3px;
  }

  .music-lyric {
    display: inline-block;
    vertical-align: baseline;
  }
</style>
