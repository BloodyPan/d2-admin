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

export function InagoreInappropriateNames (data) {
  return request({
    url: '/spotcms/InappropriateNames',
    method: 'post',
    data: data
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

export function NicknameNotify (data) {
  return request({
    url: '/spotcms/NicknameNotify',
    method: 'post',
    data: data
  })
}
