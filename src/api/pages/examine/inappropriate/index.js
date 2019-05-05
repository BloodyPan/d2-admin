import request from '@/plugin/axios'

export function Inappropriates (params) {
  return request({
    url: '/spotcms/Inappropriates',
    method: 'get',
    params: params
  })
}
