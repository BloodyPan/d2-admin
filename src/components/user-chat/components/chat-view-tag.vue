<template>
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
</template>

<script>
import util from '@/libs/util.js'
export default {
  name: 'chat-view-tag',
  props: {
    user: {
      type: Object,
      required: false,
      default: () => ({})
    },
    device: {
      type: Object,
      required: false,
      default: () => ({})
    }
  },
  data () {
    return {
      tag: null
    }
  },
  methods: {
    getUA: ua => util.spot.getUAInfo(ua),
    timeFormat: time => util.spot.formatTimestamp(time, 'yyyy-MM-dd hh:mm')
  }
}
</script>

<style scoped>
  .detail-user-info {
    padding: 0 10px 10px 10px;
    color: rgba(0, 0, 0, 0.5);
    font-weight: bold;
    font-size: 14px;
    overflow: scroll;
    white-space: nowrap;
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
