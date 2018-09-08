<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    width="50%"
    :before-close="handleClose">
    <div v-if="overlay" class="overlay">没有新的内容了</div>
    <button type="button" v-if="!overlay" class="el-carousel__arrow arrow-left" @click="prePage">
      <i class="el-icon-arrow-left"></i>
    </button>
    <button type="button" v-if="!overlay" class="el-carousel__arrow arrow-right" @click="nextPage">
      <i class="el-icon-arrow-right"></i>
    </button>
    <div style="padding-left: 10px;">
      <peek ref="peek" :content="content"></peek>
      <ul class="inline-block">
        <li>
          <div class="info-common user-info">
            <div class="profile-div">
              <img class="profile" :src="profilePhoto">
            </div>
            <div style="margin-top: 5px;">
              <span>昵称</span>
              <span class="float-right">{{ nickname }}</span>
            </div>
            <div style="margin-top: 5px;">
              <span>用户名</span>
              <span class="float-right">{{ username }}</span>
            </div>
          </div>
        </li>
        <li>
          <div class="info-common story-info">
            <div>
              <span>投稿时间</span>
              <span class="float-right">{{ timeFormat(remarkTime) }}</span>
            </div>
            <div>
              <span>Caption</span>
              <span class="float-right">{{ remarkMsg }}</span>
            </div>
          </div>
        </li>
        <li>
          <div class="info-common like-info">
            <div>
              <img class="info-icon" src="http://pic7.getremark.com/cms-dislike.png">
              <span class="info-count">{{ dislike }}</span>
            </div>
            <div>
              <img class="info-icon" src="http://pic7.getremark.com/cms-like.png">
              <span class="info-count">{{ like }}</span>
            </div>
            <div style="margin-top: 5px;">
              <img class="info-icon" src="http://pic7.getremark.com/cms-seen.png">
              <span class="info-count">{{ seen }}</span>
            </div>
          </div>
        </li>
        <li>
          <div class="btn-div">
            <el-button type="primary" v-if="blocked" :loading="unblockLoading" @click="unblock">{{ blockWording }}</el-button>
            <el-button type="danger" :loading="banLoading" @click="banUser">{{ banWording }}</el-button>
            <el-button type="danger" :disabled="disDel" :loading="delLoading" @click="delStory">{{ delWording }}</el-button>
          </div>
        </li>
      </ul>
      <div class="pagination">
        <el-pagination
          ref="userPagination"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="currentPageSize"
          background
          layout="total, prev, pager, next"
          :total="total">
        </el-pagination>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import util from '@/libs/util.js'
import peek from './components/peek'
import { EntityFeed, DelEntityStory, BanUser, UnBlockStory } from '@/api/pages/entity/manager'

