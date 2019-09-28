<template>
    <div>
        <ul class="inline-block">
            <li v-if="userData.user">
            <div class="info-common user-info">
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
                    <span class="float-right">{{ userData.seenTotal }}</span>
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
                <el-button type="primary" :disabled="disBlock" :loading="blockLoading" @click="NotifyUser(userData)">{{ blockWording }}</el-button>
            </div>
            </li>
        </ul>
    </div>
</template>

<script>
import util from '@/libs/util.js'
import { InagoreInappropriateNames, NicknameNotify } from '@/api/pages/examine/inappropriate'

export default {
  name: 'ina-nickname',
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
      ignoreWording: '忽略',
      blockWording: '提醒改名',
      ignoreLoading: false,
      blockLoading: false,
      showWarning: true,
      /* ------------ 展示控件 ----------- */
      showOverlay: true,
      showLoading: true,
      showPeek: false,
      showChat: true,
      /* ------------ peek 组件 -------- */
      content: {}
    }
  },
  watch: {
    message: function (val) {
      this.userData = val
      if (val.user) {
        this.showWarning = val.user.banLevel === 0
      }
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
      this.showLoading = true
      this.ignoreLoading = false
      this.blockLoading = false
      this.showPeek = false
      this.showChat = true
    },
    msgLoaded (flag) {
      this.showPeek = false
      this.showOverlay = false
      if (flag === 0) {
        this.showLoading = true
        this.showChat = false
      } else {
        this.showLoading = false
      }
    },
    showPanel () {
    },
    async ignore (row) {
      this.ignoreLoading = true
      var res = await InagoreInappropriateNames({
        pk: row.id
      })
      this.$notify({
        title: res.msg,
        duration: 3000
      })
      this.$emit('delete', row)
    },
    async NotifyUser (row) {
      this.blockLoading = true
      var res = await NicknameNotify({
        username: row.user.username
      })
      this.blockLoading = false
      this.$notify({
        title: res.msg,
        duration: 3000
      })
      this.$emit('close')
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
    min-width: 25rem;
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
    display: inline-block;
    margin-left: 20px;
    border-radius: 5px;
    min-width: 25rem;
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
</style>
