import request from '@/plugin/axios'

export function EntityList (params) {
  return request({
    url: '/spotcms/EntityList',
    method: 'get',
    params: params
  })
}
