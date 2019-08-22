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
  children: (pre => [
    {
      path: 'inappropriate',
      name: `${pre}inappropriate`,
      meta: {
        ...meta,
        title: '举报详情'
      },
      component: () => import('@/pages/examine/inappropriate')
    },
    {
      path: 'nickname',
      name: `${pre}nickname`,
      meta: {
        ...meta,
        title: '敏感昵称'
      },
      component: () => import('@/pages/examine/nickname')
    },
    {
      path: 'taboo',
      name: `${pre}taboo`,
      meta: {
        ...meta,
        title: '敏感词管理'
      },
      component: () => import('@/pages/examine/taboo')
    }
  ])('examine-')
}