export default {
  name: 'entity-story',
  components: {
    'peek': peek
  },
  data () {
    return {
      title: '',
      visible: false,
      overlay: true,
      /* ------------ 分页相关 -------- */
      total: 0,
      limit: 5,
      lid: '0',
      blocked: 0,
      currentPage: 1,
      lastCorrectPage: 1,
      currentPageSize: 1,
      /* ------------ 接口数据 -------- */
      entityId: '',
      datas: [],
      moreData: true,
      /* ------------ 基本信息 -------- */
      nickname: '',
      username: '',
      profilePhoto: '',
      banLevel: 0,
      remarkTime: 0,
      remarkMsg: '',
      like: 0,
      dislike: 0,
      seen: 0,
      /* ------------ Btn ----------- */
      disDel: false,
      disUnblock: false,
      banWording: '禁言',
      delWording: '删除',
      blockWording: '正常并忽略',
      banLoading: false,
      delLoading: false,
      unblockLoading: false,
      /* ------------ peek 组件 -------- */
      content: {}
    }
  },
  methods: {
    timeFormat: time => util.spot.formatTimestamp(time, 'yyyy-MM-dd hh:mm'),
    handleClose (done) {
      this.$refs.peek.stopPeek()
      done()
    },
    prePage () {
      let page = this.currentPage - 1
      if (page > 0) {
        this.currentPage = page
        this.handleCurrentChange()
      }
    },
    nextPage () {
      let page = this.currentPage + 1
      if (page <= this.total) {
        this.currentPage = page
        this.handleCurrentChange()
      }
    },
    handleCurrentChange () {
      let dataIndex = this.currentPage - 1
      if (dataIndex > this.datas.length * 0.5) {
        this.requestMoreFeedDatas()
      }
      if (dataIndex >= this.datas.length) {
        this.currentPage = this.lastCorrectPage + 1
        dataIndex = this.lastCorrectPage
      }
      if (this.datas.length > 0 && this.currentPage <= this.datas.length) {
        this.btnWordingHandler()
        let remark = this.datas[dataIndex]
        util.cookies.set('entity_lid_' + this.entityId + '_' + this.blocked, remark.id)
        this.lastCorrectPage = this.currentPage

        this.lid = remark.id
        this.username = remark.actor.username
        this.nickname = remark.actor.nickname
        this.profilePhoto = remark.actor.profilePhoto
        this.banLevel = remark.actor.banLevel
        this.remarkTime = remark.time
        this.remarkMsg = remark.message
        this.like = remark.like
        this.dislike = remark.dislike
        this.seen = remark.seen

        this.$nextTick(() => {
          let content = {}
          if (remark.type === 0) {
            content = {
              video: '',
              photo: remark.picture
            }
          } else {
            content = {
              video: remark.video,
              photo: remark.doodle
            }
          }
          this.content = content
          this.$refs.peek.playPeek()
        })
      }
    },
    fetchData (blocked, entityId, name) {
      if (entityId !== this.entityId || blocked !== this.blocked) {
        this.total = 0
        this.datas = []
        this.currentPage = 1
        this.handleCurrentChange()
      }
      this.title = name + ' 的一天'
      this.blocked = blocked
      this.entityId = entityId
      this.currentPage = 1

      let cookieLid = util.cookies.get('entity_lid_' + this.entityId + '_' + this.blocked)
      this.lid = cookieLid === void 0 ? this.lid : cookieLid
      this.visible = true
      this.requestFeedDatas()
    },
    async requestFeedDatas () {
      const res = await EntityFeed({
        lid: this.lid,
        limit: this.limit,
        blocked: this.blocked,
        entity_id: this.entityId,
        first_fetch: 1
      })
      let apiDatas = res.content
      this.total = apiDatas.total
      if (this.total > 0) {
        this.datas = apiDatas.remarks
        this.moreData = apiDatas.moreData
        this.handleCurrentChange()
      }
      this.overlay = this.total === 0
    },
    async requestMoreFeedDatas () {
      if (this.moreData) {
        const res = await EntityFeed({
          lid: this.datas[this.datas.length - 1].id,
          limit: this.limit,
          blocked: this.blocked,
          entity_id: this.entityId
        })

        let apiDatas = res.content
        this.datas = this.datas.concat(apiDatas.remarks)
        this.moreData = apiDatas.moreData
      }
    },
    async banUser () {
      let blockFlag = this.datas[this.currentPage - 1].actor.banLevel === 0 ? 1 : 0
      this.banLoading = true
      await BanUser({
        username: this.username,
        block: blockFlag
      })
      this.banLoading = false
      this.banLevel = true
      this.datas[this.currentPage - 1].actor.banLevel = blockFlag
      this.btnWordingHandler()
    },
    async delStory () {
      this.delLoading = true
      await DelEntityStory({
        rid: this.lid,
        username: this.username,
        entity_id: this.entityId
      })
      this.delLoading = false
      this.datas[this.currentPage - 1].delFlag = true
      this.btnWordingHandler()
    },
    async unblock () {
      this.unblockLoading = true
      await UnBlockStory({
        rid: this.lid,
        username: this.username,
        entity_id: this.entityId
      })
      this.unblockLoading = false
      this.datas[this.currentPage - 1].unblock = true
      this.btnWordingHandler()
    },
    btnWordingHandler () {
      this.delBtnWording()
      this.banBtnWording()
      this.unblockBtnWording()
    },
    banBtnWording () {
      let banLevel = this.datas[this.currentPage - 1].actor.banLevel
      if (banLevel === 1) {
        this.banWording = '解禁'
      } else {
        this.banWording = '禁言'
      }
    },
    delBtnWording () {
      let delFlag = this.datas[this.currentPage - 1].delFlag
      if (delFlag) {
        this.disDel = true
        this.delWording = '已删除'
      } else {
        this.disDel = false
        this.delWording = '删除'
      }
    },
    unblockBtnWording () {
      let unblock = this.datas[this.currentPage - 1].unblock
      if (unblock) {
        this.disUnblock = true
        this.unblockWording = '已处理'
      } else {
        this.disUnblock = false
        this.unblockWording = '正常并忽略'
      }
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
    width: 85%;
    font-size: 16px;
    font-weight: bold;
  }

  .user-info {
    background-color: #eafae1;
    color: rgba(0, 0, 0, 0.6);
  }

  .like-info {
    background-color: rgb(250, 214, 160);
    margin-top: 15px;
    padding: 15px 20px 5px 20px;
    color: rgba(0, 0, 0, 0.5);
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

  .pagination {
    margin-top: 10px;
  }
</style>
