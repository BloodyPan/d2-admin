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
      path: 'nicknames',
      name: `${pre}nicknames`,
      meta: {
        ...meta,
        title: '敏感昵称'
      },
      component: () => import('@/pages/examine/nicknames')
    },
    {
      path: 'profiles',
      name: `${pre}profiles`,
      meta: {
        ...meta,
        title: '用户增量信息'
      },
      component: () => import('@/pages/examine/profiles')
    },
    {
      path: 'nukes',
      name: `${pre}nukes`,
      meta: {
        ...meta,
        title: '核弹列表'
      },
      component: () => import('@/pages/examine/nukes')
    },
    {
      path: 'chat',
      name: `${pre}chat`,
      meta: {
        ...meta,
        title: '敏感聊天'
      },
      component: () => import('@/pages/examine/chats')
    },
    {
      path: 'music',
      name: `${pre}music`,
      meta: {
        ...meta,
        title: '音乐表情包'
      },
      component: () => import('@/pages/examine/music')
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
