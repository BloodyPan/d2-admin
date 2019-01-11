export default {
  path: '/mngauth',
  title: '权限管理',
  icon: 'gears',
  children: (pre => [
    {
      path: `${pre}admin`,
      title: '用户管理',
      icon: 'users'
    }
  ])('/mngauth/')
}
