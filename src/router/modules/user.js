import layoutHeaderAside from '@/layout/header-aside'

const meta = {
  auth: true
}

export default {
  path: '/user',
  redirect: {
    name: 'index'
  },
  component: layoutHeaderAside,
  children: (pre => [
    {
      path: 'chat',
      name: `${pre}chat`,
      meta: { ...meta,
        title: '官方回复'
      },
      component: () => import('@/pages/user/chat')
    },
    {
      path: 'renew-user',
      name: `${pre}renew-user`,
      meta: { ...meta,
        title: '重置测试号'
      },
      component: () => import('@/pages/user/renew-user')
    },
    {
      path: 'user-locate',
      name: `${pre}user-locate`,
      meta: { ...meta,
        title: '修改定位'
      },
      component: () => import('@/pages/user/user-locate')
    }
  ])('user-')
}
