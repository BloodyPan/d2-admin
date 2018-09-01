import request from '@/plugin/axios'

export function UserChatList (params) {
  return request({
    url: '/spotcms/UserChat',
    method: 'get',
    params: params
  })
}

export function FavChat (data) {
  return request({
    url: '/spotcms/FavChat',
    method: 'post',
    data: data
  })
}
