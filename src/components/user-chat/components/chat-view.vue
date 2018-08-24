<template>
  <div style="height: 100%; overflow: scroll;">
    <div class="detail-user-info">
      <div class="bg-tag-dark" v-if="user.username !== null">用户名: {{ user.username }}</div>
      <div class="bg-tag-important" v-if="user.friendCount !== null">当前好友: {{ user.friendCount }}</div>
      <div class="bg-tag-warning" v-if="user.storyCount !== null">当前Story: {{ user.storyCount }}</div>
      <div class="bg-tag-gray-middle" v-if="user.dateJoined">加入时间: {{ timeFormat(user.dateJoined) }}</div>
      <div class="bg-tag-primary">当前版本: {{ device.appVersion }}</div>
      <div class="bg-tag-info">语言: {{ device.clientLanguage }}</div>
      <br>
      <div class="bg-tag-gray-light">型号: {{ getUA(device.userAgent) }}</div>
      <div class="bg-tag-danger-tint" v-if="device.phoneLocation">
        手机归属地: {{ device.phoneLocation }}
      </div>
      <div class="bg-tag-warning-tint" v-if="device.carrier">
        运营商: {{ device.carrier }}
      </div>
      <div v-if="device.ipGeoLocation">IP所在地: {{ device.ipGeoLocation }}</div>
    </div>
    <div class="wrapper" ref="wrapper">
      <div class="content">
        <template v-for="(chat, index) in chats">
          <div :key="`chat-row-${index}`" :class="chat.right ? 'chat-content-row-right' : 'chat-content-row'">
            <img :class="chat.right ? 'chat-profile chat-profile-right' : 'chat-profile'" :src="chat.profilePhoto">
            <ul class="chat-content">
              <li :key="`chat-li-${index}`" v-for="(row, index) in chat.rows">地图反了</li>
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

export default {
  name: 'chat-view',
  mixins: [
    bs
  ],
  data () {
    return {
      uid: 0,
      cuid: 0,
      msg: '这里是聊天界面',
      user: {},
      device: {},
      chats: [],
      teamSpotAvatar: 'http://pic1.getremark.com/RemarkGuideAvatar.png'
    }
  },
  mounted () {
  },
  methods: {
    getUA: ua => util.spot.getUAInfo(ua),
    timeFormat: time => util.spot.formatTimestamp(time, 'yyyy-MM-dd hh:mm'),
    fetch (uid) {
      if (this.uid === uid) {
        return
      }
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
          let msgs = res.content.messages
          let currentIndex = -1
          for (var index in msgs) {
            if (msgs[index].uid !== this.cuid) {
              this.cuid = msgs[index].uid
              let isNormalUser = this.cuid === this.user.id
              this.chats.push({
                right: !isNormalUser,
                profilePhoto: isNormalUser ? this.user.profilePhoto : this.teamSpotAvatar,
                rows: [msgs[index]]
              })
              currentIndex++
            } else {
              this.chats[currentIndex].rows.push(msgs[index])
            }
          }
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
        this.msg = text

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
            // 发送消息
          })
          .catch(err => {
            this.$message.error(err)
          })
      }
    }
  }
}
</script>

<style scoped>
  .clear {
    clear:both;
  }

  .wrapper {
    height: 90%;
    overflow: scroll;
  }

  .content {
    list-style: none;
    padding: 0 25px;
  }

  .wrapper li {
    list-style-type: none;
    line-height:23px;
  }

  .chat-content {
    padding-left: 65px;
    color: rgba(0, 0, 0, 0.9);;
    font-size: 16px;
    font-weight: bold;
    text-shadow: rgba(0, 0, 0, 0.3) 2px 1px 3px;
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
    color: #ff6a00 !important;
    text-shadow: rgba(255, 106, 0, 0.3) 2px 1px 3px;
  }

  .chat-profile-right {
    right: 38px;
  }

  .chat-peek {
    width: 120px;
  }

  .chat-time {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.3);
    text-shadow: none;
  }

  .detail-user-info {
    padding: 0 10px 10px 10px;
    color: rgba(0, 0, 0, 0.5);
    font-weight: bold;
    font-size: 14px;
  }

  .detail-user-info div {
    background-color: #dff0d8;
    display: inline-block;
    margin-bottom: 5px;
    padding: 5px 10px;
    margin-right: 5px;
  }

  .bg-tag-dark {
    background-color: #343a40 !important;
    color: rgba(255, 255, 255, 0.9);
  }

  .bg-tag-important {
    background-color: #d9534f !important;
    color: rgba(255, 255, 255, 0.95);
  }

  .bg-tag-warning {
    background-color: #E6A23C !important;
    color: rgba(255, 255, 255, 0.9);
  }

  .bg-tag-primary {
    background-color: #286090 !important;
    color: rgba(255, 255, 255, 0.9);
  }

  .bg-tag-info {
    background-color: #5bc0de !important;
    color: rgba(255, 255, 255, 0.8);
  }

  .bg-tag-danger-tint {
    background-color: #f2dede !important;
  }

  .bg-tag-warning-tint {
    background-color: #fcf8e3 !important;
  }

  .bg-tag-gray-middle {
    background-color: #606266 !important;
    color: rgba(255, 255, 255, 0.9);
  }

  .bg-tag-gray-light {
    background-color: #999 !important;
    color: rgba(255, 255, 255, 0.9);
  }
</style>
