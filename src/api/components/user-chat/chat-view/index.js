import request from '@/plugin/axios'

export function GetChatMessage (params) {
  return request({
    url: '/spotcms/ChatMessage',
    method: 'get',
    params: params
  })
}

export function SendChatMessage (data) {
  return request({
    url: '/spotcms/ChatMessage',
    method: 'post',
    data: data
  })
}
