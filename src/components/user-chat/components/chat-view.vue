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
                <div :class="chat.right ? 'bubble bubble-right' : 'bubble'" v-if="row.messageType === 0">
                  {{ row.message }}
                </div>
                <div v-else-if="row.messageType === 9">
                  <video :ref="`video-${index}`" class="chat-peek" v-if="row.extraContext.video" :src="row.extraContext.video" onclick="this.play();"></video>
                  <img :class="'chat-peek-photo' + (row.extraContext.video != void 0 ? ' chat-peek-doodle' : '')" v-if="row.extraContext.photo" :src="row.extraContext.photo" @click="playPeek(`video-${index}`)">
                </div>
                <div v-else>[未处理消息]</div>
              </li>
            </ul>
          </div>
          <div :key="`clear-div-${index}`" class="clear"></div>
        </template>
      </div>
    </div>
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
        // 滚动条滚到90%的地方
        if (this.BS.maxScrollY * 0.9 > pos.y) {
          if (this.refreshScroll === false) {
            this.refreshScroll = true
            console.log('scroll to 90%')
            this.BS.refresh()
            console.log(this.BS.maxScrollY)
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
        console.log(this.BS.maxScrollY)
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
          console.log(res)
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
      console.log(video)
      this.$refs[`${video}`][0].play()
    }
  }
}
</script>

<style scoped>
  .clear {
    clear:both;
  }

  .wrapper {
    height: 80%;
    overflow: scroll;
  }

  .content {
    list-style: none;
    padding: 0 25px;
  }

  .wrapper li {
    list-style-type: none;
    line-height: 20px;
    margin-bottom: 5px;
  }

  .chat-content {
    padding-left: 65px;
    color: rgba(0, 0, 0, 0.9);;
    font-size: 16px;
    font-weight: bold;
    word-break: break-all;
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
    padding-right: 65px;
    color: black !important;
  }

  .chat-profile-right {
    right: 38px;
  }

  .bubble {
    border-radius: 10px;
    padding: 5px 10px;
    background-color: #f5f4f4;
    display: inline-block;
  }

  .bubble-right {
    background-color: #A0E75A;
  }

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
</style>
