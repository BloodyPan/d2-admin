import Vue from 'vue'
import { Message } from 'element-ui'
import axios from 'axios'
import util from '@/libs/util'

axios.defaults.baseURL = 'http://api.remark.works/spotcms/'
axios.defaults.crossDomain = true
axios.defaults.withCredentials = true

axios.interceptors.response.use(res => {
  if (res.data.code !== undefined) {
    if (res.data.code === 403) {
      // 403 验证错误, 删除登录信息
      util.cookies.remove('sessionid', false)
      util.cookies.remove('csrftoken', false)
      util.cookies.remove('uuid')
      location.href = "/"

      return res.data
    }
    else if (res.data.code !== 200) {
      Message.error(res.data.msg)
      return Promise.reject(res.data.msg)
    } else {
      return res.data
    }
  } else {
    return res.data
  }
}, err => {
  Message.error('请求接口异常！')
  return Promise.reject(err)
})

Vue.prototype.$axios = axios
