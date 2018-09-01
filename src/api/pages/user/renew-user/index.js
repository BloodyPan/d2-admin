import request from '@/plugin/axios'

export function ResetUserList (params) {
  return request({
    url: '/spotcms/ResetUser',
    method: 'get',
    params: params
  })
}

export function ResetUser (data) {
  return request({
    url: '/spotcms/ResetUser',
    method: 'post',
    data: data
  })
}

export function DelTestUser (data) {
  return request({
    url: '/spotcms/DelTestUser',
    method: 'post',
    data: data
  })
}
