<template>
  <div style="overflow: scroll; height: 100%;">
  <div class="search">
    <el-input placeholder="查找用户" v-model="inputSearch" class="input-with-select">
      <el-select v-model="selectSearch" slot="prepend" placeholder="请选择">
        <el-option label="用户名" value="1"></el-option>
        <el-option label="手机号" value="2"></el-option>
      </el-select>
      <el-button slot="append" icon="el-icon-search"></el-button>
    </el-input>
  </div>
  <div class="wrapper" ref="wrapper">
    <ul class="content">
      <li @click="showChat(index)" class="user-list-li" v-for="(user, index) in listData">
        <el-badge :value="user.chat.unread ? user.chat.unread : ''" class="item">
          <img :src="user.profilePhoto">
        </el-badge>
        <ul class="user-list-msg-ul">
          <li>{{ user.nickname }}</li>
          <li class="small-font-size short-msg-view">{{ preview(user.chat.message.message) }}</li>
        </ul>
        <ul class="user-list-right-ul">
          <li class="small-font-size">{{ timeFormat(user.chat.message.createdAt) }}</li>
          <li>
            <d2-icon-svg
              @clickicon="clickicon"
              :index="index"
              class="star-fav"
              :name="user.chat.favFlag ? 'star-fav' : 'star-unfav'"/>
          </li>
        </ul>
      </li>
    </ul>
  </div>
  </div>
</template>

<script>
	import util from '@/libs/util.js'
	import bs from '@/components/common/bs'

  export default {
    name: "user-list",
    mixins:[
    	bs
    ],
    data() {
    	return {
				listData: [],
				total: 0,
				currentPage: 1,
				currentPageSize: 150,
				selectSearch: '1',
				inputSearch: ''
      }
    },
		mounted() {
			this.$axios({
				method: 'get',
				url: 'ChatUserList',
				params: {
					limit: this.currentPageSize,
					offset: (this.currentPage - 1) * this.currentPageSize
				}
			})
				.then(res => {
					this.listData = res.users.persons
				})
				.catch(err => {
					this.$message.error(err)
				})
		},
		methods: {
			timeFormat: time => util.formatTimestamp(time, "yyyy-MM-dd hh:mm"),
			preview: text => text.slice(0,12) + '...',
			showChat(index) {
				console.log(index)
      },
			clickicon(event) {
				let index = event.currentTarget.getAttribute("index")
        this.listData[index].chat.favFlag = !this.listData[index].chat.favFlag
				event.stopPropagation();
			}
    }
  }
</script>

<style scoped>
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

  .user-list-li img{
    border-radius: 50%;
    width: 32px;
  }

  .user-list-msg-ul{
    margin-left: 18px;
    list-style: none;
  }

  .short-msg-view{
    margin-top: 2px;
  }

  .user-list-right-ul{
    list-style: none;
    position: absolute;
    right: 10px;
    text-align: right;
  }

  .star-fav{
    width: 18px;
    height: 18px;
    margin-top: 5px;
  }
</style>