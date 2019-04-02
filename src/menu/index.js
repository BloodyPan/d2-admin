// user相关
import userModule from './modules/user'
import settings from './modules/settings'
import operate from './modules/operate'
import group from './modules/group'

// 菜单 侧边栏
export const menuAside = [
  group,
  userModule,
  settings,
  operate
]

// 菜单 顶栏
export const menuHeader = [
  {
    path: '/index',
    title: '首页',
    icon: 'home'
  },
  group,
  userModule,
  settings,
  operate
]
