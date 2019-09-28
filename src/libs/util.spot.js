import cookies from './util.cookies.js'
const spot = {}

spot.spotHelperId = 3287
spot.mediaPrefix = 'http://npic.getremark.com/'
spot.profilePrefix = 'http://ppic.getremark.com/'

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
 * @description 判断浏览器
 */
spot.checkUA = ua => {
  let u = ua
  return {
    // IE内核
    trident: u.indexOf('Trident') > -1,
    // opera内核
    presto: u.indexOf('Presto') > -1,
    // 苹果、谷歌内核
    webKit: u.indexOf('AppleWebKit') > -1,
    // 火狐内核
    gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') === -1,
    mobile: !!u.match(/AppleWebKit.*Mobile.*/),
    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
    Android: u.indexOf('Android') > -1 || u.indexOf('android') > -1 || u.indexOf('Linux') > -1,
    // 是否为iPhone或者QQHD浏览器
    iPhone: u.indexOf('iPhone') > -1,
    // 是否iPad
    iPad: u.indexOf('iPad') > -1,
    mac: u.indexOf('Macintosh') > -1,
    spot: u.indexOf('Spot') > -1,
    snapchat: u.indexOf('Snapchat') > -1,
    // 是否web程序，没有头部与底部
    webApp: u.indexOf('Safari') === -1,
    iPhone5: u.indexOf('iPhone5,1') > -1 || u.indexOf('iPhone5,2') > -1,
    iPhone5C: u.indexOf('iPhone5,3') > -1 || u.indexOf('iPhone5,4') > -1,
    iPhone5S: u.indexOf('iPhone6,1') > -1 || u.indexOf('iPhone6,2') > -1,
    iPhone6: u.indexOf('iPhone7,2') > -1,
    iPhone6P: u.indexOf('iPhone7,1') > -1,
    iPhone6S: u.indexOf('iPhone8,1') > -1,
    iPhone6SP: u.indexOf('iPhone8,2') > -1,
    iPhone7: u.indexOf('iPhone9,1') > -1 || u.indexOf('iPhone9,3') > -1,
    iPhone7P: u.indexOf('iPhone9,2') > -1 || u.indexOf('iPhone9,4') > -1,
    iPhone8: u.indexOf('iPhone10,1') > -1 || u.indexOf('iPhone10,4') > -1,
    iPhone8P: u.indexOf('iPhone10,2') > -1 || u.indexOf('iPhone10,5') > -1,
    iPhoneX: u.indexOf('iPhone10,3') > -1 || u.indexOf('iPhone10,6') > -1,
    iPhoneXR: u.indexOf('iPhone11,8') > -1,
    iPhoneXS: u.indexOf('iPhone11,2') > -1,
    iPhoneXSMax: u.indexOf('iPhone11,4') > -1 || u.indexOf('iPhone11,6') > -1,
    iPhone11: u.indexOf('iPhone12,1') > -1,
    iPhone11Pro: u.indexOf('iPhone12,3') > -1,
    iPhone11ProMax: u.indexOf('iPhone12,5') > -1
  }
}

/**
 * @description 转成用户友好的UA信息
 * @example
 *  "Spot/1.3.3 (iPhone5,1; iOS 11.0.1; Scale/2.00)"
 *  "Spot/1.3.3 (H8166; android8.0.0; Scale/2.625)"
 */
spot.getUAInfo = ua => {
  let result = /.*? \((.*?); (.*?); .*/g.exec(ua)
  if (result === null) {
    return '未知'
  }
  let uaInfo = spot.checkUA(ua)
  let phoneInfo = result[1]
  let osInfo = result[2]
  if (uaInfo.Android) {
    osInfo = osInfo.replace(/android/g, 'Android ')
    return `${phoneInfo}; ${osInfo}`
  } else if (uaInfo.iPhone) {
    let phoneList = ['5', '5S', '6', '6P', '6S', '6SP', '7', '7P', '8', '8P', 'X']
    for (var index in phoneList) {
      if (uaInfo['iPhone' + phoneList[index]]) {
        phoneInfo = 'iPhone' + phoneList[index].replace(/P/g, ' Plus')
      }
    }
  }
  return `${phoneInfo}; ${osInfo}`
}

/**
 * @description 去空格
 */
spot.trim = text => text.replace(/(^\s*)|(\s*$)/g, '')

/**
 * @description 清除登录相关的cookie
 */
spot.flushAccount = () => {
  cookies.remove('sessionid', false)
  cookies.remove('csrftoken', false)
  cookies.remove('uuid')
}

spot.getHttpProfileUrl = (photo, suffix) => {
  if (photo.indexOf('http') === -1) {
    photo = spot.profilePrefix + photo
  }

  if (photo.indexOf('getremark.com') !== -1 && suffix !== undefined) {
    photo += '!' + suffix
  }
  return photo
}

export default spot
