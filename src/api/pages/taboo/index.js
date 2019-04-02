import request from '@/plugin/axios'

export function GetTaboos (params) {
  return request({
    url: '/spotcms/Taboo',
    method: 'get',
    params: params
  })
}

export function AddTaboo (data) {
  return request({
    url: '/spotcms/Taboo',
    method: 'post',
    data: data
  })
}

export function RemoveTaboo (data) {
  return request({
    url: '/spotcms/Taboo',
    method: 'post',
    data: data
  })
}
