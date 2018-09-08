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

export function BanUser (data) {
  return request({
    url: '/spotcms/BanUser',
    method: 'post',
    data: data
  })
}

export function UnBlockStory (data) {
  return request({
    url: '/spotcms/UnBlockStory',
    method: 'post',
    data: data
  })
}
