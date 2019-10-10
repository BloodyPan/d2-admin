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

export function RemoveCameraFilter (params) {
  return request({
    url: '/spotcms/CameraFilterEdit',
    method: 'get',
    params: params
  })
}

export function ModifyCameraFilter (data) {
  return request({
    url: '/spotcms/CameraFilterEdit',
    method: 'post',
    data: data
  })
}
