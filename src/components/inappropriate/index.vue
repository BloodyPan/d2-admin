<template>
    <div style="display: flex;justify-content: space-evenly;">
      <!-- <peek ref="peek" :content="content"></peek> -->
      <div v-if="showLoading" class="blank">
          Loading...
      </div>
      <peek ref="peek" v-else-if="showPeek" :content="content"></peek>
      <ul class="inline-block">
        <li v-if="userData.user">
          <div class="info-common user-info">
            <div class="profile-div">
              <img class="profile" :src="userData.user.profilePhoto">
            </div>
            <div style="margin-top: 5px;">
              <span>昵称</span>
              <span class="float-right">{{ userData.user.nickname }}</span>
            </div>
            <div style="margin-top: 5px;">
              <span>用户名</span>
              <span class="float-right">{{ userData.user.username }}</span>
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
            <el-button type="warning" v-if="showWarning" :loading="warnLoading" @click="warnUser(userData)">{{ warningWording }}</el-button>
            <el-button type="danger" :disabled="disBlock" :loading="blockLoading" @click="blockUser(userData)">{{ blockWording }}</el-button>
          </div>
        </li>
      </ul>
    </div>
</template>

<script>
import util from '@/libs/util.js'
import peek from '../peek'
import { FeedDetail } from '@/api/pages/feed'
import { IngoreInappropriate, FlagUser } from '@/api/pages/examine/inappropriate'

export default {
  name: 'inappropriate',
  components: {
    'peek': peek
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
      overlay: true,
      /* ------------ 基本信息 -------- */
      userData: {},
      // remarkMsg: '',
      like: 0,
      dislike: 0,
      seen: 0,
      /* ------------ Btn ----------- */
      showBtns: true,
      disBlock: false,
      disIgnore: false,
      ignoreWording: '正常并忽略',
      warningWording: '警告并标记',
      blockWording: '全网屏蔽',
      ignoreLoading: false,
      warnLoading: false,
      blockLoading: false,
      showWarning: true,
      /* ------------ 展示控件 ----------- */
      showLoading: true,
      showPeek: false,
      /* ------------ peek 组件 -------- */
      content: {}
    }
  },
  watch: {
    message: function (val) {
      this.userData = val
      this.showWarning = val.user.banLevel === 0
      this.showPanel()
    }
  },
  methods: {
    timeFormat: time => util.spot.formatTimestamp(time, 'yyyy-MM-dd hh:mm:ss'),
    getUA: ua => util.spot.getUAInfo(ua),
    handleClose (done) {
      this.$refs.peek.stopPeek()
      done()
    },
    showPanel () {
      var chatId = this.userData.chatId
      var chatItems = chatId.split('_')
      if (chatItems.length === 3) {
        this.getPeek(chatItems[1], chatItems[2])
      } else {
        this.showLoading = true
        this.showPeek = false
        this.content = {}
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
      this.$emit('close')
    },
    async warnUser (row) {
      this.warnLoading = true
      var res = await FlagUser({
        username: row.user.username,
        flag: 1
      })
      this.warnLoading = false
      this.showWarning = false
      this.$notify({
        title: res.msg,
        duration: 3000
      })
    },
    async blockUser (row) {
      this.blockLoading = true
      var res = await FlagUser({
        username: row.user.username,
        flag: 2
      })
      this.blockLoading = false
      this.$notify({
        title: res.msg,
        duration: 3000
      })
      this.$emit('close')
    },
    async getPeek (userId, feedId) {
      var res = await FeedDetail({
        user_id: userId,
        feed_id: feedId
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
    min-width: 85%;
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

  .btn-div {
    text-align: right;
    margin-top: 20px;
  }

  .blank {
      width: 200px;
      height: 400px;
      background-color: rgba(0, 0, 0, 0.1);
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: bolder;
  }
</style>