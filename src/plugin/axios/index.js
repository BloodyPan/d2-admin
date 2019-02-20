import store from '@/store'
import router from '@/router'
import axios from 'axios'
import Qs from 'qs'
import { Message } from 'element-ui'
import util from '@/libs/util'

function logout () {
  util.spot.flushAccount()
  Message({
    message: '登陆信息已过期,请重新登陆!',
    type: 'error',
    duration: 3 * 1000
  })
  setTimeout(() => {
    router.push({
      name: 'login'
    })
  }, 1000)
}

// 创建一个错误
function errorCreat (msg) {
  const err = new Error(msg)
  errorLog(err)
  throw err
}

// 警告
function warnCreat (msg) {
  const warn = new Error(msg)
  // 打印到控制台
  if (process.env.NODE_ENV === 'development') {
    util.log.warning('>>>>>> Warn >>>>>>')
    console.log(warn)
  }
  // 显示提示
  Message({
    message: warn.message,
    type: 'warning',
    duration: 5 * 1000
  })
}

// 记录和显示错误
function errorLog (err) {
  // 添加到日志
  store.dispatch('d2admin/log/add', {
    type: 'error',
    err,
    info: '数据请求异常'
  })
  // 打印到控制台
  if (process.env.NODE_ENV === 'development') {
    util.log.danger('>>>>>> Error >>>>>>')
    console.log(err)
  }
  // 显示提示
  Message({
    message: err.message,
    type: 'error',
    duration: 5 * 1000
  })
}

// 创建一个 axios 实例
const service = axios.create({
  baseURL: process.env.VUE_APP_API,
  crossDomain: true,
  withCredentials: true,
  timeout: 5000
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 在请求发送之前做一些处理
    if (!(/^https:\/\/|http:\/\//.test(config.url))) {
      if (config.method === 'post') {
        // POST dict 转 URLSearchParams
        // let params = new URLSearchParams()
        // for (let key in config.data) {
        //   params.append(key, config.data[key])
        // }
        // URLSearchParams不兼容ie, 改用Qs
        config.data = Qs.stringify(config.data)
        // POST统一设置 X-CSRFTOKEN 头
        let csrftoken = util.cookies.get('csrftoken', false)
        if (csrftoken !== void 0) {
          config.headers['X-CSRFTOKEN'] = csrftoken
        }
      }
    }
    return config
  },
  error => {
    // 发送失败
    console.log(error)
    Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    // dataAxios 是 axios 返回数据中的 data
    const dataAxios = response.data
    // 后端返回的状态码
    const { code } = dataAxios
    if (code === undefined) {
      return dataAxios
    } else {
      switch (code) {
        case 200:
          return dataAxios
        case 202:
          warnCreat(`${dataAxios.msg}`)
          break
        case 204:
          warnCreat(`${dataAxios.msg}`)
          break
        case 403:
          logout()
          errorCreat(`Code ${code}: ${dataAxios.msg}`)
          break
        default:
          // 不是正确的 code
          // errorCreat(`${dataAxios.msg}: ${response.config.url}`)
          errorCreat(`${dataAxios.msg}`)
          break
      }
    }
  },
  error => {
    // TODO: 现在拿不到error.response;
    if (error && error.response) {
      switch (error.response.status) {
        case 400: error.message = '请求错误'; break
        case 401: error.message = '未授权，请登录'; break
        case 403: error.message = '拒绝访问'; break
        case 404: error.message = `请求地址出错: ${error.response.config.url}`; break
        case 408: error.message = '请求超时'; break
        case 500: error.message = '服务器内部错误'; break
        case 501: error.message = '服务未实现'; break
        case 502: error.message = '网关错误'; break
        case 503: error.message = '服务不可用'; break
        case 504: error.message = '网关超时'; break
        case 505: error.message = 'HTTP版本不受支持'; break
        default: break
      }
    }
    errorLog(error)
    return Promise.reject(error)
  }
)

export default service
