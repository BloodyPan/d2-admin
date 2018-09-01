import request from '@/plugin/axios'

export function GetQuickReply (params) {
  return request({
    url: '/spotcms/QuickReply',
    method: 'get',
    params: params
  })
}

export function AddQuickReply (data) {
  return request({
    url: '/spotcms/QuickReply',
    method: 'post',
    data: data
  })
}

export function DelQuickReply (data) {
  return request({
    url: '/spotcms/DelQuickReply',
    method: 'post',
    data: data
  })
}
