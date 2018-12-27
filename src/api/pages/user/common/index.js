import request from '@/plugin/axios'

export function SearchUser (params) {
  return request({
    url: '/spotcms/SearchUser',
    method: 'get',
    params: params
  })
}

export function UpdateLocation (data) {
  return request({
    url: '/spotcms/UpdateLocation',
    method: 'post',
    data: data
  })
}
