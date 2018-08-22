import Cookies from 'js-cookie'
import setting from '@/setting.js'

const cookies = {}

function GetCookieName (name, prefix) {
  return prefix ? `spot-cms-${setting.releases.version}-${name}` : name
}

/**
 * @description 存储 cookie 值
 * @param {String} name cookie name
 * @param {String} value cookie value
 * @param {Object} setting cookie setting
 */
cookies.set = function (name = 'default', value = '', cookieSetting = {}, prefix = true) {
  let currentCookieSetting = {
    expires: 1
  }
  Object.assign(currentCookieSetting, cookieSetting)
  Cookies.set(GetCookieName(name, prefix), value, currentCookieSetting)
}

/**
 * @description 拿到 cookie 值
 * @param {String} name cookie name
 */
cookies.get = function (name = 'default', prefix = true) {
  return Cookies.get(GetCookieName(name, prefix))
}

/**
 * @description 拿到 cookie 全部的值
 */
cookies.getAll = function () {
  return Cookies.get()
}

/**
 * @description 删除 cookie
 * @param {String} name cookie name
 */
cookies.remove = function (name = 'default', prefix = true) {
  // `d2admin-${setting.releases.version}-${name}`
  return Cookies.remove(GetCookieName(name, prefix))
}

export default cookies
