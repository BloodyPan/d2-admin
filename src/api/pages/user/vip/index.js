import request from '@/plugin/axios'

export function VipUserList (params) {
  return request({
    url: '/spotcms/VipUser',
    method: 'get',
    params: params
  })
}
