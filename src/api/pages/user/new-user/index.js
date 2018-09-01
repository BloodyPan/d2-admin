import request from '@/plugin/axios'

export function NewUserList (params) {
  return request({
    url: '/spotcms/NewUserList',
    method: 'get',
    params: params
  })
}
