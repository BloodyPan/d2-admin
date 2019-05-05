import request from '@/plugin/axios'

export function ChatMessages (params) {
  return request({
    url: '/spotcms/SpotChats',
    method: 'get',
    params: params
  })
}
