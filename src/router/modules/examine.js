import layoutHeaderAside from '@/layout/header-aside'

const meta = {
  auth: true
}

export default {
  path: '/examine',
  redirect: {
    name: 'index'
  },
  component: layoutHeaderAside,
  children: (pre => [{
    path: 'inappropriate',
    name: `${pre}inappropriate`,
    meta: {
      ...meta,
      title: '举报详情'
    },
    component: () => import('@/pages/examine/inappropriate')
  }
  ])('examine-')
}
