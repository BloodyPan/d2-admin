import cookies from './util.cookies.js'
const spot = {}

/**
 * @description 输入时间戳，并格式化输出
 */
spot.formatTimestamp = (ts, fmt) => {
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
spot.trim = text => text.replace(/(^\s*)|(\s*$)/g, '')

/**
 * @description post都要带上csrf token
 */
spot.csrfParam = () => {
  let params = new URLSearchParams()
  params.append('csrfmiddlewaretoken', cookies.get('csrftoken', false))
  return params
}

export default spot
