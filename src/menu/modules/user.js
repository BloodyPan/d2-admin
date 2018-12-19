export default {
  path: '/user',
  title: '用户相关',
  icon: 'user',
  children: (pre => [
    { path: `${pre}chat`, title: '官方回复', icon: 'slack' },
    { path: `${pre}renew-user`, title: '重置测试号', icon: 'refresh' }
  ])('/user/')
}
