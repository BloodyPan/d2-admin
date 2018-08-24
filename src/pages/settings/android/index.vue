<template>
  <d2-container type="card">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="url" prop="url">
        <el-col :span="15">
          <el-input v-model="form.url"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="apkName" prop="apkName">
        <el-col :span="15">
          <el-input v-model="form.apkName"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="md5crc" prop="md5crc">
        <el-col :span="15">
          <el-input v-model="form.md5crc"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="versionName" prop="versionName">
        <el-col :span="4.5">
          <el-input v-model="form.versionName"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="versionCode" prop="versionCode">
        <el-col :span="4.5">
          <el-input-number v-model="form.versionCode" :min="1"></el-input-number>
        </el-col>
      </el-form-item>
      <el-form-item label="minCode" prop="minCode">
        <el-col :span="4.5">
          <el-input-number v-model="form.minCode" :min="1"></el-input-number>
        </el-col>
      </el-form-item>
      <el-form-item label="minSysVer" prop="minSysVer">
        <el-col :span="4.5">
          <el-input v-model="form.minSysVer"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="dbVersion" prop="dbVersion">
        <el-col :span="4.5">
          <el-input v-model="form.dbVersion"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="needUpdate">
        <el-switch v-model="form.needUpdate"></el-switch>
      </el-form-item>
      <el-form-item label="describe cn" prop="describeCN">
        <el-col :span="8">
          <el-input type="textarea" :autosize="{ minRows: 4}" v-model="form.describeCN"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="describe en" prop="describeEN">
        <el-col :span="8">
          <el-input type="textarea" :autosize="{ minRows: 4}" v-model="form.describeEN"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">立即修改</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>字段说明</span>
      </div>
      <div class="text item">
        versionName:
        <div>app 应用内的版本名字，比如 1.3.0</div>
      </div>
      <div class="text item">
        versionCode:
        <div>app 版本号，主要根据这个来判断是否升级</div>
      </div>
      <div class="text item">
        minCode:
        <div>app 版本号，小于这个版本号，app一定要升级才能正常使用</div>
      </div>
      <div class="text item">
        minSysVer:
        <div>暂时没用到</div>
      </div>
      <div class="text item">
        describe:
        <div>更新描述，分中英文</div>
      </div>
    </el-card>
  </d2-container>
</template>

<script>
import util from '@/libs/util.js'
export default {
  name: 'android',
  data () {
    return {
      form: {
        'url': 'https://s3.cn-north-1.amazonaws.com.cn/dev.android.package/',
        'apkName': 'spot_201807091000.apk',
        'md5crc': '20f62056f54e41ceda633a889432c3a4',
        'versionName': '1.2.7',
        'versionCode': 1,
        'minCode': 1,
        'minSysVer': '1',
        'dbVersion': '1',
        'needUpdate': false,
        'describeCN': 'Spot - Walkie Talkie Map\nHello world!\nNew version!',
        'describeEN': 'Spot - Walkie Talkie Map\nHello world!\nNew version!'
      },
      rules: {
        url: [
          { type: 'url', required: true, trigger: ['blur', 'change'] }
        ],
        apkName: [
          { required: true, trigger: ['blur', 'change'] }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        md5crc: [
          { required: true, trigger: ['blur', 'change'] },
          { pattern: /^[a-z0-9A-Z]+$/, trigger: ['blur', 'change'] }
        ],
        versionName: [
          { required: true, trigger: ['blur', 'change'] }
        ],
        dbVersion: [
          { required: true, trigger: ['blur', 'change'] }
        ],
        describeCN: [
          { required: true, trigger: ['blur', 'change'] }
        ],
        describeEN: [
          { required: true, trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  mounted () {
    this.$axios({
      method: 'get',
      url: 'AndroidUpdateSetting'
    })
      .then(res => {
        this.form = JSON.parse(res.msg)
      })
      .catch(err => {
        console.log(err)
      })
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = util.spot.csrfParam()
          params.append('data', JSON.stringify(this.form))
          this.$axios({
            method: 'post',
            url: 'AndroidUpdateSetting',
            data: params
          })
            .then(res => {
              this.$notify({
                title: '修改成功',
                message: '安卓版本更新配置已成功上线',
                duration: 3000
              })
            })
            .catch(err => {
              console.log(err)
            })
        } else {
          this.$message.error('表单验证未通过')
          return false
        }
      })
    },
    resetForm () {
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style scoped>
  .box-card {
    position: fixed;
    right: 40px;
    bottom: 30px;
    min-width: 30%;
  }

  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }
</style>
