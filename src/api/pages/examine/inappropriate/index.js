import request from '@/plugin/axios'

export function Inappropriates (params) {
  return request({
    url: '/spotcms/Inappropriates',
    method: 'get',
    params: params
  })
}

export function InappropriateNames (params) {
  return request({
    url: '/spotcms/InappropriateNames',
    method: 'get',
    params: params
  })
}

export function IngoreInappropriate (data) {
  return request({
    url: '/spotcms/IngoreInappropriate',
    method: 'post',
    data: data
  })
}

export function FlagUser (data) {
  return request({
    url: '/spotcms/FlagUser',
    method: 'post',
    data: data
  })
}
