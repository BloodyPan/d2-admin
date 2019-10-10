import layoutHeaderAside from '@/layout/header-aside'

const meta = {
  auth: true
}

export default {
  path: '/settings',
  redirect: {
    name: 'index'
  },
  component: layoutHeaderAside,
  children: (pre => [{
    path: 'android',
    name: `${pre}android`,
    meta: { ...meta,
      title: '安卓更新'
    },
    component: () => import('@/pages/settings/android')
  }, {
    path: 'camera-filters',
    name: `${pre}camera-filters`,
    meta: {
      ...meta,
      title: '滤镜配置'
    },
    component: () => import('@/pages/settings/camera-filters')
  }])('')
}
