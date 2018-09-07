// user相关
import userModule from './modules/user-module'
import settings from './modules/settings'
import entity from './modules/entity-manager'

// 菜单 侧边栏
export const menuAside = [
  userModule,
  entity,
  settings
]

// 菜单 顶栏
export const menuHeader = [
  {
    path: '/index',
    title: '首页',
    icon: 'home'
  },
  userModule,
  entity,
  settings
]
