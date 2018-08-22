<template>
  <div style="height: 100%; overflow: scroll;">
    <div ref="tagGroup" class="detail-user-info">
      <div class="bg-tag-important">当前好友: 1</div>
      <div class="bg-tag-warning">加入时间: 2018-07-31</div>
      <div class="bg-tag-primary">当前版本: 1.3.4.100</div>
      <div class="bg-tag-info">手机语言: zh-Hans-CN</div>
      <div>手机系统: iOS 10.0</div>
      <div class="bg-tag-gray-light">手机型号: iPhone7</div>
      <div class="bg-tag-danger-tint">手机归属地: 浙江绍兴</div>
      <div class="bg-tag-warning-tint">运营商: 移动</div>
      <div>IP所在地: Hangzhou, China</div>
    </div>
    <div ref="wrapper" class="wrapper">
      <div class="content">
        <div class="chat-content-row">
          <img class="chat-profile" src="http://pic1.getremark.com/5f658c97cbb039228719b294065e39b0-eab605d88b1355cbbb031dd11a423838">
          <ul class="chat-content">
            <li>地图反了</li>
            <li><video class="chat-peek" src="http://pic0.getremark.com/Chill-3-CN-V2" autoplay="autoplay" onclick="this.play();"></video></li>
          </ul>
        </div>
        <div class="chat-content-row-right">
          <img class="chat-profile chat-profile-right" src="http://pic1.getremark.com/RemarkGuideAvatar.png">
          <ul class="chat-content">
            <li>亲地图反了是什么意思呢～</li>
            <li>{{ msg }}</li>
            <li>{{ msg }}</li>
          </ul>
        </div>
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
      msg: '这里是聊天界面'
    }
  },
  methods: {
    fetch (uid) {
      this.uid = uid
      util.log.capsule('ChatView-Fetch', uid, 'danger')
    },
    send (text) {
      if (this.uid !== 0) {
        util.log.capsule('ChatView-Content', text, 'danger')
        this.msg = text
      }
    }
  }
}
</script>

<style scoped>
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

  .bg-tag-important {
    background-color: #d9534f !important;
    color: white;
  }

  .bg-tag-warning {
    background-color: #f0ad4e !important;
    color: white;
  }

  .bg-tag-primary {
    background-color: #286090 !important;
    color: white;
  }

  .bg-tag-info {
    background-color: #5bc0de !important;
    color: white;
  }

  .bg-tag-danger-tint {
    background-color: #f2dede !important;
  }

  .bg-tag-warning-tint {
    background-color: #fcf8e3 !important;
  }

  .bg-tag-gray-light {
    background-color: #999 !important;
    color: rgba(255, 255, 255, 0.9);
  }
</style>
