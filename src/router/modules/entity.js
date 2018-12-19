import layoutHeaderAside from '@/layout/header-aside'

const meta = {
  auth: true
}

export default {
  path: '/entity',
  redirect: {
    name: 'index'
  },
  component: layoutHeaderAside,
  children: (pre => [{
    path: 'manager',
    name: `${pre}manager`,
    meta: { ...meta,
      title: '内容管理'
    },
    component: () => import('@/pages/entity/manager')
  }])('entity-')
}
