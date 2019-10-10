import request from '@/plugin/axios'

export function CameraFilterList (params) {
  return request({
    url: '/spotcms/CameraFilter',
    method: 'get',
    params: params
  })
}

export function AddCameraFilter (data) {
  return request({
    url: '/spotcms/CameraFilter',
    method: 'post',
    data: data
  })
}
