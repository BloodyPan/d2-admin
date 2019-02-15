import request from '@/plugin/axios'

export function GetOperateHistory(params) {
  return request({
    url: '/spotcms/OperateHistory',
    method: 'get',
    params: params
  })
}
