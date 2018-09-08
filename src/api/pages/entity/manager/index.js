import request from '@/plugin/axios'

export function EntityList (params) {
  return request({
    url: '/spotcms/EntityList',
    method: 'get',
    params: params
  })
}

export function EntityFeed (params) {
  return request({
    url: '/spotcms/EntityFeed',
    method: 'get',
    params: params
  })
}

export function DelEntityStory (data) {
  return request({
    url: '/spotcms/EntityFeed',
    method: 'post',
    data: data
  })
}
