import request from '@/plugin/axios'

export function QiniuSign (params) {
  return request({
    url: '/spotcms/QiniuSign',
    method: 'get',
    params: params
  })
}
