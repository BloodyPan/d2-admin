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

export function UnblockUser (data) {
  return request({
    url: '/spotcms/UnblockUser',
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

export function BlockPublicStatus (data) {
  return request({
    url: '/spotcms/BlockPublicStatus',
    method: 'post',
    data: data
  })
}

export function Nuke (data) {
  return request({
    url: '/spotcms/Nuke',
    method: 'post',
    data: data
  })
}

export function ExaminationOk (data) {
  return request({
    url: '/spotcms/ExaminationOk',
    method: 'post',
    data: data
  })
}

export function Examination (params) {
  return request({
    url: '/spotcms/Examination',
    method: 'get',
    params: params
  })
}

export function AutoNuke (params) {
  return request({
    url: '/spotcms/AutoNuke',
    method: 'get',
    params: params
  })
}

export function DeleteNuke (data) {
  return request({
    url: '/spotcms/AutoNuke',
    method: 'post',
    data: data
  })
}

export function InappropriateSongs (params) {
  return request({
    url: '/spotcms/InappropriateSongs',
    method: 'get',
    params: params
  })
}

export function CheckInappropriateSongs (data) {
  return request({
    url: '/spotcms/InappropriateSongs',
    method: 'post',
    data: data
  })
}
