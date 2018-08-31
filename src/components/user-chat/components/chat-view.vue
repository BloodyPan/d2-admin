<template>
  <div style="height: 100%; overflow: scroll;">
    <chat-view-tag :user="user" :device="device"></chat-view-tag>
    <div class="wrapper" ref="wrapper">
      <div class="content">
        <template v-for="(chat, index) in chats">
          <div :key="`chat-row-${index}`" :class="chat.right ? 'chat-content-row-right' : 'chat-content-row'">
            <img :class="chat.right ? 'chat-profile chat-profile-right' : 'chat-profile'" :src="chat.profilePhoto">
            <ul style="margin: 0;" class="chat-content">
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
                <!-- MESSAGE_TYPE_FACE_MESSAGE -->
                <div v-else-if="row.messageType === 9">
                  <video :ref="`${row.extraContext.video}_${row.extraContext.photo}`" class="chat-peek" v-if="row.extraContext.video" :src="row.extraContext.video" onclick="this.play();"></video>
                  <img :class="'chat-peek-photo' + (row.extraContext.video != void 0 ? ' chat-peek-doodle' : '')" v-if="row.extraContext.photo" :src="row.extraContext.photo" @click="playPeek(`${row.extraContext.video}_${row.extraContext.photo}`)">
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
import chatViewTag from './chat-view-tag'

export default {
  name: 'chat-view',
  mixins: [
    bs
  ],
  components: {
    'chat-view-tag': chatViewTag
  },
  data () {
    return {
      uid: 0,
      cuid: 0,
      user: {},
      device: {},
      chats: [],
      chats_tmp: [],
      refreshScroll: false,
      teamSpotAvatar: 'http://pic1.getremark.com/RemarkGuideAvatar.png'
    }
  },
  mounted () {
    this.$nextTick(_ => {
      this.BS.on('scroll', (pos) => {
        // 滚动条滚到90%的地方，刷下better-scroll
        if (this.BS.maxScrollY * 0.9 > pos.y) {
          if (this.refreshScroll === false) {
            this.refreshScroll = true
            this.BS.refresh()
          }
        }
      })
    })
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
      for (var index in msgs) {
        if (msgs[index].uid !== this.cuid) {
          this.cuid = msgs[index].uid
          let isNormalUser = this.cuid === this.user.id
          this.chats_tmp.push({
            right: !isNormalUser,
            profilePhoto: isNormalUser ? this.user.profilePhoto : this.teamSpotAvatar,
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
        this.BS.scrollTo(0, this.BS.maxScrollY)

        // 二次刷新
        let that = this
        setTimeout(() => {
          that.BS.refresh()
          that.BS.scrollTo(0, that.BS.maxScrollY)
        }, 100)
      })
    },
    fetch (uid) {
      if (this.uid === uid) {
        return
      }
      this.refreshScroll = false
      this.uid = uid
      this.$axios({
        method: 'get',
        url: 'ChatMessage',
        params: {
          uid: uid
        }
      })
        .then(res => {
          this.user = res.user
          this.device = res.user.device
          this.generateData(res.content.messages, true)
        })
        .catch(err => {
          this.$message.error(err)
        })
      util.log.capsule('ChatView-Fetch', uid, 'danger')
    },
    send (text) {
      if (this.uid !== 0) {
        util.log.capsule('ChatView-Content', text, 'danger')
        let msgs = [
          {
            chatType: 0,
            createdAt: 1535110550,
            message: text,
            messageType: 0,
            uid: util.spot.spotHelperId
          }
        ]
        this.generateData(msgs, false)

        let params = util.spot.csrfParam()
        params.append('uid', this.uid)
        params.append('message', text)
        params.append('message_type', 0)
        this.$axios({
          method: 'post',
          url: 'ChatMessage',
          data: params
        })
          .then(res => {

          })
          .catch(err => {
            this.$message.error(err)
          })
      }
    },
    playPeek (video) {
      this.$refs[`${video}`][0].play()
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
    height: 85%;
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
    width: 50px;
    height: 50px;
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
    width: 120px;
  }

  .chat-peek-photo {
    width: 120px;
    z-index: 999;
    position: relative;
  }

  .chat-peek-doodle {
    margin-left: -120px;
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

  .music-icon {
    width: 10px;
    margin-right: 3px;
  }

  .music-lyric {
    display: inline-block;
    vertical-align: baseline;
  }
</style>
