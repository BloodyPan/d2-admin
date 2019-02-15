import layoutHeaderAside from '@/layout/header-aside'

const meta = {
  auth: true
}

export default {
  path: '/history',
  redirect: {
    name: 'index'
  },
  component: layoutHeaderAside,
  children: [
    {
      path: 'access',
      name: 'access',
      meta: {
        ...meta,
        title: '访问记录'
      },
      component: () => import('@/pages/history/access')
    },
    {
      path: 'operate',
      name: 'operate',
      meta: {
        ...meta,
        title: '操作记录'
      },
      component: () => import('@/pages/history/operate')
    }
  ]
}
