import request from '@/plugin/axios'

export function FeedDetail (params) {
  return request({
    url: '/spotcms/FeedDetail',
    method: 'get',
    params: params
  })
}
