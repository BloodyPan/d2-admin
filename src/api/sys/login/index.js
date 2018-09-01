import request from '@/plugin/axios'

export function AccountLogin (data) {
  return request({
    url: '/spotcms/Login',
    method: 'post',
    data: data
  })
}
