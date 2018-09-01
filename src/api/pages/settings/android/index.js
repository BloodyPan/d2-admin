import request from '@/plugin/axios'

export function GetAndroidUpdateSetting (params) {
  return request({
    url: '/spotcms/AndroidUpdateSetting',
    method: 'get',
    params: params
  })
}

export function SaveAndroidUpdateSetting (data) {
  return request({
    url: '/spotcms/AndroidUpdateSetting',
    method: 'post',
    data: data
  })
}
