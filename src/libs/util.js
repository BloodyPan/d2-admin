import Cookies from 'js-cookie'
// import axios from 'axios'
// import semver from 'semver'
import UaParser from 'ua-parser-js'
import { version } from '../../package.json'

let util = {
  cookies: {},
  log: {}
}

/**
 * @description 存储 cookie 值
 * @param {String} name cookie name
 * @param {String} value cookie value
 * @param {Object} setting cookie setting
 */
util.cookies.set = function (name = 'default', value = '', setting = {}, prefix = true) {
  let cookieSetting = {
    expires: 1
  }
  let cookieName = prefix ? `spot-cms-${version}-${name}` : name
  Object.assign(cookieSetting, setting)
  Cookies.set(cookieName, value, cookieSetting)
}

/**
 * @description 拿到 cookie 值
 * @param {String} name cookie name
 */
util.cookies.get = function (name = 'default', prefix = true) {
  let cookieName = prefix ? `spot-cms-${version}-${name}` : name
  return Cookies.get(cookieName)
}

/**
 * @description 拿到 cookie 全部的值
 */
util.cookies.getAll = function () {
  return Cookies.get()
}

/**
 * @description 删除 cookie
 * @param {String} name cookie name
 */
util.cookies.remove = function (name = 'default', prefix = true) {
  let cookieName = prefix ? `spot-cms-${version}-${name}` : name
  return Cookies.remove(cookieName)
}

/**
 * @description 更新标题
 * @param {String} title 标题
 */
util.title = function (titleText) {
  window.document.title = `${process.env.VUE_APP_TITLE}${titleText ? ` | ${titleText}` : ''}`
}

/**
 * @description 获取所有的 UA 信息
 */
util.ua = function () {
  return new UaParser().getResult()
}

/**
 * @description 判断是否在其内
 * @param {*} ele element
 * @param {Array} targetArr array
 */
util.isOneOf = function (ele, targetArr) {
  if (targetArr.indexOf(ele) >= 0) {
    return true
  } else {
    return false
  }
}

/**
 * @description 返回这个样式的颜色值
 * @param {String} type 样式名称 [ primary | success | warning | danger | text ]
 */
util.typeColor = function (type = 'default') {
  let color = ''
  switch (type) {
    case 'default': color = '35495E'; break
    case 'primary': color = '#3488ff'; break
    case 'success': color = '#43B883'; break
    case 'warning': color = '#e6a23c'; break
    case 'danger': color = '#f56c6c'; break
    default:; break
  }
  return color
}

/**
 * @description 打印一个 “胶囊” 样式的信息
 * @param {String} title title text
 * @param {String} info info text
 * @param {String} type style
 */
util.log.capsule = function (title, info, type = 'primary') {
  console.log(
    `%c ${title} %c ${info} %c`,
    'background:#35495E; padding: 1px; border-radius: 3px 0 0 3px; color: #fff;',
    `background:${util.typeColor(type)}; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff;`,
    'background:transparent'
  )
}

/**
 * @description 打印彩色文字
 */
util.log.colorful = function (textArr) {
  console.log(
    `%c ${textArr.map(t => t.text).join(' %c ')}`,
    ...textArr.map(t => `color: ${util.typeColor(t.type)};`)
  )
}

/**
 * @description 打印 primary 样式的文字
 */
util.log.primary = function (text) {
  util.log.colorful([{ text, type: 'primary' }])
}

/**
 * @description 打印 success 样式的文字
 */
util.log.success = function (text) {
  util.log.colorful([{ text, type: 'success' }])
}

/**
 * @description 打印 warning 样式的文字
 */
util.log.warning = function (text) {
  util.log.colorful([{ text, type: 'warning' }])
}

/**
 * @description 打印 danger 样式的文字
 */
util.log.danger = function (text) {
  util.log.colorful([{ text, type: 'danger' }])
}

/**
 * @description 输入时间戳，并格式化输出
 */
util.formatTimestamp = (ts, fmt) => {
  if (ts.toString().length === 10) {
    ts *= 1000
  }

  let date = new Date(ts)
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    'S': date.getMilliseconds()
  }

  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }

  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}

/**
 * @description 去空格
 */
util.trim = text => text.replace(/(^\s*)|(\s*$)/g, '')

/**
 * @description post都要带上csrf token
 */
util.csrfParam = () => {
  let params = new URLSearchParams()
  params.append('csrfmiddlewaretoken', util.cookies.get('csrftoken', false))
  return params
}

export default util
