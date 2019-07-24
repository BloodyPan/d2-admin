import request from '@/plugin/axios'

export function SearchUser (params) {
  return request({
    url: '/spotcms/DataVisorUser',
    method: 'post',
    params: params
  })
}
