import layoutHeaderAside from '@/layout/header-aside'

const meta = {
  auth: true
}

export default {
  path: '/',
  redirect: {
    name: 'index'
  },
  component: layoutHeaderAside,
  children: [{
    path: 'taboo',
    name: 'taboo',
    meta: {
      ...meta,
      title: '关键词过滤'
    },
    component: () => import('@/pages/taboo')
  }]
}
