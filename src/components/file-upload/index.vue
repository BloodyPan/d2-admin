<template>
  <el-upload
    class="upload-demo"
    :action="domain"
    :data="QiniuData"
    :limit="1"
    :before-upload="beforeUpload"
    :before-remove="beforeRemove"
    :on-error="handleError"
    :on-success="handleUploadSuccess"
    accept="image/jpeg,image/png,application/zip"
    list-type="picture">
    <el-button size="small" type="primary">点击上传</el-button>
  </el-upload>
</template>

<script>
import { QiniuSign } from '@/api/common/qiniu'
import util from '@/libs/util.js'
export default {
  name: 'file-upload',
  //   props: {
  //     name: {
  //       type: String,
  //       required: true
  //     }
  //   },
  data () {
    return {
      QiniuData: {
        key: '',
        token: ''
      },
      domain: 'http://up.qiniu.com'
    }
  },
  mounted () {
    this.getQiniuToken()
  },
  methods: {
    beforeUpload (file) {
      this.getQiniuToken()
      this.QiniuData.key = file.name
    },
    beforeRemove (file) {
      this.$emit('remove')
    },
    handleUploadSuccess (res, file) {
      this.$emit('success', file.name)
    //   console.log(res)
    },
    handleError (err, file, fileList) {
      this.$notify({
        title: err,
        duration: 3000
      })
    },
    async getQiniuToken () {
      const tokenKey = 'qiniu_remark_token'

      const qiniuToken = util.cookies.get(tokenKey)
      if (qiniuToken === void 0) {
        const res = await QiniuSign({
          query: 'remark'
        })
        const setting = {
          expires: 0.02
        }
        util.cookies.set(tokenKey, res.msg, setting)
        this.QiniuData.token = res.msg
      } else {
        this.QiniuData.token = qiniuToken
      }
    }
  }
}
</script>
