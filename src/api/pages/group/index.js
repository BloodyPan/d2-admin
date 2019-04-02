import request from '@/plugin/axios'

export function GroupList (params) {
  return request({
    url: '/spotcms/Group',
    method: 'get',
    params: params
  })
}

export function CreateGroup (data) {
  return request({
    url: '/spotcms/Group',
    method: 'post',
    data: data
  })
}
