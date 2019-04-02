import layoutHeaderAside from '@/layout/header-aside'

const meta = {
  auth: true
}

export default {
  path: '/group',
  redirect: {
    name: 'index'
  },
  component: layoutHeaderAside,
  children: (pre => [{
    path: 'create',
    name: `${pre}create`,
    meta: {
      ...meta,
      title: '圈子生成'
    },
    component: () => import('@/pages/group/create')
  }
  ])('group-')
}
