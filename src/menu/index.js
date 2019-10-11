// user相关
import userModule from './modules/user'
import settings from './modules/settings'
import operate from './modules/operate'
import examine from './modules/examine'

// 菜单 侧边栏
export const menuAside = [
  examine,
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
  examine,
  userModule,
  settings,
  operate
]
