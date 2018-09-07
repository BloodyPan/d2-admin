<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    width="50%"
    :before-close="handleClose">
    <button type="button" class="el-carousel__arrow arrow-left">
      <i class="el-icon-arrow-left"></i>
    </button>
    <button type="button" class="el-carousel__arrow arrow-right">
      <i class="el-icon-arrow-right"></i>
    </button>
    <div style="padding-left: 10px;">
      <peek ref="peek" :content="content"></peek>
      <ul class="inline-block">
        <li>
          <div class="info-common user-info">
            <div class="profile-div">
              <img class="profile" src="http://ppic.getremark.com/Avatar00.jpg">
            </div>
            <div style="margin-top: 5px;">
              <span>昵称</span>
              <span class="float-right">kingoflu</span>
            </div>
            <div style="margin-top: 5px;">
              <span>用户名</span>
              <span class="float-right">o.o</span>
            </div>
          </div>
        </li>
        <li>
          <div class="info-common story-info">
            <div>
              <span>投稿时间</span>
              <span class="float-right">2018-09-06 13:14:56</span>
            </div>
          </div>
        </li>
        <li>
          <div class="info-common like-info">
            <div>
              <img class="info-icon" src="http://pic7.getremark.com/cms-dislike.png">
              <span class="info-count">1000</span>
            </div>
            <div>
              <img class="info-icon" src="http://pic7.getremark.com/cms-like.png">
              <span class="info-count">1000</span>
            </div>
            <div style="margin-top: 5px;">
              <img class="info-icon" src="http://pic7.getremark.com/cms-seen.png">
              <span class="info-count">1000</span>
            </div>
          </div>
        </li>
        <li>
          <div class="btn-div">
            <el-button type="danger">封禁</el-button>
            <el-button type="danger">删除</el-button>
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
          :total="total">
        </el-pagination>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import peek from './components/peek'

export default {
  name: 'entity-story',
  components: {
    'peek': peek
  },
  data () {
    return {
      title: '',
      visible: false,
      total: 0,
      currentPage: 1,
      currentPageSize: 1,
      /* ------------ peek 组件 -------- */
      content: {}
    }
  },
  methods: {
    handleClose (done) {
      this.$refs.peek.stopPeek()
      done()
    },
    handleCurrentChange () {
      console.log('asdasd')
    },
    fetchData (type, entityId, name) {
      this.title = name + ' 的一天'
      this.visible = true
      this.$nextTick(() => {
        this.content = {
          lid: '',
          video: 'http://npic.getremark.com/e24e594f8a02da1cd32cec866060ca9b-810cb9398bc5b554ef3ecfd76b605aad',
          photo: 'http://npic.getremark.com/1a3ab24a74e60ece764a7a815b1433ad-70b00595bc514332f1c4a7e92bcdc0bb'
        }
        this.$refs.peek.playPeek()
      })
    }
  }
}
</script>

<style scoped>
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
