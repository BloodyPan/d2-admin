<template>
  <div style="overflow: scroll; height: 100%;">
    <div class="search">
      <el-input size="mini" placeholder="查找用户" v-model="inputSearch" class="input-with-select">
        <el-select size="mini" v-model="selectSearch" slot="prepend" placeholder="请选择">
          <el-option label="用户名" value="1"></el-option>
          <el-option label="手机号" value="2"></el-option>
        </el-select>
        <el-button size="mini" slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </div>
    <div class="wrapper" ref="wrapper">
      <ul class="content">
        <li :key="index" @click="showChat($event, index)" class="user-list-li" v-for="(chat, index) in listData">
          <el-badge :hidden="chat.unread == 0" :value="chat.unread" class="item">
            <img :src="chat.user.profilePhoto">
          </el-badge>
          <ul class="user-list-msg-ul">
            <li>{{ chat.user.username }}</li>
            <li class="small-font-size short-msg-view">{{ preview(chat.message.message) }}</li>
          </ul>
          <ul class="user-list-right-ul">
            <li class="small-font-size">{{ timeFormat(chat.message.createdAt) }}</li>
            <li>
              <d2-icon-svg
                @clickicon="clickicon"
                :index="index"
                class="star-fav"
                :name="chat.favFlag ? 'star-fav' : 'star-unfav'"/>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import util from '@/libs/util.spot.js'
import bs from '@/components/common/bs'

export default {
  name: 'user-list',
  mixins: [
    bs
  ],
  data () {
    return {
      listData: [],
      total: 0,
      currentPage: 1,
      currentPageSize: 200,
      selectSearch: '1',
      inputSearch: '',
      selectedChat: null,
      freshData: false
    }
  },
  mounted () {
    this.fetchData()
    this.BS.on('scroll', (pos) => {
      // 滚动条滚到95%的地方开始拉新数据
      if (this.BS.maxScrollY * 0.9 > pos.y) {
        if (this.freshData === false) {
          this.freshData = true
          this.currentPage += 1
          this.fetchData()
        }
      }
    })
  },
  methods: {
    timeFormat: time => util.formatTimestamp(time, 'yyyy-MM-dd hh:mm'),
    preview: text => text.slice(0, 12) + '...',
    fetchData () {
      let offset = (this.currentPage - 1) * this.currentPageSize
      if (offset > this.total) {
        return
      }
      this.$axios({
        method: 'get',
        url: 'UserChat',
        params: {
          limit: this.currentPageSize,
          offset: offset
        }
      })
        .then(res => {
          this.total = res.content.total
          this.listData = this.listData.concat(res.content.chats)
          this.$nextTick(() => {
            this.BS.refresh()
            this.freshData = false
          })
        })
        .catch(err => {
          this.$message.error(err)
        })
    },
    showChat (event, index) {
      this.listData[index].unread = 0
      if (this.selectedChat != null) {
        this.selectedChat.style.backgroundColor = 'white'
      }
      event.currentTarget.style.backgroundColor = '#E5E5E5'
      this.selectedChat = event.currentTarget
      this.$emit('showChat', this.listData[index].user.id)

      let params = util.csrfParam()
      params.append('uid', this.listData[index].user.id)
      this.$axios({
        method: 'post',
        url: 'UserChat',
        data: params
      })
        .then(res => {
        })
        .catch(err => {
          this.$message.error(err)
        })
    },
    clickicon (event) {
      let index = event.currentTarget.getAttribute('index')
      this.listData[index].favFlag = !this.listData[index].favFlag
      event.stopPropagation()
      let params = util.csrfParam()
      params.append('uid', this.listData[index].user.id)
      params.append('fav', this.listData[index].favFlag ? 1 : 0)
      this.$axios({
        method: 'post',
        url: 'FavChat',
        data: params
      })
        .then(res => {
          let isFav = this.listData[index].favFlag
          let title = '与 ' + this.listData[index].user.username
          title += isFav ? ' 的聊天已加入收藏' : ' 的聊天已从收藏中移除'
          this.$notify({
            title: title,
            message: '',
            duration: 2000
          })
        })
        .catch(err => {
          this.$message.error(err)
        })
    }
  }
}
</script>

<style scoped>
  .search{
    margin-bottom: 3px;
  }

  ul {
    display: block;
    list-style-type: disc;
    -webkit-margin-before: 0;
    -webkit-margin-after: 0;
    -webkit-margin-start: 0;
    -webkit-margin-end: 0;
    -webkit-padding-start: 0;
  }

  .wrapper{
    height: 90%;
    overflow: scroll;
  }

  .content{
    list-style: none;
  }

  .user-list-li{
    height: 60px;
    border-bottom: 1px solid #979797;
    display: flex;
    align-items: center;
    padding: 0 5px;
    cursor: pointer;
  }

  .small-font-size {
    color: #808080;
    letter-spacing: normal;
    word-spacing: normal;
    vertical-align: top;
    font-size: 12px;
  }

  .user-list-li img {
    border-radius: 50%;
    width: 32px;
  }

  .user-list-msg-ul {
    margin-left: 18px;
    list-style: none;
  }

  .short-msg-view {
    margin-top: 2px;
  }

  .user-list-right-ul {
    list-style: none;
    position: absolute;
    right: 10px;
    text-align: right;
  }

  .star-fav {
    width: 18px;
    height: 18px;
    margin-top: 5px;
  }
</style>
