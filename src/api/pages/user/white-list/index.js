import request from '@/plugin/axios'

export function WhiteListUser (params) {
  return request({
    url: '/spotcms/WhiteListUser',
    method: 'get',
    params: params
  })
}
