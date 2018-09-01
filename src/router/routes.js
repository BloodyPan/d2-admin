// layout
import layoutHeaderAside from '@/layout/header-aside'

const meta = { requiresAuth: true }

/**
 * 首页路由
 */
const index = {
  path: '/',
  redirect: { name: 'index' },
  component: layoutHeaderAside,
  children: [
    {
      path: 'index',
      name: 'index',
      meta,
      component: () => import('@/pages/index')
    }
  ]
}

/**
 * 用户相关模块路由
 */
const userRouter = {
  path: '/user',
  redirect: { name: 'index' },
  component: layoutHeaderAside,
  children: (pre => [
    {
      path: 'chat',
      name: `${pre}chat`,
      meta: { ...meta, title: '官方回复' },
      component: () => import('@/pages/user/chat')
    },
    {
      path: 'new-user',
      name: `${pre}new-user`,
      meta: { ...meta, title: '新注册用户' },
      component: () => import('@/pages/user/new-user')
    },
    {
      path: 'renew-user',
      name: `${pre}renew-user`,
      meta: { ...meta, title: '重置测试号' },
      component: () => import('@/pages/user/renew-user')
    }
  ])('user-')
}

/**
 * 线上设置
 */
const settings = {
  path: '/settings',
  redirect: { name: 'index' },
  component: layoutHeaderAside,
  children: (pre => [
    {
      path: 'android',
      name: `${pre}android`,
      meta: { ...meta, title: '安卓更新' },
      component: () => import('@/pages/settings/android')
    }
  ])('')
}

/**
 * 在主框架内显示
 */
const frameIn = [
  index,
  userRouter,
  settings
]

/**
 * 在主框架之外显示
 */
const frameOut = [
  // 登录
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/login')
  }
]

/**
 * 错误页面
 */
const errorPage = [
  // 404
  {
    path: '*',
    name: '404',
    component: () => import('@/pages/error-page-404')
  }
]

// 导出需要显示菜单的
export const frameInRoutes = frameIn

// 重新组织后导出
export default [
  ...frameIn,
  ...frameOut,
  ...errorPage
]
